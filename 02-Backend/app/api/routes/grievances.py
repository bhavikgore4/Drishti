from __future__ import annotations

import secrets
from datetime import datetime
from typing import Any, Literal

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.deps import get_current_user, require_roles
from app.database import get_database

router = APIRouter(prefix="/grievances", tags=["grievances"])

VALID_STATUSES = {"submitted", "under_review", "assigned", "in_progress", "resolved", "rejected"}


class CreateGrievanceRequest(BaseModel):
    description: str = Field(min_length=1)
    category: str = Field(min_length=1)
    title: str | None = None
    ministry: str | None = None
    sub_category: str | None = None
    location: str | None = None
    priority: Literal["low", "medium", "high", "urgent"] | None = "medium"
    attachment_name: str | None = None
    attachment_size: str | None = None
    attachment_url: str | None = None


class UpdateGrievanceStatusRequest(BaseModel):
    status: Literal["submitted", "under_review", "assigned", "in_progress", "resolved", "rejected"]
    note: str | None = None


def _to_object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


def _serialize_grievance(document: dict[str, Any]) -> dict[str, Any]:
    grievance_id = str(document["_id"])
    return {
        "id": grievance_id,
        "_id": grievance_id,
        "docketNumber": document.get("docket_number"),
        "registrationNumber": document.get("docket_number"),
        "citizenId": document.get("citizen_id"),
        "description": document.get("description"),
        "grievanceDescription": document.get("description"),
        "title": document.get("title"),
        "status": document.get("status"),
        "ministry": document.get("ministry"),
        "category": document.get("category"),
        "subCategory": document.get("sub_category"),
        "location": document.get("location"),
        "priority": document.get("priority"),
        "aiTriaged": document.get("ai_triaged", False),
        "assignedOfficerId": document.get("assigned_officer_id"),
        "attachmentName": document.get("attachment_name"),
        "attachmentSize": document.get("attachment_size"),
        "attachmentUrl": document.get("attachment_url"),
        "createdAt": document.get("created_at"),
        "updatedAt": document.get("updated_at"),
    }


def _serialize_timeline_event(document: dict[str, Any]) -> dict[str, Any]:
    event_id = str(document["_id"])
    return {
        "id": event_id,
        "_id": event_id,
        "grievanceId": document.get("grievance_id"),
        "eventType": document.get("event_type"),
        "description": document.get("description"),
        "actorType": document.get("actor_type"),
        "actorId": document.get("actor_id"),
        "createdAt": document.get("created_at"),
        "metadata": document.get("metadata", {}),
    }


async def _get_grievance_or_404(db, grievance_id: str) -> dict[str, Any]:
    object_id = _to_object_id(grievance_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grievance not found")

    grievance = await db.grievances.find_one({"_id": object_id})
    if grievance is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grievance not found")
    return grievance


async def _build_docket_number(db) -> str:
    year = datetime.utcnow().year
    while True:
        suffix = secrets.randbelow(900000) + 100000
        docket_number = f"DRISHTI/{year}/{suffix}"
        exists = await db.grievances.find_one({"docket_number": docket_number}, {"_id": 1})
        if exists is None:
            return docket_number


async def _insert_timeline_event(
    db,
    grievance_id: str,
    event_type: str,
    description: str,
    actor_type: str,
    actor_id: str | None,
    metadata: dict[str, Any] | None = None,
) -> None:
    await db.grievance_timeline.insert_one(
        {
            "grievance_id": grievance_id,
            "event_type": event_type,
            "description": description,
            "actor_type": actor_type,
            "actor_id": actor_id,
            "created_at": datetime.utcnow(),
            "metadata": metadata or {},
        }
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_grievance(
    payload: CreateGrievanceRequest,
    current_user: dict[str, Any] = Depends(require_roles("citizen")),
) -> dict[str, Any]:
    db = get_database()
    now = datetime.utcnow()
    docket_number = await _build_docket_number(db)
    citizen_id = current_user["_id"]

    grievance_document = {
        "docket_number": docket_number,
        "citizen_id": citizen_id,
        "description": payload.description.strip(),
        "title": payload.title.strip() if payload.title else None,
        "status": "submitted",
        "ministry": payload.ministry.strip() if payload.ministry else None,
        "category": payload.category.strip(),
        "sub_category": payload.sub_category.strip() if payload.sub_category else None,
        "location": payload.location.strip() if payload.location else None,
        "priority": payload.priority or "medium",
        "ai_triaged": False,
        "assigned_officer_id": None,
        "attachment_name": payload.attachment_name,
        "attachment_size": payload.attachment_size,
        "attachment_url": payload.attachment_url,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.grievances.insert_one(grievance_document)
    created = await db.grievances.find_one({"_id": result.inserted_id})
    if created is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create grievance")

    await _insert_timeline_event(
        db=db,
        grievance_id=str(created["_id"]),
        event_type="submitted",
        description="Grievance submitted",
        actor_type="citizen",
        actor_id=citizen_id,
        metadata={
            "status": "submitted",
            "docket_number": docket_number,
            "category": grievance_document["category"],
        },
    )

    timeline = await db.grievance_timeline.find({"grievance_id": str(created["_id"])}).sort("created_at", 1).to_list(length=20)
    response = _serialize_grievance(created)
    response["timeline"] = [_serialize_timeline_event(event) for event in timeline]
    return response


@router.get("")
async def list_grievances(current_user: dict[str, Any] = Depends(get_current_user)) -> list[dict[str, Any]]:
    db = get_database()
    query: dict[str, Any] = {}
    if current_user.get("role") == "citizen":
        query["citizen_id"] = current_user["_id"]

    grievances = await db.grievances.find(query).sort("created_at", -1).to_list(length=500)
    return [_serialize_grievance(grievance) for grievance in grievances]


@router.patch("/{id}/status")
async def update_grievance_status(
    id: str,
    payload: UpdateGrievanceStatusRequest,
    current_user: dict[str, Any] = Depends(require_roles("officer", "admin")),
) -> dict[str, Any]:
    db = get_database()
    object_id = _to_object_id(id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grievance not found")

    grievance = await db.grievances.find_one({"_id": object_id})
    if grievance is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grievance not found")

    new_status = payload.status
    if new_status not in VALID_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")

    now = datetime.utcnow()
    await db.grievances.update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": new_status,
                "updated_at": now,
            }
        },
    )

    updated = await db.grievances.find_one({"_id": object_id})
    if updated is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update grievance")

    await _insert_timeline_event(
        db=db,
        grievance_id=str(updated["_id"]),
        event_type="status_updated",
        description=payload.note or f"Status updated to {new_status}",
        actor_type=current_user.get("role", "officer"),
        actor_id=current_user["_id"],
        metadata={
            "status": new_status,
            "previous_status": grievance.get("status"),
        },
    )

    timeline = await db.grievance_timeline.find({"grievance_id": str(updated["_id"])}).sort("created_at", 1).to_list(length=50)
    response = _serialize_grievance(updated)
    response["timeline"] = [_serialize_timeline_event(event) for event in timeline]
    return response


@router.get("/{id}")
async def get_grievance(id: str, current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    db = get_database()
    grievance = await _get_grievance_or_404(db, id)
    if current_user.get("role") == "citizen" and grievance.get("citizen_id") != current_user["_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    timeline = await db.grievance_timeline.find({"grievance_id": str(grievance["_id"])}).sort("created_at", 1).to_list(length=50)
    response = _serialize_grievance(grievance)
    response["timeline"] = [_serialize_timeline_event(event) for event in timeline]
    return response
