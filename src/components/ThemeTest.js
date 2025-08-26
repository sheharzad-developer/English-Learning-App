import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const ThemeTest = () => {
  const { isDarkMode, toggleTheme, themeMode } = useTheme();

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Header>
          <h3>Theme Test Component</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>Current Theme Status</h4>
              <p><strong>Theme Mode:</strong> {themeMode}</p>
              <p><strong>Is Dark Mode:</strong> {isDarkMode ? 'Yes' : 'No'}</p>
              <p><strong>CSS Variables Test:</strong></p>
              <div style={{ 
                backgroundColor: 'var(--bg-card)', 
                color: 'var(--text-primary)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)'
              }}>
                This text should be visible in both light and dark modes.
                <br />
                Background: var(--bg-card)
                <br />
                Text: var(--text-primary)
              </div>
            </Col>
            <Col md={6}>
              <h4>Theme Controls</h4>
              <Button onClick={toggleTheme} variant="primary" className="mb-2">
                Toggle Theme (Current: {isDarkMode ? 'Dark' : 'Light'})
              </Button>
              <br />
              <Button 
                onClick={() => document.body.classList.add('dark-theme')} 
                variant="outline-dark"
                className="me-2"
              >
                Force Dark
              </Button>
              <Button 
                onClick={() => document.body.classList.remove('dark-theme')} 
                variant="outline-light"
              >
                Force Light
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h4>Text Color Test</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <h5>Heading 5 - Should be visible</h5>
            <p>Regular paragraph text - Should be visible</p>
            <p className="text-muted">Muted text - Should be visible but dimmed</p>
            <span className="text-secondary">Secondary text - Should be visible</span>
          </div>
          
          <div className="mb-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary" className="ms-2">Secondary Button</Button>
            <Button variant="outline-primary" className="ms-2">Outline Primary</Button>
          </div>

          <div className="alert alert-info">
            This is an info alert - should be visible with proper contrast
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThemeTest;
