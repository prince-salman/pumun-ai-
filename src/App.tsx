import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CoDelegateChat from './components/CoDelegateChat';
import DebateListener from './components/DebateListener';
import SpeechTeleprompter from './components/SpeechTeleprompter';
import DebateRadar from './components/DebateRadar';
import QuickCheatSheet from './components/QuickCheatSheet';
import PositionPaperStudio from './components/PositionPaperStudio';
import CountryIntelligence from './components/CountryIntelligence';
import ResolutionCrafter from './components/ResolutionCrafter';
import SettingsModal from './components/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSetting={updateSetting}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workstation Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'chat' && (
          <CoDelegateChat 
            settings={settings} 
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        )}
        {activeTab === 'listener' && <DebateListener settings={settings} />}
        {activeTab === 'teleprompter' && <SpeechTeleprompter settings={settings} />}
        {activeTab === 'radar' && <DebateRadar settings={settings} />}
        {activeTab === 'cheatsheet' && <QuickCheatSheet settings={settings} />}
        {activeTab === 'pospap' && <PositionPaperStudio settings={settings} />}
        {activeTab === 'countries' && <CountryIntelligence settings={settings} />}
        {activeTab === 'resolution' && <ResolutionCrafter settings={settings} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Republic of Kenya • PUMUN Regeneration 2026 (SDC 1.0)</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Solo Delegate: Muhamad Salman</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PUMUN Protocol Compliant</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Model: {settings.selectedModel}
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
