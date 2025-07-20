#!/usr/bin/env python
"""
数据库初始化脚本

此脚本用于创建数据库表结构并初始化基础数据，
可以在不启动应用的情况下单独运行。
"""

from app.db.create_db import create_tables
from app.db.init_db import init_db
from app.db.session import SessionLocal

def main():
    print("开始初始化数据库...")
    
    # 创建数据库表
    create_tables()
    
    # 初始化基础数据
    db = SessionLocal()
    init_db(db)
    
    print("数据库初始化完成！")

if __name__ == "__main__":
    main()