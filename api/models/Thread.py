from pydantic import BaseModel, model_validator
from datetime import datetime, timezone
from helpers.helper import generate_id
from typing import Optional, List
from models.dto.ReplyDto import (
    ReplyDto,
    ReplyEditDto
)

class Thread(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    author_id: Optional[int]
    tags: List[str]
    upvotes: List[int] = []
    downvotes: List[int] = []
    replies: List[ReplyDto] = []  
    created_at: Optional[datetime] = None

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
        if 'replies' not in values:
            values['replies'] = [] 
        if 'author_id' not in values:
            values['author_id'] = 0
        return values
    
    async def save_to_db(self, db):
        thread_dict = self.model_dump(exclude_unset=True)
        thread_dict.pop('_id', None)
        await db.threads.insert_one(thread_dict)
        self.id = thread_dict['id']
        return self
    
    async def delete_from_db(self, db):
        await db.threads.delete_one({"id": self.model_dump(exclude_unset=True)['id']})

    async def sync(self, db):
        thread_dict = self.model_dump(exclude_unset=True)
        await db.threads.update_one({"id": thread_dict['id']}, {"$set": thread_dict})
        return self
    
    def get_reply(self, reply_id: int) -> ReplyDto:
        for r in self.replies:
            if r.id == reply_id: return r
        return None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }