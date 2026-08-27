import React from 'react';
import { BiologicalClue, VennRegionId } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { GripVertical, Microscope, CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';

interface ClueCardProps {
  clue: BiologicalClue;
  placedRegion: VennRegionId | null;
  isActive: boolean;
  onSelect: (clueId: number) => void;
  onPlaceQuick: (clueId: number, regionId: VennRegionId) => void;
  onInspect: (clue: BiologicalClue) => void;
  isSubmitted: boolean;
}

export const ClueCard: React.FC<ClueCardProps> = ({
  clue,
  placedRegion,
  isActive,
  onSelect,
  onPlaceQuick,
  onInspect,
  isSubmitted,
}) => {
  const isPlaced = placedRegion !== null;
  const isCorrect = isSubmitted && placedRegion === clue.correctRegion;
  const isWrong = isSubmitted && isPlaced && placedRegion !== clue.correctRegion;
  const isMissing = isSubmitted && !isPlaced;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', clue.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Anyagcsere':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Sejttan':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
      case 'Szövettan & Szerveződés':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'Életmód & Funkciók':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div
      draggable={!isSubmitted}
      onDragStart={handleDragStart}
      onClick={() => onSelect(clue.id)}
      className={`group relative rounded-xl p-3.5 border transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-[#064e3b]/40 border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          : isCorrect
          ? 'bg-emerald-950/40 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
          : isWrong
          ? 'bg-rose-950/40 border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
          : isMissing
          ? 'bg-amber-950/30 border-amber-500/60'
          : isPlaced
          ? 'bg-[#0f172a]/90 border-slate-700 hover:border-slate-500 shadow-sm'
          : 'bg-[#0f172a]/60 border-slate-800 hover:bg-[#15203b] hover:border-slate-600'
      }`}
    >
      {/* Top Row: Number, Category, Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <span className="text-slate-500 group-hover:text-slate-300 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-3.5 h-3.5" />
            </span>
          )}
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#1e293b] text-cyan-300 border border-slate-700">
            #{clue.id}. állítás
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(clue.category)}`}>
            {clue.category}
          </span>
        </div>

        {/* Inspection Microscope Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect(clue);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-[#1e293b] transition-colors cursor-pointer"
          title="Biológiai háttér és mikroszkóp elemzés"
        >
          <Microscope className="w-4 h-4" />
        </button>
      </div>

      {/* Clue Statement Text */}
      <p className="text-sm font-semibold text-slate-100 leading-snug mb-3">
        {clue.text}
      </p>

      {/* Bottom Row: Placement Status or Quick Placement Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 text-xs">
        {/* Status indicator */}
        {isPlaced ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Elhelyezve:</span>
            <span className="font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60 shadow-sm">
              {VENN_REGIONS[placedRegion].shortName}
            </span>
            {isCorrect && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] ml-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Helyes (+1 pont)
              </span>
            )}
            {isWrong && (
              <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px] ml-1">
                <XCircle className="w-3.5 h-3.5" /> Helytelen
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400/80" />
            <span className="italic">Nincs elhelyezve</span>
          </div>
        )}

        {/* Quick Assignment Menu (if not submitted) */}
        {!isSubmitted && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={placedRegion || ''}
              onChange={(e) => {
                if (e.target.value) {
                  onPlaceQuick(clue.id, e.target.value as VennRegionId);
                }
              }}
              className="text-[11px] bg-[#05070a] border border-slate-700/90 rounded-lg px-2 py-1 text-slate-200 hover:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              <option value="" disabled>
                Halmaz kiválasztása...
              </option>
              {(Object.keys(VENN_REGIONS) as VennRegionId[]).map((regId) => (
                <option key={regId} value={regId}>
                  {VENN_REGIONS[regId].label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Post-submission Correction Hint */}
        {isSubmitted && isWrong && (
          <div className="w-full mt-1.5 p-2 rounded-xl bg-rose-950/50 border border-rose-800/60 text-[11px] text-rose-200 flex items-start gap-1.5 shadow-sm">
            <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span>Helyes csoport: </span>
              <strong className="text-emerald-300">{VENN_REGIONS[clue.correctRegion].label}</strong>
              <p className="text-slate-300 mt-0.5">{clue.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
