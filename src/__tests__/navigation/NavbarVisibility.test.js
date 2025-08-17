import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import AppNavbar from '../../components/Navbar';
import App from '../../App';
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

describe('Navigation Bar Visibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
  });

  test('should render navbar with correct structure', () => {
    renderWithProviders(<AppNavbar />);
    
    // Check navbar brand
    expect(screen.getByText('English Learning')).toBeInTheDocument();
    expect(screen.getByText('English Learning')).toHaveClass('navbar-brand');
    
    // Check navigation links
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Check theme toggle button
    expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();
  });

  test('should have correct navbar classes and styling', () => {
    renderWithProviders(<AppNavbar />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar', 'main-navbar', 'shadow-sm');
    expect(navbar).toHaveAttribute('data-bs-theme', 'light');
  });

  test('should display authenticated user navigation when logged in', () => {
    // Mock authenticated user
    const mockUser = { username: 'testuser', role: 'student' };
    
    // Mock AuthContext to return authenticated state
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: mockUser,
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<AppNavbar />);
    
    // Should show dashboard link
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Should show learning link
    expect(screen.getByText('Learning')).toBeInTheDocument();
    
    // Should show user dropdown
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('should display unauthenticated user navigation when not logged in', () => {
    renderWithProviders(<AppNavbar />);
    
    // Should show login and register buttons
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Should not show dashboard or learning links
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Learning')).not.toBeInTheDocument();
  });

  test('should have correct navbar colors in light theme', () => {
    renderWithProviders(<AppNavbar />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    
    const navbar = screen.getByRole('navigation');
    const computedStyle = getComputedStyle(navbar);
    
    // Check that navbar uses light theme CSS variables
    expect(computedStyle.backgroundColor).toBe('rgb(255, 255, 255)'); // --bg-navbar
  });

  test('should have correct navbar colors in dark theme', async () => {
    renderWithProviders(<AppNavbar />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    const navbar = screen.getByRole('navigation');
    const computedStyle = getComputedStyle(navbar);
    
    // Check that navbar uses dark theme CSS variables
    expect(computedStyle.backgroundColor).toBe('rgb(30, 30, 30)'); // --bg-navbar
  });

  test('should have visible and clickable navigation links', () => {
    renderWithProviders(<AppNavbar />);
    
    // Check that all navigation links are visible
    const aboutLink = screen.getByText('About');
    const loginLink = screen.getByText('Login');
    const registerLink = screen.getByText('Register');
    
    expect(aboutLink).toBeVisible();
    expect(loginLink).toBeVisible();
    expect(registerLink).toBeVisible();
    
    // Check that links have correct styling
    expect(aboutLink).toHaveClass('nav-link');
    expect(loginLink).toHaveClass('btn', 'btn-outline-primary');
    expect(registerLink).toHaveClass('btn', 'btn-primary');
  });

  test('should have proper contrast for text in both themes', () => {
    renderWithProviders(<AppNavbar />);
    
    // Light theme
    expect(document.body).toHaveClass('light-theme');
    const brandLight = screen.getByText('English Learning');
    expect(brandLight).toHaveClass('text-primary');
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    // Dark theme
    waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      const brandDark = screen.getByText('English Learning');
      expect(brandDark).toHaveClass('text-primary');
    });
  });

  test('should have responsive navbar toggle for mobile', () => {
    renderWithProviders(<AppNavbar />);
    
    // Check that navbar toggle button exists
    const navbarToggle = screen.getByRole('button', { name: /toggle navigation/i });
    expect(navbarToggle).toBeInTheDocument();
    expect(navbarToggle).toHaveClass('navbar-toggler');
  });

  test('should maintain navbar visibility during theme transitions', async () => {
    renderWithProviders(<AppNavbar />);
    
    const navbar = screen.getByRole('navigation');
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check initial visibility
    expect(navbar).toBeVisible();
    
    // Toggle theme
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Navbar should still be visible
    expect(navbar).toBeVisible();
    
    // Toggle back
    const newThemeToggle = screen.getByTitle('Switch to Light Mode');
    fireEvent.click(newThemeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('light-theme');
    });
    
    // Navbar should still be visible
    expect(navbar).toBeVisible();
  });

  test('should have proper focus states for accessibility', () => {
    renderWithProviders(<AppNavbar />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    const aboutLink = screen.getByText('About');
    
    // Focus theme toggle
    themeToggle.focus();
    expect(themeToggle).toHaveFocus();
    
    // Focus about link
    aboutLink.focus();
    expect(aboutLink).toHaveFocus();
  });
}); 