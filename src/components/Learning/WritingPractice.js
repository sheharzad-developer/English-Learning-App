import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, ProgressBar, Badge, Row, Col, Modal, Form } from 'react-bootstrap';

const WritingPractice = ({ onProgressUpdate }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userText, setUserText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [writingTime, setWritingTime] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  const textareaRef = useRef(null);
  const timerRef = useRef(null);

  const writingExercises = [
    {
      id: 1,
      title: 'Describe Your Dream Vacation',
      type: 'descriptive',
      difficulty: 'beginner',
      category: 'personal',
      timeLimit: 20, // minutes
      minWords: 150,
      maxWords: 250,
      prompt: 'Write about your dream vacation destination. Where would you go and why? Describe the place, activities you would do, and what makes it special to you.',
      tips: [
        'Use descriptive adjectives',
        'Include specific details',
        'Organize your ideas clearly',
        'Use present or conditional tense'
      ],
      rubric: {
        content: 'Ideas and details about the vacation',
        organization: 'Clear structure and flow',
        vocabulary: 'Appropriate word choice',
        grammar: 'Correct sentence structure',
        mechanics: 'Spelling and punctuation'
      }
    },
    {
      id: 2,
      title: 'Technology in Education',
      type: 'argumentative',
      difficulty: 'intermediate',
      category: 'academic',
      timeLimit: 30,
      minWords: 250,
      maxWords: 400,
      prompt: 'Do you think technology has a positive or negative impact on education? Write an essay arguing your position. Use specific examples and reasons to support your argument.',
      tips: [
        'State your position clearly',
        'Provide supporting evidence',
        'Address counterarguments',
        'Use formal academic language'
      ],
      rubric: {
        thesis: 'Clear main argument',
        evidence: 'Supporting examples and reasons',
        organization: 'Logical structure',
        language: 'Academic vocabulary and tone',
        mechanics: 'Grammar and punctuation'
      }
    },
    {
      id: 3,
      title: 'Email to a Friend',
      type: 'informal',
      difficulty: 'beginner',
      category: 'communication',
      timeLimit: 15,
      minWords: 100,
      maxWords: 200,
      prompt: 'Write an email to a friend inviting them to your birthday party. Include details about when, where, and what you plan to do. Make it sound friendly and exciting.',
      tips: [
        'Use informal, friendly language',
        'Include all necessary details',
        'Use appropriate email format',
        'Show enthusiasm'
      ],
      rubric: {
        format: 'Proper email structure',
        content: 'Complete information',
        tone: 'Appropriate informal style',
        clarity: 'Clear communication',
        mechanics: 'Basic grammar and spelling'
      }
    },
    {
      id: 4,
      title: 'Climate Change Solutions',
      type: 'expository',
      difficulty: 'advanced',
      category: 'academic',
      timeLimit: 45,
      minWords: 400,
      maxWords: 600,
      prompt: 'Explain three practical solutions to address climate change. Discuss how each solution works, its benefits, and potential challenges in implementation.',
      tips: [
        'Use clear topic sentences',
        'Provide detailed explanations',
        'Use transition words',
        'Maintain objective tone'
      ],
      rubric: {
        organization: 'Clear structure with introduction, body, conclusion',
        explanation: 'Thorough and accurate information',
        examples: 'Specific and relevant details',
        vocabulary: 'Precise academic language',
        mechanics: 'Correct grammar and syntax'
      }
    },
    {
      id: 5,
      title: 'Job Application Cover Letter',
      type: 'formal',
      difficulty: 'intermediate',
      category: 'professional',
      timeLimit: 25,
      minWords: 200,
      maxWords: 350,
      prompt: 'Write a cover letter for a job you would like to have. Explain why you are interested in the position and what qualifications make you a good candidate.',
      tips: [
        'Use formal business language',
        'Follow proper letter format',
        'Highlight relevant skills',
        'Show enthusiasm for the role'
      ],
      rubric: {
        format: 'Professional letter format',
        content: 'Relevant qualifications and interest',
        tone: 'Professional and confident',
        persuasion: 'Convincing argument for hiring',
        mechanics: 'Correct business writing conventions'
      }
    }
  ];

  const exercise = writingExercises[currentExercise];

  useEffect(() => {
    if (isWriting && exercise.timeLimit) {
      setTimeRemaining(exercise.timeLimit * 60); // Convert to seconds
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsWriting(false);
            analyzeWriting();
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
  }, [isWriting]);

  useEffect(() => {
    const words = userText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(userText.length);

    if (autoSave && userText.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`writing_draft_${exercise.id}`, userText);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [userText, autoSave, exercise.id]);

  useEffect(() => {
    // Load saved draft
    const savedDraft = localStorage.getItem(`writing_draft_${exercise.id}`);
    if (savedDraft) {
      setUserText(savedDraft);
    } else {
      setUserText('');
    }
    setShowFeedback(false);
    setFeedback(null);
    setScore(0);
    setWritingTime(0);
    setIsWriting(false);
    setTimeRemaining(null);
  }, [currentExercise]);

  const startWriting = () => {
    setIsWriting(true);
    setWritingTime(0);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const stopWriting = () => {
    setIsWriting(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    analyzeWriting();
  };

  const analyzeWriting = () => {
    if (!userText.trim()) {
      setFeedback({
        overall: 'Please write something before submitting.',
        score: 0,
        details: {}
      });
      setShowFeedback(true);
      return;
    }

    // Simulated writing analysis (in a real app, this would use NLP APIs)
    const analysis = performWritingAnalysis(userText, exercise);
    setFeedback(analysis);
    setScore(analysis.score);
    setShowFeedback(true);

    if (onProgressUpdate) {
      onProgressUpdate({
        completed: currentExercise + 1,
        progress: Math.round(((currentExercise + 1) / writingExercises.length) * 100)
      });
    }
  };

  const performWritingAnalysis = (text, exercise) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Basic metrics
    const wordCount = words.length;
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
    const avgSentencesPerParagraph = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0;

    // Scoring rubric (simplified)
    let scores = {};
    let totalScore = 0;

    // Content/Ideas (25%)
    let contentScore = 80; // Base score
    if (wordCount < exercise.minWords) {
      contentScore -= Math.min(30, (exercise.minWords - wordCount) / exercise.minWords * 100);
    }
    if (wordCount > exercise.maxWords) {
      contentScore -= Math.min(20, (wordCount - exercise.maxWords) / exercise.maxWords * 100);
    }
    scores.content = Math.max(0, Math.round(contentScore));

    // Organization (20%)
    let organizationScore = 75;
    if (paragraphs.length < 2 && wordCount > 150) {
      organizationScore -= 20; // Penalize single paragraph for longer texts
    }
    if (avgSentencesPerParagraph < 2) {
      organizationScore -= 10;
    }
    scores.organization = Math.max(0, Math.round(organizationScore));

    // Vocabulary/Language (25%)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyDiversity = uniqueWords.size / words.length;
    let vocabularyScore = Math.min(100, vocabularyDiversity * 200); // Scale to 0-100
    
    // Check for complex words (3+ syllables)
    const complexWords = words.filter(word => estimateSyllables(word) >= 3);
    if (complexWords.length / words.length > 0.1) {
      vocabularyScore += 10; // Bonus for vocabulary complexity
    }
    scores.vocabulary = Math.max(0, Math.round(vocabularyScore));

    // Grammar/Mechanics (30%)
    let grammarScore = 85; // Start with good score
    
    // Basic grammar checks
    const commonErrors = checkCommonErrors(text);
    grammarScore -= commonErrors.length * 5;
    
    // Sentence length variety
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    if (avgSentenceLength < 8 || avgSentenceLength > 25) {
      grammarScore -= 10;
    }
    
    scores.grammar = Math.max(0, Math.round(grammarScore));

    // Calculate overall score
    totalScore = Math.round(
      (scores.content * 0.25) + 
      (scores.organization * 0.20) + 
      (scores.vocabulary * 0.25) + 
      (scores.grammar * 0.30)
    );

    // Generate feedback
    const feedback = generateFeedback(scores, exercise, {
      wordCount,
      avgWordsPerSentence,
      paragraphs: paragraphs.length,
      vocabularyDiversity,
      commonErrors
    });

    return {
      score: totalScore,
      scores,
      overall: feedback.overall,
      details: feedback.details,
      suggestions: feedback.suggestions,
      strengths: feedback.strengths
    };
  };

  const estimateSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const checkCommonErrors = (text) => {
    const errors = [];
    
    // Check for common issues
    if (text.includes(' i ') || text.startsWith('i ')) {
      errors.push('Capitalize "I"');
    }
    if (text.includes('  ')) {
      errors.push('Double spaces found');
    }
    if (!/[.!?]$/.test(text.trim())) {
      errors.push('Missing ending punctuation');
    }
    if (text.includes('your welcome')) {
      errors.push('Use "you\'re" not "your" for "you are"');
    }
    if (text.includes('its a') || text.includes('its been')) {
      errors.push('Use "it\'s" (contraction) not "its" (possessive)');
    }
    
    return errors;
  };

  const generateFeedback = (scores, exercise, metrics) => {
    const strengths = [];
    const suggestions = [];
    let overall = '';

    // Determine strengths
    if (scores.content >= 80) strengths.push('Strong content and ideas');
    if (scores.organization >= 80) strengths.push('Well-organized structure');
    if (scores.vocabulary >= 80) strengths.push('Good vocabulary usage');
    if (scores.grammar >= 80) strengths.push('Correct grammar and mechanics');

    // Generate suggestions
    if (scores.content < 70) {
      suggestions.push('Develop your ideas more fully with specific examples and details');
    }
    if (scores.organization < 70) {
      suggestions.push('Improve organization with clear paragraphs and transitions');
    }
    if (scores.vocabulary < 70) {
      suggestions.push('Use more varied and precise vocabulary');
    }
    if (scores.grammar < 70) {
      suggestions.push('Review grammar rules and proofread carefully');
    }

    if (metrics.wordCount < exercise.minWords) {
      suggestions.push(`Add more content - you need at least ${exercise.minWords} words`);
    }
    if (metrics.wordCount > exercise.maxWords) {
      suggestions.push(`Reduce length - maximum is ${exercise.maxWords} words`);
    }

    // Overall feedback
    const totalScore = (scores.content + scores.organization + scores.vocabulary + scores.grammar) / 4;
    if (totalScore >= 90) {
      overall = 'Excellent work! Your writing demonstrates strong skills across all areas.';
    } else if (totalScore >= 80) {
      overall = 'Good writing! You show solid skills with room for some improvement.';
    } else if (totalScore >= 70) {
      overall = 'Satisfactory work. Focus on the suggested areas for improvement.';
    } else if (totalScore >= 60) {
      overall = 'Your writing shows potential. Work on the key areas highlighted below.';
    } else {
      overall = 'Keep practicing! Focus on basic writing skills and organization.';
    }

    return {
      overall,
      details: {
        wordCount: metrics.wordCount,
        paragraphs: metrics.paragraphs,
        avgWordsPerSentence: Math.round(metrics.avgWordsPerSentence),
        vocabularyDiversity: Math.round(metrics.vocabularyDiversity * 100)
      },
      strengths,
      suggestions
    };
  };

  const nextExercise = () => {
    if (currentExercise < writingExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const clearText = () => {
    setUserText('');
    localStorage.removeItem(`writing_draft_${exercise.id}`);
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

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="writing-practice">
      {/* Instructions Modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-pen me-2"></i>
            Writing Practice Instructions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>How to complete writing exercises:</h5>
          <ol>
            <li><strong>Read the prompt carefully</strong> - understand what you need to write</li>
            <li><strong>Plan your writing</strong> - think about structure and main points</li>
            <li><strong>Start writing</strong> - click "Start Writing" to begin the timer</li>
            <li><strong>Follow the word limit</strong> - stay within the minimum and maximum words</li>
            <li><strong>Submit for feedback</strong> - get automated analysis of your writing</li>
          </ol>
          
          <h5 className="mt-4">Writing tips:</h5>
          <ul>
            <li>Use clear topic sentences for each paragraph</li>
            <li>Vary your sentence structure and length</li>
            <li>Use transition words to connect ideas</li>
            <li>Proofread for grammar and spelling errors</li>
            <li>Stay focused on the prompt topic</li>
          </ul>

          <h5 className="mt-4">Scoring rubric:</h5>
          <ul>
            <li><strong>Content (25%):</strong> Ideas, examples, and relevance</li>
            <li><strong>Organization (20%):</strong> Structure and flow</li>
            <li><strong>Vocabulary (25%):</strong> Word choice and variety</li>
            <li><strong>Grammar (30%):</strong> Mechanics and sentence structure</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Start Writing!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="writing-header-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h3>
                    <i className="fas fa-pen me-2 text-warning"></i>
                    Writing Practice
                  </h3>
                  <p className="text-muted mb-0">
                    Improve your writing skills with automated feedback
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
                <span>{currentExercise + 1} of {writingExercises.length}</span>
              </div>
              <ProgressBar 
                now={((currentExercise + 1) / writingExercises.length) * 100} 
                style={{ height: '10px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col md={8}>
          {/* Writing Prompt */}
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
                      {exercise.type}
                    </Badge>
                    <Badge bg="info" className="ms-1">
                      {exercise.category}
                    </Badge>
                  </h5>
                </Col>
                <Col xs="auto">
                  {exercise.timeLimit && (
                    <Badge bg="warning" className="fs-6">
                      <i className="fas fa-clock me-1"></i>
                      {exercise.timeLimit} min limit
                    </Badge>
                  )}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div className="writing-prompt mb-3">
                <h6>Writing Prompt:</h6>
                <p className="prompt-text">{exercise.prompt}</p>
              </div>

              <div className="requirements mb-3">
                <h6>Requirements:</h6>
                <ul>
                  <li>Minimum words: <strong>{exercise.minWords}</strong></li>
                  <li>Maximum words: <strong>{exercise.maxWords}</strong></li>
                  {exercise.timeLimit && <li>Time limit: <strong>{exercise.timeLimit} minutes</strong></li>}
                </ul>
              </div>

              <div className="writing-tips">
                <h6>Tips:</h6>
                <ul>
                  {exercise.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>

          {/* Writing Area */}
          <Card className="mb-4">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h6 className="mb-0">
                    <i className="fas fa-edit me-2"></i>
                    Your Writing
                  </h6>
                </Col>
                <Col xs="auto">
                  <div className="writing-controls">
                    {!isWriting && !showFeedback && (
                      <Button
                        variant="success"
                        onClick={startWriting}
                        className="me-2"
                      >
                        <i className="fas fa-play me-2"></i>
                        Start Writing
                      </Button>
                    )}
                    
                    {isWriting && (
                      <Button
                        variant="danger"
                        onClick={stopWriting}
                        className="me-2"
                      >
                        <i className="fas fa-stop me-2"></i>
                        Submit for Feedback
                      </Button>
                    )}
                    
                    <Button
                      variant="outline-secondary"
                      onClick={clearText}
                      size="sm"
                    >
                      <i className="fas fa-trash me-2"></i>
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {/* Timer */}
              {isWriting && timeRemaining !== null && (
                <Alert variant={timeRemaining < 300 ? 'warning' : 'info'} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fas fa-clock me-2"></i>
                      Time Remaining: {formatTime(timeRemaining)}
                    </span>
                    <ProgressBar 
                      now={(timeRemaining / (exercise.timeLimit * 60)) * 100}
                      style={{ width: '200px', height: '8px' }}
                      variant={timeRemaining < 300 ? 'warning' : 'info'}
                    />
                  </div>
                </Alert>
              )}

              {/* Writing Textarea */}
              <Form.Control
                ref={textareaRef}
                as="textarea"
                rows={15}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Start writing here..."
                disabled={showFeedback}
                className="writing-textarea"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '1.6',
                  resize: 'vertical'
                }}
              />

              {/* Word Count */}
              <div className="writing-stats mt-3">
                <Row>
                  <Col md={6}>
                    <div className="stat-item">
                      <strong>Words:</strong> 
                      <span className={`ms-2 ${
                        wordCount < exercise.minWords ? 'text-danger' :
                        wordCount > exercise.maxWords ? 'text-warning' :
                        'text-success'
                      }`}>
                        {wordCount}
                      </span>
                      <small className="text-muted ms-1">
                        ({exercise.minWords}-{exercise.maxWords})
                      </small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="stat-item">
                      <strong>Characters:</strong> 
                      <span className="ms-2">{characterCount}</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Auto-save indicator */}
              {autoSave && userText.length > 0 && (
                <small className="text-muted">
                  <i className="fas fa-save me-1"></i>
                  Auto-saved
                </small>
              )}
            </Card.Body>
          </Card>

          {/* Feedback */}
          {showFeedback && feedback && (
            <Card className="feedback-card">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-comment-alt me-2"></i>
                  Writing Feedback
                </h6>
              </Card.Header>
              <Card.Body>
                {/* Overall Score */}
                <div className="overall-score mb-4">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h5 className="mb-1">Overall Score</h5>
                      <p className="text-muted mb-0">{feedback.overall}</p>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className={`score-circle score-${getScoreColor(feedback.score)}`}>
                        <span className="score-number">{feedback.score}</span>
                        <span className="score-percent">%</span>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Detailed Scores */}
                <div className="detailed-scores mb-4">
                  <h6>Detailed Breakdown:</h6>
                  <Row>
                    {Object.entries(feedback.scores).map(([category, score]) => (
                      <Col md={6} key={category} className="mb-3">
                        <div className="score-item">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-capitalize">{category}</span>
                            <span className={`fw-bold text-${getScoreColor(score)}`}>
                              {score}%
                            </span>
                          </div>
                          <ProgressBar 
                            now={score} 
                            variant={getScoreColor(score)}
                            style={{ height: '8px' }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Writing Stats */}
                <div className="writing-analysis mb-4">
                  <h6>Writing Analysis:</h6>
                  <Row>
                    <Col md={3}>
                      <div className="analysis-item">
                        <strong>Word Count:</strong><br />
                        <span className="text-primary">{feedback.details.wordCount}</span>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="analysis-item">
                        <strong>Paragraphs:</strong><br />
                        <span className="text-info">{feedback.details.paragraphs}</span>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="analysis-item">
                        <strong>Avg Words/Sentence:</strong><br />
                        <span className="text-warning">{feedback.details.avgWordsPerSentence}</span>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="analysis-item">
                        <strong>Vocabulary Diversity:</strong><br />
                        <span className="text-success">{feedback.details.vocabularyDiversity}%</span>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Strengths */}
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div className="strengths mb-3">
                    <h6 className="text-success">
                      <i className="fas fa-check-circle me-2"></i>
                      Strengths:
                    </h6>
                    <ul className="list-unstyled">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-success">
                          <i className="fas fa-plus-circle me-2"></i>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {feedback.suggestions && feedback.suggestions.length > 0 && (
                  <div className="suggestions">
                    <h6 className="text-warning">
                      <i className="fas fa-lightbulb me-2"></i>
                      Suggestions for Improvement:
                    </h6>
                    <ul className="list-unstyled">
                      {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-warning">
                          <i className="fas fa-arrow-right me-2"></i>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col md={4}>
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
                  Previous Exercise
                </Button>
                
                {showFeedback && (
                  <Button
                    variant="outline-warning"
                    onClick={() => {
                      setShowFeedback(false);
                      setFeedback(null);
                      setIsWriting(false);
                      setTimeRemaining(null);
                    }}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Writing
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={nextExercise}
                  disabled={currentExercise === writingExercises.length - 1}
                >
                  Next Exercise
                  <i className="fas fa-chevron-right ms-2"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Rubric */}
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-list-check me-2"></i>
                Scoring Rubric
              </h6>
            </Card.Header>
            <Card.Body>
              {Object.entries(exercise.rubric).map(([criteria, description]) => (
                <div key={criteria} className="rubric-item mb-2">
                  <h6 className="text-capitalize">{criteria}:</h6>
                  <small className="text-muted">{description}</small>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Exercise List */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">All Exercises</h6>
            </Card.Header>
            <Card.Body>
              {writingExercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className={`exercise-item p-2 rounded mb-2 ${index === currentExercise ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurrentExercise(index)}
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

export default WritingPractice;
