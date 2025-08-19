import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import SocialAuth from './SocialAuth';
import './EnhancedRegister.css';

const EnhancedRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
    password2: '',
    role: 'student',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'danger';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setError("Please choose a stronger password");
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/register/', {
        email: formData.email,
        username: formData.username,
        full_name: formData.fullName,
        password1: formData.password,
        password2: formData.password2,
        role: formData.role,
      });
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setLoading(false);
      if (err.response?.data) {
        console.error('Registration error details:', err.response.data);
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(errorData);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleSocialRegister = (provider) => {
    setError('');
    setLoading(true);
    
    // TODO: Implement actual social authentication
    console.log(`Attempting ${provider} registration`);
    
    // Placeholder for social registration implementation
    setTimeout(() => {
      setError(`${provider} registration is not yet implemented`);
      setLoading(false);
    }, 1000);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowPassword2(!showPassword2);
    }
  };

  return (
    <Container className="enhanced-register-container d-flex align-items-center justify-content-center min-vh-100">
      <Card className="enhanced-register-card shadow-lg w-100" style={{ maxWidth: '500px' }}>
        <Card.Body className="p-4">
          <div className="register-header text-center mb-4">
            <h2 className="fw-bold text-primary">Create Account</h2>
            <p className="text-muted">Join us and start your learning journey</p>
          </div>

          {error && <Alert variant="danger" className="error-alert">{error}</Alert>}
          {success && <Alert variant="success" className="success-alert">{success}</Alert>}
          
          <Form onSubmit={handleRegister} autoComplete="off">
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="fas fa-envelope"></i></InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  required
                  autoComplete="email"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="fas fa-user"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  required
                  autoComplete="username"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicFullName" className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="fas fa-id-card"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  name="fullName"
                  required
                  autoComplete="name"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicRole" className="mb-3">
              <Form.Label className="fw-semibold">Role</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="fas fa-user-tag"></i></InputGroup.Text>
                <Form.Select 
                  value={formData.role} 
                  onChange={handleChange}
                  name="role"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="fas fa-lock"></i></InputGroup.Text>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  required
                  autoComplete="new-password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('password')}
                  className="password-toggle"
                  type="button"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </Button>
              </InputGroup>
              {formData.password && (
                <div className="password-strength mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">Password Strength:</small>
                    <small className={`text-${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </small>
                  </div>
                  <ProgressBar 
                    variant={getPasswordStrengthColor()} 
                    now={passwordStrength} 
                    style={{ height: '4px' }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicPassword2" className="mb-3">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="fas fa-lock"></i></InputGroup.Text>
                <Form.Control
                  type={showPassword2 ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.password2}
                  onChange={handleChange}
                  name="password2"
                  required
                  autoComplete="new-password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('password2')}
                  className="password-toggle"
                  type="button"
                >
                  <i className={`fas ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </Button>
              </InputGroup>
              {formData.password2 && formData.password !== formData.password2 && (
                <small className="text-danger mt-1 d-block">
                  Passwords do not match
                </small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                label={
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" target="_blank">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank">Privacy Policy</Link>
                  </span>
                }
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold register-btn"
              disabled={loading || !formData.agreeToTerms}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Form>

          <SocialAuth 
            onSocialLogin={handleSocialRegister} 
            disabled={loading}
            showText={true}
          />

          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-primary fw-semibold">Sign in here</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EnhancedRegister;