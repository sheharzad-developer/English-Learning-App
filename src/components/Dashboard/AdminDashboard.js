import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { FaUsers, FaBook, FaClipboardCheck, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    lessons: 0,
    submissions: 0,
  });

  useEffect(() => {
    // TODO: Replace with your actual JWT token retrieval logic
    const token = localStorage.getItem('accessToken'); // Example: retrieve from local storage

    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Optionally set stats to 0 or display an error message
      }
    };

    fetchStats();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <Container fluid className="mt-5">
      <h2 className="mb-4 fw-bold">👨‍💼 Admin Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <FaUsers size={36} className="mb-2" />
              <Card.Title>Total Users</Card.Title>
              <h2>{stats.users}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <FaBook size={36} className="mb-2" />
              <Card.Title>Total Lessons</Card.Title>
              <h2>{stats.lessons}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-warning text-dark">
            <Card.Body>
              <FaClipboardCheck size={36} className="mb-2" style={{ color: 'white' }} />
              <Card.Title>Submissions</Card.Title>
              <h2 style={{ color: 'white' }}>{stats.submissions}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Actions */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow border-0 hover-shadow">
            <Card.Body>
              <Card.Title>👥 Manage Users</Card.Title>
              <p>View, promote/demote or remove platform users.</p>
              <Button variant="outline-primary" onClick={() => navigate('/admin/users')}>
                Go to User Management <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow border-0 hover-shadow">
            <Card.Body>
              <Card.Title>📚 Manage Lessons</Card.Title>
              <p>Create, update or organize lessons and quizzes.</p>
              <Button variant="outline-success" href="/admin/lessons">
                Go to Lesson Manager <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3">🕓 Recent Activity</Card.Title>
              <Table responsive hover bordered>
                <thead className="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sheharzad</td>
                    <td>Submitted Lesson 3</td>
                    <td><Badge bg="success">Success</Badge></td>
                    <td>10 mins ago</td>
                  </tr>
                  <tr>
                    <td>Ayesha</td>
                    <td>Registered</td>
                    <td><Badge bg="info">New</Badge></td>
                    <td>20 mins ago</td>
                  </tr>
                  <tr>
                    <td>Ali</td>
                    <td>Completed Quiz 2</td>
                    <td><Badge bg="warning">Pending</Badge></td>
                    <td>30 mins ago</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
