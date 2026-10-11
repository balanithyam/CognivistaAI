import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Ensure diagrams directory exists
img_dir = os.path.abspath("report_images")
os.makedirs(img_dir, exist_ok=True)

# Set global font to sans-serif / Arial / DejaVu Sans for crisp vector diagrams
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10

def generate_pipeline_diagram():
    fig, ax = plt.subplots(figsize=(10, 11), dpi=200)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 12)
    ax.axis('off')

    stages = [
        ("Stage 1: User Request & Intent Ingestion", 
         "Natural prompt / UI genre selection / Adaptive session trigger\nValidates session state, retrieves user profile & domain ratings",
         "#EBF5FB", "#2980B9"),
        ("Stage 2: NLP Intent & Slot Parsing", 
         "Compiled regex token extractors & few-shot LLM slot resolver\nExtracts: target domain, difficulty Elo, format, and visual flags",
         "#E8F8F5", "#16A085"),
        ("Stage 3: Dynamic Challenge Universe Synthesis", 
         "Gemini 2.5 Flash / Wayground Procedural Curriculum Engine\nSynthesizes unique problem statement, verification key & distractors",
         "#FEF9E7", "#D4AC0D"),
        ("Stage 4: Procedural Vector Schematic Generation", 
         "Computes dynamic vector coordinates for geometry, circuits & gears\nRenders mathematically consistent SVG parameters (angles, switches, teeth)",
         "#F5EEF8", "#8E44AD"),
        ("Stage 5: Interactive Arena Execution & Telemetry", 
         "User interacts with dedicated arena paradigm (drag-drop, switches, ordering)\nBackground high-resolution timer tracks latency and hint requests",
         "#EAF2F8", "#3498DB"),
        ("Stage 6: Response Evaluation & Error Diagnosis", 
         "Fuzzy string matching & pedagogical error taxonomy classification\nDiagnoses mistake mechanism (calculation slip, misread premise, etc.)",
         "#FADBD8", "#C0392B"),
        ("Stage 7: Psychometric Rating & Adaptive Progression", 
         "Computes updated Elo score via dynamic K-factor & attention ratio\nLogs agent decision to stream & determines next pedagogical step",
         "#EAFAF1", "#27AE60")
    ]

    y_pos = 10.8
    box_height = 1.05
    box_width = 8.2
    x_pos = 0.9

    for i, (title, desc, fill_col, border_col) in enumerate(stages):
        # Draw rounded card
        rect = patches.FancyBboxPatch(
            (x_pos, y_pos - box_height), box_width, box_height,
            boxstyle="round,pad=0.1,rounding_size=0.15",
            facecolor=fill_col, edgecolor=border_col, linewidth=1.8
        )
        ax.add_patch(rect)

        # Title
        ax.text(x_pos + 0.3, y_pos - 0.32, title,
                fontsize=11, fontweight='bold', color=border_col, va='center')
        
        # Description
        ax.text(x_pos + 0.3, y_pos - 0.72, desc,
                fontsize=9.2, color='#2C3E50', va='center', linespacing=1.25)

        # Draw down arrow if not last
        if i < len(stages) - 1:
            arrow = patches.FancyArrowPatch(
                (5.0, y_pos - box_height - 0.04), (5.0, y_pos - box_height - 0.42),
                arrowstyle='->,head_width=0.35,head_length=0.35',
                color='#7F8C8D', linewidth=2.0
            )
            ax.add_patch(arrow)

        y_pos -= (box_height + 0.48)

    plt.tight_layout()
    out_path = os.path.join(img_dir, "fig4_1_pipeline.png")
    plt.savefig(out_path, bbox_inches='tight', dpi=200)
    plt.close()
    print("Saved:", out_path)

def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 8.5), dpi=200)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 9)
    ax.axis('off')

    layers = [
        ("1. PRESENTATION LAYER (Client / Browser)",
         "React 19  |  TypeScript 5  |  Vite  |  Tailwind CSS 4\n"
         "- Cognitive Progress Dashboard & Radar Charts\n"
         "- Dynamic Challenge Arena (7 Interaction Paradigms)\n"
         "- Procedural Vector SVG Component Engine (Angles, Circuits, Gears)\n"
         "- Post-Attempt Review & Socratic Conversational Desk\n"
         "- Real-Time Autonomous Agent Decision Stream",
         "#EBF5FB", "#2471A3"),
        
        ("2. API & ROUTING LAYER (FastAPI Web Service)",
         "FastAPI  |  Uvicorn ASGI  |  Pydantic v2  |  JWT Bearer Auth\n"
         "- /api/auth: Login, registration & credential hashing\n"
         "- /api/challenges: Dynamic synthesis & Wayground curriculum\n"
         "- /api/agent: Session state machine & Socratic dialogue engine\n"
         "- /api/profile: Historical telemetry & Elo skill ratings",
         "#F5EEF8", "#7D3C98"),
        
        ("3. AGENT & REASONING CORE (Python 3.11 Microservices)",
         "LangChain  |  Google GenAI (Gemini 2.5 Flash)  |  Rule Engine\n"
         "- IntentParser: Regex slot extractor & keyword classifiers\n"
         "- GenreGenerator: 12 distinct cognitive universe domains\n"
         "- WaygroundFetcher: Deterministic SVG visual parameter synthesis\n"
         "- ResponseEvaluator: Fuzzy matching & cognitive error taxonomy\n"
         "- AdaptiveSessionManager: Dynamic Elo & cognitive fatigue regulator",
         "#E8F8F5", "#117864"),
        
        ("4. PERSISTENCE & DATA LAYER (Relational Database & Live Feeds)",
         "SQLAlchemy ORM  |  SQLite (Local) / PostgreSQL (Production)\n"
         "- Users  |  Challenges  |  Attempts  |  CognitiveProfiles  |  AgentMemories\n"
         "- External Feeds: Open-Meteo Weather API & WorldTime Clock API",
         "#FEF9E7", "#B7950B")
    ]

    y_pos = 8.2
    box_height = 1.45
    box_width = 8.6
    x_pos = 0.7

    for i, (title, desc, fill_col, border_col) in enumerate(layers):
        rect = patches.FancyBboxPatch(
            (x_pos, y_pos - box_height), box_width, box_height,
            boxstyle="round,pad=0.1,rounding_size=0.18",
            facecolor=fill_col, edgecolor=border_col, linewidth=2.0
        )
        ax.add_patch(rect)

        ax.text(x_pos + 0.35, y_pos - 0.28, title,
                fontsize=11.5, fontweight='bold', color=border_col, va='center')
        
        ax.text(x_pos + 0.35, y_pos - 0.85, desc,
                fontsize=9.2, color='#2C3E50', va='center', linespacing=1.25)

        if i < len(layers) - 1:
            arrow = patches.FancyArrowPatch(
                (5.0, y_pos - box_height - 0.03), (5.0, y_pos - box_height - 0.35),
                arrowstyle='<->,head_width=0.32,head_length=0.32',
                color='#566573', linewidth=2.0
            )
            ax.add_patch(arrow)

        y_pos -= (box_height + 0.42)

    plt.tight_layout()
    out_path = os.path.join(img_dir, "fig4_2_architecture.png")
    plt.savefig(out_path, bbox_inches='tight', dpi=200)
    plt.close()
    print("Saved:", out_path)

def generate_class_diagram():
    fig, ax = plt.subplots(figsize=(10, 8), dpi=200)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')

    entities = [
        ("User (users)", [
            "+ id: String(36) [PK]",
            "+ email: String(255) [UQ]",
            "+ username: String(100) [UQ]",
            "+ hashed_password: String",
            "+ is_active: Boolean",
            "+ settings: JSON"
        ], 0.6, 5.0, 2.6, 2.3, "#EBF5FB", "#2980B9"),
        
        ("CognitiveProfile (profiles)", [
            "+ id: String(36) [PK]",
            "+ user_id: String(36) [FK, UQ]",
            "+ composite_elo: Float",
            "+ domain_ratings: JSON",
            "+ domain_stats: JSON",
            "+ cognitive_bottlenecks: JSON"
        ], 6.6, 5.0, 2.8, 2.3, "#E8F8F5", "#16A085"),
        
        ("Attempt (attempts)", [
            "+ id: String(36) [PK]",
            "+ user_id: String(36) [FK]",
            "+ challenge_id: String(36) [FK]",
            "+ user_response: JSON",
            "+ is_correct: Boolean",
            "+ response_time_ms: Integer",
            "+ mistake_analysis: JSON"
        ], 0.6, 1.2, 2.6, 2.7, "#FEF9E7", "#D4AC0D"),
        
        ("Challenge (challenges)", [
            "+ id: String(36) [PK]",
            "+ challenge_type: String(50)",
            "+ primary_domain: String(50)",
            "+ title: String(255)",
            "+ payload: JSON (SVG Data)",
            "+ correct_answer: JSON",
            "+ difficulty_rating: Float"
        ], 6.6, 1.2, 2.8, 2.7, "#F5EEF8", "#8E44AD"),
        
        ("AgentMemory (memories)", [
            "+ id: String(36) [PK]",
            "+ user_id: String(36) [FK]",
            "+ memory_type: String",
            "+ key: String, value: JSON"
        ], 3.7, 3.2, 2.4, 1.7, "#FDEDEC", "#C0392B")
    ]

    for title, fields, x, y, w, h, fill_col, border_col in entities:
        rect = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.05,rounding_size=0.1",
            facecolor=fill_col, edgecolor=border_col, linewidth=1.8
        )
        ax.add_patch(rect)
        
        # Header banner
        header_rect = patches.Rectangle(
            (x, y + h - 0.45), w, 0.45,
            facecolor=border_col, edgecolor=border_col
        )
        ax.add_patch(header_rect)
        ax.text(x + w/2, y + h - 0.22, title,
                fontsize=9.5, fontweight='bold', color='white', ha='center', va='center')
        
        # Field list
        f_y = y + h - 0.7
        for f in fields:
            ax.text(x + 0.12, f_y, f, fontsize=8.2, color='#2C3E50', va='center')
            f_y -= 0.32

    # Draw relation arrows with labels
    # User 1:1 CognitiveProfile
    ax.annotate("", xy=(6.6, 6.15), xytext=(3.2, 6.15),
                arrowprops=dict(arrowstyle="<->", color="#2C3E50", lw=1.5, ls="--"))
    ax.text(4.9, 6.3, "1 : 1", fontsize=9.5, fontweight='bold', ha='center', color="#2C3E50")

    # User 1:N Attempt
    ax.annotate("", xy=(1.9, 3.9), xytext=(1.9, 5.0),
                arrowprops=dict(arrowstyle="->", color="#2C3E50", lw=1.5))
    ax.text(2.1, 4.45, "1 : N", fontsize=9.5, fontweight='bold', ha='left', color="#2C3E50")

    # Challenge 1:N Attempt
    ax.annotate("", xy=(3.2, 2.5), xytext=(6.6, 2.5),
                arrowprops=dict(arrowstyle="<-", color="#2C3E50", lw=1.5, ls="--"))
    ax.text(4.9, 2.65, "1 : N", fontsize=9.5, fontweight='bold', ha='center', color="#2C3E50")

    # User 1:N Memory
    ax.annotate("", xy=(3.7, 4.0), xytext=(3.2, 5.3),
                arrowprops=dict(arrowstyle="->", color="#2C3E50", lw=1.5))
    ax.text(3.3, 4.7, "1 : N", fontsize=9.5, fontweight='bold', ha='right', color="#2C3E50")

    plt.tight_layout()
    out_path = os.path.join(img_dir, "fig7_1_class_diagram.png")
    plt.savefig(out_path, bbox_inches='tight', dpi=200)
    plt.close()
    print("Saved:", out_path)

def generate_state_machine_diagram():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=200)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')

    states = [
        ("IDLE_STATE", 1.0, 5.5, "#EBF5FB", "#2980B9"),
        ("ANALYZE_PROFILE", 4.0, 5.5, "#E8F8F5", "#16A085"),
        ("DISPATCH_CHALLENGE", 7.0, 5.5, "#FEF9E7", "#D4AC0D"),
        ("AWAIT_ANSWER", 7.0, 2.0, "#F5EEF8", "#8E44AD"),
        ("EVALUATE_STEP", 4.0, 2.0, "#FDEDEC", "#C0392B"),
        ("COMPLETED_SESSION", 1.0, 2.0, "#EAFAF1", "#27AE60")
    ]

    for name, x, y, fill_col, border_col in states:
        rect = patches.FancyBboxPatch(
            (x - 0.9, y - 0.45), 2.0, 0.9,
            boxstyle="round,pad=0.1,rounding_size=0.25",
            facecolor=fill_col, edgecolor=border_col, linewidth=2.0
        )
        ax.add_patch(rect)
        ax.text(x + 0.1, y, name, fontsize=8.8, fontweight='bold',
                color=border_col, ha='center', va='center')

    # Connecting transitions
    # Idle -> Analyze
    ax.annotate("Start Session", xy=(3.0, 5.5), xytext=(2.2, 5.5),
                arrowprops=dict(arrowstyle="->", color="#2C3E50", lw=1.6),
                fontsize=8.5, ha='center', va='bottom')

    # Analyze -> Dispatch
    ax.annotate("Select Domain & Elo", xy=(6.0, 5.5), xytext=(5.2, 5.5),
                arrowprops=dict(arrowstyle="->", color="#2C3E50", lw=1.6),
                fontsize=8.5, ha='center', va='bottom')

    # Dispatch -> Await
    ax.annotate("Render Challenge", xy=(7.1, 2.6), xytext=(7.1, 4.9),
                arrowprops=dict(arrowstyle="->", color="#2C3E50", lw=1.6),
                fontsize=8.5, ha='left', va='center')

    # Await -> Evaluate
    ax.annotate("Submit Answer", xy=(5.2, 2.0), xytext=(6.0, 2.0),
                arrowprops=dict(arrowstyle="->", color="#2C3E50", lw=1.6),
                fontsize=8.5, ha='center', va='bottom')

    # Evaluate -> Analyze (Loop for next step)
    ax.annotate("Step < Total\n(Adapt Elo)", xy=(4.1, 4.9), xytext=(4.1, 2.6),
                arrowprops=dict(arrowstyle="->", color="#C0392B", lw=1.8, ls="--"),
                fontsize=8.5, ha='right', va='center')

    # Evaluate -> Completed
    ax.annotate("Step == Total", xy=(2.2, 2.0), xytext=(3.0, 2.0),
                arrowprops=dict(arrowstyle="->", color="#27AE60", lw=1.8),
                fontsize=8.5, ha='center', va='bottom')

    plt.tight_layout()
    out_path = os.path.join(img_dir, "fig8_1_state_machine.png")
    plt.savefig(out_path, bbox_inches='tight', dpi=200)
    plt.close()
    print("Saved:", out_path)

if __name__ == "__main__":
    generate_pipeline_diagram()
    generate_architecture_diagram()
    generate_class_diagram()
    generate_state_machine_diagram()
