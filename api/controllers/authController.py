from math import ceil
from fastapi import APIRouter, Depends, Request, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from services.authService import (
    get_user_collection,
    get_current_user,
    generate_access_token,
    authenticate_user,
    get_authorization_header,
)
from models.dto.AuthDto import (
    UserLoginDto,
    UserRegisterDto,
    UserResponseDto,
)
from models.Thread import Thread
from helpers.helper import get_password_hash, validate_email
from models.Token import Token
from models.User import User
from typing import Annotated, Optional, List
import httpx
import os

auth_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]
GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL", "")

@auth_router.post("/login", response_model=Token)
async def login(user: UserLoginDto, db: db_dependency):
    if not validate_email(user.email) or len(user.password) < 5:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    db_user = await authenticate_user(user.email, user.password, db)
    if not db_user:
        raise HTTPException(status_code=404, detail="Incorrect email or password")
    access_token = generate_access_token(db_user.email)
    return Token(access_token=access_token, token_type="bearer")

@auth_router.post("/register", response_model=Token)
async def register(user: UserRegisterDto, db: db_dependency):
    if not validate_email(user.email) or len(user.password) < 5 or len(user.username) < 3:
        raise HTTPException(status_code=400, detail="Invalid username, email or password")
    db_user = await get_user_collection(db).find_one({"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    user.password = get_password_hash(user.password)
    new_user = User(**user.model_dump())
    await new_user.save_to_db(db)
    access_token = generate_access_token(new_user.email)
    return Token(access_token=access_token, token_type="bearer")

@auth_router.get("/me", response_model=UserResponseDto)
async def auth_user(request: Request, db: db_dependency, access_token: Optional[str] = None):
    authorization_token = get_authorization_header(request)
    if not authorization_token and not access_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_current_user(authorization_token or access_token, db)
    return UserResponseDto(id=user.id, username=user.username, email=user.email, profile_picture=user.profile_picture)

@auth_router.post("/google", response_model=Token)
async def google_login(token: dict, db: db_dependency):
    id_token = token.get("token")
    if not id_token:
        raise HTTPException(status_code=400, detail="No token provided")
    async with httpx.AsyncClient() as client:
        response = await client.get(GOOGLE_TOKEN_URL + id_token)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        google_user_info = response.json()
        email = google_user_info.get("email")
        username = google_user_info.get("name")
        profile_picture = google_user_info.get("picture")
        if not email or not validate_email(email):
            raise HTTPException(status_code=400, detail="Invalid email from Google")
        db_user = await get_user_collection(db).find_one({"email": email})
        if not db_user:
            new_user = User(
                email=email,
                username=username,
                profile_picture=profile_picture,
                password=get_password_hash("default_google")
            )
            await new_user.save_to_db(db)
            access_token = generate_access_token(new_user.email)
            return Token(access_token=access_token, token_type="bearer")
        access_token = generate_access_token(db_user["email"])
        return Token(access_token=access_token, token_type="bearer")

@auth_router.get("/{user_id}", response_model=UserResponseDto)
async def get_user(user_id: int, request: Request, db: db_dependency):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_user_collection(db).find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponseDto(id=user.id, username=user.username, email=user.email, profile_picture=user.profile_picture)

@auth_router.get("/{user_id}/threads", response_model=List[Thread])
async def get_user(user_id: int, request: Request, db: db_dependency, page: int = Query(1, ge=1), limit: int = Query(10, ge=1)):
    authorization_token = get_authorization_header(request)
    if not authorization_token:
        raise HTTPException(status_code=401, detail="Authorization missing")
    user = await get_user_collection(db).find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    actual_user = User(**user)
    threads = []
    for i in actual_user.created_threads:
        thread = await db.threads.find_one({"id": i})
        if thread:
            threads.append(thread)

    total_threads = len(threads)
    total_pages = ceil(total_threads / limit)
    if page > total_pages and total_threads > 0:
        raise HTTPException(status_code=404, detail="Page not found")
    start_index = (page - 1) * limit
    end_index = start_index + limit

    return {
        "threads": threads[start_index:end_index],
        "page": page,
        "total_pages": total_pages,
        "total_threads": total_threads
    }