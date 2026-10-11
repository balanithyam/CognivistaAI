import re
import json
import logging
from typing import Dict, Any, List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.core.config import settings

logger = logging.getLogger("cognivista.nlp.evaluator")

class SemanticEvaluator:
    """
    Evaluates natural language, verbal, riddle, and lateral thinking answers.
    Combines TF-IDF / character n-gram cosine distance, keyword concept anchoring,
    and optional LLM semantic analysis.
    """

    def __init__(self):
        self._vectorizer = TfidfVectorizer(ngram_range=(1, 3), analyzer="char_wb")

    def _normalize(self, text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'[^\w\s]', '', text)
        return ' '.join(text.split())

    def _token_jaccard(self, s1: str, s2: str) -> float:
        set1 = set(s1.split())
        set2 = set(s2.split())
        if not set1 or not set2:
            return 0.0
        return len(set1 & set2) / len(set1 | set2)

    def _tfidf_similarity(self, s1: str, s2: str) -> float:
        try:
            tfidf_matrix = self._vectorizer.fit_transform([s1, s2])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(sim)
        except Exception:
            return 0.0

    async def evaluate_answer(
        self,
        user_response: Any,
        correct_answer: Any,
        acceptable_answers: Optional[List[str]] = None,
        challenge_type: str = "generic",
        prompt_context: str = ""
    ) -> Dict[str, Any]:
        """
        Unified evaluation: handles numbers, lists, strings, and natural language.
        """
        acceptable_answers = acceptable_answers or []

        # 1. Deterministic / Exact structured evaluation
        if isinstance(correct_answer, bool):
            user_bool = str(user_response).strip().lower() in ["true", "1", "yes", "t"]
            is_correct = user_bool == correct_answer
            return {
                "is_correct": is_correct,
                "confidence": 1.0,
                "score_fraction": 1.0 if is_correct else 0.0,
                "method": "boolean_exact",
                "feedback": "Correct decision!" if is_correct else "Incorrect decision on this statement."
            }

        # If user_response is a number or dict/list matching exact structure
        if isinstance(correct_answer, (int, float)) or (isinstance(correct_answer, str) and correct_answer.strip().isdigit()):
            try:
                user_val = float(str(user_response).strip())
                corr_val = float(str(correct_answer).strip())
                is_correct = abs(user_val - corr_val) < 1e-4
                return {
                    "is_correct": is_correct,
                    "confidence": 1.0,
                    "score_fraction": 1.0 if is_correct else 0.0,
                    "method": "numerical_exact",
                    "feedback": "Correct numerical computation!" if is_correct else f"Computed value {user_val} does not match expected {corr_val}."
                }
            except (ValueError, TypeError):
                pass

        if isinstance(correct_answer, list) and isinstance(user_response, list):
            # Check ordered or set match
            is_correct = user_response == correct_answer
            return {
                "is_correct": is_correct,
                "confidence": 1.0,
                "score_fraction": 1.0 if is_correct else 0.0,
                "method": "list_exact",
                "feedback": "Flawless sequence execution!" if is_correct else "Sequence ordering diverged from the optimal pattern."
            }

        if isinstance(correct_answer, dict) and isinstance(user_response, dict):
            is_correct = user_response == correct_answer
            return {
                "is_correct": is_correct,
                "confidence": 1.0,
                "score_fraction": 1.0 if is_correct else 0.0,
                "method": "dict_exact",
                "feedback": "Exact configuration verified." if is_correct else "Configuration mismatch detected."
            }

        # 2. Text / Verbal / Natural Language Evaluation
        user_str = str(user_response).strip()
        corr_str = str(correct_answer).strip()

        norm_user = self._normalize(user_str)
        norm_corr = self._normalize(corr_str)

        # Exact normalized match
        if norm_user == norm_corr:
            return {
                "is_correct": True,
                "confidence": 1.0,
                "score_fraction": 1.0,
                "method": "normalized_exact",
                "feedback": "Precisely on target."
            }

        # Check acceptable alternate answers
        for alt in acceptable_answers:
            if self._normalize(str(alt)) == norm_user:
                return {
                    "is_correct": True,
                    "confidence": 1.0,
                    "score_fraction": 1.0,
                    "method": "acceptable_synonym",
                    "feedback": "Valid alternative interpretation recognized."
                }

        # Check if user answer contains the target or vice versa
        if len(norm_corr) > 3 and (norm_corr in norm_user or norm_user in norm_corr):
            jaccard = self._token_jaccard(norm_user, norm_corr)
            if jaccard > 0.4 or len(norm_user.split()) <= 3:
                return {
                    "is_correct": True,
                    "confidence": 0.9,
                    "score_fraction": 1.0,
                    "method": "substring_containment",
                    "feedback": "Key concept accurately identified."
                }

        # TF-IDF cosine comparison against target and all acceptable answers
        max_sim = self._tfidf_similarity(norm_user, norm_corr)
        for alt in acceptable_answers:
            sim = self._tfidf_similarity(norm_user, self._normalize(str(alt)))
            if sim > max_sim:
                max_sim = sim

        # 3. LLM-Assisted Semantic Evaluation for Lateral & Semantic scenarios if API key configured
        if settings.GEMINI_API_KEY and challenge_type in ["verbal_analogy", "lateral_scenario", "live_intelligence"] and len(user_str) > 10:
            llm_result = await self._evaluate_with_gemini(user_str, corr_str, acceptable_answers, prompt_context)
            if llm_result is not None:
                return llm_result

        # Threshold based semantic verdict
        # n-gram char_wb similarity above 0.72 indicates high semantic overlap
        is_semantic_match = max_sim >= 0.72
        partial_match = max_sim >= 0.55

        if is_semantic_match:
            return {
                "is_correct": True,
                "confidence": round(max_sim, 2),
                "score_fraction": 1.0,
                "method": "tfidf_semantic_high",
                "feedback": "Semantically equivalent answer recognized."
            }
        elif partial_match:
            return {
                "is_correct": False,
                "confidence": round(max_sim, 2),
                "score_fraction": 0.5,
                "method": "tfidf_semantic_partial",
                "feedback": "Partially aligned with the target principle, but misses critical nuance."
            }
        else:
            return {
                "is_correct": False,
                "confidence": round(1.0 - max_sim, 2),
                "score_fraction": 0.0,
                "method": "tfidf_semantic_low",
                "feedback": "Response diverges from the logical conclusion."
            }

    async def _evaluate_with_gemini(
        self,
        user_str: str,
        corr_str: str,
        acceptable_answers: List[str],
        prompt_context: str
    ) -> Optional[Dict[str, Any]]:
        """Call Gemini to evaluate nuanced lateral thinking responses."""
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            eval_prompt = f"""
You are Cognivista's Semantic Evaluation Agent.
Challenge Prompt: {prompt_context}
Target Core Answer: {corr_str}
Acceptable Variations: {acceptable_answers}
User's Natural Language Submission: "{user_str}"

Evaluate if the user's response captures the necessary cognitive insight, deductive resolution, or lateral premise.
Return ONLY valid JSON with keys:
- "is_correct": boolean
- "score_fraction": float between 0.0 and 1.0
- "feedback": short 1-2 sentence direct explanation of why it is right or what cognitive mechanism was missed
- "cognitive_deviation": string describing the specific cognitive error (e.g. "premise overlooked", "superficial association", "correct lateral pivot")
"""
            response = await client.aio.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=eval_prompt
            )
            raw = response.text.strip()
            # Clean JSON markdown if wrapped
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?\s*", "", raw)
                raw = re.sub(r"\s*```$", "", raw)
            data = json.loads(raw)
            return {
                "is_correct": bool(data.get("is_correct", False)),
                "confidence": 0.95,
                "score_fraction": float(data.get("score_fraction", 0.0)),
                "method": "gemini_llm_semantic",
                "feedback": data.get("feedback", "Evaluated by neural semantic analyzer."),
                "deviation_analysis": {
                    "cognitive_deviation": data.get("cognitive_deviation", "Semantic variance"),
                    "llm_verified": True
                }
            }
        except Exception as e:
            logger.warning("Gemini semantic evaluation skipped: %s", e)
            return None

semantic_evaluator = SemanticEvaluator()
