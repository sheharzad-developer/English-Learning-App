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

// Mock matchMedia for system preference
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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

describe('Theme Switching (Light/Dark Mode)', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset document body classes
    document.body.className = '';
  });

  test('should render app with light theme by default', () => {
    renderWithProviders(<App />);
    
    // Check that body has light theme class
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
    
    // Check that theme toggle button shows moon icon (indicating light mode)
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    expect(themeToggle).toBeInTheDocument();
    expect(themeToggle.querySelector('.bi-moon-fill')).toBeInTheDocument();
  });

  test('should toggle to dark theme when theme button is clicked', async () => {
    renderWithProviders(<App />);
    
    // Initially should be light theme
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
    
    // Click theme toggle button
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    // Wait for theme change
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      expect(document.body).not.toHaveClass('light-theme');
    });
    
    // Check that button now shows sun icon
    expect(screen.getByTitle('Switch to Light Mode')).toBeInTheDocument();
    expect(screen.getByTitle('Switch to Light Mode').querySelector('.bi-sun-fill')).toBeInTheDocument();
  });

  test('should toggle back to light theme when clicked again', async () => {
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // First click - switch to dark
    fireEvent.click(themeToggle);
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Second click - switch back to light
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
    
    // Toggle back to light
    const newThemeToggle = screen.getByTitle('Switch to Light Mode');
    fireEvent.click(newThemeToggle);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  test('should restore theme preference from localStorage on app load', () => {
    // Mock localStorage to return dark theme
    localStorageMock.getItem.mockReturnValue('dark');
    
    renderWithProviders(<App />);
    
    // Should start with dark theme
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
    expect(screen.getByTitle('Switch to Light Mode')).toBeInTheDocument();
  });

  test('should apply correct CSS variables for dark theme', async () => {
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Check that CSS custom properties are applied
    const computedStyle = getComputedStyle(document.body);
    expect(computedStyle.getPropertyValue('--bg-primary')).toBe('#121212');
    expect(computedStyle.getPropertyValue('--text-primary')).toBe('#ffffff');
  });

  test('should apply correct CSS variables for light theme', () => {
    renderWithProviders(<App />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    
    const computedStyle = getComputedStyle(document.body);
    expect(computedStyle.getPropertyValue('--bg-primary')).toBe('#ffffff');
    expect(computedStyle.getPropertyValue('--text-primary')).toBe('#212529');
  });

  test('should handle system preference when no localStorage value exists', () => {
    // Mock system preference to dark mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    renderWithProviders(<App />);
    
    // Should start with dark theme based on system preference
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
  });
}); 