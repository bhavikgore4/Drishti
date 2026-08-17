import sys
import traceback

try:
    print("Step 1: Importing FastAPI...")
    from fastapi import FastAPI
    print("Step 1: OK")
    
    print("Step 2: Importing settings...")
    from app.core.config import settings
    print("Step 2: OK - settings =", settings)
    
    print("Step 3: Creating FastAPI app...")
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )
    print("Step 3: OK - app =", app)
    
    print("\nSuccess! App created.")
    print("App object:", app)
    print("Type:", type(app))
    
except Exception as e:
    print("\nError occurred:")
    traceback.print_exc()
    sys.exit(1)
