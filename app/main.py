from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.api.v1.endpoints import vision, stream, memory

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

@app.get("/healthz", tags=["System"])
async def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}

# Mount API Routers
app.include_router(vision.router, prefix=f"{settings.API_V1_STR}/vision", tags=["Vision Engine"])
app.include_router(stream.router, prefix=f"{settings.API_V1_STR}/stream", tags=["Real-time Stream"])
app.include_router(memory.router, prefix=f"{settings.API_V1_STR}/memory", tags=["Scene Memory"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)