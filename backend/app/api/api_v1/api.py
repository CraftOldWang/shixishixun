from fastapi import APIRouter
from app.api.api_v1.endpoints import users, characters, conversations, messages, wordcards, topics, ai

api_router = APIRouter()

# 用户相关路由
api_router.include_router(users.router, prefix="/auth", tags=["认证"])

# 角色相关路由
api_router.include_router(characters.router, prefix="/characters", tags=["角色"])

# 对话相关路由
api_router.include_router(conversations.router, prefix="/conversations", tags=["对话"])

# 消息相关路由
api_router.include_router(messages.router, prefix="/messages", tags=["消息"])

# 单词卡相关路由
api_router.include_router(wordcards.router, prefix="/favorites", tags=["单词卡"])

# 话题相关路由
api_router.include_router(topics.router, prefix="/topics", tags=["话题"])

# AI相关路由
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])