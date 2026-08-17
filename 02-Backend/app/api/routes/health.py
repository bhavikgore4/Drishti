from fastapi import APIRouter

from app.config import settings
from app.database import ping_database

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    mongo_ok = await ping_database()
    return {
        "status": "ok" if mongo_ok else "degraded",
        "service": "drishti-backend",
        "environment": settings.ENVIRONMENT,
        "database": "mongodb" if mongo_ok else "unreachable",
    }


@router.get("/status")
async def status_check() -> dict:
    return {
        "service": "drishti-backend",
        "environment": settings.ENVIRONMENT,
        "status": "running",
    }
