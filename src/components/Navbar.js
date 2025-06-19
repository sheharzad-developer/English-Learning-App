import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const AppNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2 main-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
          <i className="bi bi-book-half me-2"></i> English Learning
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/dashboard" className="mx-2">Dashboard</Nav.Link>
            )}
            <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/learning" className="mx-2">Learning</Nav.Link>
            )}
            {!isAuthenticated ? (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="mx-2">Login</Button>
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
