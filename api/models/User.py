from pydantic import BaseModel, model_validator
from datetime import datetime, timezone
from helpers.helper import generate_id, get_ip_address, hash_ip
from typing import Optional, List
from models.dto.ReplyDto import ReplyUserDto

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password: str
    profile_picture: Optional[str] = None
    initial_ip: Optional[str] = None
    created_threads: List[int] = []
    created_replies: List[ReplyUserDto] = []
    created_at: Optional[datetime] = None

    @model_validator(mode="before")
    def set_defaults(cls, values):
        if 'id' not in values:
            values['id'] = generate_id()
        if 'created_at' not in values:
            values['created_at'] = datetime.now(timezone.utc)
        if 'initial_ip' not in values:
            values['initial_ip'] = hash_ip(get_ip_address())
        if 'profile_picture' not in values:
            values['profile_picture'] = None
        if 'created_threads' not in values:
            values['created_threads'] = []
        if 'created_replies' not in values:
            values['created_replies'] = []
        return values
    
    async def save_to_db(self, db):
        user_dict = self.model_dump(exclude_unset=True)
        user_dict.pop('_id', None)
        await db.users.insert_one(user_dict)
        self.id = user_dict['id']
        self.profile_picture = None
        return self

    async def sync(self, db):
        user_dict = self.model_dump(exclude_unset=True)
        await db.users.update_one({"id": user_dict['id']}, {"$set": user_dict})
        return self
    
    def get_reply(self, reply_id: int) -> ReplyUserDto | None:
        for c in self.created_replies:
            if c.id == reply_id: return c
        return None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }