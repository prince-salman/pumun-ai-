import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Mic, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Flame,
  Award
} from 'lucide-react';
import { quickPhrases, ropRules } from '../data/ropRules';
import { speechService } from '../services/speechSynthesis';

const CATEGORIES = ['Semua', 'Roll Call', 'Motions', 'Points', 'Yielding', 'Diplomatic Phrases'];

export default function QuickCheatSheet({ settings }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredPhrases = quickPhrases.filter((phrase) => {
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

  const handlePlayAudio = (phrase) => {
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

  const handleCopy = (phrase) => {
    navigator.clipboard.writeText(phrase.english);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Quick Diplomatic Cheat Sheet & Soundboard
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Papan penyelamat sidang darurat. Saat Chair meminta mosi atau Anda ingin menginterupsi, klik tombol audio untuk mendengar lafalnya atau langsung baca teks fonetiknya!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-amber-300">
          <Award className="w-4 h-4 text-amber-400" />
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat === 'Semua' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kalimat, situasi, atau kata kunci..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
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
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between transition group"
            >
              <div className="space-y-3">
                {/* Badge and Situational Trigger */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400 border border-amber-500/20">
                    {phrase.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium text-right italic">
                    {phrase.trigger}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition">
                  {phrase.title}
                </h3>

                {/* English phrase */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 font-editorial text-base text-slate-100 leading-snug">
                  "{phrase.english}"
                </div>

                {/* Cara Baca (Phonetics) */}
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Cara Baca Fonetik (Lafalkan ini)
                  </div>
                  <div className="font-sans text-sm font-medium text-amber-200/90 leading-relaxed">
                    {phrase.caraBaca}
                  </div>
                </div>

                {/* Indonesian Meaning */}
                <div className="text-xs text-slate-400 leading-relaxed pt-1">
                  <strong className="text-slate-300">Arti:</strong> {phrase.indoMeaning}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(phrase)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    isPlaying
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                      : 'bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 border border-emerald-500/20'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengar Audio</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(phrase)}
                  className="py-1.5 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                  title="Salin kalimat Inggris"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
