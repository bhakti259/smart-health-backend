# 🏥 Smart Health Backend

A FastAPI-based backend service for health risk prediction using machine learning. This system analyzes user health metrics (age, BMI, lifestyle factors) to predict health risk scores.

## 🌐 Live Demo

**Frontend (React App)**: [https://d1shuzzoxjkkc4.cloudfront.net/login](https://d1shuzzoxjkkc4.cloudfront.net/login)

**Backend API (HTTPS)**: [https://13.61.154.156/docs](https://13.61.154.156/docs)

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

**Deployment:**
- Frontend: AWS S3 + CloudFront CDN
- Backend: AWS EC2 with Docker + Nginx SSL reverse proxy

**Note**: Backend uses self-signed SSL certificate. Your browser will show a security warning - this is expected. Click "Advanced" → "Proceed to site" to access the API.

## ✨ Features

- **Health Risk Prediction API**: ML-powered risk assessment based on user health data
- **JWT Authentication**: Secure token-based authentication with auto-logout
- **RESTful API**: Built with FastAPI for high performance and automatic documentation
- **Database Management**: SQLModel + SQLite for data persistence
- **Machine Learning**: Scikit-learn based prediction model
- **Auto-generated API Docs**: Interactive Swagger UI and ReDoc
- **Docker Support**: Containerized deployment with Docker & Docker Compose
- **Session Management**: Token expiration tracking with frontend integration

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.101.0
- **Authentication**: JWT (python-jose)
- **Password Hashing**: SHA256
- **Server**: Uvicorn 0.23.2
- **ORM**: SQLModel 0.0.14
- **Database**: SQLite (via SQLAlchemy 2.0.44)
- **ML**: Scikit-learn 1.3.2, Pandas 2.2.2, NumPy 1.26.4
- **Python Version**: 3.12.6
- **Container**: Docker & Docker Compose

## 📋 Prerequisites

**Option 1: Docker (Recommended - Easiest)**
- Docker Desktop installed
- No Python installation needed!

**Option 2: Local Development**
- Python 3.12+
- pip
- Virtual environment (recommended)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended - Production Ready) 🐳

The easiest way to run the application is using our pre-built Docker image from Docker Hub:

```bash
# Pull the image from Docker Hub
docker pull bsk25/smart-health-backend:latest

# Run the container (detached mode)
docker run -d -p 8000:8000 --name smart-health-api bsk25/smart-health-backend:latest

# Access the API
# Backend: http://localhost:8000/docs

# Useful commands:
# docker ps                    # View running containers
# docker logs smart-health-api # View container logs
# docker stop smart-health-api # Stop the container
# docker rm smart-health-api   # Remove the container
```

**Or use Docker Compose for full-stack (backend + frontend):**

```bash
# Clone the repository
git clone https://github.com/bhakti259/smart-health-backend.git
cd smart-health-backend

# Start both backend and frontend
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8000/docs
```

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

---

### Option 2: Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/bhakti259/smart-health-backend.git
cd smart-health-backend
```

#### 2. Set Up Virtual Environment

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

## 🐳 Docker Deployment

For containerized deployment using Docker, see [DOCKER.md](./DOCKER.md)

Quick start with Docker Compose (runs both backend and frontend):

```bash
# Build and run both services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the application:

- **Frontend**: <http://localhost>
- **Backend API**: <http://localhost:8000/docs>

For detailed Docker instructions and deployment options, see [DOCKER.md](./DOCKER.md)

---

## � API Endpoints

### Authentication

**POST** `/api/login`

Request (form data):
```
username: admin
password: admin123
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Protected Endpoints

All `/api/predictions` endpoints require JWT authentication.
Include in headers: `Authorization: Bearer <token>`

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
│   ├── Dockerfile                 # Docker configuration
│   └── app/
│       ├── api/
│       │   └── predictions.py     # Prediction endpoints
│       ├── backend_ml/
│       │   ├── train.py          # Model training script
│       │   └── predict.py        # Prediction logic
│       ├── auth.py               # JWT authentication
│       ├── db.py                 # Database session management
│       ├── init_db.py            # Database initialization
│       ├── main.py               # FastAPI application
│       ├── models.py             # SQLModel schemas
│       └── schemas.py            # Pydantic schemas
├── frontend/                     # React frontend application
├── .dockerignore
├── .gitignore
├── docker-compose.yml            # Docker Compose configuration
├── DOCKER.md                     # Docker deployment guide
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
