import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './TeacherLogin.css';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { loginDirect } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, create a teacher login simulation
      if (formData.email && formData.password) {
        // Simulate teacher authentication
        const teacherUser = {
          id: 2,
          username: formData.email.split('@')[0],
          email: formData.email,
          full_name: formData.email.split('@')[0],
          role: 'teacher',
          permissions: ['create_lessons', 'manage_students', 'conduct_classes', 'grade_assignments'],
          teacher_id: 'TCH001',
          subjects: ['English Language', 'Grammar', 'Vocabulary'],
          experience_years: 5,
          qualifications: ['BA English', 'TEFL Certified']
        };

        const token = 'teacher_demo_token_' + Date.now();

        // Use the direct login method to bypass API
        loginDirect(teacherUser, token);

        navigate('/teacher/dashboard');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      console.error('Teacher login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-login-page">
      <Container fluid className="min-vh-100">
        <Row className="min-vh-100">
          {/* Left Side - Branding */}
          <Col md={6} className="teacher-login-branding d-none d-md-flex">
            <div className="branding-content">
              <div className="branding-header">
                <h1 className="branding-title">
                  <i className="fas fa-chalkboard-teacher me-3"></i>
                  Teacher Portal
                </h1>
                <p className="branding-subtitle">
                  Empower your students with engaging online English lessons
                </p>
              </div>
              
              <div className="feature-highlights">
                <div className="feature-item">
                  <i className="fas fa-video text-primary"></i>
                  <div>
                    <h5>Conduct Live Classes</h5>
                    <p>Host video conferences and interactive sessions</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <i className="fas fa-tasks text-success"></i>
                  <div>
                    <h5>Create Assignments</h5>
                    <p>Design quizzes, essays, and learning materials</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <i className="fas fa-chart-bar text-warning"></i>
                  <div>
                    <h5>Track Performance</h5>
                    <p>Monitor student progress and analytics</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <i className="fas fa-graduation-cap text-info"></i>
                  <div>
                    <h5>Manage Students</h5>
                    <p>Grade assignments and provide feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col md={6} className="teacher-login-form-section">
            <div className="login-form-container">
              <div className="text-center mb-4">
                <div className="login-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <h2 className="login-title">Teacher Login</h2>
                <p className="login-subtitle text-muted">
                  Access your teaching dashboard and manage your classes
                </p>
              </div>

              <Card className="login-card">
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger" className="mb-3">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-envelope me-2"></i>
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="teacher-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-lock me-2"></i>
                        Password
                      </Form.Label>
                      <div className="password-input-group">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                          className="teacher-input"
                        />
                        <Button
                          variant="outline-secondary"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </Button>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        className="remember-check"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 teacher-login-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In to Dashboard
                        </>
                      )}
                    </Button>
                  </Form>

                  <div className="login-links mt-4">
                    <div className="text-center">
                      <Link to="/forgot-password" className="forgot-link">
                        <i className="fas fa-key me-1"></i>
                        Forgot Password?
                      </Link>
                    </div>
                    
                    <hr className="my-3" />
                    
                    <div className="text-center">
                      <p className="mb-2 text-muted">Not a teacher?</p>
                      <Link to="/login" className="student-link me-3">
                        <i className="fas fa-user-graduate me-1"></i>
                        Student Login
                      </Link>
                      <Link to="/admin/login" className="admin-link">
                        <i className="fas fa-user-shield me-1"></i>
                        Admin Login
                      </Link>
                    </div>
                  </div>

                  {/* Demo Credentials */}
                  <div className="demo-credentials mt-4">
                    <Alert variant="info" className="mb-0">
                      <h6><i className="fas fa-info-circle me-2"></i>Demo Login</h6>
                      <p className="mb-2">Use any email and password to access the teacher dashboard</p>
                      <small className="text-muted">
                        Example: teacher@demo.com / password123
                      </small>
                    </Alert>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TeacherLogin;
