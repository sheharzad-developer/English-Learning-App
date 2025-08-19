import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MatchingExercise.css';

const MatchingExercise = ({
  leftItems = [],
  rightItems = [],
  correctMatches = {},
  title = "Match the items",
  instructions = "Drag items from the left to match with items on the right",
  onComplete,
  showFeedback = true,
  allowRetry = true,
  timeLimit = null
}) => {
  const [matches, setMatches] = useState({});
  const [availableLeft, setAvailableLeft] = useState([]);
  const [availableRight, setAvailableRight] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    // Initialize items with unique IDs
    const initLeft = leftItems.map((item, index) => ({
      id: `left-${index}`,
      content: item,
      originalIndex: index
    }));
    
    const initRight = rightItems.map((item, index) => ({
      id: `right-${index}`,
      content: item,
      originalIndex: index,
      matched: false
    }));
    
    setAvailableLeft(initLeft);
    setAvailableRight(initRight);
  }, [leftItems, rightItems]);

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

  const onDragStart = (start) => {
    setDraggedItem(start.draggableId);
  };

  const onDragEnd = (result) => {
    setDraggedItem(null);
    
    const { source, destination, draggableId } = result;
    
    // If dropped outside a valid droppable area
    if (!destination) {
      return;
    }
    
    // If dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    
    // Handle matching logic
    if (source.droppableId === 'available-left' && destination.droppableId.startsWith('right-')) {
      const rightIndex = parseInt(destination.droppableId.split('-')[1]);
      const leftItem = availableLeft.find(item => item.id === draggableId);
      
      if (leftItem) {
        // Create new match
        const newMatches = { ...matches };
        
        // Remove any existing match for this right item
        Object.keys(newMatches).forEach(key => {
          if (newMatches[key] === rightIndex) {
            delete newMatches[key];
          }
        });
        
        // Add new match
        newMatches[leftItem.originalIndex] = rightIndex;
        setMatches(newMatches);
        
        // Update available items
        setAvailableLeft(prev => prev.filter(item => item.id !== draggableId));
        setAvailableRight(prev => prev.map(item => 
          item.originalIndex === rightIndex 
            ? { ...item, matched: true, matchedWith: leftItem }
            : item
        ));
      }
    }
    
    // Handle unmatching (dragging back to available)
    else if (destination.droppableId === 'available-left') {
      const matchedRightIndex = Object.keys(matches).find(key => 
        matches[key] === parseInt(source.droppableId.split('-')[1])
      );
      
      if (matchedRightIndex !== undefined) {
        const leftIndex = parseInt(matchedRightIndex);
        const leftItem = leftItems[leftIndex];
        
        // Remove match
        const newMatches = { ...matches };
        delete newMatches[leftIndex];
        setMatches(newMatches);
        
        // Return items to available
        setAvailableLeft(prev => [...prev, {
          id: `left-${leftIndex}`,
          content: leftItem,
          originalIndex: leftIndex
        }]);
        
        setAvailableRight(prev => prev.map(item => 
          item.originalIndex === parseInt(source.droppableId.split('-')[1])
            ? { ...item, matched: false, matchedWith: null }
            : item
        ));
      }
    }
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    
    let correctCount = 0;
    const totalMatches = Object.keys(correctMatches).length;
    
    // Calculate score
    Object.keys(matches).forEach(leftIndex => {
      const rightIndex = matches[leftIndex];
      if (correctMatches[leftIndex] === rightIndex) {
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
    setIsCompleted(false);
    setShowResults(false);
    setScore(0);
    setFeedback('');
    setTimeRemaining(timeLimit);
    setHintsUsed(0);
    setShowHint(false);
    
    // Reset items
    const initLeft = leftItems.map((item, index) => ({
      id: `left-${index}`,
      content: item,
      originalIndex: index
    }));
    
    const initRight = rightItems.map((item, index) => ({
      id: `right-${index}`,
      content: item,
      originalIndex: index,
      matched: false
    }));
    
    setAvailableLeft(initLeft);
    setAvailableRight(initRight);
  };

  const handleHint = () => {
    if (hintsUsed >= 3) return; // Limit hints
    
    // Find an unmatched correct pair and highlight it
    const unmatchedCorrect = Object.keys(correctMatches).find(leftIndex => 
      !matches[leftIndex] && availableLeft.some(item => item.originalIndex === parseInt(leftIndex))
    );
    
    if (unmatchedCorrect) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      
      // Auto-hide hint after 5 seconds
      setTimeout(() => setShowHint(false), 5000);
    }
  };

  const getHintPair = () => {
    const unmatchedCorrect = Object.keys(correctMatches).find(leftIndex => 
      !matches[leftIndex] && availableLeft.some(item => item.originalIndex === parseInt(leftIndex))
    );
    
    if (unmatchedCorrect) {
      return {
        left: leftItems[unmatchedCorrect],
        right: rightItems[correctMatches[unmatchedCorrect]]
      };
    }
    return null;
  };

  const isItemHighlighted = (item, side) => {
    if (!showHint) return false;
    const hintPair = getHintPair();
    if (!hintPair) return false;
    
    if (side === 'left') {
      return item.content === hintPair.left;
    } else {
      return item.content === hintPair.right;
    }
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
              {Object.keys(matches).filter(key => correctMatches[key] === matches[key]).length} out of {Object.keys(correctMatches).length} correct
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

  const progress = (Object.keys(matches).length / Object.keys(correctMatches).length) * 100;

  return (
    <div className="matching-exercise">
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
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={handleHint}
                className="hint-btn"
              >
                <i className="fas fa-lightbulb me-1"></i>
                Hint ({3 - hintsUsed} left)
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress */}
        <div className="progress-section mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span>Progress: {Object.keys(matches).length} / {Object.keys(correctMatches).length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress">
            <div 
              className="progress-bar bg-primary" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Hint Display */}
        {showHint && (
          <Alert variant="info" className="hint-alert">
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Hint:</strong> Try matching "{getHintPair()?.left}" with "{getHintPair()?.right}"
          </Alert>
        )}
      </div>

      {/* Matching Interface */}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="matching-interface">
          <div className="matching-columns">
            {/* Left Column - Available Items */}
            <div className="left-column">
              <h6 className="column-header">Items to Match</h6>
              <Droppable droppableId="available-left">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`items-container ${
                      snapshot.isDraggingOver ? 'drag-over' : ''
                    }`}
                  >
                    {availableLeft.map((item, index) => (
                      <Draggable 
                        key={item.id} 
                        draggableId={item.id} 
                        index={index}
                        isDragDisabled={isCompleted}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`matching-item left-item ${
                              snapshot.isDragging ? 'dragging' : ''
                            } ${
                              isItemHighlighted(item, 'left') ? 'highlighted' : ''
                            }`}
                          >
                            <div className="item-content">
                              {item.content}
                            </div>
                            <div className="drag-handle">
                              <i className="fas fa-grip-vertical"></i>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {availableLeft.length === 0 && (
                      <div className="empty-state">
                        <i className="fas fa-check-circle text-success"></i>
                        <p>All items matched!</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Right Column - Target Items */}
            <div className="right-column">
              <h6 className="column-header">Match With</h6>
              <div className="targets-container">
                {availableRight.map((item, index) => (
                  <div key={item.id} className="target-row">
                    <div className={`target-item ${
                      isItemHighlighted(item, 'right') ? 'highlighted' : ''
                    }`}>
                      <div className="item-content">
                        {item.content}
                      </div>
                    </div>
                    
                    <Droppable droppableId={`right-${item.originalIndex}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`drop-zone ${
                            snapshot.isDraggingOver ? 'drag-over' : ''
                          } ${
                            item.matched ? 'matched' : ''
                          }`}
                        >
                          {item.matched && item.matchedWith ? (
                            <Draggable 
                              draggableId={item.matchedWith.id} 
                              index={0}
                              isDragDisabled={isCompleted}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`matching-item matched-item ${
                                    snapshot.isDragging ? 'dragging' : ''
                                  }`}
                                >
                                  <div className="item-content">
                                    {item.matchedWith.content}
                                  </div>
                                  <div className="drag-handle">
                                    <i className="fas fa-grip-vertical"></i>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ) : (
                            <div className="drop-placeholder">
                              <i className="fas fa-plus"></i>
                              <span>Drop here</span>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Submit Button */}
      <div className="submit-section text-center mt-4">
        <Button 
          variant="success" 
          size="lg"
          onClick={handleSubmit}
          disabled={Object.keys(matches).length === 0 || isCompleted}
          className="submit-btn"
        >
          <i className="fas fa-check me-2"></i>
          Submit Matches
        </Button>
      </div>
    </div>
  );
};

export default MatchingExercise;