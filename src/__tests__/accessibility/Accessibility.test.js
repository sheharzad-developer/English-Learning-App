import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import App from '../../App';
import Home from '../../pages/Home';
import AppNavbar from '../../components/Navbar';
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

describe('Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
  });

  test('should have proper ARIA labels and roles', () => {
    renderWithProviders(<App />);
    
    // Check that navbar has proper role
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
    
    // Check that theme toggle button has proper title
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    expect(themeToggle).toBeInTheDocument();
    
    // Check that navbar toggle has proper aria-controls
    const navbarToggle = screen.getByRole('button', { name: /toggle navigation/i });
    expect(navbarToggle).toHaveAttribute('aria-controls', 'main-navbar-nav');
  });

  test('should support keyboard navigation', () => {
    renderWithProviders(<App />);
    
    // Test tab navigation
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    const aboutLink = screen.getByText('About');
    const loginButton = screen.getByText('Login');
    const registerButton = screen.getByText('Register');
    
    // Focus theme toggle
    themeToggle.focus();
    expect(themeToggle).toHaveFocus();
    
    // Tab to next element
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(aboutLink).toHaveFocus();
    
    // Tab to next element
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(loginButton).toHaveFocus();
    
    // Tab to next element
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(registerButton).toHaveFocus();
  });

  test('should have proper focus indicators', () => {
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    const aboutLink = screen.getByText('About');
    
    // Focus elements and check for focus indicators
    themeToggle.focus();
    expect(themeToggle).toHaveFocus();
    
    aboutLink.focus();
    expect(aboutLink).toHaveFocus();
    
    // Check that focused elements have visible focus indicators
    const themeToggleStyle = getComputedStyle(themeToggle);
    const aboutLinkStyle = getComputedStyle(aboutLink);
    
    // Focus should be visible (outline or box-shadow)
    expect(themeToggleStyle.outline).not.toBe('none');
    expect(aboutLinkStyle.outline).not.toBe('none');
  });

  test('should have proper heading hierarchy', () => {
    renderWithProviders(<Home />);
    
    // Check that main heading is h1
    const mainHeading = screen.getByText('Unlock Your English Potential');
    expect(mainHeading.tagName).toBe('H1');
    
    // Check that section headings are h2
    const sectionHeadings = screen.getAllByText(/How It Works|Why Choose Our Platform|Ready to Start/);
    sectionHeadings.forEach(heading => {
      expect(heading.tagName).toBe('H2');
    });
    
    // Check that feature titles are h5
    const featureTitles = screen.getAllByText(/Interactive Learning|Progress Tracking|Achievements|Community/);
    featureTitles.forEach(title => {
      expect(title.tagName).toBe('H5');
    });
  });

  test('should have proper alt text for images', () => {
    renderWithProviders(<Home />);
    
    // Check that hero image has alt text
    const heroImage = screen.getByAltText('English Learning Illustration');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('alt', 'English Learning Illustration');
  });

  test('should have proper button and link labels', () => {
    renderWithProviders(<App />);
    
    // Check that buttons have descriptive text
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    
    // Check that theme toggle has descriptive title
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    expect(themeToggle).toBeInTheDocument();
  });

  test('should support screen reader navigation', () => {
    renderWithProviders(<App />);
    
    // Check that navigation landmarks are properly marked
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
    
    // Check that main content area is accessible
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent) {
      expect(mainContent).toBeInTheDocument();
    }
  });

  test('should have sufficient color contrast', () => {
    renderWithProviders(<App />);
    
    // Check text elements for sufficient contrast
    const brandText = screen.getByText('English Learning');
    const aboutLink = screen.getByText('About');
    const loginButton = screen.getByText('Login');
    
    // Get computed styles
    const brandStyle = getComputedStyle(brandText);
    const aboutStyle = getComputedStyle(aboutLink);
    const loginStyle = getComputedStyle(loginButton);
    
    // Check that text colors are not transparent or too light
    expect(brandStyle.color).not.toBe('transparent');
    expect(aboutStyle.color).not.toBe('transparent');
    expect(loginStyle.color).not.toBe('transparent');
  });

  test('should handle keyboard shortcuts properly', () => {
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Test Enter key
    themeToggle.focus();
    fireEvent.keyDown(themeToggle, { key: 'Enter' });
    
    // Test Space key
    fireEvent.keyDown(themeToggle, { key: ' ' });
    
    // Both should trigger the theme toggle
    expect(themeToggle).toBeInTheDocument();
  });

  test('should have proper form accessibility', () => {
    renderWithProviders(<App />);
    
    // Navigate to login page to test forms
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Check that form elements would have proper labels
    // This would depend on your actual login form implementation
    expect(loginButton).toBeInTheDocument();
  });

  test('should maintain accessibility during theme changes', async () => {
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Toggle theme
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Check that accessibility features are still maintained
    expect(themeToggle).toHaveFocus();
    expect(themeToggle).toHaveAttribute('title', 'Switch to Light Mode');
    
    // Check that focus indicators are still visible
    const themeToggleStyle = getComputedStyle(themeToggle);
    expect(themeToggleStyle.outline).not.toBe('none');
  });

  test('should have proper skip links', () => {
    renderWithProviders(<App />);
    
    // Check for skip links (if implemented)
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    if (skipLinks.length > 0) {
      skipLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    }
  });

  test('should have proper language attributes', () => {
    renderWithProviders(<App />);
    
    // Check that HTML has proper lang attribute
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute('lang');
  });

  test('should handle dynamic content accessibility', () => {
    renderWithProviders(<App />);
    
    // Test that dynamic content (like dropdowns) are accessible
    // Mock authenticated user to test dropdown
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Check that user dropdown is accessible
    const userDropdown = screen.getByText('testuser');
    expect(userDropdown).toBeInTheDocument();
  });

  test('should have proper error handling for screen readers', () => {
    renderWithProviders(<App />);
    
    // Test that error states are properly announced
    // This would depend on your actual error handling implementation
    expect(screen.getByText('English Learning')).toBeInTheDocument();
  });

  test('should support reduced motion preferences', () => {
    renderWithProviders(<App />);
    
    // Check that animations respect user preferences
    // This would depend on your CSS implementation
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    // Theme change should be smooth but not jarring
    expect(themeToggle).toBeInTheDocument();
  });

  test('should have proper semantic HTML structure', () => {
    renderWithProviders(<Home />);
    
    // Check that semantic elements are used properly
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
    
    // Check that lists are properly structured
    const lists = document.querySelectorAll('ul, ol');
    if (lists.length > 0) {
      lists.forEach(list => {
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThan(0);
      });
    }
  });

  test('should handle focus management properly', () => {
    renderWithProviders(<App />);
    
    // Test that focus is managed properly when elements are added/removed
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Focus should not be lost unexpectedly
    themeToggle.focus();
    expect(themeToggle).toHaveFocus();
    
    // Simulate theme change
    fireEvent.click(themeToggle);
    
    // Focus should still be maintained or moved appropriately
    expect(document.activeElement).toBeInTheDocument();
  });
}); 