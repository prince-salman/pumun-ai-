import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Square, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Bot, 
  User, 
  MessageSquare,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ChatMessage, SettingsState } from '../types';
import { chatWithCoDelegate, getOfflineCoDelegateFallback } from '../services/aiService';
import { speechService } from '../services/speechSynthesis';

interface CoDelegateChatProps {
  settings: SettingsState;
  onNavigate: (tabId: string) => void;
}

const STORAGE_KEY = 'kenya_co_delegate_chat_v1';

function cleanDisplayText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[`~]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim();
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'nata',
    timestamp: '09:00',
    text: `Halo Salman. Aku Nata, virtual co-delegate kamu untuk mewakili Republik Kenya di UNICEF PUMUN 2026.

Jangan khawatir atau grogi. Walaupun kamu solo delegate, aku di sini mendampingi kamu sepenuhnya.

Kamu tidak perlu pusing memikirkan mau buka menu apa atau bingung cara pakainya. Cukup ceritakan apa yang terjadi di ruangan sidang atau tanya apa saja dengan bahasa santai sehari-hari.

Aku yang akan:
1. Menyiapkan naskah pidato instan dengan Cara Baca Fonetik ejaan Indonesia (tidak akan salah lafal).
2. Menjelaskan apa maksud omongan delegasi lain dan cara meresponnya.
3. Memberikan panduan langkah demi langkah saat giliran kamu bicara.

Ketik pertanyaan kamu di bawah atau pilih salah satu bantuan cepat berikut:`
  }
];

const QUICK_PROMPTS_ONLINE = [
  { 
    label: 'Dipanggil di Roll Call', 
    prompt: 'Nama Republic of Kenya baru saja dipanggil saat Roll Call oleh Chair, aku harus jawab apa dan angkat apa?' 
  },
  { 
    label: 'Bikin pidato 60 detik (Sekolah)', 
    prompt: 'Bikinkan pidato podium 60 detik tentang hak sekolah anak korban eksploitasi di Kenya tanpa syarat akta lahir.' 
  },
  { 
    label: 'Lawan pidato, respon gimana', 
    prompt: 'Ada negara yang lagi bicara dan mengkritik atau mempertanyakan dana rehabilitasi anak di perbatasan Kenya, apa yang harus aku lakukan?' 
  },
  { 
    label: 'Izin ke toilet / Interupsi', 
    prompt: 'Aku mau izin ke toilet atau mengajukan interupsi saat sidang berlangsung, gimana caranya?' 
  },
  { 
    label: 'Cara ajak negara koalisi', 
    prompt: 'Gimana cara ngajak negara seperti Swedia atau Kanada untuk co-sponsor draft resolusi bareng Kenya?' 
  },
  { 
    label: 'Arti Point of Privilege', 
    prompt: 'Jelaskan perbedaan Point of Order dan Point of Personal Privilege secara singkat dan kapan aku pakai.' 
  }
];

const QUICK_PROMPTS_PAPER = [
  {
    label: 'Aksi 1: RE-FIN (Dana Swaps)',
    prompt: 'Bagaimana solusi Aksi 1 RE-FIN Compact di Position Paper kita dalam mengatasi masalah dana shelter perbatasan?'
  },
  {
    label: 'Aksi 2: LOC-ID (Akta 72 Jam)',
    prompt: 'Jelaskan Aksi 2 LOC-ID Fast-Track tentang hak sekolah tanpa akta lahir sesuai Children Act 2022.'
  },
  {
    label: 'Aksi 3: TEACH-SHIELD (Guru)',
    prompt: 'Bagaimana Aksi 3 TEACH-SHIELD melatih 5.000 guru dalam penanganan trauma anak di sekolah perbatasan?'
  },
  {
    label: 'Aksi 4: In-Tech (Radio & EAC)',
    prompt: 'Jelaskan Aksi 4 In-Tech Pathway tentang radio bertenaga surya dan pelacakan siswa lintas batas bersama Uganda dan Tanzania.'
  },
  {
    label: 'Data Statistik PBB < 5 Thn',
    prompt: 'Sebutkan data statistik resmi UNODC 2024 dan UNESCO 2024 dari Position Paper kita yang bisa aku ucapkan.'
  },
  {
    label: 'Pidato 60s Paper (Siap Baca)',
    prompt: 'Bikinkan naskah pidato 60 detik resmi yang 100% dari Position Paper HARAMBEE-WAYS Kenya.'
  }
];

export default function CoDelegateChat({ settings, onNavigate }: CoDelegateChatProps) {
  const [aiMode, setAiMode] = useState<'online' | 'paper'>(settings.aiMode || 'online');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load chat history from localStorage', e);
    }
    return DEFAULT_MESSAGES;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechTabState, setSpeechTabState] = useState<Record<string, 'caraBaca' | 'english' | 'makna'>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 60);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, [messages]);

  // Voice speech-to-text setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningMic(false);
      };

      recognition.onerror = () => setIsListeningMic(false);
      recognition.onend = () => setIsListeningMic(false);
      setRecognitionInstance(recognition);
    }
  }, []);

  const handleToggleMic = () => {
    if (!recognitionInstance) {
      alert('Browser kamu belum mendukung Speech Recognition. Silakan ketik pertanyaan di kotak chat ya!');
      return;
    }
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

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: timeStr
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const apiHistory = newHistory.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text
      }));

      const res = await chatWithCoDelegate({
        history: apiHistory,
        userMessage: textToSend,
        model: settings.selectedModel,
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl,
        aiMode
      });

      const nataReply: ChatMessage = {
        id: `nata-${Date.now()}`,
        sender: 'nata',
        text: res.reply,
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        speechCard: res.speechCard,
        shortcut: res.shortcut
      };

      setMessages((prev) => [...prev, nataReply]);
    } catch (err) {
      console.warn('Error chatting with Co-Delegate, fallback used:', err);
      const fallback = getOfflineCoDelegateFallback(textToSend);
      const fallbackReply: ChatMessage = {
        id: `nata-${Date.now()}`,
        sender: 'nata',
        text: fallback.reply,
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        speechCard: fallback.speechCard,
        shortcut: fallback.shortcut
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Hapus seluruh riwayat chat dengan Nata dan mulai obrolan baru?')) {
      speechService.stop();
      setPlayingAudioId(null);
      setMessages(DEFAULT_MESSAGES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handlePlayAudio = (messageId: string, englishText: string) => {
    if (playingAudioId === messageId) {
      speechService.stop();
      setPlayingAudioId(null);
    } else {
      speechService.stop();
      setPlayingAudioId(messageId);
      speechService.speak(englishText, {
        rate: settings.speechRate || 0.95,
        onEnd: () => setPlayingAudioId(null)
      });
    }
  };

  const handleCopyText = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const setCardTab = (msgId: string, tab: 'caraBaca' | 'english' | 'makna') => {
    setSpeechTabState((prev) => ({ ...prev, [msgId]: tab }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Nata (Virtual Co-Delegate)</h2>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Partner Salman 🇰🇪
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tanyakan apa saja seputar sidang, pidato, sanggahan, atau aturan MUN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Mode Selector Toggle */}
          <div className="flex items-center rounded-lg bg-slate-200/90 p-0.5 border border-slate-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAiMode('online')}
              className={`px-2.5 py-1 rounded-md transition ${
                aiMode === 'online'
                  ? 'bg-emerald-700 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mode Online AI: Jawaban dinamis dari Cloud LLM"
            >
              Online AI
            </button>
            <button
              type="button"
              onClick={() => setAiMode('paper')}
              className={`px-2.5 py-1 rounded-md transition ${
                aiMode === 'paper'
                  ? 'bg-amber-700 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mode Base on Paper: Terkunci 100% pada Position Paper resmi Kenya (0% Halusinasi)"
            >
              Base on Paper
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Mulai obrolan baru"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Mode Status Banner */}
      <div className={`px-5 py-2 text-xs flex items-center justify-between border-b ${
        aiMode === 'paper'
          ? 'bg-amber-50 text-amber-900 border-amber-200'
          : 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
      }`}>
        <div className="flex items-center gap-1.5 font-medium">
          {aiMode === 'paper' ? (
            <>
              <span className="font-bold">📄 Mode Base on Paper:</span>
              <span>Seluruh jawaban Nata dikunci 100% pada Position Paper HARAMBEE-WAYS Kenya & data resmi PBB &lt; 5 thn (Bebas Halusinasi).</span>
            </>
          ) : (
            <>
              <span className="font-bold">🌐 Mode Online AI:</span>
              <span>Nata merespon dinamis menggunakan model {settings.selectedModel} via Cloud AI.</span>
            </>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 hidden sm:inline">
          {aiMode === 'paper' ? '100% Fakta Paper' : 'Cloud LLM'}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const activeCardTab = speechTabState[msg.id] || 'caraBaca';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Sender badge & timestamp */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                  <span>{isUser ? 'Salman' : 'Nata'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Bubble Text */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {cleanDisplayText(msg.text)}
                </div>

                {/* Embedded Speech Card if available */}
                {msg.speechCard && (
                  <div className="mt-3 w-full bg-white border-2 border-emerald-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>NASKAH SIAP BACA UNTUK SALMAN</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayAudio(msg.id, msg.speechCard!.english)}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                            playingAudioId === msg.id
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {playingAudioId === msg.id ? (
                            <>
                              <Square className="w-3.5 h-3.5" />
                              <span>Berhenti</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Dengar Lafal</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.id, msg.speechCard!.caraBaca)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Speech Tab Selector */}
                    <div className="flex border-b border-slate-100 bg-slate-50 text-xs">
                      <button
                        onClick={() => setCardTab(msg.id, 'caraBaca')}
                        className={`flex-1 py-2 px-3 font-bold text-center border-b-2 transition-colors ${
                          activeCardTab === 'caraBaca'
                            ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🟢 Cara Baca (Fonetik Santai)
                      </button>
                      <button
                        onClick={() => setCardTab(msg.id, 'english')}
                        className={`flex-1 py-2 px-3 font-semibold text-center border-b-2 transition-colors ${
                          activeCardTab === 'english'
                            ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🇬🇧 Teks Asli Inggris
                      </button>
                      <button
                        onClick={() => setCardTab(msg.id, 'makna')}
                        className={`flex-1 py-2 px-3 font-semibold text-center border-b-2 transition-colors ${
                          activeCardTab === 'makna'
                            ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🇮🇩 Arti Indonesia
                      </button>
                    </div>

                    {/* Speech Card Content */}
                    <div className="p-4">
                      {activeCardTab === 'caraBaca' && (
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                          <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed font-sans tracking-wide">
                            "{msg.speechCard.caraBaca}"
                          </p>
                          <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                            <span>💡 Tips:</span> Baca suku kata dengan jeda santai, jangan terburu-buru.
                          </div>
                        </div>
                      )}

                      {activeCardTab === 'english' && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
                            "{msg.speechCard.english}"
                          </p>
                        </div>
                      )}

                      {activeCardTab === 'makna' && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {msg.speechCard.indoMeaning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shortcut Navigation Button */}
                {msg.shortcut && (
                  <button
                    onClick={() => onNavigate(msg.shortcut!.tabId)}
                    className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 rounded-xl border border-emerald-300 transition-all hover:scale-[1.02] shadow-xs"
                  >
                    <span>{msg.shortcut.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-bl-xs shadow-xs text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Nata sedang menganalisis situasi & menyusun strategi...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Aksi Cepat:
        </span>
        {(aiMode === 'paper' ? QUICK_PROMPTS_PAPER : QUICK_PROMPTS_ONLINE).map((qp, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(qp.prompt)}
            className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full border transition-colors shadow-2xs disabled:opacity-50 ${
              aiMode === 'paper'
                ? 'bg-white hover:bg-amber-50 border-amber-200 text-amber-900 font-medium'
                : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800'
            }`}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleMic}
          className={`p-2.5 rounded-xl border transition-all ${
            isListeningMic
              ? 'bg-rose-500 border-rose-600 text-white animate-pulse shadow-md'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title={isListeningMic ? 'Matikan Mikrofon' : 'Gunakan Suara (Bicara Bahasa Indonesia)'}
        >
          {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
          placeholder={
            isListeningMic 
              ? 'Mendengarkan suara Salman... Silakan bicara!' 
              : 'Ketik apa saja ke Nata (contoh: "ada lawan nyerang dana perbatasan", "bikin pidato 60s", dll)...'
          }
          className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
        />

        <button
          type="button"
          disabled={!input.trim() || isLoading}
          onClick={() => handleSend()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-sm flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </div>
    </div>
  );
}
