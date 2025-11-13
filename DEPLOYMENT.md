# 🚀 Deployment Guide

## Deployment Options

### 1. Docker Hub + Cloud Server (Recommended)

#### Step 1: Push to Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag images
docker tag smart-health-backend:latest yourusername/smart-health-backend:latest
docker tag smart-health-frontend:latest yourusername/smart-health-frontend:latest

# Push images
docker push yourusername/smart-health-backend:latest
docker push yourusername/smart-health-frontend:latest
```

#### Step 2: Deploy to Cloud Server (AWS EC2, DigitalOcean, etc.)
```bash
# On your server
ssh user@your-server-ip

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo apt-get install docker-compose-plugin

# Clone or create docker-compose.yml
# Update image names to your Docker Hub images
docker compose pull
docker compose up -d
```

---

### 2. AWS Deployment

#### Option A: AWS ECS (Elastic Container Service)
- Upload images to ECR (Elastic Container Registry)
- Create ECS task definitions
- Deploy to ECS Fargate or EC2

#### Option B: AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p docker smart-health-app

# Create environment
eb create smart-health-prod

# Deploy
eb deploy
```

---

### 3. Heroku Deployment

#### Backend (Heroku Container Registry)
```bash
# Login
heroku login
heroku container:login

# Create app
heroku create smart-health-backend

# Build and push
heroku container:push web -a smart-health-backend
heroku container:release web -a smart-health-backend

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key -a smart-health-backend
```

#### Frontend (Static hosting)
Deploy to Vercel, Netlify, or CloudFlare Pages

---

### 4. DigitalOcean App Platform

1. Connect your GitHub repository
2. Select `docker-compose.yml`
3. Configure environment variables
4. Deploy (automatic builds on git push)

**Pros:**
- Simple setup
- Auto-scaling
- Automatic SSL
- $5/month starter

---

### 5. Railway.app

1. Connect GitHub repo
2. Railway auto-detects Dockerfile
3. Deploy both services
4. Custom domain support

**Pros:**
- Free tier available
- Simple deployment
- Auto SSL

---

### 6. Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT-ID/smart-health-backend
gcloud builds submit --tag gcr.io/PROJECT-ID/smart-health-frontend

# Deploy
gcloud run deploy smart-health-backend \
  --image gcr.io/PROJECT-ID/smart-health-backend \
  --platform managed

gcloud run deploy smart-health-frontend \
  --image gcr.io/PROJECT-ID/smart-health-frontend \
  --platform managed
```

---

### 7. Kubernetes (Production Scale)

#### Create Kubernetes manifests
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: yourusername/smart-health-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: secret-key
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - port: 8000
    targetPort: 8000
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f k8s/
```

---

## Production Checklist

### Security
- [ ] Change default SECRET_KEY
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Update CORS settings for production domain
- [ ] Implement rate limiting
- [ ] Add authentication for admin endpoints

### Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Add database migrations (Alembic)

### Monitoring
- [ ] Set up application logging
- [ ] Add error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring (New Relic, DataDog)
- [ ] Create health check endpoints

### Performance
- [ ] Enable caching (Redis)
- [ ] Configure CDN for static assets
- [ ] Optimize Docker images
- [ ] Set up load balancing
- [ ] Configure auto-scaling

### CI/CD
- [ ] Set up GitHub Actions
- [ ] Add automated testing
- [ ] Configure deployment pipelines
- [ ] Set up staging environment

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment runbook
- [ ] Incident response plan
- [ ] User documentation

---

## Recommended Quick Deploy: Railway.app

For quick deployment without complexity:

1. **Push to GitHub** (already done)
2. **Go to [Railway.app](https://railway.app)**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway auto-detects Dockerfile**
6. **Add environment variables**
7. **Deploy!**

Cost: ~$5-10/month for starter app

---

## Cost Comparison

| Platform | Free Tier | Paid | SSL | Auto-scaling |
|----------|-----------|------|-----|--------------|
| Railway | $5 credit/month | $5-20/month | ✅ | ✅ |
| Heroku | No (deprecated) | $7-25/month | ✅ | ✅ |
| DigitalOcean | No | $5-12/month | ✅ | ⚠️ |
| AWS ECS | 12 months | Variable | ✅ | ✅ |
| Google Cloud Run | Yes (limited) | Pay-per-use | ✅ | ✅ |
| Vercel (Frontend) | Yes | $20/month | ✅ | ✅ |

---

## Need Help?

Check deployment logs:
```bash
# Docker logs
docker-compose logs -f

# Railway logs
railway logs

# Heroku logs
heroku logs --tail -a your-app-name
```
