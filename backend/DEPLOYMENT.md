# Backend Deployment Guide

This guide covers how to deploy your Django backend to various hosting platforms since it cannot be deployed to Vercel (which only supports static sites).

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended for Beginners)

**Pros**: Free tier, easy setup, automatic database
**Cons**: Limited free tier resources

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Create a new project** and select your repository
4. **Add environment variables**:
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=your-app.railway.app
   DATABASE_URL=postgresql://... (auto-generated)
   ```
5. **Deploy** - Railway will automatically detect Django and deploy

### Option 2: Render (Free Tier Available)

**Pros**: Free tier, good documentation, easy setup
**Cons**: Free tier has limitations

1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.wsgi:application`
   - **Environment**: Python 3
5. **Add environment variables** (same as Railway)
6. **Deploy**

### Option 3: Heroku (Paid but Reliable)

**Pros**: Excellent Django support, reliable, good documentation
**Cons**: No free tier anymore

1. **Sign up** at [heroku.com](https://heroku.com)
2. **Install Heroku CLI**
3. **Login and create app**:
   ```bash
   heroku login
   heroku create your-app-name
   ```
4. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
5. **Configure environment variables**:
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
   ```
6. **Deploy**:
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

**Pros**: Affordable, good performance, managed database
**Cons**: Requires some technical knowledge

1. **Sign up** at [digitalocean.com](https://digitalocean.com)
2. **Create a new App**
3. **Connect your GitHub repository**
4. **Configure the app**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `gunicorn backend.wsgi:application`
5. **Add environment variables**
6. **Deploy**

## 🔧 Required Configuration Changes

### 1. Update settings.py for Production

Add these settings to your `backend/backend/settings.py`:

```python
import os
from pathlib import Path

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Database configuration for production
if os.environ.get('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
    }

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS configuration
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')

# Security settings for production
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
```

### 2. Update requirements.txt

Add these packages to your `requirements.txt`:

```
gunicorn==21.2.0
dj-database-url==2.1.0
whitenoise==6.6.0
psycopg2-binary==2.9.9
```

### 3. Create Procfile

Create a `Procfile` in your backend directory:

```
web: gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
```

### 4. Update CORS Settings

In your `backend/backend/settings.py`, ensure CORS is properly configured:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app",
    "https://your-frontend-domain.netlify.app",
]

CORS_ALLOW_CREDENTIALS = True
```

## 🌐 Environment Variables

Set these environment variables in your hosting platform:

### Required Variables
```
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-here
ALLOWED_HOSTS=your-app-domain.com,www.your-app-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Database Variables (Auto-configured by most platforms)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Optional Variables
```
TIME_ZONE=UTC
LANGUAGE_CODE=en-us
```

## 🔄 Deployment Process

### 1. Prepare Your Code

1. **Update your settings.py** with production configurations
2. **Add required packages** to requirements.txt
3. **Create Procfile**
4. **Test locally** with production settings

### 2. Choose Your Platform

Select one of the platforms above based on your needs:
- **Railway**: Best for beginners, free tier
- **Render**: Good free tier, easy setup
- **Heroku**: Most reliable, paid
- **DigitalOcean**: Good performance, affordable

### 3. Deploy

Follow the platform-specific instructions above.

### 4. Configure Domain (Optional)

1. **Add custom domain** in your hosting platform
2. **Update ALLOWED_HOSTS** with your domain
3. **Configure SSL certificate** (usually automatic)

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check requirements.txt for missing packages
   - Ensure all dependencies are listed
   - Check Python version compatibility

2. **Database Connection Issues**:
   - Verify DATABASE_URL is set correctly
   - Check if database service is running
   - Ensure database migrations are applied

3. **Static Files Not Loading**:
   - Run `python manage.py collectstatic`
   - Check STATIC_ROOT configuration
   - Verify static files are being served

4. **CORS Issues**:
   - Update CORS_ALLOWED_ORIGINS with your frontend domain
   - Check if CORS_ALLOW_CREDENTIALS is set to True
   - Verify django-cors-headers is installed

### Debug Commands

```bash
# Check logs
heroku logs --tail  # For Heroku
railway logs        # For Railway

# Run migrations
heroku run python manage.py migrate  # For Heroku
railway run python manage.py migrate # For Railway

# Create superuser
heroku run python manage.py createsuperuser  # For Heroku
railway run python manage.py createsuperuser # For Railway
```

## 🔒 Security Checklist

- [ ] DEBUG is set to False
- [ ] SECRET_KEY is properly set and secure
- [ ] ALLOWED_HOSTS includes your domain
- [ ] CORS is properly configured
- [ ] Database credentials are secure
- [ ] SSL/HTTPS is enabled
- [ ] Environment variables are set (not in code)

## 📊 Monitoring

### Health Checks

Add a health check endpoint to your Django app:

```python
# In your views.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy"})

# In your urls.py
path('health/', health_check, name='health_check'),
```

### Logging

Configure logging in your settings.py:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
```

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Railway | ✅ Yes | $5/month | Beginners |
| Render | ✅ Yes | $7/month | Small projects |
| Heroku | ❌ No | $7/month | Production apps |
| DigitalOcean | ❌ No | $5/month | Performance |

## 🎯 Next Steps

1. **Choose a platform** based on your needs
2. **Follow the deployment guide** for your chosen platform
3. **Test your deployment** thoroughly
4. **Update your frontend** to use the new backend URL
5. **Monitor your application** for any issues

Remember: Your backend needs a proper server environment and cannot be deployed to static hosting services like Vercel! 