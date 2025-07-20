from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register(username: str, password: str, email: str):
    return JSONResponse(
        status_code=201,
        content={
            "id": "new-user-uuid",
            "username": username,
            "email": email
        }
    )

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return JSONResponse(content={
        "access_token": "your.jwt.token.here",
        "token_type": "bearer"
    })

@router.get("/users/me")
async def get_current_user():
    return JSONResponse(content={
        "id": "user-id-from-jwt",
        "username": "Akkarin",
        "email": "user.email@example.com"
    })
