from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, Dict

from app.db.session import get_db
from app.models.models import Message, Conversation
from app.schemas.message import MessageCreate, MessageResponse

router = APIRouter()

@router.post("/save", response_model=MessageResponse)
def save_message(message_in: MessageCreate, db: Session = Depends(get_db)) -> Any:
    """保存用户消息"""
    # 检查对话是否存在
    conversation = db.query(Conversation).filter(Conversation.id == message_in.conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="对话不存在",
        )
    
    # 创建消息
    message = Message(
        content=message_in.content,
        is_user=True,  # 用户消息
        conversation_id=message_in.conversation_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # 更新对话的更新时间
    conversation.updated_at = message.timestamp
    db.commit()
    
    return MessageResponse(
        id=message.id,
        content=message.content,
        isUser=message.is_user,
        timestamp=message.timestamp.isoformat(),
    )