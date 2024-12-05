from pydantic import BaseModel
class UserEditDto(BaseModel):
    username: str
    email: str
    profile_picture: str | None
class UserPasswordEditDto(BaseModel):
    password: str
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
    profile_picture: str | None