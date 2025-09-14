import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cassowary queen title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { level: 1 });
  expect(titleElement).toHaveTextContent(/Cassowary Queen/i);
});

test('renders how to play button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /How to Play/i });
  expect(buttonElement).toBeInTheDocument();
});
