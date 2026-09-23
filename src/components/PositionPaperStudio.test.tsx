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

  it('renders official PUMUN Position Paper header and metadata', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getByText(/Position Paper Studio/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Republic of Kenya/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/United Nations Children's Fund/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Muhamad Salman/i).length).toBeGreaterThan(0);
  });

  it('displays Kenya national laws in the paper text', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getAllByText(/Children Act 2022/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Counter-Trafficking in Persons Act 2010/i).length).toBeGreaterThan(0);
  });

  it('has Chicago citation references and compliance check', () => {
    render(<PositionPaperStudio settings={mockSettings} />);
    expect(screen.getByText(/Chicago Manual of Style/i)).toBeInTheDocument();
    expect(screen.getByText(/Turnitin < 15% Safe/i)).toBeInTheDocument();
  });
});
