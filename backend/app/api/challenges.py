import logging
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.challenge import Challenge
from app.models.attempt import Attempt
from app.agent.orchestrator import orchestrator
from app.agent.adaptive_engine import adaptive_engine

logger = logging.getLogger("cognivista.api.challenges")
router = APIRouter(prefix="/api/challenges", tags=["Challenges"])

class SubmitAttemptRequest(BaseModel):
    challenge_id: str
    user_response: Any
    response_time_ms: int
    hints_used: int = 0

class StudioGenerateRequest(BaseModel):
    domain: str = "logic"
    difficulty_rating: Optional[float] = None
    is_fusion: bool = False
    secondary_domain: Optional[str] = None
    is_live: bool = False

@router.post("/submit")
async def submit_challenge_attempt(
    req: SubmitAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits user answer to active challenge.
    Computes semantic/exact evaluation, updates cognitive Elo, logs attempt,
    diagnoses mistake mechanism, and prepares the next adaptive step.
    """
    try:
        result = await orchestrator.submit_attempt(
            db=db,
            user_id=current_user.id,
            challenge_id=req.challenge_id,
            user_response=req.user_response,
            response_time_ms=req.response_time_ms,
            hints_used=req.hints_used
        )
        return {
            "success": True,
            **result
        }
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        logger.exception("Failed to submit attempt: %s", e)
        raise HTTPException(status_code=500, detail=f"Evaluation error: {str(e)}")

@router.get("/adaptive/next")
async def get_adaptive_next_challenge(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Autonomous engine decides and synthesizes the next optimal challenge
    based on the user's live cognitive state.
    """
    profile = await orchestrator.get_or_create_profile(db, current_user.id)
    recommendation = adaptive_engine.recommend_next_step(
        profile_data={
            "domain_ratings": profile.domain_ratings,
            "current_streak": profile.current_streak,
            "skill_weaknesses": profile.skill_weaknesses
        }
    )

    if recommendation.get("is_fusion"):
        challenge = await orchestrator._generate_fusion_challenge(
            db,
            recommendation["target_domain"],
            recommendation["secondary_domain"] or "spatial",
            recommendation["target_difficulty"]
        )
    else:
        challenge = await orchestrator._generate_challenge_by_domain(
            db,
            recommendation["target_domain"],
            recommendation["target_difficulty"]
        )

    return {
        "success": True,
        "recommendation": recommendation,
        "challenge": challenge
    }

@router.post("/studio/generate")
async def studio_generate(
    req: StudioGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Challenge Studio: On-demand dynamic challenge generator with parameter controls.
    Generates fresh runtime challenges with infinite permutations.
    """
    profile = await orchestrator.get_or_create_profile(db, current_user.id)
    target_diff = req.difficulty_rating or profile.composite_elo

    if req.is_live:
        challenge = await orchestrator._generate_live_challenge(db, target_diff)
    elif req.is_fusion:
        sec = req.secondary_domain or "spatial"
        challenge = await orchestrator._generate_fusion_challenge(db, req.domain, sec, target_diff)
    else:
        challenge = await orchestrator._generate_challenge_by_domain(db, req.domain, target_diff)

    return {
        "success": True,
        "challenge": challenge
    }

@router.get("/live")
async def get_live_arena_challenge(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Live Brain Arena: Fetches genuine live real-world challenges.
    Shows source name, URL, and timestamp.
    """
    profile = await orchestrator.get_or_create_profile(db, current_user.id)
    challenge = await orchestrator._generate_live_challenge(db, profile.composite_elo)
    return {
        "success": True,
        "challenge": challenge
    }

@router.get("/library")
async def get_quiz_library(
    current_user: User = Depends(get_current_user)
):
    """
    Returns curated Wayground-style multi-subject quiz library.
    Contains ready-to-launch real-world quizzes across Math, Speed, Logic, Riddles, Science, and Life Skills.
    """
    library_quizzes = [
        {
            "id": "lib-math-discount",
            "title": "Smart Shopping: Discounts & Sales Math",
            "subject": "math",
            "badge": "Everyday Math",
            "description": "Calculate 15%, 25%, and 50% flash sales, checkout discounts, and shopping change.",
            "questions_count": 5,
            "difficulty": "Beginner / Intermediate",
            "difficulty_level": "easy",
            "plays_count": "18.4k",
            "tags": ["math", "shopping", "percentages", "money"],
            "prompt_trigger": "Give me a shopping discount math challenge"
        },
        {
            "id": "lib-speed-stroop",
            "title": "Lightning Reflexes: The Stroop Color Test",
            "subject": "speed",
            "badge": "Speed & Focus",
            "description": "Rapid color-word conflict reaction. Click the ink color before the 5-second timer runs out!",
            "questions_count": 6,
            "difficulty": "All Levels",
            "difficulty_level": "all",
            "plays_count": "34.2k",
            "tags": ["speed", "stroop", "attention", "reflexes"],
            "prompt_trigger": "Give me a speed color reflex test"
        },
        {
            "id": "lib-logic-detective",
            "title": "Podium Detective: 100m Sprint Finish",
            "subject": "logic",
            "badge": "Detective Logic",
            "description": "Analyze race clues and eliminate impossible suspects to determine the medal positions.",
            "questions_count": 4,
            "difficulty": "Intermediate",
            "difficulty_level": "medium",
            "plays_count": "9.5k",
            "tags": ["logic", "detective", "deduction", "clues"],
            "prompt_trigger": "Give me a detective deduction puzzle"
        },
        {
            "id": "lib-words-riddles",
            "title": "Clever Lateral Riddles & Word Analogies",
            "subject": "language",
            "badge": "Words & Riddles",
            "description": "Test your creative lateral thinking, word associations, and funny everyday paradoxes.",
            "questions_count": 5,
            "difficulty": "Fun / All Levels",
            "difficulty_level": "all",
            "plays_count": "28.7k",
            "tags": ["english", "riddles", "analogies", "words"],
            "prompt_trigger": "Give me a clever riddle"
        },
        {
            "id": "lib-science-energy",
            "title": "Everyday Physics & Home Energy Smarts",
            "subject": "science",
            "badge": "Practical Science",
            "description": "Why ice cubes float, smart phone battery charging truth, and running appliance electric costs.",
            "questions_count": 5,
            "difficulty": "Intermediate",
            "difficulty_level": "medium",
            "plays_count": "15.3k",
            "tags": ["science", "physics", "tech", "everyday-life"],
            "prompt_trigger": "Give me an everyday science or life skills challenge"
        },
        {
            "id": "lib-life-travel",
            "title": "World Traveler: Time Zone Flight Math",
            "subject": "life_skills",
            "badge": "Life Skills",
            "description": "Calculate international flight arrival times, jetlag time differences, and local currency values.",
            "questions_count": 4,
            "difficulty": "Advanced",
            "difficulty_level": "hard",
            "plays_count": "11.2k",
            "tags": ["travel", "time-zones", "geography", "life-skills"],
            "prompt_trigger": "Give me a real-world travel time zone challenge"
        },
        {
            "id": "lib-memory-matrix",
            "title": "Memory Matrix: Visual Tile Span",
            "subject": "memory",
            "badge": "Memory Matrix",
            "description": "Watch glowing tiles flash on the grid for 2.5 seconds, then tap all the illuminated positions from memory.",
            "questions_count": 5,
            "difficulty": "Intermediate",
            "difficulty_level": "medium",
            "plays_count": "22.0k",
            "tags": ["memory", "tiles", "visual-recall"],
            "prompt_trigger": "Let us train memory tile span"
        },
        {
            "id": "lib-visual-shapes",
            "title": "Visual Patterns: Shape Rotation Sandbox",
            "subject": "visual",
            "badge": "Visual Shapes",
            "description": "Mentally rotate 2D & 3D geometric shapes by 90° or 180° clockwise and spot the correct matching figure.",
            "questions_count": 5,
            "difficulty": "Intermediate",
            "difficulty_level": "medium",
            "plays_count": "14.8k",
            "tags": ["shapes", "geometry", "patterns", "visual"],
            "prompt_trigger": "Give me a visual shape rotation puzzle"
        }
    ]
    return {
        "success": True,
        "quizzes": library_quizzes,
        "total": len(library_quizzes)
    }

@router.get("/{challenge_id}")
async def get_challenge_by_id(
    challenge_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Challenge).where(Challenge.id == challenge_id)
    res = await db.execute(stmt)
    challenge = res.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found.")
    return challenge

@router.get("/{challenge_id}/hint")
async def get_challenge_hint(
    challenge_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Challenge).where(Challenge.id == challenge_id)
    res = await db.execute(stmt)
    challenge = res.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found.")
    return {
        "challenge_id": challenge_id,
        "hint": challenge.hint
    }

@router.get("/attempt/{attempt_id}")
async def get_attempt_detail(
    attempt_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve full attempt review details for Challenge Review view."""
    stmt = (
        select(Attempt, Challenge)
        .join(Challenge, Attempt.challenge_id == Challenge.id)
        .where(Attempt.id == attempt_id, Attempt.user_id == current_user.id)
    )
    res = await db.execute(stmt)
    row = res.first()
    if not row:
        raise HTTPException(status_code=404, detail="Attempt not found.")
    att, ch = row
    return {
        "attempt_id": att.id,
        "challenge_id": ch.id,
        "title": ch.title,
        "challenge_type": ch.challenge_type,
        "domain": ch.primary_domain,
        "difficulty": ch.difficulty_rating,
        "prompt": ch.prompt,
        "payload": ch.payload,
        "user_response": att.user_response,
        "correct_answer": ch.correct_answer,
        "is_correct": att.is_correct,
        "response_time_ms": att.response_time_ms,
        "hints_used": att.hints_used,
        "score_earned": att.score_earned,
        "pre_attempt_elo": att.pre_attempt_elo,
        "post_attempt_elo": att.post_attempt_elo,
        "feedback": att.feedback,
        "mistake_analysis": att.mistake_analysis,
        "explanation": ch.explanation,
        "attempted_at": att.attempted_at.isoformat()
    }

class ExplainMistakeRequest(BaseModel):
    user_query: Optional[str] = "Why was my answer wrong?"

@router.post("/attempt/{attempt_id}/explain")
async def explain_attempt_mistake(
    attempt_id: str,
    req: ExplainMistakeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Conversational mistake analysis for a specific completed attempt.
    Analyzes user's actual submitted answer against the solution and mistake mechanism.
    """
    stmt = (
        select(Attempt, Challenge)
        .join(Challenge, Attempt.challenge_id == Challenge.id)
        .where(Attempt.id == attempt_id, Attempt.user_id == current_user.id)
    )
    res = await db.execute(stmt)
    row = res.first()
    if not row:
        raise HTTPException(status_code=404, detail="Attempt not found.")
    att, ch = row

    if att.is_correct:
        return {
            "explanation": f"Your response '{att.user_response}' was actually completely correct! You accurately solved this {ch.title} challenge in {round(att.response_time_ms / 1000, 1)} seconds."
        }

    # Generate personalized breakdown
    analysis = att.mistake_analysis or {}
    mech = analysis.get("mechanism", "reasoning error").replace("_", " ")
    dev = analysis.get("specific_deviation", "")
    remed = analysis.get("remediation", "Carefully check each constraint before choosing.")

    explanation_text = (
        f"For '{ch.title}', you selected: {att.user_response}, while the correct answer was: {ch.correct_answer}. "
        f"The primary reason was a {mech}: {dev if dev else 'the submitted choice did not satisfy all the problem constraints.'} "
        f"Remedy: {remed} "
        f"Core Principle: {ch.explanation}"
    )

    return {
        "attempt_id": att.id,
        "is_correct": False,
        "user_response": att.user_response,
        "correct_answer": ch.correct_answer,
        "mistake_mechanism": mech,
        "agent_explanation": explanation_text
    }

