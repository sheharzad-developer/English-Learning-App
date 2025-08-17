import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    progress: 65,
    lessonsCompleted: 12,
    quizzesTaken: 8,
    streak: 5
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/student/progress/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Handle progress data if needed
        console.log('Progress data:', res.data);
      } catch (error) {
        console.error('Failed to fetch progress data', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="dashboard-page py-4">
      <Container>
        <h2 className="fw-bold mb-4" style={{ color: '#2B2D42' }}>
          Welcome back, {user?.username || 'Learner'}! 🎓
        </h2>
        
        {/* Progress Overview */}
        <Row className="mb-5 align-items-center">
          <Col md={8}>
            <div className="mb-2 fw-semibold">Your Progress</div>
            <ProgressBar now={stats.progress} label={`${stats.progress}%`} style={{ height: '1.5rem', fontSize: '1rem' }} />
            <div className="mt-2 text-muted">Keep going! You're making great progress.</div>
          </Col>
          <Col md={4} className="text-center mt-4 mt-md-0">
            <img
              src="https://undraw.co/api/illustrations/achievement.svg"
              alt="Achievement"
              className="img-fluid dashboard-illustration"
              style={{ maxHeight: '120px' }}
              onError={e => { e.target.src = 'https://undraw.co/static/images/undraw_winners.svg'; }}
            />
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-primary text-white mx-auto mb-3">
                  <i className="bi bi-journal-check fs-2"></i>
                </div>
                <Card.Title className="mb-1">Lessons Completed</Card.Title>
                <Card.Text className="fs-3 fw-bold">{stats.lessonsCompleted}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-success text-white mx-auto mb-3">
                  <i className="bi bi-patch-question fs-2"></i>
                </div>
                <Card.Title className="mb-1">Quizzes Taken</Card.Title>
                <Card.Text className="fs-3 fw-bold">{stats.quizzesTaken}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-warning text-white mx-auto mb-3">
                  <i className="bi bi-fire fs-2"></i>
                </div>
                <Card.Title className="mb-1">Streak</Card.Title>
                <Card.Text className="fs-3 fw-bold">{stats.streak} days</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-info text-white mx-auto mb-3">
                  <i className="bi bi-trophy fs-2"></i>
                </div>
                <Card.Title className="mb-1">Achievements</Card.Title>
                <Card.Text className="fs-3 fw-bold">3</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Progress Summary Card */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3">📈 Your Learning Summary</Card.Title>
                <Row className="g-3">
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <h5 className="text-primary">Current Level</h5>
                      <p className="fs-4 fw-bold mb-0">Intermediate</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <h5 className="text-success">Average Score</h5>
                      <p className="fs-4 fw-bold mb-0">85%</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <h5 className="text-warning">Study Time</h5>
                      <p className="fs-4 fw-bold mb-0">12 hrs</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3">Quick Actions</Card.Title>
                <Row className="g-3">
                  <Col md={3}>
                    <Button 
                      variant="outline-primary" 
                      className="w-100" 
                      onClick={() => navigate('/learning')}
                    >
                      <i className="bi bi-journal-text me-2"></i>
                      Start Learning
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-success" 
                      className="w-100"
                      onClick={() => navigate('/achievements')}
                    >
                      <i className="bi bi-trophy me-2"></i>
                      View Achievements
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-warning" 
                      className="w-100"
                      onClick={() => navigate('/leaderboard')}
                    >
                      <i className="bi bi-bar-chart me-2"></i>
                      Leaderboard
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-info" 
                      className="w-100"
                      onClick={() => navigate('/profile')}
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Motivation Section */}
        <div className="text-center mt-4">
          <h4 className="fw-bold mb-3" style={{ color: '#1976d2' }}>
            "Every day you practice, you get closer to fluency!"
          </h4>
          <Button variant="primary" size="lg" onClick={() => navigate('/learning')}>
            Start a New Lesson
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default StudentDashboard;
