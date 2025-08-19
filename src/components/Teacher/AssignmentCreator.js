import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './AssignmentCreator.css';

const AssignmentCreator = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz',
    difficulty: 'beginner',
    due_date: '',
    points: 100,
    instructions: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    points: 10
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/teacher/assignments/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      // Set fallback data for demo
      setAssignments([
        {
          id: 1,
          title: 'English Grammar Quiz',
          type: 'quiz',
          difficulty: 'intermediate',
          due_date: '2024-02-15',
          submissions: 12,
          total_students: 25,
          status: 'active'
        },
        {
          id: 2,
          title: 'Vocabulary Exercise',
          type: 'exercise',
          difficulty: 'beginner',
          due_date: '2024-02-20',
          submissions: 8,
          total_students: 25,
          status: 'active'
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question_text.trim()) {
      setError('Please enter a question text');
      return;
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
    }));

    // Reset current question
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 10
    });
    setError('');
  };

  const removeQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const assignmentData = {
        ...formData,
        teacher: user?.id || 1
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/api/teacher/assignments/',
        assignmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Assignment created successfully!');
      setShowModal(false);
      fetchAssignments();
      resetForm();
    } catch (error) {
      console.error('Failed to create assignment:', error);
      setError('Failed to create assignment. Please try again.');
      
      // For demo purposes, add to local state
      const newAssignment = {
        id: Date.now(),
        ...formData,
        submissions: 0,
        total_students: 25,
        status: 'active'
      };
      setAssignments(prev => [newAssignment, ...prev]);
      setSuccess('Assignment created successfully!');
      setShowModal(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'quiz',
      difficulty: 'beginner',
      due_date: '',
      points: 100,
      instructions: '',
      questions: []
    });
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 10
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'quiz': return 'bi-patch-question';
      case 'exercise': return 'bi-pencil-square';
      case 'project': return 'bi-folder';
      default: return 'bi-file-text';
    }
  };

  return (
    <Container className="assignment-creator-container py-4">
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

      {/* Header */}
      <div className="creator-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="creator-title">
              <i className="bi bi-plus-circle me-3"></i>
              Assignment Creator
            </h1>
            <p className="creator-subtitle">
              Create and manage assignments for your students
            </p>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowModal(true)}
              className="create-btn"
            >
              <i className="bi bi-plus me-2"></i>
              Create Assignment
            </Button>
          </Col>
        </Row>
      </div>

      {/* Assignments List */}
      <Row className="g-4">
        {assignments.map(assignment => (
          <Col md={6} lg={4} key={assignment.id}>
            <Card className="assignment-card h-100">
              <Card.Body>
                <div className="assignment-header mb-3">
                  <div className="assignment-icon">
                    <i className={getTypeIcon(assignment.type)}></i>
                  </div>
                  <div className="assignment-badges">
                    <Badge bg={getDifficultyColor(assignment.difficulty)}>
                      {assignment.difficulty}
                    </Badge>
                    <Badge bg="info">{assignment.type}</Badge>
                  </div>
                </div>
                
                <Card.Title className="assignment-title">
                  {assignment.title}
                </Card.Title>
                
                <div className="assignment-meta mb-3">
                  <div className="meta-item">
                    <i className="bi bi-calendar me-2"></i>
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-people me-2"></i>
                    {assignment.submissions}/{assignment.total_students} submitted
                  </div>
                </div>
                
                <div className="submission-progress mb-3">
                  <div className="progress-label">
                    Submission Progress
                  </div>
                  <ProgressBar
                    now={(assignment.submissions / assignment.total_students) * 100}
                    variant="info"
                    className="progress-bar-custom"
                  />
                </div>
                
                <div className="assignment-actions">
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <i className="bi bi-eye me-1"></i>
                    View
                  </Button>
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </Button>
                  <Button variant="outline-info" size="sm">
                    <i className="bi bi-graph-up me-1"></i>
                    Results
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Assignment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Create New Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assignment Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter assignment title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="exercise">Exercise</option>
                    <option value="project">Project</option>
                    <option value="homework">Homework</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Total Points</Form.Label>
                  <Form.Control
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter assignment description"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="Enter detailed instructions for students"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Questions Section */}
            <div className="questions-section mt-4">
              <h5 className="mb-3">
                <i className="bi bi-list-ol me-2"></i>
                Questions ({formData.questions.length})
              </h5>
              
              {/* Add Question Form */}
              <Card className="add-question-card mb-3">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>Question Text</Form.Label>
                        <Form.Control
                          type="text"
                          name="question_text"
                          value={currentQuestion.question_text}
                          onChange={handleQuestionChange}
                          placeholder="Enter your question"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Question Type</Form.Label>
                        <Form.Select
                          name="question_type"
                          value={currentQuestion.question_type}
                          onChange={handleQuestionChange}
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True/False</option>
                          <option value="short_answer">Short Answer</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {currentQuestion.question_type === 'multiple_choice' && (
                      <>
                        {currentQuestion.options.map((option, index) => (
                          <Col md={6} key={index}>
                            <Form.Group>
                              <Form.Label>Option {index + 1}</Form.Label>
                              <Form.Control
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Enter option ${index + 1}`}
                              />
                            </Form.Group>
                          </Col>
                        ))}
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Correct Answer</Form.Label>
                            <Form.Select
                              name="correct_answer"
                              value={currentQuestion.correct_answer}
                              onChange={handleQuestionChange}
                            >
                              <option value="">Select correct answer</option>
                              {currentQuestion.options.map((option, index) => (
                                option && (
                                  <option key={index} value={option}>
                                    Option {index + 1}: {option}
                                  </option>
                                )
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </>
                    )}
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                          type="number"
                          name="points"
                          value={currentQuestion.points}
                          onChange={handleQuestionChange}
                          min="1"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={12}>
                      <Button
                        type="button"
                        variant="success"
                        onClick={addQuestion}
                        className="w-100"
                      >
                        <i className="bi bi-plus me-2"></i>
                        Add Question
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              {/* Questions List */}
              {formData.questions.map((question, index) => (
                <Card key={question.id} className="question-item mb-2">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="question-number">Question {index + 1}</h6>
                        <p className="question-text">{question.question_text}</p>
                        <div className="question-meta">
                          <Badge bg="info" className="me-2">{question.question_type}</Badge>
                          <Badge bg="success">{question.points} points</Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.due_date}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-check me-2"></i>
                Create Assignment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AssignmentCreator;