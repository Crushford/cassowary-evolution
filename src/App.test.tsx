import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cassowary queen title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { level: 1 });
  expect(titleElement).toHaveTextContent(/Cassowary Queen/i);
});

test('renders help button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Help/i });
  expect(buttonElement).toBeInTheDocument();
});
