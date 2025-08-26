import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return themeMode === 'dark';
  });

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      if (themeMode === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeMode]);

  // Update dark mode when theme mode changes
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDarkMode(themeMode === 'dark');
    }
  }, [themeMode]);

  const setTheme = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('theme', mode);
  };

  const toggleTheme = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setTheme(newMode);
  };

  useEffect(() => {
    // Apply theme to document
    const html = document.documentElement;
    html.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document body
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    themeMode,
    setTheme,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 