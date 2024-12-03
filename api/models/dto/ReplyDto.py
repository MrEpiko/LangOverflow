from pydantic import BaseModel, model_validator
from models.dto.AuthDto import (
    UserResponseDto
)
from typing import List, Optional
from datetime import datetime, timezone

class ReplyCreateDto(BaseModel):
    parent_id: int
    content: str
    author_id: int

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
    parent: Optional[ReplyThreadDto] = None
    author: Optional[UserResponseDto] = None
    content: str
    upvotes: List[int]
    downvotes: List[int]
    created_at: datetime

    @model_validator(mode="before")
    def set_defaults(cls, values):
        if 'created_at' not in values:
            values['created_at'] = datetime.now(timezone.utc)
        if 'upvotes' not in values:
            values['upvotes'] = []
        if 'downvotes' not in values:
            values['downvotes'] = []
        if 'parent' not in values:
            values['parent'] = None
        if 'author' not in values:
            values['author'] = None
        return values