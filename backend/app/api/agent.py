import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.conversation import ConversationMessage
from app.agent.orchestrator import orchestrator

logger = logging.getLogger("cognivista.api.agent")
router = APIRouter(prefix="/api/agent", tags=["Autonomous Agent"])

class InteractRequest(BaseModel):
    prompt: str
    active_challenge_id: Optional[str] = None

@router.post("/interact")
async def interact(
    req: InteractRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Main communication channel between the user and the autonomous Cognivista agent.
    Understands freeform natural language, modifies context, and returns targeted actions/challenges.
    """
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Empty prompt provided.")

    try:
        result = await orchestrator.process_user_input(
            db=db,
            user_id=current_user.id,
            user_text=req.prompt.strip(),
            active_challenge_id=req.active_challenge_id
        )
        return {
            "success": True,
            "response": result["response"],
            "action_type": result["action_type"],
            "challenge": result["challenge"],
            "profile": result["profile"]
        }
    except Exception as e:
        logger.exception("Agent interaction failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Agent reasoning processing error: {str(e)}")

@router.get("/session")
async def get_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve dialogue history for current session."""
    stmt = (
        select(ConversationMessage)
        .where(ConversationMessage.user_id == current_user.id)
        .order_by(desc(ConversationMessage.created_at))
        .limit(20)
    )
    result = await db.execute(stmt)
    messages = result.scalars().all()

    return {
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "intent": m.intent,
                "created_at": m.created_at.isoformat()
            }
            for m in reversed(messages)
        ]
    }
