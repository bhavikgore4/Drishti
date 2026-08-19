from fastapi import APIRouter, Request

from app.config import settings
from app.database import ping_database

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(request: Request) -> dict:
    mongo_ok = await ping_database()
    response = {
        "status": "ok" if mongo_ok else "degraded",
        "service": "drishti-backend",
        "environment": settings.ENVIRONMENT,
        "database": "mongodb" if mongo_ok else "unreachable",
    }
    if not mongo_ok and getattr(request.app.state, "database_error", None):
        response["databaseError"] = request.app.state.database_error
    return response


@router.get("/status")
async def status_check() -> dict:
    return {
        "service": "drishti-backend",
        "environment": settings.ENVIRONMENT,
        "status": "running",
    }
