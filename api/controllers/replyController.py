from fastapi import APIRouter, Depends, Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from models.dto.ReplyDto import (
    ReplyDto,
    ReplyEditDto,
    ReplyCreateDto,
    ReplyUserDto,
    UserResponseDto
)
from models.Thread import Thread
from typing import Annotated
from services.userService import (
    get_authorization_header,
    get_current_user
)

reply_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]

def get_thread_collection(db: AsyncIOMotorClient):
    return db["threads"]

@reply_router.post("/create", response_model=ReplyDto)
async def create_reply(reply: ReplyCreateDto, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread = await get_thread_collection(db).find_one({"id": reply.parent_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread)
    actual_reply = ReplyDto(**reply.model_dump())
    actual_reply.author_id = user.id
    actual_thread.replies.append(actual_reply)
    user.created_replies.append(ReplyUserDto(id=actual_reply.id, parent_id=reply.parent_id))
    await actual_thread.sync(db)
    await user.sync(db)
    actual_reply.author = UserResponseDto(**user.model_dump())
    return actual_reply

@reply_router.patch("/update", response_model=ReplyDto)
async def update_reply(thread_id: int, reply_id:int, reply: ReplyEditDto, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread_element)
    actual_reply = actual_thread.get_reply(reply_id)
    if not actual_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    if actual_reply.author_id != user.id:
        raise HTTPException(status_code=401, detail="You are not author of that reply")
    actual_reply.content = reply.content
    await actual_thread.sync(db)
    actual_reply.author = UserResponseDto(**user.model_dump())
    return actual_reply

@reply_router.delete("/delete", response_model=dict)
async def delete_reply(thread_id: int, reply_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread_element)
    actual_reply = actual_thread.get_reply(reply_id)
    user_reply = user.get_reply(reply_id)
    if not actual_reply or not user_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    if actual_reply.author_id != user.id:
        raise HTTPException(status_code=401, detail="You are not author of that reply")
    actual_thread.replies.remove(actual_reply)
    user.created_replies.remove(user_reply)
    await user.sync(db)
    await actual_thread.sync(db)
    return {"message": "Reply deleted successfully"}

@reply_router.post("/upvote", response_model=dict)
async def upvote_reply(thread_id: int, reply_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread_element)
    actual_reply = actual_thread.get_reply(reply_id)
    if not actual_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    if user.id in actual_reply.upvotes:
        raise HTTPException(status_code=409, detail="You've already upvoted that reply")
    
    author_element = await db.users.find_one({"id": actual_reply.author_id})
    if not author_element:
        raise HTTPException(status_code=409, detail="Reply author not found")

    response = "NEUTRAL"
    if user.id in actual_reply.downvotes: actual_reply.downvotes.remove(user.id)
    else: 
        response = "SUCCESS"
        actual_reply.upvotes.append(user.id)
    await actual_thread.sync(db)
    actual_reply.author = UserResponseDto(**author_element)
    return {"response": response, "reply": actual_reply.model_dump(exclude_unset=True)}

@reply_router.post("/downvote", response_model=dict)
async def downvote_reply(thread_id: int, reply_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread_element = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread_element:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread_element)
    actual_reply = actual_thread.get_reply(reply_id)
    if not actual_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    if user.id in actual_reply.downvotes:
        raise HTTPException(status_code=409, detail="You've already downvoted that reply")
    
    author_element = await db.users.find_one({"id": actual_reply.author_id})
    if not author_element:
        raise HTTPException(status_code=409, detail="Reply author not found")
    
    response = "NEUTRAL"
    if user.id in actual_reply.upvotes: actual_reply.upvotes.remove(user.id)
    else: 
        response = "SUCCESS"
        actual_reply.downvotes.append(user.id)
    await actual_thread.sync(db)
    actual_reply.author = UserResponseDto(**author_element)
    return {"response": response, "reply": actual_reply.model_dump(exclude_unset=True)}
