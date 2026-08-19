from fastapi import APIRouter, Query
from vision_service.services.embedding import embedding_service

router = APIRouter()

@router.get("/semantic-search")
def semantic_search(
    query: str = Query(..., description="Natural language search prompt"),
    limit: int = Query(3, description="Maximum matches to return")
):
    matches = embedding_service.search_scene_memory(query=query, limit=limit)
    return {
        "query": query,
        "total_stored_memories": len(embedding_service.memories),
        "total_matches": len(matches),
        "matches": matches
    }
