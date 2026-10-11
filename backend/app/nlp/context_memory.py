import logging
from typing import Dict, Any, List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.memory import AgentMemory
from app.models.attempt import Attempt
from app.models.challenge import Challenge
from app.models.conversation import ConversationMessage

logger = logging.getLogger("cognivista.nlp.memory")

class ContextMemoryManager:
    """
    Manages conversational and cognitive training memory for the agent.
    Ensures the agent maintains continuity across challenges, requests, and sessions.
    """

    async def get_user_session_context(self, db: AsyncSession, user_id: str) -> Dict[str, Any]:
        """Fetch active memory context for the current user."""
        # Get latest memories
        stmt = select(AgentMemory).where(AgentMemory.user_id == user_id)
        result = await db.execute(stmt)
        memories = result.scalars().all()
        
        memory_map: Dict[str, Any] = {}
        for m in memories:
            memory_map[m.key] = m.value

        # Get last attempted challenge to resolve references like "the last one" or "harder"
        last_attempt_stmt = (
            select(Attempt, Challenge)
            .join(Challenge, Attempt.challenge_id == Challenge.id)
            .where(Attempt.user_id == user_id)
            .order_by(desc(Attempt.attempted_at))
            .limit(1)
        )
        last_res = await db.execute(last_attempt_stmt)
        last_row = last_res.first()

        last_challenge_info = None
        if last_row:
            attempt, challenge = last_row
            last_challenge_info = {
                "id": challenge.id,
                "type": challenge.challenge_type,
                "domain": challenge.primary_domain,
                "difficulty": challenge.difficulty_rating,
                "was_correct": attempt.is_correct,
                "response_time_ms": attempt.response_time_ms,
                "mistake_analysis": attempt.mistake_analysis
            }

        # Get recent dialogue turns (last 5)
        conv_stmt = (
            select(ConversationMessage)
            .where(ConversationMessage.user_id == user_id)
            .order_by(desc(ConversationMessage.created_at))
            .limit(5)
        )
        conv_res = await db.execute(conv_stmt)
        recent_msgs = conv_res.scalars().all()
        recent_dialogue = [
            {"role": m.role, "content": m.content, "intent": m.intent}
            for m in reversed(recent_msgs)
        ]

        recent_challenges = await self.get_recent_challenges_history(db, user_id, limit=5)

        return {
            "user_id": user_id,
            "disliked_domains": memory_map.get("disliked_domains", []),
            "preferred_domains": memory_map.get("preferred_domains", []),
            "target_difficulty_offset": memory_map.get("target_difficulty_offset", 0.0),
            "last_domain": last_challenge_info["domain"] if last_challenge_info else None,
            "last_challenge": last_challenge_info,
            "recent_challenges": recent_challenges,
            "recent_dialogue": recent_dialogue
        }

    async def get_recent_challenges_history(self, db: AsyncSession, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Fetch the last N attempted challenges to detect repetition and enforce variety."""
        stmt = (
            select(Attempt, Challenge)
            .join(Challenge, Attempt.challenge_id == Challenge.id)
            .where(Attempt.user_id == user_id)
            .order_by(desc(Attempt.attempted_at))
            .limit(limit)
        )
        res = await db.execute(stmt)
        rows = res.all()
        history = []
        for attempt, challenge in rows:
            payload = challenge.payload if isinstance(challenge.payload, dict) else {}
            fmt = payload.get("interaction_format", challenge.challenge_type)
            history.append({
                "challenge_id": challenge.id,
                "type": challenge.challenge_type,
                "domain": challenge.primary_domain,
                "format": fmt,
                "title": challenge.title,
                "difficulty": challenge.difficulty_rating,
                "was_correct": attempt.is_correct
            })
        return history

    async def update_memory(
        self,
        db: AsyncSession,
        user_id: str,
        memory_type: str,
        key: str,
        value: Any,
        confidence: float = 1.0
    ):
        """Upsert a memory record."""
        stmt = select(AgentMemory).where(AgentMemory.user_id == user_id, AgentMemory.key == key)
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.value = value
            existing.confidence = confidence
            existing.memory_type = memory_type
        else:
            new_mem = AgentMemory(
                user_id=user_id,
                memory_type=memory_type,
                key=key,
                value=value,
                confidence=confidence
            )
            db.add(new_mem)
        await db.commit()

context_memory = ContextMemoryManager()
