import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './About.css';
import MobileImage from '../assets/MobileBackground.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const progressData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Average User Progress (%)',
      data: [20, 40, 65, 85],
      fill: false,
      backgroundColor: '#1976d2',
      borderColor: '#1976d2',
      tension: 0.3,
    },
  ],
};

const About = () => {
  return (
    <div className="about-page py-5">
      <Container>
        <h2 className="fw-bold mb-4 text-center text-primary">About English Learning App</h2>
        <Row className="mb-5 align-items-center">
          <Col md={6} className="mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            <img
              src={MobileImage}
              alt="About Illustration"
              className="img-fluid rounded shadow-sm"
              style={{ 
                maxHeight: '400px',
                display: 'block',
                margin: '0 auto'
              }}
              onError={e => { e.target.src = 'https://undraw.co/static/images/undraw_online_learning.svg'; }}
            />
          </Col>
          <Col md={6}>
            <Card className="shadow-sm border-0 p-3 about-card">
              <Card.Body>
                <Card.Title className="fw-bold mb-2">Our Mission</Card.Title>
                <Card.Text>
                  <i className="bi bi-quote text-primary fs-3 me-2"></i>
                  Empower learners to master English through interactive lessons, quizzes, and real-time progress tracking. Our app combines technology and pedagogy to make language learning engaging, effective, and fun.
                </Card.Text>
                <Card.Title className="fw-bold mt-4 mb-2">Why Choose Us?</Card.Title>
                <ul className="about-list">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Personalized learning paths</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Gamified progress and achievements</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Modern, user-friendly design</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Data-driven insights for continuous improvement</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col md={8} className="mx-auto">
            <Card className="shadow-sm border-0 p-4 text-center">
              <Card.Title className="fw-bold mb-3">User Progress Overview</Card.Title>
              <Line data={progressData} options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' } },
                scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } },
              }} />
            </Card>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col md={8} className="mx-auto">
            <Card className="shadow-sm border-0 p-4 text-center">
              <Card.Title className="fw-bold mb-3">Meet the Team</Card.Title>
              <Row className="g-4 justify-content-center">
                <Col xs={12} md={4}>
                  <div className="team-avatar mx-auto mb-2">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="fw-semibold">Sheharzad Salahuddin</div>
                  <div className="text-muted">Full Stack Developer</div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="team-avatar mx-auto mb-2">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="fw-semibold">Haseeb Akmal</div>
                  <div className="text-muted">Project Supervisor</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <h4 className="fw-bold text-success mb-3">“Learning another language is like becoming another person.”</h4>
          <div className="text-muted">— Haruki Murakami</div>
        </div>
      </Container>
    </div>
  );
};

export default About;
