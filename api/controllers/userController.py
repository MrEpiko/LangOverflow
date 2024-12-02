from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from config.db import get_database
from typing import Annotated, List
from models.User import User
from helpers.helper import get_password_hash

user_router = APIRouter()
db_dependency = Annotated[AsyncIOMotorClient, Depends(get_database)]

def get_user_collection(db: AsyncIOMotorClient):
    return db["users"]

@user_router.get("/", response_model=List[User])
async def get_users(db: db_dependency):
    users = []
    async for user in get_user_collection(db).find():
        users.append(User(**user))
    return users

@user_router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, db: db_dependency):
    user = await get_user_collection(db).find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.post("/", response_model=User)
async def create_user(user: User, db: db_dependency):
    user.password = get_password_hash(user.password) 
    user_dict = dict(user)
    result = await get_user_collection(db).insert_one(user_dict)
    user_dict["id"] = int(result.inserted_id)
    return user_dict

@user_router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user: User, db: db_dependency):
    user_dict = dict(user)
    result = await get_user_collection(db).update_one(
        {"id": user_id}, {"$set": user_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    user_dict["id"] = user_id
    return user_dict

@user_router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: int, db: db_dependency):
    result = await get_user_collection(db).delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}