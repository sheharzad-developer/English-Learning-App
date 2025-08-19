import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, Badge, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './FillInBlankExercise.css';

const FillInBlankExercise = ({
  text = "",
  blanks = [],
  title = "Fill in the Blanks",
  instructions = "Complete the text by filling in the missing words",
  onComplete,
  showFeedback = true,
  allowRetry = true,
  timeLimit = null,
  hints = {},
  caseSensitive = false,
  showWordBank = false,
  wordBank = [],
  autoCheck = false
}) => {
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showHints, setShowHints] = useState({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [availableWords, setAvailableWords] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [blankResults, setBlankResults] = useState({});
  const inputRefs = useRef({});

  useEffect(() => {
    // Initialize available words for word bank
    if (showWordBank && wordBank.length > 0) {
      setAvailableWords([...wordBank]);
    }
  }, [showWordBank, wordBank]);

  useEffect(() => {
    // Timer logic
    if (timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isCompleted, timeLimit]);

  useEffect(() => {
    // Auto-check answers if enabled
    if (autoCheck && Object.keys(answers).length > 0) {
      const timer = setTimeout(() => {
        checkAnswers(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [answers, autoCheck]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (blankId, value) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
    
    // Update word bank if enabled
    if (showWordBank) {
      const oldValue = answers[blankId];
      
      // Return old word to available words
      if (oldValue && usedWords.includes(oldValue)) {
        setAvailableWords(prev => [...prev, oldValue]);
        setUsedWords(prev => prev.filter(word => word !== oldValue));
      }
      
      // Remove new word from available words
      if (value && availableWords.includes(value)) {
        setAvailableWords(prev => prev.filter(word => word !== value));
        setUsedWords(prev => [...prev, value]);
      }
    }
  };

  const handleWordBankClick = (word) => {
    if (currentFocus && availableWords.includes(word)) {
      handleInputChange(currentFocus, word);
      
      // Focus next empty input
      const nextBlank = blanks.find(blank => 
        blank.id !== currentFocus && !answers[blank.id]
      );
      
      if (nextBlank && inputRefs.current[nextBlank.id]) {
        inputRefs.current[nextBlank.id].focus();
        setCurrentFocus(nextBlank.id);
      }
    }
  };

  const handleInputFocus = (blankId) => {
    setCurrentFocus(blankId);
  };

  const handleKeyPress = (e, blankId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Move to next blank
      const currentIndex = blanks.findIndex(blank => blank.id === blankId);
      const nextBlank = blanks[currentIndex + 1];
      
      if (nextBlank && inputRefs.current[nextBlank.id]) {
        inputRefs.current[nextBlank.id].focus();
      } else {
        // If last blank, submit if all filled
        const allFilled = blanks.every(blank => answers[blank.id]?.trim());
        if (allFilled) {
          handleSubmit();
        }
      }
    }
  };

  const checkAnswers = (final = true) => {
    const results = {};
    let correctCount = 0;
    
    blanks.forEach(blank => {
      const userAnswer = answers[blank.id]?.trim() || '';
      const correctAnswers = Array.isArray(blank.correctAnswer) 
        ? blank.correctAnswer 
        : [blank.correctAnswer];
      
      const isCorrect = correctAnswers.some(correct => 
        caseSensitive 
          ? userAnswer === correct.trim()
          : userAnswer.toLowerCase() === correct.trim().toLowerCase()
      );
      
      results[blank.id] = {
        isCorrect,
        userAnswer,
        correctAnswers,
        feedback: isCorrect ? 'Correct!' : `Correct answer(s): ${correctAnswers.join(', ')}`
      };
      
      if (isCorrect) correctCount++;
    });
    
    setBlankResults(results);
    
    if (final) {
      const finalScore = Math.round((correctCount / blanks.length) * 100);
      setScore(finalScore);
      
      // Generate feedback
      let feedbackText = '';
      if (finalScore === 100) {
        feedbackText = '🎉 Perfect! All blanks are correct!';
      } else if (finalScore >= 80) {
        feedbackText = '👍 Great job! Most answers are correct.';
      } else if (finalScore >= 60) {
        feedbackText = '👌 Good effort! Some answers need correction.';
      } else {
        feedbackText = '💪 Keep practicing! Review the answers and try again.';
      }
      
      setFeedback(feedbackText);
      setIsCompleted(true);
      setShowResults(true);
      
      // Call completion callback
      if (onComplete) {
        onComplete({
          score: finalScore,
          correctAnswers: correctCount,
          totalBlanks: blanks.length,
          answers,
          results,
          timeSpent: timeLimit ? timeLimit - timeRemaining : null,
          hintsUsed
        });
      }
    }
    
    return results;
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    checkAnswers(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIsCompleted(false);
    setShowResults(false);
    setScore(0);
    setFeedback('');
    setTimeRemaining(timeLimit);
    setHintsUsed(0);
    setShowHints({});
    setCurrentFocus(null);
    setBlankResults({});
    setShowReview(false);
    
    // Reset word bank
    if (showWordBank) {
      setAvailableWords([...wordBank]);
      setUsedWords([]);
    }
    
    // Focus first input
    if (blanks.length > 0 && inputRefs.current[blanks[0].id]) {
      setTimeout(() => {
        inputRefs.current[blanks[0].id].focus();
      }, 100);
    }
  };

  const handleHint = (blankId) => {
    if (hintsUsed >= 3 || !hints[blankId]) return;
    
    setShowHints(prev => ({
      ...prev,
      [blankId]: true
    }));
    
    setHintsUsed(prev => prev + 1);
    
    // Auto-hide hint after 10 seconds
    setTimeout(() => {
      setShowHints(prev => ({
        ...prev,
        [blankId]: false
      }));
    }, 10000);
  };

  const renderTextWithBlanks = () => {
    let processedText = text;
    const blankElements = [];
    
    // Sort blanks by position to process them in order
    const sortedBlanks = [...blanks].sort((a, b) => a.position - b.position);
    
    sortedBlanks.forEach((blank, index) => {
      const placeholder = `__${blank.id}__`;
      const blankElement = (
        <span key={blank.id} className="blank-container">
          <Form.Control
            ref={el => inputRefs.current[blank.id] = el}
            type="text"
            value={answers[blank.id] || ''}
            onChange={(e) => handleInputChange(blank.id, e.target.value)}
            onFocus={() => handleInputFocus(blank.id)}
            onKeyPress={(e) => handleKeyPress(e, blank.id)}
            className={`blank-input ${
              currentFocus === blank.id ? 'focused' : ''
            } ${
              autoCheck && answers[blank.id] && blankResults[blank.id] 
                ? blankResults[blank.id].isCorrect ? 'correct' : 'incorrect'
                : ''
            } ${
              isCompleted && blankResults[blank.id]
                ? blankResults[blank.id].isCorrect ? 'final-correct' : 'final-incorrect'
                : ''
            }`}
            placeholder={blank.placeholder || `Blank ${index + 1}`}
            disabled={isCompleted}
            size="sm"
            style={{ 
              width: `${Math.max(blank.width || 100, (answers[blank.id] || '').length * 10 + 60)}px`,
              display: 'inline-block',
              margin: '0 2px'
            }}
          />
          
          {/* Hint button */}
          {hints[blank.id] && hintsUsed < 3 && !isCompleted && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  {showHints[blank.id] ? hints[blank.id] : 'Click for hint'}
                </Tooltip>
              }
            >
              <Button
                variant="outline-info"
                size="sm"
                className="hint-btn"
                onClick={() => handleHint(blank.id)}
              >
                <i className="fas fa-lightbulb"></i>
              </Button>
            </OverlayTrigger>
          )}
          
          {/* Feedback icon */}
          {isCompleted && blankResults[blank.id] && (
            <span className={`feedback-icon ${
              blankResults[blank.id].isCorrect ? 'correct' : 'incorrect'
            }`}>
              <i className={`fas ${
                blankResults[blank.id].isCorrect ? 'fa-check-circle' : 'fa-times-circle'
              }`}></i>
            </span>
          )}
        </span>
      );
      
      blankElements.push({
        placeholder,
        element: blankElement,
        position: blank.position
      });
    });
    
    // Replace placeholders with actual blank elements
    const parts = [];
    let lastIndex = 0;
    
    blankElements.forEach(({ placeholder, element }) => {
      const index = processedText.indexOf(placeholder, lastIndex);
      if (index !== -1) {
        // Add text before the blank
        if (index > lastIndex) {
          parts.push(processedText.substring(lastIndex, index));
        }
        // Add the blank element
        parts.push(element);
        lastIndex = index + placeholder.length;
      }
    });
    
    // Add remaining text
    if (lastIndex < processedText.length) {
      parts.push(processedText.substring(lastIndex));
    }
    
    return parts;
  };

  const renderResults = () => {
    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'warning';
      return 'danger';
    };
    
    return (
      <div className="fill-blank-results">
        <div className="results-header text-center mb-4">
          <h4>Exercise Complete!</h4>
          <div className="score-display">
            <Badge bg={getScoreColor(score)} className="score-badge">
              {score}%
            </Badge>
            <p className="score-text">
              {Object.values(blankResults).filter(r => r.isCorrect).length} out of {blanks.length} correct
            </p>
            {timeLimit && (
              <p className="time-text">
                Completed in {formatTime(timeLimit - timeRemaining)}
              </p>
            )}
          </div>
          
          {showFeedback && (
            <Alert variant={getScoreColor(score)} className="feedback-alert">
              {feedback}
            </Alert>
          )}
          
          <div className="results-actions">
            <Button 
              variant="info" 
              onClick={() => setShowReview(true)}
              className="me-2"
            >
              <i className="fas fa-eye me-2"></i>
              Review Answers
            </Button>
            
            {allowRetry && score < 100 && (
              <Button variant="primary" onClick={handleReset}>
                <i className="fas fa-redo me-2"></i>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderReviewModal = () => (
    <Modal show={showReview} onHide={() => setShowReview(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Answer Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="review-content">
          {blanks.map((blank, index) => {
            const result = blankResults[blank.id];
            if (!result) return null;
            
            return (
              <div key={blank.id} className="review-item">
                <div className="review-header">
                  <span className="blank-number">Blank {index + 1}</span>
                  <Badge bg={result.isCorrect ? 'success' : 'danger'}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>
                
                <div className="review-details">
                  <div className="user-answer">
                    <strong>Your answer:</strong> 
                    <span className={result.isCorrect ? 'text-success' : 'text-danger'}>
                      {result.userAnswer || '(empty)'}
                    </span>
                  </div>
                  
                  {!result.isCorrect && (
                    <div className="correct-answer">
                      <strong>Correct answer(s):</strong> 
                      <span className="text-success">
                        {result.correctAnswers.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {blank.explanation && (
                    <div className="explanation">
                      <strong>Explanation:</strong> {blank.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowReview(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (showResults) {
    return (
      <div className="fill-blank-exercise">
        {renderResults()}
        {renderReviewModal()}
      </div>
    );
  }

  const progress = (Object.keys(answers).filter(key => answers[key]?.trim()).length / blanks.length) * 100;

  return (
    <div className="fill-blank-exercise">
      {/* Header */}
      <div className="exercise-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="exercise-title">{title}</h4>
            <p className="exercise-instructions text-muted">{instructions}</p>
          </div>
          <div className="exercise-controls">
            {timeLimit && (
              <Badge 
                bg={timeRemaining < 60 ? 'danger' : 'primary'}
                className="timer-badge me-2"
              >
                <i className="fas fa-clock me-1"></i>
                {formatTime(timeRemaining)}
              </Badge>
            )}
            {hintsUsed < 3 && (
              <Badge variant="outline-info" className="hints-badge">
                <i className="fas fa-lightbulb me-1"></i>
                Hints: {3 - hintsUsed} left
              </Badge>
            )}
          </div>
        </div>
        
        {/* Progress */}
        <div className="progress-section mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span>Progress: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / {blanks.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress">
            <div 
              className="progress-bar bg-primary" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Word Bank */}
      {showWordBank && wordBank.length > 0 && (
        <div className="word-bank mb-4">
          <h6 className="word-bank-title">
            <i className="fas fa-list me-2"></i>
            Word Bank
          </h6>
          <div className="word-bank-container">
            {availableWords.map((word, index) => (
              <Button
                key={`${word}-${index}`}
                variant="outline-primary"
                size="sm"
                className="word-bank-item"
                onClick={() => handleWordBankClick(word)}
                disabled={!currentFocus}
              >
                {word}
              </Button>
            ))}
            
            {availableWords.length === 0 && (
              <div className="empty-word-bank">
                <i className="fas fa-check-circle text-success me-2"></i>
                All words used!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text with Blanks */}
      <Card className="text-card">
        <Card.Body>
          <div className="text-content">
            {renderTextWithBlanks()}
          </div>
        </Card.Body>
      </Card>

      {/* Submit Button */}
      <div className="submit-section text-center mt-4">
        <Button 
          variant="success" 
          size="lg"
          onClick={handleSubmit}
          disabled={Object.keys(answers).filter(key => answers[key]?.trim()).length === 0 || isCompleted}
          className="submit-btn"
        >
          <i className="fas fa-check me-2"></i>
          Submit Answers
        </Button>
      </div>
    </div>
  );
};

export default FillInBlankExercise;