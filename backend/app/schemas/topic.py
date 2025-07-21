from pydantic import BaseModel, Field
from typing import List, Optional

# 话题响应模型
class TopicResponse(BaseModel):
    id: str
    title: str
    
    class Config:
        from_attributes = True

# 话题分类响应模型
class TopicCategoryResponse(BaseModel):
    id: str
    name: str
    topics: List[TopicResponse] = []
    
    class Config:
        from_attributes = True

# 话题生成请求模型
class TopicGenerateRequest(BaseModel):
    prompt: str
    num_topics: int = Field(5, ge=1, le=10)  # 默认生成5个话题，最少1个，最多10个