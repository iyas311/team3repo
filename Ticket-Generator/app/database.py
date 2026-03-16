import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/ticket_db")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def init_db():
    async with engine.begin() as conn:
        # Create all tables (in production use Alembic)
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    await engine.dispose()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
