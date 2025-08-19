import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveExerciseDemo from '../../components/Exercises/InteractiveExerciseDemo';

// Mock the child components
jest.mock('../../components/Exercises/QuizComponent', () => {
  return function MockQuizComponent({ quizData, onComplete }) {
    return (
      <div data-testid="quiz-component">
        <h3>{quizData.title}</h3>
        <button onClick={() => onComplete({ score: 85, totalQuestions: 5, correctAnswers: 4 })}>
          Complete Quiz
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Exercises/MatchingExercise', () => {
  return function MockMatchingExercise({ exerciseData, onComplete }) {
    return (
      <div data-testid="matching-exercise">
        <h3>{exerciseData.title}</h3>
        <button onClick={() => onComplete({ score: 90, totalMatches: 3, correctMatches: 3 })}>
          Complete Matching
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Exercises/FillInBlankExercise', () => {
  return function MockFillInBlankExercise({ exerciseData, onComplete }) {
    return (
      <div data-testid="fill-blank-exercise">
        <h3>{exerciseData.title}</h3>
        <button onClick={() => onComplete({ score: 75, totalBlanks: 4, correctBlanks: 3 })}>
          Complete Fill-in-Blank
        </button>
      </div>
    );
  };
});

describe('InteractiveExerciseDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders demo title and description', () => {
    render(<InteractiveExerciseDemo />);
    
    expect(screen.getByText('Interactive Exercise Demo')).toBeInTheDocument();
    expect(screen.getByText(/Explore different types of interactive exercises/)).toBeInTheDocument();
  });

  test('renders navigation tabs', () => {
    render(<InteractiveExerciseDemo />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Matching')).toBeInTheDocument();
    expect(screen.getByText('Fill-in-Blanks')).toBeInTheDocument();
  });

  test('shows overview tab by default', () => {
    render(<InteractiveExerciseDemo />);
    
    expect(screen.getByText('Exercise Types')).toBeInTheDocument();
    expect(screen.getByText('Multiple Choice Quiz')).toBeInTheDocument();
    expect(screen.getByText('Drag & Drop Matching')).toBeInTheDocument();
    expect(screen.getByText('Fill-in-the-Blanks')).toBeInTheDocument();
  });

  test('displays progress statistics in overview', () => {
    render(<InteractiveExerciseDemo />);
    
    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // Initial progress
    expect(screen.getByText('Average Score')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // Initial score
  });

  test('switches to quiz tab when clicked', () => {
    render(<InteractiveExerciseDemo />);
    
    const quizTab = screen.getByText('Quiz');
    fireEvent.click(quizTab);
    
    expect(screen.getByTestId('quiz-component')).toBeInTheDocument();
    expect(screen.getByText('English Grammar Quiz')).toBeInTheDocument();
  });

  test('switches to matching tab when clicked', () => {
    render(<InteractiveExerciseDemo />);
    
    const matchingTab = screen.getByText('Matching');
    fireEvent.click(matchingTab);
    
    expect(screen.getByTestId('matching-exercise')).toBeInTheDocument();
    expect(screen.getByText('Word-Definition Matching')).toBeInTheDocument();
  });

  test('switches to fill-in-blanks tab when clicked', () => {
    render(<InteractiveExerciseDemo />);
    
    const fillBlankTab = screen.getByText('Fill-in-Blanks');
    fireEvent.click(fillBlankTab);
    
    expect(screen.getByTestId('fill-blank-exercise')).toBeInTheDocument();
    expect(screen.getByText('Complete the Story')).toBeInTheDocument();
  });

  test('updates progress when quiz is completed', async () => {
    render(<InteractiveExerciseDemo />);
    
    // Switch to quiz tab
    const quizTab = screen.getByText('Quiz');
    fireEvent.click(quizTab);
    
    // Complete the quiz
    const completeButton = screen.getByText('Complete Quiz');
    fireEvent.click(completeButton);
    
    // Switch back to overview to see updated progress
    const overviewTab = screen.getByText('Overview');
    fireEvent.click(overviewTab);
    
    await waitFor(() => {
      expect(screen.getByText('33%')).toBeInTheDocument(); // 1/3 exercises completed
    });
  });

  test('updates average score when exercises are completed', async () => {
    render(<InteractiveExerciseDemo />);
    
    // Complete quiz
    const quizTab = screen.getByText('Quiz');
    fireEvent.click(quizTab);
    fireEvent.click(screen.getByText('Complete Quiz'));
    
    // Complete matching
    const matchingTab = screen.getByText('Matching');
    fireEvent.click(matchingTab);
    fireEvent.click(screen.getByText('Complete Matching'));
    
    // Switch to overview
    const overviewTab = screen.getByText('Overview');
    fireEvent.click(overviewTab);
    
    await waitFor(() => {
      // Average of 85% and 90% = 87.5%, rounded to 88%
      expect(screen.getByText('88%')).toBeInTheDocument();
    });
  });

  test('shows completion status for exercises', async () => {
    render(<InteractiveExerciseDemo />);
    
    // Complete quiz
    const quizTab = screen.getByText('Quiz');
    fireEvent.click(quizTab);
    fireEvent.click(screen.getByText('Complete Quiz'));
    
    // Switch to overview
    const overviewTab = screen.getByText('Overview');
    fireEvent.click(overviewTab);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Completed')).toBeInTheDocument();
    });
  });

  test('shows not completed status for unfinished exercises', () => {
    render(<InteractiveExerciseDemo />);
    
    // Should show "Not Completed" for all exercises initially
    const notCompletedElements = screen.getAllByText('Not Completed');
    expect(notCompletedElements).toHaveLength(3);
  });

  test('displays exercise descriptions in overview', () => {
    render(<InteractiveExerciseDemo />);
    
    expect(screen.getByText(/Test your knowledge with multiple choice questions/)).toBeInTheDocument();
    expect(screen.getByText(/Match words with their definitions/)).toBeInTheDocument();
    expect(screen.getByText(/Complete sentences by filling in missing words/)).toBeInTheDocument();
  });

  test('shows congratulations message when all exercises are completed', async () => {
    render(<InteractiveExerciseDemo />);
    
    // Complete all exercises
    const exercises = ['Quiz', 'Matching', 'Fill-in-Blanks'];
    const completeButtons = ['Complete Quiz', 'Complete Matching', 'Complete Fill-in-Blank'];
    
    for (let i = 0; i < exercises.length; i++) {
      const tab = screen.getByText(exercises[i]);
      fireEvent.click(tab);
      fireEvent.click(screen.getByText(completeButtons[i]));
    }
    
    // Switch to overview
    const overviewTab = screen.getByText('Overview');
    fireEvent.click(overviewTab);
    
    await waitFor(() => {
      expect(screen.getByText('🎉 Congratulations!')).toBeInTheDocument();
    });
    
    expect(screen.getByText('You have completed all exercises!')).toBeInTheDocument();
  });

  test('maintains active tab state correctly', () => {
    render(<InteractiveExerciseDemo />);
    
    // Initially overview should be active
    const overviewTab = screen.getByRole('button', { name: 'Overview' });
    expect(overviewTab).toHaveClass('active');
    
    // Click quiz tab
    const quizTab = screen.getByRole('button', { name: 'Quiz' });
    fireEvent.click(quizTab);
    expect(quizTab).toHaveClass('active');
    expect(overviewTab).not.toHaveClass('active');
  });

  test('handles exercise completion callbacks correctly', async () => {
    render(<InteractiveExerciseDemo />);
    
    // Complete quiz and verify result is stored
    const quizTab = screen.getByText('Quiz');
    fireEvent.click(quizTab);
    fireEvent.click(screen.getByText('Complete Quiz'));
    
    // Switch to overview and verify the score is reflected
    const overviewTab = screen.getByText('Overview');
    fireEvent.click(overviewTab);
    
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument(); // Quiz score
    });
  });

  test('calculates progress percentage correctly', async () => {
    render(<InteractiveExerciseDemo />);
    
    // Complete 2 out of 3 exercises
    const quizTab = screen.getByText('Quiz');
    fireEvent.click(quizTab);
    fireEvent.click(screen.getByText('Complete Quiz'));
    
    const matchingTab = screen.getByText('Matching');
    fireEvent.click(matchingTab);
    fireEvent.click(screen.getByText('Complete Matching'));
    
    // Switch to overview
    const overviewTab = screen.getByText('Overview');
    fireEvent.click(overviewTab);
    
    await waitFor(() => {
      expect(screen.getByText('67%')).toBeInTheDocument(); // 2/3 = 67%
    });
  });

  test('renders exercise cards with proper styling', () => {
    render(<InteractiveExerciseDemo />);
    
    const exerciseCards = screen.getAllByText(/Test your knowledge|Match words|Complete sentences/);
    expect(exerciseCards).toHaveLength(3);
    
    // Each card should have its title
    expect(screen.getByText('Multiple Choice Quiz')).toBeInTheDocument();
    expect(screen.getByText('Drag & Drop Matching')).toBeInTheDocument();
    expect(screen.getByText('Fill-in-the-Blanks')).toBeInTheDocument();
  });
});