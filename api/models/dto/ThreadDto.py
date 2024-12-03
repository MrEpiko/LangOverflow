from pydantic import BaseModel
from typing import List
from datetime import datetime
from models.dto.ReplyDto import (
    ReplyDto
)

class ThreadCreateDto(BaseModel):
    title: str
    content: str
    author_id: int
    tags: List[str]

class ThreadEditDto(BaseModel):
    title: str
    content: str

class ThreadDto(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    tags: List[str]
    upvotes: List[int] 
    downvotes: List[int]
    replies: List[ReplyDto] 
    created_at: datetime