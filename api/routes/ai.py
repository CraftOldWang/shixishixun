from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/options")
async def get_ai_suggestions(reply: str):
    return JSONResponse(content={
        "options": [
            "这是示例追问选项1",
            "这是示例追问选项2",
            "这是示例追问选项3"
        ]
    })

@router.post("/response")
async def get_ai_response(user_input: str, conversation_id: str):
    return JSONResponse(content={
        "id": "new-ai-msg-uuid",
        "conversationId": conversation_id,
        "content": "这是AI的示例回复",
        "isUser": False,
        "timestamp": "2025-07-20T10:00:00Z"
    })
