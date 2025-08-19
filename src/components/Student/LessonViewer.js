import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Button, ProgressBar, Badge, Modal, Form, Alert, Spinner, Nav, Tab } from 'react-bootstrap';
import { FaPlay, FaPause, FaStop, FaForward, FaBackward, FaBookOpen, FaHeadphones, FaMicrophone, FaCheck, FaTimes, FaStar, FaLightbulb, FaQuestionCircle, FaChartLine, FaClock, FaUser, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import './LessonViewer.css';

const LessonViewer = ({ lessonId, onComplete }) => {
  const { user } = useContext(AuthContext);
  const [lesson, setLesson] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());

  // Demo lesson data
  const demoLesson = {
    id: lessonId || 1,
    title: 'Introduction to English Grammar',
    description: 'Learn the fundamentals of English grammar including parts of speech, sentence structure, and basic rules.',
    level: 'Beginner',
    duration: '45 minutes',
    instructor: 'Sarah Johnson',
    sections: [
      {
        id: 1,
        title: 'Parts of Speech',
        type: 'video',
        content: 'Understanding nouns, verbs, adjectives, and adverbs in English.',
        duration: '10 minutes',
        videoUrl: '/videos/parts-of-speech.mp4',
        transcript: 'Welcome to our lesson on parts of speech. In English, we have eight main parts of speech: nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections. Let\'s start with nouns...'
      },
      {
        id: 2,
        title: 'Sentence Structure',
        type: 'reading',
        content: 'Learn how to construct proper sentences in English.',
        duration: '15 minutes',
        text: 'A sentence is a group of words that expresses a complete thought. Every sentence must have a subject and a predicate. The subject tells us who or what the sentence is about, while the predicate tells us what the subject does or is.'
      },
      {
        id: 3,
        title: 'Practice Exercise',
        type: 'exercise',
        content: 'Interactive exercises to practice what you\'ve learned.',
        duration: '15 minutes',
        exercises: [
          {
            question: 'Identify the noun in this sentence: "The cat sleeps on the mat."',
            options: ['cat', 'sleeps', 'on', 'the'],
            correct: 0
          },
          {
            question: 'What is the verb in this sentence: "She runs quickly."',
            options: ['She', 'runs', 'quickly'],
            correct: 1
          }
        ]
      },
      {
        id: 4,
        title: 'Listening Practice',
        type: 'audio',
        content: 'Listen to native speakers and practice pronunciation.',
        duration: '5 minutes',
        audioUrl: '/audio/grammar-examples.mp3',
        transcript: 'Listen carefully to these examples of correct grammar usage...'
      }
    ],
    vocabulary: [
      { word: 'noun', definition: 'A word that names a person, place, thing, or idea', example: 'The dog barked loudly.' },
      { word: 'verb', definition: 'A word that expresses action or state of being', example: 'She runs every morning.' },
      { word: 'adjective', definition: 'A word that describes or modifies a noun', example: 'The red car is fast.' },
      { word: 'adverb', definition: 'A word that modifies a verb, adjective, or another adverb', example: 'He speaks clearly.' }
    ],
    quiz: [
      {
        question: 'Which of the following is a noun?',
        options: ['quickly', 'beautiful', 'happiness', 'run'],
        correct: 2,
        explanation: 'Happiness is a noun because it names an abstract concept or idea.'
      },
      {
        question: 'In the sentence "The quick brown fox jumps", what is the adjective?',
        options: ['quick', 'fox', 'jumps', 'the'],
        correct: 0,
        explanation: 'Quick is an adjective because it describes the noun "fox".'
      },
      {
        question: 'What type of word is "slowly" in "She walks slowly"?',
        options: ['noun', 'verb', 'adjective', 'adverb'],
        correct: 3,
        explanation: 'Slowly is an adverb because it modifies the verb "walks".'
      }
    ]
  };

  useEffect(() => {
    fetchLesson();
    setStartTime(Date.now());
    
    // Track study time
    const interval = setInterval(() => {
      if (startTime) {
        setStudyTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lessonId]);

  useEffect(() => {
    // Update progress based on completed sections
    const totalSections = lesson?.sections?.length || 0;
    const completed = completedSections.size;
    setProgress(totalSections > 0 ? (completed / totalSections) * 100 : 0);
  }, [completedSections, lesson]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/lessons/${lessonId}/`);
      // setLesson(response.data);
      
      setLesson(demoLesson);
      setVocabulary(demoLesson.vocabulary);
    } catch (error) {
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionComplete = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    
    // Auto-advance to next section
    if (currentSection < lesson.sections.length - 1) {
      setTimeout(() => {
        setCurrentSection(prev => prev + 1);
      }, 1000);
    } else {
      // Lesson completed
      setShowQuiz(true);
    }
  };

  const handleQuizSubmit = () => {
    const results = lesson.quiz.map((question, index) => {
      const userAnswer = quizAnswers[index];
      const isCorrect = userAnswer === question.correct;
      return {
        question: question.question,
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
        correctAnswer: question.options[question.correct],
        isCorrect,
        explanation: question.explanation
      };
    });
    
    const score = results.filter(r => r.isCorrect).length;
    const percentage = Math.round((score / lesson.quiz.length) * 100);
    
    setQuizResults({ results, score, total: lesson.quiz.length, percentage });
    
    // Save progress
    saveLessonProgress(percentage);
  };

  const saveLessonProgress = async (quizScore) => {
    try {
      const progressData = {
        lesson_id: lesson.id,
        progress_percentage: progress,
        quiz_score: quizScore,
        study_time: studyTime,
        completed_sections: Array.from(completedSections),
        notes: notes
      };
      
      // In a real app, this would be an API call
      // await axios.post('/api/student/progress/', progressData);
      
      if (onComplete) {
        onComplete(progressData);
      }
    } catch (error) {
      setError('Failed to save progress');
    }
  };

  const saveNotes = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.post('/api/student/notes/', { lesson_id: lesson.id, notes });
      setShowNotes(false);
    } catch (error) {
      setError('Failed to save notes');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'video':
        return (
          <div className="video-section">
            <div className="video-player">
              <div className="video-placeholder">
                <FaPlay size={48} className="play-icon" />
                <p>Video: {section.title}</p>
              </div>
              <div className="video-controls">
                <Button variant="primary" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
                <Button variant="outline-secondary">
                  <FaBackward />
                </Button>
                <Button variant="outline-secondary">
                  <FaForward />
                </Button>
                <Button variant="outline-secondary" onClick={toggleFullscreen}>
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </Button>
              </div>
            </div>
            {section.transcript && (
              <div className="transcript">
                <h6>Transcript:</h6>
                <p>{section.transcript}</p>
              </div>
            )}
          </div>
        );
      
      case 'reading':
        return (
          <div className="reading-section">
            <div className="reading-content">
              <h5>{section.title}</h5>
              <p>{section.text}</p>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="audio-section">
            <div className="audio-player">
              <FaHeadphones size={48} className="audio-icon" />
              <h5>{section.title}</h5>
              <div className="audio-controls">
                <Button variant="primary" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
                <Button variant="outline-secondary">
                  <FaMicrophone />
                </Button>
              </div>
            </div>
            {section.transcript && (
              <div className="transcript">
                <h6>Transcript:</h6>
                <p>{section.transcript}</p>
              </div>
            )}
          </div>
        );
      
      case 'exercise':
        return (
          <div className="exercise-section">
            <h5>{section.title}</h5>
            {section.exercises.map((exercise, index) => (
              <Card key={index} className="exercise-card mb-3">
                <Card.Body>
                  <h6>Question {index + 1}</h6>
                  <p>{exercise.question}</p>
                  {exercise.options.map((option, optIndex) => (
                    <Form.Check
                      key={optIndex}
                      type="radio"
                      name={`exercise-${index}`}
                      label={option}
                      className="mb-2"
                    />
                  ))}
                </Card.Body>
              </Card>
            ))}
          </div>
        );
      
      default:
        return <div>Unknown section type</div>;
    }
  };

  if (loading) {
    return (
      <div className="lesson-viewer-loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <h5>Error</h5>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchLesson}>
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!lesson) {
    return (
      <Alert variant="warning">
        <h5>Lesson Not Found</h5>
        <p>The requested lesson could not be found.</p>
      </Alert>
    );
  }

  return (
    <div className={`lesson-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Lesson Header */}
      <Card className="lesson-header">
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="lesson-info">
                <h2 className="lesson-title">{lesson.title}</h2>
                <p className="lesson-description">{lesson.description}</p>
                <div className="lesson-meta">
                  <Badge bg="primary" className="me-2">
                    <FaUser className="me-1" />{lesson.instructor}
                  </Badge>
                  <Badge bg="info" className="me-2">
                    {lesson.level}
                  </Badge>
                  <Badge bg="secondary" className="me-2">
                    <FaClock className="me-1" />{lesson.duration}
                  </Badge>
                  <Badge bg="success">
                    Study Time: {formatTime(studyTime)}
                  </Badge>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="lesson-progress">
                <h6>Progress</h6>
                <ProgressBar 
                  now={progress} 
                  label={`${Math.round(progress)}%`}
                  className="mb-3"
                />
                <div className="lesson-actions">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => setShowNotes(true)}
                    className="me-2"
                  >
                    <FaBookOpen className="me-1" />Notes
                  </Button>
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    onClick={() => setShowVocabulary(true)}
                  >
                    <FaLightbulb className="me-1" />Vocabulary
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Section Navigation */}
      <Card className="section-navigation">
        <Card.Body>
          <Nav variant="pills" className="section-nav">
            {lesson.sections.map((section, index) => (
              <Nav.Item key={section.id}>
                <Nav.Link 
                  active={currentSection === index}
                  onClick={() => setCurrentSection(index)}
                  className={completedSections.has(section.id) ? 'completed' : ''}
                >
                  {completedSections.has(section.id) && <FaCheck className="me-2" />}
                  {section.title}
                  <small className="d-block">{section.duration}</small>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      {/* Current Section Content */}
      <Card className="section-content">
        <Card.Body>
          {lesson.sections[currentSection] && renderSection(lesson.sections[currentSection])}
          
          <div className="section-actions mt-4">
            <Button 
              variant="outline-secondary" 
              disabled={currentSection === 0}
              onClick={() => setCurrentSection(prev => prev - 1)}
              className="me-2"
            >
              <FaBackward className="me-2" />Previous
            </Button>
            
            <Button 
              variant="success" 
              onClick={() => handleSectionComplete(lesson.sections[currentSection].id)}
              className="me-2"
            >
              <FaCheck className="me-2" />Complete Section
            </Button>
            
            <Button 
              variant="outline-secondary" 
              disabled={currentSection === lesson.sections.length - 1}
              onClick={() => setCurrentSection(prev => prev + 1)}
            >
              Next<FaForward className="ms-2" />
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Notes Modal */}
      <Modal show={showNotes} onHide={() => setShowNotes(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lesson Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Your Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotes(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveNotes}>
            Save Notes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Vocabulary Modal */}
      <Modal show={showVocabulary} onHide={() => setShowVocabulary(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lesson Vocabulary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {vocabulary.map((item, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card className="vocabulary-card">
                  <Card.Body>
                    <h6 className="vocabulary-word">{item.word}</h6>
                    <p className="vocabulary-definition">{item.definition}</p>
                    <small className="vocabulary-example">
                      <strong>Example:</strong> {item.example}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      {/* Quiz Modal */}
      <Modal show={showQuiz} onHide={() => setShowQuiz(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lesson Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!quizResults ? (
            <>
              <p>Test your understanding of this lesson:</p>
              {lesson.quiz.map((question, index) => (
                <Card key={index} className="quiz-question mb-3">
                  <Card.Body>
                    <h6>Question {index + 1}</h6>
                    <p>{question.question}</p>
                    {question.options.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="radio"
                        name={`quiz-${index}`}
                        label={option}
                        checked={quizAnswers[index] === optIndex}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, [index]: optIndex }))}
                        className="mb-2"
                      />
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </>
          ) : (
            <div className="quiz-results">
              <div className="results-header text-center mb-4">
                <h4>Quiz Results</h4>
                <div className="score-display">
                  <span className="score">{quizResults.score}/{quizResults.total}</span>
                  <span className="percentage">({quizResults.percentage}%)</span>
                </div>
                <Badge bg={quizResults.percentage >= 70 ? 'success' : 'warning'} className="score-badge">
                  {quizResults.percentage >= 70 ? 'Passed' : 'Needs Improvement'}
                </Badge>
              </div>
              
              {quizResults.results.map((result, index) => (
                <Card key={index} className={`result-card mb-3 ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <Card.Body>
                    <div className="result-header">
                      <h6>Question {index + 1}</h6>
                      {result.isCorrect ? (
                        <FaCheck className="text-success" />
                      ) : (
                        <FaTimes className="text-danger" />
                      )}
                    </div>
                    <p className="question">{result.question}</p>
                    <div className="answers">
                      <p><strong>Your answer:</strong> {result.userAnswer}</p>
                      {!result.isCorrect && (
                        <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
                      )}
                    </div>
                    <div className="explanation">
                      <small><strong>Explanation:</strong> {result.explanation}</small>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!quizResults ? (
            <>
              <Button variant="secondary" onClick={() => setShowQuiz(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
              >
                Submit Quiz
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setShowQuiz(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LessonViewer;