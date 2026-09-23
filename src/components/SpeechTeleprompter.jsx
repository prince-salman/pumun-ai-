import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  BookOpen, 
  Mic, 
  Clock, 
  Layers, 
  AlertCircle,
  HelpCircle,
  RotateCw
} from 'lucide-react';
import { generateDiplomaticSpeech, getOfflineFallbackSpeech } from '../services/aiService';
import { speechService } from '../services/speechSynthesis';
import CountdownTimer from './CountdownTimer';

const SPEECH_MODES = [
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

export default function SpeechTeleprompter({ settings }) {
  const [selectedMode, setSelectedMode] = useState(SPEECH_MODES[0]);
  const [indonesianIdea, setIndonesianIdea] = useState('');
  const [subtopic, setSubtopic] = useState('Pendidikan & Reintegrasi Korban');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('english'); // 'english' | 'caraBaca' | 'indoMeaning' | 'all'
  const [speechData, setSpeechData] = useState(() => getOfflineFallbackSpeech({ mode: 'GSL', durationSeconds: 90 }));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!indonesianIdea.trim()) {
      setIndonesianIdea(QUICK_TOPICS[0].prompt);
    }
    
    setIsLoading(true);
    speechService.stop();
    setIsPlayingAudio(false);

    try {
      const result = await generateDiplomaticSpeech({
        indonesianIdea: indonesianIdea || QUICK_TOPICS[0].prompt,
        mode: selectedMode.id,
        durationSeconds: selectedMode.duration,
        subtopic,
        model: settings.selectedModel,
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl
      });
      setSpeechData(result);
    } catch (e) {
      console.error(e);
      setSpeechData(getOfflineFallbackSpeech({ mode: selectedMode.id, durationSeconds: selectedMode.duration }));
    } finally {
      setIsLoading(false);
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-400" />
              Live Speech Teleprompter (Virtual Co-Delegate)
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              3-Lapis Fonetik
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Ketik ide Anda dalam Bahasa Indonesia sehari-hari. Asisten mengubahnya menjadi naskah diplomasi PBB resmi lengkap dengan <strong>panduan cara baca (ejaan fonetik)</strong> dan audio.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Waktu Bicara: <strong>{selectedMode.duration} detik</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1. Pilih Format & Durasi Pidato
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SPEECH_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                      selectedMode.id === mode.id
                        ? 'bg-emerald-600/15 border-emerald-500 text-emerald-300 font-semibold shadow-inner'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{mode.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtopic input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                2. Sub-Isu / Topik Debat
              </label>
              <input
                type="text"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="Contoh: Akses Sekolah Tanpa Akta, Pemulihan Trauma..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Quick Topic Chips */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Inspirasi Poin Cepat (Klik untuk Pasang)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TOPICS.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndonesianIdea(topic.prompt)}
                    className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 transition text-left"
                  >
                    💡 {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Indonesian input textarea */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>3. Ide / Pesan Anda (Bahasa Indonesia)</span>
                <span className="text-[11px] text-emerald-400">Bebas ketik apa saja</span>
              </label>
              <textarea
                rows={4}
                value={indonesianIdea}
                onChange={(e) => setIndonesianIdea(e.target.value)}
                placeholder="Tulis ide, poin, atau pesan Anda dalam Bahasa Indonesia di sini... (Contoh: Saya mau usul bantuan dana negara maju untuk bangun shelter di perbatasan)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Meracik Pidato Diplomasi ({settings.selectedModel})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Susun Pidato Diplomasi Kenya</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Teleprompter Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Bar with Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Countdown timer */}
            <CountdownTimer initialSeconds={selectedMode.duration} />

            {/* Speech Stats & Audio Control */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between h-full shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Estimasi Baca</span>
                <span className="text-xs font-mono text-emerald-400">
                  {speechData.wordCount || 0} kata (~{speechData.estimatedSeconds || 0}s)
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleToggleAudio}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                    isPlayingAudio
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4 text-red-400" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Dengar Lafal Audio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopy(speechData.english)}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition"
                  title="Salin Naskah Inggris"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Teleprompter Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[420px]">
            {/* View tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('english')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'english'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Naskah Inggris</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('caraBaca')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'caraBaca'
                    ? 'bg-amber-500/15 text-amber-300 shadow-sm border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Cara Baca (Fonetik)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('indoMeaning')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'indoMeaning'
                    ? 'bg-blue-500/15 text-blue-300 shadow-sm border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Makna Indonesia</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
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
                <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Menampilkan naskah diplomasi resmi standar Kenya (Mode Siaga Offline).</span>
                </div>
              )}

              {/* Single tab: English */}
              {activeTab === 'english' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold text-emerald-400">OFFICIAL PARLIAMENTARY ENGLISH</span>
                    <span>Format: PUMUN UNICEF</span>
                  </div>
                  <div className="font-editorial text-lg sm:text-xl text-slate-100 leading-relaxed whitespace-pre-line tracking-wide">
                    {speechData.english}
                  </div>
                </div>
              )}

              {/* Single tab: Cara Baca */}
              {activeTab === 'caraBaca' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-amber-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold uppercase">Panduan Lafal Bahasa Indonesia (Baca Saja Ini di Podium!)</span>
                    <span>Suku kata ejaan santai</span>
                  </div>
                  <div className="font-sans text-base sm:text-lg text-amber-200/90 leading-loose whitespace-pre-line font-medium bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">
                    {speechData.caraBaca}
                  </div>
                </div>
              )}

              {/* Single tab: Makna Indonesia */}
              {activeTab === 'indoMeaning' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-blue-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold uppercase">Makna & Terjemahan Strategis</span>
                    <span>Pahami poin diplomasi Anda</span>
                  </div>
                  <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line bg-blue-950/20 p-4 rounded-xl border border-blue-500/20">
                    {speechData.indoMeaning}
                  </div>
                </div>
              )}

              {/* Stacked 3-Lapis View */}
              {activeTab === 'all' && (
                <div className="space-y-6">
                  {/* Layer 1 */}
                  <div className="border border-emerald-500/30 rounded-xl p-4 bg-emerald-950/10 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> 1. Naskah Resmi Bahasa Inggris
                    </div>
                    <div className="font-editorial text-base sm:text-lg text-slate-100 leading-relaxed whitespace-pre-line">
                      {speechData.english}
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="border border-amber-500/30 rounded-xl p-4 bg-amber-950/15 space-y-2">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" /> 2. Panduan Cara Baca (Lafal Fonetik)
                    </div>
                    <div className="text-sm sm:text-base text-amber-200/90 leading-loose whitespace-pre-line font-medium">
                      {speechData.caraBaca}
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="border border-blue-500/30 rounded-xl p-4 bg-blue-950/15 space-y-2">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> 3. Makna & Terjemahan Indonesia
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {speechData.indoMeaning}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Yielding Reminder */}
            <div className="bg-slate-950/90 border-t border-slate-800 p-3 px-6 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Selesai bicara sebelum waktu habis? Tutup dengan: <em>"Kenya yields its time to the Dais."</em>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Model: {speechData.modelUsed || settings.selectedModel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
