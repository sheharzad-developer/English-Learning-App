import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProgress from '../../components/UserProgress/UserProgress';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero-section py-5 text-center">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6} className="text-md-start text-center mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#ffff' }}>
                Unlock Your English Potential
              </h1>
              <p className="lead mb-4" style={{ color: '#555' }}>
                Interactive lessons, quizzes, and progress tracking. Learn English the smart way!
              </p>
              {isAuthenticated ? (
                <Button onClick={() => navigate('/dashboard')} variant="primary" size="lg" className="shadow me-3">
                  Go to Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate('/register')} variant="primary" size="lg" className="shadow">
                  Get Started
                </Button>
              )}
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

      {/* User Progress Section - Only show for authenticated users */}
      {isAuthenticated && user && (
        <section className="user-progress-section py-5">
          <Container fluid>
            <UserProgress userId={user.id} />
          </Container>
        </section>
      )}

      {/* How It Works Section */}
      <section className="how-it-works py-5 bg-light">
        <Container fluid>
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#2B2D42' }}>How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 text-center">
                <Card.Body>
                  <div className="icon-circle mb-3 bg-primary text-inverse mx-auto">
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
                  <div className="icon-circle mb-3 bg-success text-inverse mx-auto">
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
                  <div className="icon-circle mb-3 bg-warning text-inverse mx-auto">
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

      {/* Features Section */}
      <section className="features-section py-5">
        <Container fluid>
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#2B2D42' }}>Why Choose Our Platform?</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="icon-circle mb-3 bg-info text-inverse mx-auto">
                  <i className="bi bi-lightning-charge fs-2"></i>
                </div>
                <h5>Interactive Learning</h5>
                <p className="text-muted">Engage with dynamic content and real-time feedback</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="icon-circle mb-3 bg-success text-inverse mx-auto">
                  <i className="bi bi-graph-up fs-2"></i>
                </div>
                <h5>Progress Tracking</h5>
                <p className="text-muted">Monitor your learning journey with detailed analytics</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="icon-circle mb-3 bg-warning text-inverse mx-auto">
                  <i className="bi bi-trophy fs-2"></i>
                </div>
                <h5>Achievements</h5>
                <p className="text-muted">Earn badges and rewards as you complete milestones</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="icon-circle mb-3 bg-danger text-inverse mx-auto">
                  <i className="bi bi-people fs-2"></i>
                </div>
                <h5>Community</h5>
                <p className="text-muted">Connect with fellow learners and share experiences</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-inverse text-center">
        <Container fluid>
          <h2 className="mb-3">Ready to Start Your English Learning Journey?</h2>
          <p className="lead mb-4">Join thousands of learners who have already improved their English skills with us.</p>
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')} variant="light" size="lg" className="shadow">
              Go to Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate('/register')} variant="light" size="lg" className="shadow">
              Start Learning Now
            </Button>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Home;
