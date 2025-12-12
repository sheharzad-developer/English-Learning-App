# 📝 Manual Setup Guide - English Learning App

**Use this guide when you need to run the project without Cursor or any IDE.**

---

## ✅ Prerequisites

Before starting, make sure you have installed:
- **Python 3.11+** (check with: `python3 --version`)
- **Node.js 18+** (check with: `node --version`)
- **npm** (comes with Node.js, check with: `npm --version`)

---

## 🚀 Step-by-Step Setup Instructions

### PART 1: Backend Setup (Django)

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
```

#### Step 3: Activate Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

*You'll know it's activated when you see `(venv)` at the start of your terminal prompt.*

#### Step 4: Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Note:** If `psycopg2-binary` fails to install (it's only needed for PostgreSQL), you can skip it for local development since the project uses SQLite. Install the rest manually:

```bash
pip install Django==5.2.1 djangorestframework==3.16.0 django-cors-headers==4.7.0 django-allauth==65.11.0 dj-rest-auth==7.0.1 djangorestframework-simplejwt==5.5.0 requests==2.32.5 cryptography==45.0.6 gunicorn==21.2.0 dj-database-url==2.1.0 whitenoise==6.6.0 django-filter
```

#### Step 5: Run Database Migrations
```bash
python manage.py migrate
```

#### Step 6: (Optional) Create Test Users
```bash
python create_test_users.py
```

This creates:
- **Admin**: `admin@example.com` / `admin123`
- **Teacher**: `teacher@example.com` / `teacher123`
- **Student**: `student@example.com` / `student123`

#### Step 7: Start Django Server
```bash
python manage.py runserver
```

**The backend will run on:** http://localhost:8000

**Keep this terminal window open!** The server needs to keep running.

---

### PART 2: Frontend Setup (React)

#### Step 1: Open a NEW Terminal Window
**Important:** Keep the backend terminal running, open a new terminal for the frontend.

#### Step 2: Navigate to Project Root
```bash
cd /path/to/English-Learning-App
```
*(Replace with your actual project path)*

#### Step 3: Install Node Dependencies
```bash
npm install
```

*This may take a few minutes the first time.*

#### Step 4: Start React Development Server
```bash
npm start
```

**The frontend will run on:** http://localhost:3000

*Your browser should automatically open to this address.*

---

## 🎯 Quick Start Commands (After Initial Setup)

Once everything is set up, you only need these commands:

### Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 (Frontend):
```bash
cd /path/to/English-Learning-App
npm start
```

---

## 🌐 Access Points

Once both servers are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

---

## 🔧 Troubleshooting

### Backend Issues:

**Problem:** `ModuleNotFoundError: No module named 'django'`
- **Solution:** Make sure virtual environment is activated and dependencies are installed
  ```bash
  source venv/bin/activate
  pip install -r requirements.txt
  ```

**Problem:** `python: command not found`
- **Solution:** Use `python3` instead of `python`
  ```bash
  python3 manage.py runserver
  ```

**Problem:** Port 8000 already in use
- **Solution:** Use a different port
  ```bash
  python manage.py runserver 8001
  ```
  *(Then update frontend API URL if needed)*

**Problem:** Database migration errors
- **Solution:** Delete `db.sqlite3` and re-run migrations
  ```bash
  rm db.sqlite3
  python manage.py migrate
  ```

### Frontend Issues:

**Problem:** `npm: command not found`
- **Solution:** Install Node.js from https://nodejs.org/

**Problem:** Port 3000 already in use
- **Solution:** React will ask if you want to use a different port (press Y)

**Problem:** `npm install` fails
- **Solution:** Delete `node_modules` and `package-lock.json`, then retry
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem:** Frontend can't connect to backend
- **Solution:** Make sure backend is running on port 8000
- Check `src/services/` files for API URL configuration

---

## 📋 Checklist for Campus Demo

Before going to campus, verify:

- [ ] Backend dependencies installed (`pip list` shows Django)
- [ ] Frontend dependencies installed (`node_modules` folder exists)
- [ ] Database migrations completed (`db.sqlite3` exists)
- [ ] Test users created (can login with test accounts)
- [ ] Both servers start without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:8000/api/

---

## 💡 Tips for Campus

1. **Test Everything First**: Run the project at home before going to campus
2. **Bring Both Terminals**: You'll need 2 terminal windows open
3. **Internet May Be Needed**: For npm install if dependencies aren't cached
4. **Have Test Credentials Ready**: Write down the test user emails/passwords
5. **Backup Plan**: If virtual environment doesn't work, you can install packages globally (not recommended but works in a pinch)

---

## 🆘 Emergency Commands

If something goes wrong, try these in order:

### Reset Backend:
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

### Reset Frontend:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check What's Running:
```bash
# See what's using port 8000
lsof -i :8000

# See what's using port 3000
lsof -i :3000
```

---

## 📞 Quick Reference

**Backend Directory:** `backend/`  
**Frontend Directory:** Root directory (where `package.json` is)  
**Database File:** `backend/db.sqlite3`  
**Virtual Environment:** `backend/venv/`  
**Node Modules:** `node_modules/` (in root)

---

**Good luck with your campus demo! 🎓**

