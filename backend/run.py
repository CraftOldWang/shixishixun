import uvicorn
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.db.create_db import create_tables

def init():
    """初始化数据库"""
    # 创建数据库表
    create_tables()
    
    # 初始化数据
    db = SessionLocal()
    init_db(db)


if __name__ == "__main__":
    # 初始化数据库
    init()
    
    # 启动服务器
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)