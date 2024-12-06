from fastapi import APIRouter, Depends, Request, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from models.dto.ThreadDto import (
    ThreadCreateDto,
    ThreadEditDto,
    ThreadSearchDto
)
from models.Thread import Thread
from typing import Annotated, List
from services.userService import (
    get_authorization_header,
    get_current_user
)
from models.dto.UserDto import (
    UserResponseDto
)
from math import ceil

thread_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]

def get_thread_collection(db: AsyncIOMotorClient):
    return db["threads"]

@thread_router.post("/create", response_model=Thread)
async def create_thread(thread: ThreadCreateDto, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    lowercase_tags = []
    for t in thread.tags: lowercase_tags.append(t.lower())
    new_thread = Thread(**thread.model_dump())
    new_thread.tags = lowercase_tags
    new_thread.author_id = user.id
    await new_thread.save_to_db(db)
    user.created_threads.append(new_thread.id)
    await user.sync(db)
    new_thread.author = UserResponseDto(**user.model_dump())
    return new_thread

@thread_router.get("/{thread_id}", response_model=Thread)
async def get_thread(thread_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    thread = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread)
    author_element = await db.users.find_one({"id": actual_thread.author_id})
    if not author_element:
        actual_thread.author = None
    else:
        actual_thread.author = UserResponseDto(**author_element)
        for r in actual_thread.replies:
            user_element = await db.users.find_one({"id": r.author_id})
            if not user_element: r.author = None
            else: r.author = UserResponseDto(**user_element)
    return actual_thread

@thread_router.patch("/{thread_id}", response_model=Thread)
async def update_thread(thread_id: int, thread: ThreadEditDto, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread_element)
    if user.id != actual_thread.author_id:
        raise HTTPException(status_code=401, detail="You are not author of that thread")
    actual_thread.title = thread.title
    actual_thread.content = thread.content
    await actual_thread.sync(db)
    actual_thread.author = UserResponseDto(**user.model_dump())
    return actual_thread

@thread_router.delete("/{thread_id}", response_model=dict)
async def delete_thread(thread_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread)
    if user.id != actual_thread.author_id:
        raise HTTPException(status_code=401, detail="You are not author of that thread")
    user.created_threads.remove(thread_id)
    await actual_thread.delete_from_db(db)
    await user.sync(db)
    return {"message": "Thread deleted successfully"}

@thread_router.post("/upvote", response_model=dict)
async def upvote_thread(thread_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    thread = Thread(**thread_element)
    if user.id in thread.upvotes:
        raise HTTPException(status_code=409, detail="You've already upvoted that thread")
    
    author_element = await db.users.find_one({"id": thread.author_id})
    if not author_element: thread.author = None
    else: thread.author = UserResponseDto(**author_element)
    
    response = "NEUTRAL"
    if user.id in thread.downvotes: thread.downvotes.remove(user.id)
    else: 
        response = "SUCCESS"
        thread.upvotes.append(user.id)
    await thread.sync(db)
    return {"response": response, "thread": thread.model_dump(exclude_unset=True)}

@thread_router.post("/downvote", response_model=dict)
async def downvote_thread(thread_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    thread = Thread(**thread_element)
    if user.id in thread.downvotes:
        raise HTTPException(status_code=409, detail="You've already downvoted that thread")
    
    author_element = await db.users.find_one({"id": thread.author_id})
    if not author_element: thread.author = None
    else: thread.author = UserResponseDto(**author_element)

    response = "NEUTRAL"
    if user.id in thread.upvotes: thread.upvotes.remove(user.id)
    else: 
        response = "SUCCESS"
        thread.downvotes.append(user.id)
    await thread.sync(db)
    return {"response": response, "thread": thread.model_dump(exclude_unset=True)}

@thread_router.post("/search", response_model=dict)
async def search(tags: ThreadSearchDto, request: Request, db: db_dependency, page: int = Query(1, ge=1), limit: int = Query(10, ge=1)):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    
    tags = tags.tags
    lowercase_tags = []
    for t in tags: lowercase_tags.append(t.lower())
    any_tags_cursor = db.threads.find({"tags": {"$in": lowercase_tags}})
    threads = []
    async for thread in any_tags_cursor:
        threads.append(thread)
    
    scored_threads = []
    for thread in threads:
        match_score = len(set(thread["tags"]).intersection(tags)) 
        scored_threads.append((thread, match_score))
    
    scored_threads.sort(key=lambda x: x[1], reverse=True)
    total_threads = len(scored_threads)
    total_pages = ceil(total_threads / limit)
    if page > total_pages and total_threads > 0:
        raise HTTPException(status_code=404, detail="Page not found")
    
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_threads = scored_threads[start_index:end_index]
    threads_output = []
    for thread, _ in paginated_threads:
        t = Thread(**thread)
        author_element = await db.users.find_one({"id": t.author_id})
        if author_element: t.author = UserResponseDto(**author_element)
        else: t.author = None
        threads_output.append(t)

    return {
        "threads": threads_output,
        "page": page,
        "total_pages": total_pages,
        "total_threads": total_threads
    }


@thread_router.post("/random", response_model=List[Thread])
async def get_random_threads(request: Request, db: db_dependency, limit: int = Query(10, ge=1)):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    
    total = await get_thread_collection(db).count_documents({})
    if limit > total:
        raise HTTPException(status_code=400, detail="Limit is greater than amount of threads")
    
    threads = []
    async for t in get_thread_collection(db).aggregate([{'$sample': {'size': limit}}]):
        t = Thread(**t)
        author_element = await db.users.find_one({"id": t.author_id})
        if author_element: t.author = UserResponseDto(**author_element)
        else: t.author = None
        threads.append(t)
    return threads
