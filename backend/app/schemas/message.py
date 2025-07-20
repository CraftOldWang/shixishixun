from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# 消息创建模型
class MessageCreate(BaseModel):
    content: str
    conversation_id: str

# 消息响应模型
class MessageResponse(BaseModel):
    id: str
    content: str
    isUser: bool
    timestamp: str
    
    class Config:
        from_attributes = True