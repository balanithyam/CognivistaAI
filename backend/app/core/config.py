import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV: str = "development"
    PROJECT_NAME: str = "COGNIVISTA"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # JWT & Auth
    SECRET_KEY: str = "cognivista_ultra_secure_jwt_secret_salt_2026_neural_agent"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Primary DB (PostgreSQL default) with SQLite seamless async fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/cognivista_db")
    SQLITE_URL: str = "sqlite+aiosqlite:///./cognivista.db"
    FORCE_SQLITE: bool = os.getenv("FORCE_SQLITE", "false").lower() == "true"
    
    # Redis with in-memory fallback
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI / LLM
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Safety notice
    SAFETY_DISCLAIMER: str = (
        "COGNIVISTA is an adaptive cognitive training and mental conditioning system. "
        "It is designed for self-improvement, analytical problem-solving, and neuro-plastic exercise. "
        "It is NOT a medical device, neurological diagnostic instrument, or clinical intelligence evaluation tool."
    )
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
