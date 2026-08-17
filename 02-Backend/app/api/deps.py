from __future__ import annotations

from bson import ObjectId
from bson.errors import InvalidId
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_database
from app.security import decode_access_token

security_scheme = HTTPBearer(auto_error=False)


def _to_object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> dict[str, Any]:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    try:
        payload = decode_access_token(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    object_id = _to_object_id(user_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    db = get_database()
    token_role = payload.get("role")

    collections = []
    if token_role in {"officer", "admin"}:
        collections = [db.officers, db.users]
    elif token_role == "citizen":
        collections = [db.users, db.officers]
    else:
        collections = [db.users, db.officers]

    for collection in collections:
        account = await collection.find_one({"_id": object_id})
        if account is None:
            continue
        if collection.name == "officers":
            return {
                "_id": str(account["_id"]),
                "role": account.get("role", "officer"),
                "username": account.get("username"),
                "name": account.get("name"),
                "email": account.get("email"),
            }
        return {
            "_id": str(account["_id"]),
            "role": account.get("role", "citizen"),
            "name": account.get("name"),
            "email": account.get("email"),
            "mobile": account.get("mobile"),
        }

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")


def require_roles(*allowed_roles: str):
    async def role_dependency(current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        if allowed_roles and current_user.get("role") not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return role_dependency
