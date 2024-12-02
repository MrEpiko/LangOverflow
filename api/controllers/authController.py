from fastapi import APIRouter, Depends, Request, HTTPException
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
from helpers.helper import get_password_hash, validate_email
from models.Token import Token
from models.User import User
from typing import Annotated, Optional

auth_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]

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
    return UserResponseDto(id=user.id, username=user.username, email=user.email)