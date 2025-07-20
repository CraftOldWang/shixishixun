from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional

router = APIRouter(prefix="/api/topics", tags=["topics"])

@router.get("/predefined")
async def get_predefined_topics():
    return JSONResponse(content={
        "Daily Life": [
            "Ordering coffee",
            "Talking about the weather"
        ],
        "Work & Career": [
            "Preparing for a job interview"
        ]
    })

@router.post("/generate")
async def generate_topics(prompt: Optional[str] = None):
    return JSONResponse(content={
        "topics": [
            "How technology changed communication",
            "The ethics of AI-generated content",
            "Explaining blockchain to a 5-year-old"
        ]
    })
