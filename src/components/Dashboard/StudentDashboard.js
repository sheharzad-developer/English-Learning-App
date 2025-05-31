import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const StudentDashboard = () => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/student/progress/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProgressData(res.data);
      } catch (error) {
        console.error('Failed to fetch progress data', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">🎓 Student Dashboard</h2>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Card.Title>📈 Your Progress Over Time</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
