import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Table, Modal, Tabs, Tab, ProgressBar } from 'react-bootstrap';

const EssayGrader = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [essays, setEssays] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      assignmentTitle: 'My Future Career',
      submittedAt: '2024-01-25',
      status: 'pending',
      wordCount: 287,
      content: 'In the future, I want to become a software engineer because I love technology and solving problems...',
      grade: null,
      feedback: ''
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      assignmentTitle: 'My Future Career',
      submittedAt: '2024-01-24',
      status: 'graded',
      wordCount: 245,
      content: 'My dream job is to work as a teacher because I enjoy helping people learn new things...',
      grade: 85,
      feedback: 'Good structure and clear ideas. Work on expanding your vocabulary.'
    }
  ]);

  const [selectedEssay, setSelectedEssay] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingForm, setGradingForm] = useState({
    grade: '',
    feedback: '',
    rubricScores: {
      grammar: 0,
      vocabulary: 0,
      structure: 0,
      content: 0
    }
  });

  const pendingEssays = essays.filter(e => e.status === 'pending');
  const gradedEssays = essays.filter(e => e.status === 'graded');

  const openGradingModal = (essay) => {
    setSelectedEssay(essay);
    setGradingForm({
      grade: essay.grade || '',
      feedback: essay.feedback || '',
      rubricScores: {
        grammar: 0,
        vocabulary: 0,
        structure: 0,
        content: 0
      }
    });
    setShowGradingModal(true);
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    setEssays(prev => prev.map(essay => 
      essay.id === selectedEssay.id 
        ? { 
            ...essay, 
            grade: parseInt(gradingForm.grade),
            feedback: gradingForm.feedback,
            status: 'graded'
          }
        : essay
    ));
    setShowGradingModal(false);
  };

  const calculateRubricTotal = () => {
    const scores = Object.values(gradingForm.rubricScores);
    return scores.reduce((sum, score) => sum + score, 0);
  };

  return (
    <div className="essay-grader">
      <div className="grader-header mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h3><i className="fas fa-edit me-2"></i>Essay Grader</h3>
            <p className="text-muted mb-0">Review and grade student essay submissions</p>
          </Col>
          <Col md={6} className="text-end">
            <Badge bg="warning" className="me-2">
              {pendingEssays.length} Pending Review
            </Badge>
            <Badge bg="success">
              {gradedEssays.length} Graded
            </Badge>
          </Col>
        </Row>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab}>
        <Tab eventKey="pending" title={`Pending (${pendingEssays.length})`}>
          <Card className="mt-3">
            <Card.Body>
              {pendingEssays.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-check-circle me-2"></i>
                  All essays have been graded! Great work.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Assignment</th>
                      <th>Submitted</th>
                      <th>Word Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEssays.map((essay) => (
                      <tr key={essay.id}>
                        <td><strong>{essay.studentName}</strong></td>
                        <td>{essay.assignmentTitle}</td>
                        <td>{new Date(essay.submittedAt).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={essay.wordCount >= 250 ? 'success' : 'warning'}>
                            {essay.wordCount} words
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openGradingModal(essay)}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Grade
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="graded" title={`Graded (${gradedEssays.length})`}>
          <Card className="mt-3">
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assignment</th>
                    <th>Grade</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gradedEssays.map((essay) => (
                    <tr key={essay.id}>
                      <td><strong>{essay.studentName}</strong></td>
                      <td>{essay.assignmentTitle}</td>
                      <td>
                        <Badge bg={essay.grade >= 80 ? 'success' : essay.grade >= 60 ? 'warning' : 'danger'}>
                          {essay.grade}%
                        </Badge>
                      </td>
                      <td>{new Date(essay.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openGradingModal(essay)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Grading Modal */}
      <Modal show={showGradingModal} onHide={() => setShowGradingModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>
            Grading: {selectedEssay?.assignmentTitle} - {selectedEssay?.studentName}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitGrade}>
          <Modal.Body>
            <Row>
              {/* Essay Content */}
              <Col md={8}>
                <Card className="h-100">
                  <Card.Header>
                    <h6>Student Submission</h6>
                    <small className="text-muted">
                      Submitted: {selectedEssay && new Date(selectedEssay.submittedAt).toLocaleDateString()} | 
                      Word Count: {selectedEssay?.wordCount}
                    </small>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <p className="essay-content">
                      {selectedEssay?.content}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              {/* Grading Panel */}
              <Col md={4}>
                <Card className="h-100">
                  <Card.Header>
                    <h6>Grading Rubric</h6>
                  </Card.Header>
                  <Card.Body>
                    {/* Rubric Categories */}
                    <div className="mb-3">
                      <label className="form-label">Grammar & Mechanics</label>
                      <Form.Range
                        min="0"
                        max="25"
                        value={gradingForm.rubricScores.grammar}
                        onChange={(e) => setGradingForm(prev => ({
                          ...prev,
                          rubricScores: { ...prev.rubricScores, grammar: parseInt(e.target.value) }
                        }))}
                      />
                      <small className="text-muted">{gradingForm.rubricScores.grammar}/25</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Vocabulary & Language Use</label>
                      <Form.Range
                        min="0"
                        max="25"
                        value={gradingForm.rubricScores.vocabulary}
                        onChange={(e) => setGradingForm(prev => ({
                          ...prev,
                          rubricScores: { ...prev.rubricScores, vocabulary: parseInt(e.target.value) }
                        }))}
                      />
                      <small className="text-muted">{gradingForm.rubricScores.vocabulary}/25</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Structure & Organization</label>
                      <Form.Range
                        min="0"
                        max="25"
                        value={gradingForm.rubricScores.structure}
                        onChange={(e) => setGradingForm(prev => ({
                          ...prev,
                          rubricScores: { ...prev.rubricScores, structure: parseInt(e.target.value) }
                        }))}
                      />
                      <small className="text-muted">{gradingForm.rubricScores.structure}/25</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Content & Ideas</label>
                      <Form.Range
                        min="0"
                        max="25"
                        value={gradingForm.rubricScores.content}
                        onChange={(e) => setGradingForm(prev => ({
                          ...prev,
                          rubricScores: { ...prev.rubricScores, content: parseInt(e.target.value) }
                        }))}
                      />
                      <small className="text-muted">{gradingForm.rubricScores.content}/25</small>
                    </div>

                    <hr />

                    <div className="mb-3">
                      <label className="form-label">Total Score</label>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={calculateRubricTotal()} 
                          max={100}
                          className="flex-grow-1 me-2"
                          variant={calculateRubricTotal() >= 80 ? 'success' : calculateRubricTotal() >= 60 ? 'warning' : 'danger'}
                        />
                        <Badge bg={calculateRubricTotal() >= 80 ? 'success' : calculateRubricTotal() >= 60 ? 'warning' : 'danger'}>
                          {calculateRubricTotal()}/100
                        </Badge>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Final Grade (%)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="100"
                        value={gradingForm.grade}
                        onChange={(e) => setGradingForm(prev => ({...prev, grade: e.target.value}))}
                        placeholder="Enter final grade"
                        required
                      />
                      <small className="text-muted">
                        Suggested: {calculateRubricTotal()}%
                      </small>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Feedback</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={gradingForm.feedback}
                        onChange={(e) => setGradingForm(prev => ({...prev, feedback: e.target.value}))}
                        placeholder="Provide constructive feedback for the student..."
                        required
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowGradingModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              <i className="fas fa-check me-2"></i>
              Submit Grade
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EssayGrader;
