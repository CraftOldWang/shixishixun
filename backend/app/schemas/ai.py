from pydantic import BaseModel, Field
from typing import List, Optional

# AI推荐问题请求模型
class AiOptionsRequest(BaseModel):
    conversation_id: str

# AI推荐问题响应模型
class AiOptionsResponse(BaseModel):
    options: List[str] = []

# AI回复请求模型
class AiResponseRequest(BaseModel):
    conversation_id: str
    message: str