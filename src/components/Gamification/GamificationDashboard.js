import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Spinner, Alert, Button } from 'react-bootstrap';
import BadgeDisplay from './BadgeDisplay';
import Leaderboard from './Leaderboard';
import PointsDisplay from './PointsDisplay';
import StreakTracker from './StreakTracker';
import { lessonService } from '../../services/lessonService';
import './GamificationDashboard.css';

const GamificationDashboard = ({ userId = 1 }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserStats();
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic user stats
      const response = await lessonService.getUserStats();
      setUserStats(response.data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to load gamification data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserStats();
    setRefreshing(false);
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
    { key: 'points', label: 'Points & Levels', icon: 'fas fa-star' },
    { key: 'badges', label: 'Badges', icon: 'fas fa-medal' },
    { key: 'streaks', label: 'Streaks', icon: 'fas fa-fire' },
    { key: 'leaderboard', label: 'Leaderboard', icon: 'fas fa-trophy' }
  ];

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <h5 className="mt-3 text-muted">Loading your achievements...</h5>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h5>{error}</h5>
          <Button variant="outline-danger" onClick={fetchUserStats} className="mt-2">
            <i className="fas fa-redo me-2"></i>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  const renderOverview = () => (
    <div className="gamification-overview">
      <Row className="g-4">
        {/* Points and Level */}
        <Col lg={6}>
          <PointsDisplay userId={userId} showDetails={true} />
        </Col>
        
        {/* Streak Tracker */}
        <Col lg={6}>
          <StreakTracker userId={userId} compact={false} />
        </Col>
        
        {/* Recent Badges */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">
                <i className="fas fa-medal me-2"></i>
                Recent Badges
              </h6>
            </Card.Header>
            <Card.Body>
              <BadgeDisplay userId={userId} showAll={false} />
            </Card.Body>
          </Card>
        </Col>
        
        {/* Mini Leaderboard */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <i className="fas fa-trophy me-2"></i>
                Your Ranking
              </h6>
            </Card.Header>
            <Card.Body>
              <Leaderboard currentUserId={userId} timeframe="weekly" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'points':
        return (
          <Row>
            <Col>
              <PointsDisplay userId={userId} showDetails={true} />
            </Col>
          </Row>
        );
      case 'badges':
        return (
          <Row>
            <Col>
              <BadgeDisplay userId={userId} showAll={true} />
            </Col>
          </Row>
        );
      case 'streaks':
        return (
          <Row>
            <Col>
              <StreakTracker userId={userId} compact={false} />
            </Col>
          </Row>
        );
      case 'leaderboard':
        return (
          <Row>
            <Col>
              <Leaderboard currentUserId={userId} timeframe="all_time" />
            </Col>
          </Row>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="gamification-dashboard">
      <Container fluid>
        {/* Header */}
        <div className="dashboard-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h2 className="dashboard-title">
                <i className="fas fa-gamepad me-3"></i>
                Your Achievements
              </h2>
              <p className="dashboard-subtitle text-muted">
                Track your learning progress, earn badges, and compete with others!
              </p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-primary" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="refresh-btn"
              >
                <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''} me-2`}></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </div>

        {/* Navigation Tabs */}
        <Nav variant="pills" className="gamification-nav mb-4">
          {tabs.map((tab) => (
            <Nav.Item key={tab.key}>
              <Nav.Link 
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="nav-pill"
              >
                <i className={`${tab.icon} me-2`}></i>
                <span className="d-none d-sm-inline">{tab.label}</span>
                <span className="d-sm-none">{tab.label.split(' ')[0]}</span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {/* Quick Stats Footer */}
        {userStats && (
          <div className="quick-stats mt-5">
            <Card className="stats-card">
              <Card.Body>
                <Row className="text-center">
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats.total_lessons_completed || 0}</div>
                      <div className="stat-label">Lessons Completed</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats.total_exercises_completed || 0}</div>
                      <div className="stat-label">Exercises Done</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats.average_score || 0}%</div>
                      <div className="stat-label">Average Score</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats.total_study_time || 0}h</div>
                      <div className="stat-label">Study Time</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
};

export default GamificationDashboard;