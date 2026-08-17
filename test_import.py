#!/usr/bin/env python3
import sys
import traceback

try:
    import app.core.config as config_module
    print("Config module imported successfully")
    print("Config module attributes:", dir(config_module))
    
    # Try to get settings
    if hasattr(config_module, 'settings'):
        print("settings found:", config_module.settings)
    else:
        print("settings NOT found in module")
        print("Attempting to create Settings instance directly...")
        from pydantic_settings import BaseSettings
        
        class Settings(BaseSettings):
            PROJECT_NAME: str = "Drishti API"
            API_V1_STR: str = "/api/v1"
            DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/drishti_db"

            class Config:
                case_sensitive = True

        settings = Settings()
        print("Settings created:", settings)
        
except Exception as e:
    print("Error:")
    traceback.print_exc()
    sys.exit(1)
