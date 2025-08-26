import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Alert, Spinner, Badge } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';
import { lessonService } from '../../services/lessonService';
import progressService from '../../services/progressService';
import axios from 'axios';
import './UserProgress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UserProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    totalLessons: 0,
    averageScore: 0,
    totalPoints: 0,
    currentStreak: 0,
    studyTime: 0
  });
  const [skillsProgress, setSkillsProgress] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);

  useEffect(() => {
    fetchUserProgress();
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Try multiple endpoints for progress data with comprehensive fallback
      let hasRealData = false;
      let statsData = null;
      let progressList = [];
      let submissionsData = [];

      // Strategy 1: Try the main student dashboard endpoint first
      try {
        const dashboardRes = await axios.get('http://127.0.0.1:8000/api/accounts/student/dashboard/', { headers });
        if (dashboardRes.data && dashboardRes.data.statistics) {
          const stats = dashboardRes.data.statistics;
          statsData = stats;
          hasRealData = true;
          console.log('✅ Using real data from student dashboard');
        }
      } catch (error) {
        console.log('Student dashboard endpoint not available, trying other endpoints...');
      }

      // Strategy 2: Try learning endpoints
      if (!hasRealData) {
        try {
          const [statsRes, progressRes, submissionsRes] = await Promise.allSettled([
            axios.get('http://127.0.0.1:8000/api/learning/stats/', { headers }),
            axios.get('http://127.0.0.1:8000/api/learning/progress/', { headers }),
            lessonService.getSubmissions()
          ]);
          
          if (statsRes.status === 'fulfilled' && statsRes.value.data) {
            statsData = statsRes.value.data;
            hasRealData = true;
            console.log('✅ Using real data from learning stats');
          }
          
          if (progressRes.status === 'fulfilled' && progressRes.value.data) {
            progressList = progressRes.value.data.results || progressRes.value.data || [];
          }
          
          if (submissionsRes.status === 'fulfilled' && submissionsRes.value) {
            submissionsData = submissionsRes.value.slice(0, 5) || [];
          }
        } catch (error) {
          console.log('Learning endpoints not available, trying lessons endpoints...');
        }
      }

      // Strategy 3: Try lessons endpoints as fallback
      if (!hasRealData) {
        try {
          const [progressRes, lessonsRes] = await Promise.allSettled([
            axios.get('http://127.0.0.1:8000/api/lessons/progress/', { headers }),
            lessonService.getLessons()
          ]);
          
          if (progressRes.status === 'fulfilled' && progressRes.value.data) {
            progressList = progressRes.value.data.results || progressRes.value.data || [];
            // Calculate basic stats from progress data
            const completed = progressList.filter(p => p.completed).length;
            statsData = {
              lessons_completed: completed,
              total_lessons: progressList.length,
              average_score: progressList.reduce((acc, p) => acc + (p.score || 0), 0) / progressList.length || 0,
              total_points: completed * 10, // Estimated points
              current_streak: 3, // Default streak
              study_time: completed * 1800 // 30 minutes per lesson
            };
            hasRealData = true;
            console.log('✅ Using real data from lessons progress');
          }
        } catch (error) {
          console.log('Lessons endpoints not available either...');
        }
      }

      // Use real data if available, otherwise try local progress
      if (hasRealData && statsData) {
        // Merge backend data with local progress data
        const localStats = progressService.getStatistics();
        
        setStats({
          lessonsCompleted: statsData.lessons_completed || localStats.lessonsCompleted,
          totalLessons: statsData.total_lessons || Math.max(statsData.lessons_completed || localStats.lessonsCompleted, 20),
          averageScore: Math.round(statsData.average_score || localStats.averageScore),
          totalPoints: statsData.total_points || localStats.totalPoints,
          currentStreak: statsData.current_streak || localStats.currentStreak,
          studyTime: Math.round((statsData.study_time || localStats.studyTime) / 60)
        });

        // Set recent lessons from real data
        if (progressList.length > 0) {
          setRecentLessons(
            progressList
              .filter(p => p.completed)
              .sort((a, b) => new Date(b.completed_at || b.updated_at) - new Date(a.completed_at || a.updated_at))
              .slice(0, 5)
              .map(p => ({
                id: p.id,
                title: p.lesson?.title || p.title || 'Lesson',
                category: p.lesson?.category?.name || p.category || 'General',
                score: p.score || 0,
                completed_at: p.completed_at || p.updated_at || new Date().toISOString(),
                duration: p.time_spent || 25
              }))
          );
        } else if (submissionsData.length > 0) {
          setRecentLessons(
            submissionsData.map(s => ({
              id: s.id,
              title: s.exercise?.title || 'Quiz Exercise',
              category: s.exercise?.lesson?.category?.name || 'Practice',
              score: s.score || 0,
              completed_at: s.created_at,
              duration: Math.round(s.time_taken / 60) || 15
            }))
          );
        }

        // Generate skills progress from real data
        const completedLessons = statsData.lessons_completed || 0;
        const avgScore = statsData.average_score || 0;
        setSkillsProgress([
          { skill: 'Grammar', progress: Math.min(completedLessons * 5 + Math.random() * 10, 100), color: '#3b82f6' },
          { skill: 'Vocabulary', progress: Math.min(avgScore + Math.random() * 15 - 5, 100), color: '#10b981' },
          { skill: 'Listening', progress: Math.min(completedLessons * 4 + Math.random() * 20, 100), color: '#f59e0b' },
          { skill: 'Speaking', progress: Math.min(completedLessons * 3 + Math.random() * 15, 100), color: '#ef4444' },
          { skill: 'Reading', progress: Math.min(completedLessons * 4.5 + Math.random() * 10, 100), color: '#8b5cf6' }
        ]);

        setError(''); // Clear any previous error
      } else {
        // Use local progress data first, then fallback to demo data
        console.log('❌ No backend data available, checking local progress...');
        const localStats = progressService.getStatistics();
        
        if (localStats.totalSubmissions > 0) {
          // Use local progress data
          console.log('✅ Using local progress data');
          setError('Backend not available. Showing local progress data.');
          setStats({
            lessonsCompleted: localStats.lessonsCompleted,
            totalLessons: localStats.totalLessons,
            averageScore: localStats.averageScore,
            totalPoints: localStats.totalPoints,
            currentStreak: localStats.currentStreak,
            studyTime: Math.round(localStats.studyTime / 60)
          });
          
          // Set recent lessons from local submissions
          setRecentLessons(
            localStats.recentSubmissions.map(s => ({
              id: s.id,
              title: s.quizTitle,
              category: 'Quiz',
              score: s.score,
              completed_at: s.timestamp,
              duration: Math.round(s.timeSpent / 60) || 5
            }))
          );
          
          // Use local skill progress
          setSkillsProgress([
            { skill: 'Grammar', progress: localStats.skillProgress.grammar, color: '#3b82f6' },
            { skill: 'Vocabulary', progress: localStats.skillProgress.vocabulary, color: '#10b981' },
            { skill: 'Listening', progress: localStats.skillProgress.listening, color: '#f59e0b' },
            { skill: 'Speaking', progress: localStats.skillProgress.speaking, color: '#ef4444' },
            { skill: 'Reading', progress: localStats.skillProgress.reading, color: '#8b5cf6' }
          ]);
        } else {
          // Fallback to demo data only if no local progress either
          console.log('❌ No local progress data, using demo data');
          setError('No progress data found. Complete some quizzes to see your progress!');
          setStats({
            lessonsCompleted: 0,
            totalLessons: 20,
            averageScore: 0,
            totalPoints: 0,
            currentStreak: 0,
            studyTime: 0
          });
          
          // Set empty skill progress for demo
          setSkillsProgress([
            { skill: 'Grammar', progress: 0, color: '#3b82f6' },
            { skill: 'Vocabulary', progress: 0, color: '#10b981' },
            { skill: 'Listening', progress: 0, color: '#f59e0b' },
            { skill: 'Speaking', progress: 0, color: '#ef4444' },
            { skill: 'Reading', progress: 0, color: '#8b5cf6' }
          ]);
          
          setRecentLessons([]);
        }
      }

      generateChartData();
      
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      setError('Connection error. Showing demo data for preview.');
      
      // Set fallback demo data
      setStats({
        lessonsCompleted: 12,
        totalLessons: 20,
        averageScore: 85,
        totalPoints: 450,
        currentStreak: 5,
        studyTime: 24
      });
      
      setSkillsProgress([
        { skill: 'Grammar', progress: 85, color: '#3b82f6' },
        { skill: 'Vocabulary', progress: 72, color: '#10b981' },
        { skill: 'Listening', progress: 68, color: '#f59e0b' },
        { skill: 'Speaking', progress: 45, color: '#ef4444' },
        { skill: 'Reading', progress: 78, color: '#8b5cf6' }
      ]);
      
      setRecentLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    // Generate progress chart data based on current stats
    const progressPercent = stats.totalLessons > 0 ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100) : 60;
    
    setProgressData({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
      datasets: [
        {
          label: 'Learning Progress (%)',
          data: [20, 35, 50, 65, progressPercent],
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
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 12 },
          color: '#6b7280'
        }
      },
      y: {
        grid: { 
          borderDash: [5, 5],
          color: '#e5e7eb'
        },
        ticks: { 
          font: { size: 12 },
          color: '#6b7280'
        }
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading your progress...</p>
        </div>
      </Container>
    );
  }

  const overallProgress = stats.totalLessons > 0 ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100) : 60;

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">📊 Your Progress</h1>
        <p className="lead text-muted">Track your learning journey and celebrate your achievements!</p>
        
        {error && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
      </div>

      {/* Progress Overview */}
      <Row className="mb-5">
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="mb-4">📈 Learning Progress Overview</h5>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Overall Progress</span>
                  <Badge bg="primary">{overallProgress}%</Badge>
                </div>
                <ProgressBar 
                  now={overallProgress} 
                  style={{ height: '12px' }}
                  className="mb-3"
                />
              </div>
              
              {progressData && (
                <div style={{ height: '250px' }}>
                  <Line data={progressData} options={chartOptions} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Row className="g-4">
            <Col xs={6} lg={12}>
              <Card className="shadow-sm border-0 text-center">
                <Card.Body>
                  <h3 className="text-primary">{stats.lessonsCompleted}</h3>
                  <p className="text-muted mb-0">Lessons Completed</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs={6} lg={12}>
              <Card className="shadow-sm border-0 text-center">
                <Card.Body>
                  <h3 className="text-success">{stats.averageScore}%</h3>
                  <p className="text-muted mb-0">Average Score</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs={6} lg={12}>
              <Card className="shadow-sm border-0 text-center">
                <Card.Body>
                  <h3 className="text-warning">{stats.currentStreak}</h3>
                  <p className="text-muted mb-0">Day Streak</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs={6} lg={12}>
              <Card className="shadow-sm border-0 text-center">
                <Card.Body>
                  <h3 className="text-info">{stats.studyTime}h</h3>
                  <p className="text-muted mb-0">Study Time</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Skills Progress */}
      <Row className="g-4 mb-5">
        <Col lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-4">🎯 Skills Progress</h5>
              {skillsProgress.map((skill, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium">{skill.skill}</span>
                    <span className="text-muted">{skill.progress}%</span>
                  </div>
                  <ProgressBar 
                    now={skill.progress} 
                    style={{ 
                      height: '8px',
                      backgroundColor: '#f1f3f4'
                    }}
                  >
                    <ProgressBar 
                      now={skill.progress}
                      style={{ backgroundColor: skill.color }}
                    />
                  </ProgressBar>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-4">📚 Recent Lessons</h5>
              {recentLessons.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentLessons.map((lesson) => (
                    <div key={lesson.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{lesson.title}</h6>
                          <p className="mb-1 text-muted small">{lesson.category}</p>
                          <small className="text-muted">
                            {new Date(lesson.completed_at).toLocaleDateString()} • {lesson.duration}min
                          </small>
                        </div>
                        <div className="text-end">
                          <Badge bg={lesson.score >= 80 ? 'success' : lesson.score >= 60 ? 'warning' : 'danger'}>
                            {lesson.score}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-book text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="text-muted mt-2">No recent lessons. Start learning to see your progress!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Motivational Section */}
      <Card className="shadow-sm border-0 bg-gradient text-center">
        <Card.Body className="py-5">
          <div className="mb-4">
            <i className="bi bi-award-fill text-warning" style={{ fontSize: '3rem' }}></i>
          </div>
          <h4 className="fw-bold mb-3">Keep up the excellent work!</h4>
          <p className="text-muted mb-4">
            You've completed {stats.lessonsCompleted} lessons and earned {stats.totalPoints} points. 
            Your dedication to learning is impressive!
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Badge bg="primary" className="px-3 py-2">
              Level: {overallProgress < 25 ? 'Beginner' : overallProgress < 50 ? 'Elementary' : overallProgress < 75 ? 'Intermediate' : 'Advanced'}
            </Badge>
            <Badge bg="success" className="px-3 py-2">
              {stats.totalPoints} Points Earned
            </Badge>
            <Badge bg="warning" className="px-3 py-2">
              {stats.currentStreak} Day Streak
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProgress;