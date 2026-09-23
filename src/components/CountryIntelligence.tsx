import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Send, 
  Users 
} from 'lucide-react';
import { countriesDossier } from '../data/countriesDossier';
import NotePasserModal from './NotePasserModal';
import { CountryDossier, SettingsState } from '../types';

interface CountryIntelligenceProps {
  settings: SettingsState;
}

const BLOCS = ['Semua Blok', 'Western Donors', 'African Union', 'ASEAN & Asia', 'P5 Powers', 'Intermediate Peers'] as const;

export default function CountryIntelligence({ settings }: CountryIntelligenceProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBloc, setSelectedBloc] = useState<string>('Semua Blok');
  const [activeModalCountry, setActiveModalCountry] = useState<CountryDossier | null>(null);

  const filteredCountries = countriesDossier.filter((c: CountryDossier) => {
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
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            22 Countries Intelligence Matrix (PUMUN 2026 UNICEF)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Data intelijen seluruh 22 delegasi lawan di dewan UNICEF. Ketahui posisi politik mereka, siapa kawan sealiansi (DRC/Kongo & Global South), dan siapa negara donor potensial (Swedia, Kanada, Jerman, AS).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
          <Users className="w-4 h-4 text-blue-600" />
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedBloc === b
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama negara atau delegasi..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition"
          />
        </div>
      </div>

      {/* Grid of Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map((country) => {
          let diffColor = 'bg-blue-50 text-blue-800 border-blue-200';
          if (country.difficulty === 'Beginner') {
            diffColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          } else if (country.difficulty === 'Advanced') {
            diffColor = 'bg-rose-50 text-rose-800 border-rose-200';
          }

          return (
            <div
              key={country.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition group"
            >
              <div className="space-y-3">
                {/* Header Flag & Country Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                        {country.name}
                      </h3>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {country.delegates.join(' & ')}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                    {country.difficulty}
                  </span>
                </div>

                {/* Bloc Tag */}
                <div className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  {country.bloc}
                </div>

                {/* Country Stance */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700">Posisi Kunci:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {country.stance}
                  </p>
                </div>

                {/* Strategic Relation with Kenya */}
                <div className="space-y-1 text-xs bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900">Taktik untuk Kenya:</span>
                  <p className="text-slate-800 leading-relaxed">
                    {country.relationWithKenya}
                  </p>
                </div>
              </div>

              {/* Bottom Action: Pass Note */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalCountry(country)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
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
