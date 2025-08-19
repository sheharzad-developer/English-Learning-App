# English Learning App - Deployment Guide

This guide provides comprehensive instructions for deploying the English Learning App using Docker and Docker Compose.

## Prerequisites

### System Requirements
- Docker 20.10+ installed and running
- Docker Compose 2.0+ installed
- At least 4GB RAM available
- At least 10GB disk space

### Installation Links
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repository-url>
cd English-Learning-App
```

### 2. Environment Configuration
```bash
# Copy the production environment template
cp .env.production .env

# Edit the environment file with your settings
nano .env  # or use your preferred editor
```

**Important**: Update the following variables in `.env`:
- `SECRET_KEY`: Generate a new Django secret key
- `ALLOWED_HOSTS`: Add your domain names
- `CORS_ALLOWED_ORIGINS`: Add your frontend URLs
- Database credentials (if different from defaults)

### 3. Deploy the Application
```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run full deployment
./deploy.sh deploy
```

This will:
- Build all Docker images
- Start all services (database, backend, frontend)
- Run database migrations
- Collect static files
- Show service status

### 4. Create Admin User
```bash
./deploy.sh superuser
```

### 5. Access the Application
- **Frontend**: http://localhost
- **Admin Panel**: http://localhost/admin
- **API**: http://localhost/api

## Deployment Script Commands

The `deploy.sh` script provides several useful commands:

```bash
# Full deployment
./deploy.sh deploy

# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Run migrations
./deploy.sh migrate

# Create superuser
./deploy.sh superuser

# Backup database
./deploy.sh backup

# Restore database
./deploy.sh restore backup_file.sql

# Clean up (removes all containers and volumes)
./deploy.sh clean
```

## Architecture Overview

The application consists of the following services:

### Core Services
1. **Frontend** (React + Nginx)
   - Port: 80
   - Serves the React application
   - Proxies API requests to backend

2. **Backend** (Django + Gunicorn)
   - Port: 8000
   - REST API server
   - Handles authentication, lessons, exercises

3. **Database** (PostgreSQL)
   - Port: 5432
   - Stores application data
   - Persistent volume for data

4. **Cache** (Redis)
   - Port: 6379
   - Session storage and caching
   - Background task queue

### Optional Services
5. **Load Balancer** (Nginx)
   - Port: 443 (HTTPS)
   - SSL termination
   - Production-only service

## Production Deployment

### SSL/HTTPS Setup

1. **Obtain SSL Certificates**
   ```bash
   # Using Let's Encrypt (recommended)
   sudo apt install certbot
   sudo certbot certonly --standalone -d yourdomain.com
   
   # Copy certificates
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
   ```

2. **Enable Production Profile**
   ```bash
   # Start with production Nginx
   docker-compose --profile production up -d
   ```

### Environment Variables for Production

Update `.env` with production values:

```env
# Security
DEBUG=False
SECRET_KEY=your-very-secure-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (use managed database service in production)
DATABASE_URL=postgresql://user:password@your-db-host:5432/dbname

# Email (for notifications)
EMAIL_HOST=smtp.your-provider.com
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Monitoring and Logging

1. **View Service Logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f db
   ```

2. **Health Checks**
   ```bash
   # Check service health
   docker-compose ps
   
   # Backend health endpoint
   curl http://localhost:8000/api/health/
   ```

### Backup and Restore

1. **Database Backup**
   ```bash
   # Create backup
   ./deploy.sh backup
   
   # Manual backup
   docker-compose exec db pg_dump -U postgres english_learning_db > backup.sql
   ```

2. **Database Restore**
   ```bash
   # Restore from backup
   ./deploy.sh restore backup_20231201_120000.sql
   
   # Manual restore
   docker-compose exec -T db psql -U postgres english_learning_db < backup.sql
   ```

3. **Media Files Backup**
   ```bash
   # Backup media files
   docker cp english_learning_backend:/app/media ./media_backup
   
   # Restore media files
   docker cp ./media_backup english_learning_backend:/app/media
   ```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :80
   lsof -i :8000
   
   # Stop conflicting services
   sudo systemctl stop apache2  # or nginx
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs db
   
   # Connect to database manually
   docker-compose exec db psql -U postgres english_learning_db
   ```

3. **Frontend Build Issues**
   ```bash
   # Rebuild frontend
   docker-compose build --no-cache frontend
   
   # Check build logs
   docker-compose logs frontend
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x deploy.sh
   ```

### Performance Optimization

1. **Database Optimization**
   ```bash
   # Run inside backend container
   docker-compose exec backend python manage.py dbshell
   
   # Analyze query performance
   EXPLAIN ANALYZE SELECT * FROM lessons_lesson;
   ```

2. **Memory Usage**
   ```bash
   # Monitor container resources
   docker stats
   
   # Adjust worker processes in docker-compose.yml
   # backend service command: --workers 4
   ```

3. **Static File Serving**
   - Static files are served by Nginx for better performance
   - Media files are served through Django in development
   - Consider using CDN for production

## Scaling

### Horizontal Scaling

1. **Multiple Backend Instances**
   ```yaml
   # In docker-compose.yml
   backend:
     deploy:
       replicas: 3
   ```

2. **Load Balancer Configuration**
   - Use the production Nginx service
   - Configure upstream servers
   - Enable session affinity if needed

### Database Scaling

1. **Read Replicas**
   - Configure Django database routing
   - Add read-only database instances

2. **Connection Pooling**
   - Use pgbouncer for PostgreSQL
   - Configure in docker-compose.yml

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use secrets management in production
   - Rotate keys regularly

2. **Network Security**
   - Use internal Docker networks
   - Expose only necessary ports
   - Configure firewall rules

3. **Updates**
   - Regularly update base images
   - Monitor security advisories
   - Test updates in staging environment

## Support

For deployment issues:
1. Check the logs: `./deploy.sh logs`
2. Verify service status: `./deploy.sh status`
3. Review this documentation
4. Check Docker and system resources

For application issues:
1. Access Django admin panel
2. Check backend logs for errors
3. Verify database connectivity
4. Test API endpoints manually