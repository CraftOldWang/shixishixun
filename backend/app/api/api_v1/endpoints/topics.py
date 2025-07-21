from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List, Dict

from app.db.session import get_db
from app.models.models import TopicCategory, PredefinedTopic
from app.schemas.topic import TopicCategoryResponse, TopicResponse, TopicGenerateRequest
from app.services.ai_service import generate_topics

router = APIRouter()

@router.get("/", response_model=List[TopicCategoryResponse])
def get_predefined_topics(db: Session = Depends(get_db)) -> Any:
    """获取预定义话题"""
    categories = db.query(TopicCategory).all()
    
    result = []
    for category in categories:
        topics = db.query(PredefinedTopic).filter(PredefinedTopic.category_id == category.id).all()
        
        topic_list = []
        for topic in topics:
            topic_list.append(TopicResponse(
                id=topic.id,
                title=topic.content,
            ))
        
        result.append(TopicCategoryResponse(
            id=category.id,
            name=category.name,
            topics=topic_list,
        ))
    
    return result

@router.post("/generate", response_model=List[str])
def generate_custom_topics(request: TopicGenerateRequest) -> Any:
    """根据提示生成话题"""
    # 调用AI服务生成话题
    topics = generate_topics(request.prompt, request.num_topics)
    
    return topics