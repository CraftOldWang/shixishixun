from sqlalchemy import create_engine, Column, String, Boolean, DateTime, ForeignKey, Table, ARRAY
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import os

# 创建基础类
Base = declarative_base()

# 创建标签关联表（用于Character的多对多关系）
character_tags = Table(
    'character_tags',
    Base.metadata,
    Column('character_id', String, ForeignKey('characters.id')),
    Column('tag', String)
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    # 添加额外的安全字段
    password_hash = Column(String, nullable=False)
    
    # 关系
    characters = relationship("Character", back_populates="creator")
    conversations = relationship("Conversation", back_populates="user")
    wordcards = relationship("Wordcard", back_populates="user")

class Character(Base):
    __tablename__ = 'characters'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    avatar = Column(String)
    is_default = Column(Boolean, default=False)
    created_by = Column(String, ForeignKey('users.id'))
    
    # 关系
    creator = relationship("User", back_populates="characters")
    conversations = relationship("Conversation", back_populates="character")
    tags = relationship("CharacterTag", back_populates="character")

class CharacterTag(Base):
    __tablename__ = 'character_tags'
    
    id = Column(String, primary_key=True)
    character_id = Column(String, ForeignKey('characters.id'))
    tag = Column(String)
    
    # 关系
    character = relationship("Character", back_populates="tags")

class Conversation(Base):
    __tablename__ = 'conversations'
    
    id = Column(String, primary_key=True)
    character_id = Column(String, ForeignKey('characters.id'), nullable=False)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    summary = Column(String)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    background_url = Column(String)
    
    # 关系
    character = relationship("Character", back_populates="conversations")
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")
    wordcards = relationship("Wordcard", back_populates="conversation")

class Message(Base):
    __tablename__ = 'messages'
    
    id = Column(String, primary_key=True)
    conversation_id = Column(String, ForeignKey('conversations.id'), nullable=False)
    content = Column(String, nullable=False)
    is_user = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=func.now())
    
    # 关系
    conversation = relationship("Conversation", back_populates="messages")
    wordcards = relationship("Wordcard", back_populates="message")

class Wordcard(Base):
    __tablename__ = 'wordcards'
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    word = Column(String, nullable=False)
    pronunciation = Column(String)
    pos = Column(String)  # Part of Speech
    context = Column(String)
    conversation_id = Column(String, ForeignKey('conversations.id'))
    message_id = Column(String, ForeignKey('messages.id'))
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    user = relationship("User", back_populates="wordcards")
    conversation = relationship("Conversation", back_populates="wordcards")
    message = relationship("Message", back_populates="wordcards")


SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
# 数据库连接和初始化
def init_db():
    database_url = SQLALCHEMY_DATABASE_URL
    engine = create_engine(database_url)
    Base.metadata.create_all(bind=engine)
    return engine
