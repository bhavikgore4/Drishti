from motor.motor_asyncio import AsyncIOMotorDatabase


async def ensure_database_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.users.create_index([("email", 1)], unique=True, sparse=True)
    await db.users.create_index([("mobile", 1)], unique=True, sparse=True)

    await db.officers.create_index([("username", 1)], unique=True)

    await db.grievances.create_index([("docket_number", 1)], unique=True)
    await db.grievances.create_index([("citizen_id", 1)])
    await db.grievances.create_index([("status", 1)])
    await db.grievances.create_index([("assigned_officer_id", 1)])

    await db.grievance_timeline.create_index([("grievance_id", 1)])

    await db.hotspots.create_index([("location", "2dsphere")])
