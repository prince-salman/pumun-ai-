import React, { useState } from 'react';
import { 
  FileCode, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  RotateCw,
  BookOpen,
  Volume2
} from 'lucide-react';
import { unicefMandate } from '../data/unicefMandate';
import { speechService } from '../services/speechSynthesis';

const PREAMB_STARTERS = [
  'Affirming',
  'Bearing in mind',
  'Deeply concerned',
  'Emphasizing',
  'Guided by',
  'Noting with satisfaction',
  'Recalling',
  'Recognizing',
  'Reaffirming'
];

const OPERATIVE_STARTERS = [
  'Calls upon',
  'Encourages',
  'Endorses',
  'Expresses its appreciation',
  'Invites',
  'Recommends',
  'Requests',
  'Strongly advises',
  'Urges'
];

const DEFAULT_PREAMBS = [
  {
    id: 'p1',
    starter: 'Guided by',
    text: 'the principles enshrined in the United Nations Convention on the Rights of the Child, particularly Article 28 guaranteeing the right of every child to education without discrimination,'
  },
  {
    id: 'p2',
    starter: 'Deeply concerned',
    text: 'that millions of child survivors of commercial sexual exploitation and transnational trafficking suffer prolonged academic exclusion due to acute psychological trauma and the confiscation or absence of civil documentation,'
  },
  {
    id: 'p3',
    starter: 'Reaffirming',
    text: 'that the mandate of the United Nations Children\'s Fund is fundamentally rooted in humanitarian protection, capacity-building, and international cooperation, while respecting the sovereign domestic legal frameworks of Member States,'
  }
];

const DEFAULT_OPERATIVES = [
  {
    id: 'o1',
    starter: 'Calls upon',
    title: 'SAFE-LEARN Transit Education Pass',
    text: 'all Member States to establish "Transit Education Passes" allowing child trafficking survivors immediate, unconditional enrollment into basic education and accelerated learning programs without pre-requisite civil birth documentation, while initiating expedited retroactive registration procedures;'
  },
  {
    id: 'o2',
    starter: 'Encourages',
    title: 'Trauma-Informed Pedagogy & School Safe Cubicles',
    text: 'UNICEF to allocate specialized technical assistance grants to train primary and secondary school educators in trauma-sensitive psychosocial pedagogy and equip schools in vulnerable transit corridors with confidential counseling sanctuaries;'
  },
  {
    id: 'o3',
    starter: 'Urges',
    title: 'EAC Regional Cross-Border Child Protection Taskforce',
    text: 'regional economic communities, including the East African Community, to strengthen collaborative child-tracing protocols and safe repatriation mechanisms, ensuring continuous cross-border academic credit recognition;'
  },
  {
    id: 'o4',
    starter: 'Requests',
    title: 'Multilateral Matching Grant Fund',
    text: 'international donor partners to establish an unconditional matching grant facility under UNICEF\'s Global Education Thematic Fund to support community-based rehabilitation shelters and vocational training centers in developing Member States.'
  }
];

