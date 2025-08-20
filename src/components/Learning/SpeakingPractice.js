import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, ProgressBar, Badge, Row, Col, Modal, Form } from 'react-bootstrap';

const SpeakingPractice = ({ onProgressUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [dialogueMode, setDialogueMode] = useState(false);
  const [dialogueStep, setDialogueStep] = useState(0);
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const speakingExercises = [
    {
      id: 1,
      type: 'pronunciation',
      title: 'Basic Pronunciation',
      instruction: 'Please read the following sentence clearly:',
      text: 'The quick brown fox jumps over the lazy dog.',
      targetWords: ['quick', 'brown', 'jumps', 'lazy'],
      difficulty: 'beginner',
      category: 'pronunciation'
    },
    {
      id: 2,
      type: 'dialogue',
      title: 'Job Interview Practice',
      instruction: 'Practice this job interview dialogue. I\'ll play the interviewer.',
      dialogue: [
        { speaker: 'interviewer', text: 'Tell me about yourself.' },
        { speaker: 'student', text: 'I am a motivated professional with experience in...' },
        { speaker: 'interviewer', text: 'What are your strengths?' },
        { speaker: 'student', text: 'My main strengths include problem-solving and teamwork.' }
      ],
      difficulty: 'intermediate',
      category: 'conversation'
    },
    {
      id: 3,
      type: 'description',
      title: 'Picture Description',
      instruction: 'Describe what you see in this picture for 1 minute:',
      imageUrl: 'https://via.placeholder.com/400x300/4CAF50/white?text=City+Park+Scene',
      prompts: ['What do you see?', 'Describe the people', 'What\'s the weather like?', 'What activities are happening?'],
      difficulty: 'intermediate',
      category: 'description'
    },
    {
      id: 4,
      type: 'tongue_twister',
      title: 'Tongue Twister Challenge',
      instruction: 'Try to say this tongue twister clearly and quickly:',
      text: 'She sells seashells by the seashore.',
      repetitions: 3,
      difficulty: 'advanced',
      category: 'pronunciation'
    },
    {
      id: 5,
      type: 'storytelling',
      title: 'Story Telling',
      instruction: 'Tell a 2-minute story using these words:',
      keywords: ['adventure', 'forest', 'mysterious', 'discovery', 'courage'],
      difficulty: 'advanced',
      category: 'fluency'
    }
  ];

  const dialogueScenarios = [
    {
      scenario: 'Restaurant Order',
      dialogue: [
        { speaker: 'waiter', text: 'Good evening! Welcome to our restaurant. Have you decided what you\'d like to order?' },
        { speaker: 'customer', text: 'Yes, I\'d like the grilled salmon with vegetables, please.' },
        { speaker: 'waiter', text: 'Excellent choice! Would you like anything to drink with that?' },
        { speaker: 'customer', text: 'I\'ll have a glass of white wine, thank you.' }
      ]
    },
    {
      scenario: 'Doctor Visit',
      dialogue: [
        { speaker: 'doctor', text: 'What brings you in today? How are you feeling?' },
        { speaker: 'patient', text: 'I\'ve been having headaches for the past few days.' },
        { speaker: 'doctor', text: 'I see. Can you describe the pain? Is it constant or does it come and go?' },
        { speaker: 'patient', text: 'It comes and goes, usually in the afternoon.' }
      ]
    }
  ];

  useEffect(() => {
    checkSpeechRecognitionSupport();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const checkSpeechRecognitionSupport = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (transcript) {
        analyzePronunciation();
      }
    };
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    setTranscript('');
    setPronunciationScore(null);
    setFeedback('');
    setRecordingTime(0);
    setIsRecording(true);
    
    recognitionRef.current.start();
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const analyzePronunciation = () => {
    const exercise = speakingExercises[currentExercise];
    
    if (!transcript) {
      setFeedback('No speech detected. Please try again.');
      return;
    }

    // Simple pronunciation analysis (in a real app, you'd use advanced speech analysis APIs)
    const targetText = exercise.text || exercise.dialogue?.[dialogueStep]?.text || '';
    const similarity = calculateSimilarity(transcript.toLowerCase(), targetText.toLowerCase());
    
    let score = Math.round(similarity * 100);
    let feedbackText = '';
    
    if (score >= 90) {
      feedbackText = '🎉 Excellent pronunciation! Very clear and accurate.';
    } else if (score >= 80) {
      feedbackText = '👍 Good job! Your pronunciation is quite clear.';
    } else if (score >= 70) {
      feedbackText = '👌 Not bad! Try to speak a bit more clearly.';
    } else if (score >= 60) {
      feedbackText = '📝 Keep practicing! Focus on pronunciation of key words.';
    } else {
      feedbackText = '💪 Don\'t give up! Try speaking slower and more clearly.';
      score = Math.max(score, 30); // Minimum score for effort
    }

    // Check specific target words
    if (exercise.targetWords) {
      const missedWords = exercise.targetWords.filter(word => 
        !transcript.toLowerCase().includes(word.toLowerCase())
      );
      
      if (missedWords.length > 0) {
        feedbackText += ` Try to pronounce these words more clearly: ${missedWords.join(', ')}.`;
        score = Math.max(score - (missedWords.length * 10), 30);
      }
    }

    setPronunciationScore(score);
    setFeedback(feedbackText);

    // Update progress
    if (onProgressUpdate) {
      onProgressUpdate({
        completed: currentExercise + 1,
        progress: Math.round(((currentExercise + 1) / speakingExercises.length) * 100)
      });
    }
  };

  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const maxLength = Math.max(words1.length, words2.length);
    
    if (maxLength === 0) return 0;
    
    let matches = 0;
    words1.forEach(word => {
      if (words2.some(w => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });
    
    return matches / maxLength;
  };

  const nextExercise = () => {
    if (currentExercise < speakingExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTranscript('');
      setPronunciationScore(null);
      setFeedback('');
      setDialogueStep(0);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setTranscript('');
      setPronunciationScore(null);
      setFeedback('');
      setDialogueStep(0);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exercise = speakingExercises[currentExercise];

  if (!isSupported) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Speech Recognition Not Supported</Alert.Heading>
        <p>
          Your browser doesn't support speech recognition. Please use a modern browser like Chrome, Edge, or Safari.
        </p>
      </Alert>
    );
  }

  return (
    <div className="speaking-practice">
      {/* Instructions Modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-microphone me-2"></i>
            Speaking Practice Instructions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>How to use Speaking Practice:</h5>
          <ol>
            <li><strong>Read the instruction</strong> for each exercise carefully</li>
            <li><strong>Click the record button</strong> when you're ready to speak</li>
            <li><strong>Speak clearly</strong> into your microphone</li>
            <li><strong>Click stop</strong> when you're finished</li>
            <li><strong>Review your score</strong> and feedback</li>
          </ol>
          
          <h5 className="mt-4">Tips for better pronunciation:</h5>
          <ul>
            <li>Speak at a moderate pace</li>
            <li>Pronounce each word clearly</li>
            <li>Use proper intonation and stress</li>
            <li>Practice in a quiet environment</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="speaking-header-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h3>
                    <i className="fas fa-microphone me-2 text-danger"></i>
                    Speaking Practice
                  </h3>
                  <p className="text-muted mb-0">
                    Improve your pronunciation and speaking skills with AI-powered feedback
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    variant="outline-info"
                    onClick={() => setShowInstructions(true)}
                  >
                    <i className="fas fa-question-circle me-2"></i>
                    How to Use
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
                <span>{currentExercise + 1} of {speakingExercises.length}</span>
              </div>
              <ProgressBar 
                now={((currentExercise + 1) / speakingExercises.length) * 100} 
                style={{ height: '10px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Current Exercise */}
      <Row>
        <Col md={8}>
          <Card className="exercise-card">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    {exercise.title}
                    <Badge bg="secondary" className="ms-2">{exercise.difficulty}</Badge>
                    <Badge bg="info" className="ms-1">{exercise.category}</Badge>
                  </h5>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => speakText(exercise.instruction)}
                  >
                    <i className="fas fa-volume-up"></i>
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div className="instruction mb-3">
                <p className="fw-bold">{exercise.instruction}</p>
              </div>

              {exercise.type === 'pronunciation' && (
                <div className="pronunciation-text">
                  <Card className="text-to-read">
                    <Card.Body>
                      <h4 className="text-center">{exercise.text}</h4>
                      <div className="text-center mt-3">
                        <Button
                          variant="outline-primary"
                          onClick={() => speakText(exercise.text)}
                        >
                          <i className="fas fa-play me-2"></i>
                          Listen to Example
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {exercise.type === 'dialogue' && (
                <div className="dialogue-practice">
                  <Alert variant="info">
                    <strong>Role Play:</strong> You are the student/customer/patient. 
                    I'll play the other role.
                  </Alert>
                  {exercise.dialogue.map((line, index) => (
                    <div 
                      key={index} 
                      className={`dialogue-line ${line.speaker === 'student' ? 'student-line' : 'other-line'}`}
                    >
                      <Badge bg={line.speaker === 'student' ? 'primary' : 'secondary'}>
                        {line.speaker === 'student' ? 'You' : 'Partner'}
                      </Badge>
                      <span className="ms-2">{line.text}</span>
                      {line.speaker !== 'student' && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => speakText(line.text)}
                        >
                          <i className="fas fa-volume-up"></i>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {exercise.type === 'description' && (
                <div className="description-exercise">
                  <Row>
                    <Col md={6}>
                      <img 
                        src={exercise.imageUrl} 
                        alt="Description exercise" 
                        className="img-fluid rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <h6>Prompts to help you:</h6>
                      <ul>
                        {exercise.prompts.map((prompt, index) => (
                          <li key={index}>{prompt}</li>
                        ))}
                      </ul>
                    </Col>
                  </Row>
                </div>
              )}

              {exercise.type === 'tongue_twister' && (
                <div className="tongue-twister">
                  <Card className="text-center bg-light">
                    <Card.Body>
                      <h3 className="text-warning">{exercise.text}</h3>
                      <p className="text-muted">Repeat {exercise.repetitions} times</p>
                      <Button
                        variant="outline-warning"
                        onClick={() => speakText(exercise.text)}
                      >
                        <i className="fas fa-play me-2"></i>
                        Hear Example
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {exercise.type === 'storytelling' && (
                <div className="storytelling">
                  <Alert variant="success">
                    <strong>Story Challenge:</strong> Create a story using these words!
                  </Alert>
                  <div className="keywords mb-3">
                    {exercise.keywords.map((keyword, index) => (
                      <Badge key={index} bg="success" className="me-2 mb-2 p-2">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted">
                    Try to speak for at least 2 minutes and use all the keywords naturally in your story.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recording Panel */}
        <Col md={4}>
          <Card className="recording-panel">
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-record-vinyl me-2"></i>
                Recording Panel
              </h6>
            </Card.Header>
            <Card.Body className="text-center">
              {/* Recording Status */}
              <div className="recording-status mb-3">
                {isRecording ? (
                  <>
                    <div className="recording-indicator">
                      <div className="pulse-ring"></div>
                      <div className="pulse-dot"></div>
                    </div>
                    <p className="text-danger fw-bold">Recording... {formatTime(recordingTime)}</p>
                  </>
                ) : (
                  <div className="recording-ready">
                    <i className="fas fa-microphone fa-3x text-secondary mb-2"></i>
                    <p className="text-muted">Ready to record</p>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="recording-controls mb-3">
                {!isRecording ? (
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={startRecording}
                    className="record-btn"
                  >
                    <i className="fas fa-microphone me-2"></i>
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="dark"
                    size="lg"
                    onClick={stopRecording}
                    className="stop-btn"
                  >
                    <i className="fas fa-stop me-2"></i>
                    Stop Recording
                  </Button>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="transcript mb-3">
                  <h6>What you said:</h6>
                  <Card className="bg-light">
                    <Card.Body>
                      <small className="text-muted">{transcript}</small>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Score */}
              {pronunciationScore !== null && (
                <div className="pronunciation-score mb-3">
                  <h6>Pronunciation Score:</h6>
                  <div className={`score-circle score-${
                    pronunciationScore >= 80 ? 'excellent' : 
                    pronunciationScore >= 60 ? 'good' : 'needs-work'
                  }`}>
                    <span className="score-number">{pronunciationScore}</span>
                    <span className="score-percent">%</span>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <Alert variant={pronunciationScore >= 80 ? 'success' : pronunciationScore >= 60 ? 'warning' : 'info'}>
                  <small>{feedback}</small>
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Navigation */}
          <Card className="mt-3">
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
                <Button
                  variant="primary"
                  onClick={nextExercise}
                  disabled={currentExercise === speakingExercises.length - 1}
                >
                  Next Exercise
                  <i className="fas fa-chevron-right ms-2"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SpeakingPractice;
