import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Alert, Spinner } from 'react-bootstrap';
import { lessonService } from '../services/lessonService';
import './UserProgress.css';

const UserProgress = ({ userId }) => {
    const [userStats, setUserStats] = useState(null);
    const [userProgress, setUserProgress] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch user statistics
            const statsResponse = await lessonService.getUserStats(userId);
            setUserStats(statsResponse.data);

            // Fetch user progress
            const progressResponse = await lessonService.getUserProgress({ user: userId });
            setUserProgress(progressResponse.data.results || []);

            // Fetch user badges
            const badgesResponse = await lessonService.getUserBadges(userId);
            setUserBadges(badgesResponse.data.results || []);

        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load user progress data');
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallProgress = () => {
        if (!userProgress.length) return 0;
        const totalProgress = userProgress.reduce((sum, progress) => sum + progress.progress_percentage, 0);
        return Math.round(totalProgress / userProgress.length);
    };

    const getSkillLevelColor = (level) => {
        const colors = {
            'beginner': 'success',
            'intermediate': 'warning',
            'advanced': 'danger',
            'expert': 'dark'
        };
        return colors[level?.toLowerCase()] || 'secondary';
    };

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    if (loading) {
        return (
            <Container className="user-progress-container">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading your progress...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="user-progress-container">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="user-progress-container">
            <Row className="mb-4">
                <Col>
                    <h2 className="progress-title">Your Learning Progress</h2>
                    <p className="progress-subtitle">Track your journey and achievements</p>
                </Col>
            </Row>

            {/* Overall Statistics */}
            {userStats && (
                <Row className="mb-4">
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-icon total-points">
                                    <i className="fas fa-star"></i>
                                </div>
                                <h3 className="stat-number">{userStats.total_points || 0}</h3>
                                <p className="stat-label">Total Points</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-icon lessons-completed">
                                    <i className="fas fa-book"></i>
                                </div>
                                <h3 className="stat-number">{userStats.lessons_completed || 0}</h3>
                                <p className="stat-label">Lessons Completed</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-icon exercises-completed">
                                    <i className="fas fa-tasks"></i>
                                </div>
                                <h3 className="stat-number">{userStats.exercises_completed || 0}</h3>
                                <p className="stat-label">Exercises Done</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-icon study-time">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <h3 className="stat-number">{formatTime(userStats.total_study_time || 0)}</h3>
                                <p className="stat-label">Study Time</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Overall Progress */}
            <Row className="mb-4">
                <Col>
                    <Card className="progress-overview-card">
                        <Card.Header>
                            <h5 className="mb-0">Overall Progress</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="overall-progress">
                                <div className="progress-info">
                                    <span className="progress-label">Learning Progress</span>
                                    <span className="progress-percentage">{calculateOverallProgress()}%</span>
                                </div>
                                <ProgressBar 
                                    now={calculateOverallProgress()} 
                                    variant="success"
                                    className="overall-progress-bar"
                                />
                                <div className="progress-details">
                                    <small className="text-muted">
                                        {userProgress.length} lessons in progress
                                    </small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Lesson Progress */}
                <Col lg={8} className="mb-4">
                    <Card className="lesson-progress-card">
                        <Card.Header>
                            <h5 className="mb-0">Lesson Progress</h5>
                        </Card.Header>
                        <Card.Body>
                            {userProgress.length > 0 ? (
                                <div className="lesson-progress-list">
                                    {userProgress.map((progress) => (
                                        <div key={progress.id} className="lesson-progress-item">
                                            <div className="lesson-info">
                                                <h6 className="lesson-title">
                                                    {progress.lesson?.title || 'Unknown Lesson'}
                                                </h6>
                                                <div className="lesson-meta">
                                                    <Badge 
                                                        bg={getSkillLevelColor(progress.lesson?.skill_level)}
                                                        className="me-2"
                                                    >
                                                        {progress.lesson?.skill_level || 'Unknown'}
                                                    </Badge>
                                                    <small className="text-muted">
                                                        Last studied: {new Date(progress.last_accessed).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="lesson-progress">
                                                <div className="progress-info">
                                                    <span className="progress-percentage">
                                                        {Math.round(progress.progress_percentage)}%
                                                    </span>
                                                </div>
                                                <ProgressBar 
                                                    now={progress.progress_percentage} 
                                                    variant={progress.is_completed ? 'success' : 'primary'}
                                                    className="lesson-progress-bar"
                                                />
                                                <div className="exercise-count">
                                                    <small className="text-muted">
                                                        {progress.exercises_completed}/{progress.total_exercises} exercises
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No lessons started yet. Begin your learning journey!</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Badges and Achievements */}
                <Col lg={4} className="mb-4">
                    <Card className="badges-card">
                        <Card.Header>
                            <h5 className="mb-0">Achievements</h5>
                        </Card.Header>
                        <Card.Body>
                            {userBadges.length > 0 ? (
                                <div className="badges-grid">
                                    {userBadges.map((userBadge) => (
                                        <div key={userBadge.id} className="badge-item">
                                            <div className="badge-icon">
                                                <i className={userBadge.badge?.icon || 'fas fa-award'}></i>
                                            </div>
                                            <div className="badge-info">
                                                <h6 className="badge-name">
                                                    {userBadge.badge?.name || 'Achievement'}
                                                </h6>
                                                <p className="badge-description">
                                                    {userBadge.badge?.description || 'Well done!'}
                                                </p>
                                                <small className="badge-date">
                                                    Earned: {new Date(userBadge.earned_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No badges earned yet. Keep learning to unlock achievements!</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Current Level and Next Goal */}
            {userStats && (
                <Row>
                    <Col>
                        <Card className="level-card">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <div className="current-level">
                                            <h5>Current Level</h5>
                                            <div className="level-display">
                                                <span className="level-number">{userStats.current_level || 1}</span>
                                                <div className="level-info">
                                                    <p className="level-name">Level {userStats.current_level || 1}</p>
                                                    <p className="level-points">{userStats.total_points || 0} points</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="next-level">
                                            <h5>Next Level Progress</h5>
                                            <div className="level-progress">
                                                <div className="progress-info">
                                                    <span>Level {(userStats.current_level || 1) + 1}</span>
                                                    <span>{userStats.points_to_next_level || 100} points to go</span>
                                                </div>
                                                <ProgressBar 
                                                    now={userStats.level_progress || 0} 
                                                    variant="warning"
                                                    className="level-progress-bar"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default UserProgress;