import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import './LessonDetail.css';

const LessonDetail = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [notes, setNotes] = useState([]);
    const [userFeedback, setUserFeedback] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [timeStarted, setTimeStarted] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isNotePublic, setIsNotePublic] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        loadLesson();
        loadProgress();
        loadNotes();
        loadUserFeedback();
        startTimer();
        return () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        };
    }, [id]);

    const loadLesson = async () => {
        try {
            const data = await lessonService.getLesson(id);
            setLesson(data);
            setIsFavorite(data.favorite);
        } catch (error) {
            console.error('Error loading lesson:', error);
        }
    };

    const loadProgress = async () => {
        try {
            const data = await lessonService.getLessonProgress(id);
            setProgress(data);
            if (data && data.completed_exercises) {
                setCurrentExercise(data.completed_exercises.length);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const loadNotes = async () => {
        try {
            const data = await lessonService.getLessonNotes(id);
            setNotes(data);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const loadUserFeedback = async () => {
        try {
            const data = await lessonService.getLessonFeedback(id);
            if (data.length > 0) {
                setUserFeedback(data[0]);
                setRating(data[0].rating);
                setComment(data[0].comment);
            }
        } catch (error) {
            console.error('Error loading feedback:', error);
        }
    };

    const startTimer = () => {
        setTimeStarted(Date.now());
        const timer = setInterval(() => {
            setTimeElapsed((Date.now() - timeStarted) / 1000);
        }, 1000);
        return () => clearInterval(timer);
    };

    const handleSubmit = async () => {
        if (!lesson || !lesson.exercises[currentExercise]) return;

        const exercise = lesson.exercises[currentExercise];
        const timeTaken = timeElapsed;
        const result = await lessonService.submitAnswer(
            id,
            exercise.id,
            userAnswer,
            timeTaken,
            hintsUsed
        );

        setFeedback(result);
        if (result.is_correct) {
            setTimeout(() => {
                if (currentExercise < lesson.exercises.length - 1) {
                    setCurrentExercise(currentExercise + 1);
                    setUserAnswer('');
                    setFeedback(null);
                    setShowHint(false);
                    setHintsUsed(0);
                    setTimeStarted(Date.now());
                    setTimeElapsed(0);
                }
            }, 2000);
        }
    };

    const handleHint = () => {
        if (!lesson || !lesson.exercises[currentExercise]) return;
        const exercise = lesson.exercises[currentExercise];
        if (exercise.hints && exercise.hints.length > hintsUsed) {
            setShowHint(true);
            setHintsUsed(hintsUsed + 1);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                const text = await lessonService.recognizeSpeech(audioBlob);
                setUserAnswer(text);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setAudioChunks(chunks);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            const note = await lessonService.addNote(id, newNote, isNotePublic);
            setNotes([...notes, note]);
            setNewNote('');
            setIsNotePublic(false);
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleUpdateNote = async (noteId) => {
        if (!editingNote) return;
        try {
            const updatedNote = await lessonService.updateNote(
                noteId,
                editingNote.content,
                editingNote.is_public
            );
            setNotes(notes.map(note => 
                note.id === noteId ? updatedNote : note
            ));
            setEditingNote(null);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await lessonService.deleteNote(noteId);
            setNotes(notes.filter(note => note.id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            const feedback = await lessonService.addFeedback(id, rating, comment);
            setUserFeedback(feedback);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleToggleFavorite = async () => {
        try {
            const result = await lessonService.toggleFavorite(id);
            setIsFavorite(result.favorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (!lesson) {
        // Show a beautiful demo lesson if nothing is loaded from backend
        const demoLesson = {
            title: "Demo: English Mastery Lesson",
            exercises: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "What is the synonym of 'happy'?",
                    options: ["Sad", "Joyful", "Angry", "Tired"],
                    correct_answer: "Joyful",
                    hints: ["It's a positive emotion.", "It starts with 'J'."]
                },
                {
                    id: 2,
                    type: "fill-in-blank",
                    question: "She ___ to the store yesterday.",
                    correct_answer: "went",
                    hints: ["Past tense of 'go'."]
                },
                {
                    id: 3,
                    type: "speaking",
                    question: "Say the sentence: 'English is fun to learn!'",
                    correct_answer: "English is fun to learn!",
                    hints: ["Speak clearly and confidently."]
                },
                {
                    id: 4,
                    type: "listening",
                    question: "Listen and type what you hear: 'Practice makes perfect.'",
                    correct_answer: "Practice makes perfect.",
                    hints: ["It's a common proverb."]
                }
            ]
        };
        // Use the same UI as for a real lesson
        return (
            <div className="lesson-detail demo-lesson">
                <div className="lesson-header">
                    <h1>{demoLesson.title} <span role="img" aria-label="star">🌟</span></h1>
                    <span className="badge bg-success ms-2">Demo</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(currentExercise / demoLesson.exercises.length) * 100}%` }}
                    />
                    <span className="progress-text">
                        Exercise {currentExercise + 1} of {demoLesson.exercises.length}
                    </span>
                </div>
                <div className="exercise-card">
                    <h2>{demoLesson.exercises[currentExercise].question}</h2>
                    <div className="timer">Time: {lessonService.formatTime(timeElapsed)}</div>
                    {demoLesson.exercises[currentExercise].type === 'multiple-choice' && (
                        <div className="options">
                            {demoLesson.exercises[currentExercise].options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option ${userAnswer === option ? 'selected' : ''}`}
                                    onClick={() => setUserAnswer(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                    {demoLesson.exercises[currentExercise].type === 'fill-in-blank' && (
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer..."
                        />
                    )}
                    {demoLesson.exercises[currentExercise].type === 'speaking' && (
                        <div className="speaking-exercise">
                            <button
                                className={`record-button ${isRecording ? 'recording' : ''}`}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                            {userAnswer && (
                                <div className="transcription">
                                    Your answer: {userAnswer}
                                </div>
                            )}
                        </div>
                    )}
                    {demoLesson.exercises[currentExercise].type === 'listening' && (
                        <div className="listening-exercise">
                            <button
                                className={`record-button ${isRecording ? 'recording' : ''}`}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                            {userAnswer && (
                                <div className="transcription">
                                    Your answer: {userAnswer}
                                </div>
                            )}
                        </div>
                    )}
                    {showHint && demoLesson.exercises[currentExercise].hints && (
                        <div className="hint">
                            Hint: {demoLesson.exercises[currentExercise].hints[hintsUsed - 1]}
                        </div>
                    )}
                    <div className="exercise-actions">
                        <button
                            className="hint-button"
                            onClick={handleHint}
                            disabled={!demoLesson.exercises[currentExercise].hints || hintsUsed >= demoLesson.exercises[currentExercise].hints.length}
                        >
                            Show Hint ({hintsUsed}/{demoLesson.exercises[currentExercise].hints?.length || 0})
                        </button>
                        <button
                            className="submit-button"
                            onClick={() => {
                                // Demo feedback logic
                                const ex = demoLesson.exercises[currentExercise];
                                let isCorrect = false;
                                if (ex.type === 'multiple-choice' || ex.type === 'fill-in-blank') {
                                    isCorrect = userAnswer.trim().toLowerCase() === ex.correct_answer.trim().toLowerCase();
                                } else if (ex.type === 'speaking' || ex.type === 'listening') {
                                    isCorrect = userAnswer.trim().length > 0;
                                }
                                setFeedback({ is_correct: isCorrect, explanation: isCorrect ? 'Great job!' : 'Try again!' });
                                if (isCorrect) {
                                    setTimeout(() => {
                                        if (currentExercise < demoLesson.exercises.length - 1) {
                                            setCurrentExercise(currentExercise + 1);
                                            setUserAnswer('');
                                            setFeedback(null);
                                            setShowHint(false);
                                            setHintsUsed(0);
                                            setTimeStarted(Date.now());
                                            setTimeElapsed(0);
                                        }
                                    }, 1500);
                                }
                            }}
                            disabled={!userAnswer}
                        >
                            Submit
                        </button>
                    </div>
                    {feedback && (
                        <div className={`feedback ${feedback.is_correct ? 'correct' : 'incorrect'}`}>
                            {feedback.is_correct ? '✓' : '✗'} {feedback.explanation}
                        </div>
                    )}
                </div>
                <div className="notes-section">
                    <h3>Notes</h3>
                    <div className="add-note">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a note..."
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={isNotePublic}
                                onChange={(e) => setIsNotePublic(e.target.checked)}
                            />
                            Make public
                        </label>
                        <button onClick={() => {
                            if (!newNote.trim()) return;
                            setNotes([...notes, { id: Date.now(), content: newNote, is_public: isNotePublic, created_at: new Date().toISOString() }]);
                            setNewNote('');
                            setIsNotePublic(false);
                        }}>Add Note</button>
                    </div>
                    <div className="notes-list">
                        {notes.map(note => (
                            <div key={note.id} className="note">
                                <p>{note.content}</p>
                                <div className="note-meta">
                                    <span className="note-date">{new Date(note.created_at).toLocaleDateString()}</span>
                                    {note.is_public && <span className="note-public">Public</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="feedback-section">
                    <h3>Feedback</h3>
                    <div className="add-feedback">
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    className={`star ${rating >= star ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Leave your feedback..."
                        />
                        <button onClick={() => {
                            setUserFeedback({ rating, comment });
                            setComment('');
                            setRating(0);
                        }}>
                            Submit Feedback
                        </button>
                    </div>
                    {userFeedback && (
                        <div className="user-feedback">
                            <p>Your rating: {userFeedback.rating}/5</p>
                            <p>Your comment: {userFeedback.comment}</p>
                        </div>
                    )}
                </div>
                <div className="demo-footer text-center mt-4">
                    <h4 className="fw-bold text-primary mb-2">
                        <i className="bi bi-stars me-2"></i>
                        "This is a demo lesson. Connect to the backend for real content!"
                    </h4>
                </div>
            </div>
        );
    }

    const exercise = lesson.exercises[currentExercise];

    return (
        <div className="lesson-detail">
            <div className="lesson-header">
                <h1>{lesson.title}</h1>
                <button
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                >
                    {isFavorite ? '★' : '☆'}
                </button>
            </div>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${(currentExercise / lesson.exercises.length) * 100}%`
                    }}
                />
                <span className="progress-text">
                    Exercise {currentExercise + 1} of {lesson.exercises.length}
                </span>
            </div>

            <div className="exercise-card">
                <h2>{exercise.question}</h2>
                <div className="timer">
                    Time: {lessonService.formatTime(timeElapsed)}
                </div>

                {exercise.type === 'multiple-choice' && (
                    <div className="options">
                        {exercise.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option ${userAnswer === option ? 'selected' : ''}`}
                                onClick={() => setUserAnswer(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}

                {exercise.type === 'fill-in-blank' && (
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer..."
                    />
                )}

                {exercise.type === 'matching' && (
                    <div className="matching-exercise">
                        {/* Implement matching exercise UI */}
                    </div>
                )}

                {exercise.type === 'listening' && (
                    <div className="listening-exercise">
                        <button
                            className={`record-button ${isRecording ? 'recording' : ''}`}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                        {userAnswer && (
                            <div className="transcription">
                                Your answer: {userAnswer}
                            </div>
                        )}
                    </div>
                )}

                {exercise.type === 'speaking' && (
                    <div className="speaking-exercise">
                        <button
                            className={`record-button ${isRecording ? 'recording' : ''}`}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                        {userAnswer && (
                            <div className="transcription">
                                Your answer: {userAnswer}
                            </div>
                        )}
                    </div>
                )}

                {showHint && exercise.hints && (
                    <div className="hint">
                        Hint: {exercise.hints[hintsUsed - 1]}
                    </div>
                )}

                <div className="exercise-actions">
                    <button
                        className="hint-button"
                        onClick={handleHint}
                        disabled={!exercise.hints || hintsUsed >= exercise.hints.length}
                    >
                        Show Hint ({hintsUsed}/{exercise.hints?.length || 0})
                    </button>
                    <button
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={!userAnswer}
                    >
                        Submit
                    </button>
                </div>

                {feedback && (
                    <div className={`feedback ${feedback.is_correct ? 'correct' : 'incorrect'}`}>
                        {feedback.is_correct ? '✓' : '✗'} {feedback.explanation}
                    </div>
                )}
            </div>

            <div className="notes-section">
                <h3>Notes</h3>
                <div className="add-note">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={isNotePublic}
                            onChange={(e) => setIsNotePublic(e.target.checked)}
                        />
                        Make public
                    </label>
                    <button onClick={handleAddNote}>Add Note</button>
                </div>

                <div className="notes-list">
                    {notes.map(note => (
                        <div key={note.id} className="note">
                            {editingNote?.id === note.id ? (
                                <>
                                    <textarea
                                        value={editingNote.content}
                                        onChange={(e) => setEditingNote({
                                            ...editingNote,
                                            content: e.target.value
                                        })}
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={editingNote.is_public}
                                            onChange={(e) => setEditingNote({
                                                ...editingNote,
                                                is_public: e.target.checked
                                            })}
                                        />
                                        Make public
                                    </label>
                                    <button onClick={() => handleUpdateNote(note.id)}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditingNote(null)}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>{note.content}</p>
                                    <div className="note-meta">
                                        <span className="note-date">
                                            {new Date(note.created_at).toLocaleDateString()}
                                        </span>
                                        {note.is_public && (
                                            <span className="note-public">Public</span>
                                        )}
                                    </div>
                                    <div className="note-actions">
                                        <button onClick={() => setEditingNote(note)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteNote(note.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="feedback-section">
                <h3>Feedback</h3>
                {userFeedback ? (
                    <div className="user-feedback">
                        <p>Your rating: {userFeedback.rating}/5</p>
                        <p>Your comment: {userFeedback.comment}</p>
                    </div>
                ) : (
                    <div className="add-feedback">
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    className={`star ${rating >= star ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Leave your feedback..."
                        />
                        <button onClick={handleSubmitFeedback}>
                            Submit Feedback
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonDetail;
