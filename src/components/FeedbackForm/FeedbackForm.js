import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function FeedbackForm() {
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit feedback logic here (API call, etc.)
    setShowModal(true);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '2rem auto' }}>
        <Form.Group>
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Submit Feedback
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thank You!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your feedback has been submitted successfully.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FeedbackForm; 