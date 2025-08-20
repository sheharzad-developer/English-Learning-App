import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

const AppNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" sticky="top" className="shadow-sm py-2 main-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
          <i className="bi bi-book-half me-2"></i> English Learning
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated && (
              <Nav.Link as={Link} to="/dashboard" className="mx-2">Dashboard</Nav.Link>
            )}
            <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/learning" className="mx-2">Learning</Nav.Link>
            )}
            
            {/* Theme Toggle Button */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="theme-toggle-btn mx-2"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <i className="bi bi-sun-fill"></i>
              ) : (
                <i className="bi bi-moon-fill"></i>
              )}
            </Button>
            
            {!isAuthenticated ? (
              <>
                <NavDropdown title="Login" id="login-dropdown" className="me-2">
                  <NavDropdown.Item as={Link} to="/login">
                    <i className="fas fa-user-graduate me-2"></i>Student Login
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/teacher/login">
                    <i className="fas fa-chalkboard-teacher me-2"></i>Teacher Login
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/login">
                    <i className="fas fa-user-shield me-2"></i>Admin Login
                  </NavDropdown.Item>
                </NavDropdown>
                <Button as={Link} to="/register" variant="primary" className="mx-2">Register</Button>
              </>
            ) : (
              <NavDropdown title={<span><i className="bi bi-person-circle me-1"></i>{user?.username || 'User'}</span>} id="user-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
