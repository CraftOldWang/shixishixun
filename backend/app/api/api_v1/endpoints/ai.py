from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List, Dict

from app.db.session import get_db
from app.models.models import Message, Conversation, Character
from app.schemas.ai import AiOptionsRequest, AiResponseRequest, AiOptionsResponse
from app.services.ai_service import get_ai_options, get_ai_response

router = APIRouter()

@router.post("/get-ai-options", response_model=AiOptionsResponse)
def fetch_ai_options(request: AiOptionsRequest, db: Session = Depends(get_db)) -> Any:
    """获取AI推荐问题"""
    # 检查对话是否存在
    conversation = db.query(Conversation).filter(Conversation.id == request.conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="对话不存在",
        )
    
    # 获取对话的所有消息
    messages = db.query(Message).filter(Message.conversation_id == request.conversation_id).order_by(Message.timestamp).all()
    
    # 获取角色信息
    character = db.query(Character).filter(Character.id == conversation.character_id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="角色不存在",
        )
    
    # 调用AI服务获取推荐问题
    options = get_ai_options(messages, character, conversation.topic)
    
    return AiOptionsResponse(options=options)

@router.post("/get-ai-response", response_model=Dict[str, Any])
def fetch_ai_response(request: AiResponseRequest, db: Session = Depends(get_db)) -> Any:
    """获取AI回复"""
    # 检查对话是否存在
    conversation = db.query(Conversation).filter(Conversation.id == request.conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="对话不存在",
        )
    
    # 获取对话的所有消息
    messages = db.query(Message).filter(Message.conversation_id == request.conversation_id).order_by(Message.timestamp).all()
    
    # 获取角色信息
    character = db.query(Character).filter(Character.id == conversation.character_id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="角色不存在",
        )
    
    # 保存用户消息
    user_message = Message(
        content=request.message,
        is_user=True,
        conversation_id=request.conversation_id,
    )
    db.add(user_message)
    db.flush()
    
    # 调用AI服务获取回复
    ai_content = get_ai_response(messages + [user_message], character, conversation.topic)
    
    # 保存AI回复
    ai_message = Message(
        content=ai_content,
        is_user=False,
        conversation_id=request.conversation_id,
    )
    db.add(ai_message)
    
    # 更新对话的更新时间
    conversation.updated_at = ai_message.timestamp
    db.commit()
    db.refresh(ai_message)
    
    return {
        "id": ai_message.id,
        "content": ai_message.content,
        "isUser": ai_message.is_user,
        "timestamp": ai_message.timestamp.isoformat(),
    }