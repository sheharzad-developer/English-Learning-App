import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Badge, Modal, Row, Col } from 'react-bootstrap';
import { lessonService } from '../../services/lessonService';

const QuizSection = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const exercises = await lessonService.getExercises({ type: 'mcq' });
      setQuizzes(exercises.slice(0, 5)); // Get first 5 quizzes
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      setError('Failed to load quizzes');
              // Set demo data with corrected format
        setQuizzes([
          {
            id: 1,
            title: 'Grammar Basics',
            description: 'Test your understanding of basic grammar rules',
            difficulty: 'beginner',
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'What is the correct form of "to be" for "I"?',
                options: ['am', 'is', 'are', 'be'],
                correctAnswer: 0,
                explanation: 'The first person singular form of "to be" is "am".'
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Which article is correct: "___ apple"?',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 1,
                explanation: '"An" is used before words that start with a vowel sound.'
              },
              {
                id: 3,
                type: 'true_false',
                question: 'The word "good" is an adverb.',
                correctAnswer: false,
                explanation: '"Good" is an adjective. The adverb form is "well".'
              }
            ]
          },
          {
            id: 2,
            title: 'Vocabulary Quiz',
            description: 'Test your vocabulary knowledge',
            difficulty: 'intermediate',
            questions: [
              {
                id: 4,
                type: 'multiple_choice',
                question: 'What does "elaborate" mean?',
                options: ['simple', 'detailed', 'quick', 'small'],
                correctAnswer: 1,
                explanation: '"Elaborate" means detailed or carefully developed.'
              },
              {
                id: 5,
                type: 'fill_blank',
                question: 'Complete: The weather is very ___ today.',
                correctAnswer: 'nice',
                explanation: 'Many words could fit here, but "nice" is a common positive adjective for weather.'
              }
            ]
          },
          {
            id: 3,
            title: 'Advanced Grammar',
            description: 'Challenge yourself with advanced grammar concepts',
            difficulty: 'advanced',
            questions: [
              {
                id: 6,
                type: 'multiple_select',
                question: 'Which of the following are modal verbs? (Select all that apply)',
                options: ['can', 'walk', 'should', 'run', 'must', 'dance'],
                correctAnswers: [0, 2, 4], // can, should, must
                explanation: 'Modal verbs express possibility, necessity, or permission.'
              },
              {
                id: 7,
                type: 'short_answer',
                question: 'What is the past participle of "go"?',
                correctAnswer: 'gone',
                explanation: 'The past participle of "go" is "gone" (have/has gone).'
              }
            ]
          }
        ]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizResults(null);
    setShowQuizModal(true);
    console.log('Starting quiz:', quiz.title, 'with questions:', quiz.questions);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      
      // Calculate score
      let correct = 0;
      currentQuiz.questions.forEach(question => {
        if (answers[question.id] === question.correct_answer) {
          correct++;
        }
      });
      
      const score = Math.round((correct / currentQuiz.questions.length) * 100);
      
      // Submit to backend if available
      try {
        await lessonService.submitQuiz(currentQuiz.id, answers);
      } catch (error) {
        console.log('Backend submission failed, using local results');
      }
      
      setQuizResults({
        score,
        correct,
        total: currentQuiz.questions.length,
        passed: score >= 70
      });
      
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setError('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setShowQuizModal(false);
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizResults(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'primary';
    }
  };

  if (loading && !quizzes.length) {
    return (
      <Card className="shadow-sm border-0">
        <Card.Body className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quizzes...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">🧩 Available Quizzes</h5>
            <Button variant="outline-primary" size="sm" onClick={fetchQuizzes}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </Button>
          </div>
          
          {error && (
            <Alert variant="warning" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {quizzes.length > 0 ? (
            <Row className="g-3">
              {quizzes.map((quiz) => (
                <Col md={6} key={quiz.id}>
                  <Card className="h-100 border quiz-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{quiz.title}</h6>
                        <Badge bg={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty || 'beginner'}
                        </Badge>
                      </div>
                      <p className="card-text text-muted small">
                        {quiz.description || 'Test your knowledge'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {quiz.questions?.length || 2} questions
                        </small>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => startQuiz(quiz)}
                        >
                          Start Quiz
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-patch-question text-muted" style={{ fontSize: '2rem' }}></i>
              <p className="text-muted mt-2">No quizzes available right now.</p>
              <Button variant="outline-primary" onClick={fetchQuizzes}>
                Try Again
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Quiz Modal */}
      <Modal 
        show={showQuizModal} 
        onHide={resetQuiz} 
        size="lg" 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentQuiz?.title}
            {!quizResults && (
              <Badge bg="info" className="ms-2">
                Question {currentQuestion + 1} of {currentQuiz?.questions?.length}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!quizResults ? (
            <div>
              {/* Progress Bar */}
              <ProgressBar 
                now={((currentQuestion + 1) / (currentQuiz?.questions?.length || 1)) * 100}
                className="mb-4"
                style={{ height: '8px' }}
              />
              
              {/* Current Question */}
              {currentQuiz?.questions?.[currentQuestion] && (
                <div>
                  <h5 className="mb-4">
                    {currentQuiz.questions[currentQuestion].question}
                  </h5>
                  
                  <Form>
                    {currentQuiz.questions[currentQuestion].options?.map((option, index) => (
                      <Form.Check
                        key={index}
                        type="radio"
                        id={`option-${index}`}
                        name={`question-${currentQuiz.questions[currentQuestion].id}`}
                        label={option}
                        checked={answers[currentQuiz.questions[currentQuestion].id] === index}
                        onChange={() => handleAnswerSelect(currentQuiz.questions[currentQuestion].id, index)}
                        className="mb-3 p-3 border rounded"
                      />
                    ))}
                  </Form>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Results */
            <div className="text-center">
              <div className="mb-4">
                <i 
                  className={`bi ${quizResults.passed ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-warning'}`}
                  style={{ fontSize: '4rem' }}
                ></i>
              </div>
              <h4 className="mb-3">
                {quizResults.passed ? 'Congratulations!' : 'Good Effort!'}
              </h4>
              <div className="row">
                <div className="col-4">
                  <h5 className="text-primary">{quizResults.score}%</h5>
                  <small className="text-muted">Score</small>
                </div>
                <div className="col-4">
                  <h5 className="text-success">{quizResults.correct}</h5>
                  <small className="text-muted">Correct</small>
                </div>
                <div className="col-4">
                  <h5 className="text-info">{quizResults.total}</h5>
                  <small className="text-muted">Total</small>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar 
                  now={quizResults.score} 
                  variant={quizResults.passed ? 'success' : 'warning'}
                  style={{ height: '12px' }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!quizResults ? (
            <div className="d-flex justify-content-between w-100">
              <Button variant="outline-secondary" onClick={resetQuiz}>
                Exit Quiz
              </Button>
              <Button 
                variant="primary" 
                onClick={nextQuestion}
                disabled={!answers[currentQuiz?.questions?.[currentQuestion]?.id]}
              >
                {currentQuestion < (currentQuiz?.questions?.length || 1) - 1 ? 'Next Question' : 'Submit Quiz'}
              </Button>
            </div>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Button variant="outline-primary" onClick={resetQuiz}>
                Close
              </Button>
              <Button variant="primary" onClick={fetchQuizzes}>
                Take Another Quiz
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .quiz-card {
          transition: all 0.2s ease;
        }
        .quiz-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
};

export default QuizSection;
