import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Mic, 
  Award 
} from 'lucide-react';
import { quickPhrases } from '../data/ropRules';
import { speechService } from '../services/speechSynthesis';
import { SettingsState, QuickPhrase } from '../types';

interface QuickCheatSheetProps {
  settings?: SettingsState;
}

const CATEGORIES = ['Semua', 'Roll Call', 'Motions', 'Points', 'Yielding', 'Diplomatic Phrases'] as const;

export default function QuickCheatSheet({ settings }: QuickCheatSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPhrases = quickPhrases.filter((phrase: QuickPhrase) => {
    const matchesCat = selectedCategory === 'Semua' || phrase.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      phrase.title.toLowerCase().includes(q) ||
      phrase.trigger.toLowerCase().includes(q) ||
      phrase.english.toLowerCase().includes(q) ||
      phrase.indoMeaning.toLowerCase().includes(q) ||
      phrase.caraBaca.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handlePlayAudio = (phrase: QuickPhrase) => {
    if (playingId === phrase.id) {
      speechService.stop();
      setPlayingId(null);
    } else {
      speechService.speak(phrase.english, {
        rate: settings?.speechRate || 0.95,
        onStart: () => setPlayingId(phrase.id),
        onEnd: () => setPlayingId(null),
        onError: () => setPlayingId(null)
      });
    }
  };

  const handleCopy = (phrase: QuickPhrase) => {
    navigator.clipboard.writeText(phrase.english);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Quick Diplomatic Cheat Sheet & Soundboard
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Papan penyelamat sidang darurat. Saat Chair meminta mosi atau Anda ingin menginterupsi, klik tombol audio untuk mendengar lafalnya atau langsung baca teks fonetiknya!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Sesuai RoP PUMUN SDC 1.0</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat === 'Semua' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kalimat, situasi, atau kata kunci..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition"
          />
        </div>
      </div>

      {/* Grid of Phrase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPhrases.map((phrase) => {
          const isPlaying = playingId === phrase.id;
          const isCopied = copiedId === phrase.id;

          return (
            <div
              key={phrase.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition group"
            >
              <div className="space-y-3">
                {/* Badge and Situational Trigger */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {phrase.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium text-right italic">
                    {phrase.trigger}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                  {phrase.title}
                </h3>

                {/* English phrase */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 font-editorial text-base text-slate-900 leading-snug">
                  "{phrase.english}"
                </div>

                {/* Cara Baca (Phonetics) */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Mic className="w-3 h-3 text-amber-700" /> Cara Baca Fonetik (Lafalkan ini)
                  </div>
                  <div className="font-mono text-sm font-medium text-slate-900 leading-relaxed">
                    "{phrase.caraBaca}"
                  </div>
                </div>

                {/* Indonesian Meaning */}
                <div className="text-xs text-slate-600 leading-relaxed pt-1">
                  <strong className="text-slate-800">Arti:</strong> {phrase.indoMeaning}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(phrase)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isPlaying
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dengar Audio</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(phrase)}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition"
                  title="Salin kalimat Inggris"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPhrases.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          Tidak ditemukan kalimat dengan kata kunci "{searchQuery}". Coba kata kunci lain atau pilih tab kategori "Semua".
        </div>
      )}
    </div>
  );
}
