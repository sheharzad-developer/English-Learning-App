import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveExerciseDemo from '../../components/Exercises/InteractiveExerciseDemo';

// Mock the lesson service to avoid axios import issues
jest.mock('../../services/lessonService', () => ({
  lessonService: {
    submitQuizAnswers: jest.fn(),
    getQuizResults: jest.fn()
  }
}));

// Mock react-beautiful-dnd to avoid DnD issues in tests
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

describe('Interactive Exercise Components Integration', () => {
  test('InteractiveExerciseDemo renders without crashing', () => {
    render(<InteractiveExerciseDemo />);
    expect(screen.getByText('Interactive Exercise Demo')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Matching')).toBeInTheDocument();
    expect(screen.getByText('Fill-in-Blanks')).toBeInTheDocument();
  });

  test('InteractiveExerciseDemo component is properly exported and importable', () => {
    expect(InteractiveExerciseDemo).toBeDefined();
  });

  test('InteractiveExerciseDemo shows navigation tabs', () => {
    render(<InteractiveExerciseDemo />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Matching')).toBeInTheDocument();
    // Note: The exact text may vary, but the component renders successfully
  });
});