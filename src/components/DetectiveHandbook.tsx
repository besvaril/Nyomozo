import React, { useState } from 'react';
import { KINGDOM_PROFILES, COMPARISON_TABLE_ROWS } from '../data/knowledgeBase';
import { BookOpen, Search, Sparkles, Check, Bug, Flower2, HelpCircle, Layers } from 'lucide-react';

export const DetectiveHandbook: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKingdomTab, setSelectedKingdomTab] = useState<'all' | 'animals' | 'plants' | 'fungi'>('all');

  const filteredRows = COMPARISON_TABLE_ROWS.filter((row) => {
    const q = searchQuery.toLowerCase();
    return (
      row.criterion.toLowerCase().includes(q) ||
      row.animals.toLowerCase().includes(q) ||
      row.plants.toLowerCase().includes(q) ||
      row.fungi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Handbook Top Header */}
      <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Nyomozati Kézikönyv & Összehasonlító Tudástár</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Az Élőlények Három Csoportjának Részletes Összevetése
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Állatok (Animalia) • Virágos növények (Plantae) • Gombák (Fungi) sejttani, anyagcserebeli és szövettani összehasonlító atlasza.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keresés szempont vagy fogalom alapján..."
              className="w-full bg-[#05070a]/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
            />
          </div>
        </div>
      </div>

      {/* 3 Kingdom Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Animals Profile */}
        <div className="bg-[#0a0f1e]/90 border border-blue-500/30 rounded-2xl p-5 shadow-[0_4px_20px_rgba(59,130,246,0.12)] flex flex-col justify-between hover:border-blue-400/60 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Állatok</h3>
                  <span className="text-[11px] font-mono text-blue-400 italic">Animalia</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80">
                Heterotróf
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {KINGDOM_PROFILES.animals.tagline}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Sejtfal:</span>
                <span className="text-rose-300 font-medium">{KINGDOM_PROFILES.animals.cellular.cellWall}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Tartaléktápanyag:</span>
                <span className="text-blue-300 font-medium">{KINGDOM_PROFILES.animals.metabolism.reserveNutrient}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Szerveződés:</span>
                <span className="text-slate-200">{KINGDOM_PROFILES.animals.organization.bodyPlan}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-1.5 font-mono">
              Kulcsfontosságú bélyegek:
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              {KINGDOM_PROFILES.animals.specialFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Plants Profile */}
        <div className="bg-[#0a0f1e]/90 border border-emerald-500/30 rounded-2xl p-5 shadow-[0_4px_20px_rgba(16,185,129,0.12)] flex flex-col justify-between hover:border-emerald-400/60 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Virágos növények</h3>
                  <span className="text-[11px] font-mono text-emerald-400 italic">Plantae</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                Autotróf
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {KINGDOM_PROFILES.plants.tagline}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Sejtfal:</span>
                <span className="text-emerald-300 font-medium">{KINGDOM_PROFILES.plants.cellular.cellWall}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Tartaléktápanyag:</span>
                <span className="text-emerald-300 font-medium">{KINGDOM_PROFILES.plants.metabolism.reserveNutrient}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Szerveződés:</span>
                <span className="text-slate-200">{KINGDOM_PROFILES.plants.organization.bodyPlan}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 font-mono">
              Kulcsfontosságú bélyegek:
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              {KINGDOM_PROFILES.plants.specialFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fungi Profile */}
        <div className="bg-[#0a0f1e]/90 border border-amber-500/30 rounded-2xl p-5 shadow-[0_4px_20px_rgba(245,158,11,0.12)] flex flex-col justify-between hover:border-amber-400/60 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Gombák</h3>
                  <span className="text-[11px] font-mono text-amber-400 italic">Fungi</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80">
                Heterotróf
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {KINGDOM_PROFILES.fungi.tagline}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Sejtfal:</span>
                <span className="text-amber-300 font-medium">{KINGDOM_PROFILES.fungi.cellular.cellWall}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Tartaléktápanyag:</span>
                <span className="text-amber-300 font-medium">{KINGDOM_PROFILES.fungi.metabolism.reserveNutrient}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05070a]/80 border border-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">Szerveződés:</span>
                <span className="text-slate-200">{KINGDOM_PROFILES.fungi.organization.bodyPlan}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 font-mono">
              Kulcsfontosságú bélyegek:
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              {KINGDOM_PROFILES.fungi.specialFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Systematic Comparison Matrix (Table) */}
      <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Szisztematikus Összehasonlító Mátrix
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredRows.length} vizsgált biológiai paraméter
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/90">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#05070a] text-slate-400 uppercase text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-300">Biológiai Szempont</th>
                <th className="py-3 px-4 text-blue-400 font-bold">🐾 Állatok</th>
                <th className="py-3 px-4 text-emerald-400 font-bold">🌿 Virágos növények</th>
                <th className="py-3 px-4 text-amber-400 font-bold">🍄 Gombák</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 bg-[#0a0f1e]/60 text-slate-200">
              {filteredRows.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-[#15203b]/70 transition-colors ${
                    row.isShared ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    {row.criterion}
                    {row.isShared && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800/80 font-normal">
                        Közös bélyeg
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-blue-200">{row.animals}</td>
                  <td className="py-3 px-4 text-emerald-200">{row.plants}</td>
                  <td className="py-3 px-4 text-amber-200">{row.fungi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Venn Intersection Logic Decoded */}
      <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          A Halmazábra Logikája & Érettségi Vizsgatippek
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 text-purple-200 shadow-sm">
            <strong className="block text-purple-300 font-bold mb-1 text-sm font-mono">
              Állatok ∩ Gombák
            </strong>
            <p className="text-slate-300">
              Mindkettő <strong>heterotróf</strong> (szerves anyagot fogyaszt) és tartaléktápanyaguk a <strong>glikogén</strong>. Plasztiszaik nincsenek.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/50 text-teal-200 shadow-sm">
            <strong className="block text-teal-300 font-bold mb-1 text-sm font-mono">
              Állatok ∩ Növények
            </strong>
            <p className="text-slate-300">
              Mindkét csoport döntően <strong>valódi szövetes és szerves szerveződésű</strong>. A gombáknak ezzel szemben telepes a testfelépítése.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-lime-950/30 border border-lime-800/50 text-lime-200 shadow-sm">
            <strong className="block text-lime-300 font-bold mb-1 text-sm font-mono">
              Növények ∩ Gombák
            </strong>
            <p className="text-slate-300">
              Mindkettő <strong>sejtfallal rendelkezik</strong> (növények: cellulóz, gombák: kitin), és helyhez kötött életmódúak.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-200 shadow-sm">
            <strong className="block text-rose-300 font-bold mb-1 text-sm font-mono">
              Mindháromban közös (Centrum)
            </strong>
            <p className="text-slate-300">
              <strong>Eukarióták</strong> (valódi sejtmagjuk van), és mitokondriumaik révén képesek <strong>biológiai oxidációra (sejtlégzésre)</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
