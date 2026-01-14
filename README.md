# 🎓 English Language Learning Application

A comprehensive web-based platform for English language learning built with Django (Backend) and React (Frontend). The application provides interactive, multimedia-rich learning experiences for students at various proficiency levels, with dedicated interfaces for students, teachers, and administrators.

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.2.1-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Test Accounts](#-test-accounts)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality

#### User Management
- **Multi-role System**: Admin, Teacher/Tutor, and Student roles with specific permissions
- **Authentication**: Email-based authentication with JWT tokens
- **Social Login**: Integration with Google and Facebook (via django-allauth)
- **Profile Management**: User profiles with customizable settings

#### Learning Content Management
- **Structured Lessons**: Organized by skill level (Beginner → Advanced) and category
- **Categories**: Grammar, Vocabulary, Listening, Speaking, Writing, Reading
- **Multimedia Integration**: Videos, audio clips, images, and interactive content
- **Progressive Learning**: Prerequisite-based lesson sequencing
- **Content Publishing**: Draft and publish workflow for teachers

#### Interactive Exercises
- **Multiple Exercise Types**:
  - Multiple-choice questions (MCQ)
  - Fill-in-the-blank exercises
  - Matching exercises
  - Essay writing with automated feedback
  - Speaking practice with speech recognition
  - Listening comprehension exercises
- **Automated Grading**: Instant feedback for objective exercises
- **Grammar Checking**: Integration with LanguageTool API
- **Speech Recognition**: Web Speech API for pronunciation practice

#### Progress Tracking & Analytics
- **Personal Dashboard**: Track lessons completed, scores, and time spent
- **Performance Analytics**: Visual charts and statistics
- **Achievement System**: Badges, points, and streaks (gamification)
- **Teacher Monitoring**: Student progress tracking and analytics
- **Admin Analytics**: System-wide usage statistics

#### Role-Specific Dashboards
- **Student Dashboard**: Lesson access, progress overview, achievements
- **Teacher Dashboard**: Content creation, student monitoring, assignment management
- **Admin Dashboard**: User management, content moderation, system configuration

---

## 🛠 Technology Stack

### Backend
- **Framework**: Django 5.2.1
- **API**: Django REST Framework 3.16.0
- **Authentication**: JWT (djangorestframework-simplejwt 5.5.0)
- **Social Auth**: django-allauth 65.11.0
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Server**: Gunicorn 21.2.0 (Production)
- **CORS**: django-cors-headers 4.7.0

### Frontend
- **Framework**: React 19.1.0
- **UI Libraries**: 
  - Material-UI (@mui/material) 7.1.0
  - Bootstrap 5.3.6
  - React-Bootstrap 2.10.10
- **State Management**: Redux 5.0.1
- **Routing**: React Router DOM 6.30.1
- **HTTP Client**: Axios 1.9.0
- **Charts**: Chart.js 4.5.0, Recharts 3.0.2
- **Icons**: FontAwesome, Bootstrap Icons, React Icons

### External Services
- **Speech Recognition**: Web Speech API (browser-native)
- **Grammar Checking**: LanguageTool API
- **Media Storage**: Local storage (Development) / AWS S3 (Production)

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm, pip
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- Git

### Fast Setup

**Backend (Terminal 1):**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python create_test_users.py  # Optional: Create test accounts
python manage.py runserver
```

**Frontend (Terminal 2):**
```bash
npm install
npm start
```

**Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

📖 **For detailed setup instructions, see [QUICK_START.md](documentation/QUICK_START.md) or [MANUAL_SETUP_GUIDE.md](documentation/MANUAL_SETUP_GUIDE.md)**

---

## 📦 Installation

### Detailed Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd English-Learning-App
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create test users (optional)
python create_test_users.py

# Start development server
python manage.py runserver
```

#### 3. Frontend Setup

```bash
# From project root directory
npm install

# Start development server
npm start
```

#### 4. Verify Installation

1. Backend should be running on http://localhost:8000
2. Frontend should be running on http://localhost:3000
3. Access the admin panel at http://localhost:8000/admin
4. Use test accounts to log in (see [Test Accounts](#-test-accounts))

---

## 📁 Project Structure

```
English-Learning-App/
├── backend/                    # Django Backend
│   ├── accounts/              # User management & authentication
│   │   ├── models.py         # Custom user model
│   │   ├── views.py          # Authentication views
│   │   ├── serializers.py    # API serializers
│   │   └── urls.py           # Authentication URLs
│   ├── learning/             # Learning content models
│   │   ├── models.py         # Lesson, Exercise models
│   │   ├── views.py          # Content views
│   │   └── serializers.py    # Content serializers
│   ├── lessons/              # Lesson management
│   ├── users/                # User profiles
│   ├── backend/              # Django settings & configuration
│   │   ├── settings.py       # Project settings
│   │   └── urls.py           # Main URL configuration
│   ├── manage.py             # Django management script
│   ├── requirements.txt      # Python dependencies
│   ├── create_test_users.py  # Script to create test users
│   └── db.sqlite3            # SQLite database (development)
│
├── src/                       # React Frontend
│   ├── components/           # Reusable UI components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard components
│   │   └── admin/           # Admin-specific components
│   ├── pages/               # Page components
│   ├── services/            # API service functions
│   ├── contexts/            # React contexts (Auth, Theme)
│   ├── utils/               # Utility functions
│   └── styles/              # CSS styles
│
├── public/                   # Static assets
├── __tests__/               # Test files
├── documentation/           # Project documentation
│   ├── QUICK_START.md      # Quick start guide
│   ├── MANUAL_SETUP_GUIDE.md  # Detailed setup instructions
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── PROJECT_INTRODUCTION_AND_ANALYSIS.md  # Project documentation
│   └── ...                  # Other documentation files
├── package.json             # Node.js dependencies
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile              # Docker configuration
└── README.md               # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register/` | User registration |
| POST | `/api/users/login/` | User login (returns JWT tokens) |
| POST | `/api/users/logout/` | User logout |
| GET | `/api/users/profile/` | Get user profile |
| PUT | `/api/users/profile/` | Update user profile |
| POST | `/api/users/password/reset/` | Password reset request |
| POST | `/api/users/password/reset/confirm/` | Password reset confirmation |

### Learning Content Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/` | List all lessons |
| GET | `/api/lessons/{id}/` | Get specific lesson |
| POST | `/api/lessons/` | Create lesson (Teacher/Admin only) |
| PUT | `/api/lessons/{id}/` | Update lesson (Teacher/Admin only) |
| DELETE | `/api/lessons/{id}/` | Delete lesson (Teacher/Admin only) |
| GET | `/api/lessons/{id}/exercises/` | Get exercises for a lesson |
| POST | `/api/lessons/{id}/progress/` | Update learning progress |

### Exercise Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises/` | List all exercises |
| GET | `/api/exercises/{id}/` | Get specific exercise |
| POST | `/api/exercises/{id}/submit/` | Submit exercise answers |
| GET | `/api/exercises/{id}/results/` | Get exercise results |
| POST | `/api/exercises/` | Create exercise (Teacher/Admin only) |

### Progress & Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/` | Get user progress |
| GET | `/api/progress/stats/` | Get progress statistics |
| GET | `/api/analytics/student/` | Student analytics (Student only) |
| GET | `/api/analytics/teacher/` | Teacher analytics (Teacher/Admin only) |
| GET | `/api/analytics/admin/` | Admin analytics (Admin only) |

**Note**: All API endpoints require JWT authentication except registration and login. Include the token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

For detailed API documentation, access the Django REST Framework browsable API at http://localhost:8000/api/ when the server is running.

---

## 👥 Test Accounts

The application includes pre-configured test accounts for each role:

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Access**: Full system administration, user management, content moderation

### Teacher Account
- **Email**: `teacher@example.com`
- **Password**: `teacher123`
- **Access**: Content creation, student monitoring, assignment management

### Student Account
- **Email**: `student@example.com`
- **Password**: `student123`
- **Access**: Learning content, exercises, progress tracking

### Creating Test Users

If test users don't exist, run:
```bash
cd backend
python create_test_users.py
```

---

## 💻 Development

### Running Tests

**Frontend Tests:**
```bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage
npm run test:watch          # Run tests in watch mode
```

**Backend Tests:**
```bash
cd backend
python manage.py test
```

### Code Style

- **Python**: Follow PEP 8 style guide
- **JavaScript**: ESLint configuration included
- **Formatting**: Use consistent indentation (4 spaces for Python, 2 spaces for JavaScript)

### Environment Variables

Create a `.env` file in the `backend` directory for local development:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///db.sqlite3
```

### Database Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# View migration status
python manage.py showmigrations
```

### Static Files

```bash
# Collect static files (production)
python manage.py collectstatic
```

---

## 🚢 Deployment

### Docker Deployment

The project includes Docker and Docker Compose configuration for easy deployment.

**Quick Deployment:**
```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh deploy
```

**Deployment Commands:**
```bash
./deploy.sh start      # Start services
./deploy.sh stop       # Stop services
./deploy.sh restart    # Restart services
./deploy.sh logs       # View logs
./deploy.sh status     # Check status
./deploy.sh migrate    # Run migrations
./deploy.sh superuser  # Create admin user
```

📖 **For detailed deployment instructions, see [DEPLOYMENT.md](documentation/DEPLOYMENT.md)**

### Production Considerations

1. **Environment Variables**: Set `DEBUG=False` in production
2. **Secret Key**: Generate a strong secret key
3. **Database**: Use PostgreSQL instead of SQLite
4. **Static Files**: Configure proper static file serving (Nginx, CDN)
5. **SSL/HTTPS**: Enable HTTPS with SSL certificates
6. **Security**: Configure CORS, allowed hosts, and security headers
7. **Backups**: Set up automated database backups
8. **Monitoring**: Configure logging and error tracking

---

## 📚 Documentation

The project includes comprehensive documentation in the `documentation/` folder:

- **[QUICK_START.md](documentation/QUICK_START.md)**: Fast setup guide
- **[MANUAL_SETUP_GUIDE.md](documentation/MANUAL_SETUP_GUIDE.md)**: Detailed installation instructions
- **[DEPLOYMENT.md](documentation/DEPLOYMENT.md)**: Deployment guide with Docker
- **[PROJECT_INTRODUCTION_AND_ANALYSIS.md](documentation/PROJECT_INTRODUCTION_AND_ANALYSIS.md)**: Complete project documentation
- **[DATABASE_SCHEMA.md](documentation/DATABASE_SCHEMA.md)**: Database schema documentation
- **[VIVA_PREPARATION_GUIDE.md](documentation/VIVA_PREPARATION_GUIDE.md)**: Viva preparation guide
- **[VIVA_QUICK_REFERENCE.md](documentation/VIVA_QUICK_REFERENCE.md)**: Quick reference for viva
- **[SUBMISSION_CHECKLIST.md](documentation/SUBMISSION_CHECKLIST.md)**: Submission checklist
- **[DEPLOYMENT_CHECKLIST.md](documentation/DEPLOYMENT_CHECKLIST.md)**: Deployment checklist
- **[PROCESS_MODEL_DIAGRAM.md](documentation/PROCESS_MODEL_DIAGRAM.md)**: Process model diagrams
- **[Prototype_Phase_Documentation.md](documentation/Prototype_Phase_Documentation.md)**: Prototype phase documentation
- **[PURPOSE_OF_PROJECT.md](documentation/PURPOSE_OF_PROJECT.md)**: Project purpose and objectives
- **[PREFACE.md](documentation/PREFACE.md)**: Project preface
- **[DEDICATION.md](documentation/DEDICATION.md)**: Project dedication
- **[ACKNOWLEDGMENT.md](documentation/ACKNOWLEDGMENT.md)**: Acknowledgments

---

## 🎯 Key Features Implemented

### ✅ Phase 1: Core Features (Completed)

- [x] User registration and authentication (email + social)
- [x] Role-based access control (Admin, Teacher, Student)
- [x] Structured lesson management by category and skill level
- [x] Multimedia content integration (videos, audio, images)
- [x] Multiple exercise types (MCQ, fill-in-blank, matching, essay, speaking, listening)
- [x] Automated grading and feedback
- [x] Speech recognition for pronunciation practice
- [x] Grammar checking for written submissions
- [x] Progress tracking and analytics
- [x] Role-specific dashboards
- [x] Content creation and management tools for teachers
- [x] Student progress monitoring for teachers

### 🔄 Phase 2: Advanced Features (Future)

- [ ] Advanced gamification (badges, leaderboards, streaks)
- [ ] Live video sessions between teachers and students
- [ ] Peer-to-peer interaction forums
- [ ] Mobile application (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] AI-powered personalized recommendations

---

## 🤝 Contributing

This is an academic project, but contributions and suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for academic purposes as part of a final year project. All rights reserved.

---

## 📞 Support

For questions, issues, or support:

- **Documentation**: Check the documentation files in the `documentation/` folder
- **Issues**: Open an issue in the repository
- **Email**: [Your Email]
- **Student ID**: [Your Student ID]

---

## 🙏 Acknowledgments

- Django and Django REST Framework communities
- React and Material-UI teams
- All open-source contributors whose libraries made this project possible
- Educational technology research that informed the design

---

## 📊 Project Status

**Current Version**: 0.1.0 (Prototype Phase)

**Status**: ✅ Core features implemented and tested

**Next Steps**:
- User testing and feedback collection
- Performance optimization
- Advanced feature implementation
- Mobile app development

---

**Note**: This is a prototype phase implementation covering the first half of functional requirements. The complete project will include all functional requirements after the prototype phase viva.

---

*Last Updated: 2024*
