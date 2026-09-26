import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCw, 
  BookOpen, 
  ArrowRight, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { countriesDossier } from '../data/countriesDossier';
import { SettingsState, SpeechAnalysisResult } from '../types';
import { analyzeDelegateSpeech, getOfflineAnalysisFallback } from '../services/aiService';
import { speechService } from '../services/speechSynthesis';

interface DebateListenerProps {
  settings: SettingsState;
}

const QUICK_DEBATE_TRIGGERS = [
  { label: 'Bahas Anggaran / Dana', query: 'Mempertanyakan dari mana sumber dana rehabilitasi dan menuntut transparansi audit ketat' },
  { label: 'Bahas Perbatasan / Border', query: 'Menyinggung kebocoran rute perdagangan anak lintas batas negara dan kelemahan patroli' },
  { label: 'Bahas Sekolah / Akta Lahir', query: 'Membahas anak korban yang terhambat masuk sekolah karena tidak punya dokumen identitas resmi' },
  { label: 'Bahas Trauma / Mental', query: 'Mengusulkan bantuan psikologis darurat dan penanganan trauma anak sebelum sekolah' },
  { label: 'Bahas Kejahatan Siber', query: 'Membahas eksploitasi anak di internet, game online, dan pemblokiran platform digital' },
];

