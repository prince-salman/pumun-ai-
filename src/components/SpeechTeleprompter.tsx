import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  BookOpen, 
  Mic, 
  MicOff, 
  Clock, 
  Layers, 
  AlertCircle,
  HelpCircle,
  RotateCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { generateDiplomaticSpeech, getOfflineFallbackSpeech } from '../services/aiService';
import { getPaperBasedSpeech, PAPER_PILLARS } from '../data/paperKnowledge';
import { speechService } from '../services/speechSynthesis';
import CountdownTimer from './CountdownTimer';
import { SettingsState, SpeechMode, SpeechData } from '../types';

interface SpeechTeleprompterProps {
  settings: SettingsState;
}

const SPEECH_MODES: SpeechMode[] = [
  { id: 'GSL', label: 'General Speakers List (90s)', duration: 90, desc: 'Pidato pembuka / umum posisi Kenya' },
  { id: 'MOD', label: 'Moderated Caucus (60s)', duration: 60, desc: 'Debat terfokus pada sub-isu spesifik' },
  { id: 'MOD45', label: 'Moderated Caucus (45s)', duration: 45, desc: 'Debat kilat waktu padat' },
  { id: 'POI', label: 'Point of Information (30s)', duration: 30, desc: 'Pertanyaan atau sanggahan ringkas' },
];

const QUICK_TOPICS = [
  {
    label: 'Pendaftaran Sekolah Tanpa Akta',
    prompt: 'Kami mendesak agar anak korban perdagangan manusia bisa langsung masuk sekolah darurat tanpa terhambat syarat akta lahir atau dokumen identitas.'
  },
  {
    label: 'Pelatihan Guru Berbasis Trauma',
    prompt: 'Penyintas membutuhkan guru yang terlatih menangani trauma emosional (trauma-informed pedagogy) dan konselor psikologis di sekolah.'
  },
  {
    label: 'Kerjasama Perbatasan Afrika Timur',
    prompt: 'Kenya mengusulkan satuan tugas regional bersama negara tetangga di East African Community untuk pelacakan korban dan pemulangan yang aman.'
  },
  {
    label: 'Permohonan Dana Donor Multilateral',
    prompt: 'Negara berkembang butuh dukungan dana hibah dari negara-negara maju untuk membangun shelter sekolah aman tanpa intervensi hukum kedaulatan.'
  }
];

export default function SpeechTeleprompter({ settings }: SpeechTeleprompterProps) {
  const [aiMode, setAiMode] = useState<'online' | 'paper'>(settings.aiMode || 'online');
  const [selectedPaperPillar, setSelectedPaperPillar] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<SpeechMode>(SPEECH_MODES[0]);
  const [indonesianIdea, setIndonesianIdea] = useState<string>('');
  const [subtopic, setSubtopic] = useState<string>('Pendidikan & Reintegrasi Korban');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'english' | 'caraBaca' | 'indoMeaning' | 'all'>('caraBaca');
  const [isPodiumFocus, setIsPodiumFocus] = useState<boolean>(false);
  const [speechData, setSpeechData] = useState<SpeechData>(() => getOfflineFallbackSpeech({ mode: 'GSL', durationSeconds: 90 }));
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [micLang, setMicLang] = useState<'id-ID' | 'en-US'>('id-ID');
  const isListeningRef = useRef<boolean>(false);
  const baseIdeaRef = useRef<string>('');
  const sessionFinalTextRef = useRef<string>('');
  const recordingTimerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  const createAndStartRecognition = () => {
    if (!isListeningRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = micLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = 0; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += text + ' ';
          } else {
            interimChunk += text;
          }
        }

        sessionFinalTextRef.current = finalChunk.trim();

        const base = baseIdeaRef.current.trim();
        const spoken = (finalChunk + interimChunk).trim();
        const combined = base && spoken ? `${base} ${spoken}` : (spoken || base);

        setIndonesianIdea(combined);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition warning:", e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          stopListening();
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          if (sessionFinalTextRef.current) {
            const base = baseIdeaRef.current.trim();
            baseIdeaRef.current = base ? `${base} ${sessionFinalTextRef.current}` : sessionFinalTextRef.current;
            sessionFinalTextRef.current = '';
          }
          setTimeout(() => {
            if (isListeningRef.current) {
              createAndStartRecognition();
            }
          }, 150);
        } else {
          setIsListening(false);
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Failed to start speech recognition, retrying:", err);
      setTimeout(() => {
        if (isListeningRef.current) {
          createAndStartRecognition();
        }
      }, 250);
    }
  };

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda belum mendukung input suara langsung. Disarankan menggunakan Google Chrome atau Microsoft Edge.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }

    baseIdeaRef.current = indonesianIdea;
    sessionFinalTextRef.current = '';
    isListeningRef.current = true;
    setIsListening(true);
    setRecordingSeconds(0);

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    createAndStartRecognition();
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    if (sessionFinalTextRef.current) {
      const base = baseIdeaRef.current.trim();
      baseIdeaRef.current = base ? `${base} ${sessionFinalTextRef.current}` : sessionFinalTextRef.current;
      sessionFinalTextRef.current = '';
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const teleprompterRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    speechService.stop();
    setIsPlayingAudio(false);

    if (aiMode === 'paper') {
      const paperSpeech = getPaperBasedSpeech({
        pillarId: selectedPaperPillar,
        mode: selectedMode.id,
        durationSeconds: selectedMode.duration
      });
      setSpeechData({
        ...paperSpeech,
        sourceMode: 'paper'
      });
      setTimeout(() => {
        if (typeof teleprompterRef.current?.scrollIntoView === 'function') {
          teleprompterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    const ideaToUse = indonesianIdea.trim() || QUICK_TOPICS[0].prompt;
    if (!indonesianIdea.trim()) {
      setIndonesianIdea(QUICK_TOPICS[0].prompt);
    }
    
    setIsLoading(true);

    try {
      const result = await generateDiplomaticSpeech({
        indonesianIdea: ideaToUse,
        mode: selectedMode.id,
        durationSeconds: selectedMode.duration,
        subtopic,
        model: settings.selectedModel,
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl,
        aiMode: 'online',
        paperPillarId: selectedPaperPillar
      });
      setSpeechData({
        ...result,
        sourceMode: 'online'
      });
    } catch (e) {
      console.error(e);
      setSpeechData(getOfflineFallbackSpeech({ mode: selectedMode.id, durationSeconds: selectedMode.duration }));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (typeof teleprompterRef.current?.scrollIntoView === 'function') {
          teleprompterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      if (!speechData?.english) return;
      speechService.speak(speechData.english, {
        rate: settings.speechRate || 0.95,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-600" />
              Live Speech Teleprompter (Virtual Co-Delegate)
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              3-Lapis Fonetik
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Ketik atau <strong>bicara lewat mic dalam Bahasa Indonesia</strong>. Asisten mengubahnya menjadi naskah diplomasi PBB resmi lengkap dengan <strong>panduan cara baca fonetik</strong> dan pelafalan audio.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPodiumFocus(!isPodiumFocus)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              isPodiumFocus
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
            }`}
            title={isPodiumFocus ? "Tampilkan kembali form input ide" : "Mode fokus penuh tanpa distraksi untuk membaca di podium"}
          >
            {isPodiumFocus ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Tampilkan Form Input</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Mode Fokus Podium 🎙️</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Waktu: <strong className="text-slate-900">{selectedMode.duration}s</strong></span>
          </div>
        </div>
      </div>

      <div className={isPodiumFocus ? "w-full max-w-4xl mx-auto space-y-4" : "grid grid-cols-1 lg:grid-cols-12 gap-6"}>
        {/* Left Column: Input Form (5 cols) */}
        {!isPodiumFocus && (
          <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            {/* AI Mode Selector Toggle */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    Mode AI Pidato
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {aiMode === 'online' ? 'Online AI: Dari ide bebas Anda via Cloud' : 'Base on Paper: Terkunci 100% pada Position Paper Kenya (0% Halusinasi)'}
                  </span>
                </div>
                <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 border border-slate-300 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAiMode('online')}
                    className={`px-3 py-1 rounded-md transition ${
                      aiMode === 'online'
                        ? 'bg-emerald-700 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Online AI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAiMode('paper');
                      const speech = getPaperBasedSpeech({
                        pillarId: selectedPaperPillar,
                        mode: selectedMode.id,
                        durationSeconds: selectedMode.duration
                      });
                      setSpeechData({ ...speech, sourceMode: 'paper' });
                    }}
                    className={`px-3 py-1 rounded-md transition ${
                      aiMode === 'paper'
                        ? 'bg-amber-700 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Base on Paper
                  </button>
                </div>
              </div>

              {aiMode === 'paper' && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                    Pilih Pilar Aksi Position Paper (HARAMBEE-WAYS):
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.values(PAPER_PILLARS).map((pillar) => (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => {
                          setSelectedPaperPillar(pillar.id);
                          const speech = getPaperBasedSpeech({
                            pillarId: pillar.id,
                            mode: selectedMode.id,
                            durationSeconds: selectedMode.duration
                          });
                          setSpeechData({ ...speech, sourceMode: 'paper' });
                        }}
                        className={`px-3 py-2 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                          selectedPaperPillar === pillar.id
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50/50'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{pillar.shortLabel}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{pillar.name}</div>
                        </div>
                        {selectedPaperPillar === pillar.id && (
                          <span className="text-amber-800 text-[10px] font-black uppercase bg-amber-200/80 px-1.5 py-0.5 rounded">
                            Aktif
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Naskah bersumber 100% dari Position Paper resmi Kenya (SDC 1.0) dengan data UNODC 2024, UNESCO 2024, dan Children Act 2022. Bebas halusinasi dan dapat dipakai offline.
                  </p>
                </div>
              )}
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Pilih Format & Durasi Pidato
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SPEECH_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setSelectedMode(mode);
                      if (aiMode === 'paper') {
                        const paperSpeech = getPaperBasedSpeech({
                          pillarId: selectedPaperPillar,
                          mode: mode.id,
                          durationSeconds: mode.duration
                        });
                        setSpeechData({ ...paperSpeech, sourceMode: 'paper' });
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                      selectedMode.id === mode.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{mode.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {aiMode === 'online' && (
              <>
                {/* Subtopic input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    2. Sub-Isu / Topik Debat
                  </label>
                  <input
                    type="text"
                    value={subtopic}
                    onChange={(e) => setSubtopic(e.target.value)}
                    placeholder="Contoh: Akses Sekolah Tanpa Akta, Pemulihan Trauma..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>

                {/* Quick Topic Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Inspirasi Poin Cepat (Klik untuk Pasang)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TOPICS.map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndonesianIdea(topic.prompt)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition text-left"
                      >
                        💡 {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Indonesian input textarea with Voice Recognition Mic */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      3. Ide / Pesan Anda (Bahasa Indonesia)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 border border-slate-300 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setMicLang('id-ID')}
                          disabled={isListening}
                          className={`px-2 py-0.5 rounded-md transition ${
                            micLang === 'id-ID'
                              ? 'bg-emerald-700 text-white shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Bahasa Suara: Bahasa Indonesia"
                        >
                          ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setMicLang('en-US')}
                          disabled={isListening}
                          className={`px-2 py-0.5 rounded-md transition ${
                            micLang === 'en-US'
                              ? 'bg-blue-700 text-white shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Bahasa Suara: English"
                        >
                          EN
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                          isListening
                            ? 'bg-rose-600 text-white border border-rose-700 animate-pulse shadow-sm'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                        }`}
                        title={isListening ? "Klik untuk menghentikan rekaman" : "Klik untuk bicara via mic (rekam tanpa batas waktu)"}
                      >
                        {isListening ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <MicOff className="w-3.5 h-3.5 text-white" />
                            <span>
                              Merekam {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60) < 10 ? '0' : ''}{recordingSeconds % 60} (Selesai)
                            </span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Bicara via Mic (Bisa Lama)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={indonesianIdea}
                    onChange={(e) => {
                      setIndonesianIdea(e.target.value);
                      baseIdeaRef.current = e.target.value;
                      sessionFinalTextRef.current = '';
                    }}
                    placeholder={
                      micLang === 'id-ID'
                        ? "Tulis atau klik 'Bicara via Mic' untuk ngomong langsung dalam Bahasa Indonesia... (Contoh: Saya mau usul bantuan dana negara maju untuk bangun shelter di perbatasan)"
                        : "Type or click 'Bicara via Mic' to speak directly in English... (Example: Kenya calls for debt-for-education swaps to finance border shelters)"
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition resize-none"
                  />
                </div>
              </>
            )}

            {/* Action button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 ${
                aiMode === 'paper'
                  ? 'bg-amber-800 hover:bg-amber-900 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>Meracik Pidato Diplomasi ({settings.selectedModel})...</span>
                </>
              ) : aiMode === 'paper' ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Terapkan Naskah Position Paper ({selectedMode.duration}s)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Susun Pidato Diplomasi Kenya</span>
                </>
              )}
            </button>

            {/* Visual Cue */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
              <span className="text-emerald-600 font-bold">👉 Hasil Naskah Pidato</span>
              <span>muncul di kolom papan baca teleprompter (sebelah kanan / bawah)</span>
            </div>
          </div>
        </div>
        )}

        {/* Right Column: Teleprompter Output */}
        <div ref={teleprompterRef} className={isPodiumFocus ? "w-full space-y-4 scroll-mt-24" : "lg:col-span-7 space-y-4 scroll-mt-24"}>
          {/* Top Bar with Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Countdown timer */}
            <CountdownTimer initialSeconds={selectedMode.duration} />

            {/* Speech Stats & Audio Control */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between h-full shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Estimasi Baca</span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {speechData.wordCount || 0} kata (~{speechData.estimatedSeconds || 0}s)
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleToggleAudio}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isPlayingAudio
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-600" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Dengar Lafal Audio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopy(speechData.english)}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 transition"
                  title="Salin Naskah Inggris"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Teleprompter Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[420px]">
            {/* Source Mode Badge Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100/90 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600">Sumber Pidato:</span>
                {speechData.sourceMode === 'paper' || aiMode === 'paper' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <span>📄 Base on Position Paper (HARAMBEE-WAYS)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <span>🌐 Online AI: {speechData.modelUsed || settings.selectedModel}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {speechData.sourceMode === 'paper' || aiMode === 'paper'
                  ? 'Kutipan resmi paper Kenya (Bebas Halusinasi)'
                  : 'Diproduksi dinamis via Cloud LLM'}
              </span>
            </div>

            {/* View tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('english')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'english'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Naskah Inggris</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('caraBaca')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'caraBaca'
                    ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-amber-700" />
                <span>Cara Baca (Fonetik)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('indoMeaning')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'indoMeaning'
                    ? 'bg-blue-100 text-blue-900 shadow-sm border border-blue-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                <span>Makna Indonesia</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilkan semua 3 lapis sekaligus"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3-Lapis</span>
              </button>
            </div>

            {/* Teleprompter Content Area */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {speechData.isFallback && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Menampilkan naskah diplomasi resmi standar Kenya (Mode Siaga Offline).</span>
                </div>
              )}

              {/* Single tab: English */}
              {activeTab === 'english' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                    <span className="font-bold text-emerald-800 uppercase tracking-wide">OFFICIAL PARLIAMENTARY ENGLISH</span>
                    <span>Format: PUMUN UNICEF</span>
                  </div>
                  <div className="font-editorial text-lg sm:text-xl text-slate-900 leading-relaxed whitespace-pre-line tracking-wide">
                    {speechData.english}
                  </div>
                </div>
              )}

              {/* Single tab: Cara Baca */}
              {activeTab === 'caraBaca' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-amber-800 border-b border-amber-100 pb-2">
                    <span className="font-bold uppercase tracking-wide">Panduan Lafal Bahasa Indonesia (Baca Saja Ini di Podium!)</span>
                    <span>Suku kata ejaan santai</span>
                  </div>
                  <div className={`font-sans font-semibold tracking-wide text-slate-900 leading-loose whitespace-pre-line bg-amber-50/70 p-5 sm:p-6 rounded-xl border border-amber-200 ${
                    isPodiumFocus ? 'text-xl sm:text-3xl' : 'text-base sm:text-xl'
                  }`}>
                    {speechData.caraBaca}
                  </div>
                </div>
              )}

              {/* Single tab: Makna Indonesia */}
              {activeTab === 'indoMeaning' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-blue-800 border-b border-blue-100 pb-2">
                    <span className="font-bold uppercase tracking-wide">Makna & Terjemahan Strategis</span>
                    <span>Pahami poin diplomasi Anda</span>
                  </div>
                  <div className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line bg-blue-50/50 p-5 rounded-xl border border-blue-200">
                    {speechData.indoMeaning}
                  </div>
                </div>
              )}

              {/* Stacked 3-Lapis View */}
              {activeTab === 'all' && (
                <div className="space-y-6">
                  {/* Layer 1 */}
                  <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30 space-y-2">
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> 1. Naskah Resmi Bahasa Inggris
                    </div>
                    <div className="font-editorial text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-line">
                      {speechData.english}
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40 space-y-2">
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" /> 2. Panduan Cara Baca (Lafal Fonetik)
                    </div>
                    <div className="text-sm sm:text-base font-sans font-semibold tracking-wide text-slate-900 leading-loose whitespace-pre-line">
                      {speechData.caraBaca}
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-2">
                    <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> 3. Makna & Terjemahan Indonesia
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {speechData.indoMeaning}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Yielding Reminder */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 px-6 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Selesai bicara sebelum waktu habis? Tutup dengan: <em className="font-semibold text-slate-800">"Kenya yields its time to the Dais."</em>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Model: {speechData.modelUsed || settings.selectedModel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
