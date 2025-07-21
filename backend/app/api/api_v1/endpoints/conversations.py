from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.db.session import get_db
from app.models.models import Conversation, Message, Character, User
from app.schemas.conversation import ConversationCreate, ConversationResponse, ConversationWithMessages
from app.services.ai_service import get_ai_response

router = APIRouter()

@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(conversation_id: str, db: Session = Depends(get_db)) -> Any:
    """获取单个对话（不包含消息）"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="对话不存在",
        )
    
    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "topic": conversation.topic,
        "summary": conversation.summary,
        "background_url": conversation.background_url,
        "user_id": conversation.user_id,
        "character_id": conversation.character_id,
        "updated_at": conversation.updated_at.isoformat() if conversation.updated_at else None
    }

@router.get("/{conversation_id}/messages", response_model=List[dict])
def get_conversation_messages(conversation_id: str, db: Session = Depends(get_db)) -> Any:
    """获取对话的所有消息"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="对话不存在",
        )
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp).all()
    
    result = []
    for msg in messages:
        result.append({
            "id": str(msg.id),
            "conversationId": str(conversation_id),
            "content": msg.content,
            "isUser": msg.is_user,
            "timestamp": msg.timestamp.isoformat(),
        })
    
    return result

@router.post("/", response_model=ConversationResponse)
def create_conversation(conversation_in: ConversationCreate, user_id: str, db: Session = Depends(get_db)) -> Any:
    """创建新对话并返回AI的第一条回复"""
    # 检查角色是否存在
    character = db.query(Character).filter(Character.id == conversation_in.character_id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="角色不存在",
        )
    
    # 创建对话
    conversation = Conversation(
        title=f"与{character.name}的对话",
        topic=conversation_in.topic,
        user_id=user_id,
        character_id=conversation_in.character_id,
    )
    db.add(conversation)
    db.flush()  # 获取ID
    
    # 调用AI服务获取第一条回复
    # 注意：这里我们传入一个空的消息列表，让AI生成开场白
    ai_content = get_ai_response([], character, conversation.topic)
    
    # 创建AI的回复消息
    ai_message = Message(
        content=ai_content,
        is_user=False,
        conversation_id=conversation.id,
    )
    db.add(ai_message)
    
    # 确保所有更改都被提交
    db.commit()
    
    # 刷新所有对象以获取最新状态
    db.refresh(conversation)
    db.refresh(ai_message)

    # 返回对话信息
    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "topic": conversation.topic,
        "summary": conversation.summary,
        "background_url": conversation.background_url,
        "user_id": conversation.user_id,
        "character_id": conversation.character_id,
        "updated_at": conversation.updated_at.isoformat() if conversation.updated_at else None
    }

@router.get("/user/{user_id}", response_model=List[dict])
def get_user_conversations(user_id: str, db: Session = Depends(get_db)) -> Any:
    """获取用户的所有对话"""
    # 检查用户是否存在
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在",
        )
    
    # 获取用户的所有对话
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id
    ).order_by(Conversation.updated_at.desc()).all()
    
    # 构建响应
    result = []
    for conv in conversations:
        # 获取角色信息
        character = db.query(Character).filter(Character.id == conv.character_id).first()
        
        result.append({
            "id": str(conv.id),
            "title": conv.title,
            "topic": conv.topic,
            "summary": conv.summary,
            "backgroundUrl": conv.background_url,
            "updatedAt": conv.updated_at.isoformat(),
            "character": {
                "id": str(character.id),
                "name": character.name,
                "avatar": character.avatar_url,
            } if character else None
        })
    
    return result