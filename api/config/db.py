from motor.motor_asyncio import AsyncIOMotorClient
from typing import AsyncGenerator
from dotenv import load_dotenv
import os
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "")
DATABASE = os.getenv("DATABASE", "")
async def get_database() -> AsyncGenerator:
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE]
    try:
        yield db
    finally:
        client.close()