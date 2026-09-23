import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('App Integration Test', () => {
  it('renders navbar, Kenya badge, and default Live Teleprompter tab', () => {
    render(<App />);
    expect(screen.getByText(/KENYA CO-DELEGATE/i)).toBeInTheDocument();
    expect(screen.getByText(/Muhamad Salman \(Solo\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Speech Teleprompter/i)).toBeInTheDocument();
  });

  it('switches navigation tabs seamlessly', () => {
    render(<App />);
    
    // Switch to Radar Subtopik
    const radarTab = screen.getByRole('button', { name: /Radar Subtopik & Respon/i });
    fireEvent.click(radarTab);
    expect(screen.getByText(/Radar Subtopik & Respon Cepat Debat/i)).toBeInTheDocument();

    // Switch to Quick Cheat Sheet
    const cheatTab = screen.getByRole('button', { name: /Quick Cheat Sheet/i });
    fireEvent.click(cheatTab);
    expect(screen.getByText(/Quick Diplomatic Cheat Sheet & Soundboard/i)).toBeInTheDocument();

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
