import React, { useState } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { isDarkMode, themeMode, setTheme } = useTheme();
  const [show, setShow] = useState(false);

  const handleThemeChange = (mode) => {
    setTheme(mode);
    setShow(false);
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '🖥️';
      default:
        return '🖥️';
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  return (
    <Dropdown show={show} onToggle={setShow} className="theme-switcher">
      <Dropdown.Toggle 
        as={Button} 
        variant="outline-secondary" 
        size="sm"
        className="theme-toggle-btn"
        title={`Current theme: ${getThemeLabel()}`}
      >
        <span className="theme-icon">{getThemeIcon()}</span>
        <span className="theme-label d-none d-md-inline">{getThemeLabel()}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="theme-dropdown">
        <Dropdown.Header>Choose Theme</Dropdown.Header>
        <Dropdown.Divider />
        
        <Dropdown.Item 
          onClick={() => handleThemeChange('light')}
          className={themeMode === 'light' ? 'active' : ''}
        >
          <span className="theme-option">
            <span className="theme-icon">☀️</span>
            <span className="theme-text">
              <span className="theme-name">Light</span>
              <span className="theme-desc">Bright theme for daytime</span>
            </span>
          </span>
        </Dropdown.Item>
        
        <Dropdown.Item 
          onClick={() => handleThemeChange('dark')}
          className={themeMode === 'dark' ? 'active' : ''}
        >
          <span className="theme-option">
            <span className="theme-icon">🌙</span>
            <span className="theme-text">
              <span className="theme-name">Dark</span>
              <span className="theme-desc">Dark theme for nighttime</span>
            </span>
          </span>
        </Dropdown.Item>
        
        <Dropdown.Item 
          onClick={() => handleThemeChange('system')}
          className={themeMode === 'system' ? 'active' : ''}
        >
          <span className="theme-option">
            <span className="theme-icon">🖥️</span>
            <span className="theme-text">
              <span className="theme-name">System</span>
              <span className="theme-desc">Follows your OS setting</span>
            </span>
          </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ThemeSwitcher;
