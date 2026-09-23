import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Volume2, 
  Copy, 
  Check, 
  Sparkles, 
  Mic, 
  Square, 
  Play, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  Compass, 
  BookOpen, 
  Send, 
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { DEBATE_SUBTOPICS, KEYWORD_ITEMS, CRISIS_SCENARIOS } from '../data/debateSubtopics';
import { DebateSubtopic, KeywordItem, CrisisScenario, SettingsState, SpeechData } from '../types';
import { speechService } from '../services/speechSynthesis';
import { generateDiplomaticSpeech } from '../services/aiService';

interface DebateRadarProps {
  settings: SettingsState;
}

export default function DebateRadar({ settings }: DebateRadarProps) {
  const [activeSection, setActiveSection] = useState<'subtopics' | 'crisis' | 'keywords' | 'guide'>('subtopics');
  const [selectedSubtopic, setSelectedSubtopic] = useState<DebateSubtopic>(DEBATE_SUBTOPICS[0]);
  const [subtopicSpeechTab, setSubtopicSpeechTab] = useState<'english' | 'caraBaca' | 'makna'>('caraBaca');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Rebuttal state
  const [rebuttalInput, setRebuttalInput] = useState('');
  const [isGeneratingRebuttal, setIsGeneratingRebuttal] = useState(false);
  const [rebuttalOutput, setRebuttalOutput] = useState<SpeechData | null>(null);
  const [rebuttalTab, setRebuttalTab] = useState<'english' | 'caraBaca' | 'makna'>('caraBaca');

  // Voice recording state
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRebuttalInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningMic(false);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      setRecognitionInstance(recognition);
    }
  }, []);

  const handleToggleMic = () => {
    if (!recognitionInstance) return;
    if (isListeningMic) {
      recognitionInstance.stop();
      setIsListeningMic(false);
    } else {
      try {
        recognitionInstance.start();
        setIsListeningMic(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  };

  const handlePlayAudio = (text: string) => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    speechService.speak(text, {
      rate: settings.speechRate || 0.95,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateRebuttal = async (promptText?: string) => {
    const textToSubmit = promptText || rebuttalInput;
    if (!textToSubmit.trim()) return;

    setIsGeneratingRebuttal(true);
    try {
      const result = await generateDiplomaticSpeech({
        indonesianIdea: `Respon / Rebuttal Kilat atas perdebatan berikut: "${textToSubmit}"`,
        mode: 'POI',
        durationSeconds: 45,
        subtopic: 'Debate Rebuttal & Crisis Response',
        model: settings.selectedModel,
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl
      });
      setRebuttalOutput(result);
    } catch (err) {
      console.error('Failed to generate rebuttal:', err);
    } finally {
      setIsGeneratingRebuttal(false);
    }
  };

  const handleSelectCrisis = (crisis: CrisisScenario) => {
    setRebuttalOutput({
      english: crisis.responseEnglish,
      caraBaca: crisis.responseCaraBaca,
      indoMeaning: crisis.responseIndo,
      wordCount: crisis.responseEnglish.split(' ').length,
      estimatedSeconds: 45
    });
    setRebuttalInput(crisis.situationIndo);
  };

  const filteredSubtopics = DEBATE_SUBTOPICS.filter((sub) =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.descriptionIndo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKeywords = KEYWORD_ITEMS.filter((kw) =>
    kw.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.indoMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.contextInDebate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PUMUN 2026 Strategy Guide
              </span>
              <span className="text-xs text-slate-400">UNICEF Committee</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2 tracking-tight">
              <Radar className="w-6 h-6 text-emerald-400" />
              Radar Subtopik & Respon Cepat Debat
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Anda tidak perlu cemas memikirkan apa yang akan dibicarakan 22 delegasi lain. Debat PUMUN selalu terpusat pada <strong>8 subtopik di bawah ini</strong>. Trik terbaik untuk delegasi solo: <strong>Ajukan mosi duluan</strong> agar Anda menjadi pembicara pertama dengan naskah yang sudah Anda kuasai!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('subtopics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'subtopics'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              8 Subtopik
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('crisis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'crisis'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Respon Kilat
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('keywords')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'keywords'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Kamus Dengar
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeSection === 'guide'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Alur Sidang
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: 8 SUBTOPIK KAUKUS */}
      {activeSection === 'subtopics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subtopic Selector Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                Daftar Prediksi Subtopik (Pilih Satu)
              </h2>
              <span className="text-[11px] text-slate-400">Total: {DEBATE_SUBTOPICS.length} Topik</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari subtopik (misal: sekolah, dana, trauma)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredSubtopics.map((sub) => {
                const isSelected = selectedSubtopic.id === sub.id;
                const likelihoodColors = {
                  'Sangat Tinggi': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  'Tinggi': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  'Sedang': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                };

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubtopic(sub)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${likelihoodColors[sub.likelihood]}`}>
                        Peluang: {sub.likelihood}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">60 Detik</span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {sub.descriptionIndo}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtopic Detail & Action Center */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
              {/* Header Card */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
                    Subtopik Aktif
                  </span>
                  <span className="text-xs text-slate-400 font-mono italic">
                    "{selectedSubtopic.englishTitle}"
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white mt-1">
                  {selectedSubtopic.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedSubtopic.descriptionIndo}
                </p>
              </div>

              {/* Debate Dynamics: What Others Say vs Kenya Stance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Apa Kata Negara Lain:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedSubtopic.whatOthersSay}
                  </p>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                  <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Posisi & Senjata Kenya:
                  </span>
                  <p className="text-emerald-200/90 leading-relaxed">
                    {selectedSubtopic.kenyaStance}
                  </p>
                </div>
              </div>

              {/* ACTION 1: Motion Wording to Propose This Topic */}
              <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Teks Mosi Siap Ajukan (Angkat Placard & Baca Ini):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(selectedSubtopic.motionText)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      Dengar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedSubtopic.motionText, `motion-${selectedSubtopic.id}`)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1"
                    >
                      {copiedKey === `motion-${selectedSubtopic.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      Salin
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300">
                  {selectedSubtopic.motionText}
                </div>

                <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    🗣️ Cara Baca (Lafalkan ini langsung):
                  </span>
                  <p className="text-xs font-medium text-amber-200 italic leading-relaxed">
                    "{selectedSubtopic.motionCaraBaca}"
                  </p>
                </div>
              </div>

              {/* ACTION 2: Ready-Made 60-Second Speech */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      Naskah Pidato Kaukus (60 Detik)
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      Tinggal Baca di Podium
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setSubtopicSpeechTab('caraBaca')}
                        className={`px-2 py-1 rounded-md font-bold transition ${
                          subtopicSpeechTab === 'caraBaca'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🗣️ Cara Baca
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubtopicSpeechTab('english')}
                        className={`px-2 py-1 rounded-md font-bold transition ${
                          subtopicSpeechTab === 'english'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🇬🇧 Inggris
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubtopicSpeechTab('makna')}
                        className={`px-2 py-1 rounded-md font-bold transition ${
                          subtopicSpeechTab === 'makna'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🇮🇩 Arti
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(selectedSubtopic.readySpeech.english)}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
                      title="Putar Audio Pelafalan Bahasa Inggris"
                    >
                      {isPlayingAudio ? (
                        <Square className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-sm leading-relaxed min-h-[140px]">
                  {subtopicSpeechTab === 'caraBaca' && (
                    <p className="text-amber-200/90 font-mono text-sm leading-loose">
                      "{selectedSubtopic.readySpeech.caraBaca}"
                    </p>
                  )}
                  {subtopicSpeechTab === 'english' && (
                    <p className="text-slate-100 font-serif leading-relaxed text-[15px]">
                      "{selectedSubtopic.readySpeech.english}"
                    </p>
                  )}
                  {subtopicSpeechTab === 'makna' && (
                    <p className="text-slate-300 leading-relaxed text-sm">
                      "{selectedSubtopic.readySpeech.indoMeaning}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE CRISIS & REBUTTAL RESPONDER */}
      {activeSection === 'crisis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Scenario Buttons */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Skenario Pertanyaan Mendadak (1-Klik Jawaban)
            </h2>
            <p className="text-xs text-slate-400">
              Pilih salah satu situasi di bawah jika negara lain atau Chair tiba-tiba menunjuk Kenya:
            </p>

            <div className="space-y-2">
              {CRISIS_SCENARIOS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCrisis(c)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition group"
                >
                  <span className="text-xs font-bold text-amber-300 group-hover:text-emerald-400 block">
                    {c.triggerPhrase}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {c.situationIndo}
                  </span>
                </div>
              ))}
            </div>

            {/* Custom Input Box */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Atau Masukkan Apa yang Anda Dengar:</span>
                {speechRecognitionSupported && (
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 border transition ${
                      isListeningMic
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    {isListeningMic ? 'Mendengarkan...' : 'Pakai Mic'}
                  </button>
                )}
              </label>

              <textarea
                rows={3}
                value={rebuttalInput}
                onChange={(e) => setRebuttalInput(e.target.value)}
                placeholder="Contoh: Negara Swedia nanya dana rehabilitasi dari mana, atau mereka lagi bahas anak di perbatasan..."
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() => handleGenerateRebuttal()}
                disabled={isGeneratingRebuttal || !rebuttalInput.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                {isGeneratingRebuttal ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    Menyusun Jawaban Diplomasi Kenya...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Buat Pidato Balasan Spontan (30-45 Detik)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rebuttal Output Box */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <h2 className="text-sm font-extrabold text-white">
                    Hasil Pidato Respon Debat Kenya
                  </h2>
                </div>

                {rebuttalOutput && (
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setRebuttalTab('caraBaca')}
                        className={`px-2 py-1 rounded-md font-bold transition ${
                          rebuttalTab === 'caraBaca'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🗣️ Cara Baca
                      </button>
                      <button
                        type="button"
                        onClick={() => setRebuttalTab('english')}
                        className={`px-2 py-1 rounded-md font-bold transition ${
                          rebuttalTab === 'english'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🇬🇧 Inggris
                      </button>
                      <button
                        type="button"
                        onClick={() => setRebuttalTab('makna')}
                        className={`px-2 py-1 rounded-md font-bold transition ${
                          rebuttalTab === 'makna'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🇮🇩 Arti
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(rebuttalOutput.english)}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
                      title="Putar Audio"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(rebuttalOutput.english, 'rebuttal-copy')}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
                      title="Salin Teks"
                    >
                      {copiedKey === 'rebuttal-copy' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {rebuttalOutput ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm leading-relaxed min-h-[160px]">
                    {rebuttalTab === 'caraBaca' && (
                      <p className="text-amber-200/90 font-mono text-sm leading-loose">
                        "{rebuttalOutput.caraBaca}"
                      </p>
                    )}
                    {rebuttalTab === 'english' && (
                      <p className="text-slate-100 font-serif leading-relaxed text-[15px]">
                        "{rebuttalOutput.english}"
                      </p>
                    )}
                    {rebuttalTab === 'makna' && (
                      <p className="text-slate-300 leading-relaxed text-sm">
                        "{rebuttalOutput.indoMeaning}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      Estimasi Bicara: ~35-45 Detik
                    </span>
                    <span className="text-slate-500 font-mono">
                      {rebuttalOutput.english.split(' ').length} Kata
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 space-y-2 border border-dashed border-slate-800 rounded-xl">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">
                    Pilih skenario darurat di samping kiri atau ketik kata kunci yang Anda dengar di ruang sidang, lalu klik <strong>"Buat Pidato Balasan Spontan"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: KAMUS KATA KUNCI PENDENGARAN */}
      {activeSection === 'keywords' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                Kamus Dengar Kata Kunci Sidang (Keyword Ear-Training)
              </h2>
              <p className="text-xs text-slate-400">
                Anda tidak perlu memahami seluruh kalimat bahasa Inggris yang panjang. Cukup dengarkan 1 kata kunci ini:
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari kata kunci (misal: funding, border)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredKeywords.map((kw) => (
              <div
                key={kw.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {kw.englishWord}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(kw.englishWord)}
                    className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    title="Dengar Lafal"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

                <div className="text-[11px] text-amber-200/90 font-medium">
                  🗣️ Lafal: <span className="font-mono italic">"{kw.caraBaca}"</span>
                </div>

                <div className="text-xs text-slate-300 font-semibold">
                  🇮🇩 Arti: {kw.indoMeaning}
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="font-bold text-slate-300 block mb-0.5">Kapan Diucapkan:</span>
                  {kw.contextInDebate}
                </div>

                <div className="text-[11px] text-emerald-300 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block mb-0.5">Tindakan Salman:</span>
                  {kw.kenyaAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: PANDUAN ALUR SIDANG DARI MENIT KE MENIT */}
      {activeSection === 'guide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Panduan Jalur Sidang MUN PUMUN SDC 1.0 (Langkah demi Langkah)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Panduan praktis untuk Salman agar tidak bingung apa yang sedang terjadi di ruangan sidang:
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/40">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Absensi (Roll Call) di Menit Pertama
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chair akan memanggil nama negara satu per satu berdasarkan abjad. Ketika Chair memanggil: <em>"Republic of Kenya"</em>:
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-emerald-300">
                  Angkat Placard dan ucapkan: "Present and voting, Chair!" (Lafal: Prezen end foting, Cyer!)
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/40">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  General Speakers List (GSL) - Pidato Pembuka
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chair akan bertanya: <em>"Are there any delegates wishing to be added to the General Speakers List?"</em>.
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300">
                  <strong>Trik Salman:</strong> Angkat placard tinggi-tinggi. Saat nama Kenya dipanggil, Anda maju/berdiri untuk membaca naskah 90 detik GSL yang sudah ada di tab <strong>Live Teleprompter</strong> dengan tab Cara Baca. Di akhir pidato, selalu ucapkan: <em>"Kenya yields back its time to the Chair"</em>.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/40">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Moderated Caucus (Diskusi Topik Spesifik)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chair akan membuka lantai untuk mosi kaukus: <em>"Floor is now open for points or motions"</em>.
                </p>
                <div className="p-2 bg-emerald-950/20 rounded border border-emerald-500/30 text-xs text-emerald-200">
                  <strong>Trik Emas Salman:</strong> Jangan tunggu negara lain! Langsung angkat placard dan baca teks mosi dari tab <strong>8 Subtopik</strong> di aplikasi ini. Jika mosi Salman lolos, Salman otomatis jadi pembicara pertama dengan naskah 60 detik yang sudah siap!
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/40">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Unmoderated Caucus (Lobi Bebas & Bikin Blok)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Semua delegasi berdiri, berjalan, dan berkumpul membentuk kelompok untuk menyusun klausul.
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300">
                  <strong>Trik Salman:</strong> Temui delegasi <strong>DR Congo (Kongo)</strong>, <strong>Indonesia</strong>, atau <strong>Filipina</strong>. Anda bisa ngobrol santai pakai Bahasa Indonesia (karena sesama delegasi mahasiswa Indonesia) atau tunjukkan tab <strong>Resolution Crafter</strong> kita yang sudah punya klausul SAFE-LEARN dan CBC siap pakai!
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/40">
                5
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Voting Resolution (Penentuan Juara)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Draf resolusi dibacakan dan dilakukan pemungutan suara (Voting).
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs text-emerald-300">
                  Pastikan nama Kenya tercantum sebagai <strong>Sponsor</strong> (bukan hanya Signatory). Angkat placard Anda dan pilih <em>"In favor"</em> (Lafal: <em>In feifer!</em>) untuk draf blok koalisi Anda.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
