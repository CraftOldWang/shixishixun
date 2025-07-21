from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# 对话创建模型
class ConversationCreate(BaseModel):
    topic: Optional[str] = None
    character_id: str
    

# 对话响应模型
class ConversationResponse(BaseModel):
    id: str
    title: str
    topic: Optional[str] = None
    summary: Optional[str] = None
    background_url: Optional[str] = None
    user_id: str
    character_id: str
    updated_at: datetime
    
    class Config:
        from_attributes = True

# 消息模型
class MessageResponse(BaseModel):
    id: str
    content: str
    isUser: bool
    timestamp: str

# 带消息的对话响应模型
class ConversationWithMessages(ConversationResponse):
    messages: List[MessageResponse] = []