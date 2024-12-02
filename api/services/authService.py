from fastapi import Depends, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from helpers.helper import verify_password
from models.Token import TokenData
from models.User import User
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", default="")
ALGORITHM = os.getenv("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", default=1))

db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]

def get_user_collection(db: AsyncIOMotorClient):
    return db["users"]

def generate_access_token(credential) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"sub": credential, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_authorization_header(request: Request) -> str | bool:
    authorization: Optional[str] = request.headers.get("Authorization")
    if authorization:
        token_type, _, token = authorization.partition(" ")
        if token_type.lower() == "bearer":
            return token
    return False

async def authenticate_user(email: str, password: str, db: db_dependency) -> User | bool:
    user = await get_user_collection(db).find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return False
    return User(**user)

async def get_current_user(token: str, db: db_dependency) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = await get_user_collection(db).find_one({"email": token_data.email})
    if not user:
        raise credentials_exception
    return User(**user)