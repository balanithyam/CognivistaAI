import logging
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger("cognivista.database")

Base = declarative_base()

# Global sessionmaker and engine references
engine = None
AsyncSessionLocal = None
active_db_type = "unknown"

async def init_database():
    global engine, AsyncSessionLocal, active_db_type
    
    # Try PostgreSQL first if not forced to SQLite
    if not settings.FORCE_SQLITE and settings.DATABASE_URL.startswith("postgresql"):
        try:
            logger.info("Attempting to connect to PostgreSQL at %s...", settings.DATABASE_URL.split("@")[-1])
            test_engine = create_async_engine(settings.DATABASE_URL, echo=False, pool_pre_ping=True)
            async with test_engine.connect() as conn:
                await conn.execute(test_engine.dialect.statement_compiler(test_engine.dialect, None).process) # quick ping
            engine = test_engine
            active_db_type = "postgresql"
            logger.info("Successfully connected to primary PostgreSQL engine.")
        except Exception as e:
            logger.warning("PostgreSQL connection failed (%s). Falling back seamlessly to SQLite async engine...", e)
            engine = None

    if engine is None:
        logger.info("Initializing SQLite async engine (%s)...", settings.SQLITE_URL)
        engine = create_async_engine(settings.SQLITE_URL, echo=False)
        active_db_type = "sqlite"

    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False
    )

    # Auto-create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Cognivista database initialized with tables under [%s] engine.", active_db_type)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    if AsyncSessionLocal is None:
        await init_database()
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Resilient Cache Layer (Redis with automatic In-Memory fallback)
class ResilientCache:
    def __init__(self):
        self._memory_store: Dict[str, Any] = {}
        self._redis_client = None
        self._use_redis = False

    async def init(self):
        try:
            import redis.asyncio as aioredis
            client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await asyncio.wait_for(client.ping(), timeout=1.0)
            self._redis_client = client
            self._use_redis = True
            logger.info("Connected to Redis cache at %s", settings.REDIS_URL)
        except Exception as e:
            logger.info("Redis not available (%s). Using high-performance in-memory cache.", e)
            self._use_redis = False

    async def get(self, key: str) -> Optional[str]:
        if self._use_redis and self._redis_client:
            try:
                return await self._redis_client.get(key)
            except Exception:
                pass
        return self._memory_store.get(key)

    async def set(self, key: str, value: Any, expire_seconds: Optional[int] = None):
        if self._use_redis and self._redis_client:
            try:
                await self._redis_client.set(key, str(value), ex=expire_seconds)
                return
            except Exception:
                pass
        self._memory_store[key] = str(value)

    async def delete(self, key: str):
        if self._use_redis and self._redis_client:
            try:
                await self._redis_client.delete(key)
                return
            except Exception:
                pass
        self._memory_store.pop(key, None)

cache = ResilientCache()
