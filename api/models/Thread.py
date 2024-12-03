from pydantic import BaseModel, model_validator
from datetime import datetime, timezone
from helpers.helper import generate_thread_id
from typing import Optional, List
from models import User
from models.Reply import (
    Reply
)
from models.dto.ThreadDto import (
    ThreadEditDto
)

class Thread(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    author_id: int
    tags: List[str]
    upvotes: List[int] = []
    replies: List[Reply] = []  
    created_at: Optional[datetime] = None

    @model_validator(mode="before")
    def set_defaults(cls, values):
        if 'id' not in values:
            values['id'] = generate_thread_id()
        if 'created_at' not in values:
            values['created_at'] = datetime.now(timezone.utc)
        if 'upvotes' not in values:
            values['upvotes'] = []
        if 'replies' not in values:
            values['replies'] = [] 
        return values
    
    async def save_to_db(self, db):
        thread_dict = self.model_dump(exclude_unset=True)
        thread_dict.pop('_id', None)
        await db.threads.insert_one(thread_dict)
        self.id = thread_dict['id']
        return self
    
    async def update_in_db(self, db, threadEditDto: ThreadEditDto):
        thread_dict = self.model_dump(exclude_unset=True)
        thread_dict['title'] = threadEditDto.title
        thread_dict['content'] = threadEditDto.content
        await db.threads.update_one({"id": id}, {"$set": thread_dict})
        return self
    
    async def delete_from_db(self, db):
        await db.threads.delete_one({"id": id})

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }