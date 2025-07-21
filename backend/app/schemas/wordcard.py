from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# 单词卡创建模型
class WordcardCreate(BaseModel):
    word: str
    pronunciation: Optional[str] = None
    pos: Optional[str] = None  # 词性
    context: Optional[str] = None  # 上下文

# 单词卡响应模型
class WordcardResponse(BaseModel):
    id: str
    word: str
    pronunciation: Optional[str] = None
    pos: Optional[str] = None
    context: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True