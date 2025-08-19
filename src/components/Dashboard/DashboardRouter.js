import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EnhancedDashboard from './EnhancedDashboard';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import DashboardLayout from './DashboardLayout';

const DashboardRouter = ({ useEnhanced = true }) => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get user role from context or localStorage
  const userRole = user?.role || localStorage.getItem('role');

  // If no role is found, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Use enhanced dashboard by default, fallback to role-specific dashboards
  if (useEnhanced) {
    return (
      <DashboardLayout>
        <EnhancedDashboard />
      </DashboardLayout>
    );
  }

  // Legacy role-specific dashboard routing
  const renderDashboard = () => {
    switch (userRole.toLowerCase()) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default DashboardRouter;