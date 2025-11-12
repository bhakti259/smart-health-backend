from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Measurement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    age: int
    weight_kg: float
    height_cm: float
    smoker: bool = False
    alcohol_units_per_week: int = 0
    exercise_hours_per_week: float = 0.0
    bmi: float | None = None
    risk_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
