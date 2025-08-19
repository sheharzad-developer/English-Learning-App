import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const role = user?.role || localStorage.getItem('role');
      
      let endpoint = '';
      switch (role) {
        case 'admin':
          endpoint = 'http://127.0.0.1:8000/api/admin/dashboard/';
          break;
        case 'teacher':
          endpoint = 'http://127.0.0.1:8000/api/teacher/dashboard/';
          break;
        case 'student':
          endpoint = 'http://127.0.0.1:8000/api/student/dashboard/';
          break;
        default:
          endpoint = 'http://127.0.0.1:8000/api/accounts/profile/';
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      // Set fallback data
      setDashboardData({
        user: user || {},
        statistics: {},
        message: 'Welcome to your dashboard!'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'teacher': return 'warning';
      case 'student': return 'primary';
      default: return 'secondary';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  if (loading) {
    return (
      <Container className="enhanced-dashboard-container py-5 text-center">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );
  }

  const role = user?.role || localStorage.getItem('role');
  const userName = user?.full_name || user?.username || 'User';

  return (
    <Container className="enhanced-dashboard-container py-4">
      {error && (
        <Alert variant="warning" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Welcome Header */}
      <div className="dashboard-header mb-4">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="welcome-section">
              <h1 className="welcome-title">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="welcome-subtitle">
                Welcome to your {role} dashboard. Here's what's happening today.
              </p>
              <Badge bg={getRoleColor(role)} className="role-badge">
                {role?.toUpperCase()}
              </Badge>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <div className="user-avatar">
              <div className="avatar-circle">
                {getInitials(userName)}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Role-specific Dashboard Content */}
      {role === 'admin' && <AdminDashboardContent data={dashboardData} navigate={navigate} />}
      {role === 'teacher' && <TeacherDashboardContent data={dashboardData} navigate={navigate} />}
      {role === 'student' && <StudentDashboardContent data={dashboardData} navigate={navigate} />}
      
      {/* Quick Actions */}
      <Card className="quick-actions-card mt-4">
        <Card.Body>
          <Card.Title className="mb-3">
            <i className="bi bi-lightning-charge me-2"></i>
            Quick Actions
          </Card.Title>
          <Row className="g-3">
            <Col md={3}>
              <Button 
                variant="outline-primary" 
                className="w-100 quick-action-btn"
                onClick={() => navigate('/profile')}
              >
                <i className="bi bi-person me-2"></i>
                View Profile
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-success" 
                className="w-100 quick-action-btn"
                onClick={() => navigate('/settings')}
              >
                <i className="bi bi-gear me-2"></i>
                Settings
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-info" 
                className="w-100 quick-action-btn"
                onClick={() => navigate('/help')}
              >
                <i className="bi bi-question-circle me-2"></i>
                Help & Support
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-warning" 
                className="w-100 quick-action-btn"
                onClick={() => navigate('/notifications')}
              >
                <i className="bi bi-bell me-2"></i>
                Notifications
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Admin Dashboard Content
const AdminDashboardContent = ({ data, navigate }) => {
  const stats = data?.statistics || {};
  
  return (
    <>
      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card stat-card-users">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3 className="stat-number">{stats.total_users || 0}</h3>
              <p className="stat-label">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-students">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-mortarboard-fill"></i>
              </div>
              <h3 className="stat-number">{stats.total_students || 0}</h3>
              <p className="stat-label">Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-teachers">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-person-workspace"></i>
              </div>
              <h3 className="stat-number">{stats.total_teachers || 0}</h3>
              <p className="stat-label">Teachers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-admins">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-shield-fill-check"></i>
              </div>
              <h3 className="stat-number">{stats.total_admins || 0}</h3>
              <p className="stat-label">Admins</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Cards */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="management-card">
            <Card.Body>
              <div className="management-header">
                <div className="management-icon bg-primary">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <Card.Title>User Management</Card.Title>
                  <p className="text-muted">Manage users, roles, and permissions</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => navigate('/admin/users')}
                className="w-100 mt-3"
              >
                Manage Users
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="management-card">
            <Card.Body>
              <div className="management-header">
                <div className="management-icon bg-success">
                  <i className="bi bi-book"></i>
                </div>
                <div>
                  <Card.Title>Content Management</Card.Title>
                  <p className="text-muted">Create and manage learning content</p>
                </div>
              </div>
              <Button 
                variant="success" 
                onClick={() => navigate('/admin/content')}
                className="w-100 mt-3"
              >
                Manage Content
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

// Teacher Dashboard Content
const TeacherDashboardContent = ({ data, navigate }) => {
  const stats = {
    total_students: data?.total_students || 0,
    lessons_created: 5,
    assignments_pending: 3,
    submissions_to_review: 8
  };
  
  return (
    <>
      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card stat-card-students">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3 className="stat-number">{stats.total_students}</h3>
              <p className="stat-label">My Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-lessons">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-journal-text"></i>
              </div>
              <h3 className="stat-number">{stats.lessons_created}</h3>
              <p className="stat-label">Lessons Created</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-assignments">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <h3 className="stat-number">{stats.assignments_pending}</h3>
              <p className="stat-label">Pending Assignments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-reviews">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-eye-fill"></i>
              </div>
              <h3 className="stat-number">{stats.submissions_to_review}</h3>
              <p className="stat-label">To Review</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Teacher Actions */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="management-card">
            <Card.Body>
              <div className="management-header">
                <div className="management-icon bg-primary">
                  <i className="bi bi-plus-circle"></i>
                </div>
                <div>
                  <Card.Title>Create Lesson</Card.Title>
                  <p className="text-muted">Design new learning content for students</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => navigate('/teacher/create-lesson')}
                className="w-100 mt-3"
              >
                Create New Lesson
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="management-card">
            <Card.Body>
              <div className="management-header">
                <div className="management-icon bg-warning">
                  <i className="bi bi-clipboard-data"></i>
                </div>
                <div>
                  <Card.Title>Student Progress</Card.Title>
                  <p className="text-muted">Monitor and track student performance</p>
                </div>
              </div>
              <Button 
                variant="warning" 
                onClick={() => navigate('/teacher/progress')}
                className="w-100 mt-3"
              >
                View Progress
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

// Student Dashboard Content
const StudentDashboardContent = ({ data, navigate }) => {
  const stats = {
    lessons_completed: 12,
    quizzes_taken: 8,
    current_streak: 5,
    total_points: 450,
    progress_percentage: 65
  };
  
  return (
    <>
      {/* Progress Overview */}
      <Card className="progress-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-3">Your Learning Progress</h5>
              <ProgressBar 
                now={stats.progress_percentage} 
                label={`${stats.progress_percentage}%`}
                className="progress-bar-custom"
              />
              <p className="mt-2 text-muted">
                Keep going! You're making excellent progress on your English learning journey.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <div className="progress-illustration">
                <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '4rem' }}></i>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card stat-card-lessons">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-journal-check"></i>
              </div>
              <h3 className="stat-number">{stats.lessons_completed}</h3>
              <p className="stat-label">Lessons Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-quizzes">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-patch-question"></i>
              </div>
              <h3 className="stat-number">{stats.quizzes_taken}</h3>
              <p className="stat-label">Quizzes Taken</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-streak">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-fire"></i>
              </div>
              <h3 className="stat-number">{stats.current_streak}</h3>
              <p className="stat-label">Day Streak</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-card-points">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="bi bi-star-fill"></i>
              </div>
              <h3 className="stat-number">{stats.total_points}</h3>
              <p className="stat-label">Total Points</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Learning Actions */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="management-card">
            <Card.Body>
              <div className="management-header">
                <div className="management-icon bg-success">
                  <i className="bi bi-play-circle"></i>
                </div>
                <div>
                  <Card.Title>Continue Learning</Card.Title>
                  <p className="text-muted">Resume your current lesson or start a new one</p>
                </div>
              </div>
              <Button 
                variant="success" 
                onClick={() => navigate('/learning')}
                className="w-100 mt-3"
              >
                Start Learning
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="management-card">
            <Card.Body>
              <div className="management-header">
                <div className="management-icon bg-info">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div>
                  <Card.Title>View Progress</Card.Title>
                  <p className="text-muted">Track your learning achievements and goals</p>
                </div>
              </div>
              <Button 
                variant="info" 
                onClick={() => navigate('/student/progress')}
                className="w-100 mt-3"
              >
                View Detailed Progress
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EnhancedDashboard;