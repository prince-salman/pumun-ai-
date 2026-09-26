import { useState, useEffect } from 'react';
import { SettingsState } from '../types';

const STORAGE_KEY = 'kenya_pumun_settings_v1';

const DEFAULT_SETTINGS: SettingsState = {
  apiKey: 'sk-guts-83d0dcdcfcf1dc76ae8aaf946815626cbf04ebd3',
  baseUrl: 'https://api.gutsai.id/v1',
  selectedModel: 'nemotron-3-ultra',
  speechRate: 0.95,
  delegateName: 'Muhamad Salman',
  partnerName: 'Jamael Nadeem Omero Setianegara',
  isSolo: false,
  theme: 'dark'
};

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.partnerName || parsed.partnerName.includes('Berhalangan') || parsed.partnerName.includes('Nata')) {
          parsed.partnerName = 'Jamael Nadeem Omero Setianegara';
          parsed.isSolo = false;
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist settings:', e);
    }
  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    resetSettings
  };
}
