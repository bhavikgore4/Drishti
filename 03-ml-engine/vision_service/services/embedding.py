import numpy as np
from datetime import datetime
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer

SYNONYM_MAP = {
    "phone": ["cell phone", "mobile", "smartphone", "iphone", "android"],
    "bottle": ["water bottle", "flask", "thermos"],
    "cup": ["mug", "coffee", "tea", "glass"],
    "laptop": ["computer", "pc", "macbook", "screen"],
    "spectacles": ["glasses", "sunglasses"],
    "bag": ["backpack", "handbag", "purse"]
}

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        print(f"[EmbeddingService] Pre-warming SentenceTransformer ({model_name})...")
        self.model = SentenceTransformer(model_name)
        self.memories: List[Dict[str, Any]] = []
        # Warmup forward pass
        self.model.encode("system warmup test", normalize_embeddings=True)
        print("[EmbeddingService] Model loaded and ready.")

    def generate_embedding(self, text_input: str) -> np.ndarray:
        return self.model.encode(text_input, normalize_embeddings=True)

    def save_scene_memory(self, session_id: str, description: str, detected_labels: List[str] = None):
        vector = self.generate_embedding(description)
        entry = {
            "session_id": session_id,
            "description": description,
            "labels": detected_labels or [],
            "embedding": vector,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.memories.append(entry)
        if len(self.memories) > 50:
            self.memories.pop(0)
        print(f"[Memory Ingested]: {description}")

    def search_scene_memory(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        if not self.memories:
            return []

        query_lower = query.lower()
        query_vec = self.generate_embedding(query)
        scored_memories = []

        for item in self.memories:
            semantic_score = float(np.dot(query_vec, item["embedding"]))
            keyword_boost = 0.0

            for label in item.get("labels", []):
                label_clean = label.lower()
                if label_clean in query_lower:
                    keyword_boost = 0.4
                    break
                for alias_key, alias_list in SYNONYM_MAP.items():
                    if alias_key in query_lower and (label_clean in alias_list or label_clean == alias_key):
                        keyword_boost = 0.45
                        break

            final_score = min(1.0, semantic_score + keyword_boost)

            scored_memories.append({
                "session_id": item["session_id"],
                "description": item["description"],
                "similarity": round(final_score, 4),
                "timestamp": item["timestamp"]
            })

        scored_memories.sort(key=lambda x: (x["similarity"], x["timestamp"]), reverse=True)
        return scored_memories[:limit]

embedding_service = EmbeddingService()