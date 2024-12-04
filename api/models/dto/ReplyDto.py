from pydantic import BaseModel, model_validator
from typing import List, Optional
from datetime import datetime, timezone
from helpers.helper import generate_id

class ReplyCreateDto(BaseModel):
    parent_id: int
    content: str

class ReplyUserDto(BaseModel):
    id: int
    parent_id: int

class ReplyThreadDto(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    tags: List[str]
    upvotes: List[int] 
    downvotes: List[int]
    created_at: datetime

class ReplyEditDto(BaseModel):
    content: str

class ReplyDto(BaseModel):
    id: Optional[int] = None
    parent_id: Optional[int] = None
    author_id: Optional[int] = None
    content: str
    upvotes: List[int]
    downvotes: List[int]
    created_at: datetime

    @model_validator(mode="before")
    def set_defaults(cls, values):
        if 'id' not in values:
            values['id'] = generate_id()
        if 'created_at' not in values:
            values['created_at'] = datetime.now(timezone.utc)
        if 'upvotes' not in values:
            values['upvotes'] = []
        if 'downvotes' not in values:
            values['downvotes'] = []
        if 'parent_id' not in values:
            values['parent_id'] = None
        if 'author_id' not in values:
            values['author_id'] = None
        return values