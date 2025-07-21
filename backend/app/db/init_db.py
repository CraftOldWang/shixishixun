from sqlalchemy.orm import Session
from app.models.models import User, Character, CharacterTag, TopicCategory, PredefinedTopic, Conversation, Message, Wordcard
from app.core.security import get_password_hash
from datetime import datetime, timedelta

# 初始化数据库
def init_db(db: Session) -> None:
    # 创建默认用户
    admin_user = create_default_user(db)
    
    # 创建示例用户
    demo_user = create_demo_user(db)
    
    # 创建默认角色
    characters = create_default_characters(db)
    
    # 创建预定义话题
    create_predefined_topics(db)
    
    # 创建示例对话和消息
    create_sample_conversations(db, demo_user.id, characters)

# 创建默认用户
def create_default_user(db: Session) -> User:
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
    return user

# 创建示例对话和消息
def create_sample_conversations(db: Session, user_id: str, characters: list) -> None:
    # 检查是否已存在示例对话
    existing_conversations = db.query(Conversation).filter(Conversation.user_id == user_id).all()
    if existing_conversations:
        return
    
    # 获取第一个角色用于创建对话
    character = characters[0] if characters else None
    if not character:
        return
    
    # 创建示例对话1
    conv1 = Conversation(
        id="conv-1",
        character_id=character.id,
        user_id=user_id,
        title="探讨宇宙的起源",
        topic="科学",
        summary="关于大爆炸理论的一些初步讨论...",
        created_at=datetime.now() - timedelta(days=3),
        updated_at=datetime.now() - timedelta(days=3),
        background_url="https://w.wallhaven.cc/full/po/wallhaven-po2vg3.jpg"
    )
    db.add(conv1)
    db.flush()
    
    # 创建对话1的消息
    messages1 = [
        Message(
            id="msg-1-1",
            conversation_id=conv1.id,
            content="Hello, traveler. Welcome to the Royal Library. What ancient secrets are you interested in?",
            is_user=False,
            timestamp=datetime.now() - timedelta(days=3, minutes=30)
        ),
        Message(
            id="msg-1-2",
            conversation_id=conv1.id,
            content="I have been studying the legends about Atlantis. Are there any clues?",
            is_user=True,
            timestamp=datetime.now() - timedelta(days=3, minutes=29)
        ),
        Message(
            id="msg-1-3",
            conversation_id=conv1.id,
            content="A wise choice. Many people think it is just a myth, but some ancient texts hint at its real existence.",
            is_user=False,
            timestamp=datetime.now() - timedelta(days=3, minutes=28)
        )
    ]
    for msg in messages1:
        db.add(msg)
    
    # 创建示例对话2
    conv2 = Conversation(
        id="conv-2",
        character_id=character.id,
        user_id=user_id,
        title="如何烤出完美的披萨",
        topic="烹饪",
        summary="从面团发酵到烤箱温度的精确控制...",
        created_at=datetime.now() - timedelta(days=6),
        updated_at=datetime.now() - timedelta(days=6)
    )
    db.add(conv2)
    db.flush()
    
    # 创建对话2的消息
    messages2 = [
        Message(
            conversation_id=conv2.id,
            content="你好，我想学习如何制作披萨。",
            is_user=True,
            timestamp=datetime.now() - timedelta(days=6, minutes=45)
        ),
        Message(
            conversation_id=conv2.id,
            content="制作披萨的关键在于面团和烤箱温度。首先，你需要准备好面粉、酵母、水和盐。",
            is_user=False,
            timestamp=datetime.now() - timedelta(days=6, minutes=44)
        )
    ]
    for msg in messages2:
        db.add(msg)
    
    # 创建示例单词卡
    wordcards = [
        Wordcard(
            id="word-1",
            user_id=user_id,
            word="Apple",
            pronunciation="[æpl]",
            pos="noun",
            context="An apple is a round fruit with red or green skin and a whitish inside.",
            conversation_id=conv1.id,
            message_id=messages1[0].id,
            created_at=datetime.now() - timedelta(days=3)
        ),
        Wordcard(
            id="word-2",
            user_id=user_id,
            word="Banana",
            pronunciation="[bəˈnɑ:nə]",
            pos="noun",
            context="Bananas are long curved fruits with yellow skins.",
            conversation_id=conv2.id,
            message_id=messages2[1].id,
            created_at=datetime.now() - timedelta(days=6)
        )
    ]
    for card in wordcards:
        db.add(card)
    
    db.commit()

# 创建示例用户
def create_demo_user(db: Session) -> User:
    # 检查是否已存在示例用户
    user = db.query(User).filter(User.username == "demo").first()
    if not user:
        user = User(
            username="demo",
            email="demo@example.com",
            hashed_password=get_password_hash("demo123"),
        )
        db.add(user)
        db.commit()
    return user

# 创建默认角色
def create_default_characters(db: Session) -> list:
    # 默认角色数据
    default_characters = [
        {
            "name": "莉娜·语言学家",
            "description": "精通多国语言的语言学专家，热爱文化交流。",
            "avatar_url": "https://bkudcgimcodwrexeqekc.supabase.co/storage/v1/object/public/media/characters/bK0mXMTrrspFRMYnE10qbheVZhODQEO4/neutral.jpg",
            "tags": ["翻译", "学习", "文化"],
        },
        {
            "name": "灵梦",
            "description": "博丽神社的巫女，擅长退治妖怪。",
            "avatar_url": r"https://upload.thbwiki.cc/9/93/%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%EF%BC%88%E7%BB%AF%E6%83%B3%E5%A4%A9%E7%AB%8B%E7%BB%98%EF%BC%89.png",
            "tags": ["东方", "巫女", "退魔"],
        },
        {
            "name": "洛天依",
            "description": "虚拟歌姬，拥有天籁般的歌声。",
            "avatar_url": "https://tc.z.wiki/autoupload/f/4tNSiBEhtlRiYYEEkbejirfwAbfELPKXx4nK3--4woWyl5f0KlZfm6UsKj-HyTuv/20250721/26io/2000X2811/luotianyi.png",
            "tags": ["歌姬", "虚拟", "音乐"],
        },
        {
            "name": "凯尔希",
            "description": "罗德岛的医疗部门负责人，冷静而严厉。",
            "avatar_url": "https://tc.z.wiki/autoupload/f/4tNSiBEhtlRiYYEEkbejirfwAbfELPKXx4nK3--4woWyl5f0KlZfm6UsKj-HyTuv/20250721/dWr3/1024X1024/31bc8f71f22b58a7af0da2b9ff52dde346061c643ec2f-An1mji_fw1200webp.png",
            "tags": ["明日方舟", "医疗", "罗德岛"],
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
    
    # 返回所有角色
    return db.query(Character).filter(Character.is_default == True).all()

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