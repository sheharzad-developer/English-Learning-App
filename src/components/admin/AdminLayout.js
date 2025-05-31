import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminLayout.css'; // Custom styles

const AdminLayout = ({ children }) => {
  return (
    <Container fluid className="admin-layout">
      <Row>
        <Col md={2} className="sidebar bg-dark text-white p-3">
          <h4 className="text-white mb-4">Admin Panel</h4>
          <Nav defaultActiveKey="/admin/dashboard" className="flex-column">
            <Nav.Link as={Link} to="/admin/dashboard" className="text-white">📊 Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white">👤 Users</Nav.Link>
            <Nav.Link as={Link} to="/admin/lessons" className="text-white">📚 Lessons</Nav.Link>
            <Nav.Link as={Link} to="/admin/reports" className="text-white">📈 Reports</Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="content p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
