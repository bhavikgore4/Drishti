from __future__ import annotations

from typing import Any, Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings
from app.db.indexes import ensure_database_indexes
from app.security import hash_password

client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    if client is None:
        raise RuntimeError("MongoDB client is not initialized")
    return client


def get_database() -> AsyncIOMotorDatabase:
    if client is None:
        raise RuntimeError("MongoDB client is not initialized")
    return client[settings.MONGODB_DB]


async def connect_to_mongo() -> AsyncIOMotorClient:
    global client
    if client is None:
        client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
    await client.admin.command("ping")
    return client


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()
        client = None


async def ping_database() -> bool:
    try:
        db = get_database()
        await db.command("ping")
        return True
    except Exception:
        return False


async def ensure_database_ready() -> AsyncIOMotorDatabase:
    await connect_to_mongo()
    db = get_database()
    await ensure_database_indexes(db)
    return db


async def seed_demo_data() -> None:
    try:
        db = get_database()
        demo_password_hash = hash_password("Password@123")
        officers = [
            {
                "username": "raj.sharma",
                "password_hash": demo_password_hash,
                "name": "Rajesh Sharma",
                "designation": "Nodal Officer",
                "department": "Disaster Management",
                "sub_division": "Nagpur Division",
                "email": "raj.sharma@drishti.gov.in",
                "phone": "+91-9123456789",
                "office_address": "Nagpur Municipal Corporation",
                "role": "officer",
            },
            {
                "username": "ananya.deshmukh",
                "password_hash": demo_password_hash,
                "name": "Ananya Deshmukh",
                "designation": "Urban Infrastructure Officer",
                "department": "Urban Services",
                "sub_division": "Civic Services",
                "email": "ananya.deshmukh@drishti.gov.in",
                "phone": "+91-9123456790",
                "office_address": "Nagpur Urban Cell",
                "role": "officer",
            },
        ]
        for officer in officers:
            await db.officers.update_one({"username": officer["username"]}, {"$set": officer}, upsert=True)

        if await db.hotspots.count_documents({}) == 0:
            hotspots = [
                {
                    "hotspot_id": "HOT-01",
                    "name": "Ambazari Lake Overflow Discharge Channel",
                    "marathi_name": "अंबाजरी तलाव ओव्हरफ्लो",
                    "zone": "Dharampeth",
                    "ward_no": "Ward 12",
                    "category": "Reservoir / Canal Discharge",
                    "base_risk": "severe",
                    "lat": 21.1298,
                    "lng": 79.0435,
                    "location": {"type": "Point", "coordinates": [79.0435, 21.1298]},
                    "elevation_meters": 308,
                    "vulnerability_factor": "Direct sluice gate overflow and low embankment wall",
                    "historical_event": "September 2023 flash flood",
                    "drainage_capacity": "65% of peak discharge",
                    "nearest_ndrf_post": "VNIT Disaster Sub-Station",
                    "emergency_helpline": "0712-2567011",
                    "nodal_contact": "Rajesh Sharma",
                    "evacuation_shelter": "VNIT Community Hall",
                    "population_impacted_estimate": 8500,
                    "live_water_level_cm": 142,
                    "cctv_stream_available": True,
                },
                {
                    "hotspot_id": "HOT-02",
                    "name": "Nag River Bank - Shankar Nagar Bridge",
                    "marathi_name": "नाग नदी काठ - शंकर नगर पूल",
                    "zone": "Dharampeth",
                    "ward_no": "Ward 14",
                    "category": "River / Waterbody Overflow",
                    "base_risk": "severe",
                    "lat": 21.1378,
                    "lng": 79.0612,
                    "location": {"type": "Point", "coordinates": [79.0612, 21.1378]},
                    "elevation_meters": 306,
                    "vulnerability_factor": "Bridge piers create backwater accumulation",
                    "historical_event": "Basement flooding in 2023 monsoon",
                    "drainage_capacity": "70% bottleneck",
                    "nearest_ndrf_post": "Civil Lines SDRF Camp",
                    "emergency_helpline": "0712-2567012",
                    "nodal_contact": "Rajesh Sharma",
                    "evacuation_shelter": "Shankar Nagar Samaj Bhavan",
                    "population_impacted_estimate": 4200,
                    "live_water_level_cm": 110,
                    "cctv_stream_available": True,
                },
            ]
            await db.hotspots.insert_many(hotspots)
    except Exception:
        pass
