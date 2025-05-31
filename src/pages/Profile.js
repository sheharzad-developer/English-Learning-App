// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData({ ...res.data, password: '' }); // don't prefill password
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:8000/api/user/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      setMessage('❌ Error updating profile');
      console.error(err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">👤 My Profile</h2>
      <Card className="p-4 shadow-sm">
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email (readonly)</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password (optional)</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit">Save Changes</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Profile;
