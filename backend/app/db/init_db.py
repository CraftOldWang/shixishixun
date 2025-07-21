from sqlalchemy.orm import Session
from app.models.models import User, Character, CharacterTag, TopicCategory, PredefinedTopic
from app.core.security import get_password_hash

# 初始化数据库
def init_db(db: Session) -> None:
    # 创建默认用户
    create_default_user(db)
    
    # 创建默认角色
    create_default_characters(db)
    
    # 创建预定义话题
    create_predefined_topics(db)

# 创建默认用户
def create_default_user(db: Session) -> None:
    # 检查是否已存在默认用户
    user = db.query(User).filter(User.username == "admin").first()
    if not user:
        user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin"),
        )
        db.add(user)
        db.commit()

# 创建默认角色
def create_default_characters(db: Session) -> None:
    # 默认角色数据
    default_characters = [
        {
            "name": "全能翻译官",
            "description": "精通多种语言，提供精准翻译。",
            "avatar_url": "https://images.unsplash.com/photo-1543465077-5338d8232588?w=400",
            "tags": ["翻译", "学习"],
        },
        {
            "name": "编程高手",
            "description": "解决各种编程难题和代码审查。",
            "avatar_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
            "tags": ["编程", "技术"],
        },
        {
            "name": "小明",
            "description": "热心的学习助手",
            "avatar_url": "https://randomuser.me/api/portraits/men/1.jpg",
            "tags": ["默认", "AI", "幽默"],
        },
        {
            "name": "小红",
            "description": "善于讲故事的AI",
            "avatar_url": "https://randomuser.me/api/portraits/women/2.jpg",
            "tags": ["默认", "故事", "温柔"],
        },
    ]
    
    # 检查是否已存在默认角色
    existing_characters = db.query(Character).filter(Character.is_default == True).all()
    if not existing_characters:
        for char_data in default_characters:
            character = Character(
                name=char_data["name"],
                description=char_data["description"],
                avatar_url=char_data["avatar_url"],
                is_default=True,
            )
            db.add(character)
            db.flush()  # 获取ID
            
            # 添加标签
            for tag in char_data["tags"]:
                char_tag = CharacterTag(character_id=character.id, tag=tag)
                db.add(char_tag)
        
        db.commit()

# 创建预定义话题
def create_predefined_topics(db: Session) -> None:
    # 预定义话题数据
    predefined_topics = {
        "Daily Life": [
            "Ordering coffee",
            "Talking about the weather",
            "Making plans for the weekend",
            "Grocery shopping",
        ],
        "Work & Career": [
            "Preparing for a job interview",
            "Discussing a project with a colleague",
            "Asking for a raise",
        ],
        "Travel": [
            "Booking a hotel room",
            "Asking for directions",
            "Checking in at the airport",
            "Sharing travel experiences",
        ],
        "Hobbies": [
            "Talking about your favorite movie",
            "Discussing a book you've read",
            "Planning a hiking trip",
        ],
    }
    
    # 检查是否已存在预定义话题
    existing_categories = db.query(TopicCategory).all()
    if not existing_categories:
        for category_name, topics in predefined_topics.items():
            # 创建分类
            category = TopicCategory(name=category_name)
            db.add(category)
            db.flush()  # 获取ID
            
            # 创建话题
            for topic_content in topics:
                topic = PredefinedTopic(
                    category_id=category.id,
                    content=topic_content,
                )
                db.add(topic)
        
        db.commit()