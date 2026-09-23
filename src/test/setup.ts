import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  paused: false,
  pending: false,
  onvoiceschanged: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).SpeechSynthesisUtterance = vi.fn().mockImplementation((text: string) => ({
  text,
  lang: 'en-US',
  rate: 1,
  pitch: 1,
  onend: null,
  onerror: null,
}));

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: unknown) => {
      store[key] = (value as string).toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
