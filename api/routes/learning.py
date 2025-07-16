from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from db.database import get_db
from models.models import User, Conversation, Message
from core.auth import get_current_active_user
from services.learning_service import LanguageLearningService

router = APIRouter(
    prefix="/learning",
    tags=["learning"],
    responses={404: {"description": "Not found"}},
)

learning_service = LanguageLearningService()

class StudyPlanRequest(BaseModel):
    current_level: str
    target_level: str
    interests: List[str]
    available_time_per_week: int

class ConversationAnalysisResponse(BaseModel):
    vocabulary: List[Dict[str, str]]
    grammar_points: List[Dict[str, str]]
    language_level: str
    exercises: List[Dict[str, Any]]

class LearningProgressResponse(BaseModel):
    total_messages: int
    vocabulary_exposure: int
    grammar_points_encountered: int
    estimated_level: str
    improvement_suggestions: List[str]

class StudyPlanResponse(BaseModel):
    current_level: str
    target_level: str
    estimated_weeks_to_target: int
    weekly_goals: List[str]
    recommended_characters: List[Dict[str, str]]
    recommended_session_length: str
    recommended_frequency: str

@router.get("/conversation/{conversation_id}/analysis", response_model=ConversationAnalysisResponse)
def analyze_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """分析特定对话的语言学习内容"""
    # 验证对话存在且属于当前用户
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="对话不存在或无权访问")
    
    # 获取对话消息
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at).all()
    
    # 转换为字典列表
    message_dicts = [
        {"content": msg.content, "is_user": msg.is_user}
        for msg in messages
    ]
    
    # 分析对话
    analysis = learning_service.analyze_conversation(message_dicts)
    
    return analysis

@router.get("/progress", response_model=LearningProgressResponse)
def get_learning_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取用户的学习进度"""
    # 获取用户最近的对话
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).limit(10).all()
    
    # 获取每个对话的消息
    conversation_data = []
    for conv in conversations:
        messages = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at).all()
        
        message_dicts = [
            {"content": msg.content, "is_user": msg.is_user}
            for msg in messages
        ]
        
        conversation_data.append({
            "id": conv.id,
            "title": conv.title,
            "messages": message_dicts
        })
    
    # 获取学习进度
    progress = learning_service.get_learning_progress(
        user_id=current_user.id,
        recent_conversations=conversation_data
    )
    
    return progress

@router.post("/study-plan", response_model=StudyPlanResponse)
def generate_study_plan(
    request: StudyPlanRequest,
    current_user: User = Depends(get_current_active_user)
):
    """生成个性化学习计划"""
    study_plan = learning_service.generate_study_plan(
        user_level=request.current_level,
        target_level=request.target_level,
        interests=request.interests,
        available_time_per_week=request.available_time_per_week
    )
    
    return study_plan 