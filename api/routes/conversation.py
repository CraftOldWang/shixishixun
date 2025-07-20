from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime

from db.database import get_db
from models.models import Conversation, Message, Character, User
from schemas.schemas import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse, ChatRequest
from core.auth import get_current_active_user
from services.conversation_service import CharacterConversationService

router = APIRouter(
    prefix="/api/conversations",
    tags=["conversations"],
    responses={404: {"description": "Not found"}},
)

conversation_service = CharacterConversationService()

@router.post("/", response_model=ConversationResponse)
def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建新对话"""
    # 验证角色是否存在
    character = db.query(Character).filter(Character.id == conversation.character_id).first()
    if not character:
        raise HTTPException(status_code=404, detail="角色不存在")
    
    # 创建对话
    db_conversation = Conversation(
        user_id=current_user.id,
        character_id=conversation.character_id,
        title=conversation.title
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    
    # 创建初始欢迎消息
    welcome_message = f"Hello! I'm {character.name}. {character.scenario}"
    db_message = Message(
        conversation_id=db_conversation.id,
        character_id=character.id,
        content=welcome_message,
        is_user=False
    )
    db.add(db_message)
    db.commit()
    
    # 获取包含初始消息的对话
    result = db.query(Conversation).filter(Conversation.id == db_conversation.id).first()
    return result

@router.get("/", response_model=List[ConversationResponse])
def get_user_conversations(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取用户的所有对话"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return conversations

@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取特定对话及其消息"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="对话不存在或无权访问")
    
    return conversation

@router.post("/chat", response_model=MessageResponse)
def chat_with_character(
    chat_request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """与角色进行对话"""
    # 验证对话存在且属于当前用户
    conversation = db.query(Conversation).filter(
        Conversation.id == chat_request.conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="对话不存在或无权访问")
    
    # 获取角色信息
    character = db.query(Character).filter(Character.id == conversation.character_id).first()
    
    # 保存用户消息
    user_message = Message(
        conversation_id=conversation.id,
        content=chat_request.message,
        is_user=True
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # 获取对话历史
    message_history = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at).all()
    
    # 获取AI回复
    ai_response = conversation_service.get_response(
        character=character,
        message=chat_request.message,
        conversation_history=message_history
    )
    
    # 保存AI回复
    ai_message = Message(
        conversation_id=conversation.id,
        character_id=character.id,
        content=ai_response,
        is_user=False
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    # 更新对话的更新时间
    setattr(conversation, 'updated_at', datetime.utcnow())
    db.commit()
    
    return ai_message

@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """删除对话"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="对话不存在或无权访问")
    
    # 删除关联的消息
    db.query(Message).filter(Message.conversation_id == conversation_id).delete()
    
    # 删除对话
    db.delete(conversation)
    db.commit()
    
    return None

@router.get("/all", response_model=List[ConversationResponse])
def get_all_user_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取当前用户的所有对话及消息（不分页）"""
    conversations = db.query(Conversation).filter(Conversation.user_id == current_user.id).order_by(Conversation.updated_at.desc()).all()
    return conversations

@router.delete("/clear_all")
def clear_all_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """清空当前用户的所有对话及消息"""
    conversations = db.query(Conversation).filter(Conversation.user_id == current_user.id).all()
    for conv in conversations:
        db.query(Message).filter(Message.conversation_id == conv.id).delete()
        db.delete(conv)
    db.commit()
    return {"msg": "所有对话及消息已清空"} 