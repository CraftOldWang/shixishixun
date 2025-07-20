from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine

def create_tables():
    """
    创建所有数据库表
    使用SQLAlchemy的metadata创建在models中定义的所有表
    """
    Base.metadata.create_all(bind=engine)
    print("数据库表创建成功！")