from __future__ import annotations

from datetime import datetime
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.deps import get_current_user
from app.database import get_database
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    email: str = Field(min_length=3)
    mobile: str = Field(min_length=5)
    password: str = Field(min_length=6)
    gender: str | None = None
    country: str | None = None
    state: str | None = None
    district: str | None = None
    pincode: str | None = None
    address: str | None = None


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1)
    password: str = Field(min_length=1)


class OfficerLoginRequest(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


def _object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


def _serialize_citizen(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(user["_id"]),
        "role": user.get("role", "citizen"),
        "name": user.get("name"),
        "email": user.get("email"),
        "mobile": user.get("mobile"),
        "gender": user.get("gender"),
        "country": user.get("country"),
        "state": user.get("state"),
        "district": user.get("district"),
        "pincode": user.get("pincode"),
        "address": user.get("address"),
    }


def _serialize_officer(officer: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(officer["_id"]),
        "role": officer.get("role", "officer"),
        "username": officer.get("username"),
        "name": officer.get("name"),
        "email": officer.get("email"),
        "phone": officer.get("phone"),
        "department": officer.get("department"),
        "designation": officer.get("designation"),
        "sub_division": officer.get("sub_division"),
    }


def _build_auth_response(user: dict[str, Any], token: str, account_type: str) -> dict[str, Any]:
    if account_type == "officer":
        return {"access_token": token, "token_type": "bearer", "user": _serialize_officer(user)}
    return {"access_token": token, "token_type": "bearer", "user": _serialize_citizen(user)}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(payload: RegisterRequest) -> dict[str, Any]:
    db = get_database()
    email = payload.email.strip().lower()
    mobile = payload.mobile.strip()
    now = datetime.utcnow()

    existing_user = await db.users.find_one({"$or": [{"email": email}, {"mobile": mobile}]})
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    document = {
        "name": payload.name.strip(),
        "email": email,
        "mobile": mobile,
        "password_hash": hash_password(payload.password),
        "gender": payload.gender,
        "country": payload.country,
        "state": payload.state,
        "district": payload.district,
        "pincode": payload.pincode,
        "address": payload.address,
        "role": "citizen",
        "created_at": now,
        "updated_at": now,
        "last_login_at": now,
    }

    result = await db.users.insert_one(document)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    if created_user is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user")

    token = create_access_token(str(created_user["_id"]), "citizen")
    return _build_auth_response(created_user, token, "citizen")


@router.post("/login")
async def login_user(payload: LoginRequest) -> dict[str, Any]:
    db = get_database()
    identifier = payload.identifier.strip().lower()
    account = await db.users.find_one({"$or": [{"email": identifier}, {"mobile": payload.identifier.strip()}]})
    if account is None or not verify_password(payload.password, account.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    now = datetime.utcnow()
    await db.users.update_one({"_id": account["_id"]}, {"$set": {"last_login_at": now, "updated_at": now}})
    refreshed = await db.users.find_one({"_id": account["_id"]})
    if refreshed is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load user")

    token = create_access_token(str(refreshed["_id"]), "citizen")
    return _build_auth_response(refreshed, token, "citizen")


@router.post("/officer/login")
async def login_officer(payload: OfficerLoginRequest) -> dict[str, Any]:
    db = get_database()
    username = payload.username.strip().lower()
    officer = await db.officers.find_one({"username": username})
    if officer is None or not verify_password(payload.password, officer.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    now = datetime.utcnow()
    await db.officers.update_one({"_id": officer["_id"]}, {"$set": {"last_login_at": now, "updated_at": now}})
    refreshed = await db.officers.find_one({"_id": officer["_id"]})
    if refreshed is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load officer")

    token = create_access_token(str(refreshed["_id"]), "officer")
    return _build_auth_response(refreshed, token, "officer")


@router.get("/me")
async def current_user(current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    return current_user
