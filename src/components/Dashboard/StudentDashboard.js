import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert, Spinner, Badge } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { lessonService } from '../../services/lessonService';
import progressService from '../../services/progressService';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    progress: 0,
    lessonsCompleted: 0,
    quizzesTaken: 0,
    streak: 0,
    totalPoints: 0,
    currentLevel: 'Beginner',
    averageScore: 0,
    studyTime: 0,
    achievements: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  useEffect(() => {
    fetchAllDashboardData();
  }, [user]);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Try multiple API endpoints with fallback strategy
      let dashboardData = null;
      let hasRealData = false;

      // Try the new student dashboard endpoint first
      try {
        const dashboardRes = await axios.get('http://127.0.0.1:8000/api/accounts/student/dashboard/', { headers });
        if (dashboardRes.data && dashboardRes.data.statistics) {
          dashboardData = dashboardRes.data;
          hasRealData = true;
        }
      } catch (error) {
        console.log('Student dashboard endpoint not available, trying learning endpoints...');
      }

      // Fallback to learning endpoints
      if (!dashboardData) {
        try {
          const [statsRes, progressRes] = await Promise.allSettled([
            axios.get('http://127.0.0.1:8000/api/learning/stats/', { headers }),
            axios.get('http://127.0.0.1:8000/api/learning/progress/', { headers })
          ]);
          
          if (statsRes.status === 'fulfilled' && statsRes.value.data) {
            dashboardData = {
              statistics: statsRes.value.data,
              recent_activity: []
            };
            hasRealData = true;
          }
        } catch (error) {
          console.log('Learning endpoints not available, using demo data...');
        }
      }

      // If we have real data, use it
      if (hasRealData && dashboardData?.statistics) {
        const stats = dashboardData.statistics;
        setStats({
          progress: stats.overall_progress || stats.progress_percentage || 0,
          lessonsCompleted: stats.lessons_completed || 0,
          quizzesTaken: stats.quizzes_taken || stats.exercises_completed || 0,
          streak: stats.current_streak || 0,
          totalPoints: stats.total_points || 0,
          currentLevel: stats.current_level || stats.level || 'Beginner',
          averageScore: Math.round(stats.average_score || 0),
          studyTime: Math.round((stats.study_time || stats.time_spent_learning || 0) / 60),
          achievements: stats.badges_earned || 0
        });

        if (dashboardData.recent_activity) {
          setRecentActivity(dashboardData.recent_activity);
        }
      } else {
        // Check local progress first, then use demo data
        console.log('Using local progress or demo data - no backend connection');
        const localStats = progressService.getStatistics();
        
        if (localStats.totalSubmissions > 0) {
          console.log('✅ Using local progress data in dashboard');
          setError('Backend not available. Showing your local progress.');
          setStats({
            progress: localStats.overallProgress,
            lessonsCompleted: localStats.lessonsCompleted,
            quizzesTaken: localStats.quizzesTaken,
            streak: localStats.currentStreak,
            totalPoints: localStats.totalPoints,
            currentLevel: localStats.overallProgress < 25 ? 'Beginner' : localStats.overallProgress < 50 ? 'Elementary' : localStats.overallProgress < 75 ? 'Intermediate' : 'Advanced',
            averageScore: localStats.averageScore,
            studyTime: Math.round(localStats.studyTime / 60),
            achievements: localStats.achievements.length
          });
          
          // Set recent activity from local submissions
          setRecentActivity(
            localStats.recentSubmissions.map(s => ({
              id: s.id,
              exercise_title: s.quizTitle,
              lesson_title: 'Quiz Exercise',
              score: s.score,
              is_correct: s.isCorrect,
              created_at: s.timestamp,
              time_taken: s.timeSpent
            }))
          );
        } else {
          setError('No progress data found. Complete some quizzes to see your progress!');
          setStats({
            progress: 0,
            lessonsCompleted: 0,
            quizzesTaken: 0,
            streak: 0,
            totalPoints: 0,
            currentLevel: 'Beginner',
            averageScore: 0,
            studyTime: 0,
            achievements: 0
          });
          
          setRecentActivity([]);
        }
      }
      
      // Generate chart data
      generateChartData();
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Connection error. Showing demo data for preview.');
      
      // Set fallback demo data
      setStats({
        progress: 65,
        lessonsCompleted: 12,
        quizzesTaken: 8,
        streak: 5,
        totalPoints: 450,
        currentLevel: 'Intermediate',
        averageScore: 85,
        studyTime: 24,
        achievements: 3
      });
      
      setRecentActivity([]);
      generateChartData();
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    // Progress over time data
    setProgressData({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
      datasets: [
        {
          label: 'Learning Progress (%)',
          data: [20, 35, 50, 60, stats.progress || 65],
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: '#3b82f6',
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
        }
      ]
    });
    
    // Skills breakdown
    setSkillsData({
      labels: ['Grammar', 'Vocabulary', 'Listening', 'Speaking', 'Reading'],
      datasets: [
        {
          data: [85, 72, 68, 45, 78],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ],
          borderWidth: 0
        }
      ]
    });
    
    // Weekly activity
    setWeeklyData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Study Time (minutes)',
          data: [45, 60, 30, 80, 65, 40, 35],
          backgroundColor: '#3b82f6',
          borderRadius: 8
        }
      ]
    });
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } }
      },
      y: {
        grid: { borderDash: [5, 5] },
        ticks: { font: { size: 12 } }
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page py-4">
        <Container fluid>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Loading your dashboard...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="dashboard-page py-4">
      <Container fluid>
        {error && (
          <Alert variant="warning" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-2" style={{ color: '#fff' }}>
              Welcome back, {user?.first_name || user?.username || 'Learner'}! 🎓
            </h2>
            <p className="text-muted mb-0">Let's continue your English learning journey</p>
          </div>
          <Badge bg="primary" className="fs-6 px-3 py-2">
            Level: {stats.currentLevel}
          </Badge>
        </div>
        
        {/* Progress Overview */}
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">📈 Learning Progress Overview</h5>
                  <span className="badge bg-success">{stats.progress}% Complete</span>
                </div>
                <ProgressBar 
                  now={stats.progress} 
                  label={`${stats.progress}%`} 
                  style={{ height: '20px' }} 
                  className="mb-3"
                />
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border-end">
                      <h6 className="text-primary mb-1">{stats.totalPoints}</h6>
                      <small className="text-muted">Total Points</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <h6 className="text-success mb-1">{stats.averageScore}%</h6>
                      <small className="text-muted">Avg Score</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <h6 className="text-warning mb-1">{stats.studyTime}h</h6>
                    <small className="text-muted">Study Time</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="h-100 shadow-sm border-0 bg-gradient">
              <Card.Body className="text-center d-flex flex-column justify-content-center">
                <div className="mb-3">
                  <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-2">Daily Goal</h5>
                <p className="text-muted mb-3">Complete 2 lessons today</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/learning')}
                  className="btn-sm"
                >
                  Start Learning
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Analytics Dashboard */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-4">📊 Progress Analytics</h5>
                {progressData && (
                  <div style={{ height: '250px' }}>
                    <Line data={progressData} options={chartOptions} />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-4">🎯 Skills Breakdown</h5>
                {skillsData && (
                  <div style={{ height: '250px' }}>
                    <Doughnut data={skillsData} options={doughnutOptions} />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-primary text-white mx-auto mb-3">
                  <i className="bi bi-journal-check fs-2"></i>
                </div>
                <Card.Title className="mb-1">Lessons Completed</Card.Title>
                <Card.Text className="fs-3 fw-bold text-primary">{stats.lessonsCompleted}</Card.Text>
                <small className="text-muted">+2 this week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-success text-white mx-auto mb-3">
                  <i className="bi bi-patch-question fs-2"></i>
                </div>
                <Card.Title className="mb-1">Quizzes Taken</Card.Title>
                <Card.Text className="fs-3 fw-bold text-success">{stats.quizzesTaken}</Card.Text>
                <small className="text-muted">85% avg score</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-warning text-white mx-auto mb-3">
                  <i className="bi bi-fire fs-2"></i>
                </div>
                <Card.Title className="mb-1">Current Streak</Card.Title>
                <Card.Text className="fs-3 fw-bold text-warning">{stats.streak}</Card.Text>
                <small className="text-muted">days in a row</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm border-0 text-center dashboard-card">
              <Card.Body>
                <div className="icon-circle bg-info text-white mx-auto mb-3">
                  <i className="bi bi-trophy fs-2"></i>
                </div>
                <Card.Title className="mb-1">Achievements</Card.Title>
                <Card.Text className="fs-3 fw-bold text-info">{stats.achievements}</Card.Text>
                <small className="text-muted">badges earned</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Activity & Quiz Section */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="mb-4">📅 Weekly Activity</h5>
                {weeklyData && (
                  <div style={{ height: '200px' }}>
                    <Bar data={weeklyData} options={chartOptions} />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">🧩 Quick Quiz</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/learning?filter=quiz')}
                  >
                    More Quizzes
                  </Button>
                </div>
                <div className="text-center py-4">
                  <div className="mb-3">
                    <i className="bi bi-patch-question-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h6>Ready for a challenge?</h6>
                  <p className="text-muted mb-3">Test your knowledge with a quick grammar quiz</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/learning?type=quiz&category=grammar')}
                  >
                    Start Quiz
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity & Quick Actions */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-4">🔄 Recent Activity</h5>
                {recentActivity.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{activity.exercise_title || 'Quiz Completed'}</h6>
                            <p className="mb-1 text-muted small">{activity.lesson_title || 'Practice Exercise'}</p>
                            <small className="text-muted">
                              Score: {activity.score ? `${activity.score}%` : 'N/A'} • 
                              {new Date(activity.created_at).toLocaleDateString()}
                              {activity.time_taken && ` • ${Math.round(activity.time_taken / 60)}min`}
                            </small>
                          </div>
                          <Badge bg={activity.is_correct ? 'success' : 'warning'}>
                            {activity.is_correct ? 'Passed' : 'Review'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-clock-history text-muted" style={{ fontSize: '2rem' }}></i>
                    <p className="text-muted mt-2">No recent activity. Start learning to see your progress here!</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-4">⚡ Quick Actions</h5>
                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/learning')}
                  >
                    <i className="bi bi-play-circle-fill me-2"></i>
                    Continue Learning
                  </Button>
                  <Button 
                    variant="outline-success" 
                    onClick={() => navigate('/learning?filter=quiz')}
                  >
                    <i className="bi bi-patch-question me-2"></i>
                    Take Quiz
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    onClick={() => navigate('/achievements')}
                  >
                    <i className="bi bi-trophy me-2"></i>
                    Achievements
                  </Button>
                  <Button 
                    variant="outline-info" 
                    onClick={() => navigate('/leaderboard')}
                  >
                    <i className="bi bi-bar-chart me-2"></i>
                    Leaderboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Motivation Section */}
        <Card className="shadow-sm border-0 bg-gradient text-center">
          <Card.Body className="py-5">
            <div className="mb-4">
              <i className="bi bi-lightbulb-fill text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4 className="fw-bold mb-3" style={{ color: '#1976d2' }}>
              "Every lesson brings you closer to fluency!"
            </h4>
            <p className="text-muted mb-4">Keep up the great work. Consistency is key to mastering English!</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/learning')}
              >
                <i className="bi bi-play-circle-fill me-2"></i>
                Start New Lesson
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg" 
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Data
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default StudentDashboard;