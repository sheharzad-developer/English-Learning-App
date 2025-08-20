import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, ProgressBar, Badge, Row, Col, Modal, Form } from 'react-bootstrap';

const EnhancedQuizzes = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const enhancedQuizzes = [
    {
      id: 1,
      title: 'Listening Quiz: Weather Report',
      type: 'listening',
      difficulty: 'beginner',
      category: 'listening',
      timeLimit: 10, // minutes
      description: 'Listen to weather reports and answer questions',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What will the weather be like tomorrow?',
          audioText: 'Tomorrow will be sunny with temperatures reaching 75 degrees Fahrenheit.',
          options: ['Rainy', 'Sunny', 'Cloudy', 'Snowy'],
          correct: 1,
          explanation: 'The speaker clearly states "tomorrow will be sunny"',
          points: 10
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: 'What is the expected temperature?',
          audioText: 'Temperatures will reach 75 degrees Fahrenheit.',
          options: ['70 degrees', '75 degrees', '80 degrees', '85 degrees'],
          correct: 1,
          explanation: 'The forecast mentions "75 degrees Fahrenheit"',
          points: 10
        },
        {
          id: 3,
          type: 'true_false',
          question: 'There will be rain tomorrow.',
          audioText: 'Tomorrow will be sunny with no chance of rain.',
          correct: false,
          explanation: 'The forecast says it will be sunny with no rain',
          points: 10
        }
      ]
    },
    {
      id: 2,
      title: 'Video Quiz: Job Interview',
      type: 'video',
      difficulty: 'intermediate',
      category: 'speaking',
      timeLimit: 15,
      description: 'Watch a job interview and answer comprehension questions',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What position is the candidate applying for?',
          options: ['Marketing Manager', 'Sales Representative', 'Software Developer', 'Project Manager'],
          correct: 0,
          explanation: 'The candidate mentions applying for the Marketing Manager position',
          points: 15
        },
        {
          id: 2,
          type: 'fill_blank',
          question: 'The candidate has _____ years of experience.',
          correct: '5',
          explanation: 'The candidate states having 5 years of experience',
          points: 15
        },
        {
          id: 3,
          type: 'multiple_select',
          question: 'Which skills does the candidate mention? (Select all that apply)',
          options: ['Leadership', 'Communication', 'Problem-solving', 'Programming'],
          correct: [0, 1, 2],
          explanation: 'The candidate mentions leadership, communication, and problem-solving skills',
          points: 20
        }
      ]
    },
    {
      id: 3,
      title: 'Reading Comprehension: Technology',
      type: 'reading',
      difficulty: 'advanced',
      category: 'reading',
      timeLimit: 20,
      description: 'Read about technology trends and answer questions',
      passage: `Artificial Intelligence (AI) has become increasingly prevalent in our daily lives. From recommendation systems on streaming platforms to virtual assistants in our smartphones, AI technologies are reshaping how we interact with digital services.

Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed. This capability has led to breakthroughs in various fields, including healthcare, finance, and transportation.

However, the rapid advancement of AI also raises important ethical questions. Issues such as privacy, job displacement, and algorithmic bias need careful consideration as we continue to integrate AI into society.

Despite these challenges, most experts agree that AI will continue to play an increasingly important role in shaping our future. The key is to develop and deploy these technologies responsibly, ensuring they benefit humanity while minimizing potential risks.`,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'According to the passage, what is machine learning?',
          options: [
            'A type of computer programming',
            'A subset of AI that learns from experience',
            'A method of data storage',
            'A form of human intelligence'
          ],
          correct: 1,
          explanation: 'The passage defines machine learning as "a subset of AI" that "enables computers to learn and improve from experience"',
          points: 15
        },
        {
          id: 2,
          type: 'multiple_select',
          question: 'Which fields have seen breakthroughs due to machine learning?',
          options: ['Healthcare', 'Finance', 'Transportation', 'Education'],
          correct: [0, 1, 2],
          explanation: 'The passage mentions healthcare, finance, and transportation as fields with ML breakthroughs',
          points: 20
        },
        {
          id: 3,
          type: 'true_false',
          question: 'All experts believe AI will have a negative impact on society.',
          correct: false,
          explanation: 'The passage states that "most experts agree that AI will continue to play an increasingly important role" in a positive context',
          points: 10
        },
        {
          id: 4,
          type: 'fill_blank',
          question: 'The passage mentions three ethical concerns: privacy, job displacement, and algorithmic _____.',
          correct: 'bias',
          explanation: 'The passage lists "algorithmic bias" as one of the three ethical concerns',
          points: 15
        }
      ]
    },
    {
      id: 4,
      title: 'Grammar and Vocabulary Mix',
      type: 'mixed',
      difficulty: 'intermediate',
      category: 'grammar',
      timeLimit: 12,
      description: 'Mixed questions on grammar rules and vocabulary',
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'Choose the correct form: "I _____ to the store yesterday."',
          options: ['go', 'went', 'gone', 'going'],
          correct: 1,
          explanation: 'Past tense "went" is correct for an action completed yesterday',
          points: 10,
          image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Past+Tense'
        },
        {
          id: 2,
          type: 'matching',
          question: 'Match the words with their definitions:',
          pairs: [
            { word: 'Ambitious', definition: 'Having a strong desire for success' },
            { word: 'Reliable', definition: 'Able to be trusted or depended on' },
            { word: 'Innovative', definition: 'Introducing new ideas or methods' }
          ],
          correct: [0, 1, 2], // Correct matching order
          explanation: 'Ambitious means having strong desire for success, Reliable means trustworthy, Innovative means introducing new ideas',
          points: 20
        },
        {
          id: 3,
          type: 'drag_drop',
          question: 'Arrange these words to form a correct sentence:',
          words: ['often', 'She', 'coffee', 'drinks', 'morning', 'in', 'the'],
          correct: ['She', 'often', 'drinks', 'coffee', 'in', 'the', 'morning'],
          explanation: 'Correct word order: Subject + Adverb + Verb + Object + Prepositional phrase',
          points: 15
        },
        {
          id: 4,
          type: 'audio_question',
          question: 'Listen and choose the word you hear:',
          audioText: 'pronunciation',
          options: ['pronunciation', 'pronounciation', 'prononciation', 'pronounsiation'],
          correct: 0,
          explanation: 'The correct spelling is "pronunciation" with "nun" not "noun"',
          points: 10
        }
      ]
    }
  ];

  const currentQuizData = enhancedQuizzes[currentQuiz];
  const currentQuestionData = currentQuizData.questions[currentQuestion];

  useEffect(() => {
    if (quizStarted && currentQuizData.timeLimit) {
      setTimeRemaining(currentQuizData.timeLimit * 60);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, currentQuiz]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const finishQuiz = () => {
    setQuizStarted(false);
    calculateScore();
    setShowResults(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    currentQuizData.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = userAnswers[question.id];
      
      if (isAnswerCorrect(question, userAnswer)) {
        earnedPoints += question.points;
      }
    });

    setScore(Math.round((earnedPoints / totalPoints) * 100));
  };

  const isAnswerCorrect = (question, userAnswer) => {
    if (!userAnswer) return false;

    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return userAnswer === question.correct;
      
      case 'multiple_select':
        if (!Array.isArray(userAnswer) || !Array.isArray(question.correct)) return false;
        return userAnswer.length === question.correct.length && 
               userAnswer.every(answer => question.correct.includes(answer));
      
      case 'fill_blank':
        return userAnswer.toLowerCase().trim() === question.correct.toLowerCase().trim();
      
      case 'matching':
        if (!Array.isArray(userAnswer)) return false;
        return JSON.stringify(userAnswer) === JSON.stringify(question.correct);
      
      case 'drag_drop':
        if (!Array.isArray(userAnswer)) return false;
        return JSON.stringify(userAnswer) === JSON.stringify(question.correct);
      
      case 'audio_question':
        return userAnswer === question.correct;
      
      default:
        return false;
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(userAnswers[currentQuizData.questions[currentQuestion + 1].id] || null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuizData.questions[currentQuestion - 1].id] || null);
      setShowExplanation(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const renderQuestion = () => {
    switch (currentQuestionData.type) {
      case 'multiple_choice':
        return (
          <div className="question-content">
            <h5 className="question-text mb-4">{currentQuestionData.question}</h5>
            
            {currentQuestionData.image && (
              <div className="question-image mb-3 text-center">
                <img 
                  src={currentQuestionData.image} 
                  alt="Question illustration" 
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}

            <div className="options">
              {currentQuestionData.options.map((option, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  name="answer"
                  label={option}
                  checked={selectedAnswer === index}
                  onChange={() => handleAnswerChange(currentQuestionData.id, index)}
                  className="mb-3 option-check"
                />
              ))}
            </div>
          </div>
        );

      case 'multiple_select':
        return (
          <div className="question-content">
            <h5 className="question-text mb-4">{currentQuestionData.question}</h5>
            <div className="options">
              {currentQuestionData.options.map((option, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={option}
                  checked={selectedAnswer?.includes(index) || false}
                  onChange={(e) => {
                    const current = selectedAnswer || [];
                    const newAnswer = e.target.checked 
                      ? [...current, index]
                      : current.filter(i => i !== index);
                    handleAnswerChange(currentQuestionData.id, newAnswer);
                  }}
                  className="mb-3 option-check"
                />
              ))}
            </div>
          </div>
        );

      case 'true_false':
        return (
          <div className="question-content">
            <h5 className="question-text mb-4">{currentQuestionData.question}</h5>
            <div className="true-false-options">
              <Row>
                <Col md={6}>
                  <Button
                    variant={selectedAnswer === true ? 'success' : 'outline-success'}
                    size="lg"
                    className="w-100 mb-2"
                    onClick={() => handleAnswerChange(currentQuestionData.id, true)}
                  >
                    <i className="fas fa-check me-2"></i>
                    True
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant={selectedAnswer === false ? 'danger' : 'outline-danger'}
                    size="lg"
                    className="w-100 mb-2"
                    onClick={() => handleAnswerChange(currentQuestionData.id, false)}
                  >
                    <i className="fas fa-times me-2"></i>
                    False
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="question-content">
            <h5 className="question-text mb-4">{currentQuestionData.question}</h5>
            <Form.Control
              type="text"
              size="lg"
              value={selectedAnswer || ''}
              onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
              placeholder="Type your answer here..."
              className="text-center"
            />
          </div>
        );

      case 'audio_question':
        return (
          <div className="question-content">
            <h5 className="question-text mb-4">{currentQuestionData.question}</h5>
            
            <div className="audio-controls mb-4 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => speakText(currentQuestionData.audioText)}
                className="mb-3"
              >
                <i className="fas fa-volume-up me-2"></i>
                Play Audio
              </Button>
              <br />
              <small className="text-muted">Click to replay the audio</small>
            </div>

            <div className="options">
              {currentQuestionData.options.map((option, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  name="answer"
                  label={option}
                  checked={selectedAnswer === index}
                  onChange={() => handleAnswerChange(currentQuestionData.id, index)}
                  className="mb-3 option-check"
                />
              ))}
            </div>
          </div>
        );

      default:
        return <div>Question type not supported</div>;
    }
  };

  if (!quizStarted && !showResults) {
    return (
      <div className="enhanced-quizzes">
        {/* Quiz Selection */}
        <Row className="mb-4">
          <Col>
            <Card className="quiz-header-card">
              <Card.Body>
                <h3>
                  <i className="fas fa-question-circle me-2 text-primary"></i>
                  Enhanced Multimedia Quizzes
                </h3>
                <p className="text-muted mb-0">
                  Test your English skills with interactive multimedia quizzes
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {enhancedQuizzes.map((quiz, index) => (
            <Col md={6} key={quiz.id} className="mb-4">
              <Card 
                className={`quiz-card h-100 ${index === currentQuiz ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentQuiz(index)}
              >
                <Card.Body>
                  <div className="quiz-header mb-3">
                    <h5 className="quiz-title">{quiz.title}</h5>
                    <div className="quiz-badges">
                      <Badge bg={getDifficultyColor(quiz.difficulty)} className="me-2">
                        {quiz.difficulty}
                      </Badge>
                      <Badge bg="secondary" className="me-2">{quiz.type}</Badge>
                      <Badge bg="info">{quiz.questions.length} questions</Badge>
                    </div>
                  </div>
                  
                  <p className="quiz-description text-muted">{quiz.description}</p>
                  
                  <div className="quiz-details">
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      Time limit: {quiz.timeLimit} minutes
                    </small>
                  </div>
                  
                  {index === currentQuiz && (
                    <div className="mt-3">
                      <Button
                        variant="primary"
                        onClick={startQuiz}
                        size="lg"
                        className="w-100"
                      >
                        <i className="fas fa-play me-2"></i>
                        Start Quiz
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-results">
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="results-card">
              <Card.Header className="text-center">
                <h4>
                  <i className="fas fa-chart-bar me-2"></i>
                  Quiz Results
                </h4>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="score-display mb-4">
                  <div className={`score-circle score-${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-work'}`}>
                    <span className="score-number">{score}</span>
                    <span className="score-percent">%</span>
                  </div>
                </div>

                <h5 className="mb-3">
                  {score >= 90 ? 'Excellent work!' :
                   score >= 80 ? 'Great job!' :
                   score >= 70 ? 'Good effort!' :
                   score >= 60 ? 'Keep practicing!' :
                   'Try again!'}
                </h5>

                <p className="text-muted mb-4">
                  You answered {currentQuizData.questions.filter(q => isAnswerCorrect(q, userAnswers[q.id])).length} out of {currentQuizData.questions.length} questions correctly.
                </p>

                <div className="result-actions">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowResults(false);
                      setQuizStarted(false);
                    }}
                    className="me-2"
                  >
                    <i className="fas fa-redo me-2"></i>
                    Try Again
                  </Button>
                  <Button
                    variant="outline-info"
                    onClick={() => setShowReview(true)}
                  >
                    <i className="fas fa-eye me-2"></i>
                    Review Answers
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Review Modal */}
        <Modal show={showReview} onHide={() => setShowReview(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Answer Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentQuizData.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = isAnswerCorrect(question, userAnswer);
              
              return (
                <div key={question.id} className="review-item mb-4">
                  <h6>Question {index + 1}:</h6>
                  <p>{question.question}</p>
                  
                  <Alert variant={isCorrect ? 'success' : 'danger'}>
                    <small>
                      <strong>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong>
                      <br />
                      {question.explanation}
                    </small>
                  </Alert>
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReview(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  return (
    <div className="quiz-taking">
      {/* Quiz Header */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h5 className="mb-0">{currentQuizData.title}</h5>
                  <small className="text-muted">
                    Question {currentQuestion + 1} of {currentQuizData.questions.length}
                  </small>
                </Col>
                <Col md={6} className="text-end">
                  {timeRemaining !== null && (
                    <div className="timer">
                      <i className="fas fa-clock me-2"></i>
                      <span className={timeRemaining < 300 ? 'text-danger' : ''}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Row className="mb-4">
        <Col>
          <ProgressBar 
            now={((currentQuestion + 1) / currentQuizData.questions.length) * 100} 
            style={{ height: '10px' }}
          />
        </Col>
      </Row>

      {/* Question Card */}
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="question-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <Badge bg="primary" className="me-2">
                    Question {currentQuestion + 1}
                  </Badge>
                  <Badge bg="secondary">
                    {currentQuestionData.points} points
                  </Badge>
                </span>
                
                {currentQuizData.type === 'reading' && currentQuizData.passage && (
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => alert(currentQuizData.passage)}
                  >
                    <i className="fas fa-book me-1"></i>
                    View Passage
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {renderQuestion()}

              {/* Navigation Buttons */}
              <div className="question-navigation mt-4">
                <Row>
                  <Col md={6}>
                    <Button
                      variant="outline-secondary"
                      onClick={previousQuestion}
                      disabled={currentQuestion === 0}
                      className="me-2"
                    >
                      <i className="fas fa-chevron-left me-2"></i>
                      Previous
                    </Button>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      variant="primary"
                      onClick={nextQuestion}
                      disabled={!selectedAnswer && selectedAnswer !== false && selectedAnswer !== 0}
                    >
                      {currentQuestion === currentQuizData.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                      <i className="fas fa-chevron-right ms-2"></i>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnhancedQuizzes;
