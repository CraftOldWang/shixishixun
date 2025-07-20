from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.db.session import get_db
from app.models.models import Wordcard
from app.schemas.wordcard import WordcardCreate, WordcardResponse

router = APIRouter()

@router.get("/check", response_model=bool)
def check_if_favorited(word: str, user_id: str, db: Session = Depends(get_db)) -> Any:
    """检查单词是否已收藏"""
    wordcard = db.query(Wordcard).filter(
        Wordcard.word == word,
        Wordcard.user_id == user_id
    ).first()
    
    return wordcard is not None

@router.post("/add", response_model=WordcardResponse)
def add_favorite(wordcard_in: WordcardCreate, user_id: str, db: Session = Depends(get_db)) -> Any:
    """添加收藏单词"""
    # 检查是否已收藏
    existing = db.query(Wordcard).filter(
        Wordcard.word == wordcard_in.word,
        Wordcard.user_id == user_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="单词已收藏",
        )
    
    # 创建单词卡
    wordcard = Wordcard(
        word=wordcard_in.word,
        pronunciation=wordcard_in.pronunciation,
        pos=wordcard_in.pos,
        context=wordcard_in.context,
        user_id=user_id,
    )
    db.add(wordcard)
    db.commit()
    db.refresh(wordcard)
    
    return WordcardResponse(
        id=wordcard.id,
        word=wordcard.word,
        pronunciation=wordcard.pronunciation,
        pos=wordcard.pos,
        context=wordcard.context,
        created_at=wordcard.created_at,
    )

@router.post("/remove")
def remove_favorite(word: str, user_id: str, db: Session = Depends(get_db)) -> Any:
    """移除收藏单词"""
    wordcard = db.query(Wordcard).filter(
        Wordcard.word == word,
        Wordcard.user_id == user_id
    ).first()
    
    if not wordcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="单词未收藏",
        )
    
    db.delete(wordcard)
    db.commit()
    
    return {"status": "success"}

@router.get("/list", response_model=List[WordcardResponse])
def get_favorites(user_id: str, db: Session = Depends(get_db)) -> Any:
    """获取用户收藏的单词列表"""
    wordcards = db.query(Wordcard).filter(Wordcard.user_id == user_id).all()
    
    result = []
    for card in wordcards:
        result.append(WordcardResponse(
            id=card.id,
            word=card.word,
            pronunciation=card.pronunciation,
            pos=card.pos,
            context=card.context,
            created_at=card.created_at,
        ))
    
    return result