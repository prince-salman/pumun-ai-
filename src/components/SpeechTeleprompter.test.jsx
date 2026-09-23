import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SpeechTeleprompter from './SpeechTeleprompter.jsx';

describe('SpeechTeleprompter Component', () => {
  const mockSettings = {
    apiKey: 'sk-test',
    baseUrl: 'https://api.gutsai.id/v1',
    selectedModel: 'nemotron-3-ultra',
    speechRate: 0.95
  };

  it('renders input controls and speech modes', () => {
    render(<SpeechTeleprompter settings={mockSettings} />);
    expect(screen.getByPlaceholderText(/Tulis ide, poin, atau pesan Anda dalam Bahasa Indonesia/i)).toBeInTheDocument();
    expect(screen.getByText(/General Speakers List \(90s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Moderated Caucus \(60s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Point of Information \(30s\)/i)).toBeInTheDocument();
  });

  it('allows clicking quick topic prompts to populate input', () => {
    render(<SpeechTeleprompter settings={mockSettings} />);
    const topicButton = screen.getByText(/Pendaftaran Sekolah Tanpa Akta/i);
    fireEvent.click(topicButton);
    const textarea = screen.getByPlaceholderText(/Tulis ide, poin, atau pesan Anda dalam Bahasa Indonesia/i);
    expect(textarea.value).toContain('akta lahir');
  });

  it('displays tri-layer tabs (English, Cara Baca, Makna)', () => {
    render(<SpeechTeleprompter settings={mockSettings} />);
    expect(screen.getByRole('button', { name: /Naskah Inggris/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cara Baca \(Fonetik\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Makna Indonesia/i })).toBeInTheDocument();
  });
});
