from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import Any, List, Dict
import os
from fastapi.responses import FileResponse
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_db
from app.models.models import Message, Conversation, Character
from app.schemas.ai import AiOptionsRequest, AiResponseRequest, AiOptionsResponse
from app.services.ai_service import get_ai_options, get_ai_response
from app.services.tts_service import tts_service

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice: str = "zh-CN-XiaoxiaoNeural"  # 默认中文女声
    rate: str = "+0%"  # 默认语速
    volume: str = "+0%"  # 默认音量

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

@router.post("/response", response_model=Dict[str, Any])
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

@router.post("/tts", response_class=FileResponse)
def text_to_speech(request: TTSRequest) -> Any:
    """将文本转换为语音"""
    try:
        # 创建音频文件目录
        audio_dir = os.path.join(os.getcwd(), "audio_files")
        os.makedirs(audio_dir, exist_ok=True)
        
        # 生成唯一的文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(audio_dir, f"tts_{timestamp}.wav")
        
        # 设置TTS参数
        tts_service.set_voice(request.voice)
        tts_service.set_rate(request.rate)
        tts_service.set_volume(request.volume)
        
        # 转换文本为语音
        audio_file = tts_service.text_to_speech(request.text, output_file)
        if not audio_file:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="语音生成失败",
            )
        
        # 返回音频文件
        return FileResponse(
            audio_file,
            media_type="audio/wav",
            filename=os.path.basename(audio_file)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"语音生成失败: {str(e)}",
        )

@router.get("/voices")
def get_available_voices() -> List[dict]:
    """获取可用的语音列表"""
    return [
        {"id": "zh-CN-XiaoxiaoNeural", "name": "晓晓（女声，中文）"},
        {"id": "zh-CN-YunxiNeural", "name": "云希（男声，中文）"},
        {"id": "zh-CN-YunyangNeural", "name": "云扬（男声，中文）"},
        {"id": "en-US-JennyNeural", "name": "Jenny（女声，英文）"},
        {"id": "en-US-GuyNeural", "name": "Guy（男声，英文）"},
    ]