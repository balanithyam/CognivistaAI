import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets cell padding."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report():
    doc = Document()

    # Set standard page margins (1 inch all around)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1)

    # Style defaults
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0x1a, 0x1a, 0x1a)

    # ==========================================
    # 1. TITLE PAGE
    # ==========================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(40)
    p_title.paragraph_format.space_after = Pt(12)
    r_title = p_title.add_run("COGNIVISTA — ADAPTIVE BRAIN CHALLENGE &\nCOGNITIVE TRAINING AGENT USING NLP")
    r_title.bold = True
    r_title.font.size = Pt(18)
    r_title.font.color.rgb = RGBColor(0x00, 0x20, 0x60)

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_course.paragraph_format.space_after = Pt(50)
    r_course = p_course.add_run("23IT23E – AI TOOLS FOR NATURAL LANGUAGE PROCESSING")
    r_course.bold = True
    r_course.font.size = Pt(13)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    r_sub = p_sub.add_run("Submitted in partial fulfillment for the award of the degree of")
    r_sub.italic = True
    r_sub.font.size = Pt(12)

    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_after = Pt(4)
    r_deg = p_deg.add_run("BACHELOR OF TECHNOLOGY")
    r_deg.bold = True
    r_deg.font.size = Pt(14)

    p_branch = doc.add_paragraph()
    p_branch.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_branch.paragraph_format.space_after = Pt(80)
    r_branch = p_branch.add_run("in\nINFORMATION TECHNOLOGY")
    r_branch.bold = True
    r_branch.font.size = Pt(13)

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(4)
    r_inst = p_inst.add_run("NATIONAL ENGINEERING COLLEGE\n(An Autonomous Institution affiliated to Anna University, Chennai)\nK.R.NAGAR, KOVILPATTI - 628503\nOCTOBER 2026")
    r_inst.bold = True
    r_inst.font.size = Pt(12)

    doc.add_page_break()

    # ==========================================
    # 2. BONAFIDE CERTIFICATE
    # ==========================================
    p_cert_inst = doc.add_paragraph()
    p_cert_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_inst.paragraph_format.space_before = Pt(20)
    p_cert_inst.paragraph_format.space_after = Pt(4)
    r_ci = p_cert_inst.add_run("NATIONAL ENGINEERING COLLEGE\n(An Autonomous Institution affiliated to Anna University, Chennai)\nK.R. NAGAR, KOVILPATTI - 628503")
    r_ci.bold = True
    r_ci.font.size = Pt(13)

    p_cert_title = doc.add_paragraph()
    p_cert_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_title.paragraph_format.space_before = Pt(40)
    p_cert_title.paragraph_format.space_after = Pt(30)
    r_ct = p_cert_title.add_run("BONAFIDE CERTIFICATE")
    r_ct.bold = True
    r_ct.font.size = Pt(15)
    r_ct.underline = True

    p_cert_body = doc.add_paragraph()
    p_cert_body.paragraph_format.line_spacing = 1.5
    p_cert_body.paragraph_format.space_after = Pt(100)
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_cb = p_cert_body.add_run(
        "This is to certify that this project report, “COGNIVISTA – Adaptive Brain Challenge & Cognitive Training Agent Using NLP”, "
        "is the bonafide work of the student who carried out the project work under my supervision in partial fulfillment of the requirements for the award of the degree of "
        "Bachelor of Technology in Information Technology at National Engineering College, Kovilpatti."
    )
    r_cb.font.size = Pt(12)

    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_g = p_guide.add_run("Course Instructor / Guide\nDepartment of Information Technology\nNational Engineering College")
    r_g.bold = True
    r_g.font.size = Pt(12)

    doc.add_page_break()

    # ==========================================
    # 3. TABLE OF CONTENTS
    # ==========================================
    p_toc_heading = doc.add_paragraph()
    p_toc_heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_heading.paragraph_format.space_before = Pt(20)
    p_toc_heading.paragraph_format.space_after = Pt(20)
    r_toc = p_toc_heading.add_run("TABLE OF CONTENTS")
    r_toc.bold = True
    r_toc.font.size = Pt(16)

    toc_table = doc.add_table(rows=1, cols=3)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.autofit = False

    col_widths = [Inches(1.2), Inches(4.3), Inches(1.0)]
    hdr_cells = toc_table.rows[0].cells
    hdr_titles = ["CHAPTER NO", "TITLE", "PAGE NO"]
    for i, title in enumerate(hdr_titles):
        hdr_cells[i].text = title
        hdr_cells[i].paragraphs[0].runs[0].font.bold = True
        hdr_cells[i].paragraphs[0].runs[0].font.size = Pt(11)
        set_cell_background(hdr_cells[i], "D9E1F2")
        hdr_cells[i].width = col_widths[i]

    toc_rows = [
        ("1", "INTRODUCTION", "4"),
        ("2", "OBJECTIVES", "6"),
        ("3", "SYSTEM DESCRIPTION & NLP APPROACH", "7"),
        ("4", "AI & NLP PIPELINE ARCHITECTURE", "10"),
        ("5", "MATHEMATICAL FORMULATIONS & ALGORITHMS", "14"),
        ("6", "TECH STACK & PACKAGES", "19"),
        ("7", "DATABASE & KNOWLEDGE BASE STRUCTURES", "21"),
        ("8", "MODULES & IMPLEMENTATION WALKTHROUGH", "25"),
        ("9", "OUTPUT SCREENSHOTS", "30"),
        ("10", "CONCLUSION & FUTURE ENHANCEMENTS", "35"),
    ]

    for ch, title, pg in toc_rows:
        row_cells = toc_table.add_row().cells
        row_cells[0].text = ch
        row_cells[1].text = title
        row_cells[2].text = pg
        for i in range(3):
            row_cells[i].width = col_widths[i]
            row_cells[i].paragraphs[0].runs[0].font.size = Pt(11)
            row_cells[i].paragraphs[0].runs[0].font.bold = True
            set_cell_margins(row_cells[i], 80, 80, 100, 100)

    doc.add_page_break()

    def add_chapter_title(num, name):
        p_c = doc.add_paragraph()
        p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_c.paragraph_format.space_before = Pt(24)
        p_c.paragraph_format.space_after = Pt(4)
        r_c = p_c.add_run(f"CHAPTER {num}")
        r_c.bold = True
        r_c.font.size = Pt(15)
        r_c.font.color.rgb = RGBColor(0x00, 0x20, 0x60)

        p_t = doc.add_paragraph()
        p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_t.paragraph_format.space_after = Pt(24)
        r_t = p_t.add_run(name)
        r_t.bold = True
        r_t.font.size = Pt(15)
        r_t.font.color.rgb = RGBColor(0x00, 0x20, 0x60)

    def add_section_title(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(title)
        r.bold = True
        r.font.size = Pt(13)
        r.font.color.rgb = RGBColor(0x1F, 0x4E, 0x78)

    def add_body(text):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(8)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(text)
        r.font.size = Pt(11.5)

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r_b = p.add_run(bold_prefix)
        r_b.bold = True
        r_b.font.size = Pt(11.5)
        r_t = p.add_run(text)
        r_t.font.size = Pt(11.5)

    # ==========================================
    # CHAPTER 1: INTRODUCTION
    # ==========================================
    add_chapter_title(1, "INTRODUCTION")
    add_body(
        "Cognitive training and intellectual fitness applications have expanded significantly as users seek to sharpen memory, logical deduction, processing speed, and practical reasoning. However, standard quiz applications and digital puzzle websites suffer from fundamental limitations: they rely on static, pre-authored question banks, offer predictable multiple-choice questionnaires, lack conversational memory, and place generic chatbots beside static quizzes rather than placing an autonomous agent at the core of the challenge universe."
    )
    add_body(
        "COGNIVISTA is an autonomous AI-powered cognitive challenge and training agent developed with modern Natural Language Processing (NLP), dynamic challenge synthesis, deterministic skill calibration, and interactive SVG diagrams. Cognivista is not a passive quiz website, but an active pair-training partner that understands freeform natural-language requests, tracks long-term performance across seven cognitive faculties, diagnoses reasoning errors, and dynamically prescribes tailored exercises."
    )

    add_section_title("1.1 Problem Statement")
    add_body(
        "Conventional learning and brain-training websites suffer from four core architectural flaws: (1) Fixed question banks that lead to rote memorization rather than adaptive reasoning; (2) Inability to interpret natural-language requests such as 'give me a difficult memory challenge but avoid numbers' or 'make that harder'; (3) Inadequate mistake diagnosis that merely displays an answer key without explaining the cognitive failure mechanism; and (4) Pure text-based representation that lacks dynamic diagrams, visual geometry models, or interactive schematics."
    )

    add_section_title("1.2 Proposed Solution")
    add_body(
        "Cognivista resolves these limitations through a multi-stage autonomous agent pipeline: (1) NLP understanding that parses user intent, coreferences, and domain constraints; (2) Dynamic challenge generation combining generative AI, procedural algorithms, and live real-world information; (3) Rich visual rendering featuring dynamic SVG schematics inspired by platforms like Wayground; (4) Twelve specialized interaction formats including matching, sequencing, and detective grids; (5) Semantic answer evaluation and contextual mistake explanations; and (6) An adaptive Elo rating engine that personalizes difficulty in real time."
    )

    add_section_title("1.3 Scope of the Project")
    add_body(
        "The project encompasses seven core cognitive domains: Quantitative Reasoning, Deductive Logic, Working Memory, Processing Speed, Spatial/Mechanical Reasoning, Language/Lateral Thinking, and Everyday Life Science. The platform implements exactly six functionally distinct application pages, provides strict per-user database isolation, and functions strictly as an educational brain gym without making medical or clinical diagnostic claims."
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 2: OBJECTIVES
    # ==========================================
    add_chapter_title(2, "OBJECTIVES")
    add_body("The primary technical and educational objectives of the Cognivista system are:")
    add_bullet("Autonomous Agent Centricity: ", "To establish an AI agent at the direct center of the challenge ecosystem, governing generation, interaction, evaluation, and adaptive progression.")
    add_bullet("Natural Language Processing: ", "To implement an NLP intent parser capable of understanding unseen conversational prompts, context references, negations, and skill fusions.")
    add_bullet("Infinite Dynamic Variety: ", "To eliminate static question banks by synthesizing on-demand, non-repetitive challenges across twelve distinct interaction formats.")
    add_bullet("Interactive Visual Diagrams: ", "To render dynamic SVG graphics—including geometric angle models, electric series/parallel circuit schematics, rotating gear trains, balance scales, and international flight maps.")
    add_bullet("Cognitive Mistake Diagnosis: ", "To evaluate freeform and structured responses semantically, pinpointing the specific reasoning mechanism behind an error through a conversational 'Why was my answer wrong?' interface.")
    add_bullet("Adaptive Elo Rating System: ", "To mathematically calibrate composite and domain-specific Elo ratings in real time based on challenge difficulty, velocity, and hint usage.")
    add_bullet("Repetition Avoidance Guarantee: ", "To track recent domain, format, and structural properties, mathematically preventing repetitive challenge patterns.")
    add_bullet("Live Real-World Intelligence: ", "To retrieve verified external data from Open-Meteo and World Time API, transforming live feeds into reasoning challenges with source attribution.")
    add_bullet("Six Functionally Distinct Pages: ", "To build six dedicated pages differentiated by function: My Progress, Create Challenge, Challenge, Challenge Review, Training Session, and Live Challenges.")
    add_bullet("Secure Dual-Engine Persistence: ", "To provide database-backed authentication, session management, and encrypted data storage with seamless SQLite and PostgreSQL fallback.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 3: SYSTEM DESCRIPTION & NLP APPROACH
    # ==========================================
    add_chapter_title(3, "SYSTEM DESCRIPTION & NLP APPROACH")
    add_section_title("3.1 System Overview")
    add_body(
        "Cognivista is architected as an asynchronous, full-stack web application. The frontend is built with React 19, TypeScript, Vite, and Tailwind CSS, featuring an original deep neutral theme with electric-violet and luminous-mint accents. The backend is powered by Python 3.12 and FastAPI, executing asynchronous request routing, mathematical Elo calibration, and AI agent orchestration. Communication between layers occurs via type-safe REST APIs and real-time WebSockets."
    )

    add_section_title("3.2 System Modules")
    add_body("The architecture is divided into five core functional modules:")
    add_bullet("Authentication & Profile Module: ", "Handles user registration, bcrypt password hashing, JWT session security, and persistent storage of cognitive performance metrics and streak records.")
    add_bullet("NLP Intent & Context Memory Module: ", "Decomposes freeform natural language queries, identifies target cognitive domains, extracts constraints, and tracks conversational context.")
    add_bullet("Challenge Synthesis & Visuals Module: ", "Directs procedural generation, LLM synthesis, and Wayground-style SVG vector diagram rendering.")
    add_bullet("Semantic Evaluation & Diagnostic Module: ", "Validates user responses, diagnoses cognitive error mechanisms, and generates pedagogical remediation.")
    add_bullet("Autonomous Adaptive Orchestration Module: ", "Controls multi-step training sessions, updating domain Elo ratings and prescribing subsequent challenges.")

    add_section_title("3.3 NLP Approach")
    add_body(
        "Cognivista rejects static keyword lookup tables in favor of a hybrid NLP strategy combining zero-shot language model reasoning with deterministic pattern extractors and semantic fuzzy matching, as summarized in Table 3.1."
    )

    # Table 3.1
    p_t31 = doc.add_paragraph()
    p_t31.paragraph_format.space_before = Pt(8)
    p_t31.paragraph_format.space_after = Pt(4)
    r_t31 = p_t31.add_run("Table 3.1 NLP Techniques Used in Cognivista")
    r_t31.bold = True
    r_t31.font.size = Pt(10.5)

    t31 = doc.add_table(rows=1, cols=3)
    t31.alignment = WD_TABLE_ALIGNMENT.CENTER
    t31_widths = [Inches(1.8), Inches(2.2), Inches(2.5)]
    for i, h in enumerate(["Technique", "Purpose in System", "Implementation Details"]):
        t31.rows[0].cells[i].text = h
        t31.rows[0].cells[i].paragraphs[0].runs[0].font.bold = True
        set_cell_background(t31.rows[0].cells[i], "D9E1F2")
        t31.rows[0].cells[i].width = t31_widths[i]

    t31_data = [
        ("Intent Classification", "Identifies user training objective", "Zero-shot classification with temperature 0.1 and JSON output mode, backed by regex fallback rules"),
        ("Constraint & Negation Extraction", "Detects domain exclusions and difficulty modifiers", "Multi-pattern regex tokenizers and dependency parsing capturing negation scopes"),
        ("Contextual Coreference", "Resolves references ('make that harder', 'another one')", "Session history retrieval matching references against last challenge ID and recent format stacks"),
        ("Semantic Answer Evaluation", "Determines conceptual correctness of natural language responses", "Token set ratio matching, fuzzy string distance, and conceptual equivalence validation"),
        ("Pedagogical Mistake Diagnosis", "Explains 'Why was my answer wrong?'", "Analyzes user choice, target answer, and constraint rules to synthesize personalized explanations"),
    ]
    for row in t31_data:
        cells = t31.add_row().cells
        for i in range(3):
            cells[i].text = row[i]
            cells[i].width = t31_widths[i]
            cells[i].paragraphs[0].runs[0].font.size = Pt(10)
            set_cell_margins(cells[i], 60, 60, 80, 80)

    add_section_title("3.4 Responsible-AI & Non-Clinical Principles")
    add_body(
        "Cognivista functions as an educational brain gym for personal mental agility. The application explicitly avoids medical diagnostic terminology, labels all metrics as personal cognitive indicators, and retrieves live information solely from authenticated public sources (Open-Meteo, World Time API), cleanly reporting 'Live source unavailable' rather than hallucinating when disconnected."
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 4: AI & NLP PIPELINE ARCHITECTURE
    # ==========================================
    add_chapter_title(4, "AI & NLP PIPELINE ARCHITECTURE")
    add_section_title("4.1 Pipeline Overview")
    add_body("Every user request follows a deterministic seven-stage pipeline as detailed in Table 4.1.")

    p_t41 = doc.add_paragraph()
    r_t41 = p_t41.add_run("Table 4.1 Seven-Stage AI Pipeline")
    r_t41.bold = True
    r_t41.font.size = Pt(10.5)

    t41 = doc.add_table(rows=1, cols=4)
    t41.alignment = WD_TABLE_ALIGNMENT.CENTER
    t41_widths = [Inches(1.2), Inches(1.8), Inches(2.2), Inches(1.3)]
    for i, h in enumerate(["Stage", "Input", "Processing", "Output"]):
        t41.rows[0].cells[i].text = h
        t41.rows[0].cells[i].paragraphs[0].runs[0].font.bold = True
        set_cell_background(t41.rows[0].cells[i], "D9E1F2")
        t41.rows[0].cells[i].width = t41_widths[i]

    t41_data = [
        ("1. Ingestion", "Raw natural text or answer payload", "Sanitization, length verification, and rate limiting", "Validated input string"),
        ("2. Authentication", "JWT Bearer header", "HMAC-SHA256 signature and expiration check", "Session user entity"),
        ("3. NLP Parsing", "User query text", "Intent categorization, entity and negation extraction", "Parsed intent object"),
        ("4. Context Recall", "User ID", "Database query for last 5 attempts, streak, domain Elo ratings", "Session context vector"),
        ("5. Synthesis", "Intent parameters & target Elo", "Procedural, LLM, or live stream challenge generator", "Validated challenge payload"),
        ("6. Evaluation", "User answer + response time", "Exact/semantic scoring, mistake diagnosis, Elo update", "Attempt result object"),
        ("7. Persistence", "Updated ratings & attempt data", "Async database commit across attempts and profile", "Updated state & response"),
    ]
    for row in t41_data:
        cells = t41.add_row().cells
        for i in range(4):
            cells[i].text = row[i]
            cells[i].width = t41_widths[i]
            cells[i].paragraphs[0].runs[0].font.size = Pt(10)
            set_cell_margins(cells[i], 60, 60, 80, 80)

    add_section_title("4.2 System Architecture")
    add_body(
        "Cognivista employs a four-tier architecture: (1) Client Presentation Layer built in React 19 delivering responsive interaction arenas; (2) FastAPI Application Layer exposing REST endpoints and WebSockets; (3) Business Logic Layer housing the Agent Orchestrator, NLP engines, and SVG generator; and (4) Database Persistence Layer utilizing SQLAlchemy Async with SQLite and PostgreSQL fallback."
    )

    add_section_title("4.3 Intent Routing and Example Requests")
    add_body("Table 4.2 illustrates how varied natural-language requests are processed into autonomous agent actions.")

    p_t42 = doc.add_paragraph()
    r_t42 = p_t42.add_run("Table 4.2 Intent Routing and Autonomous Agent Actions")
    r_t42.bold = True
    r_t42.font.size = Pt(10.5)

    t42 = doc.add_table(rows=1, cols=3)
    t42.alignment = WD_TABLE_ALIGNMENT.CENTER
    t42_widths = [Inches(2.5), Inches(1.5), Inches(2.5)]
    for i, h in enumerate(["User Says", "Detected Intent", "Autonomous Agent Route"]):
        t42.rows[0].cells[i].text = h
        t42.rows[0].cells[i].paragraphs[0].runs[0].font.bold = True
        set_cell_background(t42.rows[0].cells[i], "D9E1F2")
        t42.rows[0].cells[i].width = t42_widths[i]

    t42_data = [
        ("“I want a difficult memory challenge but no numbers”", "challenge_request", "Excludes numerical domain; scales target Elo by +150; generates non-numerical visual matrix"),
        ("“Make the next one harder”", "difficulty_adjust", "Resolves coreference to previous challenge domain; increases difficulty by +100 Elo"),
        ("“Give me something completely different from the last five”", "request_variety", "Inspects recent domain history vector; selects an unrepresented cognitive skill and format"),
        ("“Why was my answer wrong?”", "explain_mistake", "Fetches last completed attempt; extracts mistake diagnosis; synthesizes pedagogical explanation"),
        ("“Continue my training”", "continue_training", "Invokes AdaptiveEngine; selects domain with lowest rating or highest neuroplastic growth potential"),
        ("“Give me a challenge using current data”", "live_challenge_request", "Invokes live_data_service; fetches live weather/flight data; builds verified reasoning puzzle"),
    ]
    for row in t42_data:
        cells = t42.add_row().cells
        for i in range(3):
            cells[i].text = row[i]
            cells[i].width = t42_widths[i]
            cells[i].paragraphs[0].runs[0].font.size = Pt(10)
            set_cell_margins(cells[i], 60, 60, 80, 80)

    doc.add_page_break()

    # ==========================================
    # CHAPTER 5: MATHEMATICAL FORMULATIONS
    # ==========================================
    add_chapter_title(5, "MATHEMATICAL FORMULATIONS & ALGORITHMS")
    add_section_title("5.1 Cognitive Elo Rating System & Dynamic K-Factor")
    add_body(
        "Cognivista models human cognitive skill using an adapted Elo rating framework. The expected probability of a user solving a challenge is defined as:"
    )
    add_body("E_expected = 1 / (1 + 10^((R_challenge - R_user) / 400))")
    add_body(
        "Following an attempt with outcome S in {0.0, 1.0}, the user's updated rating R_user' is computed as:"
    )
    add_body("R_user' = R_user + K * (S - E_expected) * Phi(velocity) * Psi(hints)")
    add_body(
        "Where K = 40 for users with fewer than 10 completed challenges (Calibration Phase), and K = 24 for established users (Stabilization Phase)."
    )

    add_section_title("5.2 Response Time Velocity & Hint Formulations")
    add_body(
        "To reward rapid analytical problem solving, the velocity multiplier Phi is formulated as:"
    )
    add_bullet("Rapid Mastery Bonus: ", "Phi = 1.20 if user_time <= 0.50 * estimated_time")
    add_bullet("Standard Velocity: ", "Phi = 1.00 if 0.50 * estimated_time < user_time <= 1.20 * estimated_time")
    add_bullet("Processing Delay: ", "Phi = 0.80 if user_time > 1.20 * estimated_time")
    add_body("The hint penalty coefficient Psi scales positive Elo gains based on hints requested: Psi(h) = max(0.40, 1.0 - 0.25 * h).")

    add_section_title("5.3 Repetition Diversity Metric")
    add_body(
        "To ensure novelty when the user requests variety, the system evaluates candidate challenges against the recent history window H_5:"
    )
    add_body("Diversity(c, H_5) = 1.0 - sum(w_i * [0.40 * I(dom_c = dom_i) + 0.35 * I(fmt_c = fmt_i) + 0.25 * I(mech_c = mech_i)])")
    add_body("Where weights w = [0.35, 0.25, 0.20, 0.12, 0.08]. A candidate challenge is rejected and regenerated if Diversity < 0.60.")

    add_section_title("5.4 Multi-Format Answer Evaluation Formulations")
    add_body("Responses are evaluated based on interaction format:")
    add_bullet("Pair Matching: ", "S_match = |P_user intersect P_target| / |P_target|; Correct iff S_match = 1.0.")
    add_bullet("Step Ordering: ", "S_order = sum(I(user_step[i] = target_step[i])) / total_steps.")
    add_bullet("Multi-Select Checkboxes: ", "S_multi = |U intersect T| / |U union T| (Jaccard Index); Correct iff S_multi = 1.0.")
    add_bullet("Semantic Free-Text: ", "Evaluated via fuzzy Levenshtein ratio L(r_user, r_target); Correct iff L >= 0.85.")

    add_section_title("5.5 Diagnostic Mistake Mechanism Formulation")
    add_body(
        "When an attempt is incorrect, the diagnostic engine classifies the error into a cognitive mechanism: (1) calculation_error if numeric deviation is <= 30%; (2) impulsive_response if response time is < 25% of estimated time; (3) constraint_oversight if submitted answer violates stated boundary conditions; and (4) logical_fallacy otherwise."
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 6: TECH STACK & PACKAGES
    # ==========================================
    add_chapter_title(6, "TECH STACK & PACKAGES")
    add_section_title("6.1 Front-End & Back-End Stack")
    add_body(
        "Cognivista leverages modern web technologies: React 19, TypeScript 5.9, Vite 8.3, and Tailwind CSS on the client; Python 3.12, FastAPI, and SQLAlchemy Async on the server. Rich SVG vector graphics provide dynamic visual diagrams without heavy graphical libraries."
    )

    p_t61 = doc.add_paragraph()
    r_t61 = p_t61.add_run("Table 6.1 Full Stack Packages and Installed Versions")
    r_t61.bold = True
    r_t61.font.size = Pt(10.5)

    t61 = doc.add_table(rows=1, cols=3)
    t61.alignment = WD_TABLE_ALIGNMENT.CENTER
    t61_widths = [Inches(2.0), Inches(1.5), Inches(3.0)]
    for i, h in enumerate(["Package Name", "Version", "Architectural Role"]):
        t61.rows[0].cells[i].text = h
        t61.rows[0].cells[i].paragraphs[0].runs[0].font.bold = True
        set_cell_background(t61.rows[0].cells[i], "D9E1F2")
        t61.rows[0].cells[i].width = t61_widths[i]

    t61_data = [
        ("fastapi", "0.115.0", "Asynchronous RESTful API framework"),
        ("uvicorn", "0.30.6", "ASGI production web server"),
        ("sqlalchemy", "2.0.35", "Asynchronous Object-Relational Mapping"),
        ("aiosqlite", "0.20.0", "Asynchronous SQLite engine"),
        ("pydantic", "2.9.2", "Data validation and schema parsing"),
        ("python-jose", "3.3.0", "Cryptographic JWT session token handling"),
        ("passlib[bcrypt]", "1.7.4", "Bcrypt password hashing and verification"),
        ("httpx", "0.27.2", "Asynchronous HTTP client for live feeds"),
        ("react / react-dom", "19.0.0", "Component-based user interface"),
        ("vite", "8.3.1", "Frontend build tool and dev server"),
        ("typescript", "5.9.3", "Static type verification"),
        ("tailwindcss", "3.4.17", "Utility-first design styling framework"),
        ("lucide-react", "0.468.0", "Clean vector iconography package"),
    ]
    for row in t61_data:
        cells = t61.add_row().cells
        for i in range(3):
            cells[i].text = row[i]
            cells[i].width = t61_widths[i]
            cells[i].paragraphs[0].runs[0].font.size = Pt(10)
            set_cell_margins(cells[i], 60, 60, 80, 80)

    add_section_title("6.2 Environment Variables")
    add_body("Table 6.2 lists the key runtime configuration variables used by the backend:")
    add_bullet("DATABASE_URL: ", "Database connection URI (default: sqlite+aiosqlite:///./cognivista.db)")
    add_bullet("SECRET_KEY: ", "HMAC-SHA256 signature secret for user session tokens")
    add_bullet("ALGORITHM: ", "Token encryption algorithm (HS256)")
    add_bullet("ACCESS_TOKEN_EXPIRE_MINUTES: ", "Session validity duration (1440 minutes / 24 hours)")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 7: DATABASE STRUCTURES
    # ==========================================
    add_chapter_title(7, "DATABASE & KNOWLEDGE BASE STRUCTURES")
    add_section_title("7.1 Storage Approach")
    add_body(
        "Cognivista employs an asynchronous relational database architecture using SQLAlchemy 2.0. Entities utilize UUID primary keys, and foreign keys utilize cascading deletion to preserve strict per-user data isolation."
    )

    p_t71 = doc.add_paragraph()
    r_t71 = p_t71.add_run("Table 7.1 Database Tables and Schema Specifications")
    r_t71.bold = True
    r_t71.font.size = Pt(10.5)

    t71 = doc.add_table(rows=1, cols=4)
    t71.alignment = WD_TABLE_ALIGNMENT.CENTER
    t71_widths = [Inches(1.5), Inches(1.5), Inches(1.8), Inches(1.7)]
    for i, h in enumerate(["Table", "Column", "Type", "Description"]):
        t71.rows[0].cells[i].text = h
        t71.rows[0].cells[i].paragraphs[0].runs[0].font.bold = True
        set_cell_background(t71.rows[0].cells[i], "D9E1F2")
        t71.rows[0].cells[i].width = t71_widths[i]

    t71_data = [
        ("users", "id", "VARCHAR(36), PK", "Unique UUID user identifier"),
        ("users", "username", "VARCHAR(50), UK", "User sign-in handle"),
        ("users", "email", "VARCHAR(100), UK", "User email address"),
        ("users", "hashed_password", "VARCHAR(255)", "Bcrypt salted password hash"),
        ("cognitive_profiles", "user_id", "VARCHAR(36), FK", "1-to-1 relationship with users"),
        ("cognitive_profiles", "composite_elo", "FLOAT, DEFAULT 1200", "Global cognitive Elo rating"),
        ("cognitive_profiles", "domain_ratings", "JSON", "Key-value store of domain Elo ratings"),
        ("challenges", "id", "VARCHAR(36), PK", "Unique challenge identifier"),
        ("challenges", "challenge_type", "VARCHAR(50)", "Interaction format"),
        ("challenges", "primary_domain", "VARCHAR(50)", "Target cognitive faculty"),
        ("challenges", "payload", "JSON", "Options, parameters & SVG visual data"),
        ("attempts", "id", "VARCHAR(36), PK", "Unique attempt record"),
        ("attempts", "user_response", "JSON", "Actual submitted response"),
        ("attempts", "is_correct", "BOOLEAN", "Outcome flag (True if solved)"),
        ("attempts", "mistake_analysis", "JSON", "Cognitive mechanism & remediation"),
    ]
    for row in t71_data:
        cells = t71.add_row().cells
        for i in range(4):
            cells[i].text = row[i]
            cells[i].width = t71_widths[i]
            cells[i].paragraphs[0].runs[0].font.size = Pt(9.5)
            set_cell_margins(cells[i], 50, 50, 70, 70)

    doc.add_page_break()

    # ==========================================
    # CHAPTER 8: MODULES & IMPLEMENTATION
    # ==========================================
    add_chapter_title(8, "MODULES & IMPLEMENTATION WALKTHROUGH")
    add_section_title("8.1 The Six Functionally Distinct Application Pages")
    add_body(
        "Cognivista differentiates pages by FUNCTION, not merely visual layout. The six core pages operate as follows:"
    )
    add_bullet("Page 1 — MY PROGRESS (progress): ", "Analyzes historical performance. Displays composite Brain Score, level classification, success rate, Subject Mastery Report across seven cognitive areas, and an interactive Workout Activity Log linking directly to attempt reviews.")
    add_bullet("Page 2 — CREATE CHALLENGE (create): ", "User-controlled challenge creation. The user expresses their goal in freeform natural language. The agent executes a 4-step reasoning stepper to formulate skills, format, and complexity, generating a live preview with instant Arena launch.")
    add_bullet("Page 3 — CHALLENGE (challenge): ", "The active solving environment. Dynamically mounts the appropriate arena (Matching, Ordering, Multi-Select, True/False, Anagrams, Odd-One-Out, Detective Logic, Speed Stroop) accompanied by interactive SVG visual diagrams from VisualChallengeBoard.")
    add_bullet("Page 4 — CHALLENGE REVIEW (review): ", "Analyzes completed attempts. Provides side-by-side comparison of user response versus correct answer, mistake mechanism diagnosis, and a conversational 'Ask Agent: Why was my answer wrong?' interface.")
    add_bullet("Page 5 — TRAINING SESSION (session): ", "Autonomous adaptive training. The user launches a multi-step session. The agent dynamically decides subsequent challenges based on real-time accuracy and velocity, presenting a live AI AGENT AUTONOMOUS DECISION STREAM log.")
    add_bullet("Page 6 — LIVE CHALLENGES (live): ", "Real-world reasoning. Pulls live data from Open-Meteo and World Time API, constructing practical challenges with verified source URLs, UTC timestamps, and active stream connectivity indicators.")

    add_section_title("8.2 Wayground Visual Curriculum & SVG Engine")
    add_body(
        "To eliminate plain-text monotony, the VisualChallengeBoard component renders interactive SVG vector schematics: (1) Geometry Triangles with labeled angles and vertex nodes; (2) Electrical Circuits with series/parallel switches and glowing bulb filaments; (3) Interlocking Gear Trains with rotation arrows; (4) Algebraic Balance Scales with pan weights; (5) Fraction Pie Models with shaded sectors; and (6) World Flight Maps with animated flight arcs and local time dials."
    )

    add_section_title("8.3 REST API Endpoints Specification")
    add_body("Table 8.2 outlines the primary REST API endpoints implemented in FastAPI:")

    p_t82 = doc.add_paragraph()
    r_t82 = p_t82.add_run("Table 8.2 REST API Specification")
    r_t82.bold = True
    r_t82.font.size = Pt(10.5)

    t82 = doc.add_table(rows=1, cols=3)
    t82.alignment = WD_TABLE_ALIGNMENT.CENTER
    t82_widths = [Inches(1.5), Inches(2.7), Inches(2.3)]
    for i, h in enumerate(["Method & Path", "Request Body / Params", "Functional Purpose"]):
        t82.rows[0].cells[i].text = h
        t82.rows[0].cells[i].paragraphs[0].runs[0].font.bold = True
        set_cell_background(t82.rows[0].cells[i], "D9E1F2")
        t82.rows[0].cells[i].width = t82_widths[i]

    t82_data = [
        ("POST /api/auth/register", "username, email, password", "Registers new user with bcrypt encryption"),
        ("POST /api/auth/login", "username, password", "Authenticates credentials, returns signed JWT"),
        ("POST /api/agent/interact", "prompt, active_challenge_id", "Main NLP intent parsing & agent action route"),
        ("GET /api/challenges/adaptive/next", "Bearer JWT", "Autonomous agent recommends next optimal challenge"),
        ("POST /api/challenges/submit", "challenge_id, user_response, time_ms", "Evaluates response, updates Elo, logs attempt"),
        ("GET /api/challenges/live", "Bearer JWT", "Synthesizes challenge using live weather/flight data"),
        ("GET /api/challenges/attempt/{id}", "attempt_id", "Retrieves full attempt details for Challenge Review"),
        ("POST /api/challenges/attempt/{id}/explain", "user_query", "Conversational mistake diagnosis for specific attempt"),
        ("GET /api/profile", "Bearer JWT", "Retrieves profile metrics, streaks, domain ratings"),
        ("GET /api/profile/history", "Bearer JWT", "Retrieves chronological attempt history"),
    ]
    for row in t82_data:
        cells = t82.add_row().cells
        for i in range(3):
            cells[i].text = row[i]
            cells[i].width = t82_widths[i]
            cells[i].paragraphs[0].runs[0].font.size = Pt(9.5)
            set_cell_margins(cells[i], 50, 50, 70, 70)

    doc.add_page_break()

    # ==========================================
    # CHAPTER 9: OUTPUT SCREENSHOTS
    # ==========================================
    add_chapter_title(9, "OUTPUT SCREENSHOTS")
    add_section_title("9.1 Registration and Authentication Flow")
    add_body(
        "Users register with a unique username, email, and secure password. Successful registration redirects the user to the Sign In screen. Upon authentication, an HMAC-signed token is issued, loading the user's personalized cognitive workspace."
    )

    add_section_title("9.2 Page 1 — My Progress (Historical Performance Analytics)")
    add_body(
        "Displays the user's Brain Score (1259 Elo), Level 6 Mental Athlete rank, four core vitality cards (Brain Score, Current Streak, Success Rate, Brain Status), Teacher Diagnostic Summary, Subject Mastery Report across seven cognitive areas, and an interactive Workout Activity Log."
    )

    add_section_title("9.3 Page 2 — Create Challenge (Natural Language Creator)")
    add_body(
        "Accepts freeform natural-language prompts (e.g., 'I want a difficult memory and logic challenge, but not multiple choice'). The 4-step reasoning stepper executes sequentially, displaying the synthesized challenge card with an instant 'Solve in Arena' action."
    )

    add_section_title("9.4 Page 3 — Challenge Arena (Dynamic Solving Environment)")
    add_body(
        "Presents active challenges dynamically mounted into specialized arenas (Matching, Ordering, Multi-Select, True/False, Anagrams, Odd-One-Out) accompanied by dynamic SVG diagrams, reaction stopwatch, progressive hint revealer, and real-time score deltas."
    )

    add_section_title("9.5 Page 4 — Challenge Review (Mistake Diagnosis & Explainer)")
    add_body(
        "Provides comprehensive attempt analysis. Selecting any completed attempt reveals the original prompt, user's submitted response, target correct answer, identified reasoning mechanism, and a conversational 'Ask Agent: Why was my answer wrong?' module."
    )

    add_section_title("9.6 Page 5 — Training Session (Autonomous Adaptive Loop)")
    add_body(
        "Depicts an active adaptive workout session. Features the live AI AGENT AUTONOMOUS DECISION STREAM log detailing real-time cognitive adjustments (e.g., 'Accuracy: 100%. Raising difficulty to 1245 Elo. Switching domain to Mechanical Gear Rotation to challenge spatial memory')."
    )

    add_section_title("9.7 Page 6 — Live Challenges (Verified Real-World Feeds)")
    add_body(
        "Renders live external data feeds (Open-Meteo Global Weather, World Time Flight Intelligence, Consumer Market Pricing) with verified source URLs, UTC timestamps, and active stream connectivity indicators."
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 10: CONCLUSION & FUTURE ENHANCEMENTS
    # ==========================================
    add_chapter_title(10, "CONCLUSION & FUTURE ENHANCEMENTS")
    add_section_title("10.1 Conclusion")
    add_body(
        "Cognivista proves that an autonomous AI agent can successfully govern an interactive cognitive training platform without devolving into a static quiz bank or external chatbot widget. By fusing Natural Language Processing, dynamic procedural synthesis, Wayground-style interactive SVG vector diagrams, semantic evaluation, and adaptive Elo algorithms, the system delivers personalized, non-repetitive brain conditioning across seven vital faculties."
    )

    add_section_title("10.2 Architectural Strengths")
    add_bullet("Central Agent Control: ", "The AI agent directly controls challenge generation, difficulty calibration, and format selection.")
    add_bullet("Visual SVG Schematics: ", "Replaces plain-text paragraphs with interactive geometric, circuit, gear, scale, and flight diagrams.")
    add_bullet("Repetition Avoidance: ", "Diversity vectors mathematically prevent puzzle fatigue across consecutive attempts.")
    add_bullet("Semantic Mistake Diagnosis: ", "Explains why an answer was wrong rather than merely presenting an answer key.")
    add_bullet("Strict Educational Boundary: ", "Provides safe, transparent cognitive exercise without clinical overreach.")

    add_section_title("10.3 Observed Limitations")
    add_bullet("External API Latency: ", "Live challenges depend on public API response times; network disconnects trigger offline fallback.")
    add_bullet("Monolingual Scope: ", "Current NLP understanding and challenge generation operate in English.")
    add_bullet("Animation Render Overhead: ", "Complex multi-gear SVG animations can introduce minor CPU load on low-power mobile devices.")

    add_section_title("10.4 Future Enhancements")
    add_bullet("Multilingual NLP Support: ", "Expand intent parsing and challenge generation to regional languages including Tamil, Hindi, and Spanish.")
    add_bullet("Voice-Driven Interaction: ", "Implement speech recognition for hands-free challenge solving and auditory memory training.")
    add_bullet("Synchronous Multiplayer Duels: ", "Introduce real-time peer-to-peer cognitive challenges using WebSockets.")
    add_bullet("Mobile Native Packaging: ", "Package the application using Capacitor / React Native for deployment on Android and iOS.")

    # Save Document
    output_path = r"d:\AntigravityProjects\cognivista\COGNIVISTA_PROJECT_REPORT.docx"
    doc.save(output_path)
    print(f"Successfully generated report at: {output_path}")

if __name__ == "__main__":
    create_report()
