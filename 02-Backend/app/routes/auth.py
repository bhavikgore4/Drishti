from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Frontend se aane wale data ka structure
class UserRegister(BaseModel):
    name: str
    email: str
    mobile: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(user: UserRegister):
    # Dummy response to trick frontend into logging in and bypassing the screen
    return {
        "message": "Registration successful", 
        "token": "drishti-hackathon-token",
        "user": {"name": user.name, "email": user.email, "role": "citizen"}
    }

@router.post("/login")
def login(user: UserLogin):
    return {
        "message": "Login successful", 
        "token": "drishti-hackathon-token",
        "user": {"email": user.email, "role": "citizen"}
    }

@router.post("/officer/login")
def officer_login(user: UserLogin):
    return {
        "message": "Officer Login successful", 
        "token": "drishti-officer-token",
        "user": {"email": user.email, "role": "officer"}
    }