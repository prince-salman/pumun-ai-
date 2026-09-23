import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import QuickCheatSheet from './QuickCheatSheet';
import { SettingsState } from '../types';

describe('QuickCheatSheet Component (TypeScript)', () => {
  const mockSettings: SettingsState = {
    apiKey: 'sk-test',
    baseUrl: 'https://api.gutsai.id/v1',
    selectedModel: 'nemotron-3-ultra',
    speechRate: 0.95,
    delegateName: 'Muhamad Salman',
    partnerName: 'Nata',
    isSolo: true,
    theme: 'dark'
  };

  it('renders quick phrases categories and cards', () => {
    render(<QuickCheatSheet settings={mockSettings} />);
    expect(screen.getByText(/Quick Diplomatic Cheat Sheet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Semua/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Roll Call/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Motions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Points/i })).toBeInTheDocument();
  });

  it('filters phrases by search query', () => {
    render(<QuickCheatSheet settings={mockSettings} />);
    const searchInput = screen.getByPlaceholderText(/Cari kalimat, situasi, atau kata kunci/i);
    fireEvent.change(searchInput, { target: { value: 'Presensi' } });
    expect(screen.getByText(/Jawaban Presensi \(Hadir & Memilih\)/i)).toBeInTheDocument();
  });

  it('displays Indonesian phonetic pronunciation and official English', () => {
    render(<QuickCheatSheet settings={mockSettings} />);
    expect(screen.getByText(/Prezen end foting, Cyer\./i)).toBeInTheDocument();
    expect(screen.getByText(/Present and voting, Chair\./i)).toBeInTheDocument();
  });
});
