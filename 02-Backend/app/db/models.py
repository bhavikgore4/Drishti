from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class MongoModel(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)
    id: Optional[str] = Field(default=None, alias="_id")


class User(MongoModel):
    name: str
    email: str
    mobile: str
    password_hash: str | None = None
    gender: str | None = None
    country: str | None = None
    state: str | None = None
    district: str | None = None
    pincode: str | None = None
    address: str | None = None
    role: Literal["citizen", "officer", "admin"] = "citizen"
    created_at: datetime | None = None
    updated_at: datetime | None = None
    last_login_at: datetime | None = None


class Officer(MongoModel):
    username: str
    name: str
    designation: str | None = None
    department: str | None = None
    sub_division: str | None = None
    email: str | None = None
    phone: str | None = None
    office_address: str | None = None
    password_hash: str | None = None
    role: Literal["officer", "admin"] = "officer"
    created_at: datetime | None = None
    updated_at: datetime | None = None


class Grievance(MongoModel):
    docket_number: str
    citizen_id: str
    description: str
    title: str | None = None
    status: str = "Pending"
    ministry: str | None = None
    category: str | None = None
    sub_category: str | None = None
    location: str | None = None
    priority: str | None = None
    ai_triaged: bool = False
    assigned_officer_id: str | None = None
    attachment_name: str | None = None
    attachment_size: str | None = None
    attachment_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class GrievanceTimeline(MongoModel):
    grievance_id: str
    event_type: str
    description: str
    actor_type: Literal["citizen", "officer", "system"] = "system"
    actor_id: str | None = None
    created_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class Hotspot(MongoModel):
    hotspot_id: str
    name: str
    marathi_name: str | None = None
    zone: str
    ward_no: str | int | None = None
    category: str
    base_risk: Literal["severe", "moderate", "normal"]
    lat: float
    lng: float
    location: dict[str, Any] = Field(default_factory=lambda: {"type": "Point", "coordinates": [0.0, 0.0]})
    elevation_meters: float | None = None
    vulnerability_factor: str | None = None
    historical_event: str | None = None
    drainage_capacity: str | None = None
    nearest_ndrf_post: str | None = None
    emergency_helpline: str | None = None
    nodal_contact: str | None = None
    evacuation_shelter: str | None = None
    population_impacted_estimate: int | None = None
    live_water_level_cm: int | None = None
    cctv_stream_available: bool | None = None
