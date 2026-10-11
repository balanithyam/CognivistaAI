import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    role = Column(String(20), nullable=False) # "user" or "agent"
    content = Column(Text, nullable=False)
    
    intent = Column(String(50), nullable=True) # "challenge_request", "adjust_difficulty", etc.
    extracted_entities = Column(JSON, default=dict)
    contextual_metadata = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="conversations")
