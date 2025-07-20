from pydantic import BaseModel, Field
from typing import List, Optional

# 角色创建模型
class CharacterCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: str = Field(..., min_length=1)
    avatar: Optional[str] = None
    tags: Optional[List[str]] = None

# 角色响应模型
class CharacterResponse(BaseModel):
    id: str
    name: str
    description: str
    avatar: Optional[str] = None
    isDefault: bool
    
    class Config:
        from_attributes = True

# 带标签的角色响应模型
class CharacterWithTags(CharacterResponse):
    tags: List[str] = []