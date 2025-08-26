import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { 
  Download, 
  Calendar, 
  Clock, 
  Bullseye, 
  GraphUpArrow, 
  Award,
  BarChart,
  PieChart,
  FileText,
  Share
} from 'react-bootstrap-icons';
import { progressService } from '../services/progressService';
import { useTheme } from '../contexts/ThemeContext';
import './Progress.css';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to fetch real data first, fallback to mock data
      let progressData, recentActivity;
      
      try {
        // Attempt to fetch from API (replace with actual API calls)
        // const progressResponse = await fetch('/api/progress');
        // const activityResponse = await fetch('/api/recent-activity');
        // progressData = await progressResponse.json();
        // recentActivity = await activityResponse.json();
        
        // For now, use mock data
        throw new Error('API not implemented yet');
      } catch (apiError) {
        console.log('Using mock data:', apiError.message);
        
        // Mock data for demonstration
        progressData = {
          totalLessons: 25,
          streakDays: 7,
          avgAccuracy: 85,
          timeSpent: 120 // minutes
        };

        recentActivity = [
          {
            id: 1,
            date: '2024-01-25',
            lesson: 'Basic Grammar',
            score: 90,
            status: 'completed',
            timeSpent: 15
          },
          {
            id: 2,
            date: '2024-01-24',
            lesson: 'Vocabulary Builder',
            score: 85,
            status: 'completed',
            timeSpent: 20
          },
          {
            id: 3,
            date: '2024-01-23',
            lesson: 'Listening Practice',
            score: 78,
            status: 'completed',
            timeSpent: 25
          },
          {
            id: 4,
            date: '2024-01-22',
            lesson: 'Speaking Exercise',
            score: 92,
            status: 'completed',
            timeSpent: 18
          },
          {
            id: 5,
            date: '2024-01-21',
            lesson: 'Reading Comprehension',
            score: 88,
            status: 'completed',
            timeSpent: 22
          }
        ];
      }

      // Check if data is empty and provide appropriate handling
      if (!progressData || Object.keys(progressData).length === 0) {
        setError('No progress data available. Start learning to see your progress!');
        return;
      }

      setProgressData(progressData);
      setRecentActivity(recentActivity || []);

    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError('Failed to load progress data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'not_started': return 'secondary';
      default: return 'secondary';
    }
  };

  const exportProgressData = () => {
    if (exportFormat === 'json') {
      const data = {
        progress: progressData,
        recentActivity: recentActivity,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'progress-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (exportFormat === 'csv') {
      const csvData = [
        ['Date', 'Lesson', 'Score', 'Status', 'Time Spent'],
        ...recentActivity.map(activity => [
          new Date(activity.date).toLocaleDateString(),
          activity.lesson,
          `${activity.score}%`,
          activity.status.replace('_', ' '),
          formatTime(activity.timeSpent)
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'progress-data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderWeeklyActivityChart = () => {
    const weeklyData = [
      { day: 'Mon', lessons: 3, accuracy: 85 },
      { day: 'Tue', lessons: 2, accuracy: 90 },
      { day: 'Wed', lessons: 4, accuracy: 78 },
      { day: 'Thu', lessons: 1, accuracy: 95 },
      { day: 'Fri', lessons: 3, accuracy: 88 },
      { day: 'Sat', lessons: 2, accuracy: 82 },
      { day: 'Sun', lessons: 0, accuracy: 0 }
    ];

    const maxLessons = Math.max(...weeklyData.map(d => d.lessons));
    const maxAccuracy = Math.max(...weeklyData.map(d => d.accuracy));

    return (
      <div className={`weekly-activity-chart ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="chart-header">
          <h5><BarChart /> Weekly Activity</h5>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color lessons"></span>
              Lessons Completed
            </span>
            <span className="legend-item">
              <span className="legend-color accuracy"></span>
              Accuracy %
            </span>
          </div>
        </div>
        <div className="chart-bars">
          {weeklyData.map((day, index) => (
            <div key={index} className="chart-bar-group">
              <div className="chart-bar lessons" 
                   style={{ 
                     height: `${maxLessons > 0 ? (day.lessons / maxLessons) * 100 : 0}%`,
                     backgroundColor: isDarkMode ? '#4CAF50' : '#28a745'
                   }}
                   title={`${day.lessons} lessons`}
              ></div>
              <div className="chart-bar accuracy" 
                   style={{ 
                     height: `${maxAccuracy > 0 ? (day.accuracy / maxAccuracy) * 100 : 0}%`,
                     backgroundColor: isDarkMode ? '#FF9800' : '#fd7e14'
                   }}
                   title={`${day.accuracy}% accuracy`}
              ></div>
              <div className="chart-label">{day.day}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillDistributionChart = () => {
    const skillData = [
      { skill: 'Grammar', percentage: 30, color: '#FF6B6B' },
      { skill: 'Vocabulary', percentage: 25, color: '#4ECDC4' },
      { skill: 'Listening', percentage: 20, color: '#45B7D1' },
      { skill: 'Speaking', percentage: 15, color: '#96CEB4' },
      { skill: 'Reading', percentage: 10, color: '#FFEAA7' }
    ];

    let currentAngle = 0;
    const total = skillData.reduce((sum, item) => sum + item.percentage, 0);

    return (
      <div className={`skill-distribution-chart ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <h5><PieChart /> Skill Distribution</h5>
        <div className="pie-chart-container">
          <svg width="200" height="200" viewBox="0 0 200 200" className="pie-chart">
            {skillData.map((item, index) => {
              const angle = (item.percentage / total) * 360;
              const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke={isDarkMode ? '#2c3e50' : '#fff'}
                  strokeWidth="2"
                  className="pie-segment"
                  title={`${item.skill}: ${item.percentage}%`}
                />
              );
            })}
            <circle cx="100" cy="100" r="30" fill={isDarkMode ? '#2c3e50' : '#fff'} />
            <text x="100" y="105" textAnchor="middle" className="pie-center-text">
              {total}%
            </text>
          </svg>
        </div>
        <div className="chart-legend">
          {skillData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span>{item.skill}: {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container fluid className="text-center py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Loading your progress...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Unable to Load Progress Data</Alert.Heading>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="outline-danger" onClick={fetchData} className="me-2">
              <GraphUpArrow className="me-2" />
              Retry
            </Button>
            <Button variant="outline-secondary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Empty state handling
  if (!loading && (!progressData || Object.keys(progressData).length === 0)) {
    return (
      <Container fluid className="py-5 text-center">
        <div className="empty-state">
          <GraphUpArrow size={64} className="text-muted mb-3" />
          <h3 className="text-muted">No Progress Data Yet</h3>
          <p className="text-muted mb-4">
            Start learning to see your progress and achievements here!
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/lessons'}>
            Start Learning
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className={`progress-page-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Container fluid className={`progress-page py-4 ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        {/* Header Section */}
        <div className="progress-header mb-4">
          <div className="progress-title">
            <h1><GraphUpArrow /> Progress Dashboard</h1>
            <p className="progress-subtitle">Track your learning journey and achievements</p>
          </div>
          <Dropdown as="div" className="export-dropdown">
            <Dropdown.Toggle variant="outline-primary" className="export-btn">
              <Download /> Export Data
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => { setExportFormat('json'); exportProgressData(); }}>
                <FileText /> Export as JSON
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setExportFormat('csv'); exportProgressData(); }}>
                <FileText /> Export as CSV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* KPIs Section */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className={`kpi-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Body>
                <div className="kpi-icon">
                  <Calendar />
                </div>
                <div className="kpi-content">
                  <div className="kpi-number">{progressData?.totalLessons || 0}</div>
                  <div className="kpi-label">Total Lessons</div>
                  <div className="kpi-subtitle">Completed this month</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`kpi-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Body>
                <div className="kpi-icon">
                  <Award />
                </div>
                <div className="kpi-content">
                  <div className="kpi-number">{progressData?.streakDays || 0}</div>
                  <div className="kpi-label">Streak Days</div>
                  <div className="kpi-subtitle">Current learning streak</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`kpi-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Body>
                <div className="kpi-icon">
                  <Bullseye />
                </div>
                <div className="kpi-content">
                  <div className="kpi-number">{progressData?.avgAccuracy || 0}%</div>
                  <div className="kpi-label">Avg Accuracy</div>
                  <div className="kpi-subtitle">Overall performance</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`kpi-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Body>
                <div className="kpi-icon">
                  <Clock />
                </div>
                <div className="kpi-content">
                  <div className="kpi-number">{formatTime(progressData?.timeSpent || 0)}</div>
                  <div className="kpi-label">Time Spent</div>
                  <div className="kpi-subtitle">This week</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <Card className={`chart-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Body>
                {renderWeeklyActivityChart()}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className={`chart-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Body>
                {renderSkillDistributionChart()}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity Section */}
        <Row>
          <Col>
            <Card className={`activity-card ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Card.Header>
                <h5><Share /> Recent Activity</h5>
              </Card.Header>
              <Card.Body>
                {recentActivity.length > 0 ? (
                  <Table responsive className="activity-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Lesson</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity) => (
                        <tr key={activity.id}>
                          <td>{new Date(activity.date).toLocaleDateString()}</td>
                          <td>{activity.lesson}</td>
                          <td>
                            <Badge bg={activity.score >= 90 ? 'success' : activity.score >= 80 ? 'warning' : 'danger'}>
                              {activity.score}%
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusColor(activity.status)}>
                              {activity.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td>{formatTime(activity.timeSpent)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <GraphUpArrow size={48} />
                    </div>
                    <h3>No activity yet</h3>
                    <p>Start learning to see your progress here.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Progress;
