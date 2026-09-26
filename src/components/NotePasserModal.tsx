import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, MessageSquare, Volume2, RotateCw } from 'lucide-react';
import { speechService } from '../services/speechSynthesis';
import { CountryDossier, SettingsState } from '../types';

interface NotePasserModalProps {
  targetCountry: CountryDossier;
  onClose: () => void;
  settings: SettingsState;
}

export default function NotePasserModal({ targetCountry, onClose, settings }: NotePasserModalProps) {
  const [noteGoal, setNoteGoal] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedNote, setGeneratedNote] = useState<{
    english: string;
    caraBaca: string;
    indoMeaning: string;
  }>({
    english: `To the Esteemed Delegation of ${targetCountry.name},\n\nThe Delegation of Kenya presents its compliments. Recognizing our shared commitment to rehabilitating child survivors, Kenya warmly invites your distinguished delegation to co-sponsor our Working Paper focusing on barrier-free school re-enrollment and regional support. Could we discuss this during the upcoming unmoderated caucus?\n\nWarm regards,\nDelegation of Kenya`,
    caraBaca: `Tu di Estimd Deleigesyen of ${targetCountry.name},\n\nDi Deleigesyen of Kenya prezents its kompliments. Rekognaising aur syerd komitmen tu rihabiliteiting caild servaivors, Kenya wormli invaits yor distingsy-d deleigesyen tu ko-sponsor aur Werking Peiper fokasing on beriyer-fri skul ri-enrolment end rijyonal saport. Kud wi diskas dis dyuring di apgaming anmodereited kokus?\n\nWorm rigards,\nDeleigesyen of Kenya`,
    indoMeaning: `Kepada Delegasi Terhormat ${targetCountry.name},\n\nDelegasi Kenya menyampaikan salam hormat. Menyadari komitmen bersama kita dalam merehabilitasi anak-anak korban, Kenya dengan hangat mengundang delegasi Anda untuk menjadi co-sponsor Working Paper kami yang berfokus pada pendaftaran kembali sekolah tanpa hambatan dan dukungan regional. Bisakah kita mendiskusikan hal ini pada kaukus bebas berikutnya?\n\nSalam hangat,\nDelegasi Kenya`
  });
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!noteGoal.trim()) return;
    setIsGenerating(true);

    try {
      const prompt = `Write a short, highly professional Diplomatic Note (note-passing during MUN session) from the Republic of Kenya to the Delegation of ${targetCountry.name}.
Target Country Stance: ${targetCountry.stance}
Purpose of Note: ${noteGoal}
Author: Delegation of Kenya (Muhamad Salman & Jamael Nadeem Omero Setianegara).

Provide in strict 3-part format:
### 1. English Note
### 2. Cara Baca
### 3. Makna Indonesia`;

      const response = await fetch(`${settings.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.selectedModel || 'nemotron-3-ultra',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '';
        
        const engMatch = content.match(/###\s*1\.\s*English[^\n]*\n([\s\S]*?)(?=###\s*2\.\s*Cara Baca|$)/i);
        const caraMatch = content.match(/###\s*2\.\s*Cara Baca[^\n]*\n([\s\S]*?)(?=###\s*3\.\s*Makna|$)/i);
        const indoMatch = content.match(/###\s*3\.\s*Makna[^\n]*\n([\s\S]*?)$/i);

        if (engMatch && engMatch[1]) {
          setGeneratedNote({
            english: engMatch[1].trim(),
            caraBaca: caraMatch ? caraMatch[1].trim() : '',
            indoMeaning: indoMatch ? indoMatch[1].trim() : ''
          });
        }
      }
    } catch (e) {
      console.warn('Note generation failed, keeping pre-filled note:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNote.english);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    speechService.speak(generatedNote.english, { rate: settings.speechRate || 0.95 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-50 p-4 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{targetCountry.flag}</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>Diplomatic Note Drafter</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                  Penerima: {targetCountry.name}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Delegasi: {targetCountry.delegates.join(', ')} • {targetCountry.bloc}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Prompt input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Tujuan Pesan Diplomatik (Bahasa Indonesia):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteGoal}
                onChange={(e) => setNoteGoal(e.target.value)}
                placeholder="Contoh: Ajak co-sponsor resolusi kita, tanyakan pandangan mereka soal dana..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !noteGoal.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0 shadow-sm"
              >
                {isGenerating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Buat Note</span>
              </button>
            </div>
          </div>

          {/* Generated Note Cards */}
          <div className="space-y-3">
            {/* English Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-1.5">
                <span className="font-bold text-emerald-800 uppercase tracking-wider">Naskah Catatan Resmi (Bahasa Inggris)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    className="p-1 rounded bg-white border border-slate-200 hover:text-emerald-700 text-slate-600 transition shadow-sm"
                    title="Dengar Lafal"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1 px-2 rounded bg-white border border-slate-200 hover:text-emerald-700 text-slate-600 transition flex items-center gap-1 shadow-sm font-medium"
                    title="Salin Naskah"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
              <div className="font-editorial text-sm text-slate-900 leading-relaxed whitespace-pre-line">
                {generatedNote.english}
              </div>
            </div>

            {/* Cara Baca */}
            {generatedNote.caraBaca && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-slate-900 leading-relaxed space-y-1">
                <div className="font-bold text-[10px] text-amber-800 uppercase tracking-wider">
                  Cara Baca Fonetik (Jika Ingin Bicara Langsung):
                </div>
                <div className="whitespace-pre-line font-mono text-[11px]">
                  {generatedNote.caraBaca}
                </div>
              </div>
            )}

            {/* Makna Indonesia */}
            {generatedNote.indoMeaning && (
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed space-y-1">
                <div className="font-bold text-[10px] text-blue-800 uppercase tracking-wider">
                  Terjemahan / Makna:
                </div>
                <div className="whitespace-pre-line">
                  {generatedNote.indoMeaning}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tips: Anda bisa menyalin teks ini untuk ditulis di carik kertas note-passing sidang.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
