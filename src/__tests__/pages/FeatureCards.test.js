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

describe('Feature Cards Section', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.body.className = '';
  });

  test('should render features section with correct structure', () => {
    renderWithProviders(<Home />);
    
    // Check section title
    expect(screen.getByText('Why Choose Our Platform?')).toBeInTheDocument();
    expect(screen.getByText('Why Choose Our Platform?')).toHaveClass('text-center', 'mb-5', 'fw-bold');
    
    // Check features section container
    const featuresSection = screen.getByText('Why Choose Our Platform?').closest('section');
    expect(featuresSection).toHaveClass('features-section');
  });

  test('should display all feature cards with correct content', () => {
    renderWithProviders(<Home />);
    
    // Check all feature titles
    expect(screen.getByText('Interactive Learning')).toBeInTheDocument();
    expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    
    // Check feature descriptions
    expect(screen.getByText(/Engage with dynamic content and real-time feedback/)).toBeInTheDocument();
    expect(screen.getByText(/Monitor your learning journey with detailed analytics/)).toBeInTheDocument();
    expect(screen.getByText(/Earn badges and rewards as you complete milestones/)).toBeInTheDocument();
    expect(screen.getByText(/Connect with fellow learners and share experiences/)).toBeInTheDocument();
  });

  test('should have correct icon circles for each feature', () => {
    renderWithProviders(<Home />);
    
    // Check that icon circles exist and have correct classes
    const iconCircles = document.querySelectorAll('.icon-circle');
    expect(iconCircles).toHaveLength(4);
    
    // Check specific icon classes
    iconCircles.forEach(circle => {
      expect(circle).toHaveClass('icon-circle', 'mb-3', 'text-white', 'mx-auto');
    });
    
    // Check background colors for different features
    const interactiveCircle = screen.getByText('Interactive Learning').previousElementSibling;
    const progressCircle = screen.getByText('Progress Tracking').previousElementSibling;
    const achievementsCircle = screen.getByText('Achievements').previousElementSibling;
    const communityCircle = screen.getByText('Community').previousElementSibling;
    
    expect(interactiveCircle).toHaveClass('bg-info');
    expect(progressCircle).toHaveClass('bg-success');
    expect(achievementsCircle).toHaveClass('bg-warning');
    expect(communityCircle).toHaveClass('bg-danger');
  });

  test('should have proper card styling and layout', () => {
    renderWithProviders(<Home />);
    
    // Check that features are in a grid layout
    const featuresContainer = screen.getByText('Why Choose Our Platform?').closest('.container');
    const featuresRow = featuresContainer.querySelector('.row');
    
    expect(featuresRow).toHaveClass('g-4');
    
    // Check column classes for responsive behavior
    const featureColumns = featuresRow.querySelectorAll('.col-md-6, .col-lg-3');
    expect(featureColumns.length).toBeGreaterThan(0);
  });

  test('should have readable text colors in light theme', () => {
    renderWithProviders(<Home />);
    
    // Should start with light theme
    expect(document.body).toHaveClass('light-theme');
    
    // Check feature titles
    const interactiveTitle = screen.getByText('Interactive Learning');
    const progressTitle = screen.getByText('Progress Tracking');
    const achievementsTitle = screen.getByText('Achievements');
    const communityTitle = screen.getByText('Community');
    
    // All titles should be visible
    expect(interactiveTitle).toBeVisible();
    expect(progressTitle).toBeVisible();
    expect(achievementsTitle).toBeVisible();
    expect(communityTitle).toBeVisible();
    
    // Check that titles have proper styling
    expect(interactiveTitle).toHaveClass('h5');
    expect(progressTitle).toHaveClass('h5');
    expect(achievementsTitle).toHaveClass('h5');
    expect(communityTitle).toHaveClass('h5');
  });

  test('should have readable text colors in dark theme', async () => {
    renderWithProviders(<Home />);
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Check feature titles are still visible
    const interactiveTitle = screen.getByText('Interactive Learning');
    const progressTitle = screen.getByText('Progress Tracking');
    const achievementsTitle = screen.getByText('Achievements');
    const communityTitle = screen.getByText('Community');
    
    expect(interactiveTitle).toBeVisible();
    expect(progressTitle).toBeVisible();
    expect(achievementsTitle).toBeVisible();
    expect(communityTitle).toBeVisible();
    
    // Check that text has sufficient contrast
    const titleStyle = getComputedStyle(interactiveTitle);
    expect(titleStyle.color).not.toBe('transparent');
  });

  test('should have proper muted text styling in both themes', () => {
    renderWithProviders(<Home />);
    
    // Check muted text elements
    const mutedTexts = screen.getAllByText(/text-muted/);
    
    mutedTexts.forEach(text => {
      expect(text).toHaveClass('text-muted');
      expect(text).toBeVisible();
    });
    
    // Toggle to dark theme
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(themeToggle);
    
    waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
      
      // Muted text should still be visible
      mutedTexts.forEach(text => {
        expect(text).toBeVisible();
      });
    });
  });

  test('should have responsive layout for different screen sizes', () => {
    renderWithProviders(<Home />);
    
    const featuresSection = screen.getByText('Why Choose Our Platform?').closest('section');
    const container = featuresSection.querySelector('.container');
    const row = container.querySelector('.row');
    
    // Check responsive classes
    expect(row).toHaveClass('g-4');
    
    // Check that features are properly distributed in columns
    const featureElements = screen.getAllByText(/Interactive Learning|Progress Tracking|Achievements|Community/);
    expect(featureElements).toHaveLength(4);
  });

  test('should maintain feature cards visibility during theme transitions', async () => {
    renderWithProviders(<Home />);
    
    const featuresSection = screen.getByText('Why Choose Our Platform?').closest('section');
    const themeToggle = screen.getByTitle('Switch to Dark Mode');
    
    // Check initial visibility
    expect(featuresSection).toBeVisible();
    expect(screen.getByText('Interactive Learning')).toBeVisible();
    
    // Toggle theme
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    // Feature cards should still be visible
    expect(featuresSection).toBeVisible();
    expect(screen.getByText('Interactive Learning')).toBeVisible();
  });

  test('should have proper spacing and alignment', () => {
    renderWithProviders(<Home />);
    
    const featuresSection = screen.getByText('Why Choose Our Platform?').closest('section');
    
    // Check padding classes
    expect(featuresSection).toHaveClass('py-5');
    
    // Check that features are centered
    const sectionTitle = screen.getByText('Why Choose Our Platform?');
    expect(sectionTitle).toHaveClass('text-center');
    
    // Check that feature content is centered
    const featureDivs = document.querySelectorAll('.text-center');
    expect(featureDivs.length).toBeGreaterThan(0);
  });

  test('should have proper icon sizing and styling', () => {
    renderWithProviders(<Home />);
    
    // Check that icons have correct sizing
    const icons = document.querySelectorAll('.bi');
    icons.forEach(icon => {
      expect(icon).toHaveClass('fs-2');
    });
    
    // Check that icon circles have proper styling
    const iconCircles = document.querySelectorAll('.icon-circle');
    iconCircles.forEach(circle => {
      expect(circle).toHaveClass('mb-3', 'text-white', 'mx-auto');
    });
  });

  test('should have distinct visual hierarchy', () => {
    renderWithProviders(<Home />);
    
    // Check section title hierarchy
    const sectionTitle = screen.getByText('Why Choose Our Platform?');
    expect(sectionTitle.tagName).toBe('H2');
    expect(sectionTitle).toHaveClass('fw-bold');
    
    // Check feature title hierarchy
    const featureTitles = screen.getAllByText(/Interactive Learning|Progress Tracking|Achievements|Community/);
    featureTitles.forEach(title => {
      expect(title.tagName).toBe('H5');
    });
  });
}); 