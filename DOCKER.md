# Smart Health Backend - Docker Setup

## 🐳 Docker Build & Run Instructions

### Prerequisites
- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

### Quick Start

#### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop the backend
docker-compose down
```

#### Option 2: Using Docker directly

```bash
# Build the Docker image
docker build -f backend/Dockerfile -t smart-health-backend .

# Run the container
docker run -d \
  --name smart-health-backend \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -e SECRET_KEY=mysecretkey28052020 \
  smart-health-backend

# View logs
docker logs -f smart-health-backend

# Stop the container
docker stop smart-health-backend
docker rm smart-health-backend
```

### Access the Application

Once running, access:
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/predictions

### Environment Variables

You can customize these in `docker-compose.yml`:

**Backend:**
```yaml
environment:
  - SECRET_KEY=your-secret-key-here
  - ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend:**
```yaml
environment:
  - VITE_API_URL=http://localhost:8000/api
```

For production, create a `.env` file or set environment variables directly.

### Data Persistence

The application uses volumes for:
- **Database**: `./data` (SQLite database location)
- **ML Models**: `./backend/app/backend_ml` (trained models)

### Useful Commands

```bash
# Rebuild after code changes
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend

# View container status
docker-compose ps

# Execute commands inside backend container
docker-compose exec backend python -m backend.app.backend_ml.train

# Execute commands inside frontend container
docker-compose exec frontend sh

# View resource usage
docker stats

# Remove everything including volumes
docker-compose down -v

# Remove specific service
docker-compose stop frontend
docker-compose rm frontend
```

### Image Optimization

**Backend Image:**
- Base: Python 3.12 slim (~150MB)
- Final size: ~400-500MB

**Frontend Image:**
- Multi-stage build (Node 20 Alpine → Nginx Alpine)
- Build stage discarded after build
- Final size: ~25-30MB (only built files + nginx)

### Production Considerations

For production deployment:

1. **Use a proper database** (PostgreSQL instead of SQLite)
2. **Set secure SECRET_KEY** via environment variables
3. **Configure CORS** for your production domain
4. **Use HTTPS** with a reverse proxy (nginx/traefik)
5. **Set up logging** to external service
6. **Scale horizontally** with load balancer
7. **Use Docker secrets** for sensitive data
8. **Set proper resource limits** in docker-compose.yml
9. **Enable container monitoring** (Prometheus/Grafana)
10. **Use production-ready** frontend build with proper API URL

**Example production docker-compose.yml:**
```yaml
services:
  backend:
    image: smart-health-backend:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
  
  frontend:
    image: smart-health-frontend:latest
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 128M
    environment:
      - VITE_API_URL=https://api.yourdomain.com/api
```

### Networking

Both services run on the same Docker network (`smart-health-network`) allowing:
- Frontend can communicate with backend via service name: `http://backend:8000`
- Backend is accessible from host at `http://localhost:8000`
- Frontend is accessible from host at `http://localhost`

For production, consider:
- Using an external reverse proxy (Nginx, Traefik, or Caddy)
- Implementing SSL/TLS termination
- Setting up a CDN for frontend static assets

### Troubleshooting

**Containers won't start:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Backend
ports:
  - "8001:8000"  # Use 8001 instead

# Frontend  
ports:
  - "8080:80"  # Use 8080 instead
```

**Frontend can't connect to backend:**
- Check `VITE_API_URL` environment variable
- Ensure backend is running: `docker-compose ps`
- Check browser console for CORS errors
- Verify backend CORS settings in `main.py`

**Build fails:**
```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

**Database issues:**
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

**Frontend shows blank page:**
- Check nginx logs: `docker-compose logs frontend`
- Verify build succeeded: `docker-compose exec frontend ls /usr/share/nginx/html`
- Check browser console for JavaScript errors

**Out of disk space:**
```bash
# Remove unused images and containers
docker system prune -a --volumes
```
