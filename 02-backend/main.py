from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.disaster import router as disaster_router
from app.api.routes.grievances import router as grievances_router
from app.api.routes.health import router as health_router
from app.api.routes.uploads import router as uploads_router
from app.config import settings
from app.database import close_mongo_connection, connect_to_mongo, ensure_database_ready, seed_demo_data


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    description="Drishti backend API for civic grievance and disaster operations.",
    docs_url="/docs",
    redoc_url="/redoc",
)

default_cors_origins = ["http://localhost:5173", "http://localhost:3000"]
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
cors_origins = list(dict.fromkeys(default_cors_origins + cors_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    try:
        await connect_to_mongo()
        await ensure_database_ready()
        await seed_demo_data()
    except Exception:
        pass


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_mongo_connection()


app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(grievances_router, prefix=settings.API_V1_STR)
app.include_router(disaster_router, prefix=settings.API_V1_STR)
app.include_router(uploads_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root() -> dict:
    return {"message": "Drishti API is running", "version": "0.1.0"}
