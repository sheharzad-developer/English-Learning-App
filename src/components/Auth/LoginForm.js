import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    login: '', // Can be username or email
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

  const handleSocialLogin = (provider) => {
    // Placeholder for social login implementation
    console.log(`Social login with ${provider}`);
    // TODO: Implement social authentication
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.login, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(errorData);
        }
      } else {
        setError('Invalid username or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="form-group">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              name="login"
              placeholder="Enter your username or email"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <Button 
            variant="outline-danger" 
            className="social-btn google-btn"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <i className="fab fa-google"></i> Continue with Google
          </Button>
          <Button 
            variant="outline-primary" 
            className="social-btn facebook-btn"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <i className="fab fa-facebook-f"></i> Continue with Facebook
          </Button>
        </div>

        <div className="test-credentials">
          <h6>Test Credentials:</h6>
          <div className="credentials-list">
            <small><strong>Admin:</strong> admin@example.com / admin123</small><br/>
            <small><strong>Teacher:</strong> teacher@example.com / teacher123</small><br/>
            <small><strong>Student:</strong> student@example.com / student123</small>
          </div>
        </div>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
        <div className="admin-link">
          <Link to="/admin/login">🔐 Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
