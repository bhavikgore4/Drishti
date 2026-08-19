from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.deps import require_roles
from app.services.ml import MLEngineUnavailable, triage_grievance

router = APIRouter(prefix="/ml", tags=["ml"])


class TriageRequest(BaseModel):
    description: str = Field(min_length=1, max_length=10000)
    filename: str | None = Field(default=None, max_length=255)


@router.post("/triage")
async def triage(
    payload: TriageRequest,
    _: dict = Depends(require_roles("citizen", "officer", "admin")),
) -> dict:
    try:
        return await triage_grievance(payload.description, payload.filename)
    except MLEngineUnavailable as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML triage service is unavailable; select a grievance category manually.",
        ) from exc
