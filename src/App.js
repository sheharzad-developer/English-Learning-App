import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './Layout/Layout';
import LessonDetail from './pages/LessonDetail';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import TeacherLogin from './pages/TeacherLogin';
import PrivateRoute from './components/PrivateRoute';
import AppNavbar from './components/Navbar';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import TeacherDashboardPage from './pages/TeacherDashboard';
import UserManagement from './components/admin/UserManagement';
import ContentManager from './components/admin/ContentManager';
import About from './pages/About';
import Learning from './pages/Learning';
import Progress from './pages/Progress';
import { applyBraveFixes } from './utils/browserDetection';
import './styles/theme.css';

function App() {
  useEffect(() => {
    // Apply Brave browser fixes on component mount
    applyBraveFixes();
  }, []);

  return (
    <ThemeProvider>
      <Layout>
        <AppNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/lessons"
            element={
              <PrivateRoute>
                <Lessons />
              </PrivateRoute>
            }
          />
          <Route
            path="/lessons/:id"
            element={
              <PrivateRoute>
                <LessonDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <PrivateRoute>
                <Achievements />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <PrivateRoute>
                <Challenges />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute requiredRole={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requiredRole={['admin']}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute requiredRole={['teacher']}>
                <TeacherDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/lessons"
            element={
              <PrivateRoute requiredRole={['admin']}>
                <ContentManager />
              </PrivateRoute>
            }
          />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:lessonId" element={<LessonDetail />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <Progress />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
