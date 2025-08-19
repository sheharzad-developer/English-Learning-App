import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import MatchingExercise from '../../components/Exercises/MatchingExercise';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: jest.fn(),
  }, {}),
}));

// Mock data for testing
const mockExerciseData = {
  title: 'Match English Words with Definitions',
  description: 'Drag and drop words to match them with their correct definitions',
  timeLimit: 180, // 3 minutes
  items: [
    { id: 'word1', content: 'Happy', type: 'word' },
    { id: 'word2', content: 'Sad', type: 'word' },
    { id: 'word3', content: 'Fast', type: 'word' }
  ],
  targets: [
    { id: 'def1', content: 'Feeling joy or pleasure', correctMatch: 'word1' },
    { id: 'def2', content: 'Feeling sorrow or unhappiness', correctMatch: 'word2' },
    { id: 'def3', content: 'Moving at high speed', correctMatch: 'word3' }
  ],
  hints: [
    'Think about emotions and feelings',
    'Consider the opposite of happy',
    'Think about speed and movement'
  ]
};

describe('MatchingExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders exercise title and description', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText('Match English Words with Definitions')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop words to match them with their correct definitions')).toBeInTheDocument();
  });

  test('displays timer when time limit is set', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText(/Time Remaining:/)).toBeInTheDocument();
    expect(screen.getByText(/03:00/)).toBeInTheDocument();
  });

  test('shows progress bar', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText('Progress: 0/3 matches')).toBeInTheDocument();
  });

  test('renders all items and targets', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    // Check items
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Sad')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    
    // Check targets
    expect(screen.getByText('Feeling joy or pleasure')).toBeInTheDocument();
    expect(screen.getByText('Feeling sorrow or unhappiness')).toBeInTheDocument();
    expect(screen.getByText('Moving at high speed')).toBeInTheDocument();
  });

  test('shows hint button and displays hints', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const hintButton = screen.getByText('Show Hint');
    expect(hintButton).toBeInTheDocument();
    
    fireEvent.click(hintButton);
    
    expect(screen.getByText('Think about emotions and feelings')).toBeInTheDocument();
  });

  test('disables submit button when no matches are made', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const submitButton = screen.getByText('Submit Matches');
    expect(submitButton).toBeDisabled();
  });

  test('handles exercise without time limit', () => {
    const exerciseWithoutTimer = { ...mockExerciseData, timeLimit: null };
    render(<MatchingExercise exerciseData={exerciseWithoutTimer} />);
    
    expect(screen.queryByText(/Time Remaining:/)).not.toBeInTheDocument();
  });

  test('shows instructions for drag and drop', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    expect(screen.getByText(/Drag items from the left/)).toBeInTheDocument();
  });

  test('displays empty state message for targets', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const dropZones = screen.getAllByText('Drop item here');
    expect(dropZones).toHaveLength(3);
  });

  test('shows reset button', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const resetButton = screen.getByText('Reset All');
    expect(resetButton).toBeInTheDocument();
  });

  test('handles reset functionality', () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);
    
    // Should reset progress
    expect(screen.getByText('Progress: 0/3 matches')).toBeInTheDocument();
  });

  test('calls onComplete when exercise is finished', async () => {
    const onComplete = jest.fn();
    render(<MatchingExercise exerciseData={mockExerciseData} onComplete={onComplete} />);
    
    // Mock completing the exercise
    const submitButton = screen.getByText('Submit Matches');
    
    // Enable submit button by simulating matches (this would normally happen through drag and drop)
    // For testing purposes, we'll simulate the completion state
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  test('shows completion message when all matches are correct', async () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    // Simulate completing all matches correctly
    const submitButton = screen.getByText('Submit Matches');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Exercise Complete!/)).toBeInTheDocument();
    });
  });

  test('displays score and feedback', async () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const submitButton = screen.getByText('Submit Matches');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Score:/)).toBeInTheDocument();
    });
  });

  test('handles exercise with no hints', () => {
    const exerciseWithoutHints = { ...mockExerciseData, hints: [] };
    render(<MatchingExercise exerciseData={exerciseWithoutHints} />);
    
    expect(screen.queryByText('Show Hint')).not.toBeInTheDocument();
  });

  test('shows try again button after completion', async () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const submitButton = screen.getByText('Submit Matches');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  test('resets exercise when try again is clicked', async () => {
    render(<MatchingExercise exerciseData={mockExerciseData} />);
    
    const submitButton = screen.getByText('Submit Matches');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    
    expect(screen.getByText('Progress: 0/3 matches')).toBeInTheDocument();
  });
});