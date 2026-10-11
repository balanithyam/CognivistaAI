import random
import copy
from typing import Dict, Any, List, Tuple

class SpatialGenerator:
    """
    Synthesizes mental rotation, 3D voxel projections, and spatial orientation challenges.
    Grounded in the classic Shepard-Metzler mental rotation paradigm.
    """

    VOXEL_PRESETS = [
        # Set of 3D unit cubes connected in space [(x, y, z)]
        [(0,0,0), (1,0,0), (2,0,0), (2,1,0), (2,1,1)], # L-twist
        [(0,0,0), (1,0,0), (1,1,0), (1,1,1), (0,1,1)], # Staircase-turn
        [(0,0,0), (0,1,0), (0,2,0), (1,2,0), (1,2,1), (2,2,1)], # S-helix
        [(0,0,0), (1,0,0), (0,1,0), (0,0,1), (1,0,1)], # Corner anchor
        [(0,0,0), (1,0,0), (2,0,0), (1,1,0), (1,0,1)], # Cross-T arm
    ]

    POLYOMINO_PRESETS = [
        [(0,0), (1,0), (2,0), (2,1), (3,1)], # Pentomino F/Z
        [(0,0), (0,1), (1,1), (1,2), (2,2)], # Stepped pentomino
        [(0,0), (1,0), (1,1), (1,2), (2,0)], # Asymmetric U-notch
        [(0,0), (0,1), (0,2), (1,1), (2,1), (2,2)], # Asymmetric hook
        [(0,0), (1,0), (2,0), (0,1), (0,2), (1,2)], # C-bracket variant
    ]

    def _rotate_2d(self, coords: List[Tuple[int, int]], angle_deg: int) -> List[Tuple[int, int]]:
        """Rotate 2D coordinates around origin and normalize bounding box to (0,0)."""
        rad_map = {
            0: lambda x, y: (x, y),
            90: lambda x, y: (-y, x),
            180: lambda x, y: (-x, -y),
            270: lambda x, y: (y, -x)
        }
        fn = rad_map.get(angle_deg % 360, rad_map[0])
        rotated = [fn(x, y) for x, y in coords]
        min_x = min(x for x, y in rotated)
        min_y = min(y for x, y in rotated)
        return sorted([(x - min_x, y - min_y) for x, y in rotated])

    def _reflect_2d(self, coords: List[Tuple[int, int]]) -> List[Tuple[int, int]]:
        """Reflect horizontally (mirror reflection - impossible to reach by 2D rotation alone)."""
        reflected = [(-x, y) for x, y in coords]
        min_x = min(x for x, y in reflected)
        min_y = min(y for x, y in reflected)
        return sorted([(x - min_x, y - min_y) for x, y in reflected])

    def generate_rotation_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        """Generate a mental rotation challenge with valid rotations and mirrored distractors."""
        base_poly = random.choice(self.POLYOMINO_PRESETS)
        
        # Difficulty adjustment: 90 vs 180 vs arbitrary angles
        target_angle = random.choice([90, 180, 270])
        correct_rotated = self._rotate_2d(base_poly, target_angle)
        
        # Option A: Exact rotated match (Correct)
        # Option B: Reflected + rotated (Chirality distractor)
        # Option C: Distorted block (Structural distractor)
        # Option D: Different angle (Angle distractor)
        
        reflected_distractor = self._rotate_2d(self._reflect_2d(base_poly), random.choice([0, 90, 180]))
        
        # Modify one coord for structural distractor
        structural_distractor = copy.deepcopy(correct_rotated)
        if len(structural_distractor) > 2:
            structural_distractor[0] = (structural_distractor[0][0] + 1, structural_distractor[0][1] + 1)
            min_x = min(x for x, y in structural_distractor)
            min_y = min(y for x, y in structural_distractor)
            structural_distractor = sorted([(x - min_x, y - min_y) for x, y in structural_distractor])

        wrong_angle = (target_angle + random.choice([90, 180])) % 360
        angle_distractor = self._rotate_2d(base_poly, wrong_angle)

        options = [
            {"id": "opt_correct", "coords": correct_rotated, "label": "Exact Matching Rotation"},
            {"id": "opt_mirror", "coords": reflected_distractor, "label": "Mirror Flipped (Incorrect)"},
            {"id": "opt_structural", "coords": structural_distractor, "label": "Altered Block Shape"},
            {"id": "opt_angle", "coords": angle_distractor, "label": "Different Angle"}
        ]
        random.shuffle(options)
        correct_index = [i for i, opt in enumerate(options) if opt["id"] == "opt_correct"][0]

        return {
            "challenge_type": "spatial_rotation",
            "primary_domain": "visual",
            "secondary_domains": ["attention", "logic"],
            "title": f"Visual Shape Match & Rotation #{random.randint(100, 999)}",
            "prompt": f"Mentally rotate the reference shape. Which of the four options matches the original shape turned {target_angle}°? (Mirror-flipped shapes are incorrect).",
            "description": f"Target transformation: shape turned by {target_angle}°. Look for the exact matching silhouette.",
            "payload": {
                "reference_coords": base_poly,
                "target_angle": target_angle,
                "options": options,
                "correct_option_index": correct_index,
                "interactive_rotation_enabled": True
            },
            "correct_answer": correct_index,
            "acceptable_answers": [str(correct_index), str(correct_index + 1), f"Option {chr(65 + correct_index)}"],
            "hint": "Track which side the extra corner block sticks out when turned clockwise.",
            "explanation": f"Option {chr(65 + correct_index)} is the exact original shape turned {target_angle}° clockwise. The other choices are mirror flipped or misshapen.",
            "difficulty_rating": target_difficulty,
            "tags": ["visual", "shapes", "geometry", "puzzles"]
        }

spatial_generator = SpatialGenerator()
