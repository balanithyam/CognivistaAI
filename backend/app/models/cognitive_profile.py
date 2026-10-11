import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class CognitiveProfile(Base):
    __tablename__ = "cognitive_profiles"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Adaptive metrics
    composite_elo = Column(Float, default=1200.0)
    total_solved = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    total_time_ms = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    
    # Fine-grained domain ratings (Elo style ~800 to 2400)
    domain_ratings = Column(JSON, default=lambda: {
        "logic": 1200.0,
        "numerical": 1200.0,
        "spatial": 1200.0,
        "memory": 1200.0,
        "verbal": 1200.0,
        "lateral": 1200.0,
        "attention": 1200.0
    })

    # Domain specific attempt & accuracy trackers
    domain_stats = Column(JSON, default=lambda: {
        "logic": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0},
        "numerical": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0},
        "spatial": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0},
        "memory": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0},
        "verbal": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0},
        "lateral": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0},
        "attention": {"solved": 0, "attempts": 0, "avg_time_ms": 0, "hints_used": 0}
    })

    # Cognitive skill links & strengths
    skill_strengths = Column(JSON, default=list) # e.g. ["mental_rotation", "pattern_recognition"]
    skill_weaknesses = Column(JSON, default=list) # e.g. ["dual_task_working_memory", "numerical_deduction"]
    accuracy_history = Column(JSON, default=list) # list of {timestamp, elo, domain, is_correct, reaction_ms}
    cognitive_bottlenecks = Column(JSON, default=list) # insights inferred by agent
    
    last_trained_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="profile")
