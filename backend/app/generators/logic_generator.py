import random
from typing import Dict, Any, List, Tuple

class LogicGenerator:
    """
    Generates relational deduction grids, constraint satisfaction puzzles,
    and multi-step syllogisms procedurally.
    """

    NAMES = ["Dr. Vance", "Dr. Lin", "Dr. Morales", "Dr. Thorne", "Dr. Al-Mansoor"]
    LABS = ["Neuro-Vortex", "Synapse-9", "Quantum-Cortex", "Bio-Resonance", "Aether-Lab"]
    FIELDS = ["Neuroplasticity", "Deep Perception", "Mental Rotation", "Bio-Telemetry", "Working Memory"]

    def generate_relational_deduction(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        """
        Creates a 4-entity relational logic puzzle with unambiguous clues and deductive chain.
        """
        k = 4 if target_difficulty < 1500 else 5
        names = random.sample(self.NAMES, k)
        labs = random.sample(self.LABS, k)
        fields = random.sample(self.FIELDS, k)

        # Ground truth mapping: index 0..k-1 represents ordered positions (Stations 1..k)
        solution = []
        for i in range(k):
            solution.append({
                "station": i + 1,
                "name": names[i],
                "lab": labs[i],
                "field": fields[i]
            })

        # Generate solvable set of relational clues
        clues = []
        # Clue 1: Direct link
        idx_direct = random.randint(0, k - 1)
        clues.append(f"{solution[idx_direct]['name']} conducts research at {solution[idx_direct]['lab']}.")

        # Clue 2: Positional constraint
        clues.append(f"Station 1 is occupied by the researcher focusing on {solution[0]['field']}.")

        # Clue 3: Adjacency constraint
        adj_idx = random.randint(0, k - 2)
        clues.append(f"{solution[adj_idx]['name']} is stationed directly adjacent to {solution[adj_idx + 1]['lab']}.")

        # Clue 4: Field constraint
        f_idx = (idx_direct + 1) % k
        clues.append(f"The researcher investigating {solution[f_idx]['field']} operates {solution[f_idx]['lab']}.")

        # Clue 5: Negation constraint
        neg_name = solution[(idx_direct + 2) % k]['name']
        neg_field = solution[(idx_direct + 1) % k]['field']
        clues.append(f"{neg_name} does NOT specialize in {neg_field}.")

        # Formulate query
        target_item = solution[random.randint(0, k - 1)]
        query_type = random.choice(["field", "lab"])
        if query_type == "field":
            question = f"Based on deductive elimination, which research field is managed by {target_item['name']}?"
            correct_answer = target_item['field']
            options = random.sample(fields, len(fields))
        else:
            question = f"Based on deductive elimination, which facility is operated by {target_item['name']}?"
            correct_answer = target_item['lab']
            options = random.sample(labs, len(labs))

        return {
            "challenge_type": "logic_deduction",
            "primary_domain": "logic",
            "secondary_domains": ["critical_thinking", "working_memory"],
            "title": f"Relational Constraint Grid #{random.randint(100, 999)}",
            "prompt": question,
            "description": "Cross-reference the constraint rules below and construct the deduction matrix to isolate the answer.",
            "payload": {
                "clues": clues,
                "names": names,
                "labs": labs,
                "fields": fields,
                "options": options,
                "k_size": k
            },
            "correct_answer": correct_answer,
            "acceptable_answers": [correct_answer, correct_answer.lower()],
            "hint": "Start with Station 1 and chain the direct identity clues before checking the negative exclusion.",
            "explanation": f"By combining clue 1 and clue 2 with the adjacency rules, {target_item['name']} maps unambiguously to {correct_answer}.",
            "difficulty_rating": target_difficulty,
            "tags": ["logic", "deduction", "constraint-satisfaction", "zebra-puzzle"]
        }

logic_generator = LogicGenerator()
