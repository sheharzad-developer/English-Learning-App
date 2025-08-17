# English Learning App - Test Suite

This directory contains comprehensive tests for the English Learning App, covering all the test cases outlined in the requirements.

## Test Structure

The tests are organized into the following directories:

### `/theme/`
- **ThemeSwitching.test.js** - Tests for light/dark mode toggling functionality
- **ThemePersistence.test.js** - Tests for theme preference persistence across sessions

### `/navigation/`
- **NavbarVisibility.test.js** - Tests for navbar visibility and styling in both themes

### `/pages/`
- **HomePageHero.test.js** - Tests for home page hero section readability and visual appeal
- **FeatureCards.test.js** - Tests for feature cards section visibility and styling

### `/components/`
- **CardMutedText.test.js** - Tests for muted text visibility in cards across both themes

### `/auth/`
- **LoginLogoutFlow.test.js** - Tests for login/logout functionality and user flow

### `/dashboard/`
- **DashboardContent.test.js** - Tests for dashboard content functionality and visibility

### `/responsiveness/**
- **Responsiveness.test.js** - Tests for UI responsiveness across different screen sizes

### `/accessibility/**
- **Accessibility.test.js** - Tests for accessibility features including keyboard navigation and screen reader support

### Root Level
- **testRunner.js** - Comprehensive test suite that runs all major functionality tests

## Test Coverage

The test suite covers all 10 test cases from the requirements:

1. **Theme Switching (Light/Dark Mode)** ✅
   - Toggle between light and dark themes
   - Visual changes and CSS variable application
   - Theme persistence across sessions

2. **Navigation Bar Visibility** ✅
   - Navbar visibility in both themes
   - Correct colors and contrast
   - Navigation links functionality

3. **Home Page Hero Section** ✅
   - Hero section readability in both themes
   - Title, subtitle, and button visibility
   - Proper color contrast

4. **Feature Cards Section** ✅
   - Feature cards visibility in both themes
   - Card titles, icons, and descriptions
   - Visual distinctness

5. **Card Muted Text** ✅
   - Muted text visibility in both themes
   - Proper contrast and readability
   - Text styling consistency

6. **Login/Logout Flow** ✅
   - User authentication flow
   - Navigation between pages
   - UI updates based on auth state

7. **Dashboard Content** ✅
   - User-specific content display
   - Stats, progress, and quick actions
   - Readability in both themes

8. **Responsiveness** ✅
   - UI adaptation to different screen sizes
   - Mobile, tablet, and desktop layouts
   - No overflow or layout issues

9. **Accessibility** ✅
   - Screen reader support
   - Keyboard navigation
   - ARIA labels and focus states

10. **Persistence of Theme Preference** ✅
    - Theme preference saved to localStorage
    - Restoration on page refresh
    - System preference fallback

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
# Run theme tests
npm test -- --testPathPattern=theme

# Run navigation tests
npm test -- --testPathPattern=navigation

# Run accessibility tests
npm test -- --testPathPattern=accessibility

# Run responsiveness tests
npm test -- --testPathPattern=responsiveness
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Comprehensive Test Suite
```bash
npm test -- --testPathPattern=testRunner
```

## Test Configuration

The tests use the following configuration:

- **Testing Library**: React Testing Library for component testing
- **Jest**: JavaScript testing framework
- **Mocking**: localStorage, useNavigate, axios, and matchMedia are mocked
- **Providers**: Tests are wrapped with ThemeProvider and AuthProvider

## Mock Setup

### localStorage Mock
```javascript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

### Navigation Mock
```javascript
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
```

### Theme Provider Setup
```javascript
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
```

## Test Patterns

### Theme Testing Pattern
```javascript
test('should have correct colors in dark theme', async () => {
  renderWithProviders(<Component />);
  
  // Toggle to dark theme
  const themeToggle = screen.getByTitle('Switch to Dark Mode');
  fireEvent.click(themeToggle);
  
  await waitFor(() => {
    expect(document.body).toHaveClass('dark-theme');
  });
  
  // Test component behavior in dark theme
  expect(component).toBeVisible();
});
```

### Responsiveness Testing Pattern
```javascript
test('should render correctly on mobile', () => {
  setViewport(375, 667);
  renderWithProviders(<Component />);
  
  expect(screen.getByText('Content')).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeVisible();
});
```

### Accessibility Testing Pattern
```javascript
test('should support keyboard navigation', () => {
  renderWithProviders(<Component />);
  
  const element = screen.getByRole('button');
  element.focus();
  expect(element).toHaveFocus();
  
  fireEvent.keyDown(element, { key: 'Enter' });
  // Test expected behavior
});
```

## Best Practices

1. **Clean Setup**: Each test starts with a clean state using `beforeEach`
2. **Proper Mocking**: All external dependencies are properly mocked
3. **Accessibility First**: Tests include accessibility considerations
4. **Theme Coverage**: All tests verify behavior in both light and dark themes
5. **Responsive Testing**: Tests cover multiple screen sizes
6. **Integration Testing**: Tests verify component interactions

## Troubleshooting

### Common Issues

1. **Theme not applying**: Ensure ThemeProvider is properly wrapped
2. **Navigation not working**: Check that useNavigate is properly mocked
3. **localStorage errors**: Verify localStorage mock is set up correctly
4. **Async test failures**: Use `waitFor` for asynchronous operations

### Debug Mode
```bash
npm test -- --verbose
```

### Update Snapshots
```bash
npm test -- --updateSnapshot
```

## Contributing

When adding new tests:

1. Follow the existing test patterns
2. Include both light and dark theme tests
3. Test accessibility features
4. Test responsive behavior
5. Use descriptive test names
6. Add proper error handling tests

## Test Results

The test suite should provide:
- ✅ All tests passing
- ✅ Good coverage of functionality
- ✅ Accessibility compliance
- ✅ Responsive design validation
- ✅ Theme switching validation
- ✅ User flow validation 