from pydantic import BaseModel
from models.dto.AuthDto import (
    UserResponseDto
)
from typing import List
from datetime import datetime

class ReplyThreadDto(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    tags: List[str]
    upvotes: List[int] 
    downvotes: List[int]
    created_at: datetime

class ReplyDto(BaseModel):
    parent: ReplyThreadDto
    author: UserResponseDto
    content: str
    upvotes: List[int]
    downvotes: List[int]
    created_at: datetime