from pydantic import BaseModel, model_validator
from datetime import datetime, timezone
from helpers.helper import generate_user_id, get_ip_address, hash_ip
from typing import Optional
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password: str
    initial_ip: Optional[str] = None
    created_at: Optional[datetime] = None

    @model_validator(mode="before")
    def set_defaults(cls, values):
        if 'id' not in values:
            values['id'] = generate_user_id()
        if 'created_at' not in values:
            values['created_at'] = datetime.now(timezone.utc)
        if 'initial_ip' not in values:
            values['initial_ip'] = hash_ip(get_ip_address())
        return values
    
    async def save_to_db(self, db):
        user_dict = self.model_dump(exclude_unset=True)
        user_dict.pop('_id', None)
        await db.users.insert_one(user_dict)
        self.id = user_dict['id']
        return self
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }