from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="英语学习应用API",
    description="英语学习应用的后端API",
    version="0.1.0",
)

# 设置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 前端开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含所有API路由
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "欢迎使用英语学习应用API"}