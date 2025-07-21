import uvicorn
from app.db.init_db import init_db
from app.db.session import SessionLocal, engine
from app.models import Base

def init():
    Base.metadata.create_all(bind=engine)

    """初始化数据库"""
    db = SessionLocal()
    init_db(db)


if __name__ == "__main__":
    # 初始化数据库
    init()
    
    # 启动服务器
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)