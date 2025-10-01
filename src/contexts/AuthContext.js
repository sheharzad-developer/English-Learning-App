import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        // Check if it's a demo token (teacher or admin demo)
        if (token.includes('demo_token')) {
          // For demo tokens, use stored user data directly
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
        } else {
          // For real tokens, verify with backend
          const response = await axios.get('http://localhost:8000/api/accounts/profile/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', {
        username: usernameOrEmail, // Send as username field
        email: usernameOrEmail,    // Also send as email field for backend compatibility
        password
      });
      const { access, user } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  // Direct login for demo purposes (bypasses API)
  const loginDirect = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return { success: true };
  };

  const register = async (username, email, password, full_name = '', confirmPassword = '') => {
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', {
        email,
        password,
        password_confirm: confirmPassword || password, // Use confirmPassword if provided, otherwise use password
        full_name,
        role: 'student' // Set default role
      });
      const { access, user } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginDirect,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;