import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';

const DashboardLayout = ({ children }) => {
  const role = localStorage.getItem('role'); // 'admin', 'student', 'teacher'
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = {
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Lessons', path: '/admin/lessons' },
      { label: 'Reports', path: '/admin/reports' },
    ],
    teacher: [
      { label: 'Dashboard', path: '/teacher/dashboard' },
      { label: 'My Lessons', path: '/teacher/lessons' },
      { label: 'Submissions', path: '/teacher/submissions' },
    ],
    student: [
      { label: 'Dashboard', path: '/student/dashboard' },
      { label: 'My Lessons', path: '/student/lessons' },
      { label: 'Progress', path: '/student/progress' },
    ],
  };

  const items = navItems[role] || [];

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-4">
        <Navbar.Brand>🧠 English Learning App</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Row className="m-0">
        <Col md={2} className="bg-light vh-100 pt-4 border-end">
          <Nav className="flex-column">
            {items.map((item, idx) => (
              <Nav.Link
                key={idx}
                href={item.path}
                active={location.pathname === item.path}
                className="mb-2"
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Col>
        <Col md={10} className="p-4">
          {children}
        </Col>
      </Row>
    </>
  );
};

export default DashboardLayout;
