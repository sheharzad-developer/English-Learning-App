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

describe('Persistence of Theme Preference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.className = '';
  });

  test('should save theme preference to localStorage when toggled', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    // Initially should be light theme
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  test('should restore dark theme preference from localStorage on app load', () => {
    // Mock localStorage to return dark theme
    localStorageMock.getItem.mockReturnValue('dark');
    
    renderWithProviders(<App />);
    
    // Should start with dark theme
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
    
    // Theme toggle should show sun icon (indicating dark mode)
    expect(screen.getByTitle('Switch to Light Mode')).toBeInTheDocument();
    expect(screen.getByTitle('Switch to Light Mode').querySelector('.bi-sun-fill')).toBeInTheDocument();
  });

  test('should restore light theme preference from localStorage on app load', () => {
    // Mock localStorage to return light theme
    localStorageMock.getItem.mockReturnValue('light');
    
    renderWithProviders(<App />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
    
    // Theme toggle should show moon icon (indicating light mode)
    expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();
    expect(screen.getByTitle('Switch to Dark Mode').querySelector('.bi-moon-fill')).toBeInTheDocument();
  });

  test('should persist theme preference across multiple toggles', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // First toggle - light to dark
    fireEvent.click(themeToggle);
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
    
    // Second toggle - dark to light
    const newThemeToggle = screen.getByTitle('Switch to Light Mode');
    fireEvent.click(newThemeToggle);
    await waitFor(() => {
      expect(document.body).toHaveClass('light-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
    
    // Third toggle - light to dark again
    const thirdThemeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(thirdThemeToggle);
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  test('should handle invalid localStorage values gracefully', () => {
    // Mock localStorage to return invalid value
    localStorageMock.getItem.mockReturnValue('invalid-theme');
    
    renderWithProviders(<App />);
    
    // Should fall back to light theme
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
  });

  test('should use system preference when no localStorage value exists', () => {
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
    
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    // Should start with dark theme based on system preference
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
  });

  test('should prioritize localStorage over system preference', () => {
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
    
    // Mock localStorage to return light theme
    localStorageMock.getItem.mockReturnValue('light');
    
    renderWithProviders(<App />);
    
    // Should use localStorage value (light) over system preference (dark)
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
  });

  test('should persist theme during page refresh simulation', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { unmount } = renderWithProviders(<App />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
    
    // Simulate page refresh by unmounting and remounting
    unmount();
    
    // Mock localStorage to return the saved dark theme
    localStorageMock.getItem.mockReturnValue('dark');
    
    // Re-render the app
    renderWithProviders(<App />);
    
    // Should restore dark theme
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
    expect(screen.getByTitle('Switch to Light Mode')).toBeInTheDocument();
  });

  test('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    
    renderWithProviders(<App />);
    
    // Should still render with default theme
    expect(document.body).toHaveClass('light-theme');
    expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();
  });

  test('should maintain theme preference during authentication state changes', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
    
    // Theme should persist even when auth state changes
    expect(document.body).toHaveClass('dark-theme');
  });

  test('should save theme preference immediately on toggle', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check that localStorage is called immediately on toggle
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
    
    // Verify the call was made exactly once
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
  });

  test('should handle multiple rapid theme toggles correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Rapidly toggle theme multiple times
    fireEvent.click(themeToggle);
    fireEvent.click(screen.getByTitle('Switch to Light Mode'));
    fireEvent.click(screen.getByTitle('Switch to Dark Mode'));
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Should have saved the final state
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  test('should persist theme across different components', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProviders(<App />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Theme should be applied to all components
    expect(document.body).toHaveClass('dark-theme');
    
    // Check that CSS variables are applied
    const computedStyle = getComputedStyle(document.body);
    expect(computedStyle.getPropertyValue('--bg-primary')).toBe('#121212');
    expect(computedStyle.getPropertyValue('--text-primary')).toBe('#ffffff');
  });
}); 