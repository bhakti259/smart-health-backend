from pathlib import Path
import joblib
import numpy as np
import pandas as pd

MODEL_FILE = Path(__file__).parent / "model.pkl"

# load at import time
try:
    _model = joblib.load(MODEL_FILE)
except Exception as e:
    _model = None
    print("Warning: model failed to load:", e)

def predict_risk(features: dict) -> float:
    """
    features should have keys: age, bmi, smoker (bool/int), alcohol_units_per_week, exercise_hours_per_week
    returns a float probability 0..1
    """
    if _model is None:
        # fallback: simple heuristic if model not available
        bmi = features.get("bmi") or 0.0
        score = 0.0
        score += max(0, (features.get("age", 0) - 30) / 100.0)
        score += max(0, (bmi - 22) / 50.0)
        score += 0.2 if features.get("smoker") else 0.0
        return min(1.0, score)
    arr = np.array([[
        features.get("age", 0),
        features.get("bmi", 0.0),
        int(bool(features.get("smoker", 0))),
        features.get("alcohol_units_per_week", 0),
        features.get("exercise_hours_per_week", 0.0)
    ]])
    
    # Convert to DataFrame with feature names matching training
    # Model was trained with: age, bmi, smoker, alcohol, exercise
    feature_names = ["age", "bmi", "smoker", "alcohol", "exercise"]
    df = pd.DataFrame(arr, columns=feature_names)
    
    probs = _model.predict_proba(df)
    # probability of class 1 (high risk)
    return float(probs[0,1])
