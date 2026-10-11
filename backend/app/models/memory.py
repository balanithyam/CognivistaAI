import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class AgentMemory(Base):
    __tablename__ = "agent_memories"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    memory_type = Column(String(50), index=True, nullable=False) 
    # e.g., "preference", "session_state", "mistake_trend", "recent_feedback"
    
    key = Column(String(100), nullable=False) # e.g. "disliked_domains", "target_difficulty_offset", "focus_fusion"
    value = Column(JSON, nullable=False)
    confidence = Column(Float, default=1.0)
    
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="memories")
