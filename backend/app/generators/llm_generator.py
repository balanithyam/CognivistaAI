import logging
import json
import re
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("cognivista.generators.llm")

class LLMChallengeGenerator:
    """
    Leverages Gemini LLM to synthesize nuanced lateral scenarios,
    verbal analogies, and tailored remediation challenges based on user mistakes.
    """

    async def generate_verbal_or_lateral(
        self,
        domain: str = "verbal",
        target_difficulty: float = 1200.0,
        user_mistake_context: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Call Gemini to generate a fresh reasoning challenge."""
        if not settings.GEMINI_API_KEY:
            return None

        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)

            context_clause = ""
            if user_mistake_context:
                context_clause = (
                    f"The user recently struggled with: {user_mistake_context.get('mistake_analysis', {})}. "
                    f"Design a challenge that gently addresses this specific cognitive mechanism."
                )

            system_instruction = f"""
You are Cognivista's Cognitive Training Generator.
Create a FRESH, UNIQUE, challenging mental reasoning exercise in domain: '{domain}'.
Target Elo Difficulty: {target_difficulty} (Scale: 1000=Beginner, 1300=Intermediate, 1600=Advanced, 2000=Master).
{context_clause}

Respond ONLY with a valid JSON object with the following structure:
{{
  "title": "short evocative title",
  "prompt": "clear, engaging scenario or puzzle statement",
  "description": "brief cognitive context",
  "challenge_type": "{domain}_scenario",
  "primary_domain": "{domain}",
  "secondary_domains": ["critical_thinking"],
  "payload": {{
    "requires_natural_language_answer": true,
    "hint_stage_1": "gentle directional nudge"
  }},
  "correct_answer": "concise core logical answer",
  "acceptable_answers": ["synonym 1", "synonym 2", "alternate phrasing"],
  "hint": "one clear strategic clue without giving it away",
  "explanation": "concise, direct explanation of the cognitive logic and why this resolution holds",
  "tags": ["{domain}", "llm-generated"]
}}
"""

            response = await client.aio.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=system_instruction
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?\s*", "", raw)
                raw = re.sub(r"\s*```$", "", raw)

            data = json.loads(raw)
            data["difficulty_rating"] = target_difficulty
            data["created_by_agent"] = True
            return data
        except Exception as e:
            logger.warning("LLM challenge generation failed: %s", e)
            return None

llm_generator = LLMChallengeGenerator()
