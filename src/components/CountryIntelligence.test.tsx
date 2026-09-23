import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import CountryIntelligence from './CountryIntelligence';
import { SettingsState } from '../types';

describe('CountryIntelligence Component', () => {
  const mockSettings: SettingsState = {
    apiKey: 'test-key',
    baseUrl: 'https://api.gutsai.id/v1',
    selectedModel: 'nemotron-3-ultra',
    speechRate: 0.95,
    delegateName: 'Muhamad Salman',
    partnerName: 'Nata (Berhalangan)',
    isSolo: true,
    theme: 'dark',
  };

  it('renders all 22 countries with flags and bloc information', () => {
    render(<CountryIntelligence settings={mockSettings} />);
    expect(screen.getByText(/22 Countries Intelligence Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/United States of America/i)).toBeInTheDocument();
    expect(screen.getByText(/Democratic republic of the Congo/i)).toBeInTheDocument();
    expect(screen.getByText(/Kingdom of Sweden/i)).toBeInTheDocument();
  });

  it('filters countries by search query', () => {
    render(<CountryIntelligence settings={mockSettings} />);
    const searchInput = screen.getByPlaceholderText(/Cari nama negara atau delegasi/i);
    fireEvent.change(searchInput, { target: { value: 'Congo' } });
    expect(screen.getByText(/Democratic republic of the Congo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Kingdom of Sweden/i)).not.toBeInTheDocument();
  });

  it('opens note passer modal when Kirim Note is clicked', () => {
    render(<CountryIntelligence settings={mockSettings} />);
    const noteButtons = screen.getAllByRole('button', { name: /Tulis Diplomatic Note/i });
    expect(noteButtons.length).toBeGreaterThan(0);
    fireEvent.click(noteButtons[0]);
    expect(screen.getByText(/Diplomatic Note Drafter/i)).toBeInTheDocument();
  });
});
