import math
from typing import Dict, Any, List, Tuple

class AdaptiveEngine:
    """
    Cognivista Adaptive Dynamic Difficulty & Cognitive Modeling Engine.
    Scales puzzle difficulty to the user's real performance in plain, encouraging language.
    """

    DEFAULT_ELO = 1200.0

    def calculate_expected_score(self, user_elo: float, challenge_difficulty: float) -> float:
        """Standard logistic expectation: E = 1 / (1 + 10^((D - R) / 400))."""
        return 1.0 / (1.0 + math.pow(10.0, (challenge_difficulty - user_elo) / 400.0))

    def update_rating(
        self,
        current_elo: float,
        challenge_difficulty: float,
        is_correct: bool,
        response_time_ms: int,
        estimated_time_sec: int = 60,
        hints_used: int = 0,
        total_user_attempts: int = 0
    ) -> Tuple[float, float]:
        k_factor = 32.0 if total_user_attempts < 15 else 20.0
        expected = self.calculate_expected_score(current_elo, challenge_difficulty)
        
        if is_correct:
            actual = max(0.5, 1.0 - (hints_used * 0.25))
        else:
            actual = 0.0

        # Latency multiplier (encourages cognitive fluency without rushing)
        benchmark_ms = estimated_time_sec * 1000
        time_ratio = response_time_ms / max(1000, benchmark_ms)
        
        speed_modifier = 1.0
        if is_correct:
            if time_ratio < 0.5: # Fast and correct
                speed_modifier = 1.2
            elif time_ratio > 1.8: # Very slow
                speed_modifier = 0.9

        delta = k_factor * (actual - expected) * speed_modifier
        new_elo = max(600.0, min(2600.0, current_elo + delta))
        return round(new_elo, 1), round(delta, 1)

    def diagnose_mistake(
        self,
        challenge: Any,
        user_response: Any,
        is_correct: bool,
        response_time_ms: int,
        hints_used: int
    ) -> Dict[str, Any]:
        """
        Diagnoses the specific cognitive error in simple, friendly, actionable English.
        """
        if is_correct:
            if hints_used > 0:
                return {
                    "mechanism": "Great Problem Solving",
                    "specific_deviation": "You used a hint wisely to reach the right conclusion.",
                    "remediation": "Next time, try spending 10 more seconds visualizing the pattern before checking hints."
                }
            if response_time_ms < 4000:
                return {
                    "mechanism": "Lightning Reflexes",
                    "specific_deviation": f"Solved cleanly in under {round(response_time_ms/1000, 1)} seconds! Super sharp focus.",
                    "remediation": "You're in the zone. Let's try combining two brain powers together."
                }
            return {
                "mechanism": "Methodical & Accurate",
                "specific_deviation": "You took your time, verified the details, and found the exact solution.",
                "remediation": "As you get more confident, challenge yourself to solve a little faster."
            }

        # Failure diagnostics in plain human English
        c_type = getattr(challenge, "challenge_type", "generic")

        if response_time_ms < 3000:
            return {
                "mechanism": "Fast Guess Trap",
                "specific_deviation": f"Submitted in only {round(response_time_ms/1000, 1)}s. The brain often rushes when a pattern looks familiar at first glance.",
                "remediation": "Take a 3-second breath before locking in your final choice."
            }

        if c_type == "spatial_rotation":
            return {
                "mechanism": "Mirrored Shape Trap",
                "specific_deviation": "You picked a figure that was flipped like a mirror reflection instead of purely rotated.",
                "remediation": "Pick one distinct corner tile on the shape and mentally follow where that single tile lands after turning."
            }

        if c_type == "memory_span":
            return {
                "mechanism": "Sequence Memory Slip",
                "specific_deviation": "One or two tiles were tapped in reverse or out of order.",
                "remediation": "Try grouping the tiles into a little shape or story in your head as they light up."
            }

        if c_type == "numerical_sequence":
            return {
                "mechanism": "Linear Pattern Trap",
                "specific_deviation": "Assumed the numbers only added up by a fixed step, missing alternating operations or quadratic growth.",
                "remediation": "Calculate the difference between each pair of numbers to reveal the hidden step rule."
            }

        return {
            "mechanism": "Tricky Clue Trap",
            "specific_deviation": "One of the conditions or constraints was overlooked in the final check.",
            "remediation": "Cross off choices you know are 100% impossible first."
        }

    def recommend_next_step(self, profile_data: Dict[str, Any], last_attempt: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Friendly, encouraging next workout recommendation.
        """
        domain_ratings = profile_data.get("domain_ratings", {})
        
        if last_attempt and not last_attempt.get("is_correct"):
            target_domain = last_attempt.get("domain", "logic")
            target_difficulty = max(800.0, last_attempt.get("difficulty", 1200.0) - 30.0)
            return {
                "strategy": "remediation",
                "target_domain": target_domain,
                "secondary_domain": None,
                "target_difficulty": target_difficulty,
                "is_fusion": False,
                "reason": f"Let's do a quick friendly {target_domain} puzzle to master this trick!"
            }

        # Otherwise pick domain with lowest score to keep balanced
        sorted_domains = sorted(domain_ratings.items(), key=lambda x: x[1])
        target_domain = sorted_domains[0][0] if sorted_domains else "spatial"
        target_difficulty = domain_ratings.get(target_domain, 1200.0) + 20.0

        current_streak = profile_data.get("current_streak", 0)
        if current_streak >= 2:
            secondary = sorted_domains[1][0] if len(sorted_domains) > 1 else "memory"
            return {
                "strategy": "skill_fusion",
                "target_domain": target_domain,
                "secondary_domain": secondary,
                "target_difficulty": target_difficulty,
                "is_fusion": True,
                "reason": f"You're on a {current_streak}-streak! Let's combine {target_domain.capitalize()} + {secondary.capitalize()}."
            }

        return {
            "strategy": "growth",
            "target_domain": target_domain,
            "secondary_domain": None,
            "target_difficulty": target_difficulty,
            "is_fusion": False,
            "reason": f"Next up: A fun {target_domain.capitalize()} challenge to boost your mental fitness."
        }

adaptive_engine = AdaptiveEngine()
