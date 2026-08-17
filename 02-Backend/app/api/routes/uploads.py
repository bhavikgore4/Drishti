from __future__ import annotations

import secrets
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads"


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)) -> dict:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    original_name = Path(file.filename or "upload.bin").name
    safe_name = f"{secrets.token_hex(8)}_{original_name}"
    destination = UPLOAD_DIR / safe_name
    content = b""

    try:
        content = await file.read()
        destination.write_bytes(content)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save file") from exc
    finally:
        await file.close()

    return {
        "status": "ok",
        "filename": original_name,
        "storedFilename": safe_name,
        "filePath": str(destination),
        "url": f"/uploads/{safe_name}",
        "contentType": file.content_type,
        "sizeBytes": len(content),
    }
