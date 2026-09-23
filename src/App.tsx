import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SpeechTeleprompter from './components/SpeechTeleprompter';
import QuickCheatSheet from './components/QuickCheatSheet';
import PositionPaperStudio from './components/PositionPaperStudio';
import CountryIntelligence from './components/CountryIntelligence';
import ResolutionCrafter from './components/ResolutionCrafter';
import SettingsModal from './components/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('teleprompter');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSetting={updateSetting}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workstation Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'teleprompter' && <SpeechTeleprompter settings={settings} />}
        {activeTab === 'cheatsheet' && <QuickCheatSheet settings={settings} />}
        {activeTab === 'pospap' && <PositionPaperStudio settings={settings} />}
        {activeTab === 'countries' && <CountryIntelligence settings={settings} />}
        {activeTab === 'resolution' && <ResolutionCrafter settings={settings} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>🇰🇪 Republic of Kenya • PUMUN Regeneration 2026 (SDC 1.0)</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-500 font-medium">Solo Delegate Muhamad Salman</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TypeScript Ready • Offline Knowledge Base</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              AI: {settings.selectedModel}
            </span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          updateSetting={updateSetting}
          resetSettings={resetSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
