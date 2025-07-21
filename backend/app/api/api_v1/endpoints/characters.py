from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.db.session import get_db
from app.models.models import Character, CharacterTag, Conversation
from app.schemas.character import CharacterCreate, CharacterResponse, CharacterWithTags

router = APIRouter()

@router.get("/default", response_model=List[CharacterWithTags])
def get_default_characters(db: Session = Depends(get_db)) -> Any:
    """获取所有默认角色"""
    characters = db.query(Character).filter(Character.is_default == True).all()
    
    result = []
    for character in characters:
        # 获取角色的标签
        tags = [tag.tag for tag in character.tags]
        
        # 构建响应
        result.append(CharacterWithTags(
            id=character.id,
            name=character.name,
            description=character.description,
            avatar=character.avatar_url,
            isDefault=character.is_default,
            tags=tags,
        ))
    
    return result

@router.get("/users/{user_id}", response_model=List[CharacterWithTags])
def get_user_characters(user_id: str, db: Session = Depends(get_db)) -> Any:
    """获取指定用户创建的角色列表
    
    参数:
        - user_id: 用户ID
        
    返回数据格式：
    [{
        "id": string,
        "name": string,
        "description": string,
        "avatarUrl": string,
        "isDefault": boolean,
        "tags": string[]
    }]
    """
    # 获取用户创建的所有角色
    characters = db.query(Character).filter(
        Character.created_by == user_id,
        Character.is_default == False  # 只获取用户创建的非默认角色
    ).all()
    
    result = []
    for character in characters:
        # 获取角色的标签
        tags = [tag.tag for tag in character.tags]
        
        # 构建响应，确保字段名称与前端一致
        result.append({
            "id": str(character.id),  # 确保ID是字符串类型
            "name": character.name,
            "description": character.description,
            "avatarUrl": character.avatar_url,  # 修改为avatarUrl以匹配前端
            "isDefault": character.is_default,
            "tags": tags
        })
    
    return result

@router.get("/{character_id}", response_model=CharacterWithTags)
def get_character(character_id: str, db: Session = Depends(get_db)) -> Any:
    """获取单个角色"""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="角色不存在",
        )
    
    # 获取角色的标签
    tags = [tag.tag for tag in character.tags]
    
    # 构建响应
    return CharacterWithTags(
        id=character.id,
        name=character.name,
        description=character.description,
        avatar=character.avatar_url,
        isDefault=character.is_default,
        tags=tags,
    )

@router.post("/create", response_model=CharacterResponse)
def create_character(character_in: CharacterCreate, user_id: str, db: Session = Depends(get_db)) -> Any:
    """创建新角色"""
    # 创建角色
    character = Character(
        name=character_in.name,
        description=character_in.description,
        avatar_url=character_in.avatar,
        is_default=False,
        created_by=user_id,
    )
    db.add(character)
    db.flush()  # 获取ID
    
    # 添加标签
    if character_in.tags:
        for tag in character_in.tags:
            char_tag = CharacterTag(character_id=character.id, tag=tag)
            db.add(char_tag)
    
    db.commit()
    db.refresh(character)
    
    return CharacterResponse(
        id=character.id,
        name=character.name,
        description=character.description,
        avatar=character.avatar_url,
        isDefault=character.is_default,
    )

@router.get("/sessions/{character_id}", response_model=List[dict])
def get_character_sessions(character_id: str, user_id: str, db: Session = Depends(get_db)) -> Any:
    """获取角色的所有对话"""
    # 检查角色是否存在
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="角色不存在",
        )
    
    # 获取该角色与用户的所有对话
    conversations = db.query(Character.conversations).filter(
        Character.id == character_id,
        Conversation.user_id == user_id,
    ).all()
    
    # 构建响应
    result = []
    for conv in conversations:
        result.append({
            "id": conv.id,
            "title": conv.title,
            "scene": conv.topic,  # 前端期望scene字段
            "summary": conv.summary,
            "timestamp": conv.updated_at.isoformat(),  # 前端期望timestamp字段
        })
    
    return result