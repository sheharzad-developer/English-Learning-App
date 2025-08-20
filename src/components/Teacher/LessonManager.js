import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Modal, Alert, Badge, 
  Table, Tabs, Tab, InputGroup, Dropdown, ProgressBar, Accordion 
} from 'react-bootstrap';
import './LessonManager.css';

const LessonManager = () => {
  const [activeTab, setActiveTab] = useState('lessons');
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: 30,
    content: '',
    objectives: [''],
    vocabulary: [''],
    status: 'draft'
  });

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    lesson_id: '',
    time_limit: 10,
    questions: [{
      id: 1,
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    }]
  });

  // Demo data
  useEffect(() => {
    setLessons([
      {
        id: 1,
        title: 'Present Perfect Tense',
        description: 'Learn how to use present perfect tense in English',
        category: 'Grammar',
        level: 'intermediate',
        duration: 45,
        status: 'published',
        students_enrolled: 25,
        completion_rate: 85,
        created_at: '2024-01-15',
        updated_at: '2024-01-20'
      },
      {
        id: 2,
        title: 'Business Vocabulary',
        description: 'Essential vocabulary for professional settings',
        category: 'Vocabulary',
        level: 'advanced',
        duration: 60,
        status: 'published',
        students_enrolled: 18,
        completion_rate: 92,
        created_at: '2024-01-10',
        updated_at: '2024-01-18'
      },
      {
        id: 3,
        title: 'Conditional Sentences',
        description: 'Understanding first, second, and third conditionals',
        category: 'Grammar',
        level: 'intermediate',
        duration: 40,
        status: 'draft',
        students_enrolled: 0,
        completion_rate: 0,
        created_at: '2024-01-22',
        updated_at: '2024-01-22'
      }
    ]);

    setQuizzes([
      {
        id: 1,
        title: 'Present Perfect Quiz',
        lesson_id: 1,
        lesson_title: 'Present Perfect Tense',
        questions_count: 10,
        time_limit: 15,
        attempts: 45,
        average_score: 78,
        status: 'published',
        created_at: '2024-01-16'
      },
      {
        id: 2,
        title: 'Business Terms Assessment',
        lesson_id: 2,
        lesson_title: 'Business Vocabulary',
        questions_count: 15,
        time_limit: 20,
        attempts: 32,
        average_score: 85,
        status: 'published',
        created_at: '2024-01-12'
      }
    ]);
  }, []);

  const handleLessonSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        // Update existing lesson
        setLessons(prev => prev.map(lesson => 
          lesson.id === editingLesson.id 
            ? { 
                ...lesson, 
                ...lessonForm, 
                updated_at: new Date().toISOString().split('T')[0] 
              }
            : lesson
        ));
        setSuccess('Lesson updated successfully!');
      } else {
        // Create new lesson
        const newLesson = {
          id: Date.now(),
          ...lessonForm,
          students_enrolled: 0,
          completion_rate: 0,
          created_at: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString().split('T')[0]
        };
        setLessons(prev => [...prev, newLesson]);
        setSuccess('Lesson created successfully!');
      }
      
      setShowLessonModal(false);
      resetLessonForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save lesson. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    try {
      const selectedLesson = lessons.find(l => l.id === parseInt(quizForm.lesson_id));
      
      if (editingQuiz) {
        // Update existing quiz
        setQuizzes(prev => prev.map(quiz => 
          quiz.id === editingQuiz.id 
            ? { 
                ...quiz, 
                ...quizForm,
                lesson_title: selectedLesson?.title || '',
                questions_count: quizForm.questions.length,
                updated_at: new Date().toISOString().split('T')[0] 
              }
            : quiz
        ));
        setSuccess('Quiz updated successfully!');
      } else {
        // Create new quiz
        const newQuiz = {
          id: Date.now(),
          ...quizForm,
          lesson_title: selectedLesson?.title || '',
          questions_count: quizForm.questions.length,
          attempts: 0,
          average_score: 0,
          status: 'draft',
          created_at: new Date().toISOString().split('T')[0]
        };
        setQuizzes(prev => [...prev, newQuiz]);
        setSuccess('Quiz created successfully!');
      }
      
      setShowQuizModal(false);
      resetQuizForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save quiz. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: 30,
      content: '',
      objectives: [''],
      vocabulary: [''],
      status: 'draft'
    });
    setEditingLesson(null);
  };

  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      description: '',
      lesson_id: '',
      time_limit: 10,
      questions: [{
        id: 1,
        type: 'multiple_choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 1
      }]
    });
    setEditingQuiz(null);
  };

  const editLesson = (lesson) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      level: lesson.level,
      duration: lesson.duration,
      content: lesson.content || '',
      objectives: lesson.objectives || [''],
      vocabulary: lesson.vocabulary || [''],
      status: lesson.status
    });
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  const editQuiz = (quiz) => {
    setQuizForm({
      title: quiz.title,
      description: quiz.description || '',
      lesson_id: quiz.lesson_id.toString(),
      time_limit: quiz.time_limit,
      questions: quiz.questions || [{
        id: 1,
        type: 'multiple_choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 1
      }]
    });
    setEditingQuiz(quiz);
    setShowQuizModal(true);
  };

  const deleteLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      setSuccess('Lesson deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const deleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      setSuccess('Quiz deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const publishLesson = (lessonId) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, status: 'published' }
        : lesson
    ));
    setSuccess('Lesson published successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const addObjective = () => {
    setLessonForm(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index) => {
    setLessonForm(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index, value) => {
    setLessonForm(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const addVocabulary = () => {
    setLessonForm(prev => ({
      ...prev,
      vocabulary: [...prev.vocabulary, '']
    }));
  };

  const removeVocabulary = (index) => {
    setLessonForm(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.filter((_, i) => i !== index)
    }));
  };

  const updateVocabulary = (index, value) => {
    setLessonForm(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.map((word, i) => i === index ? value : word)
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    };
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (index) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((question, i) => 
        i === index ? { ...question, [field]: value } : question
      )
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((question, i) => 
        i === questionIndex 
          ? { 
              ...question, 
              options: question.options.map((option, j) => j === optionIndex ? value : option)
            }
          : question
      )
    }));
  };

  const getLevelBadge = (level) => {
    const badges = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
      expert: 'dark'
    };
    return badges[level] || 'secondary';
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'secondary',
      published: 'success',
      archived: 'dark'
    };
    return badges[status] || 'secondary';
  };

  return (
    <div className="lesson-manager">
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="manager-header mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h3><i className="fas fa-book me-2"></i>Lesson & Quiz Manager</h3>
            <p className="text-muted mb-0">Create and manage your teaching content</p>
          </Col>
          <Col md={6} className="text-end">
            <Button 
              variant="primary" 
              onClick={() => setShowLessonModal(true)}
              className="me-2"
            >
              <i className="fas fa-plus me-2"></i>New Lesson
            </Button>
            <Button 
              variant="success" 
              onClick={() => setShowQuizModal(true)}
            >
              <i className="fas fa-plus me-2"></i>New Quiz
            </Button>
          </Col>
        </Row>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="manager-tabs">
        <Tab eventKey="lessons" title={<><i className="fas fa-book me-2"></i>Lessons ({lessons.length})</>}>
          <Card className="lessons-card">
            <Card.Body>
              <div className="lessons-grid">
                {lessons.map((lesson) => (
                  <Card key={lesson.id} className="lesson-card">
                    <Card.Body>
                      <div className="lesson-header">
                        <h5 className="lesson-title">{lesson.title}</h5>
                        <div className="lesson-badges">
                          <Badge bg={getLevelBadge(lesson.level)}>{lesson.level}</Badge>
                          <Badge bg={getStatusBadge(lesson.status)} className="ms-1">
                            {lesson.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="lesson-description">{lesson.description}</p>
                      
                      <div className="lesson-stats mb-3">
                        <Row>
                          <Col xs={6}>
                            <div className="stat-item">
                              <i className="fas fa-users text-primary"></i>
                              <span>{lesson.students_enrolled} students</span>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="stat-item">
                              <i className="fas fa-clock text-info"></i>
                              <span>{lesson.duration} mins</span>
                            </div>
                          </Col>
                        </Row>
                        
                        {lesson.completion_rate > 0 && (
                          <div className="completion-rate mt-2">
                            <small className="text-muted">Completion Rate</small>
                            <ProgressBar 
                              now={lesson.completion_rate} 
                              label={`${lesson.completion_rate}%`}
                              variant="success"
                              style={{ height: '8px' }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="lesson-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => editLesson(lesson)}
                          className="me-2"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        {lesson.status === 'draft' && (
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => publishLesson(lesson.id)}
                            className="me-2"
                          >
                            <i className="fas fa-upload"></i>
                          </Button>
                        )}
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="quizzes" title={<><i className="fas fa-question-circle me-2"></i>Quizzes ({quizzes.length})</>}>
          <Card className="quizzes-card">
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Quiz Title</th>
                    <th>Lesson</th>
                    <th>Questions</th>
                    <th>Time Limit</th>
                    <th>Attempts</th>
                    <th>Avg Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>
                        <strong>{quiz.title}</strong>
                      </td>
                      <td>{quiz.lesson_title}</td>
                      <td>
                        <Badge bg="info">{quiz.questions_count}</Badge>
                      </td>
                      <td>{quiz.time_limit} mins</td>
                      <td>{quiz.attempts}</td>
                      <td>
                        {quiz.average_score > 0 && (
                          <Badge bg="success">{quiz.average_score}%</Badge>
                        )}
                      </td>
                      <td>
                        <Badge bg={getStatusBadge(quiz.status)}>
                          {quiz.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => editQuiz(quiz)}
                          className="me-2"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => deleteQuiz(quiz.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Lesson Modal */}
      <Modal show={showLessonModal} onHide={() => setShowLessonModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-book me-2"></i>
            {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleLessonSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Lesson Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm(prev => ({...prev, title: e.target.value}))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={lessonForm.category}
                    onChange={(e) => setLessonForm(prev => ({...prev, category: e.target.value}))}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Listening">Listening</option>
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={lessonForm.description}
                onChange={(e) => setLessonForm(prev => ({...prev, description: e.target.value}))}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    value={lessonForm.level}
                    onChange={(e) => setLessonForm(prev => ({...prev, level: e.target.value}))}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm(prev => ({...prev, duration: parseInt(e.target.value)}))}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Lesson Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={lessonForm.content}
                onChange={(e) => setLessonForm(prev => ({...prev, content: e.target.value}))}
                placeholder="Enter the main content of your lesson..."
              />
            </Form.Group>

            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Learning Objectives</Accordion.Header>
                <Accordion.Body>
                  {lessonForm.objectives.map((objective, index) => (
                    <InputGroup key={index} className="mb-2">
                      <Form.Control
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder={`Objective ${index + 1}`}
                      />
                      {lessonForm.objectives.length > 1 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => removeObjective(index)}
                        >
                          <i className="fas fa-minus"></i>
                        </Button>
                      )}
                    </InputGroup>
                  ))}
                  <Button variant="outline-primary" onClick={addObjective}>
                    <i className="fas fa-plus me-2"></i>Add Objective
                  </Button>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Key Vocabulary</Accordion.Header>
                <Accordion.Body>
                  {lessonForm.vocabulary.map((word, index) => (
                    <InputGroup key={index} className="mb-2">
                      <Form.Control
                        type="text"
                        value={word}
                        onChange={(e) => updateVocabulary(index, e.target.value)}
                        placeholder={`Vocabulary word ${index + 1}`}
                      />
                      {lessonForm.vocabulary.length > 1 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => removeVocabulary(index)}
                        >
                          <i className="fas fa-minus"></i>
                        </Button>
                      )}
                    </InputGroup>
                  ))}
                  <Button variant="outline-primary" onClick={addVocabulary}>
                    <i className="fas fa-plus me-2"></i>Add Word
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Form.Group className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={lessonForm.status}
                onChange={(e) => setLessonForm(prev => ({...prev, status: e.target.value}))}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLessonModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <i className="fas fa-save me-2"></i>
              {editingLesson ? 'Update Lesson' : 'Create Lesson'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quiz Modal */}
      <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-question-circle me-2"></i>
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleQuizSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm(prev => ({...prev, title: e.target.value}))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associated Lesson</Form.Label>
                  <Form.Select
                    value={quizForm.lesson_id}
                    onChange={(e) => setQuizForm(prev => ({...prev, lesson_id: e.target.value}))}
                    required
                  >
                    <option value="">Select Lesson</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={quizForm.description}
                    onChange={(e) => setQuizForm(prev => ({...prev, description: e.target.value}))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Limit (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={quizForm.time_limit}
                    onChange={(e) => setQuizForm(prev => ({...prev, time_limit: parseInt(e.target.value)}))}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mb-3">Questions</h5>
            {quizForm.questions.map((question, questionIndex) => (
              <Card key={question.id} className="question-card mb-3">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="mb-0">Question {questionIndex + 1}</h6>
                    </Col>
                    <Col xs="auto">
                      {quizForm.questions.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Question Text</Form.Label>
                        <Form.Control
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                          value={question.type}
                          onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True/False</option>
                          <option value="fill_blank">Fill in Blank</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value))}
                          min="1"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {question.type === 'multiple_choice' && (
                    <div className="mb-3">
                      <Form.Label>Answer Options</Form.Label>
                      {question.options.map((option, optionIndex) => (
                        <InputGroup key={optionIndex} className="mb-2">
                          <InputGroup.Text>
                            <Form.Check
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                            />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            value={option}
                            onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </InputGroup>
                      ))}
                    </div>
                  )}

                  {question.type === 'true_false' && (
                    <Form.Group className="mb-3">
                      <Form.Label>Correct Answer</Form.Label>
                      <Form.Select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value === 'true')}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  {question.type === 'fill_blank' && (
                    <Form.Group className="mb-3">
                      <Form.Label>Correct Answer</Form.Label>
                      <Form.Control
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                        placeholder="Enter the correct answer"
                      />
                    </Form.Group>
                  )}

                  <Form.Group>
                    <Form.Label>Explanation (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={question.explanation}
                      onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                      placeholder="Provide an explanation for the correct answer"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            ))}

            <Button variant="outline-primary" onClick={addQuestion}>
              <i className="fas fa-plus me-2"></i>Add Question
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuizModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              <i className="fas fa-save me-2"></i>
              {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default LessonManager;