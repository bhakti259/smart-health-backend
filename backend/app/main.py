from datetime import timedelta
import random
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .schemas import HealthInput, HealthResponse
from .auth import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token, get_current_user
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
    
    
@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": token, "token_type": "bearer"}

# Test endpoint to verify auth is working
@app.get("/api/test-auth")
def test_auth(user: dict = Depends(get_current_user)):
    return {"message": "Authentication working!", "user": user}

# Protected route - requires JWT authentication
@app.post("/api/predict", response_model=HealthResponse)
def predict_health(data: HealthInput, user: dict = Depends(get_current_user)):
    score = random.random()
    verdict = "Low Risk" if score < 0.5 else "High Risk"
    return {"health_risk_score": score, "verdict": verdict}

app.include_router(predictions.router)
