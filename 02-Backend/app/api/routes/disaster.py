from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.database import get_database, seed_demo_data

router = APIRouter(prefix="/disaster", tags=["disaster"])


def _serialize_hotspot(document: dict[str, Any]) -> dict[str, Any]:
    coordinates = document.get("location", {}).get("coordinates", [])
    lng = document.get("lng")
    lat = document.get("lat")
    if isinstance(coordinates, list) and len(coordinates) == 2:
        lng = coordinates[0]
        lat = coordinates[1]

    return {
        "id": document.get("hotspot_id") or str(document.get("_id")),
        "_id": str(document.get("_id")),
        "hotspotId": document.get("hotspot_id"),
        "name": document.get("name"),
        "marathiName": document.get("marathi_name"),
        "zone": document.get("zone"),
        "wardNo": document.get("ward_no"),
        "category": document.get("category"),
        "baseRisk": document.get("base_risk"),
        "lat": lat,
        "lng": lng,
        "location": document.get("location", {"type": "Point", "coordinates": [lng, lat]}),
        "elevationMeters": document.get("elevation_meters"),
        "vulnerabilityFactor": document.get("vulnerability_factor"),
        "historicalEvent": document.get("historical_event"),
        "drainageCapacity": document.get("drainage_capacity"),
        "nearestNDRFPost": document.get("nearest_ndrf_post"),
        "emergencyHelpline": document.get("emergency_helpline"),
        "nodalContact": document.get("nodal_contact"),
        "evacuationShelter": document.get("evacuation_shelter"),
        "populationImpactedEstimate": document.get("population_impacted_estimate"),
        "liveWaterLevelCm": document.get("live_water_level_cm"),
        "cctvStreamAvailable": document.get("cctv_stream_available"),
    }


@router.post("/seed")
async def seed_hotspots() -> dict[str, Any]:
    await seed_demo_data()
    db = get_database()
    count = await db.hotspots.count_documents({})
    return {"status": "ok", "hotspotsSeeded": count}


@router.get("/hotspots")
async def list_hotspots() -> list[dict[str, Any]]:
    db = get_database()
    hotspots = await db.hotspots.find({}).sort("hotspot_id", 1).to_list(length=200)
    return [_serialize_hotspot(hotspot) for hotspot in hotspots]
