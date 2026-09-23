import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kenya_pumun_settings_v1';

const DEFAULT_SETTINGS = {
  apiKey: 'sk-guts-83d0dcdcfcf1dc76ae8aaf946815626cbf04ebd3',
  baseUrl: 'https://api.gutsai.id/v1',
  selectedModel: 'nemotron-3-ultra',
  speechRate: 0.95,
  delegateName: 'Muhamad Salman',
  partnerName: 'Nata (Berhalangan)',
  isSolo: true,
  theme: 'dark'
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
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

  const updateSetting = (key, value) => {
    setSettings(prev => ({
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
