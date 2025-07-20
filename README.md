# 二次元AI英语学习助手

这是一个基于FastAPI和前后端分离架构的英语学习应用，通过与二次元角色对话来学习英语语法。

## 项目介绍

二次元AI英语学习助手是一款创新的英语学习工具，它结合了二次元文化与英语教育。用户可以选择不同性格的二次元角色进行对话，在轻松愉快的氛围中学习英语语法知识。

## 技术栈

- **后端**: FastAPI, SQLAlchemy, Pydantic
- **AI模型**: 通义千问API
- **数据库**: SQLite
- **前端**: HTML, CSS, JavaScript
- **认证**: JWT

## 项目结构

```
app/
├── api/                   # API路由
├── core/                  # 核心配置
├── db/                    # 数据库相关
├── frontend/              # 前端代码
│   ├── index.html         # 前端界面
│   └── serve.py           # 前端服务器
├── models/                # 数据模型
├── schemas/               # Pydantic模式
├── services/              # 业务逻辑
├── utils/                 # 工具函数
├── test_app.py            # 测试版API服务
├── main.py                # 主应用入口
└── README.md              # 项目说明
```

## 功能特点

- 多个二次元角色可供选择，每个角色有不同的性格和对话风格
- 英语语法练习：从三个选项中选择语法正确的句子
- 实时反馈：选择错误时提供详细的语法解释
- 前后端分离架构：后端API + 前端界面
- 支持多种语法错误类型的练习
- 多样化的对话主题

## 安装指南

### 前提条件

- Python 3.8+
- pip

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/anime-english-assistant.git
cd anime-english-assistant
```

2. 创建并激活虚拟环境
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 配置环境变量
```bash
# 复制示例环境变量文件
cp env.example app.env
# 编辑环境变量文件，填入你的API密钥等信息
```

5. 创建数据库
```bash
python scripts/init_db.py
```

## 如何启动

### 1. 启动后端API服务

```bash
# 使用测试版API
uvicorn test_app:app --reload

# 或使用完整版API
uvicorn main:app --reload
```

后端API将在 http://127.0.0.1:8000 上运行

### 2. 启动前端服务

```bash
python frontend/serve.py
```

前端将在 http://localhost:8080 上运行

## API接口说明

### 获取角色列表

```
GET /characters
```

### 开始对话

```
POST /chat
{
  "message": "用户消息",
  "character": "角色名称"
}
```

### 选择选项

```
POST /select_option
{
  "selected_option": 0,  // 选项索引（0-2）
  "conversation_id": "会话ID"
}
```

## 语法错误类型

应用包含多种英语语法错误类型的练习，包括：

1. 时态错误
2. 主谓一致
3. 冠词使用
4. 介词使用
5. 比较级
6. 情态动词
7. 不定式
8. 被动语态
9. 条件句
10. 代词
11. 动名词
12. 数量词
13. 形容词副词
14. 连词
15. 名词单复数

## 贡献指南

欢迎提交问题和功能请求！如果您想贡献代码，请遵循以下步骤：

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 未来计划

- 接入更多AI模型
- 添加学习进度跟踪
- 增加更多语法练习类型
- 添加用户注册和登录功能
- 支持多语言界面 