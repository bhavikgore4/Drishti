from typing import List, Dict, Any
from collections import Counter

class SpatialEngine:
    def __init__(self, frame_width: int = 640, frame_height: int = 480):
        self.frame_width = frame_width
        self.frame_height = frame_height

    def _parse_bbox(self, bbox: Any):
        if isinstance(bbox, dict):
            return float(bbox.get("x1", 0)), float(bbox.get("y1", 0)), float(bbox.get("x2", 0)), float(bbox.get("y2", 0))
        elif isinstance(bbox, (list, tuple)) and len(bbox) == 4:
            return float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3])
        return 0.0, 0.0, 0.0, 0.0

    def classify_corridor(self, x_center: float) -> str:
        one_third = self.frame_width / 3.0
        if x_center < one_third:
            return "left"
        elif x_center < 2 * one_third:
            return "center"
        return "right"

    def estimate_proximity(self, bbox_area: float) -> str:
        total_frame_area = max(1.0, float(self.frame_width * self.frame_height))
        occupancy_ratio = bbox_area / total_frame_area
        if occupancy_ratio > 0.18:
            return "critical"
        elif occupancy_ratio > 0.08:
            return "nearby"
        return "far"

    def analyze_scene_navigation(self, detections: List[Dict[str, Any]]) -> Dict[str, Any]:
        corridor_occupancy = {"left": [], "center": [], "right": []}
        cues = []
        immediate_danger = False

        for det in detections:
            bbox_raw = det.get("bbox", [0, 0, 0, 0])
            x1, y1, x2, y2 = self._parse_bbox(bbox_raw)
            w, h = max(0.0, x2 - x1), max(0.0, y2 - y1)
            area = w * h
            x_center = x1 + (w / 2.0)

            corridor = self.classify_corridor(x_center)
            proximity = self.estimate_proximity(area)
            label = det.get("label", "object")

            corridor_occupancy[corridor].append({"label": label, "proximity": proximity})

            urgency = "low"
            if proximity == "critical":
                urgency = "high"
                immediate_danger = True
                cue = f"Warning: {label} directly ahead in center path!" if corridor == "center" else f"Warning: {label} very close on your {corridor}!"
            elif proximity == "nearby":
                urgency = "medium"
                cue = f"{label.capitalize()} nearby on your {corridor}"
            else:
                cue = f"{label} detected on {corridor}"

            cues.append({"label": label, "corridor": corridor, "proximity": proximity, "urgency": urgency, "cue": cue})

        # Calculate navigation directives
        if corridor_occupancy["center"]:
            if immediate_danger:
                nav_cmd = "Stop. Obstacle immediately ahead."
            elif not corridor_occupancy["left"]:
                nav_cmd = "Center blocked. Step to your left."
            elif not corridor_occupancy["right"]:
                nav_cmd = "Center blocked. Step to your right."
            else:
                nav_cmd = "All paths partially obstructed. Proceed with caution."
        else:
            nav_cmd = "Path clear ahead."

        # Generate full descriptive scene summary
        scene_summary = self._generate_descriptive_summary(corridor_occupancy)

        return {
            "navigation_command": nav_cmd,
            "scene_summary": scene_summary,
            "corridor_status": {k: len(v) for k, v in corridor_occupancy.items()},
            "cues": cues
        }

    def _generate_descriptive_summary(self, corridors: Dict[str, List[Dict[str, str]]]) -> str:
        total = sum(len(items) for items in corridors.values())
        if total == 0:
            return "The immediate path is open. No obstacles detected."

        summary_parts = []
        for side in ["center", "left", "right"]:
            items = corridors[side]
            if items:
                counts = Counter([item["label"] for item in items])
                desc = ", ".join([f"{count} {label}" if count > 1 else f"a {label}" for label, count in counts.items()])
                summary_parts.append(f"{desc} on your {side}")

        return f"In front of you: {'; '.join(summary_parts)}."

    def get_spatial_cues(self, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return self.analyze_scene_navigation(detections)["cues"]

spatial_engine = SpatialEngine()