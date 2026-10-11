import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    challenge_id = Column(String(36), ForeignKey("challenges.id", ondelete="CASCADE"), index=True, nullable=False)
    
    user_response = Column(JSON, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    score_earned = Column(Float, default=0.0)
    response_time_ms = Column(Integer, nullable=False)
    hints_used = Column(Integer, default=0)
    
    pre_attempt_elo = Column(Float, nullable=False)
    post_attempt_elo = Column(Float, nullable=False)
    
    feedback = Column(Text, nullable=False)
    mistake_analysis = Column(JSON, default=dict) # {cognitive_mechanism, specific_deviation, remediation}
    attempted_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="attempts")
    challenge = relationship("Challenge", back_populates="attempts")
