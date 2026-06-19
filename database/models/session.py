import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import create_engine

DATABASE_URL_ASYNC = os.getenv(
    "DATABASE_URL_ASYNC",
    "postgresql+asyncpg://metrolinea:metrolinea_secret@localhost:5432/metrolinea_db",
)

DATABASE_URL_SYNC = os.getenv(
    "DATABASE_URL_SYNC",
    "postgresql://metrolinea:metrolinea_secret@localhost:5432/metrolinea_db",
)

async_engine = create_async_engine(DATABASE_URL_ASYNC, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)

sync_engine = create_engine(DATABASE_URL_SYNC, echo=False)


async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
