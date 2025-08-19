import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, ProgressBar, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './StudentProgressMonitor.css';

const StudentProgressMonitor = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    filterBy: 'all'
  });
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    averageProgress: 0,
    activeStudents: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/teacher/students/progress/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStudents(response.data.students || []);
      setAnalytics(response.data.analytics || {});
    } catch (error) {
      console.error('Failed to fetch student progress:', error);
      // Set fallback demo data
      const demoStudents = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          avatar: null,
          overall_progress: 85,
          lessons_completed: 12,
          total_lessons: 15,
          quizzes_completed: 8,
          total_quizzes: 10,
          assignments_submitted: 5,
          total_assignments: 6,
          current_streak: 7,
          last_activity: '2024-01-15T10:30:00Z',
          performance_trend: 'improving',
          average_score: 88,
          time_spent: 45, // hours
          status: 'active'
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          avatar: null,
          overall_progress: 65,
          lessons_completed: 8,
          total_lessons: 15,
          quizzes_completed: 6,
          total_quizzes: 10,
          assignments_submitted: 3,
          total_assignments: 6,
          current_streak: 3,
          last_activity: '2024-01-14T15:45:00Z',
          performance_trend: 'stable',
          average_score: 75,
          time_spent: 28,
          status: 'active'
        },
        {
          id: 3,
          name: 'Carol Davis',
          email: 'carol@example.com',
          avatar: null,
          overall_progress: 45,
          lessons_completed: 5,
          total_lessons: 15,
          quizzes_completed: 3,
          total_quizzes: 10,
          assignments_submitted: 2,
          total_assignments: 6,
          current_streak: 1,
          last_activity: '2024-01-12T09:20:00Z',
          performance_trend: 'declining',
          average_score: 62,
          time_spent: 15,
          status: 'at_risk'
        },
        {
          id: 4,
          name: 'David Wilson',
          email: 'david@example.com',
          avatar: null,
          overall_progress: 92,
          lessons_completed: 14,
          total_lessons: 15,
          quizzes_completed: 10,
          total_quizzes: 10,
          assignments_submitted: 6,
          total_assignments: 6,
          current_streak: 12,
          last_activity: '2024-01-15T14:20:00Z',
          performance_trend: 'improving',
          average_score: 95,
          time_spent: 52,
          status: 'excellent'
        }
      ];
      
      setStudents(demoStudents);
      setAnalytics({
        totalStudents: demoStudents.length,
        averageProgress: Math.round(demoStudents.reduce((sum, s) => sum + s.overall_progress, 0) / demoStudents.length),
        activeStudents: demoStudents.filter(s => s.status === 'active' || s.status === 'excellent').length,
        completionRate: Math.round(demoStudents.reduce((sum, s) => sum + (s.lessons_completed / s.total_lessons * 100), 0) / demoStudents.length)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFilteredAndSortedStudents = () => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           student.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesFilter = filters.filterBy === 'all' || student.status === filters.filterBy;
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.overall_progress - a.overall_progress;
        case 'activity':
          return new Date(b.last_activity) - new Date(a.last_activity);
        case 'score':
          return b.average_score - a.average_score;
        default:
          return 0;
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'active': return 'primary';
      case 'at_risk': return 'warning';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return 'bi-trending-up text-success';
      case 'declining': return 'bi-trending-down text-danger';
      case 'stable': return 'bi-dash text-warning';
      default: return 'bi-dash text-muted';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastActivity = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const sendMessage = (studentId) => {
    // Placeholder for messaging functionality
    alert(`Message feature will be implemented for student ID: ${studentId}`);
  };

  const exportProgress = () => {
    // Placeholder for export functionality
    alert('Export functionality will be implemented');
  };

  return (
    <Container className="progress-monitor-container py-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="monitor-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="monitor-title">
              <i className="bi bi-graph-up me-3"></i>
              Student Progress Monitor
            </h1>
            <p className="monitor-subtitle">
              Track and analyze your students' learning progress
            </p>
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-primary"
              onClick={exportProgress}
              className="export-btn"
            >
              <i className="bi bi-download me-2"></i>
              Export Report
            </Button>
          </Col>
        </Row>
      </div>

      {/* Analytics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="analytics-card analytics-total">
            <Card.Body className="text-center">
              <div className="analytics-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3 className="analytics-number">{analytics.totalStudents}</h3>
              <p className="analytics-label">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="analytics-card analytics-progress">
            <Card.Body className="text-center">
              <div className="analytics-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <h3 className="analytics-number">{analytics.averageProgress}%</h3>
              <p className="analytics-label">Average Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="analytics-card analytics-active">
            <Card.Body className="text-center">
              <div className="analytics-icon">
                <i className="bi bi-person-check-fill"></i>
              </div>
              <h3 className="analytics-number">{analytics.activeStudents}</h3>
              <p className="analytics-label">Active Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="analytics-card analytics-completion">
            <Card.Body className="text-center">
              <div className="analytics-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h3 className="analytics-number">{analytics.completionRate}%</h3>
              <p className="analytics-label">Completion Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="filters-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search Students</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or email..."
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="name">Name</option>
                  <option value="progress">Progress</option>
                  <option value="activity">Last Activity</option>
                  <option value="score">Average Score</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter By Status</Form.Label>
                <Form.Select
                  name="filterBy"
                  value={filters.filterBy}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Students</option>
                  <option value="excellent">Excellent</option>
                  <option value="active">Active</option>
                  <option value="at_risk">At Risk</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Students Table */}
      <Card className="students-table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Progress</th>
                  <th>Lessons</th>
                  <th>Quizzes</th>
                  <th>Assignments</th>
                  <th>Avg Score</th>
                  <th>Streak</th>
                  <th>Last Activity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : getFilteredAndSortedStudents().length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-muted">
                      No students found matching your criteria
                    </td>
                  </tr>
                ) : (
                  getFilteredAndSortedStudents().map(student => (
                    <tr key={student.id} className="student-row">
                      <td>
                        <div className="student-info">
                          <div className="student-avatar">
                            {student.avatar ? (
                              <img src={student.avatar} alt={student.name} />
                            ) : (
                              <div className="avatar-placeholder">
                                {getInitials(student.name)}
                              </div>
                            )}
                          </div>
                          <div className="student-details">
                            <div className="student-name">{student.name}</div>
                            <div className="student-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="progress-cell">
                          <ProgressBar
                            now={student.overall_progress}
                            variant={student.overall_progress >= 80 ? 'success' : student.overall_progress >= 60 ? 'warning' : 'danger'}
                            className="progress-bar-sm"
                          />
                          <span className="progress-text">{student.overall_progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="completion-fraction">
                          {student.lessons_completed}/{student.total_lessons}
                        </span>
                      </td>
                      <td>
                        <span className="completion-fraction">
                          {student.quizzes_completed}/{student.total_quizzes}
                        </span>
                      </td>
                      <td>
                        <span className="completion-fraction">
                          {student.assignments_submitted}/{student.total_assignments}
                        </span>
                      </td>
                      <td>
                        <div className="score-cell">
                          <span className="score-value">{student.average_score}%</span>
                          <i className={getTrendIcon(student.performance_trend)}></i>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="streak-badge">
                          <i className="bi bi-fire me-1"></i>
                          {student.current_streak}
                        </Badge>
                      </td>
                      <td>
                        <span className="activity-text">
                          {formatLastActivity(student.last_activity)}
                        </span>
                      </td>
                      <td>
                        <Badge bg={getStatusColor(student.status)} className="status-badge">
                          {student.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => viewStudentDetails(student)}
                            className="me-1"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => sendMessage(student.id)}
                          >
                            <i className="bi bi-chat"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Student Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-circle me-2"></i>
            {selectedStudent?.name} - Detailed Progress
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Row className="g-4">
              <Col md={6}>
                <Card className="detail-card">
                  <Card.Body>
                    <h6 className="detail-title">
                      <i className="bi bi-graph-up me-2"></i>
                      Overall Progress
                    </h6>
                    <ProgressBar
                      now={selectedStudent.overall_progress}
                      label={`${selectedStudent.overall_progress}%`}
                      variant={selectedStudent.overall_progress >= 80 ? 'success' : 'warning'}
                      className="mb-3"
                    />
                    <div className="detail-stats">
                      <div className="stat-item">
                        <span className="stat-label">Time Spent:</span>
                        <span className="stat-value">{selectedStudent.time_spent} hours</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Current Streak:</span>
                        <span className="stat-value">{selectedStudent.current_streak} days</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Average Score:</span>
                        <span className="stat-value">{selectedStudent.average_score}%</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="detail-card">
                  <Card.Body>
                    <h6 className="detail-title">
                      <i className="bi bi-list-check me-2"></i>
                      Completion Status
                    </h6>
                    <div className="completion-details">
                      <div className="completion-item">
                        <div className="completion-header">
                          <span>Lessons</span>
                          <span>{selectedStudent.lessons_completed}/{selectedStudent.total_lessons}</span>
                        </div>
                        <ProgressBar
                          now={(selectedStudent.lessons_completed / selectedStudent.total_lessons) * 100}
                          variant="primary"
                          className="completion-bar"
                        />
                      </div>
                      <div className="completion-item">
                        <div className="completion-header">
                          <span>Quizzes</span>
                          <span>{selectedStudent.quizzes_completed}/{selectedStudent.total_quizzes}</span>
                        </div>
                        <ProgressBar
                          now={(selectedStudent.quizzes_completed / selectedStudent.total_quizzes) * 100}
                          variant="success"
                          className="completion-bar"
                        />
                      </div>
                      <div className="completion-item">
                        <div className="completion-header">
                          <span>Assignments</span>
                          <span>{selectedStudent.assignments_submitted}/{selectedStudent.total_assignments}</span>
                        </div>
                        <ProgressBar
                          now={(selectedStudent.assignments_submitted / selectedStudent.total_assignments) * 100}
                          variant="warning"
                          className="completion-bar"
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => sendMessage(selectedStudent?.id)}>
            <i className="bi bi-chat me-2"></i>
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentProgressMonitor;