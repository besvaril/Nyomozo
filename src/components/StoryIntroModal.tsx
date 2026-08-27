import React from 'react';
import { AlertTriangle, Play, ShieldAlert, Sparkles, X, Microscope, Dna, HelpCircle } from 'lucide-react';

interface StoryIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const StoryIntroModal: React.FC<StoryIntroModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0f1e] border border-amber-500/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-cyan-500/20 border-b border-amber-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-mono tracking-widest text-amber-400 font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Rendszerriasztás • Titkos Biológiai Laboratórium
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Vészhelyzet a biológiai laborban!
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Bezárás"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-slate-200">
          {/* Main Story Box */}
          <div className="p-5 rounded-2xl bg-[#05070a]/90 border border-slate-800/90 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              <span className="text-2xl mr-1">🚨</span>
              <strong className="text-amber-300 font-bold">Összekeveredtek az élőlények tulajdonságai.</strong> A labor rendszere csak akkor indítható újra, ha minden biológiai nyomot a megfelelő helyre rendezed.
            </p>

            <p className="text-sm text-cyan-300 font-semibold mt-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Készen állsz a nyomozásra?</span>
            </p>
          </div>

          {/* 3 Kingdoms & Venn Logic Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              A Háromhalmazos Venn-diagram Felépítése:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-blue-300 font-bold block text-sm mb-1">🐾 Bal oldalon: Állatok</span>
                <span className="text-slate-400">Idegszövet, aktív mozgás, nincsen sejtfal.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-emerald-300 font-bold block text-sm mb-1">🌿 Jobb oldalon: Virágos növények</span>
                <span className="text-slate-400">Fotoszintézis, cellulóz sejtfal, szállítószövetek.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-amber-300 font-bold block text-sm mb-1">🍄 Alul: Gombák</span>
                <span className="text-slate-400">Kitin sejtfal, gombafonalak (hifák), antibiotikumok.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300">Halmazmetszetek:</strong> Ha egy állítás több csoportra is igaz (pl. heterotróf táplálkozás, sejtfal jelenléte, sejtmag), kattints a megfelelő metszetre vagy a középső <span className="text-rose-300 font-bold font-mono">„Mindhárom”</span> zónára!
              </div>
            </div>
          </div>

          {/* Detective Rank Preview */}
          <div className="p-4 rounded-2xl bg-[#05070a] border border-slate-800 text-xs">
            <span className="text-slate-400 uppercase font-mono tracking-wider font-bold text-[11px] block mb-2">
              Elérhető Nyomozói Szintek:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-base block mb-0.5">🕵️</span>
                <span className="text-[11px] font-bold text-amber-300">0–3 pont</span>
                <span className="text-[10px] text-slate-400 block">Kezdő nyomozó</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-base block mb-0.5">🔬</span>
                <span className="text-[11px] font-bold text-cyan-300">4–6 pont</span>
                <span className="text-[10px] text-slate-400 block">Biológiai kutató</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-base block mb-0.5">🧬</span>
                <span className="text-[11px] font-bold text-emerald-300">7–9 pont</span>
                <span className="text-[10px] text-slate-400 block">Haladó kutató</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-amber-500/40">
                <span className="text-base block mb-0.5">🏆</span>
                <span className="text-[11px] font-bold text-amber-200">10 pont</span>
                <span className="text-[10px] text-amber-300 block">Mesternyomozó</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#05070a] border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Átugrás
          </button>

          <button
            onClick={onStartGame}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Készen állok a nyomozásra!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
