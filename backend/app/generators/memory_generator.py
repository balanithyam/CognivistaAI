import random
from typing import Dict, Any, List

class MemoryGenerator:
    """
    Synthesizes working memory span, Corsi-block spatial sequences,
    and N-back memory challenges to exercise the phonological loop and visuospatial sketchpad.
    """

    SYMBOLS = ["Alpha", "Beta", "Gamma", "Delta", "Theta", "Omega", "Sigma", "Lambda"]
    COLORS = ["#8b5cf6", "#00f5a0", "#38bdf8", "#fbbf24", "#f43f5e", "#a855f7"]

    def generate_span_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        """
        Generates an adaptive Corsi-block / spatial grid recall sequence.
        Sequence length scales with user's Elo:
        - < 1100: 4 steps forward
        - 1100-1350: 5 steps forward
        - 1350-1600: 5 steps reverse (backward working memory)
        - > 1600: 6-7 steps reverse
        """
        grid_size = 4
        all_cells = [(r, c) for r in range(grid_size) for c in range(grid_size)]
        
        if target_difficulty < 1100:
            seq_len = 4
            is_reverse = False
        elif target_difficulty < 1350:
            seq_len = 5
            is_reverse = False
        elif target_difficulty < 1600:
            seq_len = 5
            is_reverse = True
        elif target_difficulty < 1900:
            seq_len = 6
            is_reverse = True
        else:
            seq_len = 7
            is_reverse = True

        # Ensure no immediate repeat of same cell
        sequence = []
        last_cell = None
        for _ in range(seq_len):
            available = [c for c in all_cells if c != last_cell]
            chosen = random.choice(available)
            sequence.append(chosen)
            last_cell = chosen

        correct_answer = list(reversed(sequence)) if is_reverse else sequence
        mode_str = "REVERSE (backward working memory)" if is_reverse else "FORWARD (sequential recall)"

        return {
            "challenge_type": "memory_span",
            "primary_domain": "memory",
            "secondary_domains": ["attention", "spatial"],
            "title": f"Visuospatial Sketchpad Span #{random.randint(100, 999)}",
            "prompt": f"Memorize the luminous flash sequence across the neural matrix, then reproduce the path in {mode_str}.",
            "description": f"Matrix Size: {grid_size}x{grid_size} | Span Length: {seq_len} nodes | Direction: {mode_str}",
            "payload": {
                "grid_size": grid_size,
                "sequence": sequence, # array of [r, c]
                "is_reverse": is_reverse,
                "flash_interval_ms": 700 if target_difficulty < 1400 else 550,
                "pause_before_recall_ms": 1000
            },
            "correct_answer": correct_answer,
            "acceptable_answers": [str(correct_answer)],
            "hint": f"Watch the tiles light up in order and remember the sequence steps.",
            "explanation": f"The target sequence was: {' → '.join([f'({r+1},{c+1})' for r, c in sequence])}. Required recall was {'reversed' if is_reverse else 'forward'}.",
            "difficulty_rating": target_difficulty,
            "tags": ["memory", "visual-memory", "tile-recall", "patterns"]
        }

memory_generator = MemoryGenerator()
