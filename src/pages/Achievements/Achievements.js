import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { 
  Trophy, 
  Award, 
  Star, 
  Lock, 
  CheckCircle, 
  Share, 
  Book, 
  Puzzle, 
  FileText, 
  Fire, 
  Mortarboard,
  Bullseye,
  Copy,
  Lightbulb
} from 'react-bootstrap-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Try multiple endpoints with fallback
        let achievementsData = [];
        let userBadgesData = [];
        let hasRealData = false;

        // Try learning endpoints first
        try {
          const [achievementsRes, badgesRes] = await Promise.allSettled([
            axios.get('http://127.0.0.1:8000/api/learning/badges/', { headers }),
            axios.get('http://127.0.0.1:8000/api/learning/my-badges/', { headers })
          ]);
          
          if (achievementsRes.status === 'fulfilled') {
            achievementsData = achievementsRes.value.data.results || achievementsRes.value.data || [];
            hasRealData = true;
          }
          
          if (badgesRes.status === 'fulfilled') {
            userBadgesData = badgesRes.value.data.results || badgesRes.value.data || [];
          }
        } catch (error) {
          console.log('Learning endpoints not available, trying lessons endpoints...');
        }

        // Fallback to lessons endpoints
        if (!hasRealData) {
          try {
            const [achievementsRes, badgesRes] = await Promise.allSettled([
              axios.get('http://127.0.0.1:8000/api/lessons/achievements/', { headers }),
              axios.get('http://127.0.0.1:8000/api/lessons/user-badges/', { headers })
            ]);
            
            if (achievementsRes.status === 'fulfilled') {
              achievementsData = achievementsRes.value.data.results || achievementsRes.value.data || [];
              hasRealData = true;
            }
            
            if (badgesRes.status === 'fulfilled') {
              userBadgesData = badgesRes.value.data.results || badgesRes.value.data || [];
            }
          } catch (error) {
            console.log('Lessons endpoints not available, using demo data...');
          }
        }

        if (hasRealData) {
          setAchievements(achievementsData);
          setUserBadges(userBadgesData);
          setError(null);
        } else {
          throw new Error('No endpoints available');
        }
        
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setError('Backend not available. Showing demo achievements.');
        
        // Set comprehensive demo data
        setAchievements([
          {
            id: 1,
            name: 'First Steps',
            description: 'Complete your first lesson',
            badge_image: '',
            points_required: 10,
            category: 'learning',
            earned: true
          },
          {
            id: 2,
            name: 'Quiz Master',
            description: 'Complete 5 quizzes with 80% or higher',
            badge_image: '',
            points_required: 50,
            category: 'quiz',
            earned: true
          },
          {
            id: 3,
            name: 'Vocabulary Builder',
            description: 'Learn 100 new words',
            badge_image: '',
            points_required: 100,
            category: 'vocabulary',
            earned: false
          },
          {
            id: 4,
            name: 'Grammar Guru',
            description: 'Master all grammar exercises',
            badge_image: '',
            points_required: 200,
            category: 'grammar',
            earned: false
          },
          {
            id: 5,
            name: 'Streak Champion',
            description: 'Maintain a 7-day learning streak',
            badge_image: '',
            points_required: 75,
            category: 'streak',
            earned: true
          },
          {
            id: 6,
            name: 'Advanced Learner',
            description: 'Complete advanced level lessons',
            badge_image: '',
            points_required: 300,
            category: 'level',
            earned: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const getCategoryIcon = (category) => {
    const icons = {
      learning: <Book />,
      quiz: <Puzzle />,
      vocabulary: <FileText />,
      grammar: <FileText />,
      streak: <Fire />,
      level: <Mortarboard />,
      default: <Trophy />
    };
    return icons[category] || icons.default;
  };

  const getCategoryColor = (category) => {
    const colors = {
      learning: 'primary',
      quiz: 'success',
      vocabulary: 'warning',
      grammar: 'info',
      streak: 'danger',
      level: 'secondary'
    };
    return colors[category] || 'primary';
  };

  const shareAchievements = () => {
    const earnedAchievements = achievements.filter(a => a.earned);
    const shareText = `I've earned ${earnedAchievements.length} achievements on the English Learning App! 🏆`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Achievements',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 2000);
    }
  };

  const getNextBadgeHint = () => {
    const lockedAchievements = achievements.filter(a => !a.earned);
    if (lockedAchievements.length === 0) return null;
    
    // Return the achievement with the lowest points requirement
    return lockedAchievements.reduce((lowest, current) => 
      (current.points_required || 0) < (lowest.points_required || 0) ? current : lowest
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading achievements...</p>
        </div>
      </Container>
    );
  }

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;
  const nextBadgeHint = getNextBadgeHint();

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <Trophy /> Achievements
        </h1>
        <p className="lead text-muted">Track your learning milestones and celebrate your progress!</p>
        
        {error && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
        
        <div className="achievement-summary mt-4">
          <Row className="justify-content-center">
            <Col md={3}>
              <Card className={`border-0 shadow-sm ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <Card.Body className="text-center">
                  <div className="achievement-stat-icon">
                    <Award />
                  </div>
                  <h3 className="text-primary">{earnedCount}</h3>
                  <p className="text-muted mb-0">Earned</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className={`border-0 shadow-sm ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <Card.Body className="text-center">
                                  <div className="achievement-stat-icon">
                  <Bullseye />
                </div>
                  <h3 className="text-success">{totalCount}</h3>
                  <p className="text-muted mb-0">Total</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className={`border-0 shadow-sm ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <Card.Body className="text-center">
                  <div className="achievement-stat-icon">
                    <Star />
                  </div>
                  <h3 className="text-warning">{progressPercentage}%</h3>
                  <p className="text-muted mb-0">Progress</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className={`border-0 shadow-sm ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <Card.Body className="text-center">
                  <div className="achievement-stat-icon">
                    <Share />
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={shareAchievements}
                    className="mt-2"
                  >
                    Share
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Category Filter */}
        <div className="category-filter mb-4">
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {Array.from(new Set(achievements.map(a => a.category))).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)} {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Next Badge Hint */}
        {nextBadgeHint && (
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <Lightbulb className="me-2" />
              <div>
                <strong>Next Badge Hint:</strong> {nextBadgeHint.name} - {nextBadgeHint.description}
                {nextBadgeHint.points_required && (
                  <span className="ms-2">
                    <Star className="text-warning" /> {nextBadgeHint.points_required} points needed
                  </span>
                )}
              </div>
            </div>
          </Alert>
        )}
      </div>

      <Row className="g-4">
        {filteredAchievements.map((achievement) => (
          <Col md={6} lg={4} key={achievement.id}>
            <Card className={`h-100 border-0 shadow-sm achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
              <Card.Body className="text-center p-4">
                <div className="achievement-icon mb-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {achievement.earned ? 'Earned!' : 'Locked - Keep learning to unlock!'}
                      </Tooltip>
                    }
                  >
                    <div 
                      className={`icon-circle ${achievement.earned ? 'earned' : 'locked'} ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        backgroundColor: achievement.earned 
                          ? (isDarkMode ? '#FFD700' : '#FFC107') 
                          : (isDarkMode ? '#495057' : '#f8f9fa'),
                        color: achievement.earned 
                          ? (isDarkMode ? '#000' : '#fff') 
                          : (isDarkMode ? '#adb5bd' : '#6c757d'),
                        borderRadius: '50%',
                        border: achievement.earned 
                          ? '3px solid #FFD700' 
                          : `3px solid ${isDarkMode ? '#6c757d' : '#dee2e6'}`
                      }}
                    >
                      {achievement.badge_image ? (
                        <img 
                          src={achievement.badge_image} 
                          alt={achievement.name}
                          style={{ width: '60px', height: '60px' }}
                        />
                      ) : (
                        getCategoryIcon(achievement.category)
                      )}
                    </div>
                  </OverlayTrigger>
                </div>
                
                <div className="achievement-info">
                  <h5 className="card-title mb-2">{achievement.name}</h5>
                  <p className="card-text text-muted small mb-3">{achievement.description}</p>
                  
                  <div className="achievement-meta">
                    <Badge 
                      bg={getCategoryColor(achievement.category)} 
                      className="mb-2"
                    >
                      {achievement.category || 'General'}
                    </Badge>
                    
                    {achievement.points_required && (
                      <div className="points-info">
                        <small className="text-muted">
                          <i className="bi bi-star-fill me-1"></i>
                          {achievement.points_required} points
                        </small>
                      </div>
                    )}
                  </div>
                  
                  {achievement.earned && (
                    <div className="earned-status mt-3">
                      <Badge bg="success" className="px-3 py-2">
                        <CheckCircle className="me-1" />
                        Earned!
                      </Badge>
                    </div>
                  )}
                  
                  {!achievement.earned && (
                    <div className="locked-status mt-3">
                      <Badge bg="secondary" className="px-3 py-2">
                        <Lock className="me-1" />
                        Locked
                      </Badge>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredAchievements.length === 0 && !loading && (
        <div className="text-center py-5">
          <Trophy className="text-muted" style={{ fontSize: '4rem' }} />
          <h4 className="mt-3 text-muted">No Achievements Found</h4>
          <p className="text-muted">
            {selectedCategory === 'all' 
              ? 'Start learning to unlock your first achievement!' 
              : `No achievements found in the "${selectedCategory}" category.`}
          </p>
        </div>
      )}

      {/* Share Success Modal */}
      {showShareModal && (
        <div className="position-fixed top-50 start-50 translate-middle">
          <Alert variant="success" className="mb-0">
            <Copy className="me-2" />
            Achievement link copied to clipboard!
          </Alert>
        </div>
      )}


    </Container>
  );
};

export default Achievements; 