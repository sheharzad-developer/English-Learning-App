import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, InputGroup, Modal, Alert } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import progressService from '../../services/progressService';

const StudentPerformanceMonitor = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterLevel, setFilterLevel] = useState('');

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    // Generate demo student data with realistic performance metrics
    const localStats = progressService.getStatistics();
    const submissions = progressService.getSubmissions();
    
    const demoStudents = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        level: 'intermediate',
        enrollment_date: '2024-01-15',
        last_active: '2024-01-25',
        lessons_completed: Math.max(3, Math.floor(localStats.lessonsCompleted * 0.8)),
        quizzes_taken: Math.max(2, Math.floor(localStats.quizzesTaken * 0.9)),
        average_score: Math.max(75, localStats.averageScore - 5),
        total_points: Math.max(150, localStats.totalPoints * 0.7),
        current_streak: Math.max(2, localStats.currentStreak - 1),
        progress_percentage: Math.max(60, localStats.overallProgress - 10),
        status: 'active'
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        level: 'beginner',
        enrollment_date: '2024-01-20',
        last_active: '2024-01-24',
        lessons_completed: Math.max(1, Math.floor(localStats.lessonsCompleted * 0.5)),
        quizzes_taken: Math.max(1, Math.floor(localStats.quizzesTaken * 0.6)),
        average_score: Math.max(60, localStats.averageScore - 15),
        total_points: Math.max(80, localStats.totalPoints * 0.4),
        current_streak: Math.max(1, localStats.currentStreak - 2),
        progress_percentage: Math.max(35, localStats.overallProgress - 25),
        status: 'active'
      },
      {
        id: 3,
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
        level: 'advanced',
        enrollment_date: '2024-01-10',
        last_active: '2024-01-25',
        lessons_completed: Math.max(5, localStats.lessonsCompleted + 2),
        quizzes_taken: Math.max(4, localStats.quizzesTaken + 1),
        average_score: Math.max(85, localStats.averageScore + 5),
        total_points: Math.max(250, localStats.totalPoints * 1.2),
        current_streak: Math.max(5, localStats.currentStreak + 2),
        progress_percentage: Math.max(80, localStats.overallProgress + 10),
        status: 'active'
      },
      {
        id: 4,
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        level: 'intermediate',
        enrollment_date: '2024-01-18',
        last_active: '2024-01-22',
        lessons_completed: Math.max(2, Math.floor(localStats.lessonsCompleted * 0.7)),
        quizzes_taken: Math.max(1, Math.floor(localStats.quizzesTaken * 0.5)),
        average_score: Math.max(70, localStats.averageScore - 8),
        total_points: Math.max(120, localStats.totalPoints * 0.6),
        current_streak: 0,
        progress_percentage: Math.max(45, localStats.overallProgress - 15),
        status: 'inactive'
      },
      {
        id: 5,
        name: 'Eve Brown',
        email: 'eve.brown@email.com',
        level: 'beginner',
        enrollment_date: '2024-01-22',
        last_active: '2024-01-25',
        lessons_completed: Math.max(1, Math.floor(localStats.lessonsCompleted * 0.3)),
        quizzes_taken: Math.max(1, Math.floor(localStats.quizzesTaken * 0.4)),
        average_score: Math.max(65, localStats.averageScore - 12),
        total_points: Math.max(60, localStats.totalPoints * 0.3),
        current_streak: Math.max(1, localStats.currentStreak - 1),
        progress_percentage: Math.max(25, localStats.overallProgress - 20),
        status: 'active'
      }
    ];

    setStudents(demoStudents);
  };

  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student => filterLevel === '' || student.level === filterLevel)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress_percentage - a.progress_percentage;
        case 'score':
          return b.average_score - a.average_score;
        case 'activity':
          return new Date(b.last_active) - new Date(a.last_active);
        default:
          return 0;
      }
    });

  const getStatusBadge = (status) => {
    return status === 'active' ? 'success' : 'secondary';
  };

  const getLevelBadge = (level) => {
    const badges = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger'
    };
    return badges[level] || 'secondary';
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const getClassPerformanceData = () => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const data = levels.map(level => {
      const levelStudents = students.filter(s => s.level === level);
      return {
        level,
        count: levelStudents.length,
        avgScore: levelStudents.reduce((sum, s) => sum + s.average_score, 0) / levelStudents.length || 0
      };
    });

    return {
      labels: data.map(d => d.level.charAt(0).toUpperCase() + d.level.slice(1)),
      datasets: [{
        label: 'Average Score',
        data: data.map(d => d.avgScore),
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderColor: ['#1e7e34', '#e0a800', '#c82333'],
        borderWidth: 2
      }]
    };
  };

  const getProgressDistribution = () => {
    const ranges = [
      { label: '0-25%', min: 0, max: 25 },
      { label: '26-50%', min: 26, max: 50 },
      { label: '51-75%', min: 51, max: 75 },
      { label: '76-100%', min: 76, max: 100 }
    ];

    const data = ranges.map(range => 
      students.filter(s => s.progress_percentage >= range.min && s.progress_percentage <= range.max).length
    );

    return {
      labels: ranges.map(r => r.label),
      datasets: [{
        data: data,
        backgroundColor: ['#dc3545', '#ffc107', '#17a2b8', '#28a745'],
        borderWidth: 2
      }]
    };
  };

  return (
    <div className="student-performance-monitor">
      <div className="monitor-header mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h3><i className="fas fa-chart-bar me-2"></i>Student Performance Monitor</h3>
            <p className="text-muted mb-0">Track your students' progress and engagement</p>
          </Col>
          <Col md={6}>
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="score">Sort by Score</option>
                  <option value="activity">Sort by Activity</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <i className="fas fa-users stat-icon text-primary"></i>
              <h3>{students.length}</h3>
              <p className="text-muted">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <i className="fas fa-user-check stat-icon text-success"></i>
              <h3>{students.filter(s => s.status === 'active').length}</h3>
              <p className="text-muted">Active Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <i className="fas fa-trophy stat-icon text-warning"></i>
              <h3>{Math.round(students.reduce((sum, s) => sum + s.average_score, 0) / students.length) || 0}%</h3>
              <p className="text-muted">Class Average</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <i className="fas fa-chart-line stat-icon text-info"></i>
              <h3>{Math.round(students.reduce((sum, s) => sum + s.progress_percentage, 0) / students.length) || 0}%</h3>
              <p className="text-muted">Avg Progress</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* Performance Charts */}
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5><i className="fas fa-chart-bar me-2"></i>Class Performance by Level</h5>
            </Card.Header>
            <Card.Body>
              <Bar 
                data={getClassPerformanceData()} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5><i className="fas fa-chart-pie me-2"></i>Progress Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut 
                data={getProgressDistribution()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Card>
        <Card.Header>
          <h5><i className="fas fa-users me-2"></i>Student List ({filteredStudents.length})</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Student</th>
                <th>Level</th>
                <th>Progress</th>
                <th>Avg Score</th>
                <th>Lessons</th>
                <th>Quizzes</th>
                <th>Streak</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div>
                      <strong>{student.name}</strong>
                      <br />
                      <small className="text-muted">{student.email}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getLevelBadge(student.level)}>
                      {student.level}
                    </Badge>
                  </td>
                  <td>
                    <div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${student.progress_percentage}%` }}
                        ></div>
                      </div>
                      <small>{student.progress_percentage}%</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg={student.average_score >= 80 ? 'success' : student.average_score >= 60 ? 'warning' : 'danger'}>
                      {student.average_score}%
                    </Badge>
                  </td>
                  <td>{student.lessons_completed}</td>
                  <td>{student.quizzes_taken}</td>
                  <td>
                    {student.current_streak > 0 ? (
                      <Badge bg="warning">{student.current_streak}</Badge>
                    ) : (
                      <span className="text-muted">0</span>
                    )}
                  </td>
                  <td>{new Date(student.last_active).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={getStatusBadge(student.status)}>
                      {student.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => viewStudentDetails(student)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Student Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user me-2"></i>
            {selectedStudent?.name} - Performance Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <h6>Student Information</h6>
                      <p><strong>Email:</strong> {selectedStudent.email}</p>
                      <p><strong>Level:</strong> <Badge bg={getLevelBadge(selectedStudent.level)}>{selectedStudent.level}</Badge></p>
                      <p><strong>Enrolled:</strong> {new Date(selectedStudent.enrollment_date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <Badge bg={getStatusBadge(selectedStudent.status)}>{selectedStudent.status}</Badge></p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <h6>Performance Metrics</h6>
                      <p><strong>Average Score:</strong> {selectedStudent.average_score}%</p>
                      <p><strong>Total Points:</strong> {selectedStudent.total_points}</p>
                      <p><strong>Current Streak:</strong> {selectedStudent.current_streak} days</p>
                      <p><strong>Progress:</strong> {selectedStudent.progress_percentage}%</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6>Learning Activity</h6>
                      <p><strong>Lessons Completed:</strong> {selectedStudent.lessons_completed}</p>
                      <p><strong>Quizzes Taken:</strong> {selectedStudent.quizzes_taken}</p>
                      <p><strong>Last Active:</strong> {new Date(selectedStudent.last_active).toLocaleDateString()}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6>Recommendations</h6>
                      {selectedStudent.average_score < 60 && (
                        <Alert variant="warning">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Student needs additional support with current material.
                        </Alert>
                      )}
                      {selectedStudent.current_streak === 0 && (
                        <Alert variant="info">
                          <i className="fas fa-info-circle me-2"></i>
                          Encourage daily practice to build momentum.
                        </Alert>
                      )}
                      {selectedStudent.progress_percentage > 80 && (
                        <Alert variant="success">
                          <i className="fas fa-star me-2"></i>
                          Excellent progress! Consider advanced materials.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="fas fa-envelope me-2"></i>
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentPerformanceMonitor;
