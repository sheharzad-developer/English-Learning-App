# English Learning App

A comprehensive English learning application built with React.js frontend and Django REST API backend.

## 🚀 Features

- **User Authentication**: Secure login/logout system with JWT tokens
- **Role-based Access**: Separate dashboards for Students, Teachers, and Admins
- **Interactive Lessons**: Engaging learning content with progress tracking
- **Achievement System**: Gamified learning experience with badges and rewards
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📁 Project Structure

```
english-learning-app/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── services/          # API service functions
│   └── utils/             # Utility functions
├── backend/               # Django REST API
│   ├── accounts/          # User account management
│   ├── learning/          # Learning progress tracking
│   ├── lessons/           # Lesson content management
│   ├── users/             # User profile management
│   └── backend/           # Django settings and configuration
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Application logic

### Backend
- **Django** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **JWT Authentication** - Secure user authentication
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
The React frontend can be deployed to Vercel, Netlify, or any static hosting service.

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your preferred hosting service.

### Backend Deployment
⚠️ **Important**: The backend cannot be deployed to Vercel due to its server-side nature. Consider these alternatives:

#### Option 1: Railway (Recommended)
- Free tier available
- Easy Django deployment
- Automatic database provisioning

#### Option 2: Heroku
- Free tier discontinued, but affordable paid plans
- Excellent Django support
- Easy deployment with Git

#### Option 3: DigitalOcean App Platform
- Affordable pricing
- Good Django support
- Managed database options

#### Option 4: AWS/GCP/Azure
- More complex setup
- Highly scalable
- Cost-effective for larger applications

## 🔧 Environment Variables

### Frontend
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Backend
Create a `.env` file in the `backend` directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user info

### User Management
- `GET /api/users/` - List users (Admin only)
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user

### Lessons
- `GET /api/lessons/` - List lessons
- `POST /api/lessons/` - Create lesson (Teacher/Admin)
- `GET /api/lessons/{id}/` - Get lesson details
- `PUT /api/lessons/{id}/` - Update lesson

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with basic authentication and lesson management
- **v1.1.0** - Added achievement system and progress tracking
- **v1.2.0** - Enhanced UI/UX and mobile responsiveness

---

**Note**: This is a full-stack application with separate frontend and backend components. The backend requires a proper server environment and cannot be deployed to static hosting services like Vercel.

