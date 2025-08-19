import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import lessonService from '../services/lessonService';
import './LearningDashboard.css';

const LearningDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboard, stats] = await Promise.all([
                lessonService.getDashboard(),
                lessonService.getUserStats()
            ]);
            setDashboardData(dashboard);
            setUserStats(stats);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartLesson = async (lessonId) => {
        try {
            await lessonService.startLesson(lessonId);
            navigate(`/lesson/${lessonId}`);
        } catch (err) {
            console.error('Failed to start lesson:', err);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'danger';
            default: return 'secondary';
        }
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    {error}
                    <Button variant="outline-danger" className="ms-2" onClick={loadDashboardData}>
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="learning-dashboard mt-4">
            {/* User Stats Overview */}
            {userStats && (
                <Row className="mb-4">
                    <Col>
                        <Card className="stats-card">
                            <Card.Body>
                                <Row>
                                    <Col md={3} className="text-center">
                                        <div className="stat-item">
                                            <h3 className="stat-number text-primary">{userStats.total_lessons}</h3>
                                            <p className="stat-label">Lessons Completed</p>
                                        </div>
                                    </Col>
                                    <Col md={3} className="text-center">
                                        <div className="stat-item">
                                            <h3 className="stat-number text-success">{userStats.total_points}</h3>
                                            <p className="stat-label">Total Points</p>
                                        </div>
                                    </Col>
                                    <Col md={3} className="text-center">
                                        <div className="stat-item">
                                            <h3 className="stat-number text-warning">{userStats.total_badges}</h3>
                                            <p className="stat-label">Badges Earned</p>
                                        </div>
                                    </Col>
                                    <Col md={3} className="text-center">
                                        <div className="stat-item">
                                            <h3 className="stat-number text-info">{userStats.current_streak}</h3>
                                            <p className="stat-label">Day Streak</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row>
                {/* Recent Progress */}
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Continue Learning</h5>
                        </Card.Header>
                        <Card.Body>
                            {dashboardData?.recent_progress?.length > 0 ? (
                                <Row>
                                    {dashboardData.recent_progress.map((progress) => (
                                        <Col md={6} key={progress.id} className="mb-3">
                                            <Card className="lesson-progress-card h-100">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="lesson-title">{progress.lesson.title}</h6>
                                                        <Badge bg={getDifficultyColor(progress.lesson.skill_level?.name)}>
                                                            {progress.lesson.skill_level?.name}
                                                        </Badge>
                                                    </div>
                                                    <p className="lesson-description text-muted small">
                                                        {progress.lesson.description}
                                                    </p>
                                                    <div className="mb-2">
                                                        <div className="d-flex justify-content-between small text-muted">
                                                            <span>Progress</span>
                                                            <span>{Math.round(progress.progress_percentage)}%</span>
                                                        </div>
                                                        <ProgressBar 
                                                            now={progress.progress_percentage} 
                                                            variant="primary"
                                                            className="mb-2"
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">
                                                            {formatDuration(progress.lesson.duration)} • {progress.lesson.points} pts
                                                        </small>
                                                        <Button 
                                                            size="sm" 
                                                            variant="primary"
                                                            onClick={() => handleStartLesson(progress.lesson.id)}
                                                        >
                                                            Continue
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No lessons in progress. Start a new lesson below!</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Recommended Lessons */}
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Recommended for You</h5>
                        </Card.Header>
                        <Card.Body>
                            {dashboardData?.recommended_lessons?.length > 0 ? (
                                <Row>
                                    {dashboardData.recommended_lessons.map((lesson) => (
                                        <Col md={6} key={lesson.id} className="mb-3">
                                            <Card className="lesson-card h-100">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="lesson-title">{lesson.title}</h6>
                                                        <Badge bg={getDifficultyColor(lesson.skill_level?.name)}>
                                                            {lesson.skill_level?.name}
                                                        </Badge>
                                                    </div>
                                                    <p className="lesson-description text-muted small">
                                                        {lesson.description}
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">
                                                            {formatDuration(lesson.duration)} • {lesson.points} pts
                                                        </small>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline-primary"
                                                            onClick={() => handleStartLesson(lesson.id)}
                                                        >
                                                            Start
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No recommendations available at the moment.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col lg={4}>
                    {/* Recent Badges */}
                    {dashboardData?.recent_badges?.length > 0 && (
                        <Card className="mb-4">
                            <Card.Header>
                                <h6 className="mb-0">Recent Achievements</h6>
                            </Card.Header>
                            <Card.Body>
                                {dashboardData.recent_badges.map((userBadge) => (
                                    <div key={userBadge.id} className="badge-item d-flex align-items-center mb-2">
                                        <div className="badge-icon me-2">
                                            🏆
                                        </div>
                                        <div>
                                            <div className="badge-name fw-bold">{userBadge.badge.name}</div>
                                            <small className="text-muted">{userBadge.badge.description}</small>
                                        </div>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    )}

                    {/* Leaderboard Position */}
                    {dashboardData?.leaderboard_position && (
                        <Card className="mb-4">
                            <Card.Header>
                                <h6 className="mb-0">Your Ranking</h6>
                            </Card.Header>
                            <Card.Body className="text-center">
                                <div className="ranking-display">
                                    <h2 className="ranking-number text-primary">#{dashboardData.leaderboard_position}</h2>
                                    <p className="text-muted">Global Ranking</p>
                                </div>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card>
                        <Card.Header>
                            <h6 className="mb-0">Quick Actions</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={() => navigate('/lessons')}>
                                    Browse All Lessons
                                </Button>
                                <Button variant="outline-secondary" onClick={() => navigate('/progress')}>
                                    View Progress
                                </Button>
                                <Button variant="outline-info" onClick={() => navigate('/achievements')}>
                                    My Achievements
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LearningDashboard;