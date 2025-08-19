import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Badge, Modal, Row, Col } from 'react-bootstrap';
import { lessonService } from '../../services/lessonService';
import './QuizComponent.css';

const QuizComponent = ({ 
  questions = [], 
  onComplete, 
  timeLimit = null, 
  showProgress = true,
  allowReview = true,
  shuffleQuestions = false,
  shuffleOptions = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [processedQuestions, setProcessedQuestions] = useState([]);

  useEffect(() => {
    // Process questions (shuffle if needed)
    let processed = [...questions];
    if (shuffleQuestions) {
      processed = shuffleArray(processed);
    }
    
    if (shuffleOptions) {
      processed = processed.map(q => ({
        ...q,
        options: q.options ? shuffleArray([...q.options]) : q.options
      }));
    }
    
    setProcessedQuestions(processed);
  }, [questions, shuffleQuestions, shuffleOptions]);

  useEffect(() => {
    // Timer logic
    if (timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isCompleted, timeLimit]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleMultipleChoice = (questionId, optionIndex, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(i => i !== optionIndex)
        : [...currentAnswers, optionIndex];
      handleAnswerChange(questionId, newAnswers);
    } else {
      handleAnswerChange(questionId, optionIndex);
    }
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNext = () => {
    if (currentQuestionIndex < processedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      // Calculate results
      let correctAnswers = 0;
      const questionResults = processedQuestions.map(question => {
        const userAnswer = answers[question.id];
        const isCorrect = checkAnswer(question, userAnswer);
        if (isCorrect) correctAnswers++;
        
        return {
          questionId: question.id,
          question: question.question,
          userAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
          explanation: question.explanation
        };
      });

      const score = Math.round((correctAnswers / processedQuestions.length) * 100);
      
      const quizResults = {
        score,
        correctAnswers,
        totalQuestions: processedQuestions.length,
        timeSpent: timeLimit ? timeLimit - timeRemaining : null,
        questionResults
      };

      setResults(quizResults);
      setIsCompleted(true);
      setShowResults(true);

      // Submit to backend if onComplete callback provided
      if (onComplete) {
        await onComplete(quizResults);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const checkAnswer = (question, userAnswer) => {
    if (!userAnswer && userAnswer !== 0) return false;
    
    switch (question.type) {
      case 'multiple_choice':
        return userAnswer === question.correct_answer;
      case 'multiple_select':
        const correctAnswers = question.correct_answer || [];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
        return correctAnswers.length === userAnswers.length &&
               correctAnswers.every(answer => userAnswers.includes(answer));
      case 'true_false':
        return userAnswer === question.correct_answer;
      case 'fill_blank':
      case 'short_answer':
        const correctText = (question.correct_answer || '').toLowerCase().trim();
        const userText = (userAnswer || '').toLowerCase().trim();
        return correctText === userText;
      default:
        return false;
    }
  };

  const renderQuestion = (question) => {
    const userAnswer = answers[question.id];
    
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="question-options">
            {question.options?.map((option, index) => (
              <div 
                key={index}
                className={`option-item ${
                  userAnswer === index ? 'selected' : ''
                }`}
                onClick={() => handleMultipleChoice(question.id, index)}
              >
                <Form.Check 
                  type="radio"
                  name={`question-${question.id}`}
                  checked={userAnswer === index}
                  onChange={() => handleMultipleChoice(question.id, index)}
                  label={option}
                />
              </div>
            ))}
          </div>
        );
        
      case 'multiple_select':
        return (
          <div className="question-options">
            {question.options?.map((option, index) => (
              <div 
                key={index}
                className={`option-item ${
                  (userAnswer || []).includes(index) ? 'selected' : ''
                }`}
                onClick={() => handleMultipleChoice(question.id, index, true)}
              >
                <Form.Check 
                  type="checkbox"
                  checked={(userAnswer || []).includes(index)}
                  onChange={() => handleMultipleChoice(question.id, index, true)}
                  label={option}
                />
              </div>
            ))}
          </div>
        );
        
      case 'true_false':
        return (
          <div className="true-false-options">
            <div 
              className={`option-item ${userAnswer === true ? 'selected' : ''}`}
              onClick={() => handleAnswerChange(question.id, true)}
            >
              <Form.Check 
                type="radio"
                name={`question-${question.id}`}
                checked={userAnswer === true}
                onChange={() => handleAnswerChange(question.id, true)}
                label="True"
              />
            </div>
            <div 
              className={`option-item ${userAnswer === false ? 'selected' : ''}`}
              onClick={() => handleAnswerChange(question.id, false)}
            >
              <Form.Check 
                type="radio"
                name={`question-${question.id}`}
                checked={userAnswer === false}
                onChange={() => handleAnswerChange(question.id, false)}
                label="False"
              />
            </div>
          </div>
        );
        
      case 'fill_blank':
        return (
          <Form.Group>
            <Form.Control
              type="text"
              value={userAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="fill-blank-input"
            />
          </Form.Group>
        );
        
      case 'short_answer':
        return (
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={userAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="short-answer-input"
            />
          </Form.Group>
        );
        
      default:
        return <div>Unsupported question type</div>;
    }
  };

  const renderQuestionNavigation = () => {
    return (
      <div className="question-navigation">
        <div className="nav-grid">
          {processedQuestions.map((_, index) => {
            const questionId = processedQuestions[index].id;
            const isAnswered = answers[questionId] !== undefined;
            const isFlagged = flaggedQuestions.has(questionId);
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={index}
                className={`nav-item ${
                  isCurrent ? 'current' : ''
                } ${
                  isAnswered ? 'answered' : ''
                } ${
                  isFlagged ? 'flagged' : ''
                }`}
                onClick={() => navigateToQuestion(index)}
              >
                {index + 1}
                {isFlagged && <span className="flag-icon">🚩</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;
    
    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'warning';
      return 'danger';
    };
    
    return (
      <div className="quiz-results">
        <div className="results-header text-center mb-4">
          <h3>Quiz Complete!</h3>
          <div className="score-display">
            <div className={`score-circle bg-${getScoreColor(results.score)}`}>
              <span className="score-number">{results.score}%</span>
            </div>
            <p className="score-text">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
            {results.timeSpent && (
              <p className="time-text">
                Completed in {formatTime(results.timeSpent)}
              </p>
            )}
          </div>
        </div>
        
        {allowReview && (
          <div className="text-center">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowReviewModal(true)}
            >
              Review Answers
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (processedQuestions.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Questions Available</Alert.Heading>
        <p>There are no questions to display for this quiz.</p>
      </Alert>
    );
  }

  if (showResults) {
    return renderResults();
  }

  const currentQuestion = processedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / processedQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="quiz-component">
      {/* Quiz Header */}
      <div className="quiz-header">
        <Row className="align-items-center">
          <Col md={6}>
            {showProgress && (
              <div className="progress-info">
                <div className="d-flex justify-content-between mb-2">
                  <span>Question {currentQuestionIndex + 1} of {processedQuestions.length}</span>
                  <span>{answeredCount} answered</span>
                </div>
                <ProgressBar 
                  now={progress} 
                  variant="primary"
                  className="quiz-progress"
                />
              </div>
            )}
          </Col>
          <Col md={6} className="text-end">
            {timeLimit && (
              <div className="timer">
                <Badge 
                  bg={timeRemaining < 60 ? 'danger' : 'primary'}
                  className="timer-badge"
                >
                  <i className="fas fa-clock me-1"></i>
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Question Content */}
      <Card className="question-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg="info" className="me-2">
              {currentQuestion.type?.replace('_', ' ')}
            </Badge>
            <span className="question-points">
              {currentQuestion.points || 1} point{(currentQuestion.points || 1) !== 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => handleFlagQuestion(currentQuestion.id)}
            className={flaggedQuestions.has(currentQuestion.id) ? 'flagged' : ''}
          >
            <i className="fas fa-flag"></i>
            {flaggedQuestions.has(currentQuestion.id) ? ' Flagged' : ' Flag'}
          </Button>
        </Card.Header>
        
        <Card.Body>
          <div className="question-text mb-4">
            <h5>{currentQuestion.question}</h5>
            {currentQuestion.description && (
              <p className="text-muted">{currentQuestion.description}</p>
            )}
          </div>
          
          {renderQuestion(currentQuestion)}
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="quiz-navigation">
        <Row className="align-items-center">
          <Col md={6}>
            <div className="nav-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="me-2"
              >
                <i className="fas fa-chevron-left me-1"></i>
                Previous
              </Button>
              
              {currentQuestionIndex < processedQuestions.length - 1 ? (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                >
                  Next
                  <i className="fas fa-chevron-right ms-1"></i>
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  onClick={handleSubmitQuiz}
                  disabled={answeredCount === 0}
                >
                  Submit Quiz
                  <i className="fas fa-check ms-1"></i>
                </Button>
              )}
            </div>
          </Col>
          <Col md={6}>
            {renderQuestionNavigation()}
          </Col>
        </Row>
      </div>

      {/* Review Modal */}
      <Modal 
        show={showReviewModal} 
        onHide={() => setShowReviewModal(false)}
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Answers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {results?.questionResults.map((result, index) => (
            <div key={index} className="review-item mb-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6>Question {index + 1}</h6>
                <Badge bg={result.isCorrect ? 'success' : 'danger'}>
                  {result.isCorrect ? 'Correct' : 'Incorrect'}
                </Badge>
              </div>
              <p className="question-text">{result.question}</p>
              <div className="answer-review">
                <p><strong>Your Answer:</strong> {result.userAnswer}</p>
                {!result.isCorrect && (
                  <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                )}
                {result.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizComponent;