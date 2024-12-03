from fastapi import APIRouter, Depends, Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from models.dto.ReplyDto import (
    ReplyDto,
    ReplyThreadDto,
    ReplyCreateDto
)
from models.Thread import Thread
from typing import Annotated
from services.authService import (
    get_authorization_header,
    get_current_user
)

reply_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]

@reply_router.post("/create", response_model=ReplyDto)
async def post_reply(reply: ReplyCreateDto, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token, db)
    thread = await db.threads.find_one({"id": reply.parent_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    actual_thread = Thread(**thread)
    actual_reply = ReplyDto(**reply.model_dump())
    actual_reply.author = user
    actual_reply.parent = ReplyThreadDto(**thread.model_dump())
    actual_thread.replies.append(actual_reply)
    return actual_reply