export default function DebateListener({ settings }: DebateListenerProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('United States of America');
  const [speechInput, setSpeechInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SpeechAnalysisResult | null>(() => 
    getOfflineAnalysisFallback('United States of America', 'Mempertanyakan sumber dana dan regulasi siber')
  );
  
  const [activeSpeechTab, setActiveSpeechTab] = useState<'caraBaca' | 'english' | 'makna'>('caraBaca');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string | null>(null);

  // Auto-scroll ref
  const resultRef = useRef<HTMLDivElement>(null);

  // Voice recording state
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [micLang, setMicLang] = useState<'en-US' | 'id-ID'>('en-US');
  const isListeningMicRef = useRef<boolean>(false);
  const baseTextRef = useRef<string>('');
  const recordingTimerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechRecognitionSupported(true);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung input suara langsung. Disarankan menggunakan Google Chrome atau Microsoft Edge.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }

      baseTextRef.current = speechInput;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = micLang;

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += text + ' ';
          } else {
            interimChunk += text;
          }
        }
        if (finalChunk) {
          baseTextRef.current = baseTextRef.current ? `${baseTextRef.current.trim()} ${finalChunk.trim()}` : finalChunk.trim();
          setSpeechInput(baseTextRef.current);
        } else if (interimChunk) {
          setSpeechInput(baseTextRef.current ? `${baseTextRef.current.trim()} ${interimChunk.trim()}` : interimChunk.trim());
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e.error);
        if (e.error === 'not-allowed') {
          isListeningMicRef.current = false;
          setIsListeningMic(false);
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        }
      };

      recognition.onend = () => {
        // Auto-restart if user has not clicked Stop (prevents Chrome 10s-60s timeout cut-offs)
        if (isListeningMicRef.current) {
          try {
            recognition.start();
          } catch (_) {
            setTimeout(() => {
              if (isListeningMicRef.current) {
                try {
                  recognition.start();
                } catch (_) {
                  isListeningMicRef.current = false;
                  setIsListeningMic(false);
                  if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
                }
              }
            }, 250);
          }
        } else {
          setIsListeningMic(false);
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      isListeningMicRef.current = true;
      setIsListeningMic(true);
      setRecordingSeconds(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      isListeningMicRef.current = false;
      setIsListeningMic(false);
    }
  };

  const stopListening = () => {
    isListeningMicRef.current = false;
    setIsListeningMic(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
  };

  const handleToggleMic = () => {
    if (isListeningMic) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleAnalyze = async (overrideText?: string) => {
    const textToAnalyze = overrideText || speechInput || 'Mempertanyakan dana rehabilitasi dan regulasi';
    setIsLoading(true);
    speechService.stop();
    setIsPlayingAudio(false);

    try {
      const result = await analyzeDelegateSpeech({
        countryName: selectedCountry,
        rawSpeechOrIdea: textToAnalyze,
        model: settings.selectedModel,
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl
      });
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setAnalysisResult(getOfflineAnalysisFallback(selectedCountry, textToAnalyze));
    } finally {
      setIsLoading(false);
      setLastAnalyzedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setTimeout(() => {
        if (typeof resultRef.current?.scrollIntoView === 'function') {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handlePlayAudio = (text: string) => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      speechService.speak(text, {
        rate: settings.speechRate || 0.95,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <Headphones className="w-3.5 h-3.5 text-emerald-600" />
            <span>Asisten Pendengar Sidang Real-Time</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dengar Lawan & Buat Sanggahan Kilat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Saat delegasi lain sedang berpidato di depan, pilih nama negaranya atau masukkan 1–2 kata yang Anda dengar. AI langsung merangkum intinya dalam 1 kalimat Bahasa Indonesia dan menyiapkan <strong>naskah sanggahan siap baca</strong>!
          </p>
        </div>
      </div>

      {/* INPUT CARD: Simple, Focused, Zero-Clutter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Langkah 1: Siapa yang Sedang Berbicara?
        </h2>

        {/* Country Selector Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Negara yang Berbicara di Podium:
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer transition shadow-sm"
            >
              {countriesDossier.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.flag} {c.name} ({c.bloc})
                </option>
              ))}
              <option value="Delegasi Lain / Umum">🌍 Delegasi Lain / Umum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topik Populer yang Sering Diangkat:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_DEBATE_TRIGGERS.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSpeechInput(t.query);
                    handleAnalyze(t.query);
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition font-medium"
                >
                  ⚡ {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Text or Microphone */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700">
              Langkah 2: Apa yang Mereka Katakan / Kata Kunci yang Anda Dengar?
            </label>

            <div className="flex items-center gap-2">
              {/* Language toggle: English for foreign delegates in MUN, Indonesian for local thoughts */}
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setMicLang('en-US')}
                  disabled={isListeningMic}
                  className={`px-2 py-0.5 rounded-md transition ${
                    micLang === 'en-US'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Bahasa Pidato: English (Delegasi Asing)"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setMicLang('id-ID')}
                  disabled={isListeningMic}
                  className={`px-2 py-0.5 rounded-md transition ${
                    micLang === 'id-ID'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Bahasa Pidato: Bahasa Indonesia"
                >
                  ID
                </button>
              </div>

              {speechRecognitionSupported && (
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition border ${
                    isListeningMic
                      ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
                  }`}
                  title={isListeningMic ? "Klik untuk menghentikan rekaman" : "Mulai merekam suara tanpa batas waktu (bisa lama)"}
                >
                  {isListeningMic ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <MicOff className="w-3.5 h-3.5 text-white" />
                      <span>
                        Merekam {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60) < 10 ? '0' : ''}{recordingSeconds % 60} (Klik Selesai)
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Rekam Suara (Bisa Lama)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={2}
            value={speechInput}
            onChange={(e) => setSpeechInput(e.target.value)}
            placeholder="Ketik dalam Bahasa Indonesia apa yang Anda dengar (contoh: mereka nanya dana dari mana, atau mereka nyalahin perbatasan Afrika yang bocor)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 resize-none transition"
          />
        </div>

        {/* Main Action Button */}
        <button
          type="button"
          onClick={() => handleAnalyze()}
          disabled={isLoading}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-white" />
              <span>Menganalisis Pidato & Meracik Jawaban Kenya...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Rangkumkan & Siapkan Jawaban Kenya Sekarang</span>
            </>
          )}
        </button>

        {/* Visual Cue */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
          <span className="text-emerald-600 font-bold">👇 Hasil Analisis & Naskah Pidato</span>
          <span>akan otomatis muncul dan ter-scroll ke bawah ini</span>
        </div>
      </div>

      {/* OUTPUT SECTION: 3 Crystal-Clear Cards */}
      {analysisResult && (
        <div ref={resultRef} className="space-y-4 animate-in fade-in duration-300 scroll-mt-24">
          {/* Status feedback bar */}
          <div className="flex items-center justify-between text-xs px-4 py-2.5 rounded-xl border bg-emerald-50 text-emerald-900 border-emerald-200 shadow-sm">
            <span className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {analysisResult.counterSpeech.isFallback
                ? 'Mode Siaga Otomatis (Respons Kilat)'
                : `Analisis AI Live Berhasil (${settings.selectedModel})`}
            </span>
            {lastAnalyzedTime && (
              <span className="text-[11px] font-mono text-emerald-700">
                Pukul: {lastAnalyzedTime} WIB
              </span>
            )}
          </div>

          {/* CARD 1: Inti Omongan Mereka */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                1. Inti Omongan {analysisResult.countryName}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Rangkuman 1 Kalimat</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              "{analysisResult.summaryIndo}"
            </p>
          </div>

          {/* CARD 2: Analisis Sikap & Taktik Kenya */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                2. Status & Taktik untuk Kenya
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                analysisResult.kenyaImpact === 'Menguntungkan'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : analysisResult.kenyaImpact === 'Mengancam / Perlu Direspon'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {analysisResult.kenyaImpact}
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              💡 <strong>Tindakan Anda:</strong> {analysisResult.kenyaStrategy}
            </p>
          </div>

          {/* CARD 3: Naskah Sanggahan / Pidato Balasan (TINGGAL BACA!) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  3. Naskah Jawaban / Sanggahan Anda (Tinggal Baca di Podium!)
                </span>
                <span className="text-[11px] text-slate-500">
                  Estimasi bicara: ~30-40 detik (Pas untuk interupsi / kaukus)
                </span>
              </div>

              {/* View Switcher Tabs & Controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveSpeechTab('caraBaca')}
                    className={`px-3 py-1 rounded-md font-bold transition ${
                      activeSpeechTab === 'caraBaca'
                        ? 'bg-amber-100 text-amber-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🗣️ Cara Baca
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSpeechTab('english')}
                    className={`px-3 py-1 rounded-md font-bold transition ${
                      activeSpeechTab === 'english'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇬🇧 Inggris
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSpeechTab('makna')}
                    className={`px-3 py-1 rounded-md font-bold transition ${
                      activeSpeechTab === 'makna'
                        ? 'bg-blue-100 text-blue-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇮🇩 Arti
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAudio(analysisResult.counterSpeech.english)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition shadow-sm ${
                    isPlayingAudio
                      ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                  title="Putar Audio Pelafalan"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Dengar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(analysisResult.counterSpeech.english)}
                  className="p-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 shadow-sm transition"
                  title="Salin Teks Inggris"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Display Box: VERY BIG, CLEAR FONT */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 min-h-[140px]">
              {activeSpeechTab === 'caraBaca' && (
                <div className="bg-amber-50/80 p-5 rounded-xl border border-amber-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Lafalkan Saja Teks Ini di Depan Mikrofon:
                  </div>
                  <p className="text-slate-900 font-sans text-lg sm:text-xl leading-loose font-semibold tracking-wide">
                    "{analysisResult.counterSpeech.caraBaca}"
                  </p>
                </div>
              )}

              {activeSpeechTab === 'english' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Naskah Resmi Bahasa Inggris:
                  </div>
                  <p className="text-slate-900 font-editorial text-lg sm:text-xl leading-relaxed">
                    "{analysisResult.counterSpeech.english}"
                  </p>
                </div>
              )}

              {activeSpeechTab === 'makna' && (
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    Arti Kalimat yang Anda Ucapkan:
                  </div>
                  <p className="text-slate-800 text-base leading-relaxed">
                    "{analysisResult.counterSpeech.indoMeaning}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>💡 Di akhir pidato, selalu tutup dengan: <strong className="text-slate-900">"Kenya yields back its time."</strong></span>
              <span className="font-mono text-[11px]">{analysisResult.counterSpeech.wordCount} Kata</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
