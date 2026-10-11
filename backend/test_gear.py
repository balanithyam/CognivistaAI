import asyncio
import os
os.environ["FORCE_SQLITE"] = "true"

from app.core.database import init_database, get_db
from app.agent.orchestrator import orchestrator

async def main():
    await init_database()
    async for db in get_db():
        res = await orchestrator.process_user_input(
            db, "usr-demo", "Generate an interlocking gear train challenge with rotating gears and direction vectors"
        )
        print("RESPONSE:", res["response"])
        print("TITLE:", res["challenge"].title)
        print("TYPE:", res["challenge"].challenge_type)
        print("PAYLOAD VISUAL:", res["challenge"].payload.get("visual_type"))
        print("OPTIONS:", res["challenge"].payload.get("options"))
        print("CORRECT:", res["challenge"].correct_answer)
        break

if __name__ == "__main__":
    asyncio.run(main())
