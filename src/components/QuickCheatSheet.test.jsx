import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import QuickCheatSheet from './QuickCheatSheet.jsx';

describe('QuickCheatSheet Component', () => {
  const mockSettings = {
    speechRate: 0.95
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
