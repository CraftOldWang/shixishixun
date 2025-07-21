from pydantic_settings import BaseSettings
from typing import Optional, List
import os
from dotenv import load_dotenv

# 加载.env文件中的环境变量
load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "英语学习应用"
    
    # 数据库配置
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    
    # 通义千问API密钥
    DASHSCOPE_API_KEY: Optional[str] = os.getenv("DASHSCOPE_API_KEY")
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # 安全配置
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development-only")
    
    # 音频文件配置
    AUDIO_FILES_DIR: str = "static/audio_files"  # 相对于项目根目录
    AUDIO_FILES_MAX_AGE: int = 24  # 音频文件保存时间（小时）
    
    class Config:
        case_sensitive = True


settings = Settings()