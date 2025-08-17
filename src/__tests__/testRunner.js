import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock axios for API calls
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

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

describe('Comprehensive Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
    mockNavigate.mockClear();
  });

  describe('Theme Switching Tests', () => {
    test('should toggle between light and dark themes', async () => {
      renderWithProviders(<App />);
      
      // Initially light theme
      expect(document.body).toHaveClass('light-theme');
      expect(document.body).not.toHaveClass('dark-theme');
      
      // Toggle to dark
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        expect(document.body).toHaveClass('dark-theme');
        expect(document.body).not.toHaveClass('light-theme');
      });
      
      // Toggle back to light
      const newThemeToggle = screen.getByTitle('Switch to Light Mode');
      fireEvent.click(newThemeToggle);
      
      await waitFor(() => {
        expect(document.body).toHaveClass('light-theme');
        expect(document.body).not.toHaveClass('dark-theme');
      });
    });

    test('should save theme preference to localStorage', async () => {
      renderWithProviders(<App />);
      
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      });
    });
  });

  describe('Navigation Tests', () => {
    test('should display navbar with correct elements', () => {
      renderWithProviders(<App />);
      
      expect(screen.getByText('English Learning')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();
    });

    test('should have responsive navbar toggle', () => {
      renderWithProviders(<App />);
      
      const navbarToggle = screen.getByRole('button', { name: /toggle navigation/i });
      expect(navbarToggle).toBeInTheDocument();
      expect(navbarToggle).toHaveClass('navbar-toggler');
    });
  });

  describe('Home Page Tests', () => {
    test('should render hero section correctly', () => {
      renderWithProviders(<App />);
      
      expect(screen.getByText('Unlock Your English Potential')).toBeInTheDocument();
      expect(screen.getByText(/Interactive lessons, quizzes, and progress tracking/)).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    test('should render feature cards', () => {
      renderWithProviders(<App />);
      
      expect(screen.getByText('Interactive Learning')).toBeInTheDocument();
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
    });

    test('should have proper muted text styling', () => {
      renderWithProviders(<App />);
      
      const mutedTexts = screen.getAllByText(/text-muted/);
      mutedTexts.forEach(text => {
        expect(text).toHaveClass('text-muted');
        expect(text).toBeVisible();
      });
    });
  });

  describe('Authentication Tests', () => {
    test('should show login/register for unauthenticated users', () => {
      renderWithProviders(<App />);
      
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    test('should handle navigation to login page', () => {
      renderWithProviders(<App />);
      
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Responsiveness Tests', () => {
    test('should render correctly on different screen sizes', () => {
      const screenSizes = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 },
      ];
      
      screenSizes.forEach(({ width, height }) => {
        // Mock viewport size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: height,
        });
        
        renderWithProviders(<App />);
        
        expect(screen.getByText('English Learning')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper ARIA labels and roles', () => {
      renderWithProviders(<App />);
      
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
      
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      expect(themeToggle).toBeInTheDocument();
    });

    test('should support keyboard navigation', () => {
      renderWithProviders(<App />);
      
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      const aboutLink = screen.getByText('About');
      
      themeToggle.focus();
      expect(themeToggle).toHaveFocus();
      
      aboutLink.focus();
      expect(aboutLink).toHaveFocus();
    });

    test('should have proper heading hierarchy', () => {
      renderWithProviders(<App />);
      
      const mainHeading = screen.getByText('Unlock Your English Potential');
      expect(mainHeading.tagName).toBe('H1');
    });
  });

  describe('Theme Persistence Tests', () => {
    test('should restore theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      renderWithProviders(<App />);
      
      expect(document.body).toHaveClass('dark-theme');
      expect(screen.getByTitle('Switch to Light Mode')).toBeInTheDocument();
    });

    test('should handle invalid localStorage values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');
      
      renderWithProviders(<App />);
      
      expect(document.body).toHaveClass('light-theme');
    });
  });

  describe('Integration Tests', () => {
    test('should maintain functionality across theme changes', async () => {
      renderWithProviders(<App />);
      
      // Check initial state
      expect(document.body).toHaveClass('light-theme');
      expect(screen.getByText('English Learning')).toBeInTheDocument();
      
      // Toggle theme
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        expect(document.body).toHaveClass('dark-theme');
      });
      
      // Check that functionality is maintained
      expect(screen.getByText('English Learning')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    test('should handle multiple user interactions', async () => {
      renderWithProviders(<App />);
      
      // Toggle theme
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        expect(document.body).toHaveClass('dark-theme');
      });
      
      // Navigate to different sections
      const aboutLink = screen.getByText('About');
      fireEvent.click(aboutLink);
      
      // Check that theme is maintained
      expect(document.body).toHaveClass('dark-theme');
    });
  });
}); 