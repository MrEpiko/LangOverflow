from fastapi import APIRouter, Depends, Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from models.dto.ThreadDto import (
    ThreadCreateDto,
    ThreadEditDto
)
from models.Thread import Thread
from typing import Annotated
from services.authService import (
    get_authorization_header,
    get_current_user
)

reply_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]


