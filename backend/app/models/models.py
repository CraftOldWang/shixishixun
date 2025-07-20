from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid
from datetime import datetime

# 生成唯一ID的函数
def generate_uuid():
    return str(uuid.uuid4())

# 用户模型
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    conversations = relationship("Conversation", back_populates="user")
    wordcards = relationship("Wordcard", back_populates="user")

# 角色标签关联表
character_tag = Table(
    "character_tag",
    Base.metadata,
    Column("character_id", String, ForeignKey("characters.id")),
    Column("tag", String),
)

# 角色模型
class Character(Base):
    __tablename__ = "characters"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    avatar_url = Column(String, nullable=True)  # 头像URL
    is_default = Column(Boolean, default=False)  # 是否为默认角色
    created_by = Column(String, ForeignKey("users.id"), nullable=True)  # 创建者ID，默认角色为null
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    conversations = relationship("Conversation", back_populates="character")
    tags = relationship("CharacterTag", back_populates="character")

# 角色标签模型
class CharacterTag(Base):
    __tablename__ = "character_tags"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    character_id = Column(String, ForeignKey("characters.id"), nullable=False)
    tag = Column(String, nullable=False)
    
    # 关系
    character = relationship("Character", back_populates="tags")

# 对话模型
class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    character_id = Column(String, ForeignKey("characters.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)  # 话题/场景
    summary = Column(Text, nullable=True)  # 对话摘要
    background_url = Column(String, nullable=True)  # 背景图片URL
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    character = relationship("Character", back_populates="conversations")
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    wordcards = relationship("Wordcard", back_populates="conversation")

# 消息模型
class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_user = Column(Boolean, default=False)  # 是否为用户消息
    timestamp = Column(DateTime, default=func.now())
    
    # 关系
    conversation = relationship("Conversation", back_populates="messages")
    wordcards = relationship("Wordcard", back_populates="message")

# 单词卡模型
class Wordcard(Base):
    __tablename__ = "wordcards"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    word = Column(String, nullable=False)
    pronunciation = Column(String, nullable=True)
    pos = Column(String, nullable=True)  # 词性
    context = Column(Text, nullable=True)  # 上下文或定义
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=True)
    message_id = Column(String, ForeignKey("messages.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    user = relationship("User", back_populates="wordcards")
    conversation = relationship("Conversation", back_populates="wordcards")
    message = relationship("Message", back_populates="wordcards")

# 预定义话题类别模型
class TopicCategory(Base):
    __tablename__ = "topic_categories"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    
    # 关系
    topics = relationship("PredefinedTopic", back_populates="category")

# 预定义话题模型
class PredefinedTopic(Base):
    __tablename__ = "predefined_topics"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    category_id = Column(String, ForeignKey("topic_categories.id"), nullable=False)
    content = Column(String, nullable=False)
    
    # 关系
    category = relationship("TopicCategory", back_populates="topics")