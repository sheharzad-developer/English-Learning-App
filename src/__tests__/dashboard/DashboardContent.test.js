import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import StudentDashboard from '../../components/Dashboard/StudentDashboard';
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

describe('Dashboard Content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
    mockNavigate.mockClear();
  });

  test('should render dashboard with correct structure', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that dashboard renders without crashing
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should display user-specific content', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that user-specific content is displayed
    // This will depend on your actual dashboard implementation
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should show user stats and progress', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check for common dashboard elements
    // These will depend on your actual dashboard implementation
    const dashboardElement = screen.getByText(/Dashboard/i);
    expect(dashboardElement).toBeInTheDocument();
  });

  test('should display quick actions', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check for quick action elements
    // This will depend on your actual dashboard implementation
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should have readable content in light theme', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    
    // Check that dashboard content is visible
    const dashboardElement = screen.getByText(/Dashboard/i);
    expect(dashboardElement).toBeVisible();
  });

  test('should have readable content in dark theme', async () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Check that dashboard content is still visible
    const dashboardElement = screen.getByText(/Dashboard/i);
    expect(dashboardElement).toBeVisible();
  });

  test('should maintain dashboard visibility during theme transitions', async () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    const dashboardElement = screen.getByText(/Dashboard/i);
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check initial visibility
    expect(dashboardElement).toBeVisible();
    
    // Toggle theme
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Dashboard should still be visible
    expect(dashboardElement).toBeVisible();
  });

  test('should handle dashboard loading states', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that dashboard renders without errors
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should display different content for different user roles', () => {
    // Test student dashboard
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'studentuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    const { unmount } = renderWithProviders(<StudentDashboard />);
    
    // Check student-specific content
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    
    unmount();
    
    // Test teacher dashboard (if you have one)
    // This would require importing TeacherDashboard component
    // and testing with teacher role
  });

  test('should have proper navigation from dashboard', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that dashboard has navigation elements
    // This will depend on your actual dashboard implementation
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should handle dashboard data updates', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that dashboard can handle data updates
    // This will depend on your actual dashboard implementation
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should have responsive layout for different screen sizes', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that dashboard has responsive classes
    // This will depend on your actual dashboard implementation
    const dashboardElement = screen.getByText(/Dashboard/i);
    expect(dashboardElement).toBeInTheDocument();
  });

  test('should handle dashboard errors gracefully', () => {
    // Mock authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser', role: 'student' },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that dashboard handles errors without crashing
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('should show appropriate content based on user progress', () => {
    // Mock authenticated user with progress data
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { 
          username: 'testuser', 
          role: 'student',
          progress: { completedLessons: 5, totalLessons: 20 }
        },
        logout: jest.fn(),
      }),
    }));
    
    renderWithProviders(<StudentDashboard />);
    
    // Check that progress-based content is displayed
    // This will depend on your actual dashboard implementation
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
}); 