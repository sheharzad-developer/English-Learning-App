import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge, Alert, Spinner } from 'react-bootstrap';
import QuizComponent from './QuizComponent';
import MatchingExercise from './MatchingExercise';
import ImprovedMatchingExercise from './ImprovedMatchingExercise';
import FillInBlankExercise from './FillInBlankExercise';
import './InteractiveExerciseDemo.css';

const InteractiveExerciseDemo = () => {
  const [activeTab, setActiveTab] = useState('quiz');
  const [completedExercises, setCompletedExercises] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data for demonstrations
  const quizData = {
    title: "English Grammar Quiz",
    description: "Test your knowledge of English grammar rules",
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: "Which sentence is grammatically correct?",
        options: [
          "She don't like coffee",
          "She doesn't like coffee",
          "She not like coffee",
          "She no like coffee"
        ],
        correctAnswer: 1,
        explanation: "The correct form uses 'doesn't' (does not) with third person singular subjects.",
        points: 10
      },
      {
        id: 2,
        type: 'multiple_select',
        question: "Which of the following are irregular verbs? (Select all that apply)",
        options: [
          "run",
          "walk",
          "eat",
          "talk",
          "go",
          "play"
        ],
        correctAnswers: [0, 2, 4], // run, eat, go
        explanation: "Irregular verbs don't follow the standard -ed pattern for past tense.",
        points: 15
      },
      {
        id: 3,
        type: 'true_false',
        question: "The past tense of 'buy' is 'buyed'.",
        correctAnswer: false,
        explanation: "The past tense of 'buy' is 'bought', not 'buyed'.",
        points: 5
      },
      {
        id: 4,
        type: 'fill_blank',
        question: "Complete the sentence: I _____ to the store yesterday.",
        correctAnswer: "went",
        placeholder: "verb",
        explanation: "The past tense of 'go' is 'went'.",
        points: 10
      },
      {
        id: 5,
        type: 'short_answer',
        question: "What is the plural form of 'child'?",
        correctAnswer: "children",
        explanation: "'Child' has an irregular plural form: 'children'.",
        points: 8
      }
    ]
  };

  const matchingData = {
    title: "Match Vocabulary Words",
    instructions: "Drag the words from the left to match with their definitions on the right",
    leftItems: [
      "Eloquent",
      "Meticulous",
      "Ubiquitous",
      "Ephemeral",
      "Serendipity"
    ],
    rightItems: [
      "Present everywhere",
      "Lasting for a very short time",
      "Showing great care and attention to detail",
      "Fluent and persuasive in speaking",
      "A pleasant surprise or fortunate accident"
    ],
    correctMatches: {
      0: 3, // Eloquent -> Fluent and persuasive
      1: 2, // Meticulous -> Great care and attention
      2: 0, // Ubiquitous -> Present everywhere
      3: 1, // Ephemeral -> Lasting for a short time
      4: 4  // Serendipity -> Pleasant surprise
    },
    timeLimit: 180 // 3 minutes
  };

  const fillBlankData = {
    title: "Complete the Story",
    instructions: "Fill in the blanks to complete this short story",
    text: "Yesterday, I __1__ to the library to __2__ some books. The librarian was very __3__ and helped me find exactly what I was __4__ for. I spent the entire __5__ reading and taking notes. It was a very __6__ day.",
    blanks: [
      {
        id: '1',
        position: 0,
        correctAnswer: ['went', 'walked', 'traveled'],
        placeholder: 'verb',
        width: 80,
        explanation: 'Past tense verb indicating movement to a place'
      },
      {
        id: '2',
        position: 1,
        correctAnswer: ['borrow', 'get', 'find'],
        placeholder: 'verb',
        width: 80,
        explanation: 'Verb meaning to take temporarily'
      },
      {
        id: '3',
        position: 2,
        correctAnswer: ['helpful', 'kind', 'friendly'],
        placeholder: 'adjective',
        width: 90,
        explanation: 'Positive adjective describing someone who assists others'
      },
      {
        id: '4',
        position: 3,
        correctAnswer: ['looking', 'searching'],
        placeholder: 'verb',
        width: 90,
        explanation: 'Verb meaning to seek or try to find'
      },
      {
        id: '5',
        position: 4,
        correctAnswer: ['afternoon', 'day', 'morning'],
        placeholder: 'time',
        width: 100,
        explanation: 'Period of time'
      },
      {
        id: '6',
        position: 5,
        correctAnswer: ['productive', 'good', 'successful'],
        placeholder: 'adjective',
        width: 100,
        explanation: 'Positive adjective describing the quality of the day'
      }
    ],
    hints: {
      '1': 'Think about how you move from one place to another',
      '2': 'What do you do with library books?',
      '3': 'How would you describe someone who assists you?',
      '4': 'What were you doing when trying to find books?',
      '5': 'What part of the day comes after morning?',
      '6': 'How would you describe a day when you accomplished a lot?'
    },
    showWordBank: true,
    wordBank: ['went', 'borrow', 'helpful', 'looking', 'afternoon', 'productive'],
    timeLimit: 240 // 4 minutes
  };

  const handleExerciseComplete = (exerciseType, results) => {
    try {
      setLoading(true);
      setError(null);
      
      setCompletedExercises(prev => ({
        ...prev,
        [exerciseType]: true
      }));
      
      setExerciseResults(prev => ({
        ...prev,
        [exerciseType]: results
      }));
      
      // Simulate API call to save results
      setTimeout(() => {
        setLoading(false);
        console.log(`${exerciseType} completed with score: ${results.score}%`);
      }, 1000);
      
    } catch (err) {
      setError(`Failed to save ${exerciseType} results. Your progress has been saved locally.`);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const calculateOverallProgress = () => {
    const totalExercises = 3;
    const completedCount = Object.keys(completedExercises).length;
    return Math.round((completedCount / totalExercises) * 100);
  };

  const calculateAverageScore = () => {
    const scores = Object.values(exerciseResults).map(result => result.score || 0);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const renderOverview = () => {
    const overallProgress = calculateOverallProgress();
    const averageScore = calculateAverageScore();
    
    return (
      <div className="overview-section">
        <Row className="mb-4">
          <Col md={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stat-icon mb-3">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4>Overall Progress</h4>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                <p className="mb-0">{Object.keys(completedExercises).length} of 3 exercises completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stat-icon mb-3">
                  <i className="fas fa-trophy"></i>
                </div>
                <h4>Average Score</h4>
                <Badge 
                  bg={getScoreColor(averageScore)} 
                  className="score-badge"
                >
                  {averageScore}%
                </Badge>
                <p className="mt-2 mb-0">
                  {averageScore >= 90 ? 'Excellent!' : 
                   averageScore >= 70 ? 'Good work!' : 
                   averageScore > 0 ? 'Keep practicing!' : 'Start your first exercise!'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Card className="exercise-list-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-list-check me-2"></i>
                  Exercise Progress
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="exercise-items">
                  <div className="exercise-item">
                    <div className="exercise-info">
                      <div className="exercise-icon">
                        <i className="fas fa-question-circle"></i>
                      </div>
                      <div>
                        <h6>Interactive Quiz</h6>
                        <p className="text-muted mb-0">Multiple choice, true/false, and fill-in-the-blank questions</p>
                      </div>
                    </div>
                    <div className="exercise-status">
                      {completedExercises.quiz ? (
                        <>
                          <Badge bg={getScoreColor(exerciseResults.quiz?.score || 0)} className="me-2">
                            {exerciseResults.quiz?.score || 0}%
                          </Badge>
                          <i className="fas fa-check-circle text-success"></i>
                        </>
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setActiveTab('quiz')}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="exercise-item">
                    <div className="exercise-info">
                      <div className="exercise-icon">
                        <i className="fas fa-arrows-alt"></i>
                      </div>
                      <div>
                        <h6>Matching Exercise</h6>
                        <p className="text-muted mb-0">Drag and drop vocabulary words to their definitions</p>
                      </div>
                    </div>
                    <div className="exercise-status">
                      {completedExercises.matching ? (
                        <>
                          <Badge bg={getScoreColor(exerciseResults.matching?.score || 0)} className="me-2">
                            {exerciseResults.matching?.score || 0}%
                          </Badge>
                          <i className="fas fa-check-circle text-success"></i>
                        </>
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setActiveTab('matching')}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="exercise-item">
                    <div className="exercise-info">
                      <div className="exercise-icon">
                        <i className="fas fa-edit"></i>
                      </div>
                      <div>
                        <h6>Fill in the Blanks</h6>
                        <p className="text-muted mb-0">Complete the story by filling in missing words</p>
                      </div>
                    </div>
                    <div className="exercise-status">
                      {completedExercises.fillBlank ? (
                        <>
                          <Badge bg={getScoreColor(exerciseResults.fillBlank?.score || 0)} className="me-2">
                            {exerciseResults.fillBlank?.score || 0}%
                          </Badge>
                          <i className="fas fa-check-circle text-success"></i>
                        </>
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setActiveTab('fillBlank')}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {Object.keys(completedExercises).length === 3 && (
          <Row className="mt-4">
            <Col>
              <Alert variant="success" className="completion-alert">
                <div className="d-flex align-items-center">
                  <i className="fas fa-trophy me-3" style={{ fontSize: '2rem' }}></i>
                  <div>
                    <h5 className="mb-1">Congratulations!</h5>
                    <p className="mb-0">
                      You've completed all interactive exercises with an average score of {averageScore}%!
                    </p>
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'quiz':
        return (
          <QuizComponent
            {...quizData}
            onComplete={(results) => handleExerciseComplete('quiz', results)}
          />
        );
      case 'matching':
        return (
          <ImprovedMatchingExercise
            {...matchingData}
            onComplete={(results) => handleExerciseComplete('matching', results)}
          />
        );
      case 'fillBlank':
        return (
          <FillInBlankExercise
            {...fillBlankData}
            onComplete={(results) => handleExerciseComplete('fillBlank', results)}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="interactive-exercise-demo">
      <Container fluid>
        <div className="demo-header text-center mb-4">
          <h2 className="demo-title">
            <i className="fas fa-gamepad me-3"></i>
            Interactive Exercise Components
          </h2>
          <p className="demo-description">
            Explore our comprehensive suite of interactive learning exercises
          </p>
          
          {error && (
            <Alert variant="warning" className="mt-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}
          
          {loading && (
            <Alert variant="info" className="mt-3">
              <Spinner animation="border" size="sm" className="me-2" />
              Saving your progress...
            </Alert>
          )}
        </div>
        
        {/* Navigation Tabs */}
        <Nav variant="pills" className="demo-nav justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              className="nav-pill"
            >
              <i className="fas fa-chart-pie me-2"></i>
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'quiz'}
              onClick={() => setActiveTab('quiz')}
              className="nav-pill"
            >
              <i className="fas fa-question-circle me-2"></i>
              Quiz
              {completedExercises.quiz && (
                <Badge bg="success" className="ms-2">✓</Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'matching'}
              onClick={() => setActiveTab('matching')}
              className="nav-pill"
            >
              <i className="fas fa-arrows-alt me-2"></i>
              Matching
              {completedExercises.matching && (
                <Badge bg="success" className="ms-2">✓</Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'fillBlank'}
              onClick={() => setActiveTab('fillBlank')}
              className="nav-pill"
            >
              <i className="fas fa-edit me-2"></i>
              Fill Blanks
              {completedExercises.fillBlank && (
                <Badge bg="success" className="ms-2">✓</Badge>
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        {/* Tab Content */}
        <div className="demo-content">
          {renderTabContent()}
        </div>
      </Container>
    </div>
  );
};

export default InteractiveExerciseDemo;