import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Spinner, Alert, Button, Badge, ProgressBar } from 'react-bootstrap';
import BadgeDisplay from './BadgeDisplay';
import Leaderboard from './Leaderboard';
import PointsDisplay from './PointsDisplay';
import StreakTracker from './StreakTracker';
import { lessonService } from '../../services/lessonService';
import progressService from '../../services/progressService';
import './GamificationDashboard.css';

const GamificationDashboard = ({ userId = 1 }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState(null);
  const [localStats, setLocalStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
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

      // Get local progress statistics
      const localProgressStats = progressService.getStatistics();
      setLocalStats(localProgressStats);

      // Try to fetch from backend as well
      try {
        const response = await lessonService.getUserStats();
        setUserStats(response.data);
      } catch (err) {
        console.log('Backend not available, using local stats');
        setUserStats(null);
      }

      // Generate achievements based on local progress
      generateAchievements(localProgressStats);
      
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to load gamification data. Using local progress.');
      
      // Fallback to local stats only
      const localProgressStats = progressService.getStatistics();
      setLocalStats(localProgressStats);
      generateAchievements(localProgressStats);
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = (stats) => {
    const achievementsList = [
      {
        id: 'first_quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        rarity: 'common',
        points_reward: 10,
        earned: stats.quizzesTaken >= 1,
        progress: Math.min(stats.quizzesTaken, 1),
        target: 1
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 5 quizzes with 80% or higher average',
        icon: '🧠',
        rarity: 'rare',
        points_reward: 50,
        earned: stats.quizzesTaken >= 5 && stats.averageScore >= 80,
        progress: Math.min(stats.quizzesTaken, 5),
        target: 5
      },
      {
        id: 'streak_champion',
        name: 'Streak Champion',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        rarity: 'epic',
        points_reward: 75,
        earned: stats.currentStreak >= 7,
        progress: Math.min(stats.currentStreak, 7),
        target: 7
      },
      {
        id: 'high_scorer',
        name: 'Perfectionist',
        description: 'Achieve 90% average score',
        icon: '⭐',
        rarity: 'epic',
        points_reward: 100,
        earned: stats.averageScore >= 90,
        progress: Math.min(stats.averageScore, 90),
        target: 90
      },
      {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Complete 10 quizzes',
        icon: '📚',
        rarity: 'rare',
        points_reward: 75,
        earned: stats.quizzesTaken >= 10,
        progress: Math.min(stats.quizzesTaken, 10),
        target: 10
      },
      {
        id: 'legendary_scholar',
        name: 'Legendary Scholar',
        description: 'Complete 20 quizzes with 95% average',
        icon: '👑',
        rarity: 'legendary',
        points_reward: 200,
        earned: stats.quizzesTaken >= 20 && stats.averageScore >= 95,
        progress: Math.min(stats.quizzesTaken, 20),
        target: 20
      }
    ];

    setAchievements(achievementsList);
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

  const renderLocalAchievements = () => {
    const earnedAchievements = achievements.filter(a => a.earned);
    const lockedAchievements = achievements.filter(a => !a.earned);

    return (
      <div className="local-achievements">
        {earnedAchievements.length > 0 && (
          <div className="mb-4">
            <h6 className="text-success mb-3">
              <i className="fas fa-check-circle me-2"></i>
              Earned Achievements ({earnedAchievements.length})
            </h6>
            <Row className="g-3">
              {earnedAchievements.map((achievement) => (
                <Col key={achievement.id} xs={6} md={4} lg={3}>
                  <Card className="achievement-card earned h-100">
                    <Card.Body className="text-center p-3">
                      <div className="achievement-icon mb-2" style={{ fontSize: '2rem' }}>
                        {achievement.icon}
                      </div>
                      <h6 className="achievement-name">{achievement.name}</h6>
                      <Badge bg="success" className="mb-2">
                        {achievement.rarity}
                      </Badge>
                      <div className="points-reward">
                        <i className="fas fa-star text-warning me-1"></i>
                        <small>{achievement.points_reward} pts</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h6 className="text-muted mb-3">
              <i className="fas fa-lock me-2"></i>
              Locked Achievements ({lockedAchievements.length})
            </h6>
            <Row className="g-3">
              {lockedAchievements.map((achievement) => (
                <Col key={achievement.id} xs={6} md={4} lg={3}>
                  <Card className="achievement-card locked h-100">
                    <Card.Body className="text-center p-3">
                      <div className="achievement-icon mb-2" style={{ fontSize: '2rem', opacity: 0.5 }}>
                        {achievement.icon}
                      </div>
                      <h6 className="achievement-name text-muted">{achievement.name}</h6>
                      <Badge bg="secondary" className="mb-2">
                        {achievement.rarity}
                      </Badge>
                      <div className="progress-indicator mb-2">
                        <small className="text-muted">{achievement.progress}/{achievement.target}</small>
                        <ProgressBar 
                          now={(achievement.progress / achievement.target) * 100} 
                          style={{ height: '4px' }}
                          className="mt-1"
                        />
                      </div>
                      <div className="points-reward">
                        <i className="fas fa-star text-muted me-1"></i>
                        <small className="text-muted">{achievement.points_reward} pts</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {achievements.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No Achievements Yet</h5>
            <p className="text-muted">Complete some quizzes to start earning achievements!</p>
          </div>
        )}
      </div>
    );
  };

  const renderLocalStats = () => (
    <div className="local-stats">
      <Row className="g-4">
        {/* Progress Stats */}
        <Col lg={6}>
          <Card className="stats-card h-100">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Your Progress
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Quizzes Completed</span>
                  <Badge bg="primary">{localStats?.quizzesTaken || 0}</Badge>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Average Score</span>
                  <Badge bg="success">{localStats?.averageScore || 0}%</Badge>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Current Streak</span>
                  <Badge bg="warning">{localStats?.currentStreak || 0} days</Badge>
                </div>
              </div>
              <div className="stat-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Total Points</span>
                  <Badge bg="info">{localStats?.totalPoints || 0}</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Recent Activity */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activity
              </h6>
            </Card.Header>
            <Card.Body>
              {localStats?.recentSubmissions && localStats.recentSubmissions.length > 0 ? (
                <div className="recent-activity">
                  {localStats.recentSubmissions.slice(0, 3).map((submission, index) => (
                    <div key={submission.id} className="activity-item mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{submission.quizTitle}</h6>
                          <small className="text-muted">
                            {new Date(submission.timestamp).toLocaleDateString()}
                          </small>
                        </div>
                        <Badge bg={submission.score >= 70 ? 'success' : 'warning'}>
                          {submission.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-clock text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="text-muted mt-2">No recent activity</p>
                  <small className="text-muted">Complete some quizzes to see your activity here!</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderOverview = () => (
    <div className="gamification-overview">
      <Row className="g-4">
        {/* Local Stats */}
        <Col xs={12}>
          {renderLocalStats()}
        </Col>
        
        {/* Achievements Preview */}
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">
                <i className="fas fa-medal me-2"></i>
                Recent Achievements
              </h6>
            </Card.Header>
            <Card.Body>
              {renderLocalAchievements()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderPointsAndLevels = () => {
    const getLevel = (points) => {
      if (points >= 1000) return { level: 5, name: 'Expert', color: 'danger', icon: '👑' };
      if (points >= 500) return { level: 4, name: 'Advanced', color: 'warning', icon: '🥇' };
      if (points >= 200) return { level: 3, name: 'Intermediate', color: 'info', icon: '🥈' };
      if (points >= 50) return { level: 2, name: 'Beginner+', color: 'success', icon: '🥉' };
      return { level: 1, name: 'Beginner', color: 'secondary', icon: '🌟' };
    };

    const getNextLevelPoints = (currentPoints) => {
      if (currentPoints >= 1000) return null;
      if (currentPoints >= 500) return 1000;
      if (currentPoints >= 200) return 500;
      if (currentPoints >= 50) return 200;
      return 50;
    };

    const currentLevel = getLevel(localStats?.totalPoints || 0);
    const nextLevelPoints = getNextLevelPoints(localStats?.totalPoints || 0);
    const progressToNext = nextLevelPoints 
      ? ((localStats?.totalPoints || 0) / nextLevelPoints) * 100
      : 100;

    return (
      <Row className="g-4">
        {/* Current Level Card */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className={`bg-${currentLevel.color} text-white`}>
              <h5 className="mb-0">
                <i className="fas fa-star me-2"></i>
                Current Level
              </h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="level-icon mb-3" style={{ fontSize: '4rem' }}>
                {currentLevel.icon}
              </div>
              <h3 className="level-name mb-2">Level {currentLevel.level}</h3>
              <Badge bg={currentLevel.color} className="level-badge mb-3">
                {currentLevel.name}
              </Badge>
              <div className="points-display">
                <h4 className="text-primary mb-1">{localStats?.totalPoints || 0}</h4>
                <p className="text-muted">Total Points</p>
              </div>
              
              {nextLevelPoints && (
                <div className="level-progress mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small>Progress to next level</small>
                    <small>{localStats?.totalPoints || 0} / {nextLevelPoints}</small>
                  </div>
                  <ProgressBar 
                    now={progressToNext} 
                    variant={currentLevel.color}
                    style={{ height: '8px' }}
                  />
                  <small className="text-muted mt-1 d-block">
                    {nextLevelPoints - (localStats?.totalPoints || 0)} points to go!
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Points Breakdown */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Points Breakdown
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="points-breakdown">
                <div className="point-source mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-brain text-primary me-2"></i>
                      <span>Quiz Completion</span>
                    </div>
                    <Badge bg="primary">
                      {(localStats?.quizzesTaken || 0) * 10} pts
                    </Badge>
                  </div>
                  <small className="text-muted">10 points per quiz</small>
                </div>
                
                <div className="point-source mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-medal text-warning me-2"></i>
                      <span>Achievements</span>
                    </div>
                    <Badge bg="warning">
                      {achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points_reward, 0)} pts
                    </Badge>
                  </div>
                  <small className="text-muted">Bonus points from achievements</small>
                </div>
                
                <div className="point-source mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-fire text-danger me-2"></i>
                      <span>Streak Bonus</span>
                    </div>
                    <Badge bg="danger">
                      {(localStats?.currentStreak || 0) * 5} pts
                    </Badge>
                  </div>
                  <small className="text-muted">5 points per streak day</small>
                </div>

                <hr />
                
                <div className="total-points">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total Points</strong>
                    <h4 className="text-success mb-0">{localStats?.totalPoints || 0}</h4>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Level Milestones */}
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-road me-2"></i>
                Level Milestones
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {[
                  { level: 1, name: 'Beginner', points: 0, icon: '🌟', color: 'secondary' },
                  { level: 2, name: 'Beginner+', points: 50, icon: '🥉', color: 'success' },
                  { level: 3, name: 'Intermediate', points: 200, icon: '🥈', color: 'info' },
                  { level: 4, name: 'Advanced', points: 500, icon: '🥇', color: 'warning' },
                  { level: 5, name: 'Expert', points: 1000, icon: '👑', color: 'danger' }
                ].map((milestone) => (
                  <Col key={milestone.level} xs={6} md={4} lg={2}>
                    <div className={`milestone-card ${(localStats?.totalPoints || 0) >= milestone.points ? 'achieved' : 'locked'}`}>
                      <div className="milestone-icon">{milestone.icon}</div>
                      <div className="milestone-level">Level {milestone.level}</div>
                      <div className="milestone-name">{milestone.name}</div>
                      <div className="milestone-points">{milestone.points}+ pts</div>
                      {(localStats?.totalPoints || 0) >= milestone.points && (
                        <div className="achievement-check">
                          <i className="fas fa-check-circle text-success"></i>
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderStreaks = () => {
    const getStreakLevel = (streak) => {
      if (streak >= 30) return { name: 'Legendary', color: 'danger', icon: '🔥', level: 5 };
      if (streak >= 14) return { name: 'Master', color: 'warning', icon: '💪', level: 4 };
      if (streak >= 7) return { name: 'Champion', color: 'success', icon: '⚡', level: 3 };
      if (streak >= 3) return { name: 'Rising', color: 'info', icon: '🌟', level: 2 };
      return { name: 'Beginner', color: 'secondary', icon: '🌱', level: 1 };
    };

    const streakLevel = getStreakLevel(localStats?.currentStreak || 0);
    const nextStreakMilestone = localStats?.currentStreak >= 30 ? null :
                               localStats?.currentStreak >= 14 ? 30 :
                               localStats?.currentStreak >= 7 ? 14 :
                               localStats?.currentStreak >= 3 ? 7 : 3;

    return (
      <Row className="g-4">
        {/* Current Streak */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className={`bg-${streakLevel.color} text-white`}>
              <h5 className="mb-0">
                <i className="fas fa-fire me-2"></i>
                Current Streak
              </h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="streak-icon mb-3" style={{ fontSize: '4rem' }}>
                {streakLevel.icon}
              </div>
              <h2 className="streak-count mb-2">{localStats?.currentStreak || 0}</h2>
              <p className="text-muted mb-3">Days in a row</p>
              <Badge bg={streakLevel.color} className="streak-badge mb-3">
                {streakLevel.name} Streaker
              </Badge>
              
              {nextStreakMilestone && (
                <div className="streak-progress mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small>Progress to next milestone</small>
                    <small>{localStats?.currentStreak || 0} / {nextStreakMilestone}</small>
                  </div>
                  <ProgressBar 
                    now={((localStats?.currentStreak || 0) / nextStreakMilestone) * 100} 
                    variant={streakLevel.color}
                    style={{ height: '8px' }}
                  />
                  <small className="text-muted mt-1 d-block">
                    {nextStreakMilestone - (localStats?.currentStreak || 0)} days to go!
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Streak Statistics */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Streak Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="streak-stats">
                <div className="stat-row mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-fire text-danger me-2"></i>Current Streak</span>
                    <Badge bg="danger">{localStats?.currentStreak || 0} days</Badge>
                  </div>
                </div>
                
                <div className="stat-row mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-star text-warning me-2"></i>Streak Points</span>
                    <Badge bg="warning">{(localStats?.currentStreak || 0) * 5} pts</Badge>
                  </div>
                </div>
                
                <div className="stat-row mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-calendar text-info me-2"></i>Last Activity</span>
                    <small className="text-muted">
                      {localStats?.lastActivity 
                        ? new Date(localStats.lastActivity).toLocaleDateString()
                        : 'No activity yet'
                      }
                    </small>
                  </div>
                </div>

                <div className="streak-tips mt-4">
                  <h6 className="text-primary">💡 Streak Tips:</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Complete at least one quiz daily
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Earn 5 bonus points per streak day
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Unlock special achievements with long streaks
                    </li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Streak Milestones */}
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-trophy me-2"></i>
                Streak Milestones
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {[
                  { days: 3, name: 'Rising', icon: '🌟', color: 'info', points: 15 },
                  { days: 7, name: 'Champion', icon: '⚡', color: 'success', points: 35 },
                  { days: 14, name: 'Master', icon: '💪', color: 'warning', points: 70 },
                  { days: 30, name: 'Legendary', icon: '🔥', color: 'danger', points: 150 }
                ].map((milestone) => (
                  <Col key={milestone.days} xs={6} md={3}>
                    <div className={`streak-milestone ${(localStats?.currentStreak || 0) >= milestone.days ? 'achieved' : 'locked'}`}>
                      <div className="milestone-icon">{milestone.icon}</div>
                      <div className="milestone-name">{milestone.name}</div>
                      <div className="milestone-days">{milestone.days} days</div>
                      <div className="milestone-points">+{milestone.points} pts</div>
                      {(localStats?.currentStreak || 0) >= milestone.days && (
                        <div className="achievement-check">
                          <i className="fas fa-check-circle text-success"></i>
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'points':
        return renderPointsAndLevels();
      case 'badges':
        return (
          <Row>
            <Col>
              <Card>
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="fas fa-medal me-2"></i>
                    All Achievements
                  </h5>
                </Card.Header>
                <Card.Body>
                  {renderLocalAchievements()}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      case 'streaks':
        return renderStreaks();
      case 'leaderboard':
        return (
          <Row>
            <Col>
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-trophy me-2"></i>
                    Leaderboard (Coming Soon)
                  </h5>
                </Card.Header>
                <Card.Body className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Leaderboard Feature</h5>
                  <p className="text-muted">Compete with other learners! This feature will be available when connected to the backend.</p>
                </Card.Body>
              </Card>
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
        {(localStats || userStats) && (
          <div className="quick-stats mt-5">
            <Card className="stats-card">
              <Card.Body>
                <Row className="text-center">
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">
                        {(userStats?.total_lessons_completed) || localStats?.lessonsCompleted || 0}
                      </div>
                      <div className="stat-label">Lessons Completed</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">
                        {(userStats?.total_exercises_completed) || localStats?.quizzesTaken || 0}
                      </div>
                      <div className="stat-label">Quizzes Done</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">
                        {(userStats?.average_score) || localStats?.averageScore || 0}%
                      </div>
                      <div className="stat-label">Average Score</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">
                        {Math.round(((userStats?.total_study_time) || localStats?.studyTime || 0) / 60)}h
                      </div>
                      <div className="stat-label">Study Time</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>

      {/* Custom Styles */}
      <style jsx>{`
        .milestone-card {
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .milestone-card.achieved {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          border-color: #28a745;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
        }

        .milestone-card.locked {
          opacity: 0.6;
        }

        .milestone-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .milestone-level {
          font-weight: 600;
          font-size: 0.9rem;
          color: #495057;
        }

        .milestone-name {
          font-weight: 500;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .milestone-points {
          font-size: 0.7rem;
          color: #6c757d;
          margin-top: 4px;
        }

        .achievement-check {
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 1.2rem;
        }

        .streak-milestone {
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .streak-milestone.achieved {
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border-color: #ffc107;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
        }

        .streak-milestone.locked {
          opacity: 0.6;
        }

        .streak-milestone .milestone-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .streak-milestone .milestone-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #495057;
        }

        .streak-milestone .milestone-days {
          font-weight: 500;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .streak-milestone .milestone-points {
          font-size: 0.7rem;
          color: #6c757d;
          margin-top: 4px;
        }

        .activity-item {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 12px;
        }

        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .stat-row {
          padding: 8px 0;
        }

        .level-progress .progress {
          height: 8px;
          border-radius: 4px;
        }

        .streak-progress .progress {
          height: 8px;
          border-radius: 4px;
        }

        .point-source {
          padding: 12px 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .point-source:last-of-type {
          border-bottom: none;
        }

        .total-points {
          padding-top: 16px;
          border-top: 2px solid #e9ecef;
        }

        @media (max-width: 768px) {
          .milestone-card,
          .streak-milestone {
            height: 120px;
            padding: 16px;
          }

          .milestone-icon,
          .streak-milestone .milestone-icon {
            font-size: 2rem;
          }

          .milestone-level,
          .milestone-name,
          .streak-milestone .milestone-name,
          .streak-milestone .milestone-days {
            font-size: 0.8rem;
          }

          .milestone-points,
          .streak-milestone .milestone-points {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GamificationDashboard;