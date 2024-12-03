from pydantic import BaseModel
from models.User import (
    User
)
from typing import List

class ThreadCreateDto(BaseModel):
    title: str
    content: str
    author_id: int
    tags: List[str]

class ThreadEditDto(BaseModel):
    title: str
    content: str