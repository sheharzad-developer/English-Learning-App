import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { lessonService } from '../../services/lessonService';
import './BadgeDisplay.css';

const BadgeDisplay = ({ userId, showAll = false }) => {
  const [userBadges, setUserBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBadgeData();
  }, [userId]);

  const fetchBadgeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userBadgesResponse, allBadgesResponse] = await Promise.all([
        lessonService.getUserBadges(userId),
        lessonService.getBadges()
      ]);

      setUserBadges(userBadgesResponse.data.results || []);
      setAllBadges(allBadgesResponse.data.results || []);
    } catch (err) {
      console.error('Error fetching badge data:', err);
      setError('Failed to load badges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowModal(true);
  };

  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'secondary';
      case 'rare': return 'primary';
      case 'epic': return 'warning';
      case 'legendary': return 'danger';
      default: return 'light';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return '🥉';
      case 'rare': return '🥈';
      case 'epic': return '🥇';
      case 'legendary': return '👑';
      default: return '🏅';
    }
  };

  const isEarned = (badgeId) => {
    return userBadges.some(userBadge => userBadge.badge.id === badgeId);
  };

  const getEarnedDate = (badgeId) => {
    const userBadge = userBadges.find(ub => ub.badge.id === badgeId);
    return userBadge ? new Date(userBadge.earned_at).toLocaleDateString() : null;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading badges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchBadgeData}>
          Retry
        </Button>
      </Alert>
    );
  }

  const badgesToShow = showAll ? allBadges : userBadges.map(ub => ub.badge);

  return (
    <div className="badge-display">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <i className="fas fa-medal me-2"></i>
          {showAll ? 'All Badges' : 'Earned Badges'}
        </h5>
        <Badge bg="info">
          {showAll ? `${userBadges.length}/${allBadges.length}` : userBadges.length}
        </Badge>
      </div>

      {badgesToShow.length === 0 ? (
        <div className="text-center py-4">
          <i className="fas fa-medal fa-3x text-muted mb-3"></i>
          <h6 className="text-muted">
            {showAll ? 'No badges available' : 'No badges earned yet'}
          </h6>
          <p className="text-muted small">
            {showAll ? 'Check back later for new badges!' : 'Complete lessons and exercises to earn badges!'}
          </p>
        </div>
      ) : (
        <Row className="g-3">
          {badgesToShow.map((badge) => {
            const earned = showAll ? isEarned(badge.id) : true;
            const earnedDate = getEarnedDate(badge.id);
            
            return (
              <Col key={badge.id} xs={6} md={4} lg={3}>
                <Card 
                  className={`badge-card h-100 ${earned ? 'earned' : 'locked'}`}
                  onClick={() => handleBadgeClick(badge)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="text-center p-3">
                    <div className="badge-icon mb-2">
                      {badge.icon ? (
                        <img src={badge.icon} alt={badge.name} className="badge-image" />
                      ) : (
                        <span className="badge-emoji">{getRarityIcon(badge.rarity)}</span>
                      )}
                      {!earned && <div className="lock-overlay"><i className="fas fa-lock"></i></div>}
                    </div>
                    
                    <h6 className={`badge-name ${!earned ? 'text-muted' : ''}`}>
                      {badge.name}
                    </h6>
                    
                    <Badge 
                      bg={getRarityColor(badge.rarity)} 
                      className="rarity-badge mb-2"
                    >
                      {badge.rarity}
                    </Badge>
                    
                    {earned && earnedDate && (
                      <small className="text-muted d-block">
                        Earned: {earnedDate}
                      </small>
                    )}
                    
                    {badge.points_reward > 0 && (
                      <div className="points-reward mt-1">
                        <i className="fas fa-star text-warning me-1"></i>
                        <small>{badge.points_reward} pts</small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Badge Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            {selectedBadge?.icon ? (
              <img src={selectedBadge.icon} alt={selectedBadge?.name} className="modal-badge-icon me-2" />
            ) : (
              <span className="modal-badge-emoji me-2">{getRarityIcon(selectedBadge?.rarity)}</span>
            )}
            {selectedBadge?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBadge && (
            <div>
              <div className="mb-3">
                <Badge bg={getRarityColor(selectedBadge.rarity)} className="mb-2">
                  {selectedBadge.rarity} Badge
                </Badge>
                {selectedBadge.points_reward > 0 && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    <i className="fas fa-star me-1"></i>
                    {selectedBadge.points_reward} Points
                  </Badge>
                )}
              </div>
              
              <p className="mb-3">{selectedBadge.description}</p>
              
              {selectedBadge.criteria && (
                <div className="criteria-section">
                  <h6>Requirements:</h6>
                  <div className="criteria-list">
                    {Object.entries(selectedBadge.criteria).map(([key, value]) => (
                      <div key={key} className="criteria-item">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <span className="text-capitalize">{key.replace('_', ' ')}: {value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {showAll && (
                <div className="mt-3">
                  {isEarned(selectedBadge.id) ? (
                    <div className="earned-status">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <span className="text-success">Earned on {getEarnedDate(selectedBadge.id)}</span>
                    </div>
                  ) : (
                    <div className="locked-status">
                      <i className="fas fa-lock text-muted me-2"></i>
                      <span className="text-muted">Not earned yet</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BadgeDisplay;