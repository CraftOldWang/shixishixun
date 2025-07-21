from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.db.session import get_db
from app.models.models import Conversation, Message, Character, User
from app.schemas.conversation import ConversationCreate, ConversationResponse, ConversationWithMessages

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
        "backgroundUrl": conversation.background_url,
        "userId": conversation.user_id,
        "characterId": conversation.character_id,
        "updatedAt": conversation.updated_at.isoformat(),
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

@router.post("/", response_model=ConversationWithMessages)
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
        title=conversation_in.title or f"与{character.name}的对话",
        topic=conversation_in.topic,
        user_id=user_id,
        character_id=conversation_in.character_id,
    )
    db.add(conversation)
    db.flush()  # 获取ID
    
    # 创建用户的第一条消息
    user_message = Message(
        content=conversation_in.first_message,
        is_user=True,
        conversation_id=conversation.id,
    )
    db.add(user_message)
    
    # 创建AI的回复消息
    # 这里应该调用AI服务获取回复，暂时使用模拟数据
    ai_message = Message(
        content=f"你好！我是{character.name}。{character.description}",
        is_user=False,
        conversation_id=conversation.id,
    )
    db.add(ai_message)
    
    db.commit()
    db.refresh(conversation)
    
    # 构建响应
    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "topic": conversation.topic,
        "summary": conversation.summary,
        "backgroundUrl": conversation.background_url,
        "userId": conversation.user_id,
        "characterId": conversation.character_id,
        "updatedAt": conversation.updated_at.isoformat(),
        "messages": [
            {
                "id": str(user_message.id),
                "conversationId": str(conversation.id),
                "content": user_message.content,
                "isUser": user_message.is_user,
                "timestamp": user_message.timestamp.isoformat(),
            },
            {
                "id": str(ai_message.id),
                "conversationId": str(conversation.id),
                "content": ai_message.content,
                "isUser": ai_message.is_user,
                "timestamp": ai_message.timestamp.isoformat(),
            },
        ],
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