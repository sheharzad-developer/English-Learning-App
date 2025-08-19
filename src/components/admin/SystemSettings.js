import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert, Badge, ProgressBar, Modal, Table, Nav } from 'react-bootstrap';
import { FaCog, FaServer, FaDatabase, FaShieldAlt, FaEnvelope, FaCloud, FaBell, FaChartLine, FaUsers, FaFileAlt, FaSave, FaUndo, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaEdit, FaTrash, FaPlus, FaDownload, FaUpload } from 'react-icons/fa';
import './SystemSettings.css';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'English Learning Platform',
      siteDescription: 'Advanced English learning platform for students and teachers',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@englishlearning.com',
      fromName: 'English Learning Platform',
      enableEmailNotifications: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      allowSocialLogin: true,
      ipWhitelist: []
    },
    storage: {
      maxFileSize: 10,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp3', 'mp4'],
      storageProvider: 'local',
      cloudStorageKey: '',
      cloudStorageSecret: ''
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailDigest: true,
      digestFrequency: 'weekly',
      notifyAdminOnNewUser: true,
      notifyAdminOnError: true
    }
  });
  
  const [systemHealth, setSystemHealth] = useState({
    database: { status: 'healthy', responseTime: '12ms', connections: 5 },
    storage: { status: 'healthy', usage: '45%', available: '2.1TB' },
    memory: { status: 'warning', usage: '78%', available: '2.2GB' },
    cpu: { status: 'healthy', usage: '23%', cores: 4 },
    cache: { status: 'healthy', hitRate: '94%', size: '512MB' }
  });
  
  const [logs, setLogs] = useState([
    { id: 1, level: 'info', message: 'User registration completed', timestamp: '2024-01-15 10:30:00', module: 'auth' },
    { id: 2, level: 'warning', message: 'High memory usage detected', timestamp: '2024-01-15 10:25:00', module: 'system' },
    { id: 3, level: 'error', message: 'Failed to send email notification', timestamp: '2024-01-15 10:20:00', module: 'email' },
    { id: 4, level: 'info', message: 'Database backup completed', timestamp: '2024-01-15 10:15:00', module: 'database' },
    { id: 5, level: 'info', message: 'New lesson created by teacher', timestamp: '2024-01-15 10:10:00', module: 'content' }
  ]);
  
  const [backups, setBackups] = useState([
    { id: 1, name: 'daily_backup_2024_01_15.sql', size: '245MB', date: '2024-01-15 02:00:00', status: 'completed' },
    { id: 2, name: 'daily_backup_2024_01_14.sql', size: '243MB', date: '2024-01-14 02:00:00', status: 'completed' },
    { id: 3, name: 'weekly_backup_2024_01_08.sql', size: '1.2GB', date: '2024-01-08 02:00:00', status: 'completed' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    // Simulate fetching system settings
    fetchSystemSettings();
    
    // Set up real-time system monitoring
    const interval = setInterval(() => {
      updateSystemHealth();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Settings are already set in state for demo
    } catch (error) {
      showAlert('error', 'Failed to fetch system settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSystemHealth = () => {
    // Simulate real-time health updates
    setSystemHealth(prev => ({
      ...prev,
      memory: {
        ...prev.memory,
        usage: `${Math.floor(Math.random() * 30) + 60}%`
      },
      cpu: {
        ...prev.cpu,
        usage: `${Math.floor(Math.random() * 40) + 10}%`
      }
    }));
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUnsavedChanges(false);
      showAlert('success', 'Settings saved successfully!');
    } catch (error) {
      showAlert('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setShowModal(true);
    setModalType('reset');
  };

  const confirmReset = () => {
    // Reset to default values
    fetchSystemSettings();
    setUnsavedChanges(false);
    setShowModal(false);
    showAlert('info', 'Settings reset to defaults');
  };

  const createBackup = async () => {
    try {
      setLoading(true);
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup = {
        id: backups.length + 1,
        name: `manual_backup_${new Date().toISOString().split('T')[0]}.sql`,
        size: `${Math.floor(Math.random() * 100) + 200}MB`,
        date: new Date().toISOString().replace('T', ' ').split('.')[0],
        status: 'completed'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      showAlert('success', 'Backup created successfully!');
    } catch (error) {
      showAlert('error', 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const renderGeneralSettings = () => (
    <Card className="settings-card">
      <Card.Header>
        <h5><FaCog className="me-2" />General Settings</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type="text"
                value={settings.general.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Timezone</Form.Label>
              <Form.Select
                value={settings.general.timezone}
                onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Site Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={settings.general.siteDescription}
            onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          />
        </Form.Group>
        
        <Row>
          <Col md={6}>
            <Form.Check
              type="switch"
              id="maintenance-mode"
              label="Maintenance Mode"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
              className="mb-3"
            />
          </Col>
          <Col md={6}>
            <Form.Check
              type="switch"
              id="registration-enabled"
              label="Allow New Registrations"
              checked={settings.general.registrationEnabled}
              onChange={(e) => handleSettingChange('general', 'registrationEnabled', e.target.checked)}
              className="mb-3"
            />
          </Col>
        </Row>
        
        <Form.Check
          type="switch"
          id="email-verification"
          label="Require Email Verification"
          checked={settings.general.emailVerificationRequired}
          onChange={(e) => handleSettingChange('general', 'emailVerificationRequired', e.target.checked)}
        />
      </Card.Body>
    </Card>
  );

  const renderEmailSettings = () => (
    <Card className="settings-card">
      <Card.Header>
        <h5><FaEnvelope className="me-2" />Email Configuration</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>SMTP Host</Form.Label>
              <Form.Control
                type="text"
                value={settings.email.smtpHost}
                onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>SMTP Port</Form.Label>
              <Form.Control
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>From Email</Form.Label>
              <Form.Control
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>From Name</Form.Label>
              <Form.Control
                type="text"
                value={settings.email.fromName}
                onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Check
          type="switch"
          id="email-notifications"
          label="Enable Email Notifications"
          checked={settings.email.enableEmailNotifications}
          onChange={(e) => handleSettingChange('email', 'enableEmailNotifications', e.target.checked)}
        />
      </Card.Body>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card className="settings-card">
      <Card.Header>
        <h5><FaShieldAlt className="me-2" />Security Settings</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Password Length</Form.Label>
              <Form.Control
                type="number"
                min="6"
                max="20"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Session Timeout (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Check
              type="switch"
              id="require-special-chars"
              label="Require Special Characters in Password"
              checked={settings.security.requireSpecialChars}
              onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
              className="mb-3"
            />
          </Col>
          <Col md={6}>
            <Form.Check
              type="switch"
              id="enable-2fa"
              label="Enable Two-Factor Authentication"
              checked={settings.security.enableTwoFactor}
              onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
              className="mb-3"
            />
          </Col>
        </Row>
        
        <Form.Check
          type="switch"
          id="allow-social-login"
          label="Allow Social Media Login"
          checked={settings.security.allowSocialLogin}
          onChange={(e) => handleSettingChange('security', 'allowSocialLogin', e.target.checked)}
        />
      </Card.Body>
    </Card>
  );

  const renderSystemHealth = () => (
    <Card className="health-card">
      <Card.Header>
        <h5><FaServer className="me-2" />System Health</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {Object.entries(systemHealth).map(([key, health]) => (
            <Col md={6} lg={4} key={key} className="mb-3">
              <div className="health-item">
                <div className="health-header">
                  <span className="health-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <Badge bg={getHealthStatusColor(health.status)}>
                    {health.status}
                  </Badge>
                </div>
                <div className="health-details">
                  {Object.entries(health).filter(([k]) => k !== 'status').map(([k, v]) => (
                    <div key={k} className="health-metric">
                      <span>{k.charAt(0).toUpperCase() + k.slice(1)}:</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  const renderSystemLogs = () => (
    <Card className="logs-card">
      <Card.Header>
        <h5><FaFileAlt className="me-2" />System Logs</h5>
      </Card.Header>
      <Card.Body>
        <div className="logs-container">
          {logs.map(log => (
            <div key={log.id} className="log-entry">
              <div className="log-header">
                <Badge bg={getLogLevelColor(log.level)} className="log-level">
                  {log.level.toUpperCase()}
                </Badge>
                <span className="log-module">{log.module}</span>
                <span className="log-timestamp">{log.timestamp}</span>
              </div>
              <div className="log-message">{log.message}</div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );

  const renderBackupManagement = () => (
    <Card className="backup-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5><FaDatabase className="me-2" />Backup Management</h5>
        <Button variant="primary" onClick={createBackup} disabled={loading}>
          <FaPlus className="me-2" />Create Backup
        </Button>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Backup Name</th>
              <th>Size</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.id}>
                <td>{backup.name}</td>
                <td>{backup.size}</td>
                <td>{backup.date}</td>
                <td>
                  <Badge bg={backup.status === 'completed' ? 'success' : 'warning'}>
                    {backup.status}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FaDownload />
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  return (
    <div className="system-settings-container">
      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
          {alert.message}
        </Alert>
      )}
      
      <Card className="settings-header">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="settings-title">
                <FaCog className="me-3" />
                System Settings
              </h2>
              <p className="settings-subtitle">Configure and monitor your platform</p>
            </div>
            <div className="header-actions">
              {unsavedChanges && (
                <Badge bg="warning" className="me-3">
                  <FaExclamationTriangle className="me-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button variant="outline-secondary" onClick={resetSettings} className="me-2">
                <FaUndo className="me-2" />Reset
              </Button>
              <Button variant="primary" onClick={saveSettings} disabled={loading || !unsavedChanges}>
                <FaSave className="me-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Nav variant="tabs" className="settings-tabs">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
          >
            <FaCog className="me-2" />General
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')}
          >
            <FaEnvelope className="me-2" />Email
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt className="me-2" />Security
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'monitoring'} 
            onClick={() => setActiveTab('monitoring')}
          >
            <FaChartLine className="me-2" />Monitoring
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'backup'} 
            onClick={() => setActiveTab('backup')}
          >
            <FaDatabase className="me-2" />Backup
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="tab-content">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'email' && renderEmailSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'monitoring' && (
          <>
            {renderSystemHealth()}
            {renderSystemLogs()}
          </>
        )}
        {activeTab === 'backup' && renderBackupManagement()}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to reset all settings to their default values? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmReset}>
            Reset Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SystemSettings;