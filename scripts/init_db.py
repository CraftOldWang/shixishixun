import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db.database import engine, Base, SessionLocal
from models.models import User, Character, Conversation, Message
from core.auth import get_password_hash

def init_db():
    # 创建数据库表
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        user_count = db.query(User).count()
        if user_count > 0:
            print("数据库已初始化，跳过")
            return
        
        # 创建测试用户
        test_user = User(
            username="test_user",
            email="test@example.com",
            hashed_password=get_password_hash("password123")
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        # 创建角色
        characters = [
            Character(
                name="Sakura",
                description="一个友好、热情的日本高中生。她喜欢帮助他人，对英语学习充满热情。",
                personality="友好、热情、有耐心、乐于助人",
                avatar_url="https://example.com/sakura.jpg",
                language_level="初级",
                scenario="在日本高中的英语俱乐部中，Sakura正在帮助你练习基础英语对话。"
            ),
            Character(
                name="Hiroshi",
                description="一个冷静、聪明的大学生。他对科技和科学充满热情，喜欢用英语讨论这些话题。",
                personality="冷静、理性、聪明、略带傲娇",
                avatar_url="https://example.com/hiroshi.jpg",
                language_level="中级",
                scenario="在大学图书馆，Hiroshi正在与你讨论最新的科技新闻和科学发现。"
            ),
            Character(
                name="Yuki",
                description="一个优雅、成熟的职场人士。她在国际公司工作，英语流利，喜欢讨论商业和文化话题。",
                personality="优雅、成熟、专业、有见识",
                avatar_url="https://example.com/yuki.jpg",
                language_level="高级",
                scenario="在商务会议后的社交活动中，Yuki正在与你讨论全球商业趋势和文化差异。"
            )
        ]
        
        for character in characters:
            db.add(character)
        
        db.commit()
        
        # 为测试用户创建一些对话
        sakura = db.query(Character).filter(Character.name == "Sakura").first()
        
        conversation = Conversation(
            user_id=test_user.id,
            character_id=sakura.id,
            title="初次见面"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        
        # 添加一些示例消息
        messages = [
            Message(
                conversation_id=conversation.id,
                character_id=sakura.id,
                content="Hello! I'm Sakura. Nice to meet you! How are you today? (你好！我是Sakura。很高兴认识你！今天感觉如何？)",
                is_user=False
            ),
            Message(
                conversation_id=conversation.id,
                content="Hello Sakura, nice to meet you too. I'm fine, thank you.",
                is_user=True
            ),
            Message(
                conversation_id=conversation.id,
                character_id=sakura.id,
                content="That's great to hear! What would you like to talk about today? We can practice some basic English conversation. (很高兴听到这个！今天你想聊些什么？我们可以练习一些基础英语对话。)",
                is_user=False
            )
        ]
        
        for message in messages:
            db.add(message)
        
        db.commit()
        
        print("数据库初始化成功！")
        
    except Exception as e:
        print(f"初始化数据库时出错: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("开始初始化数据库...")
    init_db() 