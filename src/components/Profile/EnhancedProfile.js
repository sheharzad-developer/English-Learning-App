import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './EnhancedProfile.css';

const EnhancedProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    location: '',
    phone: '',
    bio: '',
    date_joined: '',
    role: '',
    avatar: null,
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light'
    },
    stats: {
      lessonsCompleted: 0,
      quizzesTaken: 0,
      streak: 0,
      totalPoints: 0
    }
  });
  
  const [showEditModal, setShowEditModal] = useState(false);
  // const [showPasswordModal, setShowPasswordModal] = useState(false); // Removed - no backend endpoint
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // const [passwordData, setPasswordData] = useState({
  //   currentPassword: '',
  //   newPassword: '',
  //   confirmPassword: ''
  // }); // Removed - no backend endpoint

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProfile({
        ...response.data,
        preferences: response.data.preferences || {
          language: 'en',
          notifications: true,
          theme: 'light'
        },
        stats: response.data.stats || {
          lessonsCompleted: 0,
          quizzesTaken: 0,
          streak: 0,
          totalPoints: 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Fallback to user data from context
      if (user) {
        setProfile(prev => ({
          ...prev,
          full_name: user.full_name || '',
          username: user.username || '',
          email: user.email || '',
          role: user.role || '',
          date_joined: user.date_joined || ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await axios.put('http://127.0.0.1:8000/api/accounts/profile/', profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setShowEditModal(false);
      
      // Update user context if available
      if (updateUser) {
        updateUser(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Password change functionality removed - no backend endpoint available

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  // Password input change handler removed - no backend endpoint available

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'teacher': return 'warning';
      case 'student': return 'primary';
      default: return 'secondary';
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const calculateProfileCompletion = () => {
    const fields = ['full_name', 'email', 'location', 'phone', 'bio'];
    const completed = fields.filter(field => profile[field] && profile[field].trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading && !profile.username) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="enhanced-profile-container py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      
      {/* Profile Header */}
      <Card className="profile-header-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <div className="profile-avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {getInitials(profile.full_name)}
                  </div>
                )}
              </div>
            </Col>
            <Col md={6}>
              <h2 className="profile-name">{profile.full_name || 'User'}</h2>
              <p className="profile-username">@{profile.username}</p>
              <p className="profile-email">{profile.email}</p>
              <Badge bg={getRoleColor(profile.role)} className="role-badge">
                {profile.role?.toUpperCase()}
              </Badge>
            </Col>
            <Col md={3} className="text-end">
              <div className="profile-completion mb-3">
                <small className="text-muted">Profile Completion</small>
                <ProgressBar 
                  now={calculateProfileCompletion()} 
                  label={`${calculateProfileCompletion()}%`}
                  className="completion-bar"
                />
              </div>
              <Button 
                variant="primary" 
                onClick={() => setShowEditModal(true)}
                className="me-2"
              >
                <i className="bi bi-pencil-square me-1"></i>
                Edit Profile
              </Button>
              {/* Change Password button removed - no backend endpoint available */}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Profile Tabs */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="profile-tabs mb-4">
        <Tab eventKey="profile" title="Profile Information">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="info-item">
                    <i className="bi bi-person-fill info-icon"></i>
                    <div>
                      <strong>Full Name</strong>
                      <p>{profile.full_name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-envelope-fill info-icon"></i>
                    <div>
                      <strong>Email</strong>
                      <p>{profile.email || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-geo-alt-fill info-icon"></i>
                    <div>
                      <strong>Location</strong>
                      <p>{profile.location || 'Not specified'}</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <i className="bi bi-telephone-fill info-icon"></i>
                    <div>
                      <strong>Phone</strong>
                      <p>{profile.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-calendar-check info-icon"></i>
                    <div>
                      <strong>Member Since</strong>
                      <p>{profile.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-person-lines-fill info-icon"></i>
                    <div>
                      <strong>Bio</strong>
                      <p>{profile.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="stats" title="Learning Statistics">
          <Card>
            <Card.Body>
              <Row className="g-4">
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-icon bg-primary">
                      <i className="bi bi-journal-check"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{profile.stats.lessonsCompleted}</h3>
                      <p>Lessons Completed</p>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-icon bg-success">
                      <i className="bi bi-patch-question"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{profile.stats.quizzesTaken}</h3>
                      <p>Quizzes Taken</p>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-icon bg-warning">
                      <i className="bi bi-fire"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{profile.stats.streak}</h3>
                      <p>Day Streak</p>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-card">
                    <div className="stat-icon bg-info">
                      <i className="bi bi-trophy"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{profile.stats.totalPoints}</h3>
                      <p>Total Points</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="preferences" title="Preferences">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="preference-item">
                    <i className="bi bi-translate preference-icon"></i>
                    <div>
                      <strong>Language</strong>
                      <p>{profile.preferences.language === 'en' ? 'English' : profile.preferences.language}</p>
                    </div>
                  </div>
                  <div className="preference-item">
                    <i className="bi bi-bell preference-icon"></i>
                    <div>
                      <strong>Notifications</strong>
                      <p>{profile.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="preference-item">
                    <i className="bi bi-palette preference-icon"></i>
                    <div>
                      <strong>Theme</strong>
                      <p>{profile.preferences.theme === 'light' ? 'Light' : 'Dark'}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileUpdate}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Language Preference</Form.Label>
                  <Form.Select
                    name="preferences.language"
                    value={profile.preferences.language}
                    onChange={handleInputChange}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select
                    name="preferences.theme"
                    value={profile.preferences.theme}
                    onChange={handleInputChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="preferences.notifications"
                label="Enable notifications"
                checked={profile.preferences.notifications}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    notifications: e.target.checked
                  }
                }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Change Password Modal removed - no backend endpoint available */}
    </Container>
  );
};

export default EnhancedProfile;