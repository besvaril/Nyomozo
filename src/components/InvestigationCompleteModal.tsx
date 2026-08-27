import React from 'react';
import { BiologicalClue, VennRegionId } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { getDetectiveRank, getEvaluationSummary } from '../utils/ranks';
import { Award, CheckCircle2, XCircle, RefreshCw, BookOpen, Eye, X, Sparkles } from 'lucide-react';

interface InvestigationCompleteModalProps {
  score: number;
  total: number;
  detectiveName?: string;
  clues: BiologicalClue[];
  placements: Record<number, VennRegionId | null>;
  onClose: () => void;
  onReset: () => void;
  onInspectClue: (clue: BiologicalClue) => void;
  onOpenHandbook: () => void;
}

export const InvestigationCompleteModal: React.FC<InvestigationCompleteModalProps> = ({
  score,
  total,
  detectiveName,
  clues,
  placements,
  onClose,
  onReset,
  onInspectClue,
  onOpenHandbook,
}) => {
  const percentage = Math.round((score / total) * 100);
  const rank = getDetectiveRank(score, total);
  const evaluationText = getEvaluationSummary(score, total);
  const wrongCount = total - score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0f1e] border border-slate-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#05070a] border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-wider">
                Hivatalos Nyomozati Értékelés {detectiveName ? `• ${detectiveName}` : ''}
              </span>
              <h3 className="text-xl font-bold text-white">
                Laboratóriumi Vizsga Jegyzőkönyv
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Certificate Banner */}
          <div className="p-5 rounded-2xl bg-[#05070a]/95 border border-slate-800 text-center space-y-2 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="text-3xl mb-1">{rank.icon}</div>
            {detectiveName && (
              <div className="text-xs font-mono text-cyan-300 font-bold">
                Nyomozó: <span className="text-white uppercase tracking-wider">{detectiveName}</span>
              </div>
            )}
            <span className={`inline-block text-xs font-mono px-3 py-1 rounded-full border font-bold shadow-sm ${rank.badgeClass}`}>
              Nyomozói Rang: {rank.title}
            </span>
            <h4 className="text-2xl font-black text-white tracking-tight mt-2 font-mono">
              {score} / {total} pont ({percentage}%)
            </h4>
            <p className="text-xs text-slate-300 max-w-lg mx-auto font-medium">
              {evaluationText}
            </p>
          </div>

          {/* Key Metrics Overview: Score, Correct, Wrong, Rank */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#05070a] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Elért pontszám</span>
              <span className="text-lg font-black text-white font-mono">{score} / {total}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#05070a] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Helyes válaszok</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{score} db</span>
            </div>
            <div className="p-3 rounded-xl bg-[#05070a] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Hibás válaszok</span>
              <span className="text-lg font-black text-rose-400 font-mono">{wrongCount} db</span>
            </div>
            <div className="p-3 rounded-xl bg-[#05070a] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Nyomozói rang</span>
              <span className="text-xs font-bold text-cyan-300 font-mono block mt-1 truncate">{rank.title}</span>
            </div>
          </div>

          {/* Detailed Clue-by-Clue Breakdown */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Állítások Részletes Ellenőrzése:
            </h5>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {clues.map((clue) => {
                const placed = placements[clue.id];
                const isCorrect = placed === clue.correctRegion;

                return (
                  <div
                    key={clue.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                        : 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-300">#{clue.id}</span>
                          <strong className="text-slate-100">{clue.text}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          <span>Megadott: </span>
                          <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 line-through'}>
                            {placed ? VENN_REGIONS[placed].shortName : 'Nincs elhelyezve'}
                          </span>
                          {!isCorrect && (
                            <span className="ml-1 text-emerald-300 font-semibold">
                              → Helyes: {VENN_REGIONS[clue.correctRegion].shortName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onInspectClue(clue)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
                      title="Részletes biológiai indoklás"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800/90 bg-[#05070a]">
          <button
            onClick={onOpenHandbook}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-[#15203b] border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tudástár & Összehasonlítás</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-[#15203b] border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Újravizsgálat</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Vissza a halmazábrához
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
