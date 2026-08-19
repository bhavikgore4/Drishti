from __future__ import annotations

import asyncio
import json
from urllib.error import URLError
from urllib.request import Request, urlopen

from app.config import settings


class MLEngineUnavailable(RuntimeError):
    pass


def _request_triage(description: str, filename: str | None) -> dict:
    payload = json.dumps({"description": description, "filename": filename}).encode("utf-8")
    request = Request(
        f"{settings.ML_ENGINE_URL.rstrip('/')}/api/v1/triage",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=settings.ML_ENGINE_TIMEOUT_SECONDS) as response:
            return json.loads(response.read().decode("utf-8"))
    except (URLError, TimeoutError, ValueError) as exc:
        raise MLEngineUnavailable("ML triage service is unavailable") from exc


async def triage_grievance(description: str, filename: str | None = None) -> dict:
    return await asyncio.to_thread(_request_triage, description, filename)
