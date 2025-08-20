import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, ProgressBar, Badge, Row, Col, Modal, Form, ButtonGroup } from 'react-bootstrap';

const InteractiveFlashcards = () => {
  const [currentSet, setCurrentSet] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState('study'); // study, quiz, review
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3); // seconds
  const [shuffleCards, setShuffleCards] = useState(false);
  const [cardOrder, setCardOrder] = useState([]);

  const flashcardSets = [
    {
      id: 1,
      title: 'Essential Business Vocabulary',
      category: 'Business',
      difficulty: 'intermediate',
      description: 'Key vocabulary for professional communication',
      cards: [
        {
          id: 1,
          front: 'Stakeholder',
          back: 'A person or group with an interest in the success of an organization',
          example: 'Investors are important stakeholders in the company.',
          audio: 'stakeholder.mp3',
          image: 'business-meeting.jpg'
        },
        {
          id: 2,
          front: 'Revenue',
          back: 'Income generated from normal business operations',
          example: 'The company\'s revenue increased by 15% this quarter.',
          audio: 'revenue.mp3',
          image: 'chart-growth.jpg'
        },
        {
          id: 3,
          front: 'Leverage',
          back: 'To use something to maximum advantage',
          example: 'We need to leverage our expertise to win this contract.',
          audio: 'leverage.mp3',
          image: 'advantage.jpg'
        },
        {
          id: 4,
          front: 'Benchmark',
          back: 'A standard point of reference for evaluation',
          example: 'We use industry standards as our benchmark for performance.',
          audio: 'benchmark.mp3',
          image: 'standards.jpg'
        },
        {
          id: 5,
          front: 'Synergy',
          back: 'Combined effect greater than the sum of individual parts',
          example: 'The merger created synergy between the two companies.',
          audio: 'synergy.mp3',
          image: 'teamwork.jpg'
        }
      ]
    },
    {
      id: 2,
      title: 'Academic Writing Phrases',
      category: 'Academic',
      difficulty: 'advanced',
      description: 'Useful phrases for academic writing and research',
      cards: [
        {
          id: 1,
          front: 'Furthermore',
          back: 'In addition to what has been said',
          example: 'The results were significant. Furthermore, they support our hypothesis.',
          audio: 'furthermore.mp3',
          image: 'academic-writing.jpg'
        },
        {
          id: 2,
          front: 'Nevertheless',
          back: 'Despite what has just been said',
          example: 'The experiment had limitations. Nevertheless, the findings are valuable.',
          audio: 'nevertheless.mp3',
          image: 'contrast.jpg'
        },
        {
          id: 3,
          front: 'Consequently',
          back: 'As a result',
          example: 'The data was incomplete. Consequently, we need more research.',
          audio: 'consequently.mp3',
          image: 'cause-effect.jpg'
        },
        {
          id: 4,
          front: 'Hypothesis',
          back: 'A proposed explanation for a phenomenon',
          example: 'Our hypothesis suggests that temperature affects the reaction rate.',
          audio: 'hypothesis.mp3',
          image: 'science-lab.jpg'
        },
        {
          id: 5,
          front: 'Empirical',
          back: 'Based on observation or experience rather than theory',
          example: 'The study provides empirical evidence for the theory.',
          audio: 'empirical.mp3',
          image: 'data-analysis.jpg'
        }
      ]
    },
    {
      id: 3,
      title: 'Daily Conversation Starters',
      category: 'Conversation',
      difficulty: 'beginner',
      description: 'Common phrases for everyday conversations',
      cards: [
        {
          id: 1,
          front: 'How\'s it going?',
          back: 'Casual way to ask how someone is doing',
          example: 'A: How\'s it going? B: Pretty good, thanks!',
          audio: 'hows-it-going.mp3',
          image: 'greeting.jpg'
        },
        {
          id: 2,
          front: 'What\'s up?',
          back: 'Informal greeting asking what someone is doing',
          example: 'A: What\'s up? B: Just working on my project.',
          audio: 'whats-up.mp3',
          image: 'casual-chat.jpg'
        },
        {
          id: 3,
          front: 'Catch up',
          back: 'To talk with someone you haven\'t seen recently',
          example: 'Let\'s grab coffee and catch up sometime.',
          audio: 'catch-up.mp3',
          image: 'friends-talking.jpg'
        },
        {
          id: 4,
          front: 'By the way',
          back: 'Used to introduce a new topic in conversation',
          example: 'By the way, did you hear about the new restaurant?',
          audio: 'by-the-way.mp3',
          image: 'conversation.jpg'
        },
        {
          id: 5,
          front: 'No worries',
          back: 'Don\'t worry about it; it\'s not a problem',
          example: 'A: Sorry I\'m late. B: No worries, I just got here too.',
          audio: 'no-worries.mp3',
          image: 'reassurance.jpg'
        }
      ]
    },
    {
      id: 4,
      title: 'Phrasal Verbs - Communication',
      category: 'Grammar',
      difficulty: 'intermediate',
      description: 'Common phrasal verbs used in communication',
      cards: [
        {
          id: 1,
          front: 'Bring up',
          back: 'To mention or introduce a topic',
          example: 'Don\'t bring up politics at dinner.',
          audio: 'bring-up.mp3',
          image: 'discussion.jpg'
        },
        {
          id: 2,
          front: 'Point out',
          back: 'To draw attention to something',
          example: 'She pointed out several errors in the report.',
          audio: 'point-out.mp3',
          image: 'attention.jpg'
        },
        {
          id: 3,
          front: 'Get across',
          back: 'To successfully communicate an idea',
          example: 'I\'m having trouble getting my point across.',
          audio: 'get-across.mp3',
          image: 'communication.jpg'
        },
        {
          id: 4,
          front: 'Speak up',
          back: 'To talk louder or express your opinion',
          example: 'You need to speak up during the meeting.',
          audio: 'speak-up.mp3',
          image: 'speaking.jpg'
        },
        {
          id: 5,
          front: 'Talk over',
          back: 'To discuss something thoroughly',
          example: 'Let\'s talk over the proposal before deciding.',
          audio: 'talk-over.mp3',
          image: 'discussion-table.jpg'
        }
      ]
    }
  ];

  const currentCardSet = flashcardSets[currentSet];
  const currentCardData = currentCardSet.cards[cardOrder[currentCard] || currentCard];

  useEffect(() => {
    // Initialize card order
    if (shuffleCards) {
      const shuffled = [...Array(currentCardSet.cards.length).keys()].sort(() => Math.random() - 0.5);
      setCardOrder(shuffled);
    } else {
      setCardOrder([...Array(currentCardSet.cards.length).keys()]);
    }
    setCurrentCard(0);
    setShowAnswer(false);
  }, [currentSet, shuffleCards]);

  useEffect(() => {
    // Auto-play functionality
    if (autoPlay && studyMode === 'study') {
      const timer = setTimeout(() => {
        if (!showAnswer) {
          setShowAnswer(true);
        } else {
          nextCard();
        }
      }, playbackSpeed * 1000);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, showAnswer, currentCard, playbackSpeed, studyMode]);

  const nextCard = () => {
    if (currentCard < currentCardSet.cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else if (studyMode === 'quiz') {
      showQuizResults();
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  const resetSet = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    
    if (shuffleCards) {
      const shuffled = [...Array(currentCardSet.cards.length).keys()].sort(() => Math.random() - 0.5);
      setCardOrder(shuffled);
    }
  };

  const switchMode = (mode) => {
    setStudyMode(mode);
    resetSet();
  };

  const handleQuizAnswer = (isCorrect) => {
    const cardId = currentCardData.id;
    setUserAnswers({
      ...userAnswers,
      [cardId]: isCorrect
    });
    nextCard();
  };

  const showQuizResults = () => {
    const correct = Object.values(userAnswers).filter(answer => answer).length;
    const total = currentCardSet.cards.length;
    setScore(Math.round((correct / total) * 100));
    setShowResults(true);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Business': return 'primary';
      case 'Academic': return 'info';
      case 'Conversation': return 'success';
      case 'Grammar': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="interactive-flashcards">
      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-cog me-2"></i>
            Flashcard Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Auto-play cards"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
              />
              <Form.Text className="text-muted">
                Automatically flip and advance cards
              </Form.Text>
            </Form.Group>

            {autoPlay && (
              <Form.Group className="mb-3">
                <Form.Label>Playback Speed: {playbackSpeed} seconds</Form.Label>
                <Form.Range
                  min={1}
                  max={10}
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Shuffle cards"
                checked={shuffleCards}
                onChange={(e) => setShuffleCards(e.target.checked)}
              />
              <Form.Text className="text-muted">
                Randomize the order of cards
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="flashcards-header-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h3>
                    <i className="fas fa-layer-group me-2 text-secondary"></i>
                    Interactive Flashcards
                  </h3>
                  <p className="text-muted mb-0">
                    Learn vocabulary and phrases with smart flashcards
                  </p>
                </Col>
                <Col md={6} className="text-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowSettings(true)}
                    className="me-2"
                  >
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Study Mode Selector */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Study Mode:</h6>
                </div>
                <ButtonGroup>
                  <Button
                    variant={studyMode === 'study' ? 'primary' : 'outline-primary'}
                    onClick={() => switchMode('study')}
                  >
                    <i className="fas fa-book me-2"></i>
                    Study
                  </Button>
                  <Button
                    variant={studyMode === 'quiz' ? 'primary' : 'outline-primary'}
                    onClick={() => switchMode('quiz')}
                  >
                    <i className="fas fa-question-circle me-2"></i>
                    Quiz
                  </Button>
                  <Button
                    variant={studyMode === 'review' ? 'primary' : 'outline-primary'}
                    onClick={() => switchMode('review')}
                  >
                    <i className="fas fa-eye me-2"></i>
                    Review
                  </Button>
                </ButtonGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Set Selector */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                {flashcardSets.map((set, index) => (
                  <Col md={3} key={set.id} className="mb-3">
                    <Card 
                      className={`set-card h-100 ${index === currentSet ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setCurrentSet(index);
                        resetSet();
                      }}
                    >
                      <Card.Body className="text-center">
                        <h6 className="set-title">{set.title}</h6>
                        <div className="set-badges mb-2">
                          <Badge bg={getCategoryColor(set.category)} className="me-1">
                            {set.category}
                          </Badge>
                          <Badge bg={getDifficultyColor(set.difficulty)}>
                            {set.difficulty}
                          </Badge>
                        </div>
                        <small className="text-muted">{set.description}</small>
                        <div className="mt-2">
                          <Badge bg="secondary">{set.cards.length} cards</Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>{currentCardSet.title}</span>
                <span>{currentCard + 1} of {currentCardSet.cards.length}</span>
              </div>
              <ProgressBar 
                now={((currentCard + 1) / currentCardSet.cards.length) * 100} 
                style={{ height: '10px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quiz Results */}
      {showResults && (
        <Row className="mb-4">
          <Col>
            <Alert variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}>
              <h5>
                <i className="fas fa-chart-bar me-2"></i>
                Quiz Complete! Your Score: {score}%
              </h5>
              <p className="mb-0">
                You got {Object.values(userAnswers).filter(answer => answer).length} out of {currentCardSet.cards.length} cards correct.
              </p>
              <div className="mt-3">
                <Button variant="primary" onClick={resetSet} className="me-2">
                  <i className="fas fa-redo me-2"></i>
                  Try Again
                </Button>
                <Button variant="outline-secondary" onClick={() => switchMode('review')}>
                  <i className="fas fa-eye me-2"></i>
                  Review Cards
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Main Flashcard */}
      {!showResults && (
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="flashcard-main">
              <Card.Body className="p-5">
                <div className="flashcard-content text-center">
                  {/* Card Side Indicator */}
                  <div className="card-side-indicator mb-3">
                    <Badge bg={showAnswer ? 'success' : 'primary'}>
                      {showAnswer ? 'Definition' : (studyMode === 'quiz' ? 'Question' : 'Term')}
                    </Badge>
                  </div>

                  {/* Main Content */}
                  <div className="card-main-content mb-4">
                    {studyMode === 'quiz' && !showAnswer ? (
                      <div>
                        <h3 className="card-text mb-4">{currentCardData.back}</h3>
                        <p className="text-muted">What term matches this definition?</p>
                      </div>
                    ) : (
                      <h3 className="card-text mb-4">
                        {showAnswer ? currentCardData.back : currentCardData.front}
                      </h3>
                    )}
                  </div>

                  {/* Example (shown with answer) */}
                  {showAnswer && currentCardData.example && (
                    <div className="card-example mb-4">
                      <h6 className="text-info">Example:</h6>
                      <p className="text-muted fst-italic">"{currentCardData.example}"</p>
                    </div>
                  )}

                  {/* Audio Button */}
                  <div className="card-audio mb-4">
                    <Button
                      variant="outline-info"
                      onClick={() => speakText(showAnswer ? currentCardData.back : currentCardData.front)}
                    >
                      <i className="fas fa-volume-up me-2"></i>
                      Listen
                    </Button>
                  </div>

                  {/* Controls */}
                  <div className="card-controls">
                    {studyMode === 'study' && (
                      <div className="study-controls">
                        <Button
                          variant="outline-secondary"
                          onClick={previousCard}
                          disabled={currentCard === 0}
                          className="me-2"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </Button>
                        
                        <Button
                          variant="primary"
                          onClick={flipCard}
                          className="me-2"
                        >
                          <i className="fas fa-sync-alt me-2"></i>
                          {showAnswer ? 'Show Term' : 'Show Definition'}
                        </Button>
                        
                        <Button
                          variant="outline-secondary"
                          onClick={nextCard}
                          disabled={currentCard === currentCardSet.cards.length - 1}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </Button>
                      </div>
                    )}

                    {studyMode === 'quiz' && !showAnswer && (
                      <div className="quiz-controls">
                        <h6 className="mb-3">Is the answer "{currentCardData.front}"?</h6>
                        <Button
                          variant="success"
                          onClick={() => handleQuizAnswer(true)}
                          className="me-3"
                          size="lg"
                        >
                          <i className="fas fa-check me-2"></i>
                          Correct
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleQuizAnswer(false)}
                          size="lg"
                        >
                          <i className="fas fa-times me-2"></i>
                          Incorrect
                        </Button>
                      </div>
                    )}

                    {studyMode === 'review' && (
                      <div className="review-controls">
                        <Button
                          variant="outline-secondary"
                          onClick={previousCard}
                          disabled={currentCard === 0}
                          className="me-2"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </Button>
                        
                        <Button
                          variant="info"
                          onClick={flipCard}
                          className="me-2"
                        >
                          <i className="fas fa-sync-alt me-2"></i>
                          Flip Card
                        </Button>
                        
                        <Button
                          variant="outline-secondary"
                          onClick={nextCard}
                          disabled={currentCard === currentCardSet.cards.length - 1}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Auto-play indicator */}
                  {autoPlay && studyMode === 'study' && (
                    <div className="auto-play-indicator mt-3">
                      <small className="text-muted">
                        <i className="fas fa-play me-1"></i>
                        Auto-playing...
                      </small>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Card Navigation */}
      {!showResults && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="card-navigation">
                    <small className="text-muted">
                      Use arrow keys to navigate or click the buttons above
                    </small>
                  </div>
                  <div className="quick-actions">
                    <Button
                      variant="outline-warning"
                      onClick={resetSet}
                      size="sm"
                      className="me-2"
                    >
                      <i className="fas fa-redo me-1"></i>
                      Reset
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() => setShuffleCards(!shuffleCards)}
                      size="sm"
                    >
                      <i className="fas fa-random me-1"></i>
                      {shuffleCards ? 'Order' : 'Shuffle'}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InteractiveFlashcards;
