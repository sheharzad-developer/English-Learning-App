import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizComponent from '../../components/Exercises/QuizComponent';

// Mock data for testing
const mockQuizData = {
  title: 'English Grammar Quiz',
  description: 'Test your knowledge of English grammar',
  timeLimit: 300, // 5 minutes
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'What is the past tense of "go"?',
      options: ['went', 'gone', 'going', 'goes'],
      correctAnswer: 'went',
      explanation: 'The past tense of "go" is "went".',
      points: 10
    },
    {
      id: 2,
      type: 'true_false',
      question: 'English is a Germanic language.',
      correctAnswer: true,
      explanation: 'English belongs to the Germanic language family.',
      points: 5
    },
    {
      id: 3,
      type: 'fill_blank',
      question: 'She ___ to the store yesterday.',
      correctAnswer: 'went',
      explanation: 'The past tense of "go" is "went".',
      points: 8
    }
  ]
};

describe('QuizComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders quiz title and description', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    expect(screen.getByText('English Grammar Quiz')).toBeInTheDocument();
    expect(screen.getByText('Test your knowledge of English grammar')).toBeInTheDocument();
  });

  test('displays timer when time limit is set', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    expect(screen.getByText(/Time Remaining:/)).toBeInTheDocument();
    expect(screen.getByText(/05:00/)).toBeInTheDocument();
  });

  test('shows progress bar with correct progress', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    const progressText = screen.getByText('Question 1 of 3');
    expect(progressText).toBeInTheDocument();
  });

  test('renders multiple choice question correctly', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    expect(screen.getByText('What is the past tense of "go"?')).toBeInTheDocument();
    expect(screen.getByText('went')).toBeInTheDocument();
    expect(screen.getByText('gone')).toBeInTheDocument();
    expect(screen.getByText('going')).toBeInTheDocument();
    expect(screen.getByText('goes')).toBeInTheDocument();
  });

  test('allows selecting multiple choice options', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    const option = screen.getByLabelText('went');
    fireEvent.click(option);
    
    expect(option).toBeChecked();
  });

  test('navigates to next question', async () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    // Select an answer
    const option = screen.getByLabelText('went');
    fireEvent.click(option);
    
    // Click next button
    const nextButton = screen.getByText('Next Question');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('English is a Germanic language.')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Question 2 of 3')).toBeInTheDocument();
  });

  test('handles true/false questions', async () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    // Navigate to true/false question
    const option = screen.getByLabelText('went');
    fireEvent.click(option);
    fireEvent.click(screen.getByText('Next Question'));
    
    await waitFor(() => {
      expect(screen.getByText('True')).toBeInTheDocument();
    });
    
    expect(screen.getByText('False')).toBeInTheDocument();
    
    // Select true
    const trueOption = screen.getByLabelText('True');
    fireEvent.click(trueOption);
    expect(trueOption).toBeChecked();
  });

  test('handles fill in the blank questions', async () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    // Navigate to fill in the blank question
    fireEvent.click(screen.getByLabelText('went'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Navigate to second question
    fireEvent.click(screen.getByLabelText('True'));
    fireEvent.click(screen.getByText('Next Question'));
    
    await waitFor(() => {
      expect(screen.getByText('She ___ to the store yesterday.')).toBeInTheDocument();
    });
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('prevents submission without answers', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    const nextButton = screen.getByText('Next Question');
    expect(nextButton).toBeDisabled();
  });

  test('shows quiz completion and results', async () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    // Answer all questions
    fireEvent.click(screen.getByLabelText('went'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Answer second question
    fireEvent.click(screen.getByLabelText('True'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Answer third question
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'went' } });
    fireEvent.click(screen.getByText('Finish Quiz'));
    
    await waitFor(() => {
      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Your Score:/)).toBeInTheDocument();
  });

  test('allows flagging questions for review', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    const flagButton = screen.getByText('Flag for Review');
    fireEvent.click(flagButton);
    
    expect(screen.getByText('Unflag')).toBeInTheDocument();
  });

  test('shows question navigation grid', () => {
    render(<QuizComponent quizData={mockQuizData} />);
    
    const navButton = screen.getByText('Question Navigation');
    fireEvent.click(navButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('handles quiz without time limit', () => {
    const quizWithoutTimer = { ...mockQuizData, timeLimit: null };
    render(<QuizComponent quizData={quizWithoutTimer} />);
    
    expect(screen.queryByText(/Time Remaining:/)).not.toBeInTheDocument();
  });

  test('calculates score correctly', async () => {
    const onComplete = jest.fn();
    render(<QuizComponent quizData={mockQuizData} onComplete={onComplete} />);
    
    // Answer all questions correctly
    fireEvent.click(screen.getByLabelText('went'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Answer second question
    fireEvent.click(screen.getByLabelText('True'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Answer third question
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'went' } });
    fireEvent.click(screen.getByText('Finish Quiz'));
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 23, // 10 + 5 + 8
          totalPoints: 23,
          percentage: 100
        })
      );
    });
  });
});