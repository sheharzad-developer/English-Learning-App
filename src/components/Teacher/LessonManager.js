import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Table,
  Badge,
  Alert,
  Spinner,
  Dropdown,
  InputGroup,
  Tabs,
  Tab,
  ProgressBar
} from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaBook,
  FaVideo,
  FaHeadphones,
  FaFileText,
  FaQuestionCircle,
  FaClock,
  FaUsers,
  FaStar,
  FaChartLine
} from 'react-icons/fa';
import axios from 'axios';
import './LessonManager.css';

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    level: 'beginner',
    type: 'reading',
    duration: 30,
    objectives: [''],
    materials: [{ type: 'text', content: '', title: '' }],
    exercises: [{ type: 'multiple_choice', question: '', options: ['', '', '', ''], correct_answer: 0, points: 10 }],
    vocabulary: [{ word: '', definition: '', example: '' }],
    grammar_points: [''],
    difficulty_rating: 1,
    prerequisites: [],
    tags: [],
    is_published: false
  });

  // Demo data for development
  const demoLessons = [
    {
      id: 1,
      title: 'Introduction to Present Tense',
      description: 'Learn the basics of present tense in English',
      level: 'beginner',
      type: 'grammar',
      duration: 45,
      status: 'published',
      students_enrolled: 25,
      completion_rate: 85,
      average_score: 78,
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      objectives: ['Understand present tense structure', 'Use present tense in sentences'],
      difficulty_rating: 2,
      tags: ['grammar', 'tense', 'beginner']
    },
    {
      id: 2,
      title: 'Business English Vocabulary',
      description: 'Essential vocabulary for business communication',
      level: 'intermediate',
      type: 'vocabulary',
      duration: 60,
      status: 'draft',
      students_enrolled: 18,
      completion_rate: 72,
      average_score: 82,
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      objectives: ['Learn business terms', 'Practice professional communication'],
      difficulty_rating: 3,
      tags: ['business', 'vocabulary', 'professional']
    },
    {
      id: 3,
      title: 'Listening Comprehension: News',
      description: 'Improve listening skills with news broadcasts',
      level: 'advanced',
      type: 'listening',
      duration: 40,
      status: 'published',
      students_enrolled: 12,
      completion_rate: 68,
      average_score: 75,
      created_at: '2024-01-05',
      updated_at: '2024-01-15',
      objectives: ['Understand news broadcasts', 'Identify key information'],
      difficulty_rating: 4,
      tags: ['listening', 'news', 'current events']
    }
  ];

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await axios.get('/api/teacher/lessons/');
      // setLessons(response.data);
      
      // Using demo data for now
      setTimeout(() => {
        setLessons(demoLessons);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons');
      setLessons(demoLessons); // Fallback to demo data
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (modalType === 'create') {
        // const response = await axios.post('/api/teacher/lessons/', formData);
        const newLesson = {
          ...formData,
          id: Date.now(),
          students_enrolled: 0,
          completion_rate: 0,
          average_score: 0,
          status: formData.is_published ? 'published' : 'draft',
          created_at: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString().split('T')[0]
        };
        setLessons([...lessons, newLesson]);
        setSuccess('Lesson created successfully!');
      } else if (modalType === 'edit') {
        // const response = await axios.put(`/api/teacher/lessons/${selectedLesson.id}/`, formData);
        const updatedLessons = lessons.map(lesson => 
          lesson.id === selectedLesson.id 
            ? { ...lesson, ...formData, updated_at: new Date().toISOString().split('T')[0] }
            : lesson
        );
        setLessons(updatedLessons);
        setSuccess('Lesson updated successfully!');
      }
      
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving lesson:', err);
      setError('Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        // await axios.delete(`/api/teacher/lessons/${lessonId}/`);
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
        setSuccess('Lesson deleted successfully!');
      } catch (err) {
        console.error('Error deleting lesson:', err);
        setError('Failed to delete lesson');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      level: 'beginner',
      type: 'reading',
      duration: 30,
      objectives: [''],
      materials: [{ type: 'text', content: '', title: '' }],
      exercises: [{ type: 'multiple_choice', question: '', options: ['', '', '', ''], correct_answer: 0, points: 10 }],
      vocabulary: [{ word: '', definition: '', example: '' }],
      grammar_points: [''],
      difficulty_rating: 1,
      prerequisites: [],
      tags: [],
      is_published: false
    });
  };

  const openModal = (type, lesson = null) => {
    setModalType(type);
    setSelectedLesson(lesson);
    if (lesson && type === 'edit') {
      setFormData({ ...lesson });
    } else if (type === 'create') {
      resetForm();
    }
    setShowModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reading': return <FaBook />;
      case 'listening': return <FaHeadphones />;
      case 'speaking': return <FaVideo />;
      case 'writing': return <FaFileText />;
      case 'grammar': return <FaQuestionCircle />;
      case 'vocabulary': return <FaStar />;
      default: return <FaBook />;
    }
  };

  const getLevelBadgeVariant = (level) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'secondary';
      case 'archived': return 'dark';
      default: return 'secondary';
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || lesson.level === filterLevel;
    const matchesType = !filterType || lesson.type === filterType;
    const matchesStatus = !filterStatus || lesson.status === filterStatus;
    
    return matchesSearch && matchesLevel && matchesType && matchesStatus;
  });

  const addArrayItem = (field, defaultValue) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultValue]
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const updateArrayItem = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  if (loading && lessons.length === 0) {
    return (
      <Container className="lesson-manager-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading lessons...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="lesson-manager-container">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="manager-header">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="manager-title">
                    <FaBook className="me-3" />
                    Lesson Manager
                  </h1>
                  <p className="manager-subtitle">
                    Create, organize, and manage your English lessons
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    variant="primary"
                    size="lg"
                    className="create-btn"
                    onClick={() => openModal('create')}
                  >
                    <FaPlus className="me-2" />
                    Create New Lesson
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card stats-total">
            <Card.Body className="text-center">
              <FaBook className="stats-icon" />
              <h3 className="stats-number">{lessons.length}</h3>
              <p className="stats-label">Total Lessons</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card stats-published">
            <Card.Body className="text-center">
              <FaChartLine className="stats-icon" />
              <h3 className="stats-number">{lessons.filter(l => l.status === 'published').length}</h3>
              <p className="stats-label">Published</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card stats-students">
            <Card.Body className="text-center">
              <FaUsers className="stats-icon" />
              <h3 className="stats-number">{lessons.reduce((sum, l) => sum + l.students_enrolled, 0)}</h3>
              <p className="stats-label">Total Enrollments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card stats-completion">
            <Card.Body className="text-center">
              <FaStar className="stats-icon" />
              <h3 className="stats-number">
                {lessons.length > 0 ? Math.round(lessons.reduce((sum, l) => sum + l.completion_rate, 0) / lessons.length) : 0}%
              </h3>
              <p className="stats-label">Avg. Completion</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="filters-card">
            <Card.Body>
              <Row className="align-items-end">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Search Lessons</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Level</Form.Label>
                    <Form.Select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="reading">Reading</option>
                      <option value="listening">Listening</option>
                      <option value="speaking">Speaking</option>
                      <option value="writing">Writing</option>
                      <option value="grammar">Grammar</option>
                      <option value="vocabulary">Vocabulary</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Button variant="outline-secondary" className="w-100">
                    <FaDownload className="me-2" />
                    Export
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lessons Table */}
      <Row>
        <Col>
          <Card className="lessons-table-card">
            <Card.Body>
              <Table responsive className="lessons-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Level</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Students</th>
                    <th>Completion</th>
                    <th>Avg. Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((lesson) => (
                    <tr key={lesson.id} className="lesson-row">
                      <td>
                        <div className="lesson-info">
                          <div className="lesson-icon">
                            {getTypeIcon(lesson.type)}
                          </div>
                          <div className="lesson-details">
                            <div className="lesson-title">{lesson.title}</div>
                            <div className="lesson-description">{lesson.description}</div>
                            <div className="lesson-meta">
                              <small className="text-muted">
                                Created: {lesson.created_at} | Updated: {lesson.updated_at}
                              </small>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getLevelBadgeVariant(lesson.level)} className="level-badge">
                          {lesson.level}
                        </Badge>
                      </td>
                      <td>
                        <span className="type-text">{lesson.type}</span>
                      </td>
                      <td>
                        <div className="duration-cell">
                          <FaClock className="me-1" />
                          {lesson.duration} min
                        </div>
                      </td>
                      <td>
                        <div className="students-cell">
                          <FaUsers className="me-1" />
                          {lesson.students_enrolled}
                        </div>
                      </td>
                      <td>
                        <div className="completion-cell">
                          <ProgressBar
                            now={lesson.completion_rate}
                            variant={lesson.completion_rate >= 80 ? 'success' : lesson.completion_rate >= 60 ? 'warning' : 'danger'}
                            className="completion-bar"
                          />
                          <small className="completion-text">{lesson.completion_rate}%</small>
                        </div>
                      </td>
                      <td>
                        <div className="score-cell">
                          <span className="score-value">{lesson.average_score}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(lesson.status)} className="status-badge">
                          {lesson.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openModal('view', lesson)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => openModal('edit', lesson)}
                            title="Edit Lesson"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(lesson.id)}
                            title="Delete Lesson"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {filteredLessons.length === 0 && (
                <div className="text-center py-5">
                  <FaBook size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No lessons found</h5>
                  <p className="text-muted">Try adjusting your search criteria or create a new lesson.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lesson Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" className="lesson-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create' && 'Create New Lesson'}
            {modalType === 'edit' && 'Edit Lesson'}
            {modalType === 'view' && 'Lesson Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'view' && selectedLesson ? (
            <div className="lesson-details-view">
              <Row>
                <Col md={8}>
                  <h4>{selectedLesson.title}</h4>
                  <p className="text-muted">{selectedLesson.description}</p>
                  
                  <div className="lesson-meta-info">
                    <Row>
                      <Col md={6}>
                        <strong>Level:</strong> <Badge bg={getLevelBadgeVariant(selectedLesson.level)}>{selectedLesson.level}</Badge>
                      </Col>
                      <Col md={6}>
                        <strong>Type:</strong> {getTypeIcon(selectedLesson.type)} {selectedLesson.type}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={6}>
                        <strong>Duration:</strong> <FaClock className="me-1" /> {selectedLesson.duration} minutes
                      </Col>
                      <Col md={6}>
                        <strong>Difficulty:</strong> {Array.from({ length: selectedLesson.difficulty_rating }, (_, i) => (
                          <FaStar key={i} className="text-warning" />
                        ))}
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="mt-4">
                    <h6>Learning Objectives:</h6>
                    <ul>
                      {selectedLesson.objectives?.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3">
                    <h6>Tags:</h6>
                    {selectedLesson.tags?.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-1">{tag}</Badge>
                    ))}
                  </div>
                </Col>
                <Col md={4}>
                  <Card className="stats-summary">
                    <Card.Header>
                      <h6 className="mb-0">Performance Stats</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="stat-item">
                        <span>Students Enrolled:</span>
                        <strong>{selectedLesson.students_enrolled}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Completion Rate:</span>
                        <strong>{selectedLesson.completion_rate}%</strong>
                      </div>
                      <div className="stat-item">
                        <span>Average Score:</span>
                        <strong>{selectedLesson.average_score}%</strong>
                      </div>
                      <div className="stat-item">
                        <span>Status:</span>
                        <Badge bg={getStatusBadgeVariant(selectedLesson.status)}>
                          {selectedLesson.status}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="overview" title="Overview">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Lesson Title *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          placeholder="Enter lesson title"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration (minutes) *</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                          required
                          min="1"
                          max="180"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      placeholder="Describe what students will learn in this lesson"
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Level *</Form.Label>
                        <Form.Select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          required
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type *</Form.Label>
                        <Form.Select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          required
                        >
                          <option value="reading">Reading</option>
                          <option value="listening">Listening</option>
                          <option value="speaking">Speaking</option>
                          <option value="writing">Writing</option>
                          <option value="grammar">Grammar</option>
                          <option value="vocabulary">Vocabulary</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Difficulty Rating</Form.Label>
                        <Form.Select
                          value={formData.difficulty_rating}
                          onChange={(e) => setFormData({ ...formData, difficulty_rating: parseInt(e.target.value) })}
                        >
                          <option value={1}>⭐ Very Easy</option>
                          <option value={2}>⭐⭐ Easy</option>
                          <option value={3}>⭐⭐⭐ Medium</option>
                          <option value={4}>⭐⭐⭐⭐ Hard</option>
                          <option value={5}>⭐⭐⭐⭐⭐ Very Hard</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Learning Objectives</Form.Label>
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          value={objective}
                          onChange={(e) => updateArrayItem('objectives', index, e.target.value)}
                          placeholder={`Objective ${index + 1}`}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => removeArrayItem('objectives', index)}
                          disabled={formData.objectives.length === 1}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addArrayItem('objectives', '')}
                    >
                      <FaPlus className="me-1" /> Add Objective
                    </Button>
                  </Form.Group>
                  
                  <Form.Check
                    type="checkbox"
                    label="Publish immediately"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="mb-3"
                  />
                </Tab>
                
                <Tab eventKey="content" title="Content">
                  <Form.Group className="mb-3">
                    <Form.Label>Lesson Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter the main lesson content here..."
                    />
                  </Form.Group>
                </Tab>
                
                <Tab eventKey="vocabulary" title="Vocabulary">
                  <h6>Vocabulary Words</h6>
                  {formData.vocabulary.map((vocab, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>Word</Form.Label>
                              <Form.Control
                                type="text"
                                value={vocab.word}
                                onChange={(e) => {
                                  const updatedVocab = [...formData.vocabulary];
                                  updatedVocab[index] = { ...vocab, word: e.target.value };
                                  setFormData({ ...formData, vocabulary: updatedVocab });
                                }}
                                placeholder="Enter word"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Definition</Form.Label>
                              <Form.Control
                                type="text"
                                value={vocab.definition}
                                onChange={(e) => {
                                  const updatedVocab = [...formData.vocabulary];
                                  updatedVocab[index] = { ...vocab, definition: e.target.value };
                                  setFormData({ ...formData, vocabulary: updatedVocab });
                                }}
                                placeholder="Enter definition"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Example</Form.Label>
                              <Form.Control
                                type="text"
                                value={vocab.example}
                                onChange={(e) => {
                                  const updatedVocab = [...formData.vocabulary];
                                  updatedVocab[index] = { ...vocab, example: e.target.value };
                                  setFormData({ ...formData, vocabulary: updatedVocab });
                                }}
                                placeholder="Example sentence"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={1} className="d-flex align-items-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeArrayItem('vocabulary', index)}
                              disabled={formData.vocabulary.length === 1}
                            >
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                  <Button
                    variant="outline-primary"
                    onClick={() => addArrayItem('vocabulary', { word: '', definition: '', example: '' })}
                  >
                    <FaPlus className="me-1" /> Add Vocabulary Word
                  </Button>
                </Tab>
              </Tabs>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {modalType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {modalType !== 'view' && (
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                modalType === 'create' ? 'Create Lesson' : 'Update Lesson'
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LessonManager;