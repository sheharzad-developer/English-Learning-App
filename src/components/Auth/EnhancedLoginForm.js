import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SocialAuth from './SocialAuth';
import './EnhancedLoginForm.css';

const EnhancedLoginForm = () => {
  const [formData, setFormData] = useState({
    login: '', // Can be username or email
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.login, formData.password);
      
      // Handle remember me functionality
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
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
        setError('Invalid username/email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError('');
    setIsLoading(true);
    
    // TODO: Implement actual social authentication
    console.log(`Attempting ${provider} login`);
    
    // Placeholder for social login implementation
    setTimeout(() => {
      setError(`${provider} authentication is not yet implemented`);
      setIsLoading(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="enhanced-login-container">
      <div className="enhanced-login-card">
        <div className="login-header">
          <h2 style={{color: '#fff'}}>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && <Alert variant="danger" className="error-alert">{error}</Alert>}
        
        <Form onSubmit={handleLogin} className="login-form">
          <Form.Group className="form-group">
            <Form.Label>Username or Email</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-user"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="login"
                placeholder="Enter your username or email"
                value={formData.login}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                type="button"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="form-options">
            <Form.Check
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <SocialAuth 
          onSocialLogin={handleSocialLogin} 
          disabled={isLoading}
        />

        <div className="auth-links">
          <div className="register-link">
            Don't have an account? <Link to="/register">Create one here</Link>
          </div>
          <div className="admin-link">
            <Link to="/admin/login">
              <i className="fas fa-shield-alt"></i> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginForm;