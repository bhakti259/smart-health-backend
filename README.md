# 🏥 Smart Health Backend

A FastAPI-based backend service for health risk prediction using machine learning. This system analyzes user health metrics (age, BMI, lifestyle factors) to predict health risk scores.

## ✨ Features

- **Health Risk Prediction API**: ML-powered risk assessment based on user health data
- **RESTful API**: Built with FastAPI for high performance and automatic documentation
- **Database Management**: SQLModel + SQLite for data persistence
- **Machine Learning**: Scikit-learn based prediction model
- **Auto-generated API Docs**: Interactive Swagger UI and ReDoc

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.101.0
- **Server**: Uvicorn 0.23.2
- **ORM**: SQLModel 0.0.14
- **Database**: SQLite (via SQLAlchemy 2.0.44)
- **ML**: Scikit-learn 1.3.2, Pandas 2.2.2, NumPy 1.26.4
- **Python Version**: 3.12.6

## 📋 Prerequisites

- Python 3.12+
- pip
- Virtual environment (recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/bhakti259/smart-health-backend.git
cd smart-health-backend
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell)
.venv\Scripts\Activate.ps1

# On Windows (CMD)
.venv\Scripts\activate.bat

# On Linux/Mac
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Train the ML Model (First Time Setup)

```bash
python backend/app/backend_ml/train.py
```

This creates the ML model file (`health_risk_model.pkl`) needed for predictions.

### 5. Run the Server

```bash
# Using Python module
python -m uvicorn backend.app.main:app --reload --port 8000

# Or if virtual environment is activated
uvicorn backend.app.main:app --reload --port 8000
```

The API will be available at:

- **API**: <http://localhost:8000>
- **Swagger UI**: <http://localhost:8000/docs>
- **ReDoc**: <http://localhost:8000/redoc>

## 📡 API Endpoints

### Create Health Risk Prediction

**POST** `/api/predictions`

Request body:

```json
{
  "age": 45,
  "weight_kg": 80.0,
  "height_cm": 170.0,
  "smoker": false,
  "alcohol_units_per_week": 5,
  "exercise_hours_per_week": 3.0
}
```

Response:

```json
{
  "id": 1,
  "risk_score": 0.3542,
  "bmi": 27.68,
  "created_at": "2025-11-12T10:30:00"
}
```

### Get Prediction History

**GET** `/api/predictions?limit=50`

Response:

```json
[
  {
    "id": 1,
    "user_id": 1,
    "age": 45,
    "bmi": 27.68,
    "risk_score": 0.3542,
    "created_at": "2025-11-12T10:30:00"
  }
]
```

## 📊 Database Schema

### Users Table

- `id`: Primary key
- `email`: User email
- `hashed_password`: Encrypted password
- `created_at`: Registration timestamp

### Measurements Table

- `id`: Primary key
- `user_id`: Foreign key to Users
- `age`: User age
- `weight_kg`: Weight in kilograms
- `height_cm`: Height in centimeters
- `smoker`: Boolean flag
- `alcohol_units_per_week`: Weekly alcohol consumption
- `exercise_hours_per_week`: Weekly exercise duration
- `bmi`: Calculated Body Mass Index
- `risk_score`: ML predicted health risk (0-1)
- `created_at`: Measurement timestamp

## 🧠 Machine Learning Model

The prediction model uses:

- **Algorithm**: Scikit-learn ML model
- **Features**: Age, BMI, smoking status, alcohol consumption, exercise
- **Output**: Risk score (0.0 to 1.0, where higher = higher risk)
- **Training**: Run `backend/app/backend_ml/train.py` to retrain

## 📁 Project Structure

```text
smart-health-backend/
├── backend/
│   └── app/
│       ├── api/
│       │   └── predictions.py      # Prediction endpoints
│       ├── backend_ml/
│       │   ├── train.py           # Model training script
│       │   └── predict.py         # Prediction logic
│       ├── db.py                  # Database session management
│       ├── init_db.py             # Database initialization
│       ├── main.py                # FastAPI application
│       └── models.py              # SQLModel schemas
├── .gitignore
├── requirements.txt
└── README.md
```

## 🔧 Development

### Database Initialization

The database is automatically initialized on application startup. Tables are created if they don't exist.

### Adding New Features

1. Define models in `models.py`
2. Create API routes in `backend/app/api/`
3. Include router in `main.py`

### Running Tests

```bash
# Add your test commands here
pytest
```

## 🐛 Troubleshooting

### Module Not Found Error

Make sure your virtual environment is activated:
```bash
.venv\Scripts\Activate.ps1  # PowerShell
```

### Uvicorn Not Found

Run via Python module:
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```

### Database Issues

Delete the SQLite database file and restart the server to recreate tables.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**bhakti259**
- GitHub: [@bhakti259](https://github.com/bhakti259)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
