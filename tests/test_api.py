import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_read_main():
    """Test that the API is accessible"""
    response = client.get("/api/predictions")
    assert response.status_code in [200, 401]  # 401 if auth required


def test_login_endpoint():
    """Test login functionality"""
    response = client.post(
        "/api/login",
        data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    response = client.post(
        "/api/login",
        data={"username": "wrong", "password": "wrong"}
    )
    assert response.status_code == 400


def test_prediction_without_auth():
    """Test that prediction endpoint requires authentication"""
    response = client.post(
        "/api/predictions",
        json={
            "age": 45,
            "weight_kg": 80.0,
            "height_cm": 170.0,
            "smoker": False,
            "alcohol_units_per_week": 5,
            "exercise_hours_per_week": 3.0
        }
    )
    assert response.status_code == 401


def test_prediction_with_auth():
    """Test prediction endpoint with authentication"""
    # First, login
    login_response = client.post(
        "/api/login",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Then, make prediction
    response = client.post(
        "/api/predictions",
        json={
            "age": 45,
            "weight_kg": 80.0,
            "height_cm": 170.0,
            "smoker": False,
            "alcohol_units_per_week": 5,
            "exercise_hours_per_week": 3.0
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "risk_score" in response.json()
    assert "bmi" in response.json()
