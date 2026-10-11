import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_database, cache
from app.api.auth import router as auth_router
from app.api.agent import router as agent_router
from app.api.challenges import router as challenges_router
from app.api.profile import router as profile_router
from app.api.websocket import router as ws_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cognivista")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Cognivista Cognitive Engine...")
    await init_database()
    await cache.init()
    logger.info("Cognivista Agent online and ready.")
    yield
    logger.info("Shutting down Cognivista Agent...")

app = FastAPI(
    title="COGNIVISTA — Adaptive Cognitive Training Agent",
    description="Autonomous AI agent for adaptive brain challenges, cognitive profiling, and live analytical reasoning.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router)
app.include_router(agent_router)
app.include_router(challenges_router)
app.include_router(profile_router)
app.include_router(ws_router)

@app.get("/")
async def root():
    return {
        "agent": "COGNIVISTA",
        "version": "1.0.0",
        "status": "operational",
        "identity": "Adaptive Brain Challenge & Cognitive Training Agent Using NLP",
        "safety_disclaimer": settings.SAFETY_DISCLAIMER
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "cognivista-backend",
        "ai_engine": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
