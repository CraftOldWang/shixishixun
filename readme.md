# 英语学习应用

一个基于 React + FastAPI 的英语学习应用，支持 AI 角色对话、话题练习、单词学习等功能。

## 🚀 项目概述

本项目是一个全栈英语学习应用，包含以下主要功能：

- **用户系统**：注册、登录、个人资料管理
- **AI 对话**：与不同角色进行英语对话练习
- **话题练习**：基于特定话题的英语学习
- **单词本**：个人单词收藏和复习功能
- **学习记录**：对话历史和学习进度跟踪

## 🏗️ 技术栈

### 后端 (Backend)

- **Python 3.8+**
- **FastAPI** - 现代、快速的 Web 框架
- **SQLAlchemy** - ORM 数据库操作
- **LangChain** - AI 应用框架
- **通义千问 (DashScope)** - AI 对话引擎
- **SQLite** - 数据库

### 前端 (Frontend)

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 现代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **React Router** - 单页面应用路由
- **Axios** - HTTP 客户端

## 📋 环境要求

- **Node.js** >= 16.0.0
- **Python** >= 3.8
- **npm** 或 **yarn** 包管理器
- **通义千问 API Key** (用于 AI 功能)

## 🛠️ 安装与运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd shixishixun
```

### 2. 后端设置

#### 2.1 进入后端目录

```bash
cd backend
```

#### 2.2 创建虚拟环境（推荐）

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 安装依赖

```bash
pip install -r requirements.txt
```

#### 2.4 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
# API 配置
DASHSCOPE_API_KEY=your_dashscope_api_key_here
SECRET_KEY=your-secret-key-here

# 数据库配置
DATABASE_URL=sqlite:///./app.db

# 应用配置
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
```

**获取通义千问 API Key：**

1. 访问 [阿里云控制台](https://dashscope.console.aliyun.com/)
2. 开通通义千问服务
3. 获取 API Key 并填入上述配置

#### 2.5 启动后端服务

```bash
# 使用 run.py 启动（推荐，会自动初始化数据库）
python run.py

# 或者使用 uvicorn 启动
uvicorn app.main:app --reload
```

后端服务将在 `http://localhost:8000` 启动

### 3. 前端设置

#### 3.1 新开终端，进入前端目录

```bash
cd frontend
```

#### 3.2 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

#### 3.3 启动开发服务器

```bash
npm run dev
# 或使用 yarn
yarn dev
```

前端应用将在 `http://localhost:5173` 启动

### 4. 访问应用

打开浏览器访问 `http://localhost:5173` 即可使用应用。

## 📁 项目结构

```text
shixishixun/
├── backend/                 # 后端代码
│   ├── app/
│   │   ├── api/            # API 路由
│   │   ├── core/           # 核心配置
│   │   ├── db/             # 数据库相关
│   │   ├── models/         # 数据模型
│   │   ├── schemas/        # Pydantic 模式
│   │   └── services/       # 业务逻辑
│   ├── requirements.txt    # Python 依赖
│   └── run.py             # 启动脚本
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── contexts/       # React 上下文
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   └── types/          # TypeScript 类型
│   ├── package.json        # 前端依赖
│   └── vite.config.ts      # Vite 配置
└── README.md              # 项目说明
```

## 🔧 开发命令

### 后端命令

```bash
cd backend

# 启动开发服务器
python run.py

# 仅初始化数据库
python init_database.py

# 使用 uvicorn 启动（需手动初始化数据库）
uvicorn app.main:app --reload --port 8000
```

### 前端命令

```bash
cd frontend

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

## 🌐 API 文档

后端启动后，可以访问以下地址查看 API 文档：

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 📱 主要功能页面

- **登录页面**: `/login` - 用户登录
- **注册页面**: `/register` - 用户注册
- **首页**: `/` - 角色选择和快速开始
- **对话页面**: `/chat` - AI 角色对话
- **话题选择**: `/topics` - 选择学习话题
- **单词本**: `/wordbook` - 个人单词管理
- **个人资料**: `/profile` - 用户信息管理

## 🚧 故障排除

### 常见问题

1. **后端启动失败**
   - 检查 Python 版本是否 >= 3.8
   - 确认已安装所有依赖：`pip install -r requirements.txt`
   - 检查 `.env` 文件配置是否正确

2. **前端启动失败**
   - 检查 Node.js 版本是否 >= 16.0.0
   - 删除 `node_modules` 重新安装：`rm -rf node_modules && npm install`

3. **API Key 相关错误**
   - 确认通义千问 API Key 已正确配置
   - 检查 API Key 是否有效和有足够余额

4. **跨域问题**
   - 确认后端 CORS 配置正确
   - 前端代理配置检查（已在 vite.config.ts 中配置）

### 日志查看

- 后端日志会在控制台输出
- 前端开发模式下，错误信息会在浏览器开发者工具中显示



---

