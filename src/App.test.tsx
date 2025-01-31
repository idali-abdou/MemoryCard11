import React from 'react';
import { render, screen } from '@testing-library/react';
import MemoryGame from './MemoryGame';

test('renders learn react link', () => {
  render(<MemoryGame />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
