from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from app.services.ml.detector import detector

router = APIRouter()

@router.post("/detect", summary="Detect objects in an uploaded image")
async def detect_objects(
    file: UploadFile = File(...),
    confidence: float = Query(0.45, ge=0.1, le=1.0, description="Confidence threshold")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")

    contents = await file.read()
    results = detector.predict(image_bytes=contents, confidence=confidence)
    return {
        "filename": file.filename,
        "results": results
    }