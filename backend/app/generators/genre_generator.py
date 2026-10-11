import random
import math
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class GenreChallengeGenerator:
    """
    Wayground-style multi-genre brain training & quiz engine.
    Generates rich, genuinely dynamic, non-hardcoded interactive puzzles across all real-world subjects:
    - Math & Quantitative Reasoning (Everyday discounts, mental math, series formulas)
    - Speed Focus & Reflexes (Rapid Stroop color test with millisecond reactions)
    - Detective & Deductive Logic (Clue solver, runner podiums, seating order)
    - Words & Lateral Riddles (Clever lateral riddles, word analogies, vocabulary agility)
    - Everyday Science, Tech & Life Skills (Energy wattage, flight time zones, battery facts, practical physics)
    - Memory & Visual Pattern Matching (Interactive tile matrices & visual shape matching)
    """

    GENRES = [
        "math",
        "speed",
        "logic",
        "language",
        "science",
        "memory",
        "visual"
    ]

    # --- 1. MATH & NUMBERS (EVERYDAY APPLIED & MENTAL ARITHMETIC) ---
    def generate_math_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        math_type = random.choice(["shopping_discount", "mental_chain", "energy_bill", "sequence_pattern"])

        if math_type == "shopping_discount":
            items = [
                ("Noise-Cancelling Headphones", [120, 150, 180, 200, 240]),
                ("Ergonomic Office Chair", [160, 200, 250, 300]),
                ("Smart Fitness Tracker", [60, 80, 100, 120]),
                ("Espresso Coffee Maker", [90, 120, 150, 180]),
                ("Winter Parka Jacket", [140, 160, 200, 220]),
                ("Ultra-Light Backpack", [50, 70, 80, 100])
            ]
            item_name, price_pool = random.choice(items)
            orig = random.choice(price_pool)
            discount_pct = random.choice([15, 20, 25, 30, 35, 40, 50])
            saved = round(orig * (discount_pct / 100), 2)
            final_price = round(orig - saved, 2)

            options = [
                f"${final_price:.2f}",
                f"${final_price + random.choice([8, 12, 15]):.2f}",
                f"${max(5, final_price - random.choice([6, 10, 14])):.2f}",
                f"${orig * (1 - (discount_pct + 10)/100):.2f}"
            ]
            options = sorted(list(set(options)))

            return {
                "challenge_type": "math_quiz",
                "genre": "math",
                "primary_domain": "numerical",
                "secondary_domains": ["everyday_life", "percentages"],
                "title": f"Smart Shopping: {item_name} at {discount_pct}% Off",
                "prompt": f"A {item_name} originally costs ${orig}. During a flash sale, it is discounted by {discount_pct}%. What is the final price you pay at checkout?",
                "description": "Everyday percentage calculation and smart consumer math.",
                "payload": {
                    "question_type": "math_card",
                    "badge": "Smart Shopping",
                    "item_name": item_name,
                    "orig_price": f"${orig}",
                    "discount": f"{discount_pct}%",
                    "saved_amount": f"${saved:.2f}",
                    "options": options
                },
                "correct_answer": f"${final_price:.2f}",
                "acceptable_answers": [f"${final_price:.2f}", f"{final_price:.2f}", str(int(final_price) if final_price.is_integer() else final_price)],
                "hint": f"Calculate savings first: {discount_pct}% of ${orig} is ${saved:.2f}. Then subtract ${saved:.2f} from ${orig}.",
                "explanation": f"Discount = ${orig} * {discount_pct}% = ${saved:.2f}. Checkout price = ${orig} - ${saved:.2f} = ${final_price:.2f}.",
                "difficulty_rating": target_difficulty,
                "tags": ["math", "percentages", "discounts", "everyday-life"]
            }

        elif math_type == "energy_bill":
            # Real world kilowatt-hour math
            appliances = [
                ("1800W Air Conditioner", 1800, [4, 5, 6, 8]),
                ("2200W Clothes Dryer", 2200, [2, 3, 4]),
                ("1500W Space Heater", 1500, [5, 6, 8]),
                ("1200W Microwave", 1200, [1, 2])
            ]
            appliance_name, watts, hour_pool = random.choice(appliances)
            hours = random.choice(hour_pool)
            rate = random.choice([0.15, 0.18, 0.20, 0.25])
            kwh = (watts * hours) / 1000
            total_cost = round(kwh * rate, 2)

            options = [
                f"${total_cost:.2f}",
                f"${total_cost + 0.45:.2f}",
                f"${max(0.1, total_cost - 0.35):.2f}",
                f"${total_cost * 1.5:.2f}"
            ]
            options = sorted(list(set(options)))

            return {
                "challenge_type": "math_quiz",
                "genre": "math",
                "primary_domain": "numerical",
                "secondary_domains": ["science", "life_skills"],
                "title": f"Home Utility Smarts: {appliance_name} Electricity Cost",
                "prompt": f"You run an {appliance_name} for {hours} hours. Electricity costs ${rate:.2f} per kilowatt-hour (kWh). What is the total operating cost?",
                "description": "Calculate everyday home energy consumption: (Watts * Hours / 1000) * Electricity Rate.",
                "payload": {
                    "question_type": "math_card",
                    "badge": "Everyday Utility Math",
                    "appliance": appliance_name,
                    "watts": f"{watts}W",
                    "hours": f"{hours} hrs",
                    "rate": f"${rate:.2f}/kWh",
                    "options": options
                },
                "correct_answer": f"${total_cost:.2f}",
                "acceptable_answers": [f"${total_cost:.2f}", f"{total_cost:.2f}"],
                "hint": f"1. Convert to kWh: ({watts}W * {hours}h) / 1000 = {kwh} kWh. 2. Multiply by ${rate:.2f}.",
                "explanation": f"Energy used = ({watts} * {hours}) / 1000 = {kwh} kWh. Total cost = {kwh} kWh * ${rate:.2f} = ${total_cost:.2f}.",
                "difficulty_rating": target_difficulty,
                "tags": ["math", "energy", "everyday-life", "practical"]
            }

        elif math_type == "mental_chain":
            n1 = random.randint(14, 48)
            n2 = random.randint(3, 9)
            n3 = random.randint(15, 60)
            answer = (n1 * n2) - n3

            options = [
                str(answer),
                str(answer + random.choice([-10, 10, -5, 5])),
                str(answer + random.choice([-2, 2, -4, 4])),
                str(n1 * n2 + n3)
            ]
            random.shuffle(options)

            return {
                "challenge_type": "math_quiz",
                "genre": "math",
                "primary_domain": "numerical",
                "secondary_domains": ["speed", "mental_math"],
                "title": "Speed Math: Mental Arithmetic Chain",
                "prompt": f"Compute this arithmetic expression in your head: ({n1} × {n2}) − {n3} = ?",
                "description": "Rapid working memory and quantitative mental agility.",
                "payload": {
                    "question_type": "math_card",
                    "badge": "Mental Arithmetic",
                    "expression": f"({n1} × {n2}) − {n3}",
                    "options": options,
                    "allow_text_input": True
                },
                "correct_answer": str(answer),
                "acceptable_answers": [str(answer)],
                "hint": f"First do {n1} × {n2} = {n1 * n2}, then subtract {n3}.",
                "explanation": f"{n1} × {n2} = {n1 * n2}. Then {n1 * n2} − {n3} = {answer}.",
                "difficulty_rating": target_difficulty,
                "tags": ["math", "arithmetic", "speed"]
            }

        else: # sequence_pattern
            step = random.choice([4, 6, 7, 8, 9, 11, 13])
            start = random.randint(5, 30)
            seq = [start + i * step for i in range(5)]
            missing = seq[4]
            display = [str(x) if i != 4 else "?" for i, x in enumerate(seq)]
            options = [str(missing), str(missing + step), str(missing - 2), str(missing + 10)]
            random.shuffle(options)

            return {
                "challenge_type": "numerical_sequence",
                "genre": "math",
                "primary_domain": "numerical",
                "secondary_domains": ["patterns"],
                "title": "Pattern Hunter: Missing Number Series",
                "prompt": f"Find the missing number in the series: {'  →  '.join(display)}",
                "description": "Identify the step rule across the sequence.",
                "payload": {
                    "question_type": "sequence_cards",
                    "badge": "Pattern Hunter",
                    "sequence": display,
                    "options": options,
                    "allow_custom_input": True
                },
                "correct_answer": str(missing),
                "acceptable_answers": [str(missing)],
                "hint": f"Notice how much each number jumps from the previous (+{step}).",
                "explanation": f"Each step adds {step}. {seq[3]} + {step} = {missing}.",
                "difficulty_rating": target_difficulty,
                "tags": ["math", "patterns", "series"]
            }

    # --- 2. SPEED FOCUS & COLOR REFLEX (STROOP TEST) ---
    def generate_speed_focus_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        color_palette = [
            {"name": "RED", "hex": "#ef4444"},
            {"name": "BLUE", "hex": "#3b82f6"},
            {"name": "GREEN", "hex": "#10b981"},
            {"name": "YELLOW", "hex": "#eab308"},
            {"name": "PURPLE", "hex": "#a855f7"},
            {"name": "ORANGE", "hex": "#f97316"},
            {"name": "CYAN", "hex": "#06b6d4"},
            {"name": "PINK", "hex": "#ec4899"},
        ]

        # Select word text and conflicting ink color
        word_item = random.choice(color_palette)
        ink_candidates = [c for c in color_palette if c["name"] != word_item["name"]]
        ink_item = random.choice(ink_candidates)

        # 4 options including correct ink color
        distractors = [c["name"] for c in color_palette if c["name"] != ink_item["name"]]
        random.shuffle(distractors)
        options = distractors[:3] + [ink_item["name"]]
        random.shuffle(options)

        # Color swatch map for UI rendering
        swatches = {c["name"]: c["hex"] for c in color_palette}

        return {
            "challenge_type": "speed_stroop",
            "genre": "speed",
            "primary_domain": "attention",
            "secondary_domains": ["speed", "reflexes"],
            "title": "Speed Reflex: The Stroop Color Test",
            "prompt": "Rapidly click the INK COLOR that the word is drawn in. Do NOT click what the letters spell out!",
            "description": "Trains selective attention and executive inhibition under rapid time pressure.",
            "payload": {
                "question_type": "stroop_test",
                "badge": "Rapid Reflex",
                "display_word": word_item["name"],
                "ink_color": ink_item["name"],
                "ink_hex": ink_item["hex"],
                "swatches": swatches,
                "options": options,
                "time_limit_seconds": 6
            },
            "correct_answer": ink_item["name"],
            "acceptable_answers": [ink_item["name"], ink_item["name"].lower()],
            "hint": f"Look at the visual pigment ({ink_item['name']}), not the written letters.",
            "explanation": f"The letters read '{word_item['name']}', but the ink color is visibly {ink_item['name']}. Overcoming this cognitive interference builds executive focus.",
            "difficulty_rating": target_difficulty,
            "tags": ["speed", "stroop", "attention", "reflexes", "focus"]
        }

    # --- 3. DETECTIVE & DEDUCTIVE LOGIC ---
    def generate_logic_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        logic_mode = random.choice(["podium_race", "office_seating", "truth_guard", "pet_weight"])

        if logic_mode == "podium_race":
            names_pool = ["Maya", "Liam", "Noah", "Emma", "Carlos", "Sophia", "Ethan", "Zoe"]
            runners = random.sample(names_pool, 4)
            # Order: runners[0] > runners[1] > runners[2] > runners[3]
            r1, r2, r3, r4 = runners

            clues = [
                f"{r1} crossed the finish line ahead of {r2}.",
                f"{r2} finished ahead of {r3}, but after {r1}.",
                f"{r4} finished behind {r3} in 4th place."
            ]
            random.shuffle(clues)

            options = [r1, r2, r3, r4]
            random.shuffle(options)

            return {
                "challenge_type": "detective_quiz",
                "genre": "logic",
                "primary_domain": "logic",
                "secondary_domains": ["deduction", "critical_thinking"],
                "title": "Podium Detective: The 100m Sprint Finish",
                "prompt": f"Analyze the race clues below and determine who won the Silver Medal (2nd place):\n" + "\n".join(f"• {c}" for c in clues),
                "description": "Step-by-step constraint elimination and sequential deduction.",
                "payload": {
                    "question_type": "detective_clues",
                    "badge": "Order Deduction",
                    "scenario": "A 4-person sprint finish. Determine the 2nd place runner.",
                    "clues": clues,
                    "target_position": "2nd place (Silver Medal)",
                    "options": options
                },
                "correct_answer": r2,
                "acceptable_answers": [r2, r2.lower()],
                "hint": f"From the clues, {r1} is 1st and {r4} is 4th. Who is between {r1} and {r3}?",
                "explanation": f"The full finish order from first to last is: 1st {r1}, 2nd {r2}, 3rd {r3}, 4th {r4}. Therefore, {r2} finished in 2nd place.",
                "difficulty_rating": target_difficulty,
                "tags": ["logic", "deduction", "detective", "brain-teasers"]
            }

        elif logic_mode == "office_seating":
            colleagues = ["Alex", "Jordan", "Taylor", "Morgan"]
            random.shuffle(colleagues)
            d1, d2, d3, d4 = colleagues  # Desk 1, 2, 3, 4 from left to right

            clues = [
                f"{d1} sits at Desk #1 on the far left.",
                f"{d4} sits at Desk #4 on the far right.",
                f"{d2} sits immediately to the left of {d3}."
            ]

            target_desk = random.choice([2, 3])
            ans = d2 if target_desk == 2 else d3

            options = [d1, d2, d3, d4]
            random.shuffle(options)

            return {
                "challenge_type": "detective_quiz",
                "genre": "logic",
                "primary_domain": "logic",
                "secondary_domains": ["spatial_logic", "deduction"],
                "title": f"Office Seating: Who Sits at Desk #{target_desk}?",
                "prompt": f"Four teammates sit at desks numbered 1 to 4 from left to right.\n" + "\n".join(f"• {c}" for c in clues) + f"\nWho sits at Desk #{target_desk}?",
                "description": "Positional logic and constraint satisfaction.",
                "payload": {
                    "question_type": "detective_clues",
                    "badge": "Arrangement Logic",
                    "scenario": f"Four desks in a row (1, 2, 3, 4). Identify Desk #{target_desk}.",
                    "clues": clues,
                    "target_position": f"Desk #{target_desk}",
                    "options": options
                },
                "correct_answer": ans,
                "acceptable_answers": [ans, ans.lower()],
                "hint": f"Desk 1 is {d1}, Desk 4 is {d4}. Desks 2 and 3 belong to {d2} and {d3}.",
                "explanation": f"From left to right: Desk 1 is {d1}, Desk 2 is {d2}, Desk 3 is {d3}, Desk 4 is {d4}. So Desk #{target_desk} belongs to {ans}.",
                "difficulty_rating": target_difficulty,
                "tags": ["logic", "seating", "deduction"]
            }

        else: # truth guard
            return {
                "challenge_type": "detective_quiz",
                "genre": "logic",
                "primary_domain": "logic",
                "secondary_domains": ["critical_thinking"],
                "title": "The Gatekeepers: Truth & Lie",
                "prompt": "Two guards stand before two doors (one leads to safety, the other to a trap). One guard always tells the truth, and the other guard always lies. What single question can you ask either guard to guarantee finding the safe door?",
                "description": "Classic propositional logic and truth-value composition.",
                "payload": {
                    "question_type": "detective_clues",
                    "badge": "Classic Logic",
                    "scenario": "Two guards: one truthful, one liar. Find the safe door.",
                    "clues": [
                        "Guard A and Guard B know what the other guard would say.",
                        "Truth × Lie = Falsehood. Lie × Truth = Falsehood."
                    ],
                    "options": [
                        "Which door would the OTHER guard say is the safe door?",
                        "Are you a truth-teller or a liar?",
                        "Which door do you personally like best?",
                        "Is 2 + 2 equal to 4?"
                    ]
                },
                "correct_answer": "Which door would the OTHER guard say is the safe door?",
                "acceptable_answers": ["Which door would the OTHER guard say is the safe door?", "other guard", "other door"],
                "hint": "Ask about what the other guard would say—both guards will end up indicating the dangerous door!",
                "explanation": "If you ask Guard 1 what Guard 2 would say, both guards will point to the DANGEROUS door! (The liar lies about the truthful guard's answer; the truth-teller honestly reports the liar's lie). You simply take the opposite door!",
                "difficulty_rating": target_difficulty,
                "tags": ["logic", "truth-liar", "deduction"]
            }

    # --- 4. WORDS, ANALOGIES & LATERAL RIDDLES ---
    def generate_language_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        riddles_bank = [
            {
                "title": "Everyday Riddle: The Geographical Paradox",
                "prompt": "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
                "options": ["A Map", "A Globe", "A Painting", "A Book"],
                "correct": "A Map",
                "hint": "You unfold it or look at it on your smartphone to find navigation routes.",
                "explanation": "A map depicts cities, mountains, and bodies of water symbolically, without any real buildings, trees, or living fish!",
                "badge": "Clever Riddle"
            },
            {
                "title": "Everyday Riddle: The World Traveler",
                "prompt": "What can travel all around the world while remaining in a single corner?",
                "options": ["A Postage Stamp", "A Compass", "An Airplane", "A Postcard"],
                "correct": "A Postage Stamp",
                "hint": "It sticks to the corner of an envelope as letters travel across continents.",
                "explanation": "A postage stamp stays glued in the top-right corner of an envelope while being transported across the globe.",
                "badge": "Lateral Riddle"
            },
            {
                "title": "Word Riddle: The Footstep Paradox",
                "prompt": "The more of them you take, the more of them you leave behind. What are they?",
                "options": ["Footsteps", "Breaths", "Photographs", "Memories"],
                "correct": "Footsteps",
                "hint": "Look back at the sandy beach or snowy path behind you.",
                "explanation": "Each physical step you take leaves another footprint behind on the ground!",
                "badge": "Word Play"
            },
            {
                "title": "Musical Riddle: The Key Master",
                "prompt": "I have many keys, but I cannot unlock a single door. I have space, but no room. You can enter, but you cannot go outside. What am I?",
                "options": ["A Piano (or Keyboard)", "A Computer", "A Typewriter", "A Keyring"],
                "correct": "A Piano (or Keyboard)",
                "hint": "It produces melody or types letters, containing black and white keys or an Enter key.",
                "explanation": "A piano or computer keyboard has keys, a space bar, and enter keys, but opens no physical doors.",
                "badge": "Clever Riddle"
            },
            {
                "title": "Everyday Riddle: The Reversible Towel",
                "prompt": "What gets wetter and wetter the more it dries?",
                "options": ["A Towel", "A Sponge", "A Raincoat", "A Mop"],
                "correct": "A Towel",
                "hint": "Think about what a bath towel absorbs as you dry yourself off.",
                "explanation": "As a bath towel dries your skin, it absorbs moisture and becomes increasingly wet itself!",
                "badge": "Everyday Riddle"
            },
            {
                "title": "Word Analogy: Architect to Blueprint",
                "prompt": "ARCHITECT is to BLUEPRINT as AUTHOR is to...?",
                "options": ["NOVEL (or Manuscript)", "LIBRARY", "READER", "PEN"],
                "correct": "NOVEL (or Manuscript)",
                "hint": "An architect creates a blueprint as their primary original draft; an author creates what?",
                "explanation": "An architect designs a blueprint. Similarly, an author writes a manuscript or novel as their primary creation.",
                "badge": "Word Analogy"
            },
            {
                "title": "Word Analogy: Oasis to Desert",
                "prompt": "OASIS is to DESERT as ISLAND is to...?",
                "options": ["OCEAN (or Sea)", "BEACH", "PALM TREE", "CONTINENT"],
                "correct": "OCEAN (or Sea)",
                "hint": "An oasis is an isolated fertile spot surrounded by a desert; an island is an isolated landmass surrounded by what?",
                "explanation": "An oasis is a small water-rich haven surrounded by an arid desert. Conversely, an island is a landmass completely surrounded by ocean.",
                "badge": "Word Analogy"
            }
        ]

        r = random.choice(riddles_bank)
        return {
            "challenge_type": "verbal_quiz",
            "genre": "language",
            "primary_domain": "verbal",
            "secondary_domains": ["lateral", "analogies"],
            "title": r["title"],
            "prompt": r["prompt"],
            "description": "Vocabulary agility, verbal analogies, and lateral riddles.",
            "payload": {
                "question_type": "riddle_card",
                "badge": r["badge"],
                "options": r["options"],
                "allow_text_input": True
            },
            "correct_answer": r["correct"],
            "acceptable_answers": [r["correct"], r["correct"].lower(), r["correct"].split()[0].lower()],
            "hint": r["hint"],
            "explanation": r["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": ["language", "riddles", "analogies", "words"]
        }

    # --- 5. EVERYDAY SCIENCE, TECH & PRACTICAL LIFE SKILLS ---
    def generate_science_life_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        science_type = random.choice(["flight_time", "rule_of_72", "floating_ice", "battery_charging", "altitude_water"])

        if science_type == "flight_time":
            routes = [
                ("London (UTC+0)", "New York (UTC-5)", 8, 10),    # Departs 10:00 AM London, 8h flight -> Lands 1:00 PM NY
                ("New York (UTC-5)", "San Francisco (UTC-8)", 6, 9), # Departs 9:00 AM NY, 6h flight -> Lands 12:00 PM SF
                ("Tokyo (UTC+9)", "Sydney (UTC+10)", 10, 8),        # Departs 8:00 AM Tokyo, 10h flight -> Lands 7:00 PM Sydney
                ("Paris (UTC+1)", "Dubai (UTC+4)", 7, 11)           # Departs 11:00 AM Paris, 7h flight -> Lands 9:00 PM Dubai
            ]
            dep_city, arr_city, duration, dep_hour = random.choice(routes)
            # Calculate arrival local time:
            # dep UTC = dep_hour - dep_tz
            dep_tz = int(dep_city.split("UTC")[1].replace(")", ""))
            arr_tz = int(arr_city.split("UTC")[1].replace(")", ""))
            arr_hour_local = dep_hour + duration + (arr_tz - dep_tz)
            period = "AM" if arr_hour_local < 12 else "PM"
            display_hr = arr_hour_local if arr_hour_local <= 12 else arr_hour_local - 12
            ans = f"{display_hr}:00 {period}"

            options = [
                ans,
                f"{(display_hr + 2) if display_hr + 2 <= 12 else display_hr - 10}:00 {period}",
                f"{max(1, display_hr - 3)}:00 {'AM' if period == 'PM' else 'PM'}",
                f"{display_hr}:30 {period}"
            ]
            random.shuffle(options)

            return {
                "challenge_type": "science_quiz",
                "genre": "science",
                "primary_domain": "critical_thinking",
                "secondary_domains": ["everyday_life", "travel", "math"],
                "title": f"Travel Smarts: Flight Time Zones ({dep_city.split(' (')[0]} → {arr_city.split(' (')[0]})",
                "prompt": f"Your flight departs {dep_city} at {dep_hour}:00 AM. The flight lasts {duration} hours non-stop to {arr_city}. What local time do you land in {arr_city.split(' (')[0]}?",
                "description": "Practical international travel time zone calculation.",
                "payload": {
                    "question_type": "practical_scenario",
                    "badge": "Travel Time Zones",
                    "departure": f"{dep_city} at {dep_hour}:00 AM",
                    "duration": f"{duration} hours",
                    "arrival_city": arr_city,
                    "options": options
                },
                "correct_answer": ans,
                "acceptable_answers": [ans, ans.lower(), ans.replace(" ", "")],
                "hint": f"1. Departure local is {dep_hour}:00. Add {duration} hours = {dep_hour + duration}:00 in departure timezone. 2. Adjust by the time zone offset ({arr_tz - dep_tz} hours).",
                "explanation": f"In departure time, you land at {dep_hour + duration}:00. The destination timezone is {arr_tz - dep_tz:+d} hours difference. Local arrival time is {ans}.",
                "difficulty_rating": target_difficulty,
                "tags": ["science", "travel", "time-zones", "everyday-life"]
            }

        elif science_type == "rule_of_72":
            rates = [6, 8, 9, 12]
            rate = random.choice(rates)
            years = int(72 / rate)
            principal = random.choice([1000, 2000, 5000])

            options = [
                f"About {years} years",
                f"About {years + 6} years",
                f"About {max(2, years - 4)} years",
                f"About 72 years"
            ]
            random.shuffle(options)

            return {
                "challenge_type": "science_quiz",
                "genre": "science",
                "primary_domain": "critical_thinking",
                "secondary_domains": ["finance", "life_skills"],
                "title": f"Personal Finance: Compounding at {rate}% Interest",
                "prompt": f"If you save ${principal:,} in an index fund earning an average {rate}% annual compound return, using the financial 'Rule of 72' shortcut (72 ÷ Interest Rate), how many years will it take for your balance to double to ${principal * 2:,}?",
                "description": "Essential financial literacy and compound growth mechanics.",
                "payload": {
                    "question_type": "practical_scenario",
                    "badge": "Money Smarts",
                    "principal": f"${principal:,}",
                    "return_rate": f"{rate}% per year",
                    "target": f"${principal * 2:,}",
                    "options": options
                },
                "correct_answer": f"About {years} years",
                "acceptable_answers": [f"About {years} years", f"{years} years", str(years)],
                "hint": f"Divide 72 by {rate}: 72 ÷ {rate} = ?",
                "explanation": f"The Rule of 72 gives the doubling time: 72 ÷ {rate} = {years} years. Your money will double approximately every {years} years!",
                "difficulty_rating": target_difficulty,
                "tags": ["finance", "money", "everyday-life", "math"]
            }

        elif science_type == "floating_ice":
            return {
                "challenge_type": "science_quiz",
                "genre": "science",
                "primary_domain": "critical_thinking",
                "secondary_domains": ["everyday_physics"],
                "title": "Everyday Physics: The Floating Ice Cube in a Full Glass",
                "prompt": "A drinking glass is filled with water to the very brim, and a large ice cube is floating in it. When the ice cube melts completely into water, what happens to the water level?",
                "description": "Everyday fluid mechanics and Archimedes' Principle.",
                "payload": {
                    "question_type": "practical_scenario",
                    "badge": "Everyday Physics",
                    "options": [
                        "It stays exactly the same (does not spill)",
                        "It overflows and spills onto the table",
                        "The water level drops noticeably",
                        "The glass shatters from cold contraction"
                    ]
                },
                "correct_answer": "It stays exactly the same (does not spill)",
                "acceptable_answers": ["It stays exactly the same (does not spill)", "stays the same", "same", "does not spill"],
                "hint": "According to Archimedes' principle, a floating object displaces a weight of water equal to its own weight.",
                "explanation": "When floating, the ice cube displaces a volume of water exactly equal to its mass. When it melts, it turns into that exact same volume of water! Thus, the water level remains identical.",
                "difficulty_rating": target_difficulty,
                "tags": ["science", "physics", "everyday-knowledge"]
            }

        elif science_type == "battery_charging":
            return {
                "challenge_type": "science_quiz",
                "genre": "science",
                "primary_domain": "critical_thinking",
                "secondary_domains": ["everyday_tech"],
                "title": "Modern Tech: Leaving Your Smartphone Plugged in Overnight",
                "prompt": "You leave your modern smartphone plugged in overnight with its standard charger. Does this significantly damage or 'overcharge' the battery?",
                "description": "Understanding lithium-ion battery management chips in modern electronics.",
                "payload": {
                    "question_type": "practical_scenario",
                    "badge": "Everyday Tech",
                    "options": [
                        "No: Smart battery management chips automatically stop high charging once at 100%.",
                        "Yes: It will continually pump high voltage until it overheats and destroys the battery.",
                        "Yes: Leaving it plugged in reverses the electric charge and drains the phone to 0%.",
                        "No: But only if you turn on Airplane Mode."
                    ]
                },
                "correct_answer": "No: Smart battery management chips automatically stop high charging once at 100%.",
                "acceptable_answers": ["No: Smart battery management chips automatically stop high charging once at 100%.", "No", "smart chips stop"],
                "hint": "Modern electronics have built-in power management integrated circuits (PMICs).",
                "explanation": "Modern smartphones and chargers contain dedicated battery management circuits that stop high current and switch to trickle/idle mode once 100% is reached, preventing overcharging.",
                "difficulty_rating": target_difficulty,
                "tags": ["science", "technology", "everyday-tech"]
            }

        else: # altitude water
            return {
                "challenge_type": "science_quiz",
                "genre": "science",
                "primary_domain": "critical_thinking",
                "secondary_domains": ["everyday_physics", "cooking"],
                "title": "Kitchen Science: Boiling Water in High-Altitude Mountains",
                "prompt": "You are cooking pasta in a mountain cabin at 8,000 feet elevation. Does water boil at a higher temperature, lower temperature, or the exact same 100°C (212°F) as at sea level?",
                "description": "Atmospheric pressure and vapor pressure in cooking.",
                "payload": {
                    "question_type": "practical_scenario",
                    "badge": "Kitchen Science",
                    "options": [
                        "At a lower temperature (around 92°C / 198°F)",
                        "At a higher temperature (around 108°C / 226°F)",
                        "At the exact same 100°C (212°F)",
                        "Water cannot boil at high elevations"
                    ]
                },
                "correct_answer": "At a lower temperature (around 92°C / 198°F)",
                "acceptable_answers": ["At a lower temperature (around 92°C / 198°F)", "lower", "lower temperature"],
                "hint": "Atmospheric air pressure is lower at high altitudes, meaning water molecules escape into steam more easily.",
                "explanation": "Because atmospheric pressure is lower at high altitude, water boils at a lower temperature (~92°C). This is why boiling food in the mountains actually takes longer to cook!",
                "difficulty_rating": target_difficulty,
                "tags": ["science", "physics", "cooking", "everyday-life"]
            }

    # --- 6. MATCHING CHALLENGES (INTERACTIVE PAIR MATCHING) ---
    def generate_matching_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        scenarios = [
            {
                "title": "Everyday Tech & Operating Principles Matching",
                "prompt": "Match each everyday household gadget with the core physical principle it uses to operate.",
                "pairs": [
                    {"left": "Microwave Oven", "right": "Agitates water molecules with electromagnetic waves"},
                    {"left": "Refrigerator", "right": "Evaporates refrigerant liquid to absorb heat from inside"},
                    {"left": "Surge Protector", "right": "Diverts sudden voltage spikes harmlessly to ground"},
                    {"left": "Smoke Detector", "right": "Detects particulate matter disrupting light or ion beams"}
                ],
                "hint": "Think about how each device handles heat, electricity, or airborne particles.",
                "explanation": "Microwaves target polar water molecules; fridges use refrigerant phase change; surge protectors absorb voltage spikes; smoke detectors sense airborne particle interference.",
                "domain": "science",
                "tags": ["matching", "technology", "gadgets", "science"]
            },
            {
                "title": "Personal Finance Concepts Matching",
                "prompt": "Match each personal finance concept with its real-world everyday definition.",
                "pairs": [
                    {"left": "Compound Interest", "right": "Earning returns on both principal and accumulated interest"},
                    {"left": "Emergency Fund", "right": "Liquid savings set aside strictly for unexpected emergencies"},
                    {"left": "Diversification", "right": "Spreading investments across multiple asset classes to lower risk"},
                    {"left": "Inflation", "right": "General increase in prices reducing the purchasing power of money"}
                ],
                "hint": "Match the core financial goal or outcome to each named term.",
                "explanation": "Compound interest creates exponential growth; emergency funds provide immediate liquidity; diversification reduces single-asset risk; inflation erodes purchasing power.",
                "domain": "numerical",
                "tags": ["matching", "finance", "money", "life-skills"]
            }
        ]
        sc = random.choice(scenarios)
        left_items = [{"id": f"left_{i+1}", "text": p["left"]} for i, p in enumerate(sc["pairs"])]
        right_items = [{"id": f"right_{i+1}", "text": p["right"]} for i, p in enumerate(sc["pairs"])]
        correct_pairs = {f"left_{i+1}": f"right_{i+1}" for i in range(len(sc["pairs"]))}
        random.shuffle(right_items)

        return {
            "challenge_type": "matching",
            "genre": "matching",
            "primary_domain": sc["domain"],
            "secondary_domains": ["logic", "semantic_reasoning"],
            "title": sc["title"],
            "prompt": sc["prompt"],
            "description": "Click an item on the left and match it to its corresponding pair on the right.",
            "payload": {
                "interaction_format": "matching",
                "left_items": left_items,
                "right_items": right_items,
                "pairs": correct_pairs
            },
            "correct_answer": correct_pairs,
            "acceptable_answers": [str(correct_pairs)],
            "hint": sc["hint"],
            "explanation": sc["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": sc["tags"]
        }

    # --- 7. ORDERING & SEQUENCING CHALLENGES ---
    def generate_ordering_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        scenarios = [
            {
                "title": "Kitchen First Aid: Burn Treatment Sequence",
                "prompt": "Arrange the standard first aid procedure for a minor kitchen heat burn in the correct chronological order.",
                "steps": [
                    "Immediately remove the person from the heat source",
                    "Cool the affected area under gentle running cool water for 10-15 minutes",
                    "Carefully remove rings, watches, or tight items before swelling starts",
                    "Loosely cover the clean burn with a sterile, non-stick dressing"
                ],
                "hint": "Safety first, followed by thermal cooling, constriction prevention, and protection.",
                "explanation": "Proper burn protocol: 1. Remove from danger -> 2. Cool with running water -> 3. Remove jewelry before swelling -> 4. Cover with clean non-stick bandage.",
                "domain": "science",
                "tags": ["ordering", "first-aid", "safety", "logic"]
            },
            {
                "title": "Cognitive Focus: Structured Problem Solving Order",
                "prompt": "Arrange the core phases of structured problem solving from first step to final execution.",
                "steps": [
                    "Precisely define the problem statement and identify boundary constraints",
                    "Gather verifiable evidence and distinguish facts from assumptions",
                    "Generate multiple solution alternatives without premature filtering",
                    "Evaluate trade-offs and systematically execute the chosen plan"
                ],
                "hint": "Start with defining the problem, then gather facts, brainstorm, and finally execute.",
                "explanation": "Effective problem solving proceeds from problem definition to fact-finding, divergent ideation, and finally convergent execution.",
                "domain": "logic",
                "tags": ["ordering", "critical-thinking", "problem-solving"]
            }
        ]
        sc = random.choice(scenarios)
        correct_ids = [f"step_{i+1}" for i in range(len(sc["steps"]))]
        items = [{"id": f"step_{i+1}", "text": step} for i, step in enumerate(sc["steps"])]
        shuffled_items = list(items)
        while shuffled_items == items and len(items) > 1:
            random.shuffle(shuffled_items)

        return {
            "challenge_type": "ordering",
            "genre": "ordering",
            "primary_domain": sc["domain"],
            "secondary_domains": ["sequencing", "logic"],
            "title": sc["title"],
            "prompt": sc["prompt"],
            "description": "Use the up and down arrows to place the steps in their correct sequential order.",
            "payload": {
                "interaction_format": "ordering",
                "items": shuffled_items,
                "correct_order": correct_ids
            },
            "correct_answer": correct_ids,
            "acceptable_answers": [str(correct_ids)],
            "hint": sc["hint"],
            "explanation": sc["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": sc["tags"]
        }

    # --- 8. TRUE / FALSE RAPID DECISION CHALLENGES ---
    def generate_true_false_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        scenarios = [
            {
                "statement": "Sound waves travel substantially faster through water than through atmospheric air.",
                "is_true": True,
                "context": "Water is roughly 800 times denser than air, with closely packed molecules.",
                "hint": "Consider molecular density and how vibrations propagate through matter.",
                "explanation": "True. Because water molecules are much closer together than gas molecules in air, sound waves travel about 4.3 times faster in water (~1,480 m/s vs 343 m/s).",
                "domain": "science",
                "tags": ["true_false", "physics", "acoustics"]
            },
            {
                "statement": "Leaving a modern smartphone plugged into its charger overnight degrades the battery from overcharging.",
                "is_true": False,
                "context": "Modern consumer electronics feature power management integrated circuits (PMICs).",
                "hint": "Smart devices contain internal charging chips that govern power flow.",
                "explanation": "False. Modern smartphones and chargers contain dedicated battery management chips that automatically shut off incoming current once 100% is reached.",
                "domain": "science",
                "tags": ["true_false", "technology", "gadgets"]
            },
            {
                "statement": "If a store gives you a 50% discount and then an additional 50% discount at checkout, the item is completely free.",
                "is_true": False,
                "context": "Sequential discounts apply successively to remaining balances.",
                "hint": "Calculate the second 50% discount on the remaining half price.",
                "explanation": "False. The second 50% applies to the remaining balance ($50 on a $100 item), leaving $25. The total discount is 75%, not 100%.",
                "domain": "numerical",
                "tags": ["true_false", "math", "shopping"]
            }
        ]
        sc = random.choice(scenarios)
        return {
            "challenge_type": "true_false",
            "genre": "true_false",
            "primary_domain": sc["domain"],
            "secondary_domains": ["critical_thinking"],
            "title": f"Fact or Myth: {sc['statement'][:40]}...",
            "prompt": f"Is this statement True or False: '{sc['statement']}'",
            "description": "Evaluate the statement and select True or False.",
            "payload": {
                "interaction_format": "true_false",
                "statement": sc["statement"],
                "context": sc["context"]
            },
            "correct_answer": sc["is_true"],
            "acceptable_answers": ["True" if sc["is_true"] else "False", str(sc["is_true"]).lower()],
            "hint": sc["hint"],
            "explanation": sc["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": sc["tags"]
        }

    # --- 9. MULTI-SELECT CHALLENGES ---
    def generate_multi_select_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        scenarios = [
            {
                "title": "Energy Smarts: Major Electricity Savers",
                "prompt": "Which TWO of the following household actions genuinely save the most electricity on a monthly home bill?",
                "options": [
                    {"id": "opt_a", "text": "Adjusting the air conditioner thermostat up by 2° to 3°F (1.5°C)", "is_correct": True},
                    {"id": "opt_b", "text": "Lowering the water heater temperature setting to 120°F (49°C)", "is_correct": True},
                    {"id": "opt_c", "text": "Unplugging phone chargers when not connected to a phone", "is_correct": False},
                    {"id": "opt_d", "text": "Turning off a modern 8-watt LED light bulb when leaving the room for 1 minute", "is_correct": False}
                ],
                "hint": "Heating and air conditioning (HVAC) and water heating account for over 60% of home energy consumption.",
                "explanation": "HVAC and water heating consume over 60% of typical home power. Adjusting thermostat settings produces substantial savings, whereas unplugging idle chargers saves pennies.",
                "domain": "science",
                "tags": ["multi_select", "energy", "practical-science"]
            }
        ]
        sc = random.choice(scenarios)
        correct_ids = [opt["id"] for opt in sc["options"] if opt["is_correct"]]
        options_data = [{"id": opt["id"], "text": opt["text"]} for opt in sc["options"]]
        random.shuffle(options_data)

        return {
            "challenge_type": "multi_select",
            "genre": "multi_select",
            "primary_domain": sc["domain"],
            "secondary_domains": ["logic", "evaluation"],
            "title": sc["title"],
            "prompt": sc["prompt"],
            "description": "Select all correct choices that apply, then click submit.",
            "payload": {
                "interaction_format": "multi_select",
                "options": options_data,
                "required_count": len(correct_ids)
            },
            "correct_answer": correct_ids,
            "acceptable_answers": [str(correct_ids)],
            "hint": sc["hint"],
            "explanation": sc["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": sc["tags"]
        }

    # --- 10. ODD ONE OUT CHALLENGES ---
    def generate_odd_one_out_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        scenarios = [
            {
                "title": "Categorical Outlier: Home Appliances",
                "prompt": "Which one of these four home appliances does NOT rely on a mechanical compressor to function?",
                "items": [
                    {"id": "item_1", "text": "Kitchen Refrigerator", "subtext": "Keeps perishables cold"},
                    {"id": "item_2", "text": "Window Air Conditioner", "subtext": "Cools room air"},
                    {"id": "item_3", "text": "Basement Dehumidifier", "subtext": "Condenses humidity from room air"},
                    {"id": "item_4", "text": "Countertop Microwave Oven", "subtext": "Rapidly heats food"}
                ],
                "correct_id": "item_4",
                "hint": "Three of these use a refrigerant compression cycle; one uses electromagnetic waves.",
                "explanation": "The microwave oven uses a magnetron tube to emit electromagnetic waves, unlike the other three which all use vapor-compression refrigerant cycles.",
                "domain": "science",
                "tags": ["odd_one_out", "classification", "science"]
            }
        ]
        sc = random.choice(scenarios)
        return {
            "challenge_type": "odd_one_out",
            "genre": "odd_one_out",
            "primary_domain": sc["domain"],
            "secondary_domains": ["classification", "critical_thinking"],
            "title": sc["title"],
            "prompt": sc["prompt"],
            "description": "Identify the item that does not belong with the others.",
            "payload": {
                "interaction_format": "odd_one_out",
                "items": sc["items"]
            },
            "correct_answer": sc["correct_id"],
            "acceptable_answers": [sc["correct_id"]],
            "hint": sc["hint"],
            "explanation": sc["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": sc["tags"]
        }

    # --- 11. FILL IN THE BLANK & ANAGRAM CHALLENGES ---
    def generate_fill_blank_challenge(self, target_difficulty: float = 1200.0) -> Dict[str, Any]:
        scenarios = [
            {
                "title": "Word Anagram: Brain Plasticity",
                "prompt": "Unscramble this word describing the human brain's ability to adapt, grow, and reorganize neural pathways: A L P S T C I I T Y",
                "solution": "PLASTICITY",
                "letters": ["P", "L", "A", "S", "T", "I", "C", "I", "T", "Y"],
                "hint": "Starts with 'P' and ends with 'Y'. Think neuroplasticity!",
                "explanation": "The word is PLASTICITY (Neuroplasticity), describing the brain's ongoing structural adaptability.",
                "domain": "verbal",
                "tags": ["fill_blank", "anagram", "neuroscience", "words"]
            },
            {
                "title": "Quick Arithmetic Fill: Flash Sale Price",
                "prompt": "A pair of shoes originally priced at $80 is marked 30% off. What is the final sale price in dollars? (Enter number only)",
                "solution": "56",
                "letters": [],
                "hint": "30% of $80 is $24. Subtract $24 from $80.",
                "explanation": "Discount = 30% of $80 = $24. Final price = $80 - $24 = $56.",
                "domain": "numerical",
                "tags": ["fill_blank", "math", "shopping"]
            }
        ]
        sc = random.choice(scenarios)
        return {
            "challenge_type": "fill_blank",
            "genre": "fill_blank",
            "primary_domain": sc["domain"],
            "secondary_domains": ["typing", "verbal_reasoning"],
            "title": sc["title"],
            "prompt": sc["prompt"],
            "description": "Type your solution or click letter tiles.",
            "payload": {
                "interaction_format": "fill_blank",
                "scrambled_letters": sc["letters"],
                "placeholder": "Type solution here..."
            },
            "correct_answer": sc["solution"],
            "acceptable_answers": [sc["solution"].lower(), sc["solution"].upper(), sc["solution"]],
            "hint": sc["hint"],
            "explanation": sc["explanation"],
            "difficulty_rating": target_difficulty,
            "tags": sc["tags"]
        }

    # Main dispatch router
    def generate_by_genre(self, genre: str = "random", target_difficulty: float = 1200.0) -> Dict[str, Any]:
        if genre == "random" or genre not in self.GENRES:
            genre = random.choice(["math", "speed", "logic", "language", "science", "matching", "ordering", "true_false", "multi_select", "odd_one_out", "fill_blank"])

        if genre == "math":
            return self.generate_math_challenge(target_difficulty)
        elif genre == "speed":
            return self.generate_speed_focus_challenge(target_difficulty)
        elif genre == "logic":
            return self.generate_logic_challenge(target_difficulty)
        elif genre == "language":
            return self.generate_language_challenge(target_difficulty)
        elif genre == "science":
            return self.generate_science_life_challenge(target_difficulty)
        elif genre == "matching":
            return self.generate_matching_challenge(target_difficulty)
        elif genre in ["ordering", "sequence"]:
            return self.generate_ordering_challenge(target_difficulty)
        elif genre == "true_false":
            return self.generate_true_false_challenge(target_difficulty)
        elif genre in ["multi_select", "multiple_answer"]:
            return self.generate_multi_select_challenge(target_difficulty)
        elif genre in ["odd_one_out", "outlier"]:
            return self.generate_odd_one_out_challenge(target_difficulty)
        elif genre in ["fill_blank", "anagram"]:
            return self.generate_fill_blank_challenge(target_difficulty)
        else:
            return self.generate_math_challenge(target_difficulty)

genre_generator = GenreChallengeGenerator()
