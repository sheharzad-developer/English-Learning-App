# ⚡ QUICK START - English Learning App

## 🚀 Fast Setup (Copy & Paste)

### Terminal 1 - Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install Django==5.2.1 djangorestframework==3.16.0 django-cors-headers==4.7.0 django-allauth==65.11.0 dj-rest-auth==7.0.1 djangorestframework-simplejwt==5.5.0 requests==2.32.5 cryptography==45.0.6 gunicorn==21.2.0 dj-database-url==2.1.0 whitenoise==6.6.0 django-filter
python manage.py migrate
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
npm install
npm start
```

---

## 🔑 Test Accounts

- **Admin**: `admin@example.com` / `admin123`
- **Teacher**: `teacher@example.com` / `teacher123`  
- **Student**: `student@example.com` / `student123`

---

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

---

## ⚠️ Common Fixes

**"python: command not found"** → Use `python3`  
**"ModuleNotFoundError"** → Activate venv: `source venv/bin/activate`  
**Port in use** → Kill process: `lsof -ti:8000 | xargs kill` or use different port

---

*See MANUAL_SETUP_GUIDE.md for detailed instructions*

