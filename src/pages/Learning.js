import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Learning.css';

const lessons = [
  {
    id: 1,
    title: 'Vocabulary Builder',
    description: 'Expand your English vocabulary with interactive exercises.',
    icon: 'bi-book',
    color: 'primary',
    progress: 0,
    totalExercises: 20,
    completedExercises: 0,
    difficulty: 'Beginner',
    estimatedTime: '30 mins',
    topics: ['Common Words', 'Phrases', 'Idioms']
  },
  {
    id: 2,
    title: 'Grammar Practice',
    description: 'Master English grammar with fun, practical lessons.',
    icon: 'bi-pencil-square',
    color: 'success',
    progress: 0,
    totalExercises: 25,
    completedExercises: 0,
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    topics: ['Tenses', 'Parts of Speech', 'Sentence Structure']
  },
  {
    id: 3,
    title: 'Listening Skills',
    description: 'Improve your listening with real-world audio and quizzes.',
    icon: 'bi-headphones',
    color: 'warning',
    progress: 0,
    totalExercises: 15,
    completedExercises: 0,
    difficulty: 'Advanced',
    estimatedTime: '40 mins',
    topics: ['Conversations', 'Accents', 'Comprehension']
  },
  {
    id: 4,
    title: 'Speaking Practice',
    description: 'Practice speaking and get instant feedback.',
    icon: 'bi-mic',
    color: 'info',
    progress: 0,
    totalExercises: 18,
    completedExercises: 0,
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    topics: ['Pronunciation', 'Fluency', 'Confidence']
  },
];

const Learning = () => {
  const navigate = useNavigate();
  const [lessonsState, setLessonsState] = useState(lessons);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Simulate loading progress from backend
  useEffect(() => {
    const loadProgress = async () => {
      // In a real app, this would be an API call
      const updatedLessons = lessonsState.map(lesson => ({
        ...lesson,
        completedExercises: Math.floor(Math.random() * lesson.totalExercises),
        progress: Math.floor((Math.random() * lesson.totalExercises) / lesson.totalExercises * 100)
      }));
      setLessonsState(updatedLessons);
    };
    loadProgress();
  }, []);

  const handleStartLesson = (lessonId) => {
    navigate(`/learning/${lessonId}`);
  };

  const handleCardHover = (lessonId) => {
    setHoveredCard(lessonId);
  };

  return (
    <div className="learning-page py-5">
      <Container>
        <section className="text-center mb-5">
          <h2 className="fw-bold mb-3 text-primary">Start Learning</h2>
          <p className="lead text-muted mb-4">
            Choose a lesson below to practice and improve your English skills. Track your progress and earn achievements!
          </p>
        </section>
        <Row className="g-4 mb-5">
          {lessonsState.map((lesson) => (
            <Col md={6} lg={3} key={lesson.id}>
              <Card 
                id={`lesson-${lesson.id}`}
                className={`h-100 shadow-sm border-0 text-center learning-card ${hoveredCard === lesson.id ? 'hovered' : ''}`}
                onMouseEnter={() => handleCardHover(lesson.id)}
                onMouseLeave={() => handleCardHover(null)}
              >
                <Card.Body>
                  <div className={`icon-circle bg-${lesson.color} text-white mx-auto mb-3`}>
                    <i className={`bi ${lesson.icon} fs-2`}></i>
                  </div>
                  <Card.Title className="mb-2 fw-semibold">{lesson.title}</Card.Title>
                  <Card.Text className="mb-3">{lesson.description}</Card.Text>
                  
                  <div className="lesson-details mb-3">
                    <Badge bg="secondary" className="me-2">{lesson.difficulty}</Badge>
                    <Badge bg="light" text="dark" className="me-2">
                      <i className="bi bi-clock me-1"></i>
                      {lesson.estimatedTime}
                    </Badge>
                  </div>

                  <div className="progress-section mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Progress</small>
                      <small>{lesson.progress}%</small>
                    </div>
                    <ProgressBar 
                      now={lesson.progress} 
                      variant={lesson.color}
                      className="progress-sm"
                    />
                    <small className="text-muted">
                      {lesson.completedExercises} of {lesson.totalExercises} exercises completed
                    </small>
                  </div>

                  <div className="topics-section mb-3">
                    {lesson.topics.map((topic, idx) => (
                      <Badge 
                        key={idx} 
                        bg="light" 
                        text="dark" 
                        className="me-1 mb-1"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={() => handleStartLesson(lesson.id)}
                  >
                    {lesson.progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <h4 className="fw-bold text-success mb-2">
            <i className="bi bi-stars me-2"></i>
            "Practice a little every day, and you'll be amazed at your progress!"
          </h4>
        </div>
      </Container>
    </div>
  );
};

export default Learning; 