from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from models.models import Character, User
from schemas.schemas import CharacterCreate, CharacterResponse
from core.auth import get_current_active_user

router = APIRouter(
    prefix="/api/characters",
    tags=["characters"],
    responses={404: {"description": "Not found"}},
)

@router.get("/default", response_model=List[CharacterResponse])
def get_characters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取所有角色列表"""
    characters = db.query(Character).offset(skip).limit(limit).all()
    return characters

@router.get("/{character_id}", response_model=CharacterResponse)
def get_character(character_id: int, db: Session = Depends(get_db)):
    """获取特定角色信息"""
    character = db.query(Character).filter(Character.id == character_id).first()
    if character is None:
        raise HTTPException(status_code=404, detail="角色不存在")
    return character

@router.post("/", response_model=CharacterResponse)
def create_character(
    character: CharacterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建新角色（需要管理员权限）"""
    # 这里可以添加管理员权限检查
    db_character = Character(**character.dict())
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character 