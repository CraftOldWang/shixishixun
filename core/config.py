import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from app.env file
load_dotenv("app.env")

class Settings(BaseSettings):
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    # 通义千问API密钥
    TONGYI_API_KEY: str = os.getenv("TONGYI_API_KEY", "")
    DASHSCOPE_API_KEY: str = os.getenv("DASHSCOPE_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./anime_english_app.db")
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key_here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # App Settings
    APP_NAME: str = "二次元AI英语学习助手"
    APP_VERSION: str = "0.1.0"
    
    class Config:
        env_file = "app.env"
        extra = "ignore"  # 忽略额外的字段

settings = Settings() 