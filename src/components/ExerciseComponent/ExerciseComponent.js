import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Badge, Modal } from 'react-bootstrap';
import lessonService from '../../services/lessonService';
import './ExerciseComponent.css';

const ExerciseComponent = ({ exercise, onComplete, isCompleted }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [timeStarted, setTimeStarted] = useState(null);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [speechResult, setSpeechResult] = useState('');
    const [showSpeechModal, setShowSpeechModal] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);

    useEffect(() => {
        setTimeStarted(Date.now());
        // Reset state when exercise changes
        setUserAnswer('');
        setSelectedOptions([]);
        setIsSubmitted(false);
        setFeedback(null);
        setIsCorrect(false);
        setScore(0);
        setHintsUsed(0);
        setShowHint(false);
        setAudioBlob(null);
        setSpeechResult('');
    }, [exercise.id]);

    const handleSubmit = async () => {
        if (isSubmitted || isCompleted) return;

        const timeTaken = timeStarted ? Math.round((Date.now() - timeStarted) / 1000) : null;
        let answer = userAnswer;
        
        // Handle different answer formats
        if (exercise.type === 'multiple_choice' && selectedOptions.length > 0) {
            answer = selectedOptions.join(',');
        } else if (exercise.type === 'speaking' && speechResult) {
            answer = speechResult;
        }

        try {
            const submission = await lessonService.submitAnswer(
                exercise.id,
                answer,
                timeTaken,
                hintsUsed
            );

            setIsSubmitted(true);
            setIsCorrect(submission.is_correct);
            setScore(submission.score || 0);
            setFeedback(submission.feedback || getDefaultFeedback(submission.is_correct));

            // Call onComplete callback
            if (onComplete) {
                onComplete(exercise.id, submission.score, submission.is_correct);
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
            setFeedback('Failed to submit answer. Please try again.');
        }
    };

    const getDefaultFeedback = (correct) => {
        return correct 
            ? 'Excellent! You got it right!' 
            : 'Not quite right. Keep practicing!';
    };

    const handleOptionSelect = (optionIndex) => {
        if (isSubmitted || isCompleted) return;

        if (exercise.question_data?.multiple_correct) {
            setSelectedOptions(prev => 
                prev.includes(optionIndex)
                    ? prev.filter(i => i !== optionIndex)
                    : [...prev, optionIndex]
            );
        } else {
            setSelectedOptions([optionIndex]);
        }
    };

    const handleHint = () => {
        setHintsUsed(prev => prev + 1);
        setShowHint(true);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
            alert('Failed to access microphone. Please check your permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processSpeech = async () => {
        if (!audioBlob) return;

        try {
            const result = await lessonService.recognizeSpeech(audioBlob);
            setSpeechResult(result.text || result.transcript || 'Speech processed');
            setShowSpeechModal(true);
        } catch (error) {
            console.error('Speech recognition failed:', error);
            setSpeechResult('Speech recognition unavailable');
            setShowSpeechModal(true);
        }
    };

    const renderMultipleChoice = () => {
        const options = exercise.question_data?.options || [];
        
        return (
            <div className="multiple-choice-options">
                {options.map((option, index) => (
                    <div 
                        key={index}
                        className={`option-item ${
                            selectedOptions.includes(index) ? 'selected' : ''
                        } ${
                            isSubmitted ? (isCorrect && selectedOptions.includes(index) ? 'correct' : 
                                         selectedOptions.includes(index) ? 'incorrect' : '') : ''
                        }`}
                        onClick={() => handleOptionSelect(index)}
                    >
                        <div className="option-indicator">
                            {exercise.question_data?.multiple_correct ? 
                                <Form.Check 
                                    type="checkbox" 
                                    checked={selectedOptions.includes(index)}
                                    readOnly
                                /> :
                                <Form.Check 
                                    type="radio" 
                                    checked={selectedOptions.includes(index)}
                                    readOnly
                                />
                            }
                        </div>
                        <div className="option-text">{option}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderFillInBlank = () => {
        return (
            <div className="fill-in-blank">
                <Form.Group>
                    <Form.Label>Your Answer:</Form.Label>
                    <Form.Control
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={isSubmitted || isCompleted}
                        placeholder="Type your answer here..."
                        className={isSubmitted ? (isCorrect ? 'correct' : 'incorrect') : ''}
                    />
                </Form.Group>
            </div>
        );
    };

    const renderSpeaking = () => {
        return (
            <div className="speaking-exercise">
                <div className="speaking-prompt mb-3">
                    <h6>Speaking Exercise</h6>
                    <p>Read the following text aloud or respond to the prompt:</p>
                    <div className="prompt-text">
                        {exercise.question_data?.prompt || exercise.content}
                    </div>
                </div>
                
                <div className="recording-controls text-center">
                    {!audioBlob ? (
                        <Button
                            variant={isRecording ? 'danger' : 'primary'}
                            size="lg"
                            onClick={isRecording ? stopRecording : startRecording}
                            className="recording-btn"
                        >
                            {isRecording ? (
                                <>
                                    <span className="recording-indicator">🔴</span>
                                    Stop Recording
                                </>
                            ) : (
                                <>
                                    🎤 Start Recording
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="audio-controls">
                            <audio ref={audioRef} controls src={URL.createObjectURL(audioBlob)} className="mb-3" />
                            <div>
                                <Button variant="success" onClick={processSpeech} className="me-2">
                                    Process Speech
                                </Button>
                                <Button variant="outline-secondary" onClick={() => setAudioBlob(null)}>
                                    Record Again
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderListening = () => {
        return (
            <div className="listening-exercise">
                <div className="audio-section mb-3">
                    <h6>Listening Exercise</h6>
                    <p>Listen to the audio and answer the question:</p>
                    {exercise.audio_file && (
                        <audio controls className="w-100 mb-3">
                            <source src={exercise.audio_file} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </div>
                
                {exercise.type === 'listening_multiple_choice' ? renderMultipleChoice() : renderFillInBlank()}
            </div>
        );
    };

    const renderWriting = () => {
        return (
            <div className="writing-exercise">
                <Form.Group>
                    <Form.Label>Writing Exercise:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={isSubmitted || isCompleted}
                        placeholder="Write your response here..."
                        className={isSubmitted ? (isCorrect ? 'correct' : 'needs-review') : ''}
                    />
                    <Form.Text className="text-muted">
                        Minimum {exercise.question_data?.min_words || 50} words
                    </Form.Text>
                </Form.Group>
            </div>
        );
    };

    const renderExerciseContent = () => {
        switch (exercise.type) {
            case 'multiple_choice':
                return renderMultipleChoice();
            case 'fill_in_blank':
                return renderFillInBlank();
            case 'speaking':
                return renderSpeaking();
            case 'listening':
            case 'listening_multiple_choice':
                return renderListening();
            case 'writing':
                return renderWriting();
            default:
                return renderFillInBlank();
        }
    };

    const canSubmit = () => {
        if (isSubmitted || isCompleted) return false;
        
        switch (exercise.type) {
            case 'multiple_choice':
                return selectedOptions.length > 0;
            case 'speaking':
                return speechResult.length > 0;
            case 'writing':
                return userAnswer.trim().length >= (exercise.question_data?.min_words || 10);
            default:
                return userAnswer.trim().length > 0;
        }
    };

    return (
        <div className="exercise-component">
            <div className="exercise-header mb-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h4 className="exercise-title">{exercise.title}</h4>
                        <Badge bg="info" className="me-2">{exercise.type.replace('_', ' ')}</Badge>
                        <Badge bg="secondary">{exercise.points} points</Badge>
                    </div>
                    {exercise.hint && !showHint && !isSubmitted && (
                        <Button variant="outline-info" size="sm" onClick={handleHint}>
                            💡 Hint ({hintsUsed} used)
                        </Button>
                    )}
                </div>
                
                {showHint && exercise.hint && (
                    <Alert variant="info" className="mt-3">
                        <strong>Hint:</strong> {exercise.hint}
                    </Alert>
                )}
            </div>

            <div className="exercise-content mb-4">
                <div className="question-text mb-3">
                    <p>{exercise.content}</p>
                </div>
                
                {renderExerciseContent()}
            </div>

            {feedback && (
                <Alert variant={isCorrect ? 'success' : 'warning'} className="mb-3">
                    <div className="d-flex align-items-center">
                        <span className="me-2">{isCorrect ? '✅' : '❌'}</span>
                        <div>
                            <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                            <div>{feedback}</div>
                            {score > 0 && <small>Score: {score} points</small>}
                        </div>
                    </div>
                </Alert>
            )}

            <div className="exercise-actions">
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className="submit-btn"
                >
                    {isSubmitted ? 'Submitted' : 'Submit Answer'}
                </Button>
                
                {exercise.explanation && isSubmitted && (
                    <div className="explanation mt-3">
                        <Alert variant="light">
                            <strong>Explanation:</strong> {exercise.explanation}
                        </Alert>
                    </div>
                )}
            </div>

            {/* Speech Recognition Modal */}
            <Modal show={showSpeechModal} onHide={() => setShowSpeechModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Speech Recognition Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Recognized Text:</strong></p>
                    <div className="speech-result">
                        {speechResult}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSpeechModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setShowSpeechModal(false);
                        handleSubmit();
                    }}>
                        Use This Answer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ExerciseComponent;