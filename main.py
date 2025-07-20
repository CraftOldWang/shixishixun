from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import conversation, characters, users, learning

app = FastAPI(
    title="二次元AI英语学习助手",
    description="与不同性格的二次元角色进行英语对话学习",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该指定具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(conversation.router)
app.include_router(characters.router)
app.include_router(users.router)
app.include_router(learning.router)

@app.get("/")
async def root():
    return {"message": "欢迎使用二次元AI英语学习助手API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 