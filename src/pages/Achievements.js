import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

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
      learning: '📚',
      quiz: '🧩',
      vocabulary: '📝',
      grammar: '📖',
      streak: '🔥',
      level: '🎓',
      default: '🏆'
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

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">🏆 Achievements</h1>
        <p className="lead text-muted">Track your learning milestones and celebrate your progress!</p>
        
        {error && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
        
        <div className="achievement-summary mt-4">
          <Row className="justify-content-center">
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h3 className="text-primary">{earnedCount}</h3>
                  <p className="text-muted mb-0">Earned</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h3 className="text-success">{totalCount}</h3>
                  <p className="text-muted mb-0">Total</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h3 className="text-warning">{totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%</h3>
                  <p className="text-muted mb-0">Progress</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Row className="g-4">
        {achievements.map((achievement) => (
          <Col md={6} lg={4} key={achievement.id}>
            <Card className={`h-100 border-0 shadow-sm achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
              <Card.Body className="text-center p-4">
                <div className="achievement-icon mb-3">
                  <div 
                    className={`icon-circle ${achievement.earned ? 'earned' : 'locked'}`}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      backgroundColor: achievement.earned ? 'var(--bs-warning)' : 'var(--bs-light)',
                      color: achievement.earned ? 'white' : 'var(--bs-secondary)',
                      borderRadius: '50%',
                      border: achievement.earned ? '3px solid gold' : '3px solid var(--bs-border-color)'
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
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Earned!
                      </Badge>
                    </div>
                  )}
                  
                  {!achievement.earned && (
                    <div className="locked-status mt-3">
                      <Badge bg="secondary" className="px-3 py-2">
                        <i className="bi bi-lock-fill me-1"></i>
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

      {achievements.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="bi bi-trophy text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="mt-3 text-muted">No Achievements Yet</h4>
          <p className="text-muted">Start learning to unlock your first achievement!</p>
        </div>
      )}

      <style jsx>{`
        .achievement-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .achievement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .achievement-card.earned {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 255, 255, 1) 100%);
        }
        
        .achievement-card.locked {
          opacity: 0.7;
        }
        
        .icon-circle.earned {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Container>
  );
};

export default Achievements; 