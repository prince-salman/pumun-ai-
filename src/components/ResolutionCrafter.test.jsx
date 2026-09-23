import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import ResolutionCrafter from './ResolutionCrafter.jsx';

describe('ResolutionCrafter Component', () => {
  const mockSettings = {
    selectedModel: 'nemotron-3-ultra'
  };

  it('renders resolution builder interface and default clauses', () => {
    render(<ResolutionCrafter settings={mockSettings} />);
    expect(screen.getByText(/Draft Resolution & Working Paper Crafter/i)).toBeInTheDocument();
    expect(screen.getByText(/Preambulatory Clauses/i)).toBeInTheDocument();
    expect(screen.getByText(/Operative Clauses/i)).toBeInTheDocument();
  });

  it('detects and flags mandate violations', () => {
    render(<ResolutionCrafter settings={mockSettings} />);
    const customClauseInput = screen.getByPlaceholderText(/Tulis ide klausul baru dalam Bahasa Indonesia/i);
    fireEvent.change(customClauseInput, { target: { value: 'Tangkap dan penjarakan para pelaku trafficking' } });
    
    // Check mandate warning
    expect(screen.getByText(/Peringatan Mandat UNICEF/i)).toBeInTheDocument();
  });

  it('allows adding pre-configured Kenya clauses to the draft', () => {
    render(<ResolutionCrafter settings={mockSettings} />);
    expect(screen.getByText(/SAFE-LEARN Transit Education Pass/i)).toBeInTheDocument();
  });
});
