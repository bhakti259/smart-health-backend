# Nginx SSL Setup for AWS EC2

This guide explains how to set up Nginx as a reverse proxy with SSL for your FastAPI backend on AWS EC2.

## Prerequisites

- AWS EC2 instance running with FastAPI backend on port 8000
- SSH access to your EC2 instance
- Security group allowing ports 80 and 443

## Step 1: Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

## Step 2: Generate Self-Signed SSL Certificate

```bash
# Create directory for private key if it doesn't exist
sudo mkdir -p /etc/ssl/private

# Generate self-signed certificate (valid for 365 days)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/fastapi-selfsigned.key \
  -out /etc/ssl/certs/fastapi-selfsigned.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=13.61.154.156"

# Set proper permissions
sudo chmod 600 /etc/ssl/private/fastapi-selfsigned.key
```

## Step 3: Configure Nginx

```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Create new configuration
sudo nano /etc/nginx/sites-available/fastapi
```

Paste the contents from `nginx-aws-ssl.conf`:

```nginx
# HTTPS server
server {
    listen 443 ssl;
    server_name 13.61.154.156;

    ssl_certificate /etc/ssl/certs/fastapi-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/fastapi-selfsigned.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name 13.61.154.156;
    return 301 https://$host$request_uri;
}
```

## Step 4: Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/fastapi /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

## Step 5: Update AWS Security Group

Ensure your EC2 security group allows:
- **Port 80** (HTTP) - for redirect
- **Port 443** (HTTPS) - for SSL traffic
- **Port 8000** (optional) - for direct backend access

## Step 6: Verify Setup

```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Test locally
curl http://localhost:8000/docs
curl http://127.0.0.1
curl https://127.0.0.1 -k
```

## Step 7: Update FastAPI CORS (if needed)

Update `backend/app/main.py` to allow HTTPS connections:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:80",
        "http://127.0.0.1:80",
        "https://13.61.154.156",  # Add HTTPS
        "http://13.61.154.156",   # Add HTTP
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing

After setup, test your endpoints:

- **HTTP** (should redirect): http://13.61.154.156
- **HTTPS**: https://13.61.154.156/docs
- **Direct backend** (if port 8000 is open): http://13.61.154.156:8000/docs

## Using Let's Encrypt (Production SSL - Recommended)

For a production environment, use Let's Encrypt for a real SSL certificate:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (requires domain name, not IP)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

**Note**: Let's Encrypt requires a domain name. If you only have an IP address, you'll need to use a self-signed certificate (as shown above) or purchase a domain.

## Troubleshooting

### Nginx fails to start
```bash
# Check configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Port already in use
```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting service
sudo systemctl stop apache2  # if Apache is running
```

### SSL certificate errors
```bash
# Verify certificate files exist
ls -la /etc/ssl/certs/fastapi-selfsigned.crt
ls -la /etc/ssl/private/fastapi-selfsigned.key

# Regenerate if needed
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/fastapi-selfsigned.key \
  -out /etc/ssl/certs/fastapi-selfsigned.crt
```

### Backend not responding
```bash
# Check if FastAPI is running
ps aux | grep uvicorn

# Check if port 8000 is listening
sudo lsof -i :8000

# Check Docker container (if using Docker)
docker ps
docker logs <container_id>
```

## Production Recommendations

1. **Use Let's Encrypt** for production SSL certificates
2. **Get a domain name** instead of using IP address
3. **Configure firewall** (UFW):
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
4. **Add rate limiting** to Nginx config
5. **Enable monitoring** (CloudWatch, Prometheus, etc.)
6. **Set up log rotation** for Nginx logs
7. **Use environment variables** for secrets
8. **Enable HTTPS in FastAPI** with proper certificates

## References

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [AWS EC2 Security Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)
