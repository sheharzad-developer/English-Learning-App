import React, { useEffect, useState } from 'react';
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
  Filler,
} from 'chart.js';
import './About.css';
import MobileImage from '../../assets/MobileBackground.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const progressData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  datasets: [
    {
      label: 'Average User Progress (%)',
      data: [15, 35, 55, 75, 88, 95],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: 'Vocabulary Growth',
      data: [25, 45, 65, 80, 90, 98],
      fill: true,
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: '#8b5cf6',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 14,
          weight: '500',
        },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f8fafc',
      bodyColor: '#f8fafc',
      borderColor: '#3b82f6',
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: true,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          weight: '500',
        },
      },
    },
    y: {
      min: 0,
      max: 100,
      grid: {
        borderDash: [5, 5],
        color: 'rgba(148, 163, 184, 0.3)',
      },
      ticks: {
        stepSize: 20,
        font: {
          size: 12,
        },
        callback: function(value) {
          return value + '%';
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateNumbers, setAnimateNumbers] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setAnimateNumbers(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: "10K+", label: "Active Learners", icon: "👥" },
    { number: "50+", label: "Lessons Available", icon: "📚" },
    { number: "95%", label: "Success Rate", icon: "🎯" },
    { number: "24/7", label: "Learning Support", icon: "🚀" }
  ];

  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "AI-powered adaptive learning paths tailored to your pace and goals"
    },
    {
      icon: "🏆",
      title: "Gamified Experience",
      description: "Earn badges, compete with friends, and track your achievements"
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Learn anywhere, anytime with our responsive and intuitive interface"
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description: "Data-driven insights to optimize your learning journey"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <Container>
          <Row className="min-vh-100 align-items-center">
            <Col lg={6} className={`hero-content ${isVisible ? 'animate-fade-in' : ''}`}>
              <div className="hero-badge mb-4">
                <span className="badge-icon">✨</span>
                Next-Generation Learning Platform
              </div>
              <h1 className="hero-title mb-4">
                Master English with
                <span className="gradient-text"> AI-Powered </span>
                Learning
              </h1>
              <p className="hero-subtitle mb-5">
                Join thousands of learners who have transformed their English skills through our 
                innovative, interactive, and personalized learning experience.
              </p>
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`stat-item ${animateNumbers ? 'animate-count-up' : ''}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6} className="hero-image-container">
              <div className={`hero-image ${isVisible ? 'animate-float' : ''}`}>
                <img
                  src={MobileImage}
                  alt="English Learning App"
                  className="img-fluid"
                  onError={e => { e.target.src = 'https://undraw.co/static/images/undraw_online_learning.svg'; }}
                />
                <div className="floating-elements">
                  <div className="smart-float float-1">
                    <div className="float-content">
                      <div className="float-icon">📈</div>
                      <div className="float-text">
                        <div className="float-title">95%</div>
                        <div className="float-subtitle">Success Rate</div>
                      </div>
                    </div>
                  </div>
                  <div className="smart-float float-2">
                    <div className="float-content">
                      <div className="float-icon">⚡</div>
                      <div className="float-text">
                        <div className="float-title">AI</div>
                        <div className="float-subtitle">Powered</div>
                      </div>
                    </div>
                  </div>
                  <div className="smart-float float-3">
                    <div className="float-content">
                      <div className="float-icon">🎯</div>
                      <div className="float-text">
                        <div className="float-title">24/7</div>
                        <div className="float-subtitle">Support</div>
                      </div>
                    </div>
                  </div>
                  <div className="smart-float float-4">
                    <div className="float-content">
                      <div className="float-icon">🌟</div>
                      <div className="float-text">
                        <div className="float-title">4.9</div>
                        <div className="float-subtitle">Rating</div>
                      </div>
                    </div>
                  </div>
                  <div className="floating-dots">
                    <div className="dot dot-1"></div>
                    <div className="dot dot-2"></div>
                    <div className="dot dot-3"></div>
                    <div className="dot dot-4"></div>
                    <div className="dot dot-5"></div>
                    <div className="dot dot-6"></div>
                  </div>
                  <div className="floating-lines">
                    <div className="line line-1"></div>
                    <div className="line line-2"></div>
                    <div className="line line-3"></div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <p className="section-subtitle">Discover the features that make learning English exciting and effective</p>
          </div>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="feature-card h-100">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon mb-3">{feature.icon}</div>
                    <Card.Title className="feature-title mb-3">{feature.title}</Card.Title>
                    <Card.Text className="feature-description">{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Progress Chart Section */}
      <section className="chart-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="chart-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="chart-title">Learning Success Analytics</h3>
                    <p className="chart-subtitle">Real data from our learning community</p>
                  </div>
                  <div className="chart-container">
                    <Line data={progressData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">The passionate minds behind your learning journey</p>
          </div>
          <Row className="justify-content-center g-4">
            <Col md={6} lg={4}>
              <Card className="team-card">
                <Card.Body className="text-center p-5">
                  <div className="team-avatar mb-4">
                    <div className="avatar-ring">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="avatar-badge">🚀</div>
                  </div>
                  <h5 className="team-name">Sheharzad Salahuddin</h5>
                  <p className="team-role">Full Stack Developer</p>
                  <p className="team-bio">
                    Passionate about creating innovative learning experiences through technology
                  </p>
                  <div className="team-skills">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Django</span>
                    <span className="skill-tag">AI/ML</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="team-card">
                <Card.Body className="text-center p-5">
                  <div className="team-avatar mb-4">
                    <div className="avatar-ring">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="avatar-badge">🎓</div>
                  </div>
                  <h5 className="team-name">Haseeb Akmal</h5>
                  <p className="team-role">Project Supervisor</p>
                  <p className="team-bio">
                    Expert in educational technology and learning methodologies
                  </p>
                  <div className="team-skills">
                    <span className="skill-tag">Education</span>
                    <span className="skill-tag">Research</span>
                    <span className="skill-tag">Strategy</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quote Section */}
      <section className="quote-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="quote-card">
                <Card.Body className="text-center p-5">
                  <div className="quote-icon mb-4">💬</div>
                  <blockquote className="quote-text">
                    "Learning another language is like becoming another person."
                  </blockquote>
                  <div className="quote-author">— Haruki Murakami</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
