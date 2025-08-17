import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
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

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

describe('Home Page Hero Section', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
    mockNavigate.mockClear();
  });

  test('should render hero section with correct structure', () => {
    renderWithProviders(<Home />);
    
    // Check hero title
    expect(screen.getByText('Unlock Your English Potential')).toBeInTheDocument();
    expect(screen.getByText('Unlock Your English Potential')).toHaveClass('display-4', 'fw-bold');
    
    // Check hero subtitle
    expect(screen.getByText(/Interactive lessons, quizzes, and progress tracking/)).toBeInTheDocument();
    expect(screen.getByText(/Interactive lessons, quizzes, and progress tracking/)).toHaveClass('lead');
    
    // Check hero section container
    const heroSection = screen.getByText('Unlock Your English Potential').closest('section');
    expect(heroSection).toHaveClass('hero-section');
  });

  test('should display hero illustration', () => {
    renderWithProviders(<Home />);
    
    const heroImage = screen.getByAltText('English Learning Illustration');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveClass('img-fluid', 'hero-illustration');
    expect(heroImage).toHaveAttribute('src', 'https://undraw.co/api/illustrations/english-learning.svg');
  });

  test('should show "Get Started" button for unauthenticated users', () => {
    renderWithProviders(<Home />);
    
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveClass('btn', 'btn-primary', 'btn-lg', 'shadow');
  });

  test('should show "Go to Dashboard" button for authenticated users', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser' },
      }),
    }));
    
    renderWithProviders(<Home />);
    
    const dashboardButton = screen.getByText('Go to Dashboard');
    expect(dashboardButton).toBeInTheDocument();
    expect(dashboardButton).toHaveClass('btn', 'btn-primary', 'btn-lg', 'shadow');
  });

  test('should navigate to register page when "Get Started" is clicked', () => {
    renderWithProviders(<Home />);
    
    const getStartedButton = screen.getByText('Get Started');
    fireEvent.click(getStartedButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('should navigate to dashboard when "Go to Dashboard" is clicked', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser' },
      }),
    }));
    
    renderWithProviders(<Home />);
    
    const dashboardButton = screen.getByText('Go to Dashboard');
    fireEvent.click(dashboardButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('should have readable text colors in light theme', () => {
    renderWithProviders(<Home />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    
    const heroTitle = screen.getByText('Unlock Your English Potential');
    const heroSubtitle = screen.getByText(/Interactive lessons, quizzes, and progress tracking/);
    
    // Check inline styles for text colors
    expect(heroTitle).toHaveStyle({ color: '#2B2D42' });
    expect(heroSubtitle).toHaveStyle({ color: '#555' });
  });

  test('should have readable text colors in dark theme', async () => {
    renderWithProviders(<Home />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    const heroTitle = screen.getByText('Unlock Your English Potential');
    const heroSubtitle = screen.getByText(/Interactive lessons, quizzes, and progress tracking/);
    
    // Text should still be readable in dark theme
    expect(heroTitle).toBeVisible();
    expect(heroSubtitle).toBeVisible();
    
    // Check that text has sufficient contrast
    const titleStyle = getComputedStyle(heroTitle);
    const subtitleStyle = getComputedStyle(heroSubtitle);
    
    expect(titleStyle.color).not.toBe('transparent');
    expect(subtitleStyle.color).not.toBe('transparent');
  });

  test('should have proper button styling in both themes', async () => {
    renderWithProviders(<Home />);
    
    const getStartedButton = screen.getByText('Get Started');
    
    // Light theme button styling
    expect(getStartedButton).toHaveClass('btn-primary');
    expect(getStartedButton).toBeVisible();
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Button should still be visible and properly styled
    expect(getStartedButton).toBeVisible();
    expect(getStartedButton).toHaveClass('btn-primary');
  });

  test('should have responsive layout for different screen sizes', () => {
    renderWithProviders(<Home />);
    
    const heroSection = screen.getByText('Unlock Your English Potential').closest('section');
    const container = heroSection.querySelector('.container');
    const row = container.querySelector('.row');
    
    // Check responsive classes
    expect(row).toHaveClass('align-items-center');
    
    // Check column classes for responsive behavior
    const titleColumn = screen.getByText('Unlock Your English Potential').closest('.col-md-6');
    const imageColumn = screen.getByAltText('English Learning Illustration').closest('.col-md-6');
    
    expect(titleColumn).toHaveClass('col-md-6', 'text-md-start', 'text-center');
    expect(imageColumn).toHaveClass('col-md-6', 'd-flex', 'justify-content-center');
  });

  test('should maintain hero section visibility during theme transitions', async () => {
    renderWithProviders(<Home />);
    
    const heroSection = screen.getByText('Unlock Your English Potential').closest('section');
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check initial visibility
    expect(heroSection).toBeVisible();
    expect(screen.getByText('Unlock Your English Potential')).toBeVisible();
    
    // Toggle theme
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Hero section should still be visible
    expect(heroSection).toBeVisible();
    expect(screen.getByText('Unlock Your English Potential')).toBeVisible();
  });

  test('should have proper spacing and padding', () => {
    renderWithProviders(<Home />);
    
    const heroSection = screen.getByText('Unlock Your English Potential').closest('section');
    
    // Check padding classes
    expect(heroSection).toHaveClass('py-5');
    
    // Check margin classes on title
    const heroTitle = screen.getByText('Unlock Your English Potential');
    expect(heroTitle).toHaveClass('mb-3');
    
    // Check margin classes on subtitle
    const heroSubtitle = screen.getByText(/Interactive lessons, quizzes, and progress tracking/);
    expect(heroSubtitle).toHaveClass('mb-4');
  });

  test('should handle image loading errors gracefully', () => {
    renderWithProviders(<Home />);
    
    const heroImage = screen.getByAltText('English Learning Illustration');
    
    // Simulate image load error
    fireEvent.error(heroImage);
    
    // Should fallback to a different image
    expect(heroImage.src).toContain('undraw_educator.svg');
  });
}); 