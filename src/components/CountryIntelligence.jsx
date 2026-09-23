import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Send, 
  Users, 
  ShieldCheck, 
  Compass, 
  ExternalLink, 
  Sparkles,
  HelpCircle,
  Flag
} from 'lucide-react';
import { countriesDossier } from '../data/countriesDossier';
import NotePasserModal from './NotePasserModal';

const BLOCS = ['Semua Blok', 'Western Donors', 'African Union', 'ASEAN & Asia', 'P5 Powers', 'Intermediate Peers'];

export default function CountryIntelligence({ settings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloc, setSelectedBloc] = useState('Semua Blok');
  const [activeModalCountry, setActiveModalCountry] = useState(null);

  const filteredCountries = countriesDossier.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(q) ||
      c.bloc.toLowerCase().includes(q) ||
      c.delegates.some(d => d.toLowerCase().includes(q)) ||
      c.stance.toLowerCase().includes(q);

    let matchesBloc = true;
    if (selectedBloc === 'Western Donors') {
      matchesBloc = c.bloc.includes('Western') || c.bloc.includes('Nordic') || c.bloc.includes('European') || c.name.includes('Canada') || c.name.includes('United States');
    } else if (selectedBloc === 'African Union') {
      matchesBloc = c.name.includes('Congo') || c.bloc.includes('African');
    } else if (selectedBloc === 'ASEAN & Asia') {
      matchesBloc = c.bloc.includes('ASEAN') || c.bloc.includes('Asia') || c.name.includes('Indonesia') || c.name.includes('Philippines') || c.name.includes('Thailand') || c.name.includes('Malaysia') || c.name.includes('Cambodia');
    } else if (selectedBloc === 'P5 Powers') {
      matchesBloc = c.name.includes('United States') || c.name.includes('China') || c.name.includes('Russian') || c.name.includes('United Kingdom') || c.name.includes('France');
    } else if (selectedBloc === 'Intermediate Peers') {
      matchesBloc = c.difficulty === 'Intermediate';
    }

    return matchesSearch && matchesBloc;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            22 Countries Intelligence Matrix (PUMUN 2026 UNICEF)
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Data intelijen seluruh 22 delegasi lawan di dewan UNICEF. Ketahui posisi politik mereka, siapa kawan sealiansi (DRC/Kongo & Global South), dan siapa negara donor potensial (Swedia, Kanada, Jerman, AS).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-blue-300 shrink-0">
          <Users className="w-4 h-4 text-blue-400" />
          <span>22 Negara Terdaftar</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {BLOCS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBloc(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedBloc === b
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 font-semibold shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama negara atau delegasi..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Grid of Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map((country) => {
          let diffColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
          if (country.difficulty === 'Beginner') {
            diffColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          } else if (country.difficulty === 'Advanced') {
            diffColor = 'bg-red-500/10 text-red-400 border-red-500/20';
          }

          return (
            <div
              key={country.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between transition group"
            >
              <div className="space-y-3">
                {/* Header Flag & Country Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition">
                        {country.name}
                      </h3>
                      <div className="text-[11px] text-slate-400">
                        {country.delegates.join(' & ')}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                    {country.difficulty}
                  </span>
                </div>

                {/* Bloc Tag */}
                <div className="inline-block text-[11px] font-medium text-blue-300 bg-blue-950/40 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                  {country.bloc}
                </div>

                {/* Country Stance */}
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-300">Posisi Kunci:</span>
                  <p className="text-slate-400 leading-relaxed">
                    {country.stance}
                  </p>
                </div>

                {/* Strategic Relation with Kenya */}
                <div className="space-y-1 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="font-semibold text-emerald-400">Taktik untuk Kenya:</span>
                  <p className="text-slate-300 leading-relaxed">
                    {country.relationWithKenya}
                  </p>
                </div>
              </div>

              {/* Bottom Action: Pass Note */}
              <div className="pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveModalCountry(country)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition hover:text-white"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tulis Diplomatic Note</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Passer Modal */}
      {activeModalCountry && (
        <NotePasserModal
          targetCountry={activeModalCountry}
          onClose={() => setActiveModalCountry(null)}
          settings={settings}
        />
      )}
    </div>
  );
}
