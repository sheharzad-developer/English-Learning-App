# 🌍 SkillUp English – AI-Powered, Gamified Language Learning Platform

## 📖 Overview
SkillUp English is a **full-stack web application** designed to help learners improve their English through **self-paced, gamified learning modules**. The platform integrates AI, interactive exercises, real-time analytics, and collaborative tools — offering a personalized, engaging, and results-driven language learning experience.

This project was developed as part of the Final Year Project (CS619) under the supervision of **Sir Haseeb Akmal**.

---

## 🚀 Key Features

### 👨‍🎓 For Students
- 📚 **Structured Lessons**: Grammar, Vocabulary, Speaking, Writing & Listening
- 🧠 **AI-Powered Exercises**: Smart quiz generation and correction feedback
- 🏆 **Gamification**: Points, badges, leaderboards, and streaks
- 📈 **Progress Dashboard**: Line/bar/pie charts to visualize improvements
- 👤 **Editable Profile Page**: Upload picture, change info, track performance
- 💬 **Peer Chat & Discussions**: Collaborate and communicate with peers
- 📅 **Live Sessions**: Book & join speaking practice sessions

### 👩‍🏫 For Teachers
- 🧑‍🏫 Create Lessons & Exercises  
- 👨‍👩‍👧 Monitor Student Performance  
- 📊 View Analytics on Learner Progress

### 🛠️ For Admin
- 🔐 Manage Users (Students, Teachers)  
- 📊 View Overall App Stats  
- 💡 Approve Content & Moderate Forums

---

## 💻 Tech Stack

### 🖥️ Frontend
- **React** + **Bootstrap 5**
- Axios, Chart.js, Recharts

### ⚙️ Backend
- **Python** + **Django REST Framework**
- Custom User Authentication (JWT)
- Role-Based Access (Student/Teacher/Admin)

### 🗄️ Database
- **PostgreSQL** (Relational DB)

### ☁️ Deployment
- **Vercel** – Frontend Hosting  
- **Render** – Django + PostgreSQL Deployment  

---

## 🔧 Installation & Setup (Local Development)

```bash
# Backend (Django)
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (React)
cd frontend
npm install
npm run dev
