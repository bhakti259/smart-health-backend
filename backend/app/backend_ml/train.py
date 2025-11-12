import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
from pathlib import Path
import numpy as np

OUT = Path(__file__).parent
MODEL_PATH = OUT / "model.pkl"

def build_toy_dataset():
    # small synthetic dataset for dev / demo
    data = {
        "age": [25, 35, 45, 55, 65, 75, 30, 40, 50, 60],
        "bmi": [22, 25, 28, 30, 32, 29, 23, 27, 31, 33],
        "smoker": [0,0,1,1,1,1,0,1,0,1],
        "alcohol": [1,2,3,4,5,2,1,3,4,5],
        "exercise": [4,3,2,1,0,1,5,2,3,1],
    }
    df = pd.DataFrame(data)
    # define high_risk label heuristically for demo only
    df["high_risk"] = ((df["age"] > 50) & (df["bmi"] > 28)) | ((df["smoker"] == 1) & (df["bmi"] > 30))
    df["high_risk"] = df["high_risk"].astype(int)
    return df

def train_and_save():
    df = build_toy_dataset()
    X = df[["age","bmi","smoker","alcohol","exercise"]]
    y = df["high_risk"]
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X, y)
    joblib.dump(clf, MODEL_PATH)
    print("Saved model to", MODEL_PATH)

if __name__ == "__main__":
    train_and_save()
