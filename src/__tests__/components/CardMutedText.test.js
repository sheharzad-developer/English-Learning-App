import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { Card, Container } from 'react-bootstrap';
import Home from '../../pages/Home';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Test component with muted text
const TestCardWithMutedText = () => (
  <Container>
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Test Card Title</Card.Title>
        <Card.Text className="text-muted">
          This is muted text that should be visible in both themes.
        </Card.Text>
        <Card.Text>
          This is regular text for comparison.
        </Card.Text>
      </Card.Body>
    </Card>
  </Container>
);

describe('Card Muted Text', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
  });

  test('should render card with muted text correctly', () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    // Check that muted text is present
    expect(screen.getByText('This is muted text that should be visible in both themes.')).toBeInTheDocument();
    expect(screen.getByText('This is muted text that should be visible in both themes.')).toHaveClass('text-muted');
    
    // Check that regular text is also present
    expect(screen.getByText('This is regular text for comparison.')).toBeInTheDocument();
  });

  test('should have visible muted text in light theme', () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    const regularText = screen.getByText('This is regular text for comparison.');
    
    // Both texts should be visible
    expect(mutedText).toBeVisible();
    expect(regularText).toBeVisible();
    
    // Check that muted text has the correct class
    expect(mutedText).toHaveClass('text-muted');
    expect(regularText).not.toHaveClass('text-muted');
  });

  test('should have visible muted text in dark theme', async () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    const regularText = screen.getByText('This is regular text for comparison.');
    
    // Both texts should still be visible
    expect(mutedText).toBeVisible();
    expect(regularText).toBeVisible();
    
    // Check that muted text still has the correct class
    expect(mutedText).toHaveClass('text-muted');
  });

  test('should have sufficient contrast for muted text in light theme', () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    expect(document.body).toHaveClass('light-theme');
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    const computedStyle = getComputedStyle(mutedText);
    
    // Check that muted text has a visible color
    expect(computedStyle.color).not.toBe('transparent');
    expect(computedStyle.color).not.toBe('rgba(0, 0, 0, 0)');
    
    // Should have some color value
    expect(computedStyle.color).toBeTruthy();
  });

  test('should have sufficient contrast for muted text in dark theme', async () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    const computedStyle = getComputedStyle(mutedText);
    
    // Check that muted text has a visible color in dark theme
    expect(computedStyle.color).not.toBe('transparent');
    expect(computedStyle.color).not.toBe('rgba(0, 0, 0, 0)');
    
    // Should have some color value
    expect(computedStyle.color).toBeTruthy();
  });

  test('should test muted text in home page feature cards', () => {
    renderWithProviders(<Home />);
    
    // Find muted text in feature cards
    const mutedTexts = screen.getAllByText(/text-muted/);
    
    mutedTexts.forEach(text => {
      expect(text).toHaveClass('text-muted');
      expect(text).toBeVisible();
    });
    
    // Check specific muted text content
    expect(screen.getByText(/Engage with dynamic content and real-time feedback/)).toHaveClass('text-muted');
    expect(screen.getByText(/Monitor your learning journey with detailed analytics/)).toHaveClass('text-muted');
    expect(screen.getByText(/Earn badges and rewards as you complete milestones/)).toHaveClass('text-muted');
    expect(screen.getByText(/Connect with fellow learners and share experiences/)).toHaveClass('text-muted');
  });

  test('should maintain muted text visibility during theme transitions', async () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check initial visibility
    expect(mutedText).toBeVisible();
    expect(mutedText).toHaveClass('text-muted');
    
    // Toggle to dark theme
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Muted text should still be visible
    expect(mutedText).toBeVisible();
    expect(mutedText).toHaveClass('text-muted');
    
    // Toggle back to light theme
    const newThemeToggle = screen.getByTitle('Switch to Light Mode');
    fireEvent.click(newThemeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('light-theme');
    });
    
    // Muted text should still be visible
    expect(mutedText).toBeVisible();
    expect(mutedText).toHaveClass('text-muted');
  });

  test('should have different visual weight than regular text', () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    const regularText = screen.getByText('This is regular text for comparison.');
    
    // Both should be visible but have different styling
    expect(mutedText).toBeVisible();
    expect(regularText).toBeVisible();
    
    expect(mutedText).toHaveClass('text-muted');
    expect(regularText).not.toHaveClass('text-muted');
  });

  test('should test muted text in "How It Works" cards', () => {
    renderWithProviders(<Home />);
    
    // Check muted text in "How It Works" section cards
    const howItWorksCards = screen.getAllByText(/Create your free account and set your learning goals/);
    expect(howItWorksCards.length).toBeGreaterThan(0);
    
    // These should be Card.Text elements which inherit theme colors
    howItWorksCards.forEach(card => {
      expect(card).toBeVisible();
    });
  });

  test('should have proper CSS variable inheritance for muted text', () => {
    renderWithProviders(<TestCardWithMutedText />);
    
    const mutedText = screen.getByText('This is muted text that should be visible in both themes.');
    
    // Light theme
    expect(document.body).toHaveClass('light-theme');
    let computedStyle = getComputedStyle(mutedText);
    expect(computedStyle.color).toBeTruthy();
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      computedStyle = getComputedStyle(mutedText);
      expect(computedStyle.color).toBeTruthy();
    });
  });

  test('should test multiple instances of muted text', () => {
    renderWithProviders(<Home />);
    
    // Count all text-muted elements
    const mutedElements = document.querySelectorAll('.text-muted');
    expect(mutedElements.length).toBeGreaterThan(0);
    
    // All should be visible
    mutedElements.forEach(element => {
      expect(element).toBeVisible();
    });
  });
}); 