import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Updated to match current UI

test('renders app title', () => {
  render(<App />);
  const title = screen.getByText(/Cassowary Panchino/i);
  expect(title).toBeInTheDocument();
});

test('renders primary game controls', () => {
  render(<App />);
  expect(screen.getByText(/Next Step/i)).toBeInTheDocument();
  expect(screen.getByText(/Drop Egg/i)).toBeInTheDocument();
});
