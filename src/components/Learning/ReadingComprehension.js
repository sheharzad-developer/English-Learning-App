import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, ProgressBar, Badge, Row, Col, Modal, Form } from 'react-bootstrap';

const ReadingComprehension = ({ onProgressUpdate }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showInstructions, setShowInstructions] = useState(false);

  const readingExercises = [
    {
      id: 1,
      title: 'The Benefits of Reading',
      difficulty: 'beginner',
      category: 'lifestyle',
      estimatedTime: 5,
      text: `Reading is one of the most beneficial activities for the mind. When we read, we exercise our brain and improve our vocabulary. Regular reading can help reduce stress and improve concentration.

Studies have shown that people who read regularly have better memory and critical thinking skills. Reading also exposes us to new ideas and different perspectives, which can broaden our understanding of the world.

Furthermore, reading fiction can improve empathy by allowing us to experience life from different characters' perspectives. Whether you prefer novels, newspapers, or magazines, any type of reading can provide these benefits.

To get the most out of reading, try to set aside time each day for this activity. Even reading for just 15-20 minutes daily can make a significant difference in your cognitive abilities and overall well-being.`,
      vocabulary: [
        { word: 'beneficial', definition: 'helpful or advantageous', example: 'Exercise is beneficial for health.' },
        { word: 'concentration', definition: 'the ability to focus attention', example: 'Reading requires concentration.' },
        { word: 'empathy', definition: 'the ability to understand others\' feelings', example: 'Good teachers show empathy toward students.' },
        { word: 'cognitive', definition: 'related to thinking and mental processes', example: 'Puzzles improve cognitive function.' }
      ],
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'According to the text, what does regular reading improve?',
          options: ['Only vocabulary', 'Memory and critical thinking', 'Only stress levels', 'Physical fitness'],
          correct: 1
        },
        {
          id: 2,
          type: 'true_false',
          question: 'Reading fiction can improve empathy.',
          correct: true
        },
        {
          id: 3,
          type: 'fill_blank',
          question: 'The text suggests reading for at least _____ minutes daily.',
          correct: '15-20'
        },
        {
          id: 4,
          type: 'multiple_choice',
          question: 'What is the main purpose of this text?',
          options: ['To sell books', 'To explain reading benefits', 'To compare reading types', 'To criticize non-readers'],
          correct: 1
        }
      ]
    },
    {
      id: 2,
      title: 'Climate Change and Technology',
      difficulty: 'intermediate',
      category: 'science',
      estimatedTime: 8,
      text: `Climate change represents one of the most pressing challenges of our time, but technology offers promising solutions. Renewable energy sources like solar and wind power have become increasingly efficient and cost-effective over the past decade.

Electric vehicles are revolutionizing transportation, with major automakers committing to phase out internal combustion engines. Battery technology improvements have addressed previous concerns about range and charging time, making electric cars more practical for everyday use.

Smart grid technology enables better management of energy distribution, reducing waste and incorporating renewable sources more effectively. Artificial intelligence helps optimize energy consumption in buildings and industrial processes.

However, technology alone cannot solve climate change. Changes in consumer behavior, government policies, and international cooperation are equally important. The combination of technological innovation and social awareness offers the best hope for addressing this global challenge.

Some experts argue that we must also consider the environmental impact of technology itself, including the carbon footprint of manufacturing electronic devices and the energy consumption of data centers.`,
      vocabulary: [
        { word: 'pressing', definition: 'urgent or requiring immediate attention', example: 'Healthcare is a pressing issue.' },
        { word: 'phase out', definition: 'to gradually stop using something', example: 'The company will phase out old software.' },
        { word: 'optimize', definition: 'to make as effective as possible', example: 'We need to optimize our website speed.' },
        { word: 'carbon footprint', definition: 'amount of CO2 emissions produced', example: 'Flying increases your carbon footprint.' }
      ],
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What has happened to renewable energy in the past decade?',
          options: ['Became less efficient', 'Became more efficient and cost-effective', 'Remained the same', 'Became obsolete'],
          correct: 1
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: 'According to the text, what do major automakers plan to do?',
          options: ['Improve gas engines', 'Phase out electric cars', 'Phase out internal combustion engines', 'Stop making cars'],
          correct: 2
        },
        {
          id: 3,
          type: 'true_false',
          question: 'Technology alone can solve climate change.',
          correct: false
        },
        {
          id: 4,
          type: 'fill_blank',
          question: 'Smart grid technology helps manage _____ distribution.',
          correct: 'energy'
        }
      ]
    },
    {
      id: 3,
      title: 'The History of the Internet',
      difficulty: 'advanced',
      category: 'technology',
      estimatedTime: 12,
      text: `The Internet, now an indispensable part of modern life, has a fascinating history that spans several decades. Its origins can be traced back to the 1960s when the United States Department of Defense began developing ARPANET (Advanced Research Projects Agency Network), a project designed to create a communication network that could withstand nuclear attacks.

The fundamental concept was revolutionary: instead of relying on a centralized system that could be easily disrupted, ARPANET employed a decentralized network where information could travel through multiple pathways. This packet-switching technology, developed by Paul Baran and Donald Davies, became the foundation of modern internet communication.

In 1971, Ray Tomlinson sent the first network email, introducing the "@" symbol to separate user names from host names. The 1970s saw the development of TCP/IP (Transmission Control Protocol/Internet Protocol), which standardized how different networks could communicate with each other.

The transformation from a military and academic tool to a public utility began in the 1980s. Tim Berners-Lee's invention of the World Wide Web in 1989 at CERN made the Internet accessible to ordinary users through a user-friendly interface of web pages and hyperlinks.

The 1990s witnessed explosive growth as commercial restrictions were lifted. Companies like America Online (AOL) brought Internet access to millions of households, while search engines like Yahoo and later Google made navigating the vast amount of online information manageable.

The dot-com boom of the late 1990s, followed by its subsequent crash in 2000, demonstrated both the Internet's potential and the dangers of speculative investment. However, this period also laid the groundwork for today's digital economy.

The 21st century has seen the Internet evolve into a platform for social networking, e-commerce, cloud computing, and mobile connectivity. Today's challenges include cybersecurity, digital privacy, and ensuring equitable access to this vital technology worldwide.`,
      vocabulary: [
        { word: 'indispensable', definition: 'absolutely necessary', example: 'Water is indispensable for life.' },
        { word: 'withstand', definition: 'to resist or survive', example: 'The building can withstand earthquakes.' },
        { word: 'decentralized', definition: 'distributed among several locations', example: 'Cryptocurrency uses decentralized networks.' },
        { word: 'speculative', definition: 'involving risky investment', example: 'Speculative trading can lead to losses.' },
        { word: 'equitable', definition: 'fair and impartial', example: 'We need equitable distribution of resources.' }
      ],
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What was the original purpose of ARPANET?',
          options: ['Entertainment', 'Communication that could survive attacks', 'Commercial use', 'Educational purposes'],
          correct: 1
        },
        {
          id: 2,
          type: 'fill_blank',
          question: 'Ray Tomlinson introduced the _____ symbol in email addresses.',
          correct: '@'
        },
        {
          id: 3,
          type: 'multiple_choice',
          question: 'Who invented the World Wide Web?',
          options: ['Paul Baran', 'Donald Davies', 'Ray Tomlinson', 'Tim Berners-Lee'],
          correct: 3
        },
        {
          id: 4,
          type: 'true_false',
          question: 'The dot-com crash of 2000 ended all Internet development.',
          correct: false
        },
        {
          id: 5,
          type: 'multiple_choice',
          question: 'What does TCP/IP stand for?',
          options: ['Technical Computer Protocol/Internet Protocol', 'Transmission Control Protocol/Internet Protocol', 'Transfer Control Protocol/Information Protocol', 'Technical Control Protocol/Internal Protocol'],
          correct: 1
        }
      ]
    },
    {
      id: 4,
      title: 'The Art of Cooking',
      difficulty: 'beginner',
      category: 'lifestyle',
      estimatedTime: 6,
      text: `Cooking is both an art and a science that brings people together. Learning to cook not only saves money but also allows you to control what goes into your food, making it healthier and more nutritious.

Starting with basic skills is important. Learning to chop vegetables properly, understanding different cooking methods like boiling, frying, and baking, and knowing how to season food are fundamental skills every cook should master.

Preparation is key to successful cooking. Reading the entire recipe before starting, gathering all ingredients, and preparing your workspace can prevent mistakes and make cooking more enjoyable. This practice is called "mise en place," a French term meaning "everything in its place."

Don't be afraid to experiment with flavors and ingredients. Some of the best dishes come from creative combinations and happy accidents. Start with simple recipes and gradually work your way up to more complex dishes as your confidence grows.

Cooking is also a wonderful way to connect with family and friends. Sharing meals creates memories and strengthens relationships. Many cultures have traditions centered around food preparation and sharing, highlighting the social importance of cooking.`,
      vocabulary: [
        { word: 'nutritious', definition: 'containing substances needed for health and growth', example: 'Vegetables are nutritious foods.' },
        { word: 'fundamental', definition: 'basic and essential', example: 'Reading is a fundamental skill.' },
        { word: 'mise en place', definition: 'everything in its place (cooking term)', example: 'Good chefs practice mise en place.' },
        { word: 'gradually', definition: 'slowly and steadily', example: 'The weather gradually improved.' }
      ],
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What does "mise en place" mean?',
          options: ['Cooking quickly', 'Everything in its place', 'French cooking', 'Expensive ingredients'],
          correct: 1
        },
        {
          id: 2,
          type: 'true_false',
          question: 'Cooking helps you control what goes into your food.',
          correct: true
        },
        {
          id: 3,
          type: 'fill_blank',
          question: 'The text mentions three cooking methods: boiling, frying, and _____.',
          correct: 'baking'
        },
        {
          id: 4,
          type: 'multiple_choice',
          question: 'According to the text, what should beginners do?',
          options: ['Start with complex recipes', 'Start with simple recipes', 'Never experiment', 'Cook alone'],
          correct: 1
        }
      ]
    }
  ];

  const exercise = readingExercises[currentExercise];

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      if (startTime) {
        setReadingTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExercise, startTime]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };

  const submitAnswers = () => {
    let correctCount = 0;
    const totalQuestions = exercise.questions.length;

    exercise.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      let isCorrect = false;

      switch (question.type) {
        case 'multiple_choice':
          isCorrect = userAnswer === question.correct;
          break;
        case 'true_false':
          isCorrect = userAnswer === question.correct;
          break;
        case 'fill_blank':
          const userText = userAnswer?.toLowerCase().trim();
          const correctText = question.correct.toLowerCase().trim();
          isCorrect = userText === correctText || userText.includes(correctText);
          break;
        default:
          break;
      }

      if (isCorrect) correctCount++;
    });

    const newScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(newScore);
    setShowResults(true);

    if (onProgressUpdate) {
      onProgressUpdate({
        completed: currentExercise + 1,
        progress: Math.round(((currentExercise + 1) / readingExercises.length) * 100)
      });
    }
  };

  const nextExercise = () => {
    if (currentExercise < readingExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setReadingTime(0);
      setStartTime(Date.now());
      setHighlightedText('');
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setReadingTime(0);
      setStartTime(Date.now());
      setHighlightedText('');
    }
  };

  const retryExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setReadingTime(0);
    setStartTime(Date.now());
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      setHighlightedText(selection.toString());
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

  const getReadingSpeed = () => {
    const wordCount = exercise.text.split(' ').length;
    const minutes = readingTime / 60;
    return minutes > 0 ? Math.round(wordCount / minutes) : 0;
  };

  return (
    <div className="reading-comprehension">
      {/* Instructions Modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-book-open me-2"></i>
            Reading Comprehension Instructions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>How to complete reading exercises:</h5>
          <ol>
            <li><strong>Read the passage carefully</strong> - take your time to understand the content</li>
            <li><strong>Highlight important information</strong> - select text to highlight key points</li>
            <li><strong>Use vocabulary help</strong> - click on difficult words or use the vocabulary list</li>
            <li><strong>Answer the questions</strong> - based on what you read in the passage</li>
            <li><strong>Review your answers</strong> - before submitting</li>
          </ol>
          
          <h5 className="mt-4">Tips for better reading comprehension:</h5>
          <ul>
            <li>Read the questions first to know what to look for</li>
            <li>Take notes while reading</li>
            <li>Pay attention to main ideas and supporting details</li>
            <li>Re-read difficult sections</li>
            <li>Use context clues for unknown words</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Start Reading!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Vocabulary Modal */}
      <Modal show={showVocabulary} onHide={() => setShowVocabulary(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-book me-2"></i>
            Vocabulary Help
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Key vocabulary for this passage:</h5>
          {exercise.vocabulary.map((item, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <h6 className="text-primary">{item.word}</h6>
                <p className="mb-1"><strong>Definition:</strong> {item.definition}</p>
                <p className="mb-0 text-muted"><strong>Example:</strong> {item.example}</p>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVocabulary(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="reading-header-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h3>
                    <i className="fas fa-book-open me-2 text-success"></i>
                    Reading Comprehension
                  </h3>
                  <p className="text-muted mb-0">
                    Improve your reading skills and comprehension
                  </p>
                </Col>
                <Col md={6} className="text-end">
                  <Button
                    variant="outline-info"
                    onClick={() => setShowInstructions(true)}
                    className="me-2"
                  >
                    <i className="fas fa-question-circle me-2"></i>
                    Instructions
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowVocabulary(true)}
                  >
                    <i className="fas fa-book me-2"></i>
                    Vocabulary
                  </Button>
                </Col>
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
                <span>Exercise Progress</span>
                <span>{currentExercise + 1} of {readingExercises.length}</span>
              </div>
              <ProgressBar 
                now={((currentExercise + 1) / readingExercises.length) * 100} 
                style={{ height: '10px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col md={8}>
          {/* Reading Passage */}
          <Card className="mb-4">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    {exercise.title}
                    <Badge bg={getDifficultyColor(exercise.difficulty)} className="ms-2">
                      {exercise.difficulty}
                    </Badge>
                    <Badge bg="secondary" className="ms-1">
                      {exercise.category}
                    </Badge>
                    <Badge bg="info" className="ms-1">
                      ~{exercise.estimatedTime} min
                    </Badge>
                  </h5>
                </Col>
                <Col xs="auto">
                  <div className="reading-controls">
                    <Form.Label className="small me-2">Font Size:</Form.Label>
                    <Form.Range
                      min={12}
                      max={24}
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="d-inline-block"
                      style={{ width: '100px' }}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div 
                className="reading-text"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: '1.6',
                  textAlign: 'justify'
                }}
                onMouseUp={handleTextSelection}
              >
                {exercise.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>

              {highlightedText && (
                <Alert variant="info" className="mt-3">
                  <strong>Selected text:</strong> "{highlightedText}"
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setHighlightedText('')}
                    className="float-end"
                  >
                    Clear
                  </Button>
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Questions */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-question-circle me-2"></i>
                Comprehension Questions
              </h6>
            </Card.Header>
            <Card.Body>
              {exercise.questions.map((question, index) => (
                <div key={question.id} className="question-item mb-4">
                  <h6>Question {index + 1}:</h6>
                  <p>{question.question}</p>

                  {question.type === 'multiple_choice' && (
                    <div className="options">
                      {question.options.map((option, optionIndex) => (
                        <Form.Check
                          key={optionIndex}
                          type="radio"
                          name={`question-${question.id}`}
                          label={option}
                          checked={userAnswers[question.id] === optionIndex}
                          onChange={() => handleAnswerChange(question.id, optionIndex)}
                          disabled={showResults}
                        />
                      ))}
                    </div>
                  )}

                  {question.type === 'true_false' && (
                    <div className="options">
                      <Form.Check
                        type="radio"
                        name={`question-${question.id}`}
                        label="True"
                        checked={userAnswers[question.id] === true}
                        onChange={() => handleAnswerChange(question.id, true)}
                        disabled={showResults}
                      />
                      <Form.Check
                        type="radio"
                        name={`question-${question.id}`}
                        label="False"
                        checked={userAnswers[question.id] === false}
                        onChange={() => handleAnswerChange(question.id, false)}
                        disabled={showResults}
                      />
                    </div>
                  )}

                  {question.type === 'fill_blank' && (
                    <Form.Control
                      type="text"
                      placeholder="Type your answer here..."
                      value={userAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={showResults}
                    />
                  )}

                  {/* Show correct answer if results are displayed */}
                  {showResults && (
                    <div className="mt-2">
                      {(() => {
                        const userAnswer = userAnswers[question.id];
                        let isCorrect = false;
                        let correctAnswerText = '';

                        switch (question.type) {
                          case 'multiple_choice':
                            isCorrect = userAnswer === question.correct;
                            correctAnswerText = question.options[question.correct];
                            break;
                          case 'true_false':
                            isCorrect = userAnswer === question.correct;
                            correctAnswerText = question.correct ? 'True' : 'False';
                            break;
                          case 'fill_blank':
                            const userText = userAnswer?.toLowerCase().trim();
                            const correctText = question.correct.toLowerCase().trim();
                            isCorrect = userText === correctText || userText?.includes(correctText);
                            correctAnswerText = question.correct;
                            break;
                        }

                        return (
                          <Alert variant={isCorrect ? 'success' : 'danger'} className="mb-0">
                            <small>
                              <strong>{isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong>
                              {!isCorrect && ` Correct answer: ${correctAnswerText}`}
                            </small>
                          </Alert>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              {!showResults && (
                <div className="text-center">
                  <Button
                    variant="success"
                    onClick={submitAnswers}
                    disabled={Object.keys(userAnswers).length !== exercise.questions.length}
                  >
                    <i className="fas fa-check me-2"></i>
                    Submit Answers
                  </Button>
                </div>
              )}

              {/* Results */}
              {showResults && (
                <Alert variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}>
                  <h6>
                    <i className="fas fa-chart-bar me-2"></i>
                    Your Score: {score}%
                  </h6>
                  <p className="mb-0">
                    You got {exercise.questions.filter(q => {
                      const userAnswer = userAnswers[q.id];
                      switch (q.type) {
                        case 'multiple_choice':
                          return userAnswer === q.correct;
                        case 'true_false':
                          return userAnswer === q.correct;
                        case 'fill_blank':
                          const userText = userAnswer?.toLowerCase().trim();
                          const correctText = q.correct.toLowerCase().trim();
                          return userText === correctText || userText?.includes(correctText);
                        default:
                          return false;
                      }
                    }).length} out of {exercise.questions.length} questions correct.
                  </p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col md={4}>
          {/* Reading Stats */}
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Reading Stats
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="stat-item mb-2">
                <strong>Reading Time:</strong> {formatTime(readingTime)}
              </div>
              <div className="stat-item mb-2">
                <strong>Estimated Time:</strong> {exercise.estimatedTime} minutes
              </div>
              <div className="stat-item mb-2">
                <strong>Reading Speed:</strong> {getReadingSpeed()} WPM
              </div>
              <div className="stat-item">
                <strong>Word Count:</strong> {exercise.text.split(' ').length} words
              </div>
            </Card.Body>
          </Card>

          {/* Navigation */}
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Navigation</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  onClick={previousExercise}
                  disabled={currentExercise === 0}
                >
                  <i className="fas fa-chevron-left me-2"></i>
                  Previous
                </Button>
                
                {showResults && (
                  <Button
                    variant="outline-warning"
                    onClick={retryExercise}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Retry
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={nextExercise}
                  disabled={currentExercise === readingExercises.length - 1}
                >
                  Next
                  <i className="fas fa-chevron-right ms-2"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Exercise List */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">All Passages</h6>
            </Card.Header>
            <Card.Body>
              {readingExercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className={`exercise-item p-2 rounded mb-2 ${index === currentExercise ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setCurrentExercise(index);
                    setUserAnswers({});
                    setShowResults(false);
                    setScore(0);
                    setReadingTime(0);
                    setStartTime(Date.now());
                    setHighlightedText('');
                  }}
                >
                  <small>
                    <strong>{ex.title}</strong>
                    <br />
                    <Badge bg={getDifficultyColor(ex.difficulty)} className="me-1">
                      {ex.difficulty}
                    </Badge>
                    <Badge bg="secondary">
                      {ex.category}
                    </Badge>
                  </small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReadingComprehension;
