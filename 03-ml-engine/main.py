from fastapi import FastAPI
from pydantic import BaseModel, Field

from triage import triage

app = FastAPI(title="DRISHTI ML Engine", version="0.1.0")


class TriageRequest(BaseModel):
    description: str = Field(min_length=1, max_length=10000)
    filename: str | None = Field(default=None, max_length=255)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "drishti-ml-engine", "engine": "keyword-baseline-v1"}


@app.post("/api/v1/triage")
async def classify_grievance(payload: TriageRequest) -> dict[str, object]:
    return triage(payload.description, payload.filename)
