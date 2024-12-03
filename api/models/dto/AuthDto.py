from pydantic import BaseModel
class UserRegisterDto(BaseModel):
    username: str
    email: str
    password: str
class UserLoginDto(BaseModel):
    email: str
    password: str
class UserResponseDto(BaseModel):
    id: int
    username: str
    email: str
    profile_picture: str