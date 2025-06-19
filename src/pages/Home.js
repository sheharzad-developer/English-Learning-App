import React from 'react';
import { Container, Row, Col, Button, Card, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Example user data (replace with real data from backend or context)
  const progress = 65; // percent
  const lessonsCompleted = 12;
  const quizzesTaken = 8;
  const streak = 5;

  // If user is authenticated, show dashboard-like content
  if (isAuthenticated) {
    return (
      <div className="dashboard-page py-4">
        <Container>
          <h2 className="fw-bold mb-4" style={{ color: '#2B2D42' }}>
            Welcome back, {user?.username || 'Learner'}!
          </h2>
          <Row className="mb-5 align-items-center">
            <Col md={8}>
              <div className="mb-2 fw-semibold">Your Progress</div>
              <ProgressBar now={progress} label={`${progress}%`} style={{ height: '1.5rem', fontSize: '1rem' }} />
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
          <Row className="g-4 mb-5">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
                <Card.Body>
                  <div className="icon-circle bg-primary text-white mx-auto mb-3">
                    <i className="bi bi-journal-check fs-2"></i>
                  </div>
                  <Card.Title className="mb-1">Lessons Completed</Card.Title>
                  <Card.Text className="fs-3 fw-bold">{lessonsCompleted}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
                <Card.Body>
                  <div className="icon-circle bg-success text-white mx-auto mb-3">
                    <i className="bi bi-patch-question fs-2"></i>
                  </div>
                  <Card.Title className="mb-1">Quizzes Taken</Card.Title>
                  <Card.Text className="fs-3 fw-bold">{quizzesTaken}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
                <Card.Body>
                  <div className="icon-circle bg-warning text-white mx-auto mb-3">
                    <i className="bi bi-fire fs-2"></i>
                  </div>
                  <Card.Title className="mb-1">Streak</Card.Title>
                  <Card.Text className="fs-3 fw-bold">{streak} days</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
  }

  // For guest users, show the original landing page
  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero-section py-5 text-center">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-md-start text-center mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#2B2D42' }}>
                Unlock Your English Potential
              </h1>
              <p className="lead mb-4" style={{ color: '#555' }}>
                Interactive lessons, quizzes, and progress tracking. Learn English the smart way!
              </p>
              <Button onClick={() => navigate('/register')} variant="primary" size="lg" className="shadow">
                Get Started
              </Button>
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <img
                src="https://undraw.co/api/illustrations/english-learning.svg"
                alt="English Learning Illustration"
                className="img-fluid hero-illustration"
                style={{ maxHeight: '320px' }}
                onError={e => { e.target.src = 'https://undraw.co/static/images/undraw_educator.svg'; }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#2B2D42' }}>How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center">
                <Card.Body>
                  <div className="icon-circle mb-3 bg-primary text-white mx-auto">
                    <i className="bi bi-person-plus fs-2"></i>
                  </div>
                  <Card.Title>Sign Up</Card.Title>
                  <Card.Text>
                    Create your free account and set your learning goals.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center">
                <Card.Body>
                  <div className="icon-circle mb-3 bg-success text-white mx-auto">
                    <i className="bi bi-journal-text fs-2"></i>
                  </div>
                  <Card.Title>Learn & Practice</Card.Title>
                  <Card.Text>
                    Access interactive lessons and quizzes tailored to your level.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center">
                <Card.Body>
                  <div className="icon-circle mb-3 bg-warning text-white mx-auto">
                    <i className="bi bi-bar-chart-line fs-2"></i>
                  </div>
                  <Card.Title>Track Progress</Card.Title>
                  <Card.Text>
                    Monitor your improvement and earn achievements as you learn.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
