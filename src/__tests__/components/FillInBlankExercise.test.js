import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FillInBlankExercise from '../../components/Exercises/FillInBlankExercise';

// Mock data for testing
const mockExerciseData = {
  title: 'Complete the Sentences',
  description: 'Fill in the blanks with the correct words',
  timeLimit: 240, // 4 minutes
  text: 'The cat ___ on the mat. She ___ very happy. The weather ___ nice today.',
  blanks: [
    {
      id: 1,
      position: 8, // position in text
      correctAnswers: ['sat', 'sits'],
      caseSensitive: false,
      explanation: 'Past tense of sit'
    },
    {
      id: 2,
      position: 25,
      correctAnswers: ['was', 'is'],
      caseSensitive: false,
      explanation: 'Linking verb'
    },
    {
      id: 3,
      position: 45,
      correctAnswers: ['is', 'was'],
      caseSensitive: false,
      explanation: 'Present tense of be'
    }
  ],
  wordBank: ['sat', 'was', 'is', 'happy', 'nice'],
  hints: [
    'Think about past and present tense',
    'Consider the subject-verb agreement',
    'Look at the time indicators'
  ],
  autoCheck: true
};

describe('FillInBlankExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders exercise title and description', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText('Complete the Sentences')).toBeInTheDocument();
    expect(screen.getByText('Fill in the blanks with the correct words')).toBeInTheDocument();
  });

  test('displays timer when time limit is set', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText(/Time Remaining:/)).toBeInTheDocument();
    expect(screen.getByText(/04:00/)).toBeInTheDocument();
  });

  test('shows progress indicator', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText('Progress: 0/3 completed')).toBeInTheDocument();
  });

  test('renders text with input fields for blanks', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText(/The cat/)).toBeInTheDocument();
    expect(screen.getByText(/on the mat/)).toBeInTheDocument();
    
    // Should have 3 input fields for blanks
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
  });

  test('displays word bank when provided', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText('Word Bank')).toBeInTheDocument();
    expect(screen.getByText('sat')).toBeInTheDocument();
    expect(screen.getByText('was')).toBeInTheDocument();
    expect(screen.getByText('is')).toBeInTheDocument();
  });

  test('allows typing in blank fields', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    
    fireEvent.change(firstInput, { target: { value: 'sat' } });
    expect(firstInput.value).toBe('sat');
  });

  test('shows hint button and displays hints', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const hintButton = screen.getByText('Show Hint');
    expect(hintButton).toBeInTheDocument();
    
    fireEvent.click(hintButton);
    
    expect(screen.getByText('Think about past and present tense')).toBeInTheDocument();
  });

  test('provides auto-checking when enabled', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    
    fireEvent.change(firstInput, { target: { value: 'sat' } });
    fireEvent.blur(firstInput);
    
    // Should show correct feedback
    expect(firstInput).toHaveClass('correct');
  });

  test('shows incorrect feedback for wrong answers', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    
    fireEvent.change(firstInput, { target: { value: 'wrong' } });
    fireEvent.blur(firstInput);
    
    // Should show incorrect feedback
    expect(firstInput).toHaveClass('incorrect');
  });

  test('handles case insensitive answers', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    
    fireEvent.change(firstInput, { target: { value: 'SAT' } });
    fireEvent.blur(firstInput);
    
    // Should be correct despite different case
    expect(firstInput).toHaveClass('correct');
  });

  test('disables submit button when not all blanks are filled', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const submitButton = screen.getByText('Submit Answers');
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when all blanks are filled', () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    
    const submitButton = screen.getByText('Submit Answers');
    expect(submitButton).not.toBeDisabled();
  });

  test('shows results after submission', async () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Fill all blanks with correct answers
    fireEvent.change(inputs[0], { target: { value: 'sat' } });
    fireEvent.change(inputs[1], { target: { value: 'was' } });
    fireEvent.change(inputs[2], { target: { value: 'is' } });
    
    const submitButton = screen.getByText('Submit Answers');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Exercise Complete!')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Your Score:/)).toBeInTheDocument();
  });

  test('shows review modal with explanations', async () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    
    const submitButton = screen.getByText('Submit Answers');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Review Answers')).toBeInTheDocument();
    });
    
    const reviewButton = screen.getByText('Review Answers');
    fireEvent.click(reviewButton);
    
    expect(screen.getByText('Past tense of sit')).toBeInTheDocument();
  });

  test('handles exercise without word bank', () => {
    const exerciseWithoutWordBank = { ...mockExerciseData, wordBank: null };
    render(<FillInBlankExercise exerciseData={exerciseWithoutWordBank} />);
    
    expect(screen.queryByText('Word Bank')).not.toBeInTheDocument();
  });

  test('handles exercise without time limit', () => {
    const exerciseWithoutTimer = { ...mockExerciseData, timeLimit: null };
    render(<FillInBlankExercise exerciseData={exerciseWithoutTimer} />);
    
    expect(screen.queryByText(/Time Remaining:/)).not.toBeInTheDocument();
  });

  test('handles exercise without auto-checking', () => {
    const exerciseWithoutAutoCheck = { ...mockExerciseData, autoCheck: false };
    render(<FillInBlankExercise exerciseData={exerciseWithoutAutoCheck} />);
    
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    
    fireEvent.change(firstInput, { target: { value: 'sat' } });
    fireEvent.blur(firstInput);
    
    // Should not show immediate feedback
    expect(firstInput).not.toHaveClass('correct');
    expect(firstInput).not.toHaveClass('incorrect');
  });

  test('calls onComplete when exercise is finished', async () => {
    const onComplete = jest.fn();
    render(<FillInBlankExercise exerciseData={mockExerciseData} onComplete={onComplete} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    
    const submitButton = screen.getByText('Submit Answers');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  test('shows try again button after completion', async () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    
    const submitButton = screen.getByText('Submit Answers');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  test('resets exercise when try again is clicked', async () => {
    render(<FillInBlankExercise exerciseData={mockExerciseData} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    
    const submitButton = screen.getByText('Submit Answers');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    
    // Should reset all inputs
    const resetInputs = screen.getAllByRole('textbox');
    resetInputs.forEach(input => {
      expect(input.value).toBe('');
    });
  });
});