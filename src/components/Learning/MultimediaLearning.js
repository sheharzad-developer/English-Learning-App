import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Nav, Alert, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';
import SpeakingPractice from './SpeakingPractice';
import ListeningComprehension from './ListeningComprehension';
import ReadingComprehension from './ReadingComprehension';
import WritingPractice from './WritingPractice';
import InteractiveFlashcards from './InteractiveFlashcards';
import EnhancedQuizzes from './EnhancedQuizzes';
import './MultimediaLearning.css';

const MultimediaLearning = () => {
  const [activeSkill, setActiveSkill] = useState('overview');
  const [userProgress, setUserProgress] = useState({
    speaking: { level: 2, progress: 65, completed: 8, total: 15 },
    listening: { level: 3, progress: 78, completed: 12, total: 18 },
    reading: { level: 3, progress: 82, completed: 14, total: 20 },
    writing: { level: 2, progress: 58, completed: 6, total: 12 }
  });
  const [achievements, setAchievements] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    loadUserProgress();
    checkAchievements();
  }, []);

  const loadUserProgress = () => {
    // In a real app, this would fetch from backend
    const savedProgress = localStorage.getItem('skillProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  const updateProgress = (skill, newProgress) => {
    const updated = {
      ...userProgress,
      [skill]: { ...userProgress[skill], ...newProgress }
    };
    setUserProgress(updated);
    localStorage.setItem('skillProgress', JSON.stringify(updated));
    checkAchievements();
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    // Check for skill milestones
    Object.entries(userProgress).forEach(([skill, data]) => {
      if (data.progress >= 100 && !achievements.includes(`${skill}_master`)) {
        newAchievements.push({
          id: `${skill}_master`,
          title: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Master`,
          description: `Completed all ${skill} exercises`,
          icon: 'fa-trophy',
          type: 'gold'
        });
      } else if (data.progress >= 75 && !achievements.includes(`${skill}_expert`)) {
        newAchievements.push({
          id: `${skill}_expert`,
          title: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Expert`,
          description: `Reached 75% progress in ${skill}`,
          icon: 'fa-star',
          type: 'silver'
        });
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const getOverallProgress = () => {
    const total = Object.values(userProgress).reduce((sum, skill) => sum + skill.progress, 0);
    return Math.round(total / 4);
  };

  const getSkillLevel = (progress) => {
    if (progress >= 90) return { level: 'Expert', color: 'success' };
    if (progress >= 70) return { level: 'Advanced', color: 'info' };
    if (progress >= 50) return { level: 'Intermediate', color: 'warning' };
    return { level: 'Beginner', color: 'secondary' };
  };

  const skillTabs = [
    { key: 'overview', label: 'Overview', icon: 'fa-chart-line' },
    { key: 'speaking', label: 'Speaking', icon: 'fa-microphone' },
    { key: 'listening', label: 'Listening', icon: 'fa-headphones' },
    { key: 'reading', label: 'Reading', icon: 'fa-book-open' },
    { key: 'writing', label: 'Writing', icon: 'fa-pen' },
    { key: 'flashcards', label: 'Flashcards', icon: 'fa-layer-group' },
    { key: 'quizzes', label: 'Quizzes', icon: 'fa-question-circle' }
  ];

  const renderOverview = () => (
    <div className="overview-section">
      {/* Overall Progress */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="progress-overview-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h4 className="mb-3">
                    <i className="fas fa-graduation-cap me-2 text-primary"></i>
                    Your English Learning Journey
                  </h4>
                  <div className="overall-progress mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Overall Progress</span>
                      <span className="fw-bold text-primary">{getOverallProgress()}%</span>
                    </div>
                    <ProgressBar 
                      now={getOverallProgress()} 
                      className="overall-progress-bar"
                      style={{ height: '12px' }}
                    />
                  </div>
                  <p className="text-muted">
                    Keep practicing to improve your English skills across all areas!
                  </p>
                </Col>
                <Col md={4} className="text-center">
                  <div className="achievement-circle">
                    <div className="achievement-inner">
                      <h2 className="achievement-number">{achievements.length}</h2>
                      <small>Achievements</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Skills Grid */}
      <Row className="skills-grid">
        {Object.entries(userProgress).map(([skill, data]) => {
          const skillInfo = getSkillLevel(data.progress);
          return (
            <Col md={6} lg={3} key={skill} className="mb-4">
              <Card 
                className={`skill-card skill-${skill} h-100`}
                onClick={() => setActiveSkill(skill)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <div className="skill-icon mb-3">
                    <i className={`fas ${
                      skill === 'speaking' ? 'fa-microphone' :
                      skill === 'listening' ? 'fa-headphones' :
                      skill === 'reading' ? 'fa-book-open' :
                      'fa-pen'
                    }`}></i>
                  </div>
                  <h5 className="skill-title">{skill.charAt(0).toUpperCase() + skill.slice(1)}</h5>
                  <Badge bg={skillInfo.color} className="mb-3">{skillInfo.level}</Badge>
                  
                  <div className="skill-progress mb-3">
                    <ProgressBar 
                      now={data.progress} 
                      variant={skillInfo.color}
                      style={{ height: '8px' }}
                    />
                    <small className="text-muted">{data.progress}% Complete</small>
                  </div>
                  
                  <div className="skill-stats">
                    <small className="text-muted">
                      {data.completed}/{data.total} exercises completed
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="achievements-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2 text-warning"></i>
                  Recent Achievements
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {achievements.slice(-3).map((achievement) => (
                    <Col md={4} key={achievement.id} className="mb-3">
                      <div className="achievement-item">
                        <div className={`achievement-badge achievement-${achievement.type}`}>
                          <i className={`fas ${achievement.icon}`}></i>
                        </div>
                        <div className="achievement-info">
                          <h6 className="achievement-title">{achievement.title}</h6>
                          <small className="text-muted">{achievement.description}</small>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Study Plan */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="study-plan-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-calendar-alt me-2 text-success"></i>
                Recommended Study Plan
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <div className="study-recommendation">
                    <h6 className="text-primary">Today's Focus</h6>
                    <p className="mb-1">Practice Speaking</p>
                    <small className="text-muted">15 minutes</small>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="study-recommendation">
                    <h6 className="text-info">This Week</h6>
                    <p className="mb-1">Listening Comprehension</p>
                    <small className="text-muted">Complete 3 exercises</small>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="study-recommendation">
                    <h6 className="text-warning">Improve</h6>
                    <p className="mb-1">Writing Skills</p>
                    <small className="text-muted">Lowest progress area</small>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="study-recommendation">
                    <h6 className="text-success">Next Goal</h6>
                    <p className="mb-1">Reach Intermediate</p>
                    <small className="text-muted">In all skills</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderSkillContent = () => {
    switch (activeSkill) {
      case 'speaking':
        return <SpeakingPractice onProgressUpdate={(progress) => updateProgress('speaking', progress)} />;
      case 'listening':
        return <ListeningComprehension onProgressUpdate={(progress) => updateProgress('listening', progress)} />;
      case 'reading':
        return <ReadingComprehension onProgressUpdate={(progress) => updateProgress('reading', progress)} />;
      case 'writing':
        return <WritingPractice onProgressUpdate={(progress) => updateProgress('writing', progress)} />;
      case 'flashcards':
        return <InteractiveFlashcards />;
      case 'quizzes':
        return <EnhancedQuizzes />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="multimedia-learning">
      {/* Welcome Modal */}
      <Modal show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fas fa-graduation-cap me-2"></i>
            Welcome to Multimedia Learning!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h5>🎯 What You'll Learn:</h5>
              <ul className="list-unstyled">
                <li><i className="fas fa-microphone text-danger me-2"></i>Speaking with pronunciation feedback</li>
                <li><i className="fas fa-headphones text-info me-2"></i>Listening comprehension with videos</li>
                <li><i className="fas fa-book-open text-success me-2"></i>Reading with interactive content</li>
                <li><i className="fas fa-pen text-warning me-2"></i>Writing with automated feedback</li>
              </ul>
            </Col>
            <Col md={6}>
              <h5>✨ Features:</h5>
              <ul className="list-unstyled">
                <li><i className="fas fa-video text-primary me-2"></i>Interactive videos & audio</li>
                <li><i className="fas fa-layer-group text-secondary me-2"></i>Smart flashcards</li>
                <li><i className="fas fa-chart-line text-success me-2"></i>Progress tracking</li>
                <li><i className="fas fa-trophy text-warning me-2"></i>Achievement system</li>
              </ul>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWelcomeModal(false)}>
            <i className="fas fa-rocket me-2"></i>
            Start Learning!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Navigation */}
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Card className="navigation-card mb-4">
              <Card.Body>
                <Nav variant="pills" className="skill-navigation">
                  {skillTabs.map((tab) => (
                    <Nav.Item key={tab.key}>
                      <Nav.Link
                        active={activeSkill === tab.key}
                        onClick={() => setActiveSkill(tab.key)}
                        className="skill-nav-link"
                      >
                        <i className={`fas ${tab.icon} me-2`}></i>
                        <span className="d-none d-md-inline">{tab.label}</span>
                        <span className="d-md-none">{tab.label.substr(0, 4)}</span>
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Content Area */}
        <Row>
          <Col xs={12}>
            <div className="skill-content">
              {renderSkillContent()}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MultimediaLearning;
