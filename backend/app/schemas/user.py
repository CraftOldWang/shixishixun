from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# 用户创建模型
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: str = Field(..., min_length=6)

# 用户响应模型
class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[EmailStr] = None
    
    class Config:
        from_attributes = True