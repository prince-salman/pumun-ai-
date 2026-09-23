import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import CoDelegateChat from './CoDelegateChat';
import { SettingsState } from '../types';

// Mock speech synthesis
vi.mock('../services/speechSynthesis', () => ({
  speechService: {
    speak: vi.fn(),
    stop: vi.fn(),
    isSpeaking: vi.fn().mockReturnValue(false)
  }
}));

const mockSettings: SettingsState = {
  delegateName: 'Muhamad Salman',
  partnerName: 'Nata',
  isSolo: true,
  speechRate: 0.95,
  theme: 'light',
  apiKey: 'sk-test-key',
  selectedModel: 'nemotron-3-ultra',
  baseUrl: 'https://api.gutsai.id/v1'
};

describe('CoDelegateChat Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders greeting message from Nata', () => {
    const onNavigate = vi.fn();
    render(<CoDelegateChat settings={mockSettings} onNavigate={onNavigate} />);

    expect(screen.getByText(/Nata \(Virtual Co-Delegate\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Partner Salman 🇰🇪/i)).toBeInTheDocument();
    expect(screen.getByText(/Halo Salman! Aku/i)).toBeInTheDocument();
  });

  it('renders quick suggestion chips and triggers question on click', async () => {
    const onNavigate = vi.fn();
    render(<CoDelegateChat settings={mockSettings} onNavigate={onNavigate} />);

    const rollCallChip = screen.getByRole('button', { name: /Dipanggil di Roll Call!/i });
    expect(rollCallChip).toBeInTheDocument();

    fireEvent.click(rollCallChip);

    // Should display the user message in chat
    await waitFor(() => {
      expect(screen.getByText(/Nama Republic of Kenya baru saja dipanggil saat Roll Call/i)).toBeInTheDocument();
    });

    // Should receive response with speech card
    await waitFor(() => {
      expect(screen.getByText(/Tenang Salman!/i)).toBeInTheDocument();
      expect(screen.getByText(/NASKAH SIAP BACA UNTUK SALMAN/i)).toBeInTheDocument();
      expect(screen.getByText(/"Pre-sent end Fow-ting."/i)).toBeInTheDocument();
    });
  });

  it('allows user to type a message and sends it on enter/click', async () => {
    const onNavigate = vi.fn();
    render(<CoDelegateChat settings={mockSettings} onNavigate={onNavigate} />);

    const input = screen.getByPlaceholderText(/Ketik apa saja ke Nata/i);
    const sendButton = screen.getByRole('button', { name: /Kirim/i });

    fireEvent.change(input, { target: { value: 'aku mau izin ke toilet' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('aku mau izin ke toilet')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Point of Personal Privilege/i)).toBeInTheDocument();
    });
  });

  it('triggers onNavigate when shortcut button is clicked', async () => {
    const onNavigate = vi.fn();
    render(<CoDelegateChat settings={mockSettings} onNavigate={onNavigate} />);

    // Click quick prompt for roll call which contains shortcut
    const rollCallChip = screen.getByRole('button', { name: /Dipanggil di Roll Call!/i });
    fireEvent.click(rollCallChip);

    await waitFor(() => {
      const shortcutBtn = screen.getByText(/Buka Contekan Darurat ⚡/i);
      expect(shortcutBtn).toBeInTheDocument();
      fireEvent.click(shortcutBtn);
      expect(onNavigate).toHaveBeenCalledWith('cheatsheet');
    });
  });
});
