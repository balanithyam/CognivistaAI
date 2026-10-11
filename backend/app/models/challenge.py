import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    challenge_type = Column(String(50), index=True, nullable=False) 
    # Types: "spatial_rotation", "memory_span", "logic_deduction", "numerical_sequence", 
    #        "verbal_analogy", "lateral_scenario", "live_intelligence", "challenge_fusion"
    
    primary_domain = Column(String(50), index=True, nullable=False) # logic, numerical, spatial, memory, verbal, lateral, attention
    secondary_domains = Column(JSON, default=list) # e.g. ["memory", "spatial"] for fusion
    
    title = Column(String(255), nullable=False)
    prompt = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    
    # Dynamic payload feeding specific Arena components
    payload = Column(JSON, nullable=False)
    
    # Verification & hints
    correct_answer = Column(JSON, nullable=False)
    acceptable_answers = Column(JSON, default=list) # for NLP semantic matching
    hint = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    
    difficulty_rating = Column(Float, default=1200.0) # Elo rating (e.g., 900 to 2200)
    estimated_time_seconds = Column(Integer, default=60)
    tags = Column(JSON, default=list) # e.g. ["3d-rotation", "mental-transformation"]
    
    # Real-world Intelligence tracking
    source_info = Column(JSON, default=lambda: {
        "is_live": False,
        "source_name": None,
        "source_url": None,
        "timestamp": None
    })
    
    created_by_agent = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    attempts = relationship("Attempt", back_populates="challenge", cascade="all, delete-orphan")
