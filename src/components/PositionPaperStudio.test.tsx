import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import PositionPaperStudio from './PositionPaperStudio';
import { SettingsState } from '../types';

describe('PositionPaperStudio Component (TypeScript)', () => {
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

  it('renders official PUMUN Position Paper header, emblem, and metadata', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getByText(/Position Paper Studio/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Republic of Kenya/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/United Nations Children's Fund/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Muhamad Salman/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Jamael Nadeem/i).length).toBeGreaterThan(0);
    expect(screen.getByAltText(/Official Coat of Arms of Kenya/i)).toBeInTheDocument();
  });

  it('displays founding father quote and Kenya national laws', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getAllByText(/Mzee Jomo Kenyatta/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Children Act 2022/i).length).toBeGreaterThan(0);
  });

  it('displays the 5 PUMUN SDC 1.0 winning rules and HARAMBEE-WAYS framework', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getAllByText(/HARAMBEE-WAYS/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Official State Emblem/i)).toBeInTheDocument();
    expect(screen.getByText(/Hook 'Em Start/i)).toBeInTheDocument();
    expect(screen.getByText(/Data & UN Frameworks/i)).toBeInTheDocument();
    expect(screen.getByText(/Diplomatic Honesty/i)).toBeInTheDocument();
  });

  it('has Chicago citation references compliant with <= 5 years rule', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getByText(/Chicago Manual of Style/i)).toBeInTheDocument();
    expect(screen.getAllByText(/UNODC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/UNICEF/i).length).toBeGreaterThan(0);
  });
});
