import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cassowary queen title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { level: 1 });
  expect(titleElement).toHaveTextContent(/Cassowary Queen/i);
});

test('renders begin level button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Begin Level 1/i });
  expect(buttonElement).toBeInTheDocument();
});
