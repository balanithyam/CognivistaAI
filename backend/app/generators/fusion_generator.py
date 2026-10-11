import random
from typing import Dict, Any, List, Tuple
from app.generators.spatial_generator import spatial_generator

class FusionGenerator:
    """
    Synthesizes multi-skill cognitive fusion challenges:
    - Memory + Spatial (Spatial pattern recall under mental rotation)
    - Numerical + Critical Thinking (Bayesian fallacy, compound rate paradox, disguised balance deficit)
    - Verbal + Lateral Thinking (Semantic shift riddles and lateral scenarios)
    """

    LATERAL_SCENARIOS = [
        {
            "title": "The Dual Watchmaker Paradox",
            "scenario": "A clockmaker has two mechanical pendulum clocks. One loses exactly 2 minutes each day. The other clock does not run at all because its mainspring is broken. The clockmaker claims that the broken clock is more accurate over a one-year period than the clock that loses 2 minutes a day. Why is this claim logically true?",
            "correct_answer": "The stopped clock is exactly right twice every day (730 times a year), while the clock losing 2 minutes is only exact once every 360 days.",
            "acceptable_answers": ["stopped clock is right twice a day", "twice a day", "exact twice each day", "730 times", "twice every 24 hours"],
            "hint": "Consider how often each clock displays the absolute exact correct time down to the second.",
            "explanation": "A completely stopped clock shows the exact correct time twice in every 24-hour cycle (730 times in a non-leap year). A clock losing 2 minutes per day takes 360 days to lose 12 hours and show the correct time again (only once per year).",
            "tags": ["verbal", "lateral", "paradox"]
        },
        {
            "title": "The Submerged Vessel Enigma",
            "scenario": "A steel cargo barge floats in a closed canal lock. On board is a heavy pile of iron anchor stones. The crew dumps all the iron anchor stones off the barge into the deep water of the lock so they sink to the bottom. Does the water level of the canal lock rise, fall, or stay exactly the same?",
            "correct_answer": "The water level falls.",
            "acceptable_answers": ["falls", "drops", "decreases", "lower", "it falls", "the level falls", "level drops"],
            "hint": "Apply Archimedes' principle: compare the volume of water displaced when an object is floating (displacing its weight in water) versus when it is submerged (displacing only its physical volume).",
            "explanation": "While floating on the barge, the iron displaced water equal to its *weight* (which is large due to iron's density ~7.8x water). Once submerged, the iron displaces only its *volume*, which is roughly 1/8th as much. Thus, the total water level falls.",
            "tags": ["critical_thinking", "lateral", "physics_deduction"]
        },
        {
            "title": "The Symmetric Mirror Inversion",
            "scenario": "When you look into an ordinary flat mirror, your left and right sides appear reversed, but your head remains at the top and your feet remain at the bottom. Why does a mirror reverse left-to-right rather than top-to-bottom?",
            "correct_answer": "Mirrors reverse front-to-back along the perpendicular axis, not left-to-right.",
            "acceptable_answers": ["front to back", "reverses front and back", "inverts front to back", "z-axis", "depth axis", "perpendicular reflection"],
            "hint": "Consider the direction perpendicular to the mirror surface (depth/z-axis) rather than horizontal or vertical axes.",
            "explanation": "A flat mirror actually inverts along the front-to-back axis (depth). If you point forward, your mirror reflection points straight back at you. Left/right reversal is a psychological projection we impose because our bodies are laterally symmetric.",
            "tags": ["spatial", "lateral", "perception"]
        }
    ]

    NUMERICAL_CRITICAL_SCENARIOS = [
        {
            "title": "The Laboratory Diagnostic Base-Rate Fallacy",
            "scenario": "A rare cognitive marker occurs in 1 out of 1,000 individuals in a population (0.1% base rate). A rapid diagnostic bio-assay is 99% accurate (true positive rate is 99%, and false positive rate is 5%). If an individual tests positive, what is the approximate probability (percentage rounded to nearest whole number) that they actually have the marker?",
            "correct_answer": 2, # ~1.94% -> 2%
            "acceptable_answers": ["2", "2%", "1.9%", "around 2%"],
            "options": [2, 50, 95, 99],
            "hint": "Consider a sample of 1,000 people. How many true cases exist, and how many healthy people test falsely positive?",
            "explanation": "In 1,000 people, 1 person has the marker (tests positive). Of the remaining 999 healthy people, 5% test positive (~50 false positives). Total positives = 1 + 50 = 51. The probability is 1/51 ≈ 1.96% (~2%). High diagnostic accuracy is dominated by the low base rate.",
            "tags": ["numerical", "critical_thinking", "bayesian-reasoning"]
        },
        {
            "title": "The Exponential Lily Pad Doubling Window",
            "scenario": "A self-replicating neural bio-cluster in a petri dish doubles in surface area every hour. At the 48th hour, the dish is 100% full. At what hour was the dish exactly 25% full?",
            "correct_answer": 46,
            "acceptable_answers": ["46", "hour 46", "at 46"],
            "options": [12, 24, 36, 46],
            "hint": "Work backwards from hour 48: each prior hour represents exactly half the subsequent surface area.",
            "explanation": "At hour 48 the dish is 100%. At hour 47 (one hour prior), it was 50%. At hour 46 (two hours prior), it was 25%. Linear intuition misleadingly guesses 12 or 24.",
            "tags": ["numerical", "critical_thinking", "exponential-reasoning"]
        }
    ]

    def generate_fusion_challenge(self, domain1: str = "memory", domain2: str = "spatial", target_difficulty: float = 1200.0) -> Dict[str, Any]:
        """Dynamically fuses two distinct cognitive domains into one unified multi-step challenge."""
        
        # Memory + Spatial Fusion: Recall under Mental Rotation
        if ("memory" in [domain1, domain2] and "spatial" in [domain1, domain2]) or random.random() < 0.35:
            grid_dim = 4
            num_points = 3 if target_difficulty < 1300 else 4
            points = []
            while len(points) < num_points:
                pt = (random.randint(0, grid_dim - 1), random.randint(0, grid_dim - 1))
                if pt not in points:
                    points.append(pt)

            rotation_angle = random.choice([90, 180, 270])
            
            # Rotate original points by rotation_angle in grid
            def rot(r, c, deg):
                if deg == 90: return (c, grid_dim - 1 - r)
                elif deg == 180: return (grid_dim - 1 - r, grid_dim - 1 - c)
                elif deg == 270: return (grid_dim - 1 - c, r)
                return (r, c)

            rotated_correct = sorted([rot(r, c, rotation_angle) for r, c in points])

            # Generate distractor 1 (unrotated)
            distractor_unrotated = sorted(points)
            # Generate distractor 2 (wrong angle)
            wrong_angle = (rotation_angle + 90) % 360
            distractor_wrong_rot = sorted([rot(r, c, wrong_angle) for r, c in points])
            # Generate distractor 3 (random shift)
            distractor_shifted = sorted([(min(grid_dim - 1, r + 1), c) for r, c in rotated_correct])

            options = [
                {"id": "opt_correct", "grid_points": rotated_correct, "label": f"Rotated {rotation_angle}°"},
                {"id": "opt_unrotated", "grid_points": distractor_unrotated, "label": "Unrotated Memory Reference"},
                {"id": "opt_wrong_angle", "grid_points": distractor_wrong_rot, "label": f"Rotated {wrong_angle}°"},
                {"id": "opt_shifted", "grid_points": distractor_shifted, "label": "Pattern Translation"}
            ]
            random.shuffle(options)
            correct_index = [i for i, opt in enumerate(options) if opt["id"] == "opt_correct"][0]

            return {
                "challenge_type": "challenge_fusion",
                "primary_domain": "memory",
                "secondary_domains": ["spatial", "attention"],
                "title": f"Cognitive Fusion: Visuospatial Rotation Recall #{random.randint(100, 999)}",
                "prompt": f"Phase 1: Memorize the highlighted constellation points before the shield activates. Phase 2: Identify the grid that accurately represents the pattern ROTATED {rotation_angle}° CLOCKWISE.",
                "description": f"Challenge Fusion: Working Memory Span + 2D Planar Mental Rotation ({rotation_angle}°).",
                "payload": {
                    "fusion_type": "memory_spatial",
                    "grid_dim": grid_dim,
                    "memory_points": points,
                    "rotation_angle": rotation_angle,
                    "inspection_duration_ms": 3500 if target_difficulty < 1400 else 2500,
                    "options": options,
                    "correct_option_index": correct_index
                },
                "correct_answer": correct_index,
                "acceptable_answers": [str(correct_index), str(correct_index + 1), f"Option {chr(65 + correct_index)}"],
                "hint": f"Note the relative distances between points along the edges and apply a {rotation_angle}° clockwise rotation.",
                "explanation": f"Option {chr(65 + correct_index)} correctly rotates the memorized coordinates {points} by {rotation_angle}° clockwise into {rotated_correct}.",
                "difficulty_rating": target_difficulty,
                "tags": ["fusion", "memory", "spatial", "mental-rotation"]
            }

        # Numerical + Critical Thinking Fusion
        elif "numerical" in [domain1, domain2] or "critical_thinking" in [domain1, domain2] or random.random() < 0.5:
            scenario_data = random.choice(self.NUMERICAL_CRITICAL_SCENARIOS)
            return {
                "challenge_type": "challenge_fusion",
                "primary_domain": "numerical",
                "secondary_domains": ["critical_thinking", "logic"],
                "title": f"Cognitive Fusion: {scenario_data['title']}",
                "prompt": scenario_data["scenario"],
                "description": "Challenge Fusion: Quantitative Probability Modeling + Critical Cognitive Debiasing.",
                "payload": {
                    "fusion_type": "numerical_critical",
                    "options": scenario_data.get("options", []),
                    "allow_text_input": True
                },
                "correct_answer": scenario_data["correct_answer"],
                "acceptable_answers": scenario_data["acceptable_answers"],
                "hint": scenario_data["hint"],
                "explanation": scenario_data["explanation"],
                "difficulty_rating": target_difficulty,
                "tags": ["fusion", "numerical", "critical_thinking"]
            }

        # Verbal + Lateral Thinking Fusion
        else:
            scenario_data = random.choice(self.LATERAL_SCENARIOS)
            return {
                "challenge_type": "challenge_fusion",
                "primary_domain": "verbal",
                "secondary_domains": ["lateral", "critical_thinking"],
                "title": f"Cognitive Fusion: {scenario_data['title']}",
                "prompt": scenario_data["scenario"],
                "description": "Challenge Fusion: Semantic Linguistic Disambiguation + Out-of-the-Box Lateral Reasoning.",
                "payload": {
                    "fusion_type": "verbal_lateral",
                    "requires_natural_language_answer": True
                },
                "correct_answer": scenario_data["correct_answer"],
                "acceptable_answers": scenario_data["acceptable_answers"],
                "hint": scenario_data["hint"],
                "explanation": scenario_data["explanation"],
                "difficulty_rating": target_difficulty,
                "tags": ["fusion", "verbal", "lateral"]
            }

fusion_generator = FusionGenerator()
