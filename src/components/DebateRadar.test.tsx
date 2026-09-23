import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import DebateRadar from './DebateRadar';
import { SettingsState } from '../types';

describe('DebateRadar Component', () => {
  const mockSettings: SettingsState = {
    apiKey: 'test-key',
    baseUrl: 'https://api.gutsai.id/v1',
    selectedModel: 'nemotron-3-ultra',
    speechRate: 0.95,
    delegateName: 'Muhamad Salman',
    partnerName: 'Nata (Berhalangan)',
    isSolo: true,
    theme: 'dark'
  };

  it('renders debate radar banner and 8 subtopics', () => {
    render(<DebateRadar settings={mockSettings} />);
    expect(screen.getByText(/Radar Subtopik & Respon Cepat Debat/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Reintegrasi Sekolah & Penghapusan Stigma Korban/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mekanisme Pendanaan Global & Kemitraan Pemerintah-Swasta/i).length).toBeGreaterThan(0);
  });

  it('switches between subtopics and displays motion and ready speech', () => {
    render(<DebateRadar settings={mockSettings} />);
    
    // Check default subtopic motion is visible
    expect(screen.getByText(/Teks Mosi Siap Ajukan/i)).toBeInTheDocument();
    expect(screen.getByText(/Naskah Pidato Kaukus \(60 Detik\)/i)).toBeInTheDocument();

    // Click on another subtopic
    const fundingTopic = screen.getAllByText(/Mekanisme Pendanaan Global/i)[0];
    fireEvent.click(fundingTopic);
    expect(screen.getAllByText(/Transparent Multilateral Financing/i).length).toBeGreaterThan(0);
  });

  it('switches to crisis scenarios and keyword decoder sections', () => {
    render(<DebateRadar settings={mockSettings} />);

    // Switch to Respon Kilat (Crisis)
    const crisisBtn = screen.getByRole('button', { name: /Respon Kilat/i });
    fireEvent.click(crisisBtn);
    expect(screen.getByText(/Skenario Pertanyaan Mendadak/i)).toBeInTheDocument();

    // Switch to Kamus Dengar (Keywords)
    const keywordsBtn = screen.getByRole('button', { name: /Kamus Dengar/i });
    fireEvent.click(keywordsBtn);
    expect(screen.getByText(/Kamus Dengar Kata Kunci Sidang/i)).toBeInTheDocument();
    expect(screen.getByText(/Funding \/ Budget \/ Resource Allocation/i)).toBeInTheDocument();

    // Switch to Alur Sidang (Guide)
    const guideBtn = screen.getByRole('button', { name: /Alur Sidang/i });
    fireEvent.click(guideBtn);
    expect(screen.getByText(/Panduan Jalur Sidang MUN PUMUN SDC 1.0/i)).toBeInTheDocument();
  });
});