export default function ResolutionCrafter({ settings }) {
  const [sponsors, setSponsors] = useState('Republic of Kenya, Democratic republic of the Congo');
  const [signatories, setSignatories] = useState('Republic of Indonesia, Republic of the Philippines, Kingdom of Sweden, Canada');
  const [preambs, setPreambs] = useState(DEFAULT_PREAMBS);
  const [operatives, setOperatives] = useState(DEFAULT_OPERATIVES);
  
  // Custom generator state
  const [customIdea, setCustomIdea] = useState('');
  const [customType, setCustomType] = useState('operative'); // 'preamb' | 'operative'
  const [selectedStarter, setSelectedStarter] = useState('Calls upon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mandate validation check for user's custom input
  const validation = unicefMandate.validateClause(customIdea);

  const handleAddCustomClause = async () => {
    if (!customIdea.trim()) return;

    if (customType === 'operative') {
      const newOp = {
        id: 'o_' + Date.now(),
        starter: selectedStarter,
        title: customIdea.slice(0, 35) + '...',
        text: `${customIdea.replace(/\.$/, '')};`
      };
      setOperatives([...operatives, newOp]);
      setCustomIdea('');
    } else {
      const newPre = {
        id: 'p_' + Date.now(),
        starter: selectedStarter,
        text: `${customIdea.replace(/,$/, '')},`
      };
      setPreambs([...preambs, newPre]);
      setCustomIdea('');
    }
  };

  const handleRemovePreamb = (id) => {
    setPreambs(preambs.filter(p => p.id !== id));
  };

  const handleRemoveOperative = (id) => {
    setOperatives(operatives.filter(o => o.id !== id));
  };

  const generateFullDraftText = () => {
    let full = `COMMITTEE: United Nations Children's Fund (UNICEF)\n`;
    full += `TOPIC: Strengthening educational opportunities and long-term prospects for child survivors of sexual exploitation and trafficking\n`;
    full += `SPONSORS: ${sponsors}\n`;
    full += `SIGNATORIES: ${signatories}\n\n`;
    full += `The United Nations Children's Fund,\n\n`;

    preambs.forEach(p => {
      full += `${p.starter} ${p.text}\n\n`;
    });

    operatives.forEach((o, index) => {
      const isLast = index === operatives.length - 1;
      full += `${index + 1}. ${o.starter} ${o.text.replace(/;$/, isLast ? '.' : ';')}\n\n`;
    });

    return full;
  };

  const handleCopyFull = () => {
    navigator.clipboard.writeText(generateFullDraftText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-teal-400" />
            Draft Resolution & Working Paper Crafter
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Susun klausul resolusi resmi PUMUN UNICEF. Dilengkapi <strong>Guardrail Mandat UNICEF</strong> otomatis untuk mencegah klausul ilegal (seperti penangkapan/pidana) yang dilarang dalam panduan SDC 1.0.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyFull}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Draf Lengkap Tersalin!' : 'Salin Draf Resolusi Lengkap'}</span>
        </button>
      </div>

      {/* Sponsors & Signatories bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Sponsors (Pengusung Utama - Termasuk Kenya):
          </label>
          <input
            type="text"
            value={sponsors}
            onChange={(e) => setSponsors(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            Signatories (Negara Pendukung Draf):
          </label>
          <input
            type="text"
            value={signatories}
            onChange={(e) => setSignatories(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Clause Generator Input with Mandate Guardrail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Tambah Klausul Baru (Ketik Ide dalam Bahasa Indonesia)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipe Klausul:</label>
            <select
              value={customType}
              onChange={(e) => {
                const t = e.target.value;
                setCustomType(t);
                setSelectedStarter(t === 'operative' ? OPERATIVE_STARTERS[0] : PREAMB_STARTERS[0]);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="operative">Klausul Operatif (Tindakan / Solusi)</option>
              <option value="preamb">Klausul Preambuler (Latar Belakang)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Kata Pembuka Diplomasi:</label>
            <select
              value={selectedStarter}
              onChange={(e) => setSelectedStarter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-serif italic focus:outline-none focus:border-teal-500"
            >
              {(customType === 'operative' ? OPERATIVE_STARTERS : PREAMB_STARTERS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddCustomClause}
              disabled={!customIdea.trim() || !validation.isValid}
              className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Masukkan ke Resolusi</span>
            </button>
          </div>
        </div>

        <div>
          <textarea
            rows={2}
            value={customIdea}
            onChange={(e) => setCustomIdea(e.target.value)}
            placeholder="Tulis ide klausul baru dalam Bahasa Indonesia... (Contoh: Menyarankan program beasiswa dan konseling anak di daerah perbatasan)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 resize-none transition"
          />
        </div>

        {/* Mandate Warning if invalid */}
        {!validation.isValid && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-400">Peringatan Mandat UNICEF:</div>
              {validation.violations.map((v, i) => (
                <div key={i}>• {v}</div>
              ))}
              <div className="text-[11px] text-slate-400 pt-1">
                Sesuai panduan PUMUN SDC: UNICEF berwenang memberi bantuan pendidikan dan rehabilitasi, tapi <strong>tidak boleh</strong> menuntut/menangkap pelaku atau memaksakan hukum pidana.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preambulatory Clauses List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Preambulatory Clauses (Latar Belakang & Prinsip)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{preambs.length} klausul</span>
        </div>

        <div className="space-y-2.5">
          {preambs.map((p) => (
            <div
              key={p.id}
              className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs leading-relaxed group hover:border-slate-700 transition"
            >
              <div>
                <span className="font-serif italic font-bold text-amber-300 mr-1.5">{p.starter}</span>
                <span className="text-slate-300">{p.text}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePreamb(p.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                title="Hapus klausul"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Operative Clauses List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Operative Clauses (Solusi Nyata & Rekomendasi Tindakan)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{operatives.length} klausul</span>
        </div>

        <div className="space-y-3">
          {operatives.map((o, index) => (
            <div
              key={o.id}
              className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs leading-relaxed group hover:border-teal-500/30 transition"
            >
              <div className="space-y-1">
                {o.title && (
                  <div className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider">
                    {o.title}
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-400 mr-2">{index + 1}.</span>
                  <span className="font-serif italic font-bold text-teal-300 mr-1.5">{o.starter}</span>
                  <span className="text-slate-200">{o.text}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveOperative(o.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition shrink-0"
                title="Hapus klausul"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
