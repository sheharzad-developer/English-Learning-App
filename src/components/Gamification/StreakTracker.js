import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Calendar, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { lessonService } from '../../services/lessonService';
import './StreakTracker.css';

const StreakTracker = ({ userId, compact = false }) => {
  const [streakData, setStreakData] = useState(null);
  const [streakHistory, setStreakHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await lessonService.getUserStreak(userId);
      setStreakData(response.data);
    } catch (err) {
      console.error('Error fetching streak data:', err);
      setError('Failed to load streak data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStreakHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await lessonService.getStreakHistory(userId, { limit: 90 });
      setStreakHistory(response.data.results || []);
    } catch (err) {
      console.error('Error fetching streak history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowCalendar = () => {
    setShowCalendarModal(true);
    if (streakHistory.length === 0) {
      fetchStreakHistory();
    }
  };

  const getStreakLevel = (streak) => {
    if (streak >= 365) return { level: 'Legendary', color: 'danger', icon: '👑' };
    if (streak >= 100) return { level: 'Master', color: 'warning', icon: '🏆' };
    if (streak >= 30) return { level: 'Expert', color: 'success', icon: '🔥' };
    if (streak >= 14) return { level: 'Advanced', color: 'info', icon: '⚡' };
    if (streak >= 7) return { level: 'Intermediate', color: 'primary', icon: '💪' };
    if (streak >= 3) return { level: 'Beginner', color: 'secondary', icon: '🌱' };
    return { level: 'Starter', color: 'light', icon: '🎯' };
  };

  const getNextMilestone = (currentStreak) => {
    const milestones = [3, 7, 14, 30, 100, 365];
    return milestones.find(milestone => milestone > currentStreak) || null;
  };

  const getMilestoneProgress = (currentStreak) => {
    const nextMilestone = getNextMilestone(currentStreak);
    if (!nextMilestone) return { percentage: 100, remaining: 0 };
    
    const previousMilestone = [0, 3, 7, 14, 30, 100].find((milestone, index, arr) => {
      return arr[index + 1] === nextMilestone;
    }) || 0;
    
    const progress = currentStreak - previousMilestone;
    const total = nextMilestone - previousMilestone;
    const percentage = (progress / total) * 100;
    const remaining = nextMilestone - currentStreak;
    
    return { percentage, remaining, nextMilestone };
  };

  const isActiveDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return streakHistory.some(entry => entry.date === dateStr && entry.active);
  };

  const getDayClass = (date) => {
    const today = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    
    if (dateStr === todayStr) {
      return isActiveDay(date) ? 'calendar-day today active' : 'calendar-day today';
    }
    
    if (date > today) {
      return 'calendar-day future';
    }
    
    return isActiveDay(date) ? 'calendar-day active' : 'calendar-day inactive';
  };

  const renderCalendar = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const weeks = [];
    let currentDate = new Date(startDate);
    
    // Adjust to start from Sunday
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return (
      <div className="streak-calendar">
        <div className="calendar-header">
          <div className="weekday">S</div>
          <div className="weekday">M</div>
          <div className="weekday">T</div>
          <div className="weekday">W</div>
          <div className="weekday">T</div>
          <div className="weekday">F</div>
          <div className="weekday">S</div>
        </div>
        <div className="calendar-body">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {week.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className={getDayClass(date)}
                  title={`${date.toLocaleDateString()} ${isActiveDay(date) ? '- Active' : ''}`}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color active"></div>
            <span>Active Day</span>
          </div>
          <div className="legend-item">
            <div className="legend-color inactive"></div>
            <span>Inactive Day</span>
          </div>
          <div className="legend-item">
            <div className="legend-color today"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading streak...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchStreakData}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!streakData) {
    return (
      <Alert variant="info" className="text-center">
        <i className="fas fa-info-circle me-2"></i>
        No streak data available.
      </Alert>
    );
  }

  const streakLevel = getStreakLevel(streakData.current_streak);
  const milestoneProgress = getMilestoneProgress(streakData.current_streak);
  const isToday = streakData.last_activity_date === new Date().toISOString().split('T')[0];

  if (compact) {
    return (
      <div className="streak-tracker compact">
        <div className="d-flex align-items-center">
          <div className="streak-icon me-2">
            <span className="streak-emoji">{streakLevel.icon}</span>
          </div>
          <div>
            <div className="streak-count">
              {streakData.current_streak}
              <small className="text-muted ms-1">day streak</small>
            </div>
            <Badge bg={streakLevel.color} size="sm">{streakLevel.level}</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="streak-tracker">
      <Card className="streak-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              {/* Streak Header */}
              <div className="streak-header mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="streak-count mb-1">
                      <span className="streak-emoji me-2">{streakLevel.icon}</span>
                      {streakData.current_streak}
                      <small className="text-muted ms-2">day streak</small>
                    </h3>
                    <div className="streak-level">
                      <Badge bg={streakLevel.color} className="level-badge">
                        {streakLevel.level}
                      </Badge>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="ms-2"
                        onClick={handleShowCalendar}
                      >
                        <i className="fas fa-calendar me-1"></i>
                        View Calendar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="streak-status">
                    {isToday ? (
                      <Badge bg="success" className="status-badge">
                        <i className="fas fa-check me-1"></i>
                        Today Complete
                      </Badge>
                    ) : (
                      <Badge bg="warning" className="status-badge">
                        <i className="fas fa-clock me-1"></i>
                        Study Today!
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestone Progress */}
              {milestoneProgress.nextMilestone && (
                <div className="milestone-progress mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      Next Milestone: {milestoneProgress.nextMilestone} days
                    </small>
                    <small className="text-muted">
                      {milestoneProgress.remaining} days to go
                    </small>
                  </div>
                  <ProgressBar 
                    now={milestoneProgress.percentage} 
                    variant={streakLevel.color}
                    className="milestone-progress-bar"
                    animated
                  />
                </div>
              )}

              {/* Streak Stats */}
              <Row className="streak-stats">
                <Col xs={6}>
                  <div className="stat-item">
                    <div className="stat-value">{streakData.longest_streak || 0}</div>
                    <div className="stat-label">Best Streak</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="stat-item">
                    <div className="stat-value">{streakData.total_active_days || 0}</div>
                    <div className="stat-label">Total Active Days</div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col md={4} className="text-center">
              <div className="streak-visual">
                <div className="streak-circle">
                  <div className="streak-flame">
                    <span className="flame-emoji">🔥</span>
                  </div>
                  <div className="streak-number">{streakData.current_streak}</div>
                  <div className="streak-text">DAYS</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Calendar Modal */}
      <Modal show={showCalendarModal} onHide={() => setShowCalendarModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-calendar me-2"></i>
            Streak Calendar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingHistory ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading calendar...</p>
            </div>
          ) : (
            <div>
              <div className="calendar-stats mb-4">
                <Row>
                  <Col xs={4} className="text-center">
                    <div className="calendar-stat">
                      <div className="stat-number">{streakData.current_streak}</div>
                      <div className="stat-text">Current Streak</div>
                    </div>
                  </Col>
                  <Col xs={4} className="text-center">
                    <div className="calendar-stat">
                      <div className="stat-number">{streakData.longest_streak || 0}</div>
                      <div className="stat-text">Best Streak</div>
                    </div>
                  </Col>
                  <Col xs={4} className="text-center">
                    <div className="calendar-stat">
                      <div className="stat-number">{streakData.total_active_days || 0}</div>
                      <div className="stat-text">Total Days</div>
                    </div>
                  </Col>
                </Row>
              </div>
              {renderCalendar()}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCalendarModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StreakTracker;