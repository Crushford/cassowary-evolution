import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to Evolution/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders get started button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Get Started/i);
  expect(buttonElement).toBeInTheDocument();
});
