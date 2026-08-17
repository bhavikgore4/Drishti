import time
import uuid
import cv2
import numpy as np
import traceback
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ml.detector import detector
from app.services.spatial import spatial_engine
from app.services.memory import memory_service
from app.services.embedding import embedding_service

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_id = str(uuid.uuid4())[:8]
    last_memory_log = 0.0

    try:
        while True:
            data = await websocket.receive_bytes()
            if not data:
                continue

            nparr = np.frombuffer(data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                continue

            try:
                h, w, _ = img.shape
                spatial_engine.frame_width = w
                spatial_engine.frame_height = h

                results = detector.detect(img)
                detections = results.get("detections", [])

                nav_analysis = spatial_engine.analyze_scene_navigation(detections)
                cues = nav_analysis["cues"]
                nav_command = nav_analysis["navigation_command"]
                scene_summary = nav_analysis["scene_summary"]

                current_time = time.time()

                if cues:
                    await memory_service.log_detection(
                        session_id=session_id,
                        detected_objects=detections,
                        primary_alert=cues[0]["cue"],
                        urgency=cues[0]["urgency"]
                    )

                # Save memory every 2 seconds whenever objects are present
                if detections and (current_time - last_memory_log > 2.0):
                    labels = [d.get("label", "") for d in detections if d.get("label")]
                    full_desc = f"{scene_summary} {nav_command}"
                    embedding_service.save_scene_memory(
                        session_id=session_id,
                        description=full_desc,
                        detected_labels=labels
                    )
                    last_memory_log = current_time

                await websocket.send_json({
                    "session_id": session_id,
                    "detections": detections,
                    "assistive_cues": cues,
                    "navigation_command": nav_command,
                    "scene_summary": scene_summary,
                    "total_memories": len(embedding_service.memories),
                    "corridor_status": nav_analysis["corridor_status"]
                })

            except Exception:
                traceback.print_exc()

    except WebSocketDisconnect:
        pass