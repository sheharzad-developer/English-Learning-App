import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Badge, Button, Modal, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { lessonService } from '../../services/lessonService';
import './PointsDisplay.css';

const PointsDisplay = ({ userId, showDetails = true }) => {
  const [userPoints, setUserPoints] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchUserPoints();
  }, [userId]);

  const fetchUserPoints = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await lessonService.getUserPoints(userId);
      setUserPoints(response.data);
    } catch (err) {
      console.error('Error fetching user points:', err);
      setError('Failed to load points data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await lessonService.getPointsHistory(userId, { limit: 20 });
      setPointsHistory(response.data.results || []);
    } catch (err) {
      console.error('Error fetching points history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowHistory = () => {
    setShowHistoryModal(true);
    if (pointsHistory.length === 0) {
      fetchPointsHistory();
    }
  };

  const calculateLevel = (totalPoints) => {
    // Level calculation: Level = floor(sqrt(totalPoints / 100)) + 1
    return Math.floor(Math.sqrt(totalPoints / 100)) + 1;
  };

  const getPointsForLevel = (level) => {
    // Points needed for a specific level
    return Math.pow(level - 1, 2) * 100;
  };

  const getPointsForNextLevel = (currentLevel) => {
    return getPointsForLevel(currentLevel + 1);
  };

  const getLevelProgress = (totalPoints) => {
    const currentLevel = calculateLevel(totalPoints);
    const currentLevelPoints = getPointsForLevel(currentLevel);
    const nextLevelPoints = getPointsForNextLevel(currentLevel);
    const progressPoints = totalPoints - currentLevelPoints;
    const neededPoints = nextLevelPoints - currentLevelPoints;
    
    return {
      currentLevel,
      progressPoints,
      neededPoints,
      percentage: (progressPoints / neededPoints) * 100
    };
  };

  const formatPoints = (points) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toLocaleString();
  };

  const getActivityIcon = (activity) => {
    switch (activity?.toLowerCase()) {
      case 'quiz_completion': return 'fas fa-question-circle';
      case 'lesson_completion': return 'fas fa-book-open';
      case 'daily_login': return 'fas fa-calendar-check';
      case 'streak_bonus': return 'fas fa-fire';
      case 'badge_earned': return 'fas fa-medal';
      case 'perfect_score': return 'fas fa-star';
      case 'first_attempt': return 'fas fa-bullseye';
      case 'speed_bonus': return 'fas fa-bolt';
      default: return 'fas fa-plus-circle';
    }
  };

  const getActivityColor = (activity) => {
    switch (activity?.toLowerCase()) {
      case 'quiz_completion': return 'primary';
      case 'lesson_completion': return 'success';
      case 'daily_login': return 'info';
      case 'streak_bonus': return 'danger';
      case 'badge_earned': return 'warning';
      case 'perfect_score': return 'warning';
      case 'first_attempt': return 'success';
      case 'speed_bonus': return 'info';
      default: return 'secondary';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading points...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchUserPoints}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!userPoints) {
    return (
      <Alert variant="info" className="text-center">
        <i className="fas fa-info-circle me-2"></i>
        No points data available.
      </Alert>
    );
  }

  const levelProgress = getLevelProgress(userPoints.total_points);

  return (
    <div className="points-display">
      <Card className="points-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={showDetails ? 8 : 12}>
              {/* Points and Level Display */}
              <div className="points-header mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="points-total mb-1">
                      <i className="fas fa-star text-warning me-2"></i>
                      {formatPoints(userPoints.total_points)}
                      <small className="text-muted ms-2">points</small>
                    </h3>
                    <div className="level-info">
                      <Badge bg="primary" className="level-badge">
                        Level {levelProgress.currentLevel}
                      </Badge>
                      {showDetails && (
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="ms-2"
                          onClick={handleShowHistory}
                        >
                          <i className="fas fa-history me-1"></i>
                          History
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {showDetails && (
                    <div className="text-end">
                      <div className="next-level-info">
                        <small className="text-muted">
                          {levelProgress.neededPoints - levelProgress.progressPoints} points to Level {levelProgress.currentLevel + 1}
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Level Progress Bar */}
              {showDetails && (
                <div className="level-progress mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      Level {levelProgress.currentLevel} Progress
                    </small>
                    <small className="text-muted">
                      {formatPoints(levelProgress.progressPoints)} / {formatPoints(levelProgress.neededPoints)}
                    </small>
                  </div>
                  <ProgressBar 
                    now={levelProgress.percentage} 
                    variant="primary"
                    className="level-progress-bar"
                    animated
                  />
                </div>
              )}

              {/* Points Breakdown */}
              {showDetails && (
                <Row className="points-breakdown">
                  <Col xs={6}>
                    <div className="stat-item">
                      <div className="stat-value">{formatPoints(userPoints.weekly_points || 0)}</div>
                      <div className="stat-label">This Week</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="stat-item">
                      <div className="stat-value">{formatPoints(userPoints.monthly_points || 0)}</div>
                      <div className="stat-label">This Month</div>
                    </div>
                  </Col>
                </Row>
              )}
            </Col>

            {showDetails && (
              <Col md={4} className="text-center">
                <div className="level-visual">
                  <div className="level-circle">
                    <div className="level-number">{levelProgress.currentLevel}</div>
                    <div className="level-text">LEVEL</div>
                  </div>
                  <div className="level-progress-ring">
                    <svg width="120" height="120" className="progress-ring">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#e9ecef"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#007bff"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - levelProgress.percentage / 100)}`}
                        className="progress-ring-circle"
                      />
                    </svg>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Points History Modal */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-history me-2"></i>
            Points History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingHistory ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading history...</p>
            </div>
          ) : pointsHistory.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-history fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">No points history available</h6>
              <p className="text-muted small">Start completing lessons and exercises to see your points history!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {pointsHistory.map((entry, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="activity-icon me-3">
                      <i className={`${getActivityIcon(entry.activity)} text-${getActivityColor(entry.activity)}`}></i>
                    </div>
                    <div>
                      <div className="activity-title">{entry.description || entry.activity}</div>
                      <small className="text-muted">{formatTimeAgo(entry.earned_at)}</small>
                    </div>
                  </div>
                  <Badge bg={getActivityColor(entry.activity)} className="points-earned">
                    +{entry.points}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PointsDisplay;