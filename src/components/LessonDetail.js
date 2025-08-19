import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import lessonService from '../services/lessonService';
import ExerciseComponent from './ExerciseComponent';
import './LessonDetail.css';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [lessonStarted, setLessonStarted] = useState(false);
    const [completedExercises, setCompletedExercises] = useState(new Set());
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        loadLessonData();
    }, [id]);

    const loadLessonData = async () => {
        try {
            setLoading(true);
            const [lessonData, exercisesData] = await Promise.all([
                lessonService.getLesson(id),
                lessonService.getExercises({ lesson: id })
            ]);
            
            setLesson(lessonData);
            setExercises(exercisesData.results || exercisesData);
            
            // Load user progress for this lesson
            try {
                const progressData = await lessonService.getUserProgress({ lesson: id });
                if (progressData.results && progressData.results.length > 0) {
                    setUserProgress(progressData.results[0]);
                    setLessonStarted(progressData.results[0].is_completed || progressData.results[0].progress_percentage > 0);
                }
            } catch (progressError) {
                console.log('No existing progress found');
            }
        } catch (err) {
            setError('Failed to load lesson data');
            console.error('Lesson loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartLesson = async () => {
        try {
            await lessonService.startLesson(id);
            setLessonStarted(true);
            await loadLessonData(); // Reload to get updated progress
        } catch (err) {
            console.error('Failed to start lesson:', err);
        }
    };

    const handleExerciseComplete = (exerciseId, score, isCorrect) => {
        setCompletedExercises(prev => new Set([...prev, exerciseId]));
        setTotalScore(prev => prev + (score || 0));
        
        // Move to next exercise or complete lesson
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            handleLessonComplete();
        }
    };

    const handleLessonComplete = async () => {
        try {
            const finalScore = Math.round((completedExercises.size / exercises.length) * 100);
            await lessonService.completeLesson(id, finalScore);
            setShowCompletionModal(true);
        } catch (err) {
            console.error('Failed to complete lesson:', err);
        }
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        }
    };

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
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
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getProgressPercentage = () => {
        if (exercises.length === 0) return 0;
        return Math.round((completedExercises.size / exercises.length) * 100);
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
                    <Button variant="outline-danger" className="ms-2" onClick={loadLessonData}>
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!lesson) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">Lesson not found</Alert>
            </Container>
        );
    }

    const currentExercise = exercises[currentExerciseIndex];

    return (
        <Container className="lesson-detail mt-4">
            {/* Lesson Header */}
            <Row className="mb-4">
                <Col>
                    <Card className="lesson-header-card">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <div className="d-flex align-items-center mb-2">
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm" 
                                            className="me-3"
                                            onClick={() => navigate('/learning')}
                                        >
                                            ← Back
                                        </Button>
                                        <Badge bg={getDifficultyColor(lesson.skill_level?.name)} className="me-2">
                                            {lesson.skill_level?.name}
                                        </Badge>
                                        <Badge bg="info">{lesson.category?.name}</Badge>
                                    </div>
                                    <h2 className="lesson-title">{lesson.title}</h2>
                                    <p className="lesson-description text-muted">{lesson.description}</p>
                                    <div className="lesson-meta">
                                        <span className="me-3">📚 {exercises.length} exercises</span>
                                        <span className="me-3">⏱️ {formatDuration(lesson.duration)}</span>
                                        <span className="me-3">🏆 {lesson.points} points</span>
                                    </div>
                                </Col>
                                <Col md={4} className="text-end">
                                    {!lessonStarted ? (
                                        <Button 
                                            variant="primary" 
                                            size="lg"
                                            onClick={handleStartLesson}
                                        >
                                            Start Lesson
                                        </Button>
                                    ) : (
                                        <div className="progress-info">
                                            <h4 className="text-primary">{getProgressPercentage()}%</h4>
                                            <p className="text-muted mb-2">Complete</p>
                                            <ProgressBar 
                                                now={getProgressPercentage()} 
                                                variant="primary"
                                                className="mb-2"
                                            />
                                            <small className="text-muted">
                                                {completedExercises.size} of {exercises.length} exercises
                                            </small>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Lesson Content */}
            {lessonStarted && exercises.length > 0 && (
                <Row>
                    <Col lg={8}>
                        {/* Current Exercise */}
                        <Card className="exercise-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    Exercise {currentExerciseIndex + 1} of {exercises.length}
                                </h5>
                                <Badge bg="secondary">{currentExercise?.type}</Badge>
                            </Card.Header>
                            <Card.Body>
                                {currentExercise && (
                                    <ExerciseComponent
                                        exercise={currentExercise}
                                        onComplete={handleExerciseComplete}
                                        isCompleted={completedExercises.has(currentExercise.id)}
                                    />
                                )}
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between">
                                <Button 
                                    variant="outline-secondary"
                                    onClick={handlePreviousExercise}
                                    disabled={currentExerciseIndex === 0}
                                >
                                    Previous
                                </Button>
                                <Button 
                                    variant="outline-primary"
                                    onClick={handleNextExercise}
                                    disabled={currentExerciseIndex === exercises.length - 1}
                                >
                                    Next
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Exercise Navigation */}
                        <Card className="exercise-nav-card">
                            <Card.Header>
                                <h6 className="mb-0">Exercise Overview</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="exercise-list">
                                    {exercises.map((exercise, index) => (
                                        <div 
                                            key={exercise.id}
                                            className={`exercise-item ${
                                                index === currentExerciseIndex ? 'active' : ''
                                            } ${
                                                completedExercises.has(exercise.id) ? 'completed' : ''
                                            }`}
                                            onClick={() => setCurrentExerciseIndex(index)}
                                        >
                                            <div className="exercise-number">
                                                {completedExercises.has(exercise.id) ? '✓' : index + 1}
                                            </div>
                                            <div className="exercise-info">
                                                <div className="exercise-title">{exercise.title}</div>
                                                <small className="exercise-type text-muted">{exercise.type}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Lesson Info */}
                        <Card className="mt-3">
                            <Card.Header>
                                <h6 className="mb-0">Lesson Information</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="info-item">
                                    <strong>Category:</strong> {lesson.category?.name}
                                </div>
                                <div className="info-item">
                                    <strong>Skill Level:</strong> {lesson.skill_level?.name}
                                </div>
                                <div className="info-item">
                                    <strong>Duration:</strong> {formatDuration(lesson.duration)}
                                </div>
                                <div className="info-item">
                                    <strong>Points:</strong> {lesson.points}
                                </div>
                                {lesson.prerequisites?.length > 0 && (
                                    <div className="info-item">
                                        <strong>Prerequisites:</strong>
                                        <ul className="mt-1">
                                            {lesson.prerequisites.map(prereq => (
                                                <li key={prereq.id}>{prereq.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Completion Modal */}
            <Modal show={showCompletionModal} onHide={() => setShowCompletionModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>🎉 Lesson Completed!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h4>Congratulations!</h4>
                    <p>You've successfully completed <strong>{lesson.title}</strong></p>
                    <div className="completion-stats">
                        <div className="stat-item">
                            <h3 className="text-primary">{getProgressPercentage()}%</h3>
                            <p>Completion Rate</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="text-success">{lesson.points}</h3>
                            <p>Points Earned</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="primary" onClick={() => navigate('/learning')}>
                        Continue Learning
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setShowCompletionModal(false)}>
                        Review Lesson
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default LessonDetail;