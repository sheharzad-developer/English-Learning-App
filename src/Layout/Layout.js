import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2025 English Learning App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 