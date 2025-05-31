import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: email, // or email depending on your backend auth
        password: password,
      });

      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('role', response.data.role);
      setError('');
      navigate('/dashboard'); // Make sure this route exists in App.js
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username or Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4" block="true">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
