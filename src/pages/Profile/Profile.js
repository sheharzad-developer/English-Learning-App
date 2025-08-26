// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();

  // Load profile from localStorage or fallback to user from context
  const getInitialProfile = () => {
    const stored = localStorage.getItem('profile');
    if (stored) return JSON.parse(stored);
    return {
      full_name: user?.full_name || '',
      username: user?.username || '',
      email: user?.email || '',
      location: user?.location || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      date_joined: user?.date_joined || '',
    };
  };

  const [profile, setProfile] = useState(getInitialProfile);
  const [showModal, setShowModal] = useState(false);

  // Keep profile in sync with localStorage
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  // Example: fallback/placeholder values
  const location = profile.location || 'Not specified';
  const phone = profile.phone || 'Not specified';
  const bio = profile.bio || 'No bio provided.';
  const memberSince = profile.date_joined
    ? new Date(profile.date_joined).toLocaleDateString()
    : 'Unknown';

  const handleEdit = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save to localStorage is handled by useEffect
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <Card className="text-center shadow" style={{ borderRadius: 20 }}>
        <Card.Body>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)',
                color: '#fff',
                fontSize: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 2px 12px rgba(74,0,224,0.15)'
              }}
            >
              {profile.full_name
                ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                : <i className="bi bi-person-circle"></i>}
            </div>
            <h2 style={{ marginBottom: 0 }}>{profile.full_name || 'User'}</h2>
            <div style={{ color: '#888', marginBottom: 8 }}>@{profile.username}</div>
            <div style={{ color: '#555', marginBottom: 16 }}>{profile.email}</div>
          </div>
          <div style={{ textAlign: 'left', margin: '0 auto 1.5rem auto', maxWidth: 350 }}>
            <div style={{ marginBottom: 8 }}>
              <i className="bi bi-geo-alt-fill" style={{ color: '#4a00e0', marginRight: 8 }}></i>
              <strong>Location:</strong> {location}
            </div>
            <div style={{ marginBottom: 8 }}>
              <i className="bi bi-telephone-fill" style={{ color: '#4a00e0', marginRight: 8 }}></i>
              <strong>Phone:</strong> {phone}
            </div>
            <div style={{ marginBottom: 8 }}>
              <i className="bi bi-calendar-check" style={{ color: '#4a00e0', marginRight: 8 }}></i>
              <strong>Member since:</strong> {memberSince}
            </div>
            <div style={{ marginBottom: 8 }}>
              <i className="bi bi-person-lines-fill" style={{ color: '#4a00e0', marginRight: 8 }}></i>
              <strong>Bio:</strong> <span style={{ color: '#666' }}>{bio}</span>
            </div>
          </div>
          <Button variant="primary" onClick={handleEdit}>
            Edit Profile
          </Button>
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={2}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Profile;
