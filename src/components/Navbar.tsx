import React from 'react';
import { 
  MessageSquare,
  Headphones,
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
    { id: 'chat', label: 'Tanya Nata (Chat AI)', icon: MessageSquare, badge: 'Asisten' },
    { id: 'listener', label: 'Dengar Lawan & Tangkis', icon: Headphones, badge: 'Live' },
    { id: 'teleprompter', label: 'Pidato Saya', icon: Mic },
    { id: 'cheatsheet', label: 'Contekan Darurat', icon: Zap },
    { id: 'radar', label: 'Radar Subtopik', icon: Radar },
    { id: 'countries', label: '22 Negara Intel', icon: Globe },
    { id: 'resolution', label: 'Resolution Crafter', icon: FileCode },
    { id: 'pospap', label: 'Position Paper', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-sm select-none">
            🇰🇪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                KENYA CO-DELEGATE
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                UNICEF • PUMUN 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                {settings.delegateName || 'Muhamad Salman'} (Solo)
              </span>
              <span className="text-slate-300 hidden md:inline">•</span>
              <span className="text-slate-500 hidden md:inline truncate max-w-[320px]">
                Agenda: Child Protection & Education (SDC 1.0)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Model Selector & Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Model Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={settings.selectedModel}
              onChange={(e) => updateSetting('selectedModel', e.target.value)}
              className="bg-transparent text-slate-800 font-medium text-xs focus:outline-none cursor-pointer pr-1"
              title="Ganti Model AI GutsAI"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-white text-slate-800">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Voice Audio Button */}
          <button
            type="button"
            onClick={handleTestAudio}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
            title="Uji Suara Audio Bahasa Inggris"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Tes Suara</span>
          </button>

          {/* Settings Modal Toggle */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-sm"
            title="Pengaturan API & Model"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 border-t border-slate-100">
        <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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
