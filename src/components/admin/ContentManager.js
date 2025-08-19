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
  ProgressBar,
  Accordion
} from 'react-bootstrap';
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaChartLine,
  FaCog,
  FaFileAlt,
  FaVideo,
  FaHeadphones,
  FaImage,
  FaQuestionCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaGraduationCap,
  FaLanguage,
  FaTags,
  FaCalendarAlt,
  FaUser,
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeUp,
  FaClosedCaptioning,
  FaExpand,
  FaCompress,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
  FaBookmark,
  FaFlag
} from 'react-icons/fa';
import axios from 'axios';
import './ContentManager.css';

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('lessons');
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Form state for content management
  const [contentFormData, setContentFormData] = useState({
    title: '',
    description: '',
    content: '',
    level: 'beginner',
    type: 'reading',
    duration: 30,
    objectives: [],
    materials: [],
    vocabulary: [],
    grammar_points: [],
    difficulty: 1,
    prerequisites: [],
    tags: [],
    is_published: false,
    featured: false
  });

  // Demo data
  const demoLessons = [
    {
      id: 1,
      title: 'Introduction to English Grammar',
      description: 'Basic grammar concepts for beginners',
      level: 'beginner',
      type: 'reading',
      duration: 45,
      difficulty: 2,
      is_published: true,
      featured: true,
      created_at: '2024-01-15',
      updated_at: '2024-01-18',
      author: 'Jane Smith',
      views: 1250,
      completions: 890,
      rating: 4.8,
      tags: ['grammar', 'basics', 'beginner'],
      status: 'published'
    },
    {
      id: 2,
      title: 'Conversational English Practice',
      description: 'Interactive speaking exercises',
      level: 'intermediate',
      type: 'speaking',
      duration: 60,
      difficulty: 3,
      is_published: true,
      featured: false,
      created_at: '2024-01-12',
      updated_at: '2024-01-16',
      author: 'John Doe',
      views: 980,
      completions: 720,
      rating: 4.6,
      tags: ['speaking', 'conversation', 'practice'],
      status: 'published'
    },
    {
      id: 3,
      title: 'Advanced Writing Techniques',
      description: 'Professional writing skills development',
      level: 'advanced',
      type: 'writing',
      duration: 90,
      difficulty: 5,
      is_published: false,
      featured: false,
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      author: 'Sarah Wilson',
      views: 0,
      completions: 0,
      rating: 0,
      tags: ['writing', 'advanced', 'professional'],
      status: 'draft'
    }
  ];

  const demoAssignments = [
    {
      id: 1,
      title: 'Grammar Quiz - Present Tense',
      description: 'Test your knowledge of present tense forms',
      type: 'quiz',
      difficulty: 2,
      points: 100,
      time_limit: 30,
      questions_count: 15,
      submissions: 45,
      average_score: 78,
      created_at: '2024-01-10',
      due_date: '2024-01-25',
      status: 'active'
    },
    {
      id: 2,
      title: 'Essay Writing Assignment',
      description: 'Write a 500-word essay on your favorite hobby',
      type: 'essay',
      difficulty: 3,
      points: 200,
      time_limit: 120,
      questions_count: 1,
      submissions: 28,
      average_score: 85,
      created_at: '2024-01-08',
      due_date: '2024-01-22',
      status: 'active'
    }
  ];

  const demoQuizzes = [
    {
      id: 1,
      title: 'Vocabulary Builder - Level 1',
      description: 'Basic vocabulary assessment',
      questions_count: 20,
      time_limit: 25,
      difficulty: 1,
      attempts: 156,
      average_score: 82,
      pass_rate: 78,
      created_at: '2024-01-05',
      status: 'published'
    },
    {
      id: 2,
      title: 'Listening Comprehension Test',
      description: 'Audio-based comprehension questions',
      questions_count: 12,
      time_limit: 40,
      difficulty: 3,
      attempts: 89,
      average_score: 75,
      pass_rate: 65,
      created_at: '2024-01-12',
      status: 'published'
    }
  ];

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      // const response = await axios.get(`/api/admin/${activeTab}/`);
      
      // Using demo data for now
      setTimeout(() => {
        switch (activeTab) {
          case 'lessons':
            setLessons(demoLessons);
            break;
          case 'assignments':
            setAssignments(demoAssignments);
            break;
          case 'quizzes':
            setQuizzes(demoQuizzes);
            break;
          default:
            break;
        }
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (modalType === 'create') {
        // const response = await axios.post(`/api/admin/${activeTab}/`, contentFormData);
        const newItem = {
          ...contentFormData,
          id: Date.now(),
          created_at: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString().split('T')[0],
          author: 'Current User',
          views: 0,
          completions: 0,
          rating: 0,
          status: contentFormData.is_published ? 'published' : 'draft'
        };
        
        switch (activeTab) {
          case 'lessons':
            setLessons([...lessons, newItem]);
            break;
          case 'assignments':
            setAssignments([...assignments, newItem]);
            break;
          case 'quizzes':
            setQuizzes([...quizzes, newItem]);
            break;
          default:
            break;
        }
        
        setSuccess(`${activeTab.slice(0, -1)} created successfully!`);
      } else if (modalType === 'edit') {
        // const response = await axios.put(`/api/admin/${activeTab}/${selectedItem.id}/`, contentFormData);
        const updateFunction = {
          lessons: setLessons,
          assignments: setAssignments,
          quizzes: setQuizzes
        }[activeTab];
        
        const currentData = {
          lessons,
          assignments,
          quizzes
        }[activeTab];
        
        const updatedData = currentData.map(item => 
          item.id === selectedItem.id 
            ? { ...item, ...contentFormData, updated_at: new Date().toISOString().split('T')[0] }
            : item
        );
        
        updateFunction(updatedData);
        setSuccess(`${activeTab.slice(0, -1)} updated successfully!`);
      }
      
      setShowModal(false);
      resetContentForm();
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (itemId, action) => {
    try {
      // await axios.post(`/api/admin/${activeTab}/${itemId}/${action}/`);
      
      const updateFunction = {
        lessons: setLessons,
        assignments: setAssignments,
        quizzes: setQuizzes
      }[activeTab];
      
      const currentData = {
        lessons,
        assignments,
        quizzes
      }[activeTab];
      
      const updatedData = currentData.map(item => {
        if (item.id === itemId) {
          switch (action) {
            case 'publish':
              return { ...item, is_published: true, status: 'published' };
            case 'unpublish':
              return { ...item, is_published: false, status: 'draft' };
            case 'feature':
              return { ...item, featured: true };
            case 'unfeature':
              return { ...item, featured: false };
            case 'delete':
              return null;
            default:
              return item;
          }
        }
        return item;
      }).filter(Boolean);
      
      updateFunction(updatedData);
      setSuccess(`Content ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing content:`, err);
      setError(`Failed to ${action} content`);
    }
  };

  const resetContentForm = () => {
    setContentFormData({
      title: '',
      description: '',
      content: '',
      level: 'beginner',
      type: 'reading',
      duration: 30,
      objectives: [],
      materials: [],
      vocabulary: [],
      grammar_points: [],
      difficulty: 1,
      prerequisites: [],
      tags: [],
      is_published: false,
      featured: false
    });
  };

  const openContentModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (item && type === 'edit') {
      setContentFormData({ ...item });
    } else if (type === 'create') {
      resetContentForm();
    }
    setShowModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reading': return <FaBook className="text-primary" />;
      case 'writing': return <FaFileAlt className="text-success" />;
      case 'speaking': return <FaVolumeUp className="text-warning" />;
      case 'listening': return <FaHeadphones className="text-info" />;
      case 'video': return <FaVideo className="text-danger" />;
      case 'quiz': return <FaQuestionCircle className="text-purple" />;
      case 'essay': return <FaFileAlt className="text-dark" />;
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
      case 'active': return 'primary';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'lessons': return lessons;
      case 'assignments': return assignments;
      case 'quizzes': return quizzes;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || item.level === filterLevel;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesType = !filterType || item.type === filterType;
    
    return matchesSearch && matchesLevel && matchesStatus && matchesType;
  });

  const renderContentStats = () => {
    const data = getCurrentData();
    const published = data.filter(item => item.status === 'published').length;
    const draft = data.filter(item => item.status === 'draft').length;
    const featured = data.filter(item => item.featured).length;
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card stats-total">
            <Card.Body className="text-center">
              <FaBook className="stats-icon" />
              <h3 className="stats-number">{data.length}</h3>
              <p className="stats-label">Total {activeTab}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card stats-published">
            <Card.Body className="text-center">
              <FaCheckCircle className="stats-icon" />
              <h3 className="stats-number">{published}</h3>
              <p className="stats-label">Published</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card stats-draft">
            <Card.Body className="text-center">
              <FaClock className="stats-icon" />
              <h3 className="stats-number">{draft}</h3>
              <p className="stats-label">Draft</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card stats-featured">
            <Card.Body className="text-center">
              <FaStar className="stats-icon" />
              <h3 className="stats-number">{featured}</h3>
              <p className="stats-label">Featured</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderFilters = () => (
    <Row className="mb-4">
      <Col>
        <Card className="filters-card">
          <Card.Body>
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Search Content</Form.Label>
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
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => openContentModal('create')}
                >
                  <FaPlus className="me-2" />
                  Add {activeTab.slice(0, -1)}
                </Button>
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
  );

  const renderContentTable = () => (
    <Row>
      <Col>
        <Card className="content-table-card">
          <Card.Body>
            <Table responsive className="content-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Type</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="content-row">
                    <td>
                      <div className="content-info">
                        <div className="content-icon">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="content-details">
                          <div className="content-title">{item.title}</div>
                          <div className="content-description">{item.description}</div>
                          {item.featured && (
                            <Badge bg="warning" className="featured-badge">
                              <FaStar className="me-1" />Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="type-badge">
                        {item.type}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getLevelBadgeVariant(item.level)} className="level-badge">
                        {item.level}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(item.status)} className="status-badge">
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="performance-cell">
                        {activeTab === 'lessons' && (
                          <>
                            <small>Views: {item.views || 0}</small><br />
                            <small>Completions: {item.completions || 0}</small><br />
                            <small>Rating: {item.rating || 0}/5</small>
                          </>
                        )}
                        {activeTab === 'assignments' && (
                          <>
                            <small>Submissions: {item.submissions || 0}</small><br />
                            <small>Avg Score: {item.average_score || 0}%</small>
                          </>
                        )}
                        {activeTab === 'quizzes' && (
                          <>
                            <small>Attempts: {item.attempts || 0}</small><br />
                            <small>Pass Rate: {item.pass_rate || 0}%</small>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <FaCalendarAlt className="me-1" />
                        {item.created_at}
                        <br />
                        <small className="text-muted">by {item.author}</small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => openContentModal('view', item)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => openContentModal('edit', item)}
                          title="Edit Content"
                        >
                          <FaEdit />
                        </Button>
                        {item.status === 'published' ? (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleContentAction(item.id, 'unpublish')}
                            title="Unpublish"
                          >
                            <FaPause />
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleContentAction(item.id, 'publish')}
                            title="Publish"
                          >
                            <FaPlay />
                          </Button>
                        )}
                        {item.featured ? (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleContentAction(item.id, 'unfeature')}
                            title="Remove from Featured"
                          >
                            <FaStar />
                          </Button>
                        ) : (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleContentAction(item.id, 'feature')}
                            title="Add to Featured"
                          >
                            <FaStar />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this content?')) {
                              handleContentAction(item.id, 'delete');
                            }
                          }}
                          title="Delete Content"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-5">
                <FaBook size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No content found</h5>
                <p className="text-muted">Try adjusting your search criteria or create new content.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  if (loading && getCurrentData().length === 0) {
    return (
      <Container className="content-manager-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading content...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="content-manager-container">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="manager-header">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="manager-title">
                    <FaBook className="me-3" />
                    Content Manager
                  </h1>
                  <p className="manager-subtitle">
                    Create, edit, and manage educational content
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => openContentModal('create')}
                  >
                    <FaPlus className="me-2" />
                    Create Content
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

      {/* Content Tabs */}
      <Row className="mb-4">
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="content-tabs"
          >
            <Tab eventKey="lessons" title={
              <span>
                <FaBook className="me-2" />
                Lessons
              </span>
            }>
              {renderContentStats()}
              {renderFilters()}
              {renderContentTable()}
            </Tab>
            <Tab eventKey="assignments" title={
              <span>
                <FaFileAlt className="me-2" />
                Assignments
              </span>
            }>
              {renderContentStats()}
              {renderFilters()}
              {renderContentTable()}
            </Tab>
            <Tab eventKey="quizzes" title={
              <span>
                <FaQuestionCircle className="me-2" />
                Quizzes
              </span>
            }>
              {renderContentStats()}
              {renderFilters()}
              {renderContentTable()}
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Content Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" className="content-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create' && `Create New ${activeTab.slice(0, -1)}`}
            {modalType === 'edit' && `Edit ${activeTab.slice(0, -1)}`}
            {modalType === 'view' && `${activeTab.slice(0, -1)} Details`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'view' && selectedItem ? (
            <div className="content-details-view">
              <Row>
                <Col md={8}>
                  <div className="content-preview">
                    <div className="preview-header">
                      <div className="preview-icon">
                        {getTypeIcon(selectedItem.type)}
                      </div>
                      <div className="preview-info">
                        <h3>{selectedItem.title}</h3>
                        <p className="text-muted">{selectedItem.description}</p>
                        <div className="preview-badges">
                          <Badge bg={getLevelBadgeVariant(selectedItem.level)} className="me-2">
                            {selectedItem.level}
                          </Badge>
                          <Badge bg="info" className="me-2">
                            {selectedItem.type}
                          </Badge>
                          <Badge bg={getStatusBadgeVariant(selectedItem.status)}>
                            {selectedItem.status}
                          </Badge>
                          {selectedItem.featured && (
                            <Badge bg="warning" className="ms-2">
                              <FaStar className="me-1" />Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="preview-content mt-4">
                      <h5>Content Preview</h5>
                      <div className="content-preview-text">
                        {selectedItem.content || 'No content preview available.'}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <Card className="content-stats">
                    <Card.Header>
                      <h6 className="mb-0">Performance Statistics</h6>
                    </Card.Header>
                    <Card.Body>
                      {activeTab === 'lessons' && (
                        <>
                          <div className="stat-item">
                            <span>Views:</span>
                            <strong>{selectedItem.views || 0}</strong>
                          </div>
                          <div className="stat-item">
                            <span>Completions:</span>
                            <strong>{selectedItem.completions || 0}</strong>
                          </div>
                          <div className="stat-item">
                            <span>Rating:</span>
                            <strong>{selectedItem.rating || 0}/5</strong>
                          </div>
                          <div className="stat-item">
                            <span>Duration:</span>
                            <strong>{selectedItem.duration} min</strong>
                          </div>
                        </>
                      )}
                      {activeTab === 'assignments' && (
                        <>
                          <div className="stat-item">
                            <span>Submissions:</span>
                            <strong>{selectedItem.submissions || 0}</strong>
                          </div>
                          <div className="stat-item">
                            <span>Average Score:</span>
                            <strong>{selectedItem.average_score || 0}%</strong>
                          </div>
                          <div className="stat-item">
                            <span>Points:</span>
                            <strong>{selectedItem.points || 0}</strong>
                          </div>
                          <div className="stat-item">
                            <span>Time Limit:</span>
                            <strong>{selectedItem.time_limit} min</strong>
                          </div>
                        </>
                      )}
                      {activeTab === 'quizzes' && (
                        <>
                          <div className="stat-item">
                            <span>Attempts:</span>
                            <strong>{selectedItem.attempts || 0}</strong>
                          </div>
                          <div className="stat-item">
                            <span>Pass Rate:</span>
                            <strong>{selectedItem.pass_rate || 0}%</strong>
                          </div>
                          <div className="stat-item">
                            <span>Questions:</span>
                            <strong>{selectedItem.questions_count || 0}</strong>
                          </div>
                          <div className="stat-item">
                            <span>Time Limit:</span>
                            <strong>{selectedItem.time_limit} min</strong>
                          </div>
                        </>
                      )}
                      <div className="stat-item">
                        <span>Created:</span>
                        <strong>{selectedItem.created_at}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Updated:</span>
                        <strong>{selectedItem.updated_at}</strong>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <Form onSubmit={handleContentSubmit}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      value={contentFormData.title}
                      onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                      required
                      placeholder="Enter content title"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={contentFormData.description}
                      onChange={(e) => setContentFormData({ ...contentFormData, description: e.target.value })}
                      required
                      placeholder="Enter content description"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={contentFormData.content}
                      onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                      placeholder="Enter the main content..."
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Level *</Form.Label>
                        <Form.Select
                          value={contentFormData.level}
                          onChange={(e) => setContentFormData({ ...contentFormData, level: e.target.value })}
                          required
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type *</Form.Label>
                        <Form.Select
                          value={contentFormData.type}
                          onChange={(e) => setContentFormData({ ...contentFormData, type: e.target.value })}
                          required
                        >
                          <option value="reading">Reading</option>
                          <option value="writing">Writing</option>
                          <option value="speaking">Speaking</option>
                          <option value="listening">Listening</option>
                          <option value="video">Video</option>
                          <option value="quiz">Quiz</option>
                          <option value="essay">Essay</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration (minutes)</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max="300"
                          value={contentFormData.duration}
                          onChange={(e) => setContentFormData({ ...contentFormData, duration: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Difficulty (1-5)</Form.Label>
                        <Form.Range
                          min={1}
                          max={5}
                          value={contentFormData.difficulty}
                          onChange={(e) => setContentFormData({ ...contentFormData, difficulty: parseInt(e.target.value) })}
                        />
                        <div className="text-center">
                          <small className="text-muted">Level: {contentFormData.difficulty}</small>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          label="Published"
                          checked={contentFormData.is_published}
                          onChange={(e) => setContentFormData({ ...contentFormData, is_published: e.target.checked })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          label="Featured"
                          checked={contentFormData.featured}
                          onChange={(e) => setContentFormData({ ...contentFormData, featured: e.target.checked })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {modalType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {modalType !== 'view' && (
            <Button variant="primary" onClick={handleContentSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                modalType === 'create' ? `Create ${activeTab.slice(0, -1)}` : `Update ${activeTab.slice(0, -1)}`
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ContentManager;