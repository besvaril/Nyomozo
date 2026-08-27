import React from 'react';
import { BiologicalClue } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { Microscope, X, Check, Dna, ArrowLeft, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface ClueDetailModalProps {
  clue: BiologicalClue | null;
  allClues: BiologicalClue[];
  onClose: () => void;
  onNavigate: (clue: BiologicalClue) => void;
}

export const ClueDetailModal: React.FC<ClueDetailModalProps> = ({
  clue,
  allClues,
  onClose,
  onNavigate,
}) => {
  if (!clue) return null;

  const currentIndex = allClues.findIndex((c) => c.id === clue.id);
  const prevClue = currentIndex > 0 ? allClues[currentIndex - 1] : null;
  const nextClue = currentIndex < allClues.length - 1 ? allClues[currentIndex + 1] : null;

  const regionInfo = VENN_REGIONS[clue.correctRegion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0f1e] border border-slate-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/90 bg-[#05070a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                Biomikroszkóp Elemzés • #{clue.id}. Nyom
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {clue.text}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Target Venn Region Result Box */}
          <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <span className="text-xs uppercase text-slate-400 font-semibold">
                Helyes halmaz-besorolás:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-emerald-300">
                  {regionInfo.label}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#05070a] text-slate-300 border border-slate-700">
                  ({regionInfo.shortName})
                </span>
              </div>
            </div>

            {/* Involving kingdoms chips */}
            <div className="flex flex-wrap gap-1.5">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                  clue.involvedKingdoms.includes('animals')
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                    : 'bg-slate-800 text-slate-500 border-slate-700 line-through opacity-40'
                }`}
              >
                🐾 Állatok
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                  clue.involvedKingdoms.includes('plants')
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800 text-slate-500 border-slate-700 line-through opacity-40'
                }`}
              >
                🌿 Virágos növények
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                  clue.involvedKingdoms.includes('fungi')
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-800 text-slate-500 border-slate-700 line-through opacity-40'
                }`}
              >
                🍄 Gombák
              </span>
            </div>
          </div>

          {/* Biological Explanation */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Részletes Biológiai Indoklás
            </h4>
            <div className="p-4 rounded-xl bg-[#05070a]/90 border border-slate-800 text-slate-200 leading-relaxed">
              {clue.explanation}
            </div>
          </div>

          {/* Microscope Detail */}
          {clue.microscopeDetail && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                <Dna className="w-4 h-4 text-cyan-400" />
                Laboratóriumi & Biokémiai Marker
              </h4>
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-700/50 text-cyan-200 text-xs font-mono flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.1)]">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{clue.microscopeDetail}</span>
              </div>
            </div>
          )}

          {/* Quick Exam Tip */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-700/50 text-xs text-emerald-200/90 flex items-start gap-2.5 shadow-sm">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 font-bold">Érettségi / Teszt tipp:</strong> Mindig figyelj arra, hogy a tulajdonság sejtszintű (pl. sejtfal, sejtmag), szövettani (pl. szövetek megléte, idegszövet) vagy anyagcsere-beli (pl. táplálkozás, biológiai oxidáció)!
            </div>
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800/90 bg-[#05070a]">
          <button
            disabled={!prevClue}
            onClick={() => prevClue && onNavigate(prevClue)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Előző állítás</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {currentIndex + 1} / {allClues.length}
          </span>

          <button
            disabled={!nextClue}
            onClick={() => nextClue && onNavigate(nextClue)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Következő állítás</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
