import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    settings = Column(JSON, default=lambda: {
        "sound_enabled": True,
        "haptics_visual": True,
        "color_blind_mode": False,
        "preferred_difficulty": "adaptive"
    })

    # Relationships
    profile = relationship("CognitiveProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("ConversationMessage", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("AgentMemory", back_populates="user", cascade="all, delete-orphan")
