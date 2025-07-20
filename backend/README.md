# 英语学习应用后端

这是一个基于FastAPI和通义千问的英语学习应用后端。

## 功能

- 用户认证与管理
- 角色管理
- 对话管理
- AI对话生成
- 单词卡管理
- 话题生成

## 技术栈

- Python
- FastAPI
- SQLAlchemy
- LangChain
- 通义千问 (DashScope)

## 安装与运行

1. 安装依赖
```bash
pip install -r requirements.txt
```

2. 设置环境变量
```bash
# 创建.env文件并设置以下变量
DASHSCOPE_API_KEY=your_dashscope_api_key
DATABASE_URL=sqlite:///./app.db
```

3. 初始化数据库
```bash
# 单独初始化数据库（不启动应用）
python init_database.py
```

4. 运行应用
```bash
# 方法1: 使用run.py脚本（推荐，会自动创建数据库表和初始化数据）
python run.py

# 方法2: 直接使用uvicorn（需要手动确保数据库已初始化）
uvicorn app.main:app --reload
```

## API文档

启动应用后，访问 http://localhost:8000/docs 查看API文档。