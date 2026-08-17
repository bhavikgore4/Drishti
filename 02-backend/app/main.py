from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import client
from app.routes import auth  

app = FastAPI(title="DRISHTI Backend")

# --- FIXED CORS SETUP ---
# --- FIXED CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Ab ye kisi bhi URL se request aane dega
    allow_credentials=False,       # Isko False karna zaroori hai '*' ke sath
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------
#  ------------------------

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "DRISHTI Backend is running"}

@app.get("/db-test")
def db_test():
    try:
        client.admin.command("ping")
        return {"database": "MongoDB connected successfully"}
    except Exception as e:
        return {"database": "Connection failed", "error": str(e)}
    