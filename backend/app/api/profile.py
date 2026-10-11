import logging
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.cognitive_profile import CognitiveProfile
from app.models.attempt import Attempt
from app.models.challenge import Challenge
from app.agent.orchestrator import orchestrator

logger = logging.getLogger("cognivista.api.profile")
router = APIRouter(prefix="/api/profile", tags=["Cognitive Profile"])

@router.get("")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile = await orchestrator.get_or_create_profile(db, current_user.id)
    acc = round((profile.total_solved / max(1, profile.total_attempts)) * 100, 1)
    
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "composite_elo": round(profile.composite_elo, 1),
        "total_solved": profile.total_solved,
        "total_attempts": profile.total_attempts,
        "accuracy_percent": acc,
        "current_streak": profile.current_streak,
        "best_streak": profile.best_streak,
        "domain_ratings": profile.domain_ratings,
        "skill_strengths": profile.skill_strengths,
        "skill_weaknesses": profile.skill_weaknesses,
        "accuracy_history": profile.accuracy_history[-20:] if profile.accuracy_history else [],
        "last_trained_at": profile.last_trained_at.isoformat() if profile.last_trained_at else None
    }

@router.get("/constellation")
async def get_skill_constellation(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns graph representation of the cognitive constellation.
    Nodes represent core cognitive faculties with adaptive size, vibrancy, and Elo mastery.
    Edges represent cross-domain synaptic pathways.
    """
    profile = await orchestrator.get_or_create_profile(db, current_user.id)
    ratings = profile.domain_ratings or {}

    nodes = [
        {"id": "logic", "name": "Logic & Deduction", "elo": ratings.get("logic", 1200.0), "x": 0.5, "y": 0.15, "color": "#8b5cf6"},
        {"id": "spatial", "name": "Spatial & Rotation", "elo": ratings.get("spatial", 1200.0), "x": 0.85, "y": 0.35, "color": "#00f5a0"},
        {"id": "memory", "name": "Working Memory", "elo": ratings.get("memory", 1200.0), "x": 0.75, "y": 0.8, "color": "#38bdf8"},
        {"id": "numerical", "name": "Numerical Reasoning", "elo": ratings.get("numerical", 1200.0), "x": 0.25, "y": 0.8, "color": "#fbbf24"},
        {"id": "verbal", "name": "Verbal & Analogies", "elo": ratings.get("verbal", 1200.0), "x": 0.15, "y": 0.35, "color": "#f43f5e"},
        {"id": "lateral", "name": "Lateral Thinking", "elo": ratings.get("lateral", 1200.0), "x": 0.35, "y": 0.45, "color": "#a855f7"},
        {"id": "attention", "name": "Attention & Speed", "elo": ratings.get("attention", 1200.0), "x": 0.65, "y": 0.45, "color": "#34d399"}
    ]

    edges = [
        {"source": "logic", "target": "numerical", "synergy": 0.85},
        {"source": "logic", "target": "lateral", "synergy": 0.75},
        {"source": "spatial", "target": "memory", "synergy": 0.90}, # Visuospatial sketchpad
        {"source": "spatial", "target": "attention", "synergy": 0.80},
        {"source": "memory", "target": "attention", "synergy": 0.85}, # Central executive
        {"source": "verbal", "target": "lateral", "synergy": 0.88},
        {"source": "numerical", "target": "logic", "synergy": 0.80},
        {"source": "lateral", "target": "spatial", "synergy": 0.65}
    ]

    # Calculate recent active nodes from accuracy history
    recent_active_domains = []
    if profile.accuracy_history:
        recent_active_domains = [h.get("domain") for h in profile.accuracy_history[-5:] if h.get("domain")]

    return {
        "nodes": nodes,
        "edges": edges,
        "composite_elo": profile.composite_elo,
        "recent_active_domains": list(set(recent_active_domains))
    }

@router.get("/history")
async def get_attempt_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve chronological history of completed challenges and reasoning reviews."""
    stmt = (
        select(Attempt, Challenge)
        .join(Challenge, Attempt.challenge_id == Challenge.id)
        .where(Attempt.user_id == current_user.id)
        .order_by(desc(Attempt.attempted_at))
        .limit(30)
    )
    res = await db.execute(stmt)
    rows = res.all()

    history = []
    for att, ch in rows:
        history.append({
            "attempt_id": att.id,
            "challenge_id": ch.id,
            "challenge_title": ch.title,
            "challenge_type": ch.challenge_type,
            "domain": ch.primary_domain,
            "difficulty": ch.difficulty_rating,
            "prompt": ch.prompt,
            "correct_answer": ch.correct_answer,
            "explanation": ch.explanation,
            "payload": ch.payload,
            "user_response": att.user_response,
            "is_correct": att.is_correct,
            "response_time_ms": att.response_time_ms,
            "hints_used": att.hints_used,
            "score_earned": att.score_earned,
            "pre_attempt_elo": att.pre_attempt_elo,
            "post_attempt_elo": att.post_attempt_elo,
            "feedback": att.feedback,
            "mistake_analysis": att.mistake_analysis,
            "attempted_at": att.attempted_at.isoformat()
        })

    return {"history": history}

