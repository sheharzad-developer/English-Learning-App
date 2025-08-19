import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const TeacherDashboard = () => {
  const stats = {
    lessons: 14,
    students: 42,
    submissions: 89,
  };

  return (
    <Container fluid className="mt-5">
      <h2 className="mb-4">👩‍🏫 Teacher Dashboard</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <Card.Title>Lessons Created</Card.Title>
              <h3>{stats.lessons}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <Card.Title>Students Assigned</Card.Title>
              <h3>{stats.students}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <Card.Title>Submissions Reviewed</Card.Title>
              <h3>{stats.submissions}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>✍️ Manage Lessons</Card.Title>
              <p>Create or update engaging lesson content.</p>
              <Button variant="primary" href="/teacher/lessons">
                Go to Lesson Manager
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>📥 Review Submissions</Card.Title>
              <p>Give feedback to students on exercises and writing tasks.</p>
              <Button variant="success" href="/teacher/reviews">
                Go to Reviews
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
