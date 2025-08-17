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

// Helper function to simulate different screen sizes
const setViewport = (width, height) => {
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
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

describe('Responsiveness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
  });

  test('should render correctly on desktop screen size', () => {
    setViewport(1920, 1080);
    
    renderWithProviders(<App />);
    
    // Check that all main elements are visible
    expect(screen.getByText('English Learning')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    
    // Check that navbar is properly displayed
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeVisible();
  });

  test('should render correctly on tablet screen size', () => {
    setViewport(768, 1024);
    
    renderWithProviders(<App />);
    
    // Check that all main elements are visible
    expect(screen.getByText('English Learning')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    
    // Check that navbar is properly displayed
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeVisible();
  });

  test('should render correctly on mobile screen size', () => {
    setViewport(375, 667);
    
    renderWithProviders(<App />);
    
    // Check that all main elements are visible
    expect(screen.getByText('English Learning')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    
    // Check that navbar is properly displayed
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeVisible();
  });

  test('should have responsive navbar toggle on mobile', () => {
    setViewport(375, 667);
    
    renderWithProviders(<AppNavbar />);
    
    // Check that navbar toggle button exists
    const navbarToggle = screen.getByRole('button', { name: /toggle navigation/i });
    expect(navbarToggle).toBeInTheDocument();
    expect(navbarToggle).toHaveClass('navbar-toggler');
  });

  test('should have responsive grid layout on home page', () => {
    setViewport(1920, 1080);
    
    renderWithProviders(<Home />);
    
    // Check that hero section has responsive classes
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

  test('should have responsive feature cards layout', () => {
    setViewport(1920, 1080);
    
    renderWithProviders(<Home />);
    
    // Check features section responsive layout
    const featuresSection = screen.getByText('Why Choose Our Platform?').closest('section');
    const container = featuresSection.querySelector('.container');
    const row = container.querySelector('.row');
    
    // Check responsive classes
    expect(row).toHaveClass('g-4');
    
    // Check that features are properly distributed in columns
    const featureElements = screen.getAllByText(/Interactive Learning|Progress Tracking|Achievements|Community/);
    expect(featureElements).toHaveLength(4);
  });

  test('should maintain functionality across screen sizes', () => {
    const screenSizes = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 375, height: 667, name: 'mobile' },
      { width: 320, height: 568, name: 'small-mobile' },
    ];
    
    screenSizes.forEach(({ width, height, name }) => {
      setViewport(width, height);
      
      renderWithProviders(<App />);
      
      // Check that theme toggle works on all screen sizes
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      expect(themeToggle).toBeInTheDocument();
      expect(themeToggle).toBeVisible();
      
      // Check that navigation elements are accessible
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
  });

  test('should have proper text sizing across screen sizes', () => {
    const screenSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    screenSizes.forEach(({ width, height }) => {
      setViewport(width, height);
      
      renderWithProviders(<Home />);
      
      // Check that text is readable on all screen sizes
      const heroTitle = screen.getByText('Unlock Your English Potential');
      const heroSubtitle = screen.getByText(/Interactive lessons, quizzes, and progress tracking/);
      
      expect(heroTitle).toBeVisible();
      expect(heroSubtitle).toBeVisible();
    });
  });

  test('should have responsive button sizing', () => {
    const screenSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    screenSizes.forEach(({ width, height }) => {
      setViewport(width, height);
      
      renderWithProviders(<Home />);
      
      // Check that buttons are properly sized
      const getStartedButton = screen.getByText('Get Started');
      expect(getStartedButton).toBeVisible();
      expect(getStartedButton).toHaveClass('btn-lg');
    });
  });

  test('should handle navbar collapse on mobile', () => {
    setViewport(375, 667);
    
    renderWithProviders(<AppNavbar />);
    
    // Check that navbar toggle exists
    const navbarToggle = screen.getByRole('button', { name: /toggle navigation/i });
    expect(navbarToggle).toBeInTheDocument();
    
    // Check that navbar collapse container exists
    const navbarCollapse = document.getElementById('main-navbar-nav');
    expect(navbarCollapse).toBeInTheDocument();
    expect(navbarCollapse).toHaveClass('navbar-collapse');
  });

  test('should have proper spacing on different screen sizes', () => {
    const screenSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    screenSizes.forEach(({ width, height }) => {
      setViewport(width, height);
      
      renderWithProviders(<Home />);
      
      // Check that sections have proper padding
      const heroSection = screen.getByText('Unlock Your English Potential').closest('section');
      const featuresSection = screen.getByText('Why Choose Our Platform?').closest('section');
      
      expect(heroSection).toHaveClass('py-5');
      expect(featuresSection).toHaveClass('py-5');
    });
  });

  test('should maintain theme functionality across screen sizes', async () => {
    const screenSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    for (const { width, height } of screenSizes) {
      setViewport(width, height);
      
      renderWithProviders(<App />);
      
      // Toggle theme
      const themeToggle = screen.getByTitle('Switch to Dark Mode');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        expect(document.body).toHaveClass('dark-theme');
      });
      
      // Check that theme toggle still works
      const newThemeToggle = screen.getByTitle('Switch to Light Mode');
      expect(newThemeToggle).toBeInTheDocument();
    }
  });

  test('should have proper image scaling', () => {
    const screenSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    screenSizes.forEach(({ width, height }) => {
      setViewport(width, height);
      
      renderWithProviders(<Home />);
      
      // Check that hero image is properly scaled
      const heroImage = screen.getByAltText('English Learning Illustration');
      expect(heroImage).toBeInTheDocument();
      expect(heroImage).toHaveClass('img-fluid');
    });
  });

  test('should handle overflow properly on small screens', () => {
    setViewport(320, 568);
    
    renderWithProviders(<App />);
    
    // Check that content doesn't overflow horizontally
    const body = document.body;
    const bodyStyle = getComputedStyle(body);
    
    // Check that there's no horizontal overflow
    expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth);
  });

  test('should have accessible touch targets on mobile', () => {
    setViewport(375, 667);
    
    renderWithProviders(<App />);
    
    // Check that buttons have appropriate sizing for touch
    const loginButton = screen.getByText('Login');
    const registerButton = screen.getByText('Register');
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check that buttons are visible and clickable
    expect(loginButton).toBeVisible();
    expect(registerButton).toBeVisible();
    expect(themeToggle).toBeVisible();
    
    // Check button sizes (should be at least 44px for touch targets)
    const loginStyle = getComputedStyle(loginButton);
    const registerStyle = getComputedStyle(registerButton);
    
    expect(parseInt(loginStyle.minHeight) || parseInt(loginStyle.height)).toBeGreaterThanOrEqual(44);
    expect(parseInt(registerStyle.minHeight) || parseInt(registerStyle.height)).toBeGreaterThanOrEqual(44);
  });
}); 