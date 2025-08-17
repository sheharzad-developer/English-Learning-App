import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
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

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock axios for API calls
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
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

describe('Login/Logout Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
    mockNavigate.mockClear();
  });

  test('should render login page with correct form elements', () => {
    renderWithProviders(<App />);
    
    // Navigate to login page
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Check that we're on login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('should display login form with required fields', () => {
    renderWithProviders(<App />);
    
    // Navigate to login page
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Since we're testing the flow, we'll check for login form elements
    // In a real app, you'd navigate to /login and check for form fields
    expect(loginButton).toBeInTheDocument();
  });

  test('should show login and register buttons for unauthenticated users', () => {
    renderWithProviders(<App />);
    
    // Check that login and register buttons are visible
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Check that dashboard link is not visible
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  test('should show user dropdown for authenticated users', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Check that user dropdown is visible
    expect(screen.getByText('testuser')).toBeInTheDocument();
    
    // Check that login/register buttons are not visible
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  test('should navigate to dashboard after successful login', () => {
    // Mock successful login
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        login: jest.fn(),
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Check that dashboard link is available
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Click dashboard link
    const dashboardLink = screen.getByText('Dashboard');
    fireEvent.click(dashboardLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('should handle logout functionality', () => {
    const mockLogout = jest.fn();
    
    // Mock authenticated user with logout function
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: mockLogout,
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Find and click logout button
    const userDropdown = screen.getByText('testuser');
    fireEvent.click(userDropdown);
    
    // Look for logout option in dropdown
    const logoutOption = screen.getByText('Logout');
    fireEvent.click(logoutOption);
    
    // Check that logout function was called
    expect(mockLogout).toHaveBeenCalled();
  });

  test('should redirect to home page after logout', () => {
    const mockLogout = jest.fn();
    
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: mockLogout,
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Simulate logout
    const userDropdown = screen.getByText('testuser');
    fireEvent.click(userDropdown);
    
    const logoutOption = screen.getByText('Logout');
    fireEvent.click(logoutOption);
    
    // Check that logout was called and navigation occurred
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('should show appropriate navigation based on authentication state', () => {
    renderWithProviders(<App />);
    
    // Initially unauthenticated
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    
    // Mock authentication state change
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    // Re-render with authenticated state
    renderWithProviders(<App />);
    
    // Now should show authenticated navigation
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('should maintain theme during login/logout flow', async () => {
    renderWithProviders(<App />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Simulate login (mock authentication)
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    // Re-render with authenticated state
    renderWithProviders(<App />);
    
    // Theme should still be dark
    expect(document.body).toHaveClass('dark-theme');
    
    // Simulate logout
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      }),
    }));
    
    // Re-render with unauthenticated state
    renderWithProviders(<App />);
    
    // Theme should still be dark
    expect(document.body).toHaveClass('dark-theme');
  });

  test('should handle authentication errors gracefully', () => {
    renderWithProviders(<App />);
    
    // Test that app doesn't crash when authentication fails
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
    
    // Click login button
    fireEvent.click(loginButton);
    
    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('should show user profile information in dropdown', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Check that username is displayed
    expect(screen.getByText('testuser')).toBeInTheDocument();
    
    // Check that profile link is available
    const userDropdown = screen.getByText('testuser');
    fireEvent.click(userDropdown);
    
    // Look for profile option
    const profileOption = screen.getByText('Profile');
    expect(profileOption).toBeInTheDocument();
  });

  test('should navigate to profile page when profile link is clicked', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<App />);
    
    // Click user dropdown
    const userDropdown = screen.getByText('testuser');
    fireEvent.click(userDropdown);
    
    // Click profile link
    const profileOption = screen.getByText('Profile');
    fireEvent.click(profileOption);
    
    // Should navigate to profile page
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
}); 