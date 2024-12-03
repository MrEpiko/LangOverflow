from pydantic import BaseModel
from models.Thread import (
    Thread
)
from models.User import (
       User
)
from typing import List
from datetime import datetime

class Reply(BaseModel):
    parent: Thread
    author: User
    content: str
    upvotes: List[int]
    created_at: datetime