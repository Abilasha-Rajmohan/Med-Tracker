from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.database import get_db

router = APIRouter()

@router.get('/')
def read_root():
    return {
        'message': 'Hello from CS6440 Team 86, batch of Fall 2024!'
    }


@router.get('/health')
def read_health():
    return {
        'status': 'healthy'
    }


@router.get("/db-health", tags=["health"])
async def db_health_check(db: AsyncSession = Depends(get_db)):
    try:
        # Attempt a simple query
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            return {"status": "Database connected"}
        else:
            raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")
