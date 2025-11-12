from fastapi import FastAPI
from .api import predictions
from . import init_db

app = FastAPI(title="Smart Health - Backend")

# Ensure tables exist on startup (simple dev approach)
@app.on_event("startup")
def on_startup():
    init_db.init_db()

app.include_router(predictions.router)
