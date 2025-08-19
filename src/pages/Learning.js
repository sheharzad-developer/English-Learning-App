import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Nav } from 'react-bootstrap';
import { lessonService } from '../services/lessonService';
import LearningDashboard from '../components/LearningDashboard';
import UserProgress from '../components/UserProgress';
import LessonDetail from '../components/LessonDetail';
import GamificationDashboard from '../components/Gamification/GamificationDashboard';
import InteractiveExerciseDemo from '../components/Exercises/InteractiveExerciseDemo';
import './Learning.css';

// Mock user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = 1;

const Learning = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch lessons, categories, and skill levels
      const [lessonsResponse, categoriesResponse, skillLevelsResponse] = await Promise.all([
        lessonService.getLessons(),
        lessonService.getCategories(),
        lessonService.getSkillLevels()
      ]);

      setLessons(lessonsResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setSkillLevels(skillLevelsResponse.data || []);

    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load learning content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesCategory = selectedCategory === 'All' || lesson.category?.name === selectedCategory;
    const matchesSkillLevel = selectedSkillLevel === 'All' || lesson.skill_level === selectedSkillLevel;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSkillLevel && matchesSearch;
  });

  const getSkillLevelColor = (skillLevel) => {
    switch (skillLevel?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      case 'expert': return 'dark';
      default: return 'secondary';
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('lesson');
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setActiveTab('lessons');
    // Refresh lessons data
    fetchInitialData();
  };

  // Card hover functionality removed for cleaner code

  if (loading) {
    return (
      <Container fluid className="text-center py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Loading your learning content...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchInitialData}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  // Show lesson detail if a lesson is selected
  if (selectedLesson) {
    return (
      <LessonDetail 
        lesson={selectedLesson} 
        onBack={handleBackToLessons}
        userId={CURRENT_USER_ID}
      />
    );
  }

  return (
    <div className="learning-page-wrapper">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      
      <Container fluid className="learning-page py-4">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-star"></i>
              Premium Learning Experience
            </div>
            <h1 className="hero-title">
              Master <span className="highlight-text">English</span> with 
              <span className="gradient-text"> AI-Powered</span> Learning
            </h1>
            <p className="hero-subtitle">
              Experience the future of language learning with personalized AI tutoring, 
              interactive exercises, and gamified progress tracking.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Learners</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Lessons</div>
              </div>
            </div>
          </div>
        </div>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="dashboard">
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="lessons">
                <i className="fas fa-book-open me-2"></i>
                Lessons
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="progress">
                <i className="fas fa-chart-line me-2"></i>
                My Progress
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="exercises">
                <i className="fas fa-puzzle-piece me-2"></i>
                Interactive Exercises
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="achievements">
                <i className="fas fa-trophy me-2"></i>
                Achievements
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <LearningDashboard userId={CURRENT_USER_ID} />
      )}

      {activeTab === 'progress' && (
        <UserProgress userId={CURRENT_USER_ID} />
      )}

      {activeTab === 'exercises' && (
        <InteractiveExerciseDemo />
      )}

      {activeTab === 'achievements' && (
        <GamificationDashboard userId={CURRENT_USER_ID} />
      )}

      {activeTab === 'lessons' && (
        <>
          {selectedLesson ? (
            <LessonDetail 
              lesson={selectedLesson} 
              onBack={handleBackToLessons}
              userId={CURRENT_USER_ID}
            />
          ) : (
            <>
              {/* Search and Filter Controls */}
              <Row className="mb-4">
            <Col md={4}>
              <div className="search-box">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="filter-controls">
                <select
                  className="form-select form-select-lg"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col md={4}>
              <div className="filter-controls">
                <select
                  className="form-select form-select-lg"
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                >
                  <option value="All">All Skill Levels</option>
                  {skillLevels.map(level => (
                    <option key={level.id} value={level.name}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>

          {/* Lessons Grid */}
          <Row>
            {filteredLessons.map(lesson => (
              <Col key={lesson.id} lg={4} md={6} className="mb-4">
                <Card 
                  className="lesson-card h-100 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <Card.Header className="text-center">
                    <div className="lesson-icon" style={{ fontSize: '3rem' }}>
                      📚
                    </div>
                    <h5 className="mb-0 mt-2">{lesson.title}</h5>
                  </Card.Header>
                  
                  <Card.Body className="d-flex flex-column">
                    <p className="card-text flex-grow-1">{lesson.description}</p>
                    
                    <div className="lesson-meta mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg={getSkillLevelColor(lesson.skill_level)}>
                          {lesson.skill_level}
                        </Badge>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {lesson.estimated_duration} min
                        </small>
                      </div>
                      
                      {lesson.category && (
                        <div className="mb-2">
                          <Badge bg="info">{lesson.category.name}</Badge>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="primary"
                      className="mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLessonClick(lesson);
                      }}
                    >
                      <i className="fas fa-play me-2"></i>Start Lesson
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredLessons.length === 0 && (
             <Row>
               <Col>
                 <div className="text-center py-5">
                   <i className="fas fa-search fa-3x text-muted mb-3"></i>
                   <h4 className="text-muted">No lessons found</h4>
                   <p className="text-muted">
                     Try adjusting your search terms or filters
                   </p>
                 </div>
               </Col>
             </Row>
           )}
             </>
           )}
         </>
      )}
    </Container>
    </div>
  );
};

export default Learning;