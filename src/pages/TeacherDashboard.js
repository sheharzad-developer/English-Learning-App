import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentPerformanceMonitor from '../components/Teacher/StudentPerformanceMonitor';
import LessonManager from '../components/Teacher/LessonManager';
import VideoClassroom from '../components/Teacher/VideoClassroom';
import AssignmentCreator from '../components/Teacher/AssignmentCreator';
import EssayGrader from '../components/Teacher/EssayGrader';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a teacher
    if (!user || user.role !== 'teacher') {
      navigate('/teacher/login');
      return;
    }

    // Load teacher data
    loadTeacherData();
  }, [user, navigate]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading teacher data
      setTimeout(() => {
        const mockTeacherData = {
          id: user.id,
          name: user.full_name || user.email.split('@')[0],
          email: user.email,
          teacherId: user.teacher_id || 'TCH001',
          subjects: user.subjects || ['English Language', 'Grammar'],
          totalStudents: 45,
          activeClasses: 3,
          totalLessons: 28,
          averageGrade: 85,
          upcomingClasses: [
            {
              id: 1,
              title: 'Advanced Grammar Session',
              time: '10:00 AM',
              date: 'Today',
              students: 15,
              type: 'live'
            },
            {
              id: 2,
              title: 'Vocabulary Building',
              time: '2:00 PM',
              date: 'Tomorrow',
              students: 12,
              type: 'scheduled'
            }
          ],
          recentActivities: [
            {
              id: 1,
              type: 'lesson_created',
              message: 'Created new lesson: "Past Perfect Tense"',
              time: '2 hours ago'
            },
            {
              id: 2,
              type: 'assignment_graded',
              message: 'Graded 15 essays for "Creative Writing"',
              time: '4 hours ago'
            },
            {
              id: 3,
              type: 'class_completed',
              message: 'Completed live class: "Modal Verbs"',
              time: '1 day ago'
            }
          ]
        };
        
        setTeacherData(mockTeacherData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading teacher data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/teacher/login');
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'fas fa-tachometer-alt' },
    { key: 'students', label: 'Student Performance', icon: 'fas fa-users' },
    { key: 'lessons', label: 'Lesson Management', icon: 'fas fa-book' },
    { key: 'classes', label: 'Video Classes', icon: 'fas fa-video' },
    { key: 'assignments', label: 'Assignments', icon: 'fas fa-tasks' },
    { key: 'essays', label: 'Essay Grading', icon: 'fas fa-edit' }
  ];

  const renderOverview = () => (
    <div className="teacher-overview">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="welcome-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h3 className="welcome-title">
                    Welcome back, {teacherData?.name}! 👋
                  </h3>
                  <p className="welcome-subtitle">
                    Here's what's happening in your classes today
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setActiveTab('classes')}
                  >
                    <i className="fas fa-video me-2"></i>
                    Start Live Class
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card stat-students">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="stat-number">{teacherData?.totalStudents}</h3>
              <p className="stat-label">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-classes">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3 className="stat-number">{teacherData?.activeClasses}</h3>
              <p className="stat-label">Active Classes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-lessons">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3 className="stat-number">{teacherData?.totalLessons}</h3>
              <p className="stat-label">Lessons Created</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-grade">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="stat-number">{teacherData?.averageGrade}%</h3>
              <p className="stat-label">Average Grade</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Upcoming Classes */}
        <Col md={8}>
          <Card className="upcoming-classes-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-calendar me-2"></i>
                Upcoming Classes
              </h5>
            </Card.Header>
            <Card.Body>
              {teacherData?.upcomingClasses?.map((classItem) => (
                <div key={classItem.id} className="class-item mb-3">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <h6 className="class-title">{classItem.title}</h6>
                      <p className="class-info">
                        <i className="fas fa-clock me-1"></i>
                        {classItem.time} - {classItem.date}
                      </p>
                    </Col>
                    <Col md={3}>
                      <Badge bg="info">
                        {classItem.students} students
                      </Badge>
                    </Col>
                    <Col md={3} className="text-end">
                      <Button variant="outline-primary" size="sm">
                        {classItem.type === 'live' ? 'Join Now' : 'Schedule'}
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              
              <div className="text-center mt-3">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('classes')}
                >
                  View All Classes <i className="fas fa-arrow-right ms-1"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col md={4}>
          <Card className="activities-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activities
              </h5>
            </Card.Header>
            <Card.Body>
              {teacherData?.recentActivities?.map((activity) => (
                <div key={activity.id} className="activity-item mb-3">
                  <div className="activity-icon">
                    <i className={
                      activity.type === 'lesson_created' ? 'fas fa-plus text-success' :
                      activity.type === 'assignment_graded' ? 'fas fa-check text-primary' :
                      'fas fa-video text-info'
                    }></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <small className="activity-time text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'students':
        return <StudentPerformanceMonitor />;
      case 'lessons':
        return <LessonManager />;
      case 'classes':
        return <VideoClassroom />;
      case 'assignments':
        return <AssignmentCreator />;
      case 'essays':
        return <EssayGrader />;
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" variant="primary" size="lg" />
        <h5 className="mt-3">Loading Teacher Dashboard...</h5>
      </Container>
    );
  }

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <div className="teacher-header">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="dashboard-title">
                <i className="fas fa-chalkboard-teacher me-3"></i>
                Teacher Dashboard
              </h2>
            </Col>
            <Col md={6} className="text-end">
              <div className="header-actions">
                <span className="teacher-name me-3">
                  {teacherData?.name} ({teacherData?.teacherId})
                </span>
                <Button variant="outline-danger" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Navigation */}
      <div className="teacher-navigation">
        <Container fluid>
          <Nav variant="pills" className="teacher-nav">
            {tabs.map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link
                  active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="teacher-nav-link"
                >
                  <i className={`${tab.icon} me-2`}></i>
                  <span className="d-none d-md-inline">{tab.label}</span>
                  <span className="d-md-none">{tab.label.split(' ')[0]}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </div>

      {/* Main Content */}
      <div className="teacher-content">
        <Container fluid>
          {renderTabContent()}
        </Container>
      </div>
    </div>
  );
};

export default TeacherDashboard;
