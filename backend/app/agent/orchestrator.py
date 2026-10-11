import random
import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.config import settings
from app.models.user import User
from app.models.cognitive_profile import CognitiveProfile
from app.models.challenge import Challenge
from app.models.attempt import Attempt
from app.models.conversation import ConversationMessage
from app.nlp.intent_parser import intent_parser
from app.nlp.semantic_evaluator import semantic_evaluator
from app.nlp.context_memory import context_memory
from app.agent.adaptive_engine import adaptive_engine
from app.generators.procedural import procedural_generator
from app.generators.spatial_generator import spatial_generator
from app.generators.memory_generator import memory_generator
from app.generators.logic_generator import logic_generator
from app.generators.fusion_generator import fusion_generator
from app.generators.live_data_service import live_data_service
from app.generators.llm_generator import llm_generator
from app.generators.genre_generator import genre_generator
from app.generators.wayground_fetcher import wayground_fetcher

logger = logging.getLogger("cognivista.agent.orchestrator")

class AgentOrchestrator:
    """
    Cognivista Autonomous Agent Orchestrator.
    Manages the continuous cognitive loop:
    NLP understanding → context recall → dynamic generation → interaction →
    response evaluation → reasoning review → profile update → adaptive prescription.
    """

    async def get_or_create_profile(self, db: AsyncSession, user_id: str) -> CognitiveProfile:
        stmt = select(CognitiveProfile).where(CognitiveProfile.user_id == user_id)
        result = await db.execute(stmt)
        profile = result.scalar_one_or_none()
        if not profile:
            profile = CognitiveProfile(user_id=user_id)
            db.add(profile)
            await db.commit()
            await db.refresh(profile)
        return profile

    async def process_user_input(
        self,
        db: AsyncSession,
        user_id: str,
        user_text: str,
        active_challenge_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main entry point for user interaction with Cognivista.
        Understands natural language and decides the autonomous action.
        """
        # 1. Fetch user context & memory
        context = await context_memory.get_user_session_context(db, user_id)
        profile = await self.get_or_create_profile(db, user_id)

        # 2. NLP Intent Parsing
        parsed = intent_parser.parse(user_text, context)
        intent = parsed["intent"]

        # Save user message to persistent conversation
        user_msg = ConversationMessage(
            user_id=user_id,
            role="user",
            content=user_text,
            intent=intent,
            extracted_entities=parsed
        )
        db.add(user_msg)
        await db.commit()

        # 3. Handle Negations & Preferences in Memory
        if parsed["excluded_domains"]:
            current_dislikes = set(context.get("disliked_domains", []))
            current_dislikes.update(parsed["excluded_domains"])
            await context_memory.update_memory(
                db, user_id, "preference", "disliked_domains", list(current_dislikes)
            )

        if parsed["difficulty_delta"] != 0:
            current_offset = context.get("target_difficulty_offset", 0.0) + parsed["difficulty_delta"]
            await context_memory.update_memory(
                db, user_id, "preference", "target_difficulty_offset", current_offset
            )

        # 4. Route based on autonomous intent
        response_text = ""
        generated_challenge = None
        action_type = "chat"

        # Case A: Request Hint for active challenge
        if intent == "request_hint" and active_challenge_id:
            c_stmt = select(Challenge).where(Challenge.id == active_challenge_id)
            c_res = await db.execute(c_stmt)
            curr_ch = c_res.scalar_one_or_none()
            if curr_ch:
                action_type = "hint"
                response_text = f"Hint: {curr_ch.hint}"
            else:
                response_text = "I don't have an active challenge open for you to hint on. Say 'start training' to begin."

        # Case B: Query Cognitive Profile / Progress
        elif intent == "query_profile":
            action_type = "profile_overview"
            total = profile.total_solved
            acc = round((profile.total_solved / max(1, profile.total_attempts)) * 100, 1)
            elo = round(profile.composite_elo, 1)
            
            # Find best and struggling domains
            d_ratings = profile.domain_ratings or {}
            sorted_d = sorted(d_ratings.items(), key=lambda x: x[1], reverse=True)
            top_domain = sorted_d[0][0].capitalize() if sorted_d else "Logic"
            growth_domain = sorted_d[-1][0].capitalize() if sorted_d else "Memory"

            response_text = (
                f"Your active cognitive mastery stands at Elo {elo} across {total} completed challenges ({acc}% accuracy). "
                f"Your highest functioning cluster is currently {top_domain} ({round(sorted_d[0][1], 1)}), "
                f"while {growth_domain} ({round(sorted_d[-1][1], 1)}) offers the strongest neuroplastic growth potential."
            )

        # Case B2: Explain Mistake ("Why was my answer wrong?")
        elif intent == "explain_mistake":
            action_type = "mistake_explained"
            last_ch = context.get("last_challenge")
            if last_ch and last_ch.get("mistake_analysis"):
                analysis = last_ch["mistake_analysis"]
                mech = analysis.get("mechanism", "reasoning deviation")
                remed = analysis.get("remediation", "Review the key relationships before committing an answer.")
                dev = analysis.get("specific_deviation", "")
                response_text = (
                    f"On your previous attempt for '{last_ch.get('type', 'challenge')}', the deviation was identified as {mech.replace('_', ' ')}. "
                    f"{dev} Suggestion: {remed}"
                )
            elif last_ch:
                response_text = (
                    f"In your recent challenge, the submitted response differed from the target solution. "
                    f"Double check the boundary conditions and stated clues."
                )
            else:
                response_text = "No previous challenge attempt found in this session to review."

        # Case C: Domain Preference / Dislike statement (e.g. "not numbers today")
        elif intent == "domain_preference":
            action_type = "preference_updated"
            disliked = ", ".join(parsed["excluded_domains"])
            # Immediately generate an alternative
            recommendation = adaptive_engine.recommend_next_step(
                {"domain_ratings": profile.domain_ratings, "current_streak": profile.current_streak}
            )
            # Pick a domain not in excluded
            candidates = [d for d in ["spatial", "logic", "memory", "verbal", "lateral"] if d not in parsed["excluded_domains"]]
            chosen_domain = candidates[0] if candidates else "logic"
            generated_challenge = await self._generate_challenge_by_domain(
                db, chosen_domain, profile.composite_elo
            )
            response_text = f"Got it! Skipping {disliked} today. Let's work on {chosen_domain.capitalize()} instead."
            action_type = "challenge_served"

        # Case D: Continue Training / Next Step
        # Case D: Continue Training / Next Step
        elif intent in ["continue_training", "challenge_request", "fusion_challenge_request", "live_challenge_request", "difficulty_adjust"]:
            action_type = "challenge_served"
            
            # Determine target domain & difficulty
            target_difficulty = profile.composite_elo + parsed["difficulty_delta"] + context.get("target_difficulty_offset", 0.0)
            specific_entity = parsed.get("specific_entity")

            if specific_entity:
                generated_challenge, response_text = await self._generate_challenge_by_entity(db, specific_entity, target_difficulty)

            elif intent == "live_challenge_request" or parsed["is_live"]:
                generated_challenge = await self._generate_live_challenge(db, target_difficulty)
                response_text = "Here is a real-world everyday puzzle to test your practical thinking."

            elif intent == "fusion_challenge_request" or parsed["is_fusion"]:
                doms = parsed["included_domains"]
                d1 = doms[0] if len(doms) > 0 else "memory"
                d2 = doms[1] if len(doms) > 1 else "spatial"
                generated_challenge = await self._generate_fusion_challenge(db, d1, d2, target_difficulty)
                response_text = f"Double workout! Combining {d1.capitalize()} + {d2.capitalize()}."

            else:
                # Use specified domain or adaptively prescribe
                if parsed["included_domains"]:
                    chosen_domain = parsed["included_domains"][0]
                elif parsed["references_last_challenge"] and context.get("last_domain"):
                    chosen_domain = context["last_domain"]
                else:
                    recommendation = adaptive_engine.recommend_next_step(
                        {"domain_ratings": profile.domain_ratings, "current_streak": profile.current_streak}
                    )
                    chosen_domain = recommendation["target_domain"]

                generated_challenge = await self._generate_challenge_by_domain(db, chosen_domain, target_difficulty)
                response_text = f"Ready! Here is your fresh {chosen_domain.capitalize()} workout."

        # Fallback / Natural dialogue
        else:
            action_type = "chat"
            response_text = (
                "Tell me what you'd like to exercise today—like 'everyday math', 'speed reflex test', 'detective logic', 'clever riddles', or 'memory tiles'. "
                "Or simply tap one of the quick workout chips below!"
            )

        # Save agent response to conversation history
        agent_msg = ConversationMessage(
            user_id=user_id,
            role="agent",
            content=response_text,
            intent=action_type,
            contextual_metadata={"challenge_id": generated_challenge.id if generated_challenge else None}
        )
        db.add(agent_msg)
        await db.commit()

        return {
            "response": response_text,
            "action_type": action_type,
            "challenge": generated_challenge,
            "profile": {
                "composite_elo": profile.composite_elo,
                "current_streak": profile.current_streak,
                "total_solved": profile.total_solved,
                "domain_ratings": profile.domain_ratings
            }
        }

    async def _persist_challenge_data(self, db: AsyncSession, data: dict, difficulty: float) -> Challenge:
        """Helper to cleanly instantiate, validate, and persist challenge records."""
        challenge = Challenge(
            challenge_type=data["challenge_type"],
            primary_domain=data["primary_domain"],
            secondary_domains=data.get("secondary_domains", []),
            title=data["title"],
            prompt=data["prompt"],
            description=data.get("description", ""),
            payload=data["payload"],
            correct_answer=data["correct_answer"],
            acceptable_answers=data.get("acceptable_answers", []),
            hint=data["hint"],
            explanation=data["explanation"],
            difficulty_rating=data.get("difficulty_rating", difficulty),
            tags=data.get("tags", []),
            source_info=data.get("source_info", {"is_live": False})
        )
        db.add(challenge)
        await db.commit()
        await db.refresh(challenge)
        return challenge

    async def _generate_challenge_by_entity(self, db: AsyncSession, entity: str, difficulty: float) -> tuple:
        """Direct routing for specific puzzle types requested in natural language."""
        data = None
        response_text = "Here is your requested challenge."

        if entity == "logic_gears":
            data = wayground_fetcher.get_wayground_challenge("logic_gears", difficulty=difficulty)
            response_text = "Synthesizing your custom Interlocking Gear Train challenge with rotating gears and direction vectors."
        elif entity == "science_circuits":
            data = wayground_fetcher.get_wayground_challenge("science_circuits", difficulty=difficulty)
            response_text = "Here is your Electric Circuit Schematic challenge."
        elif entity == "logic_balance":
            data = wayground_fetcher.get_wayground_challenge("logic_balance", difficulty=difficulty)
            response_text = "Here is your Balance Scale Weight Deduction challenge."
        elif entity == "math_geometry":
            data = wayground_fetcher.get_wayground_challenge("math_geometry", difficulty=difficulty)
            response_text = "Here is your Geometry Triangle Interior Angle challenge."
        elif entity == "math_fractions":
            data = wayground_fetcher.get_wayground_challenge("math_fractions", difficulty=difficulty)
            response_text = "Here is your Fraction Pie Chart challenge."
        elif entity == "science_energy":
            data = wayground_fetcher.get_wayground_challenge("science_energy", difficulty=difficulty)
            response_text = "Here is your Home Thermal & Power Draw Meter challenge."
        elif entity == "math_discount":
            data = genre_generator.generate_math_challenge(difficulty, math_type="discount")
            response_text = "Here is your Everyday Shopping & Discount Math challenge."
        elif entity == "math_energy_bill":
            data = genre_generator.generate_math_challenge(difficulty, math_type="energy_bill")
            response_text = "Here is your Household Appliance Energy & Utility Cost challenge."
        elif entity == "detective":
            data = genre_generator.generate_logic_challenge(difficulty)
            response_text = "Here is your Detective Logic & Clue Deduction challenge."
        elif entity == "speed_stroop":
            data = genre_generator.generate_speed_focus_challenge(difficulty)
            response_text = "Here is your Speed & Reflex Stroop Test challenge."
        elif entity == "memory_matrix":
            data = memory_generator.generate_span_challenge(difficulty)
            response_text = "Here is your Memory Tile Matrix recall challenge."
        elif entity == "verbal_anagram":
            data = genre_generator.generate_language_challenge(difficulty)
            response_text = "Here is your Word Anagram solving challenge."
        else:
            data = wayground_fetcher.get_wayground_challenge(difficulty=difficulty)
            response_text = "Here is your tailored curriculum challenge."

        challenge = await self._persist_challenge_data(db, data, difficulty)
        return challenge, response_text

    async def _generate_challenge_by_domain(self, db: AsyncSession, domain: str, difficulty: float) -> Challenge:
        """Route to appropriate challenge synthesis engine."""
        data = None

        if domain in ["speed", "attention"]:
            data = genre_generator.generate_speed_focus_challenge(difficulty)
        elif domain in ["numerical", "math"]:
            data = genre_generator.generate_math_challenge(difficulty)
        elif domain == "logic":
            data = genre_generator.generate_logic_challenge(difficulty)
        elif domain in ["verbal", "lateral", "language"]:
            data = genre_generator.generate_language_challenge(difficulty)
        elif domain in ["science", "life_skills"]:
            data = genre_generator.generate_science_life_challenge(difficulty)
        elif domain == "memory":
            data = memory_generator.generate_span_challenge(difficulty)
        elif domain == "spatial":
            data = spatial_generator.generate_rotation_challenge(difficulty)
        elif domain in ["visual", "wayground", "diagram", "shapes", "diagrams"]:
            data = wayground_fetcher.get_wayground_challenge(difficulty=difficulty)
        else:
            # 30% chance to serve a visual Wayground challenge for variety
            if random.random() < 0.30:
                data = wayground_fetcher.get_wayground_challenge(difficulty=difficulty)
            else:
                data = genre_generator.generate_by_genre(domain, difficulty)

        # Fallback safeguard
        if not data:
            data = genre_generator.generate_by_genre("random", difficulty)

        return await self._persist_challenge_data(db, data, difficulty)

    async def _generate_fusion_challenge(self, db: AsyncSession, d1: str, d2: str, difficulty: float) -> Challenge:
        data = fusion_generator.generate_fusion_challenge(d1, d2, difficulty)
        challenge = Challenge(
            challenge_type=data["challenge_type"],
            primary_domain=data["primary_domain"],
            secondary_domains=data.get("secondary_domains", []),
            title=data["title"],
            prompt=data["prompt"],
            description=data.get("description", ""),
            payload=data["payload"],
            correct_answer=data["correct_answer"],
            acceptable_answers=data.get("acceptable_answers", []),
            hint=data["hint"],
            explanation=data["explanation"],
            difficulty_rating=data.get("difficulty_rating", difficulty),
            tags=data.get("tags", []),
            source_info=data.get("source_info", {"is_live": False})
        )
        db.add(challenge)
        await db.commit()
        await db.refresh(challenge)
        return challenge

    async def _generate_live_challenge(self, db: AsyncSession, difficulty: float) -> Challenge:
        data = await live_data_service.generate_live_challenge(difficulty)
        challenge = Challenge(
            challenge_type=data["challenge_type"],
            primary_domain=data["primary_domain"],
            secondary_domains=data.get("secondary_domains", []),
            title=data["title"],
            prompt=data["prompt"],
            description=data.get("description", ""),
            payload=data["payload"],
            correct_answer=data["correct_answer"],
            acceptable_answers=data.get("acceptable_answers", []),
            hint=data["hint"],
            explanation=data["explanation"],
            difficulty_rating=data.get("difficulty_rating", difficulty),
            tags=data.get("tags", []),
            source_info=data.get("source_info", {"is_live": True})
        )
        db.add(challenge)
        await db.commit()
        await db.refresh(challenge)
        return challenge

    async def submit_attempt(
        self,
        db: AsyncSession,
        user_id: str,
        challenge_id: str,
        user_response: Any,
        response_time_ms: int,
        hints_used: int = 0
    ) -> Dict[str, Any]:
        """
        Evaluates the user's attempt, updates their cognitive profile,
        performs reasoning error diagnosis, and determines the next adaptive challenge.
        """
        c_stmt = select(Challenge).where(Challenge.id == challenge_id)
        c_res = await db.execute(c_stmt)
        challenge = c_res.scalar_one_or_none()
        if not challenge:
            raise ValueError(f"Challenge {challenge_id} not found.")

        profile = await self.get_or_create_profile(db, user_id)
        pre_elo = profile.composite_elo

        # Evaluate Answer using NLP / Semantic evaluator
        eval_result = await semantic_evaluator.evaluate_answer(
            user_response=user_response,
            correct_answer=challenge.correct_answer,
            acceptable_answers=challenge.acceptable_answers,
            challenge_type=challenge.challenge_type,
            prompt_context=challenge.prompt
        )

        is_correct = eval_result["is_correct"]

        # Calculate Elo and rating update via adaptive engine
        new_composite_elo, delta = adaptive_engine.update_rating(
            current_elo=profile.composite_elo,
            challenge_difficulty=challenge.difficulty_rating,
            is_correct=is_correct,
            response_time_ms=response_time_ms,
            estimated_time_sec=challenge.estimated_time_seconds,
            hints_used=hints_used,
            total_user_attempts=profile.total_attempts
        )

        # Update domain-specific Elo
        d_ratings = dict(profile.domain_ratings or {})
        dom = challenge.primary_domain
        cur_dom_elo = d_ratings.get(dom, 1200.0)
        new_dom_elo, dom_delta = adaptive_engine.update_rating(
            current_elo=cur_dom_elo,
            challenge_difficulty=challenge.difficulty_rating,
            is_correct=is_correct,
            response_time_ms=response_time_ms,
            estimated_time_sec=challenge.estimated_time_seconds,
            hints_used=hints_used,
            total_user_attempts=profile.total_attempts
        )
        d_ratings[dom] = new_dom_elo
        profile.domain_ratings = d_ratings

        # Diagnose error mechanism for Reasoning Review
        diagnosis = adaptive_engine.diagnose_mistake(
            challenge=challenge,
            user_response=user_response,
            is_correct=is_correct,
            response_time_ms=response_time_ms,
            hints_used=hints_used
        )

        # Update profile stats
        profile.composite_elo = new_composite_elo
        profile.total_attempts += 1
        profile.total_time_ms += response_time_ms
        if is_correct:
            profile.total_solved += 1
            profile.current_streak += 1
            if profile.current_streak > profile.best_streak:
                profile.best_streak = profile.current_streak
        else:
            profile.current_streak = 0

        # Update accuracy history point
        acc_hist = list(profile.accuracy_history or [])
        acc_hist.append({
            "challenge_id": challenge.id,
            "domain": dom,
            "is_correct": is_correct,
            "response_time_ms": response_time_ms,
            "elo_after": new_composite_elo,
            "difficulty": challenge.difficulty_rating
        })
        if len(acc_hist) > 50:
            acc_hist = acc_hist[-50:]
        profile.accuracy_history = acc_hist

        # Update strengths / weaknesses
        strengths = set(profile.skill_strengths or [])
        weaknesses = set(profile.skill_weaknesses or [])
        if is_correct and delta > 0:
            strengths.add(dom)
            weaknesses.discard(dom)
        elif not is_correct:
            weaknesses.add(dom)
            strengths.discard(dom)
        profile.skill_strengths = list(strengths)
        profile.skill_weaknesses = list(weaknesses)

        # Create Attempt record
        attempt = Attempt(
            user_id=user_id,
            challenge_id=challenge.id,
            user_response=user_response,
            is_correct=is_correct,
            score_earned=1.0 if is_correct else 0.0,
            response_time_ms=response_time_ms,
            hints_used=hints_used,
            pre_attempt_elo=pre_elo,
            post_attempt_elo=new_composite_elo,
            feedback=eval_result.get("feedback", ""),
            mistake_analysis=diagnosis
        )
        db.add(attempt)
        await db.commit()
        await db.refresh(attempt)

        # Prepare next recommendation autonomously
        recommendation = adaptive_engine.recommend_next_step(
            profile_data={
                "domain_ratings": profile.domain_ratings,
                "current_streak": profile.current_streak,
                "skill_weaknesses": profile.skill_weaknesses
            },
            last_attempt={
                "domain": dom,
                "difficulty": challenge.difficulty_rating,
                "is_correct": is_correct
            }
        )

        return {
            "attempt_id": attempt.id,
            "is_correct": is_correct,
            "score_delta": delta,
            "new_elo": new_composite_elo,
            "domain_elo": new_dom_elo,
            "feedback": eval_result.get("feedback", ""),
            "explanation": challenge.explanation,
            "correct_answer": challenge.correct_answer,
            "mistake_analysis": diagnosis,
            "recommendation": recommendation,
            "profile_summary": {
                "composite_elo": profile.composite_elo,
                "total_solved": profile.total_solved,
                "current_streak": profile.current_streak,
                "domain_ratings": profile.domain_ratings
            }
        }

orchestrator = AgentOrchestrator()
