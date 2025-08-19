import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard = () => {
  // Example user data (replace with real data from backend or context)
  const userName = localStorage.getItem('userName') || 'Learner';
  const progress = 65; // percent
  const lessonsCompleted = 12;
  const quizzesTaken = 8;
  const streak = 5;

  return (
    <div className="dashboard-page py-4">
      <Container fluid>
        <h2 className="fw-bold mb-4" style={{ color: '#2B2D42' }}>
          Welcome back, {userName}!
        </h2>
        <Row className="mb-5 align-items-center">
          <Col md={8}>
            <div className="mb-2 fw-semibold">Your Progress</div>
            <ProgressBar now={progress} label={`${progress}%`} style={{ height: '1.5rem !important', fontSize: '1rem' }} />
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
                <div className="icon-circle bg-primary text-inverse mx-auto mb-3">
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
                <div className="icon-circle bg-success text-inverse mx-auto mb-3">
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
                <div className="icon-circle bg-warning text-inverse mx-auto mb-3">
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
          <Button variant="primary" size="lg" href="/learning">
            Start a New Lesson
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
