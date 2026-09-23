import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import DebateListener from './DebateListener';
import { SettingsState } from '../types';

describe('DebateListener Component', () => {
  const mockSettings: SettingsState = {
    apiKey: 'sk-test',
    baseUrl: 'https://api.gutsai.id/v1',
    selectedModel: 'nemotron-3-ultra',
    speechRate: 0.95,
    delegateName: 'Muhamad Salman',
    partnerName: 'Nata',
    isSolo: true,
    theme: 'light'
  };

  it('renders debate listener headline and step inputs', () => {
    render(<DebateListener settings={mockSettings} />);
    expect(screen.getByText(/Dengar Lawan & Buat Sanggahan Kilat/i)).toBeInTheDocument();
    expect(screen.getByText(/Langkah 1: Siapa yang Sedang Berbicara\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Langkah 2: Apa yang Mereka Katakan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rangkumkan & Siapkan Jawaban Kenya Sekarang/i })).toBeInTheDocument();
  });

  it('displays default pre-analyzed fallback card with 3 key sections', () => {
    render(<DebateListener settings={mockSettings} />);
    
    // 1. Inti Omongan
    expect(screen.getByText(/1\. Inti Omongan/i)).toBeInTheDocument();
    
    // 2. Status & Taktik
    expect(screen.getByText(/2\. Status & Taktik untuk Kenya/i)).toBeInTheDocument();

    // 3. Naskah Jawaban / Sanggahan (Tinggal Baca di Podium!)
    expect(screen.getByText(/3\. Naskah Jawaban \/ Sanggahan Anda/i)).toBeInTheDocument();
    
    // Check speech tabs
    expect(screen.getByRole('button', { name: /Cara Baca/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inggris/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Arti/i })).toBeInTheDocument();
  });

  it('allows clicking quick debate triggers to populate input', () => {
    render(<DebateListener settings={mockSettings} />);
    
    const triggerBtn = screen.getByText(/⚡ Bahas Anggaran \/ Dana/i);
    fireEvent.click(triggerBtn);
    
    const textarea = screen.getByPlaceholderText(/Ketik dalam Bahasa Indonesia apa yang Anda dengar/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('dana rehabilitasi');
  });

  it('switches between Cara Baca, Inggris, and Arti tabs', () => {
    render(<DebateListener settings={mockSettings} />);
    
    // Default is caraBaca
    expect(screen.getByText(/Lafalkan Saja Teks Ini di Depan Mikrofon/i)).toBeInTheDocument();
    
    // Click Inggris
    const englishTab = screen.getByRole('button', { name: /Inggris/i });
    fireEvent.click(englishTab);
    expect(screen.getByText(/Naskah Resmi Bahasa Inggris/i)).toBeInTheDocument();

    // Click Arti
    const artiTab = screen.getByRole('button', { name: /Arti/i });
    fireEvent.click(artiTab);
    expect(screen.getByText(/Arti Kalimat yang Anda Ucapkan/i)).toBeInTheDocument();
  });
});
