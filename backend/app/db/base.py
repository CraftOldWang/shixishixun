# 导入所有模型，以便Alembic可以自动检测
from app.db.base_class import Base
from app.models.models import User, Character, CharacterTag, Conversation, Message, Wordcard, TopicCategory, PredefinedTopic