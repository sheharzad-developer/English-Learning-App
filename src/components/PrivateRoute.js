import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // e.g., 'admin' or 'student'

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />; // Redirect non-admin users
  }

  return children;
};

export default PrivateRoute;
