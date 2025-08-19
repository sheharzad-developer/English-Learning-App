import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Row, Col, Nav } from 'react-bootstrap';
import { lessonService } from '../../services/lessonService';
import './Leaderboard.css';

const Leaderboard = ({ currentUserId, timeframe = 'all_time' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState(timeframe);
  const [refreshing, setRefreshing] = useState(false);

  const timeframes = [
    { key: 'daily', label: 'Today', icon: 'fas fa-calendar-day' },
    { key: 'weekly', label: 'This Week', icon: 'fas fa-calendar-week' },
    { key: 'monthly', label: 'This Month', icon: 'fas fa-calendar-alt' },
    { key: 'all_time', label: 'All Time', icon: 'fas fa-infinity' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTimeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await lessonService.getLeaderboard({
        timeframe: activeTimeframe,
        limit: 50
      });

      const data = response.data.results || [];
      setLeaderboardData(data);

      // Find current user's rank
      const userIndex = data.findIndex(entry => entry.user.id === currentUserId);
      if (userIndex !== -1) {
        setUserRank({
          ...data[userIndex],
          rank: userIndex + 1
        });
      } else {
        // If user not in top 50, fetch their specific rank
        try {
          const userRankResponse = await lessonService.getUserRank(currentUserId, activeTimeframe);
          setUserRank(userRankResponse.data);
        } catch (err) {
          console.warn('Could not fetch user rank:', err);
          setUserRank(null);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankBadgeVariant = (rank) => {
    switch (rank) {
      case 1: return 'warning';
      case 2: return 'light';
      case 3: return 'secondary';
      default: return 'outline-primary';
    }
  };

  const formatPoints = (points) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'danger';
    if (streak >= 14) return 'warning';
    if (streak >= 7) return 'success';
    if (streak >= 3) return 'info';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3 text-muted">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchLeaderboard}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="leaderboard">
      <Card className="leaderboard-card">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <i className="fas fa-trophy me-2"></i>
                Leaderboard
              </h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''}`}></i>
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {/* Timeframe Navigation */}
          <Nav variant="tabs" className="timeframe-nav">
            {timeframes.map((tf) => (
              <Nav.Item key={tf.key}>
                <Nav.Link 
                  active={activeTimeframe === tf.key}
                  onClick={() => setActiveTimeframe(tf.key)}
                  className="d-flex align-items-center"
                >
                  <i className={`${tf.icon} me-1`}></i>
                  <span className="d-none d-sm-inline">{tf.label}</span>
                  <span className="d-sm-none">{tf.label.split(' ')[0]}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Current User Rank (if not in top list) */}
          {userRank && userRank.rank > 10 && (
            <div className="current-user-rank p-3 bg-light border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Badge bg={getRankBadgeVariant(userRank.rank)} className="me-2">
                    {getRankIcon(userRank.rank)}
                  </Badge>
                  <div>
                    <strong>Your Rank</strong>
                    <div className="text-muted small">
                      {userRank.user.first_name} {userRank.user.last_name}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="fw-bold text-primary">
                    <i className="fas fa-star me-1"></i>
                    {formatPoints(userRank.total_points)}
                  </div>
                  {userRank.current_streak > 0 && (
                    <Badge bg={getStreakColor(userRank.current_streak)} className="mt-1">
                      <i className="fas fa-fire me-1"></i>
                      {userRank.current_streak}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          {leaderboardData.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">No rankings available</h6>
              <p className="text-muted small">Be the first to earn points and appear on the leaderboard!</p>
            </div>
          ) : (
            <Table responsive className="leaderboard-table mb-0">
              <thead className="table-light">
                <tr>
                  <th width="60">Rank</th>
                  <th>User</th>
                  <th width="100" className="text-center">Points</th>
                  <th width="80" className="text-center d-none d-md-table-cell">Streak</th>
                  <th width="100" className="text-center d-none d-lg-table-cell">Badges</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = entry.user.id === currentUserId;
                  
                  return (
                    <tr 
                      key={entry.user.id} 
                      className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''}`}
                    >
                      <td className="rank-cell">
                        <Badge bg={getRankBadgeVariant(rank)} className="rank-badge">
                          {getRankIcon(rank)}
                        </Badge>
                      </td>
                      
                      <td className="user-cell">
                        <div className="d-flex align-items-center">
                          <div className="user-avatar me-2">
                            {entry.user.profile_picture ? (
                              <img 
                                src={entry.user.profile_picture} 
                                alt={`${entry.user.first_name}'s avatar`}
                                className="avatar-img"
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                {entry.user.first_name?.[0]}{entry.user.last_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="user-name">
                              {entry.user.first_name} {entry.user.last_name}
                              {isCurrentUser && (
                                <Badge bg="info" className="ms-2 small">You</Badge>
                              )}
                            </div>
                            <div className="user-level text-muted small">
                              Level {entry.level || 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="text-center points-cell">
                        <div className="fw-bold text-primary">
                          <i className="fas fa-star me-1"></i>
                          {formatPoints(entry.total_points)}
                        </div>
                      </td>
                      
                      <td className="text-center d-none d-md-table-cell">
                        {entry.current_streak > 0 ? (
                          <Badge bg={getStreakColor(entry.current_streak)}>
                            <i className="fas fa-fire me-1"></i>
                            {entry.current_streak}
                          </Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      
                      <td className="text-center d-none d-lg-table-cell">
                        <Badge bg="secondary">
                          <i className="fas fa-medal me-1"></i>
                          {entry.badge_count || 0}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Leaderboard;