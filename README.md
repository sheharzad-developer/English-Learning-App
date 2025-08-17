# English Language Learning App

## 🎓 Prototype Phase Submission

**Course:** [Your Course Name]  
**Student:** [Your Name]  
**Student ID:** [Your Student ID]  
**Institution:** [Your University]  
**Submission Date:** [Date]

---

## 📋 Project Overview

This is a comprehensive English Language Learning Application built with Django (Backend) and React (Frontend). The application implements the first half of the functional requirements as specified in the prototype phase.

### 🎯 Functional Requirements Implemented

#### ✅ 1. User Management
- **Registration/Login:** Email-based authentication with social media integration
- **User Roles:** Admin, Teacher/Tutor, and Student roles with specific permissions

#### ✅ 2. Learning Content / Structured Lessons
- **Skill Level Organization:** Beginner to advanced content categorization
- **Multimedia Integration:** Interactive videos, audio clips, and flashcards

#### ✅ 3. Interactive Exercises
- **Grammar/Vocabulary Quizzes:** Multiple-choice, fill-in-the-blank, matching exercises
- **Speaking Practice:** Speech recognition and dialogue simulations
- **Writing Practice:** Essay submissions with automated feedback
- **Listening Comprehension:** Audio/video-based exercises

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd english-learning-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   # In a new terminal
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

---

## 👥 Test Users

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full system administration

### Teacher Account
- **Username:** `teacher1`
- **Password:** `teacher123`
- **Access:** Student management, content creation

### Student Account
- **Username:** `student1`
- **Password:** `student123`
- **Access:** Learning content, exercises, progress tracking

---

## 🏗️ Technical Architecture

### Backend (Django)
- **Framework:** Django 5.2.1
- **API:** Django REST Framework
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** SQLite (Development)
- **Key Apps:**
  - `accounts`: User management and authentication
  - `learning`: Learning content management
  - `lessons`: Lesson structure and organization
  - `users`: User profiles and preferences

### Frontend (React)
- **Framework:** React 19.1.0
- **UI Libraries:** Material-UI, Bootstrap
- **State Management:** Redux
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Database Schema
- **Custom User Model:** Extended with role-based permissions
- **Learning Content:** Structured lesson management
- **Progress Tracking:** User learning analytics
- **Exercise System:** Quiz and assessment data

---

## 📁 Project Structure

```
english-learning-app/
├── backend/                 # Django Backend
│   ├── accounts/           # User management & authentication
│   ├── learning/           # Learning content models
│   ├── lessons/            # Lesson management
│   ├── users/              # User profiles
│   ├── backend/            # Django settings & configuration
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   │   ├── Auth/          # Authentication components
│   │   ├── Dashboard/     # Dashboard components
│   │   └── admin/         # Admin-specific components
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
├── public/                # Static assets
├── tests/                 # Test files
├── package.json           # Node.js dependencies
└── README.md             # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/users/login/` - User login
- `POST /api/users/register/` - User registration
- `GET /api/users/profile/` - User profile

### Learning Content
- `GET /api/lessons/` - List all lessons
- `GET /api/lessons/{id}/` - Get specific lesson
- `POST /api/lessons/{id}/progress/` - Update learning progress

### Exercises
- `GET /api/exercises/` - List exercises
- `POST /api/exercises/{id}/submit/` - Submit exercise answers
- `GET /api/exercises/{id}/results/` - Get exercise results

---

## 🎨 Features Demonstration

### 1. User Authentication
- Secure login/registration system
- Role-based access control
- JWT token authentication

### 2. Role-Specific Dashboards
- **Admin Dashboard:** User management, content creation, analytics
- **Teacher Dashboard:** Student progress monitoring, assignment creation
- **Student Dashboard:** Lesson access, progress tracking, exercise completion

### 3. Learning Content Management
- Structured lessons by skill level (Beginner → Advanced)
- Category-based organization (Grammar, Vocabulary, Listening, Speaking)
- Multimedia content integration

### 4. Interactive Learning Exercises
- **Grammar Quizzes:** Multiple-choice and fill-in-the-blank
- **Vocabulary Exercises:** Matching and word association
- **Speaking Practice:** Speech recognition and pronunciation scoring
- **Writing Practice:** Essay submission with automated feedback
- **Listening Comprehension:** Audio/video-based assessments

---

## 🧪 Testing

### Manual Testing
- User registration and login functionality
- Role-based dashboard access
- Learning content display and navigation
- Interactive exercise completion
- Progress tracking system

### Automated Testing
- Unit tests for backend models and views
- Component tests for React frontend
- API endpoint testing
- Authentication flow testing

---

## 📊 Database Information

### Included Files
- Complete SQLite database with sample data
- Database migrations for all models
- Sample user accounts for testing
- Initial learning content and exercises

### Database Schema
- **CustomUser:** Extended user model with roles
- **Lesson:** Learning content structure
- **Exercise:** Quiz and assessment data
- **Progress:** User learning analytics
- **Content:** Multimedia learning materials

---

## 🔧 Configuration

### Environment Variables
- `SECRET_KEY`: Django secret key
- `DEBUG`: Development mode flag
- `DATABASE_URL`: Database connection string
- `CORS_ALLOWED_ORIGINS`: Frontend domain configuration

### Development Settings
- Debug mode enabled for development
- SQLite database for local development
- CORS configured for frontend integration
- JWT token settings configured

---

## 📝 Submission Requirements Met

### ✅ Code Implementation
- [x] Complete application folder structure
- [x] Backend Django application with all required apps
- [x] Frontend React application with modern UI
- [x] Database schema and migrations
- [x] API endpoints for all functionality
- [x] User authentication and authorization
- [x] Role-based access control system

### ✅ Documentation
- [x] Comprehensive README file
- [x] Installation and setup instructions
- [x] API documentation
- [x] Testing credentials and procedures
- [x] Technical architecture overview
- [x] Feature descriptions and demonstrations

### ✅ Database
- [x] Complete database included in project
- [x] Database schema and migration scripts
- [x] Sample data for testing
- [x] User accounts for demonstration

---

## 🚀 Future Development (Final Phase)

The following features will be implemented in the final phase:

1. **Advanced Analytics and Reporting**
2. **Live Session Management**
3. **Peer-to-Peer Interaction**
4. **Gamification Elements**
5. **Mobile Application**
6. **Advanced Assessment Tools**

---

## 📞 Support

For any questions or issues regarding this prototype submission, please contact:

**Developer:** [Your Name]  
**Email:** [Your Email]  
**Student ID:** [Your Student ID]

---

## 📄 License

This project is developed for academic purposes as part of the course requirements.

---

**Note:** This prototype phase implementation covers the first half of the functional requirements as specified. The complete project will include all functional requirements after the prototype phase viva.

