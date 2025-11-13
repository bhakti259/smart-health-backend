from pydantic import BaseModel

# Input data structure for health prediction
class HealthInput(BaseModel):
    age: int
    bmi: float
    exercise_hours: float
    smoker: bool
    alcohol_intake: str
    sleep_hours: float

# Response structure for prediction result
class HealthResponse(BaseModel):
    health_risk_score: float
    verdict: str
