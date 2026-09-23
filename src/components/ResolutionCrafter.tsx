import React, { useState } from 'react';
import { 
  FileCode, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Sparkles 
} from 'lucide-react';
import { unicefMandate } from '../data/unicefMandate';
import { SettingsState } from '../types';

interface ResolutionCrafterProps {
  settings?: SettingsState;
}

interface PreambClause {
  id: string;
  starter: string;
  text: string;
}

interface OperativeClause {
  id: string;
  starter: string;
  title?: string;
  text: string;
}

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

const DEFAULT_PREAMBS: PreambClause[] = [
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

const DEFAULT_OPERATIVES: OperativeClause[] = [
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

export default function ResolutionCrafter({ settings }: ResolutionCrafterProps) {
  const [sponsors, setSponsors] = useState<string>('Republic of Kenya, Democratic republic of the Congo');
  const [signatories, setSignatories] = useState<string>('Republic of Indonesia, Republic of the Philippines, Kingdom of Sweden, Canada');
  const [preambs, setPreambs] = useState<PreambClause[]>(DEFAULT_PREAMBS);
  const [operatives, setOperatives] = useState<OperativeClause[]>(DEFAULT_OPERATIVES);
  
  // Custom generator state
  const [customIdea, setCustomIdea] = useState<string>('');
  const [customType, setCustomType] = useState<'operative' | 'preamb'>('operative');
  const [selectedStarter, setSelectedStarter] = useState<string>('Calls upon');
  const [copied, setCopied] = useState<boolean>(false);

  // Mandate validation check for user's custom input
  const validation = unicefMandate.validateClause(customIdea);

  const handleAddCustomClause = () => {
    if (!customIdea.trim()) return;

    if (customType === 'operative') {
      const newOp: OperativeClause = {
        id: 'o_' + Date.now(),
        starter: selectedStarter,
        title: customIdea.slice(0, 35) + '...',
        text: `${customIdea.replace(/\.$/, '')};`
      };
      setOperatives([...operatives, newOp]);
      setCustomIdea('');
    } else {
      const newPre: PreambClause = {
        id: 'p_' + Date.now(),
        starter: selectedStarter,
        text: `${customIdea.replace(/,$/, '')},`
      };
      setPreambs([...preambs, newPre]);
      setCustomIdea('');
    }
  };

  const handleRemovePreamb = (id: string) => {
    setPreambs(preambs.filter(p => p.id !== id));
  };

  const handleRemoveOperative = (id: string) => {
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
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-600" />
            Draft Resolution & Working Paper Crafter
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Susun klausul resolusi resmi PUMUN UNICEF. Dilengkapi <strong>Guardrail Mandat UNICEF</strong> otomatis untuk mencegah klausul ilegal (seperti penangkapan/pidana) yang dilarang dalam panduan SDC 1.0.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyFull}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Draf Lengkap Tersalin!' : 'Salin Draf Resolusi Lengkap'}</span>
        </button>
      </div>

      {/* Sponsors & Signatories bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
            Sponsors (Pengusung Utama - Termasuk Kenya):
          </label>
          <input
            type="text"
            value={sponsors}
            onChange={(e) => setSponsors(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5">
            Signatories (Negara Pendukung Draf):
          </label>
          <input
            type="text"
            value={signatories}
            onChange={(e) => setSignatories(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Clause Generator Input with Mandate Guardrail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Tambah Klausul Baru (Ketik Ide dalam Bahasa Indonesia)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Tipe Klausul:</label>
            <select
              value={customType}
              onChange={(e) => {
                const t = e.target.value as 'operative' | 'preamb';
                setCustomType(t);
                setSelectedStarter(t === 'operative' ? OPERATIVE_STARTERS[0] : PREAMB_STARTERS[0]);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="operative">Klausul Operatif (Tindakan / Solusi)</option>
              <option value="preamb">Klausul Preambuler (Latar Belakang)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Kata Pembuka Diplomasi:</label>
            <select
              value={selectedStarter}
              onChange={(e) => setSelectedStarter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-serif italic focus:outline-none focus:border-emerald-600"
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
              className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 resize-none transition"
          />
        </div>

        {/* Mandate Warning if invalid */}
        {!validation.isValid && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-rose-900">Peringatan Mandat UNICEF:</div>
              {validation.violations.map((v, i) => (
                <div key={i}>• {v}</div>
              ))}
              <div className="text-[11px] text-slate-600 pt-1">
                Sesuai panduan PUMUN SDC: UNICEF berwenang memberi bantuan pendidikan dan rehabilitasi, tapi <strong>tidak boleh</strong> menuntut/menangkap pelaku atau memaksakan hukum pidana.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preambulatory Clauses List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Preambulatory Clauses (Latar Belakang & Prinsip)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono font-medium">{preambs.length} klausul</span>
        </div>

        <div className="space-y-2.5">
          {preambs.map((p) => (
            <div
              key={p.id}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs leading-relaxed group hover:border-slate-300 transition"
            >
              <div>
                <span className="font-serif italic font-bold text-amber-900 mr-1.5">{p.starter}</span>
                <span className="text-slate-800">{p.text}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePreamb(p.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                title="Hapus klausul"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Operative Clauses List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Operative Clauses (Solusi Nyata & Rekomendasi Tindakan)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono font-medium">{operatives.length} klausul</span>
        </div>

        <div className="space-y-3">
          {operatives.map((o, index) => (
            <div
              key={o.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs leading-relaxed group hover:border-emerald-300 transition"
            >
              <div className="space-y-1">
                {o.title && (
                  <div className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">
                    {o.title}
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-500 mr-2">{index + 1}.</span>
                  <span className="font-serif italic font-bold text-slate-900 mr-1.5">{o.starter}</span>
                  <span className="text-slate-800">{o.text}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveOperative(o.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition shrink-0"
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
