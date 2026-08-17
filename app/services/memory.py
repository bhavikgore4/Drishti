import asyncio
from datetime import datetime
from typing import List, Dict, Any

class MemoryService:
    def __init__(self):
        self.logs: List[Dict[str, Any]] = []

    def log_detection_sync(self, session_id: str, detected_objects: list, primary_alert: str, urgency: str):
        self.logs.append({
            "session_id": session_id,
            "detected_objects": detected_objects,
            "primary_alert": primary_alert,
            "urgency_level": urgency,
            "created_at": datetime.utcnow().isoformat()
        })
        # Keep recent 200 logs
        if len(self.logs) > 200:
            self.logs.pop(0)

    async def log_detection(self, session_id: str, detected_objects: list, primary_alert: str, urgency: str):
        asyncio.create_task(
            asyncio.to_thread(self.log_detection_sync, session_id, detected_objects, primary_alert, urgency)
        )

    def find_last_seen(self, object_name: str) -> Dict[str, Any]:
        target = object_name.lower().strip()
        for entry in reversed(self.logs):
            for obj in entry.get("detected_objects", []):
                if obj.get("label", "").lower() == target:
                    return {
                        "found": True,
                        "object": target,
                        "last_seen_at": entry["created_at"],
                        "alert_context": entry["primary_alert"],
                        "confidence": obj.get("confidence"),
                        "session_id": entry["session_id"]
                    }
        return {
            "found": False,
            "object": target,
            "message": f"No recent sightings of '{target}' in memory."
        }

memory_service = MemoryService()