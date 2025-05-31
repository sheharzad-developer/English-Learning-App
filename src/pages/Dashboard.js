import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  // Static XP chart data – Replace with backend later
  const xpChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'XP Earned',
        data: [100, 200, 150, 300, 250, 400, 350],
        fill: false,
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd',
        tension: 0.3,
      },
    ],
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">🎓 Welcome to Your Dashboard</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <Card.Title>Total XP</Card.Title>
              <h3>1350</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <Card.Title>Badges Earned</Card.Title>
              <h3>🏅 4</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <Card.Title>Level</Card.Title>
              <h3>🔰 Beginner</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>📈 Weekly XP Progress</Card.Title>
              <Line data={xpChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>🏆 Leaderboard</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>XP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Ayesha</td>
                    <td>1500</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Sheharzad</td>
                    <td>1350</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Ali</td>
                    <td>1100</td>
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

export default Dashboard;
