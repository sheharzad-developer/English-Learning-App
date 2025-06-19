import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (password !== password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        email,
        username,
        password,
        password2,
        role,
      });
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.email || err.response?.data?.username || err.response?.data?.password || 'Registration failed. Please check your details.');
    }
  };

  return (
    <Container className="register-container d-flex align-items-center justify-content-center min-vh-100">
      <Card className="register-card shadow-lg p-4 w-100" style={{ maxWidth: '450px' }}>
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold text-primary">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleRegister} autoComplete="off">
            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-person"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-envelope"></i></InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicRole" className="mb-3">
              <Form.Label className="fw-semibold">Role</Form.Label>
              <Form.Select value={role} onChange={e => setRole(e.target.value)} required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formBasicPassword2" className="mb-3">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold mt-3"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <a href="/login" className="text-primary fw-semibold">Login</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
