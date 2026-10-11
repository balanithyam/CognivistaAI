import re
from typing import Dict, Any, List, Optional

class NLPIntentParser:
    """
    Cognivista NLP Intent & Entity Parser.
    Extracts user training goals, domain preferences, difficulty modifiers,
    contextual references, and skill fusion requests from freeform natural language.
    """

    DOMAIN_KEYWORDS = {
        "logic": ["logic", "deduction", "deductive", "reasoning", "truth", "liar", "detective", "clue", "clues", "podium", "brain teaser", "balance scale", "balance"],
        "numerical": ["number", "numbers", "math", "numerical", "arithmetic", "sequence", "series", "calculation", "formula", "discount", "shopping", "percent", "bill", "utility", "fraction", "fractions", "geometry", "angle", "angles", "triangle"],
        "spatial": ["shape", "shapes", "geometry", "visual", "rotation", "rotate", "rotating", "rotational", "cube", "isometric", "pattern", "blocks", "gear", "gears", "gear train", "cog", "cogs", "vector", "vectors", "direction vector", "direction vectors", "interlocking"],
        "memory": ["memory", "recall", "working memory", "span", "remember", "memorize", "tiles", "matrix", "tile matrix"],
        "verbal": ["verbal", "word", "words", "analogy", "analogies", "vocabulary", "language", "riddle", "riddles", "lateral", "clever riddle", "anagram"],
        "attention": ["attention", "focus", "speed", "stroop", "reaction", "reflex", "reflexes", "rapid", "fast", "color reflex"],
        "science": ["science", "physics", "tech", "technology", "everyday", "life skills", "travel", "time zone", "money", "battery", "circuit", "circuits", "electric circuit", "switch", "thermostat"],
        "matching": ["match", "matching", "pair", "pairs", "connect"],
        "ordering": ["order", "ordering", "sequence", "sequencing", "arrange", "arranging", "steps", "chronological"],
        "true_false": ["true or false", "true false", "fact or myth", "binary"],
        "multi_select": ["multiple answer", "multiple answers", "select all", "multi select"],
        "odd_one_out": ["odd one out", "outlier", "does not belong", "which one does not fit"],
        "fill_blank": ["fill in the blank", "fill blank", "anagram", "unscramble", "spelling"],
        "visual": ["visual", "wayground", "diagram", "diagrams", "picture", "pictures", "graphic", "graphics", "gear", "gears", "gear train", "balance scale", "circuit", "circuits", "angles", "fraction", "fractions", "geometry", "shapes"]
    }

    SPECIFIC_ENTITIES = {
        "logic_gears": ["gear", "gears", "gear train", "interlocking gear", "interlocking gears", "rotating gears", "rotational direction", "cog", "cogs"],
        "science_circuits": ["circuit", "circuits", "electric circuit", "switch a", "switch b", "parallel circuit", "series circuit"],
        "logic_balance": ["balance scale", "pan scale", "balance scales", "weighing scale"],
        "math_geometry": ["triangle angle", "interior angle", "angle calculation", "triangle angles", "angle x"],
        "math_fractions": ["fraction pie", "fraction circles", "fractions visual"],
        "science_energy": ["thermostat", "temperature difference", "energy consumption", "hvac"],
        "math_discount": ["discount", "discounts", "flash sale", "shopping discount", "percent off"],
        "math_energy_bill": ["clothes dryer", "kilowatt", "kilowatt-hour", "kwh", "power draw", "appliance power"],
        "detective": ["detective", "suspect", "suspects", "alibi", "crime scene", "investigation"],
        "speed_stroop": ["stroop", "color conflict", "reaction time", "speed reflex"],
        "memory_matrix": ["memory matrix", "memory tiles", "tile recall", "grid memory"],
        "verbal_anagram": ["anagram", "unscramble", "word scramble"]
    }

    NEGATIVE_PATTERNS = [
        r"(?:not|no|don't|dont|without|exclude|avoid|skip|stop)\s+([a-zA-Z0-9\s]+)",
        r"(?:not in the mood for|tired of)\s+([a-zA-Z0-9\s]+)"
    ]

    DIFFICULTY_PATTERNS = {
        "much_harder": [r"\bmuch\s+harder\b", r"\bway\s+harder\b", r"\bexpert\b", r"\binsane\b", r"\bmaster\b", r"\bmaximum\s+difficulty\b"],
        "harder": [r"\bharder\b", r"\bmore\s+difficult\b", r"\bstep\s+it\s+up\b", r"\blevel\s+up\b", r"\bpush\s+me\b", r"\btougher\b"],
        "easier": [r"\beasier\b", r"\bsimpler\b", r"\btoo\s+hard\b", r"\bscale\s+back\b", r"\bgentle\b", r"\brelax\b"],
        "reset": [r"\bnormal\b", r"\bstandard\b", r"\bmedium\b", r"\bbalanced\b"]
    }

    FUSION_TRIGGERS = [
        r"\b(?:cross[- ]domain|fusion|hybrid)\b",
        r"\bcomb(?:ine|ination|ing)\s+(?:two|multiple|[a-z]+)\b",
        r"\bboth\s+(?:logic|math|numerical|spatial|memory|verbal|science|speed)\s+and\s+(?:logic|math|numerical|spatial|memory|verbal|science|speed)\b",
        r"\b(?:logic|math|numerical|spatial|memory|verbal|science|speed)\s*\+\s*(?:logic|math|numerical|spatial|memory|verbal|science|speed)\b",
        r"\b(?:logic|math|numerical|spatial|memory|verbal|science|speed)\s+with\s+(?:logic|math|numerical|spatial|memory|verbal|science|speed)\b"
    ]

    LIVE_TRIGGERS = [
        r"\blive\b",
        r"\breal[- ]?world\b",
        r"\blife[- ]?skills\b",
        r"\beveryday\b",
        r"\bpractical\b",
        r"\bcurrent\b",
        r"\btoday'?s\b"
    ]

    CONTINUE_PATTERNS = [
        r"\bcontinue(?:\s+my)?\s+training\b",
        r"\bcontinue\b",
        r"\bnext(?:\s+challenge|\s+one|\s+step)?\b",
        r"\bkeep\s+going\b",
        r"\bready\b",
        r"\bproceed\b"
    ]

    PROFILE_PATTERNS = [
        r"\b(?:how\s+am\s+i|my\s+progress|profile|stats|metrics|strengths?|weakness(?:es)?|improvement)\b",
        r"\bwhere\s+do\s+i\s+stand\b",
        r"\bshow\s+(?:my\s+)?(?:report(?:\s+card)?|profile|ratings?|elo|score|mastery)\b"
    ]

    HINT_PATTERNS = [
        r"\bhint\b",
        r"\bclue\b",
        r"\bi'?m\s+stuck\b",
        r"\bgive\s+me\s+a\s+hint\b",
        r"\bhelp\s+me\b"
    ]

    def parse(self, text: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        text_lower = text.strip().lower()
        context = context or {}

        # 1. Detect Negations (e.g. "not numbers today", "no math")
        excluded_domains = []
        for neg_pat in self.NEGATIVE_PATTERNS:
            matches = re.findall(neg_pat, text_lower)
            for m in matches:
                m_clean = m.strip()
                for dom, kws in self.DOMAIN_KEYWORDS.items():
                    if any(kw in m_clean for kw in kws):
                        excluded_domains.append(dom)

        # 1.5 Detect Specific Target Entity (e.g. "gears", "circuit", "balance scale")
        specific_entity = None
        for entity_id, kws in self.SPECIFIC_ENTITIES.items():
            for kw in kws:
                if kw in text_lower:
                    specific_entity = entity_id
                    break
            if specific_entity:
                break

        # 2. Detect Positive Domains Mentioned
        included_domains = []
        for dom, kws in self.DOMAIN_KEYWORDS.items():
            if dom in excluded_domains:
                continue
            for kw in kws:
                # Match whole word boundary
                if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                    if dom not in included_domains:
                        included_domains.append(dom)
                    break

        if specific_entity == "logic_gears":
            if "spatial" not in included_domains:
                included_domains.insert(0, "spatial")
            if "visual" not in included_domains:
                included_domains.append("visual")
        elif specific_entity == "science_circuits":
            if "science" not in included_domains:
                included_domains.insert(0, "science")
        elif specific_entity == "logic_balance":
            if "logic" not in included_domains:
                included_domains.insert(0, "logic")
        elif specific_entity in ["math_geometry", "math_fractions", "math_discount", "math_energy_bill"]:
            if "numerical" not in included_domains:
                included_domains.insert(0, "numerical")

        # 3. Detect Difficulty Modifiers
        difficulty_delta = 0.0
        difficulty_action = "keep"
        for diff_type, patterns in self.DIFFICULTY_PATTERNS.items():
            if any(re.search(pat, text_lower) for pat in patterns):
                if diff_type == "much_harder":
                    difficulty_delta = +250.0
                    difficulty_action = "increase_large"
                elif diff_type == "harder":
                    difficulty_delta = +120.0
                    difficulty_action = "increase"
                elif diff_type == "easier":
                    difficulty_delta = -150.0
                    difficulty_action = "decrease"
                elif diff_type == "reset":
                    difficulty_delta = 0.0
                    difficulty_action = "reset"
                break

        # 4. Detect Skill Fusion Request (only if not a specific entity request)
        is_fusion = any(re.search(f_pat, text_lower) for f_pat in self.FUSION_TRIGGERS)
        if specific_entity:
            is_fusion = False

        # 5. Detect Live Intelligence Request
        is_live = any(re.search(pat, text_lower) for pat in self.LIVE_TRIGGERS)

        # 6. Contextual Reference ("make the last one harder", "another one like that")
        references_last_challenge = bool(
            re.search(r"\b(?:last\s+one|previous|same\s+type|again|another\s+one\s+like\s+that)\b", text_lower)
        )
        if references_last_challenge and not included_domains and context.get("last_domain"):
            included_domains.append(context.get("last_domain"))

        why_wrong = bool(re.search(r"\bwhy\s+(?:was\s+i|was\s+my\s+answer|am\s+i)\s+(?:wrong|incorrect|penalized)\b", text_lower))
        request_variety = bool(re.search(r"\b(?:different(?:\s+from\s+the\s+last\s+\w+)?|not\s+like|switch\s+it\s+up|variety|something\s+else)\b", text_lower))

        # 7. Identify Primary Intent
        if why_wrong:
            intent = "explain_mistake"
        elif any(re.search(pat, text_lower) for pat in self.HINT_PATTERNS):
            intent = "request_hint"
        elif any(re.search(pat, text_lower) for pat in self.PROFILE_PATTERNS):
            intent = "query_profile"
        elif any(re.search(pat, text_lower) for pat in self.CONTINUE_PATTERNS):
            intent = "continue_training"
        elif excluded_domains and not included_domains and difficulty_delta == 0:
            intent = "domain_preference"
        elif difficulty_delta != 0 and not included_domains and not references_last_challenge:
            intent = "difficulty_adjust"
        elif specific_entity:
            intent = "challenge_request"
        elif is_live:
            intent = "live_challenge_request"
        elif is_fusion:
            intent = "fusion_challenge_request"
        elif request_variety or included_domains or references_last_challenge or re.search(r"\b(?:challenge|puzzle|train|exercise|practice|give\s+me|generate|start|test\s+me)\b", text_lower):
            intent = "challenge_request"
        else:
            intent = "natural_dialogue"

        return {
            "intent": intent,
            "raw_text": text,
            "specific_entity": specific_entity,
            "included_domains": included_domains,
            "excluded_domains": list(set(excluded_domains)),
            "difficulty_delta": difficulty_delta,
            "difficulty_action": difficulty_action,
            "is_fusion": is_fusion,
            "is_live": is_live,
            "references_last_challenge": references_last_challenge,
            "request_variety": request_variety,
            "requires_generation": intent in ["challenge_request", "fusion_challenge_request", "live_challenge_request", "continue_training"]
        }

intent_parser = NLPIntentParser()
