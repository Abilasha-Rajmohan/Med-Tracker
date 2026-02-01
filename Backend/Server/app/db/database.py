from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL

# Set up the SQLAlchemy engine and session
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)


# Dependency to get DB session in routes
async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
