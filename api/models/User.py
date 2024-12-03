from pydantic import BaseModel, model_validator
from datetime import datetime, timezone
from helpers.helper import generate_user_id, get_ip_address, hash_ip
from typing import Optional, List
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password: str
    profile_picture: Optional[str] = None
    initial_ip: Optional[str] = None
    created_threads: List[int] = []
    created_at: Optional[datetime] = None

    @model_validator(mode="before")
    def set_defaults(cls, values):
        if 'id' not in values:
            values['id'] = generate_user_id()
        if 'created_at' not in values:
            values['created_at'] = datetime.now(timezone.utc)
        if 'initial_ip' not in values:
            values['initial_ip'] = hash_ip(get_ip_address())
        if 'profile_picture' not in values:
            values['profile_picture'] = None
        return values
    
    async def save_to_db(self, db):
        user_dict = self.model_dump(exclude_unset=True)
        user_dict.pop('_id', None)
        await db.users.insert_one(user_dict)
        self.id = user_dict['id']
        self.profile_picture = None
        return self

    async def sync(self, db):
        await db.users.update_one({"id": id}, {"$set": self.model_dump(exclude_unset=True)})
        return self
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }