import cv2
import numpy as np

from fastapi import APIRouter, UploadFile, File, HTTPException, Query

from app.services.ml.detector import detector

router = APIRouter()


@router.post("/detect", summary="Detect objects in an uploaded image")
async def detect_objects(
    file: UploadFile = File(...),
    confidence: float = Query(
        0.45,
        ge=0.1,
        le=1.0,
        description="Confidence threshold"
    )
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image"
        )

    contents = await file.read()

    image_array = np.frombuffer(contents, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="Could not decode the uploaded image"
        )

    results = detector.detect(
        image=image,
        conf_threshold=confidence
    )

    return {
        "filename": file.filename,
        "results": results
    }
