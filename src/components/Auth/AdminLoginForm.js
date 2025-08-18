import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLoginForm.css';

const AdminLoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      
      // Check if the logged-in user is an admin
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        // Logout the user if they're not an admin
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(errorData);
        }
      } else {
        setError('Invalid admin credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>🔐 Admin Login</h2>
          <p>Access the administrative panel</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="form-group">
            <Form.Label>Admin Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter admin username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Admin Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button 
            variant="dark" 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Login as Admin'}
          </Button>
        </Form>

        <div className="admin-login-footer">
          <p>Need help? Contact system administrator</p>
          <Link to="/login" className="regular-login-link">
            ← Back to Regular Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
