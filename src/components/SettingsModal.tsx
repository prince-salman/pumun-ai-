import React, { useState } from 'react';
import { X, Key, Globe, Cpu, Volume2, RotateCcw } from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/aiService';
import { speechService } from '../services/speechSynthesis';
import { SettingsState } from '../types';

interface SettingsModalProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetSettings: () => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, updateSetting, resetSettings, onClose }: SettingsModalProps) {
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  const handleTestVoice = () => {
    speechService.speak("Republic of Kenya, present and voting. Ready to deliver the opening statement.", {
      rate: settings.speechRate || 0.95,
      onStart: () => setTestSuccess(true),
      onEnd: () => setTimeout(() => setTestSuccess(false), 2000)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 p-4 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              Pengaturan AI & Asisten Diplomasi
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              API Key (GutsAI):
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => updateSetting('apiKey', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              API key Anda tersimpan aman secara lokal di browser Anda.
            </p>
          </div>

          {/* Base URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Base URL Endpoint:
            </label>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => updateSetting('baseUrl', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Model Switcher */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Model AI Aktif:
            </label>
            <select
              value={settings.selectedModel}
              onChange={(e) => updateSetting('selectedModel', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.speed} • {m.intelligence})
                </option>
              ))}
            </select>
          </div>

          {/* Speech Rate Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Kecepatan Lafal Audio:
              </label>
              <span className="font-mono text-emerald-400">{settings.speechRate || 0.95}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={settings.speechRate || 0.95}
              onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.75x (Lambat/Jelas)</span>
              <span>1.0x (Normal)</span>
              <span>1.25x (Cepat)</span>
            </div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{testSuccess ? 'Suara Sedang Diputar...' : 'Coba Suara Audio'}</span>
            </button>
          </div>

          {/* Delegate info */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="font-semibold text-slate-300">Nama Delegasi:</label>
            <input
              type="text"
              value={settings.delegateName}
              onChange={(e) => updateSetting('delegateName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={resetSettings}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
          >
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
