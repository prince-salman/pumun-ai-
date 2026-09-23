import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('App Smoke Test', () => {
  it('renders application header title and Kenya badge', () => {
    render(<App />);
    expect(screen.getByText(/Kenya Diplomatic Co-Pilot/i)).toBeInTheDocument();
    expect(screen.getByText(/Republic of Kenya/i)).toBeInTheDocument();
  });
});
