from fastapi import APIRouter, Depends, Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from models.dto.ThreadDto import (
    ThreadCreateDto,
    ThreadEditDto
)
from models.Thread import Thread
from typing import Annotated, Optional
from services.authService import (
    get_authorization_header,
    get_current_user
)

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
    thread.author_id = user.id
    new_thread = Thread(**thread.model_dump())
    await new_thread.save_to_db(db)
    return new_thread

@thread_router.get("/{thread_id}", response_model=Thread)
async def get_thread(thread_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    thread = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread

@thread_router.patch("/{thread_id}", response_model=Thread)
async def update_thread(thread_id: int, thread: ThreadEditDto, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    if user.id != thread.author_id:
        raise HTTPException(status_code=401, detail="You are not author of that thread")
    updated_thread = thread.update_in_db(db, thread)
    return updated_thread

@thread_router.delete("/{thread_id}", response=dict)
async def delete_thread(thread_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread = await get_thread_collection(db).find_one({"id": thread_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    if user.id != thread.author_id:
        raise HTTPException(status_code=401, detail="You are not author of that thread")
    thread.delete_from_db()
    return {"message": "Thread deleted successfully"}