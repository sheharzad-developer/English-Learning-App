import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, ProgressBar, Badge, Row, Col, Modal, Form } from 'react-bootstrap';

const ListeningComprehension = ({ onProgressUpdate }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const listeningExercises = [
    {
      id: 1,
      title: 'Weather Forecast',
      type: 'audio',
      difficulty: 'beginner',
      category: 'daily_life',
      description: 'Listen to a weather forecast and answer questions about the information.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Demo audio
      duration: 45,
      playCount: 3,
      transcript: `Good morning! Here's your weather forecast for today. It will be partly cloudy with temperatures reaching 75 degrees Fahrenheit. There's a 20% chance of light rain in the afternoon. The wind will be coming from the southeast at about 10 miles per hour. Tonight, temperatures will drop to around 58 degrees with clear skies. Tomorrow looks to be sunny and warm with highs near 80 degrees. Have a great day!`,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What will the temperature be today?',
          options: ['70 degrees', '75 degrees', '80 degrees', '85 degrees'],
          correct: 1,
          timestamp: 15
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: 'What is the chance of rain?',
          options: ['10%', '20%', '30%', '40%'],
          correct: 1,
          timestamp: 25
        },
        {
          id: 3,
          type: 'true_false',
          question: 'Tomorrow will be sunny.',
          correct: true,
          timestamp: 40
        }
      ]
    },
    {
      id: 2,
      title: 'Job Interview Conversation',
      type: 'video',
      difficulty: 'intermediate',
      category: 'professional',
      description: 'Watch a job interview and answer comprehension questions.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Demo video
      duration: 120,
      playCount: 2,
      transcript: `Interviewer: Thank you for coming in today. Could you tell me a little about yourself?
      
Candidate: Certainly. I'm a marketing professional with five years of experience in digital marketing. I've worked at two different agencies where I managed social media campaigns and helped increase client engagement by an average of 40%.

Interviewer: That's impressive. What would you say is your greatest strength?

Candidate: I'd say my greatest strength is my ability to analyze data and turn insights into actionable strategies. In my last role, I used analytics to identify trends that led to a 25% increase in conversions.

Interviewer: Excellent. Now, where do you see yourself in five years?

Candidate: I see myself in a senior marketing role, possibly leading a team and developing comprehensive marketing strategies for a growing company like yours.`,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'How many years of experience does the candidate have?',
          options: ['3 years', '4 years', '5 years', '6 years'],
          correct: 2,
          timestamp: 30
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: 'By what percentage did the candidate increase client engagement?',
          options: ['30%', '35%', '40%', '45%'],
          correct: 2,
          timestamp: 45
        },
        {
          id: 3,
          type: 'fill_blank',
          question: 'The candidate increased conversions by ____%.',
          correct: '25',
          timestamp: 75
        }
      ]
    },
    {
      id: 3,
      title: 'Restaurant Ordering',
      type: 'audio',
      difficulty: 'beginner',
      category: 'daily_life',
      description: 'Listen to a conversation in a restaurant.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 60,
      playCount: 3,
      transcript: `Waiter: Good evening! Welcome to Mario's Italian Restaurant. Do you have a reservation?

Customer: Yes, we have a table for two under the name Johnson.

Waiter: Perfect! Right this way, please. Here are your menus. Can I start you off with something to drink?

Customer: I'll have a glass of red wine, and my wife will have sparkling water.

Waiter: Excellent choices. Our special tonight is the seafood risotto with fresh salmon and shrimp. It's quite popular.

Customer: That sounds delicious. We'll need a few more minutes to look at the menu.

Waiter: Of course! I'll be back in a few minutes with your drinks.`,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What name is the reservation under?',
          options: ['Jackson', 'Johnson', 'Jefferson', 'Jameson'],
          correct: 1,
          timestamp: 12
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: 'What does the customer order to drink?',
          options: ['White wine', 'Red wine', 'Beer', 'Water'],
          correct: 1,
          timestamp: 25
        },
        {
          id: 3,
          type: 'true_false',
          question: 'The special tonight is pasta.',
          correct: false,
          timestamp: 35
        }
      ]
    },
    {
      id: 4,
      title: 'News Report - Technology',
      type: 'video',
      difficulty: 'advanced',
      category: 'news',
      description: 'Watch a news report about new technology and answer detailed questions.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 90,
      playCount: 2,
      transcript: `News Anchor: Good evening. Tonight we're reporting on a breakthrough in artificial intelligence technology. Researchers at the Institute of Technology have developed a new AI system that can predict weather patterns with 95% accuracy, significantly higher than current models.

Dr. Sarah Chen, lead researcher on the project, explained that this advancement could revolutionize how we prepare for natural disasters. The system analyzes thousands of data points including atmospheric pressure, wind patterns, and historical weather data.

The technology is expected to be implemented by meteorological services worldwide within the next two years. This could mean more accurate forecasts and better preparation for severe weather events, potentially saving thousands of lives annually.`,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'What is the accuracy rate of the new AI system?',
          options: ['90%', '93%', '95%', '97%'],
          correct: 2,
          timestamp: 20
        },
        {
          id: 2,
          type: 'fill_blank',
          question: 'The lead researcher is Dr. Sarah _____.',
          correct: 'Chen',
          timestamp: 35
        },
        {
          id: 3,
          type: 'multiple_choice',
          question: 'When will the technology be implemented worldwide?',
          options: ['1 year', '2 years', '3 years', '5 years'],
          correct: 1,
          timestamp: 60
        }
      ]
    },
    {
      id: 5,
      title: 'Academic Lecture - History',
      type: 'audio',
      difficulty: 'advanced',
      category: 'academic',
      description: 'Listen to a university lecture excerpt about World War II.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 150,
      playCount: 2,
      transcript: `Professor: Today we'll discuss the pivotal events that led to the end of World War II in Europe. By early 1945, Allied forces had made significant advances on multiple fronts. The Soviet Union was approaching Berlin from the east, while American and British forces crossed the Rhine River in March 1945.

The situation for Germany became increasingly desperate. Hitler's refusal to surrender led to the final assault on Berlin, which began on April 16th, 1945. The battle was fierce, with urban combat lasting for two weeks.

On April 30th, 1945, Adolf Hitler committed suicide in his underground bunker as Soviet forces closed in. Germany's unconditional surrender was signed on May 8th, 1945, marking Victory in Europe Day, or V-E Day as it's commonly known.`,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'When did Allied forces cross the Rhine River?',
          options: ['February 1945', 'March 1945', 'April 1945', 'May 1945'],
          correct: 1,
          timestamp: 30
        },
        {
          id: 2,
          type: 'fill_blank',
          question: 'The final assault on Berlin began on April _____th, 1945.',
          correct: '16',
          timestamp: 60
        },
        {
          id: 3,
          type: 'multiple_choice',
          question: 'What does V-E Day stand for?',
          options: ['Victory in Europe Day', 'Victory End Day', 'Victory East Day', 'Very Easy Day'],
          correct: 0,
          timestamp: 90
        }
      ]
    }
  ];

  const exercise = listeningExercises[currentExercise];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = () => {
    const media = exercise.type === 'audio' ? audioRef.current : videoRef.current;
    
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const media = exercise.type === 'audio' ? audioRef.current : videoRef.current;
    if (media) {
      setCurrentTime(media.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const media = exercise.type === 'audio' ? audioRef.current : videoRef.current;
    if (media) {
      setDuration(media.duration);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    const media = exercise.type === 'audio' ? audioRef.current : videoRef.current;
    if (media) {
      media.playbackRate = speed;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    const media = exercise.type === 'audio' ? audioRef.current : videoRef.current;
    if (media) {
      media.volume = newVolume;
    }
  };

  const seekTo = (time) => {
    const media = exercise.type === 'audio' ? audioRef.current : videoRef.current;
    if (media) {
      media.currentTime = time;
      setCurrentTime(time);
    }
  };

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
          isCorrect = userText === correctText;
          break;
        default:
          break;
      }

      if (isCorrect) correctCount++;
    });

    const newScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(newScore);
    setShowResults(true);
    setAttemptCount(attemptCount + 1);

    if (onProgressUpdate) {
      onProgressUpdate({
        completed: currentExercise + 1,
        progress: Math.round(((currentExercise + 1) / listeningExercises.length) * 100)
      });
    }
  };

  const nextExercise = () => {
    if (currentExercise < listeningExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setAttemptCount(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setAttemptCount(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const retryExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.currentTime = 0;
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="listening-comprehension">
      {/* Instructions Modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-headphones me-2"></i>
            Listening Comprehension Instructions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>How to complete listening exercises:</h5>
          <ol>
            <li><strong>Listen carefully</strong> to the audio or watch the video</li>
            <li><strong>Take notes</strong> if needed during playback</li>
            <li><strong>Answer the questions</strong> based on what you heard</li>
            <li><strong>Use the transcript</strong> if you need help (after attempting)</li>
            <li><strong>Submit your answers</strong> to see your score</li>
          </ol>
          
          <h5 className="mt-4">Available controls:</h5>
          <ul>
            <li><strong>Play/Pause:</strong> Control playback</li>
            <li><strong>Speed control:</strong> Adjust playback speed (0.5x to 2x)</li>
            <li><strong>Volume:</strong> Adjust audio level</li>
            <li><strong>Seek:</strong> Jump to specific timestamps</li>
            <li><strong>Replay limit:</strong> Some exercises limit the number of plays</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Start Listening!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="listening-header-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h3>
                    <i className="fas fa-headphones me-2 text-info"></i>
                    Listening Comprehension
                  </h3>
                  <p className="text-muted mb-0">
                    Improve your listening skills with audio clips and videos
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    variant="outline-info"
                    onClick={() => setShowInstructions(true)}
                  >
                    <i className="fas fa-question-circle me-2"></i>
                    Instructions
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
                <span>{currentExercise + 1} of {listeningExercises.length}</span>
              </div>
              <ProgressBar 
                now={((currentExercise + 1) / listeningExercises.length) * 100} 
                style={{ height: '10px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col md={8}>
          {/* Exercise Info */}
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
                      {exercise.type}
                    </Badge>
                  </h5>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <p>{exercise.description}</p>
              
              {/* Media Player */}
              <div className="media-player mb-3">
                {exercise.type === 'audio' ? (
                  <div className="audio-player">
                    <audio
                      ref={audioRef}
                      src={exercise.audioUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />
                    <div className="audio-controls">
                      <div className="audio-visual">
                        <i className="fas fa-music fa-3x text-primary"></i>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="video-player">
                    <video
                      ref={videoRef}
                      src={exercise.videoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      className="w-100"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}

                {/* Media Controls */}
                <div className="media-controls mt-3">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <div className="playback-controls">
                        <Button
                          variant="primary"
                          onClick={handlePlayPause}
                          className="me-2"
                        >
                          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                        </Button>
                        
                        <span className="time-display">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small">Speed</Form.Label>
                            <Form.Select
                              size="sm"
                              value={playbackSpeed}
                              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                            >
                              <option value={0.5}>0.5x</option>
                              <option value={0.75}>0.75x</option>
                              <option value={1}>1x</option>
                              <option value={1.25}>1.25x</option>
                              <option value={1.5}>1.5x</option>
                              <option value={2}>2x</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small">Volume</Form.Label>
                            <Form.Range
                              min={0}
                              max={1}
                              step={0.1}
                              value={volume}
                              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div 
                      className="progress" 
                      style={{ height: '6px', cursor: 'pointer' }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        seekTo(percent * duration);
                      }}
                    >
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Toggle */}
              <div className="transcript-section">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  <i className="fas fa-file-alt me-2"></i>
                  {showTranscript ? 'Hide' : 'Show'} Transcript
                </Button>

                {showTranscript && (
                  <Card className="mt-3 bg-light">
                    <Card.Body>
                      <h6>Transcript:</h6>
                      <div className="transcript-text" style={{ whiteSpace: 'pre-line' }}>
                        {exercise.transcript}
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </div>
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
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6>Question {index + 1}:</h6>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => seekTo(question.timestamp)}
                    >
                      <i className="fas fa-clock me-1"></i>
                      {formatTime(question.timestamp)}
                    </Button>
                  </div>
                  
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
                            isCorrect = userAnswer?.toLowerCase().trim() === question.correct.toLowerCase().trim();
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
                          return userAnswer?.toLowerCase().trim() === q.correct.toLowerCase().trim();
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
          {/* Exercise Navigation */}
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
                  Previous Exercise
                </Button>
                
                {showResults && (
                  <Button
                    variant="outline-warning"
                    onClick={retryExercise}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Retry Exercise
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={nextExercise}
                  disabled={currentExercise === listeningExercises.length - 1}
                >
                  Next Exercise
                  <i className="fas fa-chevron-right ms-2"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Exercise List */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">All Exercises</h6>
            </Card.Header>
            <Card.Body>
              {listeningExercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className={`exercise-item p-2 rounded mb-2 ${index === currentExercise ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setCurrentExercise(index);
                    setUserAnswers({});
                    setShowResults(false);
                    setScore(0);
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                >
                  <small>
                    <strong>{ex.title}</strong>
                    <br />
                    <Badge bg={getDifficultyColor(ex.difficulty)} className="me-1">
                      {ex.difficulty}
                    </Badge>
                    <Badge bg="secondary">
                      {ex.type}
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

export default ListeningComprehension;
