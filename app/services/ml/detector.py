from ultralytics import YOLO
import numpy as np

class ObjectDetector:
    def __init__(self, model_name: str = "yolov8n.pt"):
        print(f"[ObjectDetector] Initializing YOLO model ({model_name})...")
        self.model = YOLO(model_name)

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