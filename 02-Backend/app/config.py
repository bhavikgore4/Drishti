import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Drishti API")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "drishti")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "development-secret-change-me")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    ML_ENGINE_URL: str = os.getenv("ML_ENGINE_URL", "http://localhost:8001")
    ML_ENGINE_TIMEOUT_SECONDS: float = float(os.getenv("ML_ENGINE_TIMEOUT_SECONDS", "3"))


settings = Settings()
