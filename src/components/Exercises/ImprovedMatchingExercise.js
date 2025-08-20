import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge, Row, Col } from 'react-bootstrap';
import './MatchingExercise.css';

const ImprovedMatchingExercise = ({
  leftItems = [],
  rightItems = [],
  correctMatches = {},
  title = "Match the items",
  instructions = "Click items from the left to match with items on the right",
  onComplete,
  showFeedback = true,
  allowRetry = true,
  timeLimit = null
}) => {
  const [matches, setMatches] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [matchedItems, setMatchedItems] = useState(new Set());

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeftClick = (index) => {
    if (matchedItems.has(`left-${index}`)) return; // Already matched
    
    if (selectedLeft === index) {
      setSelectedLeft(null); // Deselect
    } else {
      setSelectedLeft(index);
      setSelectedRight(null); // Clear right selection
    }
  };

  const handleRightClick = (index) => {
    if (matchedItems.has(`right-${index}`)) return; // Already matched
    
    if (selectedLeft !== null) {
      // Make a match
      createMatch(selectedLeft, index);
    } else {
      // Just select right item
      setSelectedRight(index);
      setSelectedLeft(null);
    }
  };

  const createMatch = (leftIndex, rightIndex) => {
    const newMatches = { ...matches };
    
    // Remove any existing matches for these items
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === rightIndex) {
        delete newMatches[key];
      }
    });
    
    // Create new match
    newMatches[leftIndex] = rightIndex;
    setMatches(newMatches);
    
    // Update matched items
    const newMatchedItems = new Set(matchedItems);
    newMatchedItems.add(`left-${leftIndex}`);
    newMatchedItems.add(`right-${rightIndex}`);
    setMatchedItems(newMatchedItems);
    
    // Clear selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const removeMatch = (leftIndex) => {
    const newMatches = { ...matches };
    const rightIndex = newMatches[leftIndex];
    delete newMatches[leftIndex];
    setMatches(newMatches);
    
    // Update matched items
    const newMatchedItems = new Set(matchedItems);
    newMatchedItems.delete(`left-${leftIndex}`);
    newMatchedItems.delete(`right-${rightIndex}`);
    setMatchedItems(newMatchedItems);
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    
    let correctCount = 0;
    const totalMatches = Object.keys(correctMatches).length;
    
    // Calculate score
    Object.keys(matches).forEach(leftIndex => {
      const rightIndex = matches[leftIndex];
      const leftIndexNum = parseInt(leftIndex);
      const rightIndexNum = parseInt(rightIndex);
      
      if (correctMatches[leftIndexNum] === rightIndexNum) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / totalMatches) * 100);
    setScore(finalScore);
    
    // Generate feedback
    let feedbackText = '';
    if (finalScore === 100) {
      feedbackText = '🎉 Perfect! All matches are correct!';
    } else if (finalScore >= 80) {
      feedbackText = '👍 Great job! Most matches are correct.';
    } else if (finalScore >= 60) {
      feedbackText = '👌 Good effort! Some matches need correction.';
    } else {
      feedbackText = '💪 Keep practicing! Review the matches and try again.';
    }
    
    setFeedback(feedbackText);
    setIsCompleted(true);
    setShowResults(true);
    
    // Call completion callback
    if (onComplete) {
      onComplete({
        score: finalScore,
        correctMatches: correctCount,
        totalMatches,
        matches,
        timeSpent: timeLimit ? timeLimit - timeRemaining : null,
        hintsUsed
      });
    }
  };

  const handleReset = () => {
    setMatches({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedItems(new Set());
    setIsCompleted(false);
    setShowResults(false);
    setScore(0);
    setFeedback('');
    setTimeRemaining(timeLimit);
    setHintsUsed(0);
    setShowHint(false);
  };

  const handleHint = () => {
    if (hintsUsed >= 3) return;
    
    // Find the first unmatched correct match
    const unmatchedCorrect = Object.keys(correctMatches).find(leftIndex => 
      !matches[leftIndex] && !matchedItems.has(`left-${leftIndex}`)
    );
    
    if (unmatchedCorrect) {
      const leftIndex = parseInt(unmatchedCorrect);
      const rightIndex = correctMatches[leftIndex];
      
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      
      // Highlight the correct pair temporarily
      setSelectedLeft(leftIndex);
      setSelectedRight(rightIndex);
      
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setShowHint(false);
      }, 3000);
    }
  };

  const getItemStatus = (type, index) => {
    const key = `${type}-${index}`;
    if (matchedItems.has(key)) return 'matched';
    if (type === 'left' && selectedLeft === index) return 'selected';
    if (type === 'right' && selectedRight === index) return 'selected';
    return 'available';
  };

  const getMatchStatus = (leftIndex, rightIndex) => {
    const isCorrect = correctMatches[leftIndex] === rightIndex;
    return isCorrect ? 'correct' : 'incorrect';
  };

  const renderResults = () => {
    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'warning';
      return 'danger';
    };
    
    return (
      <div className="matching-results">
        <div className="results-header text-center mb-4">
          <h4>Exercise Complete!</h4>
          <div className="score-display">
            <Badge bg={getScoreColor(score)} className="score-badge">
              {score}%
            </Badge>
            <p className="score-text">
              {Object.keys(matches).filter(leftIndex => 
                correctMatches[leftIndex] === matches[leftIndex]
              ).length} out of {Object.keys(correctMatches).length} correct
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
          
          {allowRetry && score < 100 && (
            <Button variant="primary" onClick={handleReset} className="retry-btn">
              <i className="fas fa-redo me-2"></i>
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (showResults) {
    return renderResults();
  }

  const progress = Object.keys(matches).length / Object.keys(correctMatches).length * 100;

  return (
    <div className="matching-exercise">
      {/* Header */}
      <div className="exercise-header">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h4 className="exercise-title">{title}</h4>
            <p className="exercise-instructions text-muted">{instructions}</p>
          </div>
          <div className="exercise-controls">
            {timeLimit && (
              <Badge bg={timeRemaining < 60 ? 'danger' : 'primary'} className="timer-badge">
                <i className="fas fa-clock me-1"></i>
                {formatTime(timeRemaining)}
              </Badge>
            )}
            <Button
              variant="outline-info"
              size="sm"
              onClick={handleHint}
              disabled={hintsUsed >= 3 || isCompleted}
              className="hint-btn"
            >
              <i className="fas fa-lightbulb me-1"></i>
              Hint ({3 - hintsUsed} left)
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Progress: {Object.keys(matches).length} / {Object.keys(correctMatches).length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Hint Alert */}
      {showHint && (
        <Alert variant="info" className="hint-alert">
          <i className="fas fa-lightbulb me-2"></i>
          The highlighted items belong together!
        </Alert>
      )}

      {/* Matching Interface */}
      <div className="matching-interface">
        <Row className="g-4">
          {/* Left Column */}
          <Col md={6}>
            <div className="column-header">
              <i className="fas fa-list me-2"></i>
              Items to Match
            </div>
            <div className="items-list">
              {leftItems.map((item, index) => (
                <div
                  key={index}
                  className={`matching-item clickable ${getItemStatus('left', index)}`}
                  onClick={() => handleLeftClick(index)}
                  style={{
                    marginBottom: '10px',
                    cursor: 'pointer',
                    opacity: matchedItems.has(`left-${index}`) ? 0.6 : 1
                  }}
                >
                  <div className="item-content">
                    {item}
                  </div>
                  {matches[index] !== undefined && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMatch(index);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                  {getItemStatus('left', index) === 'selected' && (
                    <div className="selection-indicator">
                      <i className="fas fa-hand-pointer"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>

          {/* Right Column */}
          <Col md={6}>
            <div className="column-header">
              <i className="fas fa-bullseye me-2"></i>
              Match Targets
            </div>
            <div className="targets-list">
              {rightItems.map((item, index) => (
                <div
                  key={index}
                  className={`target-item clickable ${getItemStatus('right', index)}`}
                  onClick={() => handleRightClick(index)}
                  style={{
                    marginBottom: '10px',
                    cursor: 'pointer',
                    opacity: matchedItems.has(`right-${index}`) ? 0.6 : 1
                  }}
                >
                  <div className="item-content">
                    {item}
                  </div>
                  {/* Show which left item is matched */}
                  {Object.keys(matches).find(leftIndex => matches[leftIndex] === index) && (
                    <div className="match-indicator">
                      <Badge bg={
                        getMatchStatus(
                          Object.keys(matches).find(leftIndex => matches[leftIndex] === index),
                          index
                        ) === 'correct' ? 'success' : 'danger'
                      }>
                        {isCompleted ? 
                          (getMatchStatus(
                            Object.keys(matches).find(leftIndex => matches[leftIndex] === index),
                            index
                          ) === 'correct' ? '✓' : '✗')
                          : '✓'
                        }
                      </Badge>
                    </div>
                  )}
                  {getItemStatus('right', index) === 'selected' && (
                    <div className="selection-indicator">
                      <i className="fas fa-crosshairs"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>

      {/* Submit Section */}
      <div className="submit-section text-center">
        <Button
          variant="success"
          size="lg"
          onClick={handleSubmit}
          disabled={Object.keys(matches).length === 0}
          className="submit-btn"
        >
          <i className="fas fa-check me-2"></i>
          Submit Matches ({Object.keys(matches).length}/{Object.keys(correctMatches).length})
        </Button>
      </div>

      <style jsx>{`
        .matching-item.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
        }
        
        .matching-item.selected {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-color: #0056b3;
        }
        
        .target-item.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
        }
        
        .target-item.selected {
          background: linear-gradient(135deg, #28a745, #1e7e34);
          color: white;
          border-color: #1e7e34;
        }
        
        .matching-item.matched,
        .target-item.matched {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          border-color: #28a745;
          color: #155724;
        }
        
        .selection-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          color: #007bff;
          animation: pulse 1s infinite;
        }
        
        .match-indicator {
          position: absolute;
          top: -8px;
          right: -8px;
        }
        
        .items-list,
        .targets-list {
          min-height: 300px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ImprovedMatchingExercise;
