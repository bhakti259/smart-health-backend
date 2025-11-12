from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ..backend_ml.predict import predict_risk
from ..db import get_session
from sqlmodel import Session
from ..models import Measurement
from datetime import datetime

router = APIRouter(prefix="/api", tags=["predictions"])

class MeasurementIn(BaseModel):
    age: int = Field(..., gt=0, example=45)
    weight_kg: float = Field(..., gt=0, example=80.0)
    height_cm: float = Field(..., gt=0, example=170.0)
    smoker: bool = False
    alcohol_units_per_week: int = 0
    exercise_hours_per_week: float = 0.0

@router.post("/predictions")
def create_prediction(payload: MeasurementIn, session: Session = Depends(get_session)):
    # compute derived feature BMI
    try:
        bmi = payload.weight_kg / ((payload.height_cm / 100.0) ** 2)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid height/weight for BMI calculation")

    features = {
        "age": payload.age,
        "bmi": round(bmi, 2),
        "smoker": int(payload.smoker),
        "alcohol_units_per_week": payload.alcohol_units_per_week,
        "exercise_hours_per_week": payload.exercise_hours_per_week
    }

    score = predict_risk(features)  # float 0..1

    # use placeholder user_id=1 for dev; later protect with auth and use real user id
    meas = Measurement(
        user_id=1,
        age=payload.age,
        weight_kg=payload.weight_kg,
        height_cm=payload.height_cm,
        smoker=payload.smoker,
        alcohol_units_per_week=payload.alcohol_units_per_week,
        exercise_hours_per_week=payload.exercise_hours_per_week,
        bmi=features["bmi"],
        risk_score=score,
        created_at=datetime.utcnow()
    )

    session.add(meas)
    session.commit()
    session.refresh(meas)

    return {
        "id": meas.id,
        "risk_score": round(score, 4),
        "bmi": features["bmi"],
        "created_at": meas.created_at.isoformat()
    }

@router.get("/predictions")
def list_predictions(session: Session = Depends(get_session), limit: int = 50):
    q = session.query(Measurement).order_by(Measurement.created_at.desc()).limit(limit)
    items = q.all()
    return [
        {
            "id": m.id,
            "user_id": m.user_id,
            "age": m.age,
            "bmi": m.bmi,
            "risk_score": m.risk_score,
            "created_at": m.created_at.isoformat()
        }
        for m in items
    ]
