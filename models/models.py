from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=False, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user")
    vocabulary = relationship("Vocabulary", back_populates="user")

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    personality = Column(Text)  # 角色性格
    avatar_url = Column(String)
    language_level = Column(String)  # 语言级别
    scenario = Column(Text)  # 对话场景
    is_default = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # 为空表示是默认角色
    tags = Column(String)  # 以逗号分隔的标签字符串，例如："可爱,元气,学生"
    
    # Relationships
    conversations = relationship("Conversation", back_populates="character")
    messages = relationship("Message", back_populates="character")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    character_id = Column(Integer, ForeignKey("characters.id"))
    title = Column(String)
    scenario = Column(Text)  # 对话场景
    summary = Column(Text, nullable=True)  # 对话摘要，可以为空
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    character = relationship("Character", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    character_id = Column(Integer, ForeignKey("characters.id"), nullable=True)
    content = Column(Text)
    is_user = Column(Boolean, default=True)  # True if message is from user, False if from character
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    character = relationship("Character", back_populates="messages")

class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    word = Column(String, index=True)
    definition = Column(Text)  # 释义
    pronunciation = Column(String)  # 发音
    example = Column(Text)  # 示例句子
    message_id = Column(Integer, ForeignKey("messages.id"))  # 来源消息
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="vocabulary")
    source_message = relationship("Message") 