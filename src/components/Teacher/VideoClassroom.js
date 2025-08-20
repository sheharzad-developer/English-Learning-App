import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Alert, Badge, 
  Modal, ListGroup, InputGroup, Dropdown, ProgressBar 
} from 'react-bootstrap';
import './VideoClassroom.css';

const VideoClassroom = () => {
  const [isClassActive, setIsClassActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [classSettings, setClassSettings] = useState({
    title: '',
    description: '',
    duration: 60,
    maxParticipants: 50,
    recordClass: false,
    allowChat: true,
    allowRaiseHand: true
  });
  const [participants, setParticipants] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [classDuration, setClassDuration] = useState(0);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Demo participants data
  useEffect(() => {
    setParticipants([
      { id: 1, name: 'Alice Johnson', role: 'student', isHandRaised: false, isMuted: true, hasVideo: true },
      { id: 2, name: 'Bob Smith', role: 'student', isHandRaised: true, isMuted: true, hasVideo: false },
      { id: 3, name: 'Carol Davis', role: 'student', isHandRaised: false, isMuted: false, hasVideo: true },
      { id: 4, name: 'David Wilson', role: 'student', isHandRaised: false, isMuted: true, hasVideo: true },
      { id: 5, name: 'Eve Brown', role: 'student', isHandRaised: false, isMuted: true, hasVideo: false }
    ]);

    // Demo chat messages
    setChatMessages([
      { id: 1, sender: 'Alice Johnson', message: 'Good morning, teacher!', time: '9:00 AM', type: 'student' },
      { id: 2, sender: 'Teacher', message: 'Good morning everyone! Welcome to today\'s lesson.', time: '9:01 AM', type: 'teacher' },
      { id: 3, sender: 'Bob Smith', message: 'Can you hear us clearly?', time: '9:02 AM', type: 'student' },
      { id: 4, sender: 'Teacher', message: 'Yes, I can hear everyone. Let\'s begin with today\'s topic.', time: '9:03 AM', type: 'teacher' }
    ]);
  }, []);

  // Class timer
  useEffect(() => {
    let interval;
    if (isClassActive) {
      interval = setInterval(() => {
        setClassDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClassActive]);

  const startClass = async () => {
    try {
      // Request camera and microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsClassActive(true);
      setIsCameraOn(true);
      setIsMicOn(true);
      setClassDuration(0);
      
      // Add system message
      const startMessage = {
        id: Date.now(),
        sender: 'System',
        message: 'Class has started! 🎉',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'system'
      };
      setChatMessages(prev => [...prev, startMessage]);
      
    } catch (error) {
      console.error('Error starting class:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const endClass = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsClassActive(false);
    setIsCameraOn(false);
    setIsMicOn(false);
    setIsScreenSharing(false);
    
    // Add end message
    const endMessage = {
      id: Date.now(),
      sender: 'System',
      message: 'Class has ended. Thank you for participating! 👋',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: 'system'
    };
    setChatMessages(prev => [...prev, endMessage]);
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const shareScreen = async () => {
    try {
      if (!isScreenSharing) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setIsScreenSharing(true);
        // In a real app, you'd replace the video track with screen share
      } else {
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'Teacher',
        message: newMessage,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'teacher'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const muteParticipant = (participantId) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
    ));
  };

  const handleRaiseHand = (participantId) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isHandRaised: false } : p
    ));
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scheduledClasses = [
    {
      id: 1,
      title: 'Advanced Grammar Session',
      time: '10:00 AM',
      date: 'Today',
      duration: '1 hour',
      students: 15,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Vocabulary Building Workshop',
      time: '2:00 PM',
      date: 'Today',
      duration: '45 mins',
      students: 12,
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Essay Writing Techniques',
      time: '11:00 AM',
      date: 'Tomorrow',
      duration: '1.5 hours',
      students: 8,
      status: 'scheduled'
    }
  ];

  return (
    <div className="video-classroom">
      {!isClassActive ? (
        // Pre-class Setup
        <Container>
          <Row>
            <Col md={8}>
              <Card className="class-setup-card">
                <Card.Header>
                  <h4><i className="fas fa-video me-2"></i>Start New Class</h4>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Class Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={classSettings.title}
                            onChange={(e) => setClassSettings(prev => ({...prev, title: e.target.value}))}
                            placeholder="Enter class title"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Duration (minutes)</Form.Label>
                          <Form.Control
                            type="number"
                            value={classSettings.duration}
                            onChange={(e) => setClassSettings(prev => ({...prev, duration: parseInt(e.target.value)}))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={classSettings.description}
                        onChange={(e) => setClassSettings(prev => ({...prev, description: e.target.value}))}
                        placeholder="Describe what this class will cover"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          label="Record this class"
                          checked={classSettings.recordClass}
                          onChange={(e) => setClassSettings(prev => ({...prev, recordClass: e.target.checked}))}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Allow student chat"
                          checked={classSettings.allowChat}
                          onChange={(e) => setClassSettings(prev => ({...prev, allowChat: e.target.checked}))}
                          className="mb-2"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          label="Allow raise hand"
                          checked={classSettings.allowRaiseHand}
                          onChange={(e) => setClassSettings(prev => ({...prev, allowRaiseHand: e.target.checked}))}
                          className="mb-2"
                        />
                      </Col>
                    </Row>
                  </Form>

                  <div className="text-center mt-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={startClass}
                      className="start-class-btn"
                    >
                      <i className="fas fa-play me-2"></i>
                      Start Live Class
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="scheduled-classes-card">
                <Card.Header>
                  <h5><i className="fas fa-calendar me-2"></i>Scheduled Classes</h5>
                </Card.Header>
                <Card.Body>
                  {scheduledClasses.map((classItem) => (
                    <div key={classItem.id} className="scheduled-class-item mb-3">
                      <h6 className="class-title">{classItem.title}</h6>
                      <p className="class-details">
                        <i className="fas fa-clock me-1"></i>
                        {classItem.time} • {classItem.duration}
                      </p>
                      <p className="class-details">
                        <i className="fas fa-users me-1"></i>
                        {classItem.students} students registered
                      </p>
                      <Badge bg={classItem.status === 'upcoming' ? 'warning' : 'info'}>
                        {classItem.status}
                      </Badge>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        // Active Class Interface
        <div className="active-classroom">
          {/* Class Header */}
          <div className="class-header">
            <Container fluid>
              <Row className="align-items-center">
                <Col md={6}>
                  <h4 className="class-title">
                    <i className="fas fa-circle text-danger me-2 pulse"></i>
                    {classSettings.title || 'Live Class'}
                  </h4>
                  <div className="class-info">
                    <span className="class-duration">Duration: {formatTime(classDuration)}</span>
                    <span className="class-participants ms-3">
                      <i className="fas fa-users me-1"></i>
                      {participants.length} participants
                    </span>
                  </div>
                </Col>
                <Col md={6} className="text-end">
                  <div className="class-controls">
                    <Button
                      variant={isCameraOn ? "outline-success" : "outline-danger"}
                      onClick={toggleCamera}
                      className="me-2"
                    >
                      <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
                    </Button>
                    <Button
                      variant={isMicOn ? "outline-success" : "outline-danger"}
                      onClick={toggleMic}
                      className="me-2"
                    >
                      <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                    </Button>
                    <Button
                      variant={isScreenSharing ? "success" : "outline-primary"}
                      onClick={shareScreen}
                      className="me-2"
                    >
                      <i className="fas fa-desktop"></i>
                    </Button>
                    <Button variant="danger" onClick={endClass}>
                      <i className="fas fa-stop me-1"></i>
                      End Class
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          {/* Main Class Area */}
          <Container fluid className="class-content">
            <Row>
              {/* Video Area */}
              <Col md={showChat || showParticipants ? 8 : 12}>
                <div className="video-area">
                  <div className="main-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="teacher-video"
                    />
                    <div className="video-overlay">
                      <span className="video-label">You (Teacher)</span>
                    </div>
                  </div>
                  
                  {/* Student Videos */}
                  <div className="student-videos">
                    {participants.filter(p => p.hasVideo).slice(0, 6).map((participant) => (
                      <div key={participant.id} className="student-video">
                        <div className="video-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="video-overlay">
                          <span className="video-label">{participant.name}</span>
                          {participant.isMuted && <i className="fas fa-microphone-slash text-danger ms-1"></i>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              {/* Sidebar */}
              <Col md={4}>
                <div className="class-sidebar">
                  {/* Participants Panel */}
                  {showParticipants && (
                    <Card className="participants-card mb-3">
                      <Card.Header>
                        <h6 className="mb-0">
                          <i className="fas fa-users me-2"></i>
                          Participants ({participants.length})
                        </h6>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <ListGroup variant="flush">
                          {participants.map((participant) => (
                            <ListGroup.Item key={participant.id} className="participant-item">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="participant-info">
                                  <span className="participant-name">{participant.name}</span>
                                  {participant.isHandRaised && (
                                    <Button
                                      variant="outline-warning"
                                      size="sm"
                                      className="ms-2"
                                      onClick={() => handleRaiseHand(participant.id)}
                                    >
                                      <i className="fas fa-hand-paper"></i>
                                    </Button>
                                  )}
                                </div>
                                <div className="participant-controls">
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => muteParticipant(participant.id)}
                                  >
                                    <i className={`fas ${participant.isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                                  </Button>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Chat Panel */}
                  {showChat && (
                    <Card className="chat-card">
                      <Card.Header>
                        <h6 className="mb-0">
                          <i className="fas fa-comments me-2"></i>
                          Class Chat
                        </h6>
                      </Card.Header>
                      <Card.Body className="chat-body">
                        <div className="chat-messages">
                          {chatMessages.map((message) => (
                            <div key={message.id} className={`chat-message ${message.type}`}>
                              <div className="message-header">
                                <span className="sender">{message.sender}</span>
                                <span className="time">{message.time}</span>
                              </div>
                              <div className="message-content">{message.message}</div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <Form onSubmit={sendMessage}>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type a message..."
                            />
                            <Button type="submit" variant="primary">
                              <i className="fas fa-paper-plane"></i>
                            </Button>
                          </InputGroup>
                        </Form>
                      </Card.Footer>
                    </Card>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default VideoClassroom;
