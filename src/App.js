import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import LessonDetail from './pages/LessonDetail';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AppNavbar from './components/Navbar';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import About from './pages/About';
import Learning from './pages/Learning';

function App() {
  return (
    <Layout>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:lessonId" element={<LessonDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default App;
