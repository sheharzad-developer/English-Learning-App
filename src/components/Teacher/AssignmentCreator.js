import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Table, Modal, Tabs, Tab } from 'react-bootstrap';

const AssignmentCreator = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Essay: My Future Career',
      type: 'essay',
      description: 'Write a 300-word essay about your future career goals',
      dueDate: '2024-02-01',
      status: 'published',
      submissions: 12,
      maxPoints: 100
    },
    {
      id: 2,
      title: 'Grammar Exercise: Conditionals',
      type: 'exercise',
      description: 'Complete the conditional sentences worksheet',
      dueDate: '2024-01-30',
      status: 'draft',
      submissions: 0,
      maxPoints: 50
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    type: 'essay',
    description: '',
    instructions: '',
    dueDate: '',
    maxPoints: 100,
    allowLateSubmissions: true,
    status: 'draft'
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const assignment = {
      id: Date.now(),
      ...newAssignment,
      submissions: 0
    };
    setAssignments(prev => [...prev, assignment]);
    setShowCreateModal(false);
    setNewAssignment({
      title: '',
      type: 'essay',
      description: '',
      instructions: '',
      dueDate: '',
      maxPoints: 100,
      allowLateSubmissions: true,
      status: 'draft'
    });
  };

  return (
    <div className="assignment-creator">
      <div className="creator-header mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h3><i className="fas fa-tasks me-2"></i>Assignment Creator</h3>
            <p className="text-muted mb-0">Create and manage assignments for your students</p>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <i className="fas fa-plus me-2"></i>Create Assignment
            </Button>
          </Col>
        </Row>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab}>
        <Tab eventKey="assignments" title="All Assignments">
          <Card className="mt-3">
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Type</th>
                    <th>Due Date</th>
                    <th>Submissions</th>
                    <th>Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>
                        <strong>{assignment.title}</strong>
                        <br />
                        <small className="text-muted">{assignment.description}</small>
                      </td>
                      <td>
                        <Badge bg={assignment.type === 'essay' ? 'primary' : 'info'}>
                          {assignment.type}
                        </Badge>
                      </td>
                      <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                      <td>{assignment.submissions}</td>
                      <td>{assignment.maxPoints}</td>
                      <td>
                        <Badge bg={assignment.status === 'published' ? 'success' : 'secondary'}>
                          {assignment.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="outline-info" size="sm">
                          <i className="fas fa-eye"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="templates" title="Templates">
          <Card className="mt-3">
            <Card.Body>
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                Assignment templates feature coming soon! You'll be able to create reusable templates for common assignment types.
              </Alert>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Create Assignment Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Assignment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateAssignment}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Assignment Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({...prev, title: e.target.value}))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment(prev => ({...prev, type: e.target.value}))}
                  >
                    <option value="essay">Essay</option>
                    <option value="exercise">Exercise</option>
                    <option value="project">Project</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newAssignment.description}
                onChange={(e) => setNewAssignment(prev => ({...prev, description: e.target.value}))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={newAssignment.instructions}
                onChange={(e) => setNewAssignment(prev => ({...prev, instructions: e.target.value}))}
                placeholder="Provide detailed instructions for students..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({...prev, dueDate: e.target.value}))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment(prev => ({...prev, maxPoints: parseInt(e.target.value)}))}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              label="Allow late submissions"
              checked={newAssignment.allowLateSubmissions}
              onChange={(e) => setNewAssignment(prev => ({...prev, allowLateSubmissions: e.target.checked}))}
              className="mb-3"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Assignment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AssignmentCreator;