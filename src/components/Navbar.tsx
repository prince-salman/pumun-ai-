import React from 'react';
import { 
  Mic, 
  Radar,
  Zap, 
  FileText, 
  Globe, 
  FileCode, 
  Settings, 
  Cpu, 
  Volume2, 
  UserCheck
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/aiService';
import { speechService } from '../services/speechSynthesis';
import { SettingsState } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  onOpenSettings: () => void;
}

export default function Navbar({ activeTab, setActiveTab, settings, updateSetting, onOpenSettings }: NavbarProps) {
  const handleTestAudio = () => {
    speechService.speak('Honorable Chair, the Delegation of Kenya is present and voting.', {
      rate: settings.speechRate || 0.95
    });
  };

  const navItems = [
    { id: 'teleprompter', label: 'Live Teleprompter', icon: Mic, badge: '3-Lapis' },
    { id: 'radar', label: 'Radar Subtopik & Respon', icon: Radar, badge: 'Prediksi' },
    { id: 'cheatsheet', label: 'Quick Cheat Sheet', icon: Zap, badge: 'Darurat' },
    { id: 'pospap', label: 'Position Paper', icon: FileText, badge: 'A4' },
    { id: 'countries', label: '22 Negara Intel', icon: Globe, badge: '22' },
    { id: 'resolution', label: 'Resolution Crafter', icon: FileCode, badge: 'Klausul' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Branding & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner select-none">
            🇰🇪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                KENYA CO-DELEGATE
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                UNICEF • PUMUN 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                {settings.delegateName || 'Muhamad Salman'} (Solo)
              </span>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline truncate max-w-[280px]">
                Topic: Child Protection & Education (SDC 1.0)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Model Selector & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Model Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={settings.selectedModel}
              onChange={(e) => updateSetting('selectedModel', e.target.value)}
              className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer pr-1"
              title="Ganti Model AI GutsAI"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Voice Audio Button */}
          <button
            type="button"
            onClick={handleTestAudio}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1.5 transition"
            title="Uji Suara Audio Bahasa Inggris"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Tes Suara</span>
          </button>

          {/* Settings Modal Toggle */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            title="Pengaturan API & Model"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-600/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
