import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.models.user import User
from app.models.cognitive_profile import CognitiveProfile

logger = logging.getLogger("cognivista.api.auth")
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token invalid or expired. Please re-authenticate."
        )
    user_id = payload.get("sub")
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or disabled.")
    return user

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email exists
    email_stmt = select(User).where(User.email == req.email.lower())
    res_e = await db.execute(email_stmt)
    if res_e.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered.")

    # Check if username exists
    user_stmt = select(User).where(User.username == req.username.strip())
    res_u = await db.execute(user_stmt)
    if res_u.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username is already taken.")

    # Create User
    new_user = User(
        email=req.email.lower(),
        username=req.username.strip(),
        full_name=req.full_name or req.username,
        hashed_password=hash_password(req.password)
    )
    db.add(new_user)
    await db.flush()

    # Create associated Cognitive Profile
    profile = CognitiveProfile(user_id=new_user.id)
    db.add(profile)
    await db.commit()

    # Note: User must sign in on the sign-in page, no auto-login token is issued
    return {
        "success": True,
        "message": "Cognivista training account registered successfully. Please sign in to initialize your training environment."
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    identifier = req.username_or_email.strip().lower()
    stmt = select(User).where((User.email == identifier) | (User.username == identifier))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Verify your username/email and password."
        )

    # Fetch profile
    prof_stmt = select(CognitiveProfile).where(CognitiveProfile.user_id == user.id)
    prof_res = await db.execute(prof_stmt)
    profile = prof_res.scalar_one_or_none()

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "composite_elo": profile.composite_elo if profile else 1200.0,
            "current_streak": profile.current_streak if profile else 0,
            "total_solved": profile.total_solved if profile else 0
        }
    }

@router.get("/me")
async def me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    prof_stmt = select(CognitiveProfile).where(CognitiveProfile.user_id == current_user.id)
    prof_res = await db.execute(prof_stmt)
    profile = prof_res.scalar_one_or_none()

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "settings": current_user.settings,
        "profile": {
            "composite_elo": profile.composite_elo if profile else 1200.0,
            "current_streak": profile.current_streak if profile else 0,
            "best_streak": profile.best_streak if profile else 0,
            "total_solved": profile.total_solved if profile else 0,
            "total_attempts": profile.total_attempts if profile else 0,
            "domain_ratings": profile.domain_ratings if profile else {},
            "skill_strengths": profile.skill_strengths if profile else [],
            "skill_weaknesses": profile.skill_weaknesses if profile else []
        }
    }
