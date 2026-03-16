from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Base Schema for User
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "attendee"

# Schema for User Registration Request
class UserCreate(UserBase):
    password: str

# Schema for User Login Request
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for User Response
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for Token Response
class Token(BaseModel):
    access_token: str
    token_type: str

# Schema for Token Data
class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None

# Schema for Profile Update Request
class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
