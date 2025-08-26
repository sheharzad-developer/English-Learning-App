import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form, 
  Modal, 
  Spinner, 
  Alert,
  Dropdown,
  ButtonGroup,
  ProgressBar,
  Placeholder
} from 'react-bootstrap';
import { 
  Play, 
  Book, 
  Clock, 
  Star, 
  Filter, 
  Search, 
  SortDown, 
  Eye,
  Calendar,
  Award,
  Target,
  CheckCircle,
  XCircle
} from 'react-bootstrap-icons';
import { lessonService } from '../../services/lessonService';
import { useTheme } from '../../contexts/ThemeContext';
import './Lessons.css';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    status: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real data first
      try {
        const [lessonsData, categoriesData, levelsData] = await Promise.allSettled([
          lessonService.getLessons(),
          lessonService.getCategories(),
          lessonService.getSkillLevels()
        ]);

        if (lessonsData.status === 'fulfilled') {
          setLessons(lessonsData.value.results || lessonsData.value || []);
        }
        if (categoriesData.status === 'fulfilled') {
          setCategories(categoriesData.value.results || categoriesData.value || []);
        }
        if (levelsData.status === 'fulfilled') {
          setSkillLevels(levelsData.value.results || levelsData.value || []);
        }
      } catch (err) {
        console.log('Real data not available, using mock data...');
      }

      // If no real data, use comprehensive mock data
      if (lessons.length === 0) {
        setLessons(getMockLessons());
      }
      if (categories.length === 0) {
        setCategories(getMockCategories());
      }
      if (skillLevels.length === 0) {
        setSkillLevels(getMockSkillLevels());
      }

    } catch (err) {
      console.error('Error fetching lessons data:', err);
      setError('Failed to load lessons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMockLessons = () => [
    {
      id: 1,
      title: 'Basic Grammar Fundamentals',
      description: 'Learn the essential building blocks of English grammar',
      category: 'grammar',
      level: 'beginner',
      duration: 45,
      progress: 0,
      status: 'not_started',
      skills: ['Grammar', 'Writing'],
      objectives: ['Understand basic sentence structure', 'Learn common parts of speech', 'Practice basic punctuation'],
      prerequisites: ['None'],
      last_activity: null,
      difficulty: 1,
      rating: 4.5,
      enrolled_students: 1250
    },
    {
      id: 2,
      title: 'Vocabulary Builder: Everyday Words',
      description: 'Expand your vocabulary with commonly used words and phrases',
      category: 'vocabulary',
      level: 'beginner',
      duration: 30,
      progress: 75,
      status: 'in_progress',
      skills: ['Vocabulary', 'Reading'],
      objectives: ['Learn 100+ everyday words', 'Practice word usage in context', 'Improve reading comprehension'],
      prerequisites: ['Basic Grammar Fundamentals'],
      last_activity: '2024-01-25T10:30:00Z',
      difficulty: 1,
      rating: 4.8,
      enrolled_students: 2100
    },
    {
      id: 3,
      title: 'Listening Comprehension',
      description: 'Develop your listening skills through interactive audio exercises',
      category: 'listening',
      level: 'intermediate',
      duration: 60,
      progress: 100,
      status: 'completed',
      skills: ['Listening', 'Comprehension'],
      objectives: ['Improve listening accuracy', 'Understand different accents', 'Practice note-taking'],
      prerequisites: ['Vocabulary Builder: Everyday Words'],
      last_activity: '2024-01-24T15:45:00Z',
      difficulty: 2,
      rating: 4.6,
      enrolled_students: 1800
    },
    {
      id: 4,
      title: 'Speaking Practice: Conversations',
      description: 'Practice real-world conversations and improve your speaking confidence',
      category: 'speaking',
      level: 'intermediate',
      duration: 40,
      progress: 0,
      status: 'not_started',
      skills: ['Speaking', 'Pronunciation'],
      objectives: ['Practice common conversation patterns', 'Improve pronunciation', 'Build speaking confidence'],
      prerequisites: ['Listening Comprehension'],
      last_activity: null,
      difficulty: 2,
      rating: 4.7,
      enrolled_students: 950
    },
    {
      id: 5,
      title: 'Advanced Writing Techniques',
      description: 'Master advanced writing skills for academic and professional contexts',
      category: 'writing',
      level: 'advanced',
      duration: 90,
      progress: 0,
      status: 'not_started',
      skills: ['Writing', 'Grammar'],
      objectives: ['Learn advanced sentence structures', 'Practice essay writing', 'Improve writing style'],
      prerequisites: ['Basic Grammar Fundamentals', 'Vocabulary Builder: Everyday Words'],
      last_activity: null,
      difficulty: 3,
      rating: 4.9,
      enrolled_students: 650
    },
    {
      id: 6,
      title: 'Business English Essentials',
      description: 'Learn English for professional and business contexts',
      category: 'business',
      level: 'intermediate',
      duration: 75,
      progress: 25,
      status: 'in_progress',
      skills: ['Business', 'Communication'],
      objectives: ['Master business vocabulary', 'Practice professional communication', 'Learn business writing'],
      prerequisites: ['Vocabulary Builder: Everyday Words'],
      last_activity: '2024-01-23T09:15:00Z',
      difficulty: 2,
      rating: 4.4,
      enrolled_students: 1200
    }
  ];

  const getMockCategories = () => [
    { id: 1, name: 'Grammar', slug: 'grammar' },
    { id: 2, name: 'Vocabulary', slug: 'vocabulary' },
    { id: 3, name: 'Listening', slug: 'listening' },
    { id: 4, name: 'Speaking', slug: 'speaking' },
    { id: 5, name: 'Writing', slug: 'writing' },
    { id: 6, name: 'Business', slug: 'business' }
  ];

  const getMockSkillLevels = () => [
    { id: 1, name: 'Beginner', slug: 'beginner' },
    { id: 2, name: 'Intermediate', slug: 'intermediate' },
    { id: 3, name: 'Advanced', slug: 'advanced' }
  ];

  const filteredLessons = lessons.filter(lesson => {
    const matchesLevel = !filters.level || lesson.level === filters.level;
    const matchesCategory = !filters.category || lesson.category === filters.category;
    const matchesStatus = !filters.status || lesson.status === filters.status;
    const matchesSearch = !filters.search || 
      lesson.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      lesson.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesLevel && matchesCategory && matchesStatus && matchesSearch;
  });

  const sortedLessons = [...filteredLessons].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'title' || sortBy === 'description') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowDetailModal(true);
  };

  const handleStartLesson = async (lessonId) => {
    try {
      await lessonService.startLesson(lessonId);
      // Navigate to lesson detail or update progress
      window.location.href = `/lessons/${lessonId}`;
    } catch (err) {
      console.error('Error starting lesson:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', icon: <CheckCircle />, text: 'Completed' },
      in_progress: { variant: 'warning', icon: <Clock />, text: 'In Progress' },
      not_started: { variant: 'secondary', icon: <Book />, text: 'Not Started' }
    };
    const config = statusConfig[status] || statusConfig.not_started;
    return <Badge bg={config.variant} className="d-flex align-items-center gap-1">{config.icon} {config.text}</Badge>;
  };

  const getLevelBadge = (level) => {
    const levelConfig = {
      beginner: { variant: 'info', text: 'Beginner' },
      intermediate: { variant: 'warning', text: 'Intermediate' },
      advanced: { variant: 'danger', text: 'Advanced' }
    };
    const config = levelConfig[level] || levelConfig.beginner;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="py-4">
        <Row>
          <Col>
            <h2 className="mb-4">Lessons</h2>
                         <Row>
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <Col key={i} lg={4} md={6} className="mb-4">
                   <Card className="h-100">
                     <Card.Body>
                       <Placeholder as="h5" animation="wave" />
                       <Placeholder as="p" animation="wave" />
                       <Placeholder as="div" animation="wave" style={{ height: '20px' }} />
                     </Card.Body>
                   </Card>
                 </Col>
               ))}
             </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">Lessons</h2>
          <p className="text-muted">Explore our comprehensive curriculum and track your learning progress</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="warning" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label><Filter /> Level</Form.Label>
                <Form.Select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                >
                  <option value="">All Levels</option>
                  {skillLevels.map(level => (
                    <option key={level.id} value={level.slug}>{level.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><Filter /> Category</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>{category.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><Filter /> Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><Search /> Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search lessons..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Sort Controls */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">
              {sortedLessons.length} lesson{sortedLessons.length !== 1 ? 's' : ''} found
            </span>
            <Dropdown as={ButtonGroup}>
              <Button variant="outline-secondary" size="sm">
                Sort by: {sortBy === 'title' ? 'Title' : sortBy === 'duration' ? 'Duration' : sortBy === 'difficulty' ? 'Difficulty' : 'Rating'}
              </Button>
              <Dropdown.Toggle split variant="outline-secondary" size="sm" />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSort('title')}>Title</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('duration')}>Duration</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('difficulty')}>Difficulty</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('rating')}>Rating</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>

      {/* Lessons Grid */}
      {sortedLessons.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
                         <Book size={48} className="text-muted mb-3" />
            <h5>No lessons found</h5>
            <p className="text-muted">Try adjusting your filters or search terms</p>
            <Button 
              variant="outline-primary" 
              onClick={() => setFilters({ level: '', category: '', status: '', search: '' })}
            >
              Clear Filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {sortedLessons.map(lesson => (
            <Col key={lesson.id} lg={4} md={6} className="mb-4">
              <Card 
                className={`h-100 lesson-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{lesson.title}</h5>
                      <p className="card-text text-muted small mb-2">{lesson.description}</p>
                    </div>
                    <div className="ms-2">
                      {getStatusBadge(lesson.status)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex gap-1 mb-2">
                      {getLevelBadge(lesson.level)}
                      {lesson.skills.map((skill, index) => (
                        <Badge key={index} bg="light" text="dark" className="small">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Progress</small>
                      <small className="text-muted">{lesson.progress}%</small>
                    </div>
                    <ProgressBar 
                      now={lesson.progress} 
                      variant={lesson.progress === 100 ? 'success' : lesson.progress > 0 ? 'warning' : 'secondary'}
                      className="mb-2"
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Clock size={14} className="text-muted" />
                      <small className="text-muted">{formatDuration(lesson.duration)}</small>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <Star size={14} className="text-warning" />
                      <small className="text-muted">{lesson.rating}</small>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant={lesson.status === 'completed' ? 'outline-success' : 'primary'}
                      size="sm"
                      className="w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartLesson(lesson.id);
                      }}
                    >
                      {lesson.status === 'completed' ? (
                        <>
                          <Eye /> Review
                        </>
                      ) : lesson.status === 'in_progress' ? (
                        <>
                          <Play /> Continue
                        </>
                      ) : (
                        <>
                          <Play /> Start
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Lesson Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)}
        size="lg"
        className={isDarkMode ? 'dark-theme' : 'light-theme'}
      >
        {selectedLesson && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedLesson.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <p className="text-muted mb-3">{selectedLesson.description}</p>
                  
                  <h6>Objectives</h6>
                  <ul className="mb-3">
                    {selectedLesson.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>

                  <h6>Prerequisites</h6>
                  <ul className="mb-3">
                    {selectedLesson.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </Col>
                <Col md={4}>
                  <Card className="mb-3">
                    <Card.Body>
                      <h6>Lesson Details</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Level:</span>
                        {getLevelBadge(selectedLesson.level)}
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Duration:</span>
                        <span>{formatDuration(selectedLesson.duration)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Rating:</span>
                        <span>
                          <Star size={14} className="text-warning" /> {selectedLesson.rating}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Students:</span>
                        <span>{selectedLesson.enrolled_students.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Last Activity:</span>
                        <span>{formatDate(selectedLesson.last_activity)}</span>
                      </div>
                    </Card.Body>
                  </Card>

                  <div className="mb-3">
                    <h6>Skills Covered</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedLesson.skills.map((skill, index) => (
                        <Badge key={index} bg="primary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6>Progress</h6>
                    <ProgressBar 
                      now={selectedLesson.progress} 
                      variant={selectedLesson.progress === 100 ? 'success' : selectedLesson.progress > 0 ? 'warning' : 'secondary'}
                      className="mb-2"
                    />
                    <small className="text-muted">{selectedLesson.progress}% complete</small>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button
                variant={selectedLesson.status === 'completed' ? 'outline-success' : 'primary'}
                onClick={() => {
                  handleStartLesson(selectedLesson.id);
                  setShowDetailModal(false);
                }}
              >
                {selectedLesson.status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default Lessons;
