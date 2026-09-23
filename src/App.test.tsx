import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('App Integration Test', () => {
  it('renders navbar, Kenya badge, and default Dengar Lawan & Tangkis tab', () => {
    render(<App />);
    expect(screen.getByText(/KENYA CO-DELEGATE/i)).toBeInTheDocument();
    expect(screen.getByText(/Muhamad Salman \(Solo\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dengar Lawan & Buat Sanggahan Kilat/i)).toBeInTheDocument();
  });

  it('switches navigation tabs seamlessly', () => {
    render(<App />);
    
    // Switch to Pidato Saya (Teleprompter)
    const teleprompterTab = screen.getByRole('button', { name: /Pidato Saya/i });
    fireEvent.click(teleprompterTab);
    expect(screen.getByText(/Live Speech Teleprompter/i)).toBeInTheDocument();

    // Switch to Contekan Darurat
    const cheatTab = screen.getByRole('button', { name: /Contekan Darurat/i });
    fireEvent.click(cheatTab);
    expect(screen.getByText(/Quick Diplomatic Cheat Sheet & Soundboard/i)).toBeInTheDocument();

    // Switch to Radar Subtopik
    const radarTab = screen.getByRole('button', { name: /Radar Subtopik/i });
    fireEvent.click(radarTab);
    expect(screen.getByText(/Radar Subtopik & Respon Cepat Debat/i)).toBeInTheDocument();

    // Switch to Position Paper
    const posPapTab = screen.getByRole('button', { name: /Position Paper/i });
    fireEvent.click(posPapTab);
    expect(screen.getByText(/Position Paper Studio/i)).toBeInTheDocument();

    // Switch to 22 Countries
    const countriesTab = screen.getByRole('button', { name: /22 Negara Intel/i });
    fireEvent.click(countriesTab);
    expect(screen.getByText(/22 Countries Intelligence Matrix/i)).toBeInTheDocument();

    // Switch to Resolution Crafter
    const resTab = screen.getByRole('button', { name: /Resolution Crafter/i });
    fireEvent.click(resTab);
    expect(screen.getByText(/Draft Resolution & Working Paper Crafter/i)).toBeInTheDocument();
  });
});
