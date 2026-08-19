import numpy as np
from pathlib import Path

from ultralytics import YOLO


DEFAULT_MODEL_PATH = Path(__file__).resolve().parents[3] / "models" / "yolov8n.pt"

class ObjectDetector:
    def __init__(self, model_path: str | Path | None = None):
        resolved_model_path = Path(model_path) if model_path else DEFAULT_MODEL_PATH
        print(f"[ObjectDetector] Initializing YOLO model ({resolved_model_path})...")
        self.model = YOLO(str(resolved_model_path))

    def detect(self, image: np.ndarray, conf_threshold: float = 0.25):
        results = self.model.predict(source=image, conf=conf_threshold, verbose=False)
        detections = []

        if results and len(results) > 0:
            boxes = results[0].boxes
            for box in boxes:
                xyxy = box.xyxy[0].tolist()
                cls_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())
                label = self.model.names[cls_id]

                detections.append({
                    "label": label,
                    "confidence": round(confidence, 3),
                    "bbox": [round(coord, 1) for coord in xyxy]
                })

        return {
            "total_objects": len(detections),
            "detections": detections
        }

detector = ObjectDetector()
