from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import predictions
from . import init_db

app = FastAPI(title="Smart Health - Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Ensure tables exist on startup (simple dev approach)
@app.on_event("startup")
def on_startup():
    init_db.init_db()

app.include_router(predictions.router)
