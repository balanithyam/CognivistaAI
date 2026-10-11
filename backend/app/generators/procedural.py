import random
import math
from typing import Dict, Any, List, Tuple

class ProceduralGenerator:
    """
    Synthesizes numerical, sequence, matrix, and pattern recognition challenges
    procedurally at runtime with infinite parameter variation.
    """

    def generate_sequence_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        """Generate a procedural sequence reasoning challenge."""
        # Scale complexity with Elo
        if target_difficulty < 1100:
            seq_type = "linear_arithmetic"
        elif target_difficulty < 1350:
            seq_type = random.choice(["geometric_interleaved", "second_order_difference", "alternating_op"])
        elif target_difficulty < 1650:
            seq_type = random.choice(["fibonacci_variant", "polynomial_quadratic", "dual_interwoven"])
        else:
            seq_type = random.choice(["modular_fibonacci", "cubic_step", "triangular_alternating"])

        if seq_type == "linear_arithmetic":
            start = random.randint(3, 40)
            step = random.choice([3, 4, 6, 7, 8, 9, 11, 12, 13])
            seq = [start + i * step for i in range(6)]
            missing_idx = 5
            answer = seq[missing_idx]
            display_seq = [str(x) if i != missing_idx else "?" for i, x in enumerate(seq)]
            hint = f"Observe the constant incremental delta between consecutive numbers (+{step})."
            explanation = f"Each term increases by a fixed offset of {step}. Therefore: {seq[missing_idx-1]} + {step} = {answer}."

        elif seq_type in ["alternating_op", "geometric_interleaved"]:
            start = random.randint(2, 8)
            op1 = random.choice([2, 3]) # multiply
            op2 = random.choice([3, 4, 5]) # add or subtract
            is_sub = random.choice([True, False])
            seq = [start]
            for i in range(5):
                if i % 2 == 0:
                    seq.append(seq[-1] * op1)
                else:
                    seq.append(seq[-1] - op2 if is_sub else seq[-1] + op2)
            missing_idx = 5
            answer = seq[missing_idx]
            display_seq = [str(x) if i != missing_idx else "?" for i, x in enumerate(seq)]
            op2_str = f"- {op2}" if is_sub else f"+ {op2}"
            hint = f"The operation alternates between multiplication (*{op1}) and addition/subtraction ({op2_str})."
            explanation = f"The sequence applies alternating transformations: *{op1}, then {op2_str}. Preceding term is {seq[4]}, so next is {answer}."

        elif seq_type == "second_order_difference":
            start = random.randint(2, 15)
            first_diff = random.randint(2, 6)
            diff_step = random.randint(2, 5)
            seq = [start]
            cur_diff = first_diff
            for _ in range(5):
                seq.append(seq[-1] + cur_diff)
                cur_diff += diff_step
            missing_idx = 5
            answer = seq[missing_idx]
            display_seq = [str(x) if i != missing_idx else "?" for i, x in enumerate(seq)]
            hint = "Look at the differences between differences (second-order delta)."
            explanation = f"The differences between terms increase by {diff_step} each step: preceding difference was {cur_diff - diff_step}, making the final difference {cur_diff}."

        elif seq_type in ["fibonacci_variant", "dual_interwoven"]:
            if seq_type == "fibonacci_variant":
                a, b = random.randint(2, 9), random.randint(3, 11)
                multiplier = random.choice([1, 2])
                seq = [a, b]
                for _ in range(4):
                    seq.append(seq[-1] * multiplier + seq[-2])
                missing_idx = 5
                answer = seq[missing_idx]
                display_seq = [str(x) if i != missing_idx else "?" for i, x in enumerate(seq)]
                hint = "Each term is derived from a linear combination of the two previous terms."
                explanation = f"Term(n) = Term(n-1) * {multiplier} + Term(n-2). Thus {seq[4]} * {multiplier} + {seq[3]} = {answer}."
            else: # dual interwoven
                s1, step1 = random.randint(5, 20), random.randint(3, 7)
                s2, step2 = random.randint(40, 80), -random.randint(4, 9)
                seq = []
                for i in range(3):
                    seq.append(s1 + i * step1)
                    seq.append(s2 + i * step2)
                missing_idx = 5
                answer = seq[missing_idx]
                display_seq = [str(x) if i != missing_idx else "?" for i, x in enumerate(seq)]
                hint = "Two distinct sub-sequences are interleaved at odd and even positions."
                explanation = f"Odd indices form an increasing series, while even indices form a decreasing series with step {step2}."

        else: # High complexity polynomial / modular
            base_coeff = random.randint(1, 3)
            shift = random.randint(1, 7)
            seq = [base_coeff * (n**2) + shift * n for n in range(1, 7)]
            missing_idx = 5
            answer = seq[missing_idx]
            display_seq = [str(x) if i != missing_idx else "?" for i, x in enumerate(seq)]
            hint = "The sequence is modeled by a non-linear quadratic function f(n) = a*n^2 + b*n."
            explanation = f"Quadratic formula f(n) = {base_coeff}*n^2 + {shift}*n for n=6 yields {answer}."

        # Distractor options for multiple choice or typing
        distractors = [
            answer + random.choice([-1, 1]) * random.randint(1, 5),
            answer + random.choice([-2, 2]) * random.randint(2, 6),
            answer + random.choice([-10, 10])
        ]
        # Ensure all distinct
        distractors = list(set([d for d in distractors if d != answer]))
        while len(distractors) < 3:
            cand = answer + random.randint(-15, 15)
            if cand != answer and cand not in distractors:
                distractors.append(cand)
        options = distractors + [answer]
        random.shuffle(options)

        return {
            "challenge_type": "numerical_sequence",
            "primary_domain": "numerical",
            "secondary_domains": ["logic", "patterns"],
            "title": f"Harmonic Pattern Deduction #{random.randint(1000, 9999)}",
            "prompt": "Identify the underlying mathematical governing law and determine the missing value marked by '?'.",
            "description": f"Sequence: {'  →  '.join(display_seq)}",
            "payload": {
                "sequence": display_seq,
                "missing_index": missing_idx,
                "options": options,
                "allow_custom_input": True,
                "pattern_category": seq_type
            },
            "correct_answer": answer,
            "acceptable_answers": [str(answer)],
            "hint": hint,
            "explanation": explanation,
            "difficulty_rating": target_difficulty,
            "tags": ["numerical", "series", "deduction", seq_type]
        }

    def generate_matrix_pattern_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        """
        Generates a 3x3 Raven-style symbol / boolean matrix reasoning challenge.
        Rules: shape count, fill style, rotation, or symbol combinations.
        """
        shapes = ["circle", "square", "triangle", "diamond", "hexagon", "cross"]
        fills = ["solid", "striped", "empty"]
        
        # Select 3 base shapes
        selected_shapes = random.sample(shapes, 3)
        selected_fills = random.sample(fills, 3)
        
        # Rule: Latin square of shapes and Latin square of fills (no duplicates in rows or cols)
        grid_3x3 = []
        for r in range(3):
            row = []
            for c in range(3):
                shape_idx = (r + c) % 3
                fill_idx = (r + 2 * c) % 3
                dot_count = (r + c + 1)
                row.append({
                    "shape": selected_shapes[shape_idx],
                    "fill": selected_fills[fill_idx],
                    "dots": dot_count
                })
            grid_3x3.append(row)

        target_cell = grid_3x3[2][2] # cell (2,2) is missing
        grid_3x3[2][2] = {"missing": True}

        # Create distinct distractor options
        correct_opt = {
            "shape": target_cell["shape"],
            "fill": target_cell["fill"],
            "dots": target_cell["dots"]
        }
        
        distractor_1 = {
            "shape": selected_shapes[(target_cell["dots"] + 1) % 3],
            "fill": target_cell["fill"],
            "dots": target_cell["dots"]
        }
        distractor_2 = {
            "shape": target_cell["shape"],
            "fill": selected_fills[(target_cell["dots"]) % 3],
            "dots": (target_cell["dots"] % 3) + 1
        }
        distractor_3 = {
            "shape": selected_shapes[(target_cell["dots"]) % 3],
            "fill": target_cell["fill"],
            "dots": target_cell["dots"] + 1
        }

        options = [correct_opt, distractor_1, distractor_2, distractor_3]
        random.shuffle(options)
        correct_index = options.index(correct_opt)

        return {
            "challenge_type": "matrix_pattern",
            "primary_domain": "logic",
            "secondary_domains": ["visual", "spatial", "patterns"],
            "title": f"Abstract Matrix Synthesis #{random.randint(100, 999)}",
            "prompt": "Determine the governing orthogonal row and column transformation rules to identify the missing cell at [3, 3].",
            "description": "Analyze the distribution of geometry, shading fill, and internal dot counts across the 3x3 matrix.",
            "payload": {
                "grid": grid_3x3,
                "options": options,
                "correct_option_index": correct_index,
                "dimension": 3
            },
            "correct_answer": correct_index,
            "acceptable_answers": [str(correct_index), str(correct_index + 1), correct_opt["shape"]],
            "hint": "Each row and column must contain exactly one of each geometric form and one of each interior fill style.",
            "explanation": f"Using Latin-square orthogonality, row 3 is missing the {correct_opt['shape']} with {correct_opt['fill']} fill and {correct_opt['dots']} dot indicators.",
            "difficulty_rating": target_difficulty,
            "tags": ["matrix", "orthogonal-logic", "abstract-reasoning"]
        }

procedural_generator = ProceduralGenerator()
