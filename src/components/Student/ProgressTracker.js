import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Badge, Button, Modal, Tab, Tabs, Alert, Spinner } from 'react-bootstrap';
import { FaTrophy, FaBook, FaClock, FaStar, FaChartLine, FaCalendarAlt, FaTarget, FaMedal, FaFire, FaGem, FaLightbulb, FaRocket, FaHeart, FaBrain, FaEye, FaDownload, FaPrint } from 'react-icons/fa';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    fetchProgressData();
    fetchAchievements();
  }, [selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo data - replace with actual API call
      const demoData = {
        overall: {
          level: 15,
          xp: 2450,
          xpToNext: 550,
          totalXp: 3000,
          streak: 12,
          completedLessons: 45,
          totalLessons: 60,
          averageScore: 87,
          studyTime: 156, // hours
          rank: 'Advanced Beginner'
        },
        weekly: {
          lessonsCompleted: 8,
          studyHours: 12.5,
          averageScore: 89,
          xpGained: 320,
          streak: 5,
          goals: {
            lessons: { target: 10, completed: 8 },
            hours: { target: 15, completed: 12.5 },
            score: { target: 85, achieved: 89 }
          }
        },
        subjects: [
          {
            name: 'Grammar',
            progress: 78,
            level: 'Intermediate',
            lessons: 18,
            totalLessons: 23,
            averageScore: 85,
            lastActivity: '2 hours ago',
            color: '#667eea'
          },
          {
            name: 'Vocabulary',
            progress: 92,
            level: 'Advanced',
            lessons: 22,
            totalLessons: 24,
            averageScore: 91,
            lastActivity: '1 day ago',
            color: '#764ba2'
          },
          {
            name: 'Listening',
            progress: 65,
            level: 'Intermediate',
            lessons: 13,
            totalLessons: 20,
            averageScore: 82,
            lastActivity: '3 hours ago',
            color: '#f093fb'
          },
          {
            name: 'Speaking',
            progress: 45,
            level: 'Beginner',
            lessons: 9,
            totalLessons: 20,
            averageScore: 78,
            lastActivity: '1 week ago',
            color: '#f5576c'
          },
          {
            name: 'Reading',
            progress: 83,
            level: 'Intermediate',
            lessons: 20,
            totalLessons: 24,
            averageScore: 88,
            lastActivity: '5 hours ago',
            color: '#4facfe'
          },
          {
            name: 'Writing',
            progress: 56,
            level: 'Beginner',
            lessons: 11,
            totalLessons: 20,
            averageScore: 80,
            lastActivity: '2 days ago',
            color: '#43e97b'
          }
        ],
        recentActivity: [
          {
            type: 'lesson',
            title: 'Past Perfect Tense',
            subject: 'Grammar',
            score: 92,
            xp: 45,
            date: '2024-01-15T10:30:00Z',
            duration: 25
          },
          {
            type: 'quiz',
            title: 'Business Vocabulary Quiz',
            subject: 'Vocabulary',
            score: 88,
            xp: 35,
            date: '2024-01-15T09:15:00Z',
            duration: 15
          },
          {
            type: 'exercise',
            title: 'Listening Comprehension',
            subject: 'Listening',
            score: 85,
            xp: 30,
            date: '2024-01-14T16:45:00Z',
            duration: 20
          },
          {
            type: 'lesson',
            title: 'Conditional Sentences',
            subject: 'Grammar',
            score: 90,
            xp: 40,
            date: '2024-01-14T14:20:00Z',
            duration: 30
          },
          {
            type: 'assignment',
            title: 'Essay Writing Practice',
            subject: 'Writing',
            score: 78,
            xp: 50,
            date: '2024-01-13T11:00:00Z',
            duration: 45
          }
        ],
        weeklyStats: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          studyTime: [2.5, 3.0, 1.5, 2.8, 3.2, 1.0, 0.5],
          xpGained: [45, 60, 30, 55, 70, 25, 15],
          lessonsCompleted: [2, 3, 1, 2, 3, 1, 0]
        }
      };
      
      setProgressData(demoData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      // Demo achievements data
      const demoAchievements = [
        {
          id: 1,
          title: 'Grammar Master',
          description: 'Complete 20 grammar lessons',
          icon: FaBrain,
          earned: true,
          earnedDate: '2024-01-10',
          progress: 20,
          target: 20,
          category: 'Learning',
          rarity: 'gold',
          xpReward: 100
        },
        {
          id: 2,
          title: 'Streak Warrior',
          description: 'Maintain a 10-day study streak',
          icon: FaFire,
          earned: true,
          earnedDate: '2024-01-12',
          progress: 12,
          target: 10,
          category: 'Consistency',
          rarity: 'silver',
          xpReward: 75
        },
        {
          id: 3,
          title: 'Vocabulary Collector',
          description: 'Learn 500 new words',
          icon: FaGem,
          earned: false,
          progress: 387,
          target: 500,
          category: 'Learning',
          rarity: 'gold',
          xpReward: 150
        },
        {
          id: 4,
          title: 'Quick Learner',
          description: 'Complete 5 lessons in one day',
          icon: FaRocket,
          earned: true,
          earnedDate: '2024-01-08',
          progress: 5,
          target: 5,
          category: 'Speed',
          rarity: 'bronze',
          xpReward: 50
        },
        {
          id: 5,
          title: 'Perfect Score',
          description: 'Get 100% on 10 quizzes',
          icon: FaStar,
          earned: false,
          progress: 7,
          target: 10,
          category: 'Excellence',
          rarity: 'platinum',
          xpReward: 200
        },
        {
          id: 6,
          title: 'Night Owl',
          description: 'Study after 10 PM for 7 days',
          icon: FaEye,
          earned: false,
          progress: 3,
          target: 7,
          category: 'Dedication',
          rarity: 'silver',
          xpReward: 80
        },
        {
          id: 7,
          title: 'Listening Expert',
          description: 'Complete all listening exercises',
          icon: FaHeart,
          earned: false,
          progress: 13,
          target: 20,
          category: 'Skills',
          rarity: 'gold',
          xpReward: 120
        },
        {
          id: 8,
          title: 'Knowledge Seeker',
          description: 'Spend 100 hours studying',
          icon: FaLightbulb,
          earned: true,
          earnedDate: '2024-01-14',
          progress: 156,
          target: 100,
          category: 'Dedication',
          rarity: 'platinum',
          xpReward: 250
        }
      ];
      
      setAchievements(demoAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  const handleDetailClick = (type, data) => {
    setSelectedDetail({ type, data });
    setShowDetailModal(true);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getRarityColor = (rarity) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2'
    };
    return colors[rarity] || '#6c757d';
  };

  const getActivityIcon = (type) => {
    const icons = {
      lesson: FaBook,
      quiz: FaBrain,
      exercise: FaTarget,
      assignment: FaRocket
    };
    return icons[type] || FaBook;
  };

  const exportProgress = () => {
    // Create a simple text report
    const report = `
Progress Report - ${new Date().toLocaleDateString()}

` +
      `Overall Progress:
` +
      `- Level: ${progressData.overall.level}
` +
      `- XP: ${progressData.overall.xp}/${progressData.overall.totalXp}
` +
      `- Completed Lessons: ${progressData.overall.completedLessons}/${progressData.overall.totalLessons}
` +
      `- Average Score: ${progressData.overall.averageScore}%
` +
      `- Study Time: ${progressData.overall.studyTime} hours
` +
      `- Current Streak: ${progressData.overall.streak} days

` +
      `Subject Progress:
` +
      progressData.subjects.map(subject => 
        `- ${subject.name}: ${subject.progress}% (${subject.lessons}/${subject.totalLessons} lessons)`
      ).join('\n');
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="progress-tracker-loading">
        <Spinner animation="border" variant="primary" size="lg" />
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (!progressData) {
    return (
      <Alert variant="danger" className="m-4">
        <Alert.Heading>Error Loading Progress</Alert.Heading>
        <p>We couldn't load your progress data. Please try refreshing the page.</p>
      </Alert>
    );
  }

  return (
    <div className="progress-tracker-container">
      {/* Header */}
      <div className="progress-header">
        <div className="header-content">
          <div className="header-info">
            <h2 className="header-title">Your Learning Journey</h2>
            <p className="header-subtitle">
              Track your progress, celebrate achievements, and reach your goals
            </p>
          </div>
          <div className="header-actions">
            <Button 
              variant="outline-light" 
              onClick={exportProgress}
              className="me-2"
            >
              <FaDownload className="me-2" />
              Export Report
            </Button>
            <Button 
              variant="outline-light" 
              onClick={() => window.print()}
            >
              <FaPrint className="me-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="overall-progress-card">
            <Card.Body>
              <div className="overall-header">
                <div className="level-info">
                  <div className="level-badge">
                    <FaTrophy className="level-icon" />
                    <span className="level-number">Level {progressData.overall.level}</span>
                  </div>
                  <div className="rank-info">
                    <h5 className="rank-title">{progressData.overall.rank}</h5>
                    <p className="xp-info">
                      {progressData.overall.xp.toLocaleString()} XP
                      <span className="xp-next"> • {progressData.overall.xpToNext} to next level</span>
                    </p>
                  </div>
                </div>
                <div className="streak-info">
                  <FaFire className="streak-icon" />
                  <div>
                    <div className="streak-number">{progressData.overall.streak}</div>
                    <div className="streak-label">Day Streak</div>
                  </div>
                </div>
              </div>
              
              <div className="xp-progress">
                <ProgressBar 
                  now={(progressData.overall.xp / progressData.overall.totalXp) * 100}
                  className="xp-bar"
                />
              </div>
              
              <Row className="overall-stats">
                <Col md={3}>
                  <div className="stat-item">
                    <FaBook className="stat-icon" />
                    <div>
                      <div className="stat-number">
                        {progressData.overall.completedLessons}/{progressData.overall.totalLessons}
                      </div>
                      <div className="stat-label">Lessons</div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-item">
                    <FaStar className="stat-icon" />
                    <div>
                      <div className="stat-number">{progressData.overall.averageScore}%</div>
                      <div className="stat-label">Avg Score</div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-item">
                    <FaClock className="stat-icon" />
                    <div>
                      <div className="stat-number">{progressData.overall.studyTime}h</div>
                      <div className="stat-label">Study Time</div>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-item">
                    <FaChartLine className="stat-icon" />
                    <div>
                      <div className="stat-number">
                        {Math.round((progressData.overall.completedLessons / progressData.overall.totalLessons) * 100)}%
                      </div>
                      <div className="stat-label">Complete</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="weekly-goals-card">
            <Card.Body>
              <h6 className="card-title">
                <FaTarget className="me-2" />
                Weekly Goals
              </h6>
              
              <div className="goal-item">
                <div className="goal-header">
                  <span>Lessons</span>
                  <span>{progressData.weekly.goals.lessons.completed}/{progressData.weekly.goals.lessons.target}</span>
                </div>
                <ProgressBar 
                  now={(progressData.weekly.goals.lessons.completed / progressData.weekly.goals.lessons.target) * 100}
                  variant="success"
                  className="goal-progress"
                />
              </div>
              
              <div className="goal-item">
                <div className="goal-header">
                  <span>Study Hours</span>
                  <span>{progressData.weekly.goals.hours.completed}/{progressData.weekly.goals.hours.target}h</span>
                </div>
                <ProgressBar 
                  now={(progressData.weekly.goals.hours.completed / progressData.weekly.goals.hours.target) * 100}
                  variant="info"
                  className="goal-progress"
                />
              </div>
              
              <div className="goal-item">
                <div className="goal-header">
                  <span>Target Score</span>
                  <span>{progressData.weekly.goals.score.achieved}% / {progressData.weekly.goals.score.target}%</span>
                </div>
                <ProgressBar 
                  now={progressData.weekly.goals.score.achieved >= progressData.weekly.goals.score.target ? 100 : 
                       (progressData.weekly.goals.score.achieved / progressData.weekly.goals.score.target) * 100}
                  variant={progressData.weekly.goals.score.achieved >= progressData.weekly.goals.score.target ? "success" : "warning"}
                  className="goal-progress"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Subject Progress */}
      <Card className="subjects-card mb-4">
        <Card.Body>
          <h5 className="card-title">
            <FaBook className="me-2" />
            Subject Progress
          </h5>
          
          <Row>
            {progressData.subjects.map((subject, index) => (
              <Col lg={4} md={6} key={index} className="mb-3">
                <div 
                  className="subject-card"
                  onClick={() => handleDetailClick('subject', subject)}
                >
                  <div className="subject-header">
                    <div className="subject-info">
                      <h6 className="subject-name">{subject.name}</h6>
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="subject-level"
                      >
                        {subject.level}
                      </Badge>
                    </div>
                    <div className="subject-progress-circle">
                      <div 
                        className="progress-circle"
                        style={{
                          background: `conic-gradient(${subject.color} ${subject.progress * 3.6}deg, #e9ecef 0deg)`
                        }}
                      >
                        <span className="progress-text">{subject.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="subject-stats">
                    <div className="subject-stat">
                      <span className="stat-label">Lessons:</span>
                      <span className="stat-value">{subject.lessons}/{subject.totalLessons}</span>
                    </div>
                    <div className="subject-stat">
                      <span className="stat-label">Avg Score:</span>
                      <span className="stat-value">{subject.averageScore}%</span>
                    </div>
                    <div className="subject-stat">
                      <span className="stat-label">Last Activity:</span>
                      <span className="stat-value">{subject.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Achievements and Recent Activity */}
      <Row>
        <Col lg={6}>
          <Card className="achievements-card">
            <Card.Body>
              <div className="achievements-header">
                <h5 className="card-title">
                  <FaMedal className="me-2" />
                  Achievements
                </h5>
                <Badge bg="primary">
                  {achievements.filter(a => a.earned).length}/{achievements.length}
                </Badge>
              </div>
              
              <div className="achievements-grid">
                {achievements.slice(0, 6).map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={achievement.id}
                      className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}
                      onClick={() => handleAchievementClick(achievement)}
                    >
                      <div 
                        className="achievement-icon"
                        style={{ color: achievement.earned ? getRarityColor(achievement.rarity) : '#6c757d' }}
                      >
                        <IconComponent />
                      </div>
                      <div className="achievement-info">
                        <div className="achievement-title">{achievement.title}</div>
                        {achievement.earned ? (
                          <div className="achievement-date">
                            Earned {formatDate(achievement.earnedDate)}
                          </div>
                        ) : (
                          <div className="achievement-progress">
                            {achievement.progress}/{achievement.target}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleDetailClick('achievements', achievements)}
                >
                  View All Achievements
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="activity-card">
            <Card.Body>
              <h5 className="card-title">
                <FaCalendarAlt className="me-2" />
                Recent Activity
              </h5>
              
              <div className="activity-list">
                {progressData.recentActivity.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <IconComponent />
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">{activity.title}</div>
                        <div className="activity-meta">
                          <Badge bg="light" text="dark" className="me-2">
                            {activity.subject}
                          </Badge>
                          <span className="activity-score">Score: {activity.score}%</span>
                          <span className="activity-xp">+{activity.xp} XP</span>
                        </div>
                        <div className="activity-details">
                          <span className="activity-duration">{formatDuration(activity.duration)}</span>
                          <span className="activity-date">{formatDate(activity.date)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleDetailClick('activity', progressData.recentActivity)}
                >
                  View All Activity
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Achievement Detail Modal */}
      <Modal 
        show={showAchievementModal} 
        onHide={() => setShowAchievementModal(false)}
        centered
        size="lg"
      >
        {selectedAchievement && (
          <>
            <Modal.Header closeButton className="achievement-modal-header">
              <Modal.Title>
                <selectedAchievement.icon className="me-2" />
                {selectedAchievement.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="achievement-detail">
                <div className="achievement-status">
                  {selectedAchievement.earned ? (
                    <Badge 
                      bg="success" 
                      className="achievement-badge"
                    >
                      <FaTrophy className="me-1" />
                      Earned
                    </Badge>
                  ) : (
                    <Badge 
                      bg="secondary" 
                      className="achievement-badge"
                    >
                      Locked
                    </Badge>
                  )}
                  <Badge 
                    style={{ backgroundColor: getRarityColor(selectedAchievement.rarity) }}
                    className="rarity-badge"
                  >
                    {selectedAchievement.rarity.charAt(0).toUpperCase() + selectedAchievement.rarity.slice(1)}
                  </Badge>
                </div>
                
                <p className="achievement-description">
                  {selectedAchievement.description}
                </p>
                
                {!selectedAchievement.earned && (
                  <div className="achievement-progress-detail">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span>{selectedAchievement.progress}/{selectedAchievement.target}</span>
                    </div>
                    <ProgressBar 
                      now={(selectedAchievement.progress / selectedAchievement.target) * 100}
                      className="achievement-progress-bar"
                    />
                  </div>
                )}
                
                <div className="achievement-reward">
                  <strong>Reward:</strong> +{selectedAchievement.xpReward} XP
                </div>
                
                {selectedAchievement.earned && (
                  <div className="achievement-earned-date">
                    <strong>Earned:</strong> {new Date(selectedAchievement.earnedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDetail?.type === 'subject' && 'Subject Details'}
            {selectedDetail?.type === 'achievements' && 'All Achievements'}
            {selectedDetail?.type === 'activity' && 'Activity History'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetail?.type === 'subject' && selectedDetail.data && (
            <div className="subject-detail">
              <Row>
                <Col md={6}>
                  <h5>{selectedDetail.data.name}</h5>
                  <p><strong>Level:</strong> {selectedDetail.data.level}</p>
                  <p><strong>Progress:</strong> {selectedDetail.data.progress}%</p>
                  <p><strong>Completed Lessons:</strong> {selectedDetail.data.lessons}/{selectedDetail.data.totalLessons}</p>
                  <p><strong>Average Score:</strong> {selectedDetail.data.averageScore}%</p>
                  <p><strong>Last Activity:</strong> {selectedDetail.data.lastActivity}</p>
                </Col>
                <Col md={6}>
                  <div className="subject-progress-visual">
                    <div 
                      className="large-progress-circle"
                      style={{
                        background: `conic-gradient(${selectedDetail.data.color} ${selectedDetail.data.progress * 3.6}deg, #e9ecef 0deg)`
                      }}
                    >
                      <span className="large-progress-text">{selectedDetail.data.progress}%</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
          
          {selectedDetail?.type === 'achievements' && (
            <div className="all-achievements">
              <Row>
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Col md={6} lg={4} key={achievement.id} className="mb-3">
                      <div className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                        <div className="achievement-card-header">
                          <div 
                            className="achievement-card-icon"
                            style={{ color: achievement.earned ? getRarityColor(achievement.rarity) : '#6c757d' }}
                          >
                            <IconComponent />
                          </div>
                          <Badge 
                            style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                            className="rarity-badge-small"
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <h6 className="achievement-card-title">{achievement.title}</h6>
                        <p className="achievement-card-description">{achievement.description}</p>
                        {achievement.earned ? (
                          <div className="achievement-earned">
                            <Badge bg="success">Earned</Badge>
                            <small className="text-muted d-block">
                              {formatDate(achievement.earnedDate)}
                            </small>
                          </div>
                        ) : (
                          <div className="achievement-progress-small">
                            <div className="progress-text-small">
                              {achievement.progress}/{achievement.target}
                            </div>
                            <ProgressBar 
                              now={(achievement.progress / achievement.target) * 100}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
          
          {selectedDetail?.type === 'activity' && (
            <div className="activity-history">
              {progressData.recentActivity.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={index} className="activity-history-item">
                    <div className="activity-history-icon">
                      <IconComponent />
                    </div>
                    <div className="activity-history-content">
                      <div className="activity-history-header">
                        <h6 className="activity-history-title">{activity.title}</h6>
                        <div className="activity-history-meta">
                          <Badge bg="light" text="dark">{activity.subject}</Badge>
                          <span className="activity-history-date">{formatDate(activity.date)}</span>
                        </div>
                      </div>
                      <div className="activity-history-stats">
                        <div className="stat">Score: <strong>{activity.score}%</strong></div>
                        <div className="stat">XP: <strong>+{activity.xp}</strong></div>
                        <div className="stat">Duration: <strong>{formatDuration(activity.duration)}</strong></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProgressTracker;