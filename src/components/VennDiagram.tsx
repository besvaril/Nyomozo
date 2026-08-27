import React, { useState } from 'react';
import { BiologicalClue, VennRegionId } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { Sparkles, CheckCircle2, XCircle, Eye, Info, MousePointerClick } from 'lucide-react';

interface VennDiagramProps {
  placements: Record<number, VennRegionId | null>;
  clues: BiologicalClue[];
  activeClueId: number | null;
  onPlaceClue: (clueId: number, regionId: VennRegionId) => void;
  onRemoveClue: (clueId: number) => void;
  onInspectClue: (clue: BiologicalClue) => void;
  isSubmitted: boolean;
  onDropClue?: (e: React.DragEvent, regionId: VennRegionId) => void;
}

export const VennDiagram: React.FC<VennDiagramProps> = ({
  placements,
  clues,
  activeClueId,
  onPlaceClue,
  onRemoveClue,
  onInspectClue,
  isSubmitted,
  onDropClue,
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<VennRegionId | null>(null);

  // Group placed clues by region
  const cluesByRegion: Record<VennRegionId, BiologicalClue[]> = {
    only_animals: [],
    only_plants: [],
    only_fungi: [],
    animals_plants: [],
    animals_fungi: [],
    plants_fungi: [],
    all_three: [],
  };

  clues.forEach((clue) => {
    const region = placements[clue.id];
    if (region && cluesByRegion[region]) {
      cluesByRegion[region].push(clue);
    }
  });

  const activeClue = activeClueId ? clues.find((c) => c.id === activeClueId) : null;

  const handleRegionClick = (regionId: VennRegionId) => {
    if (activeClueId !== null) {
      onPlaceClue(activeClueId, regionId);
    } else {
      setHoveredRegion((prev) => (prev === regionId ? null : regionId));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, regionId: VennRegionId) => {
    e.preventDefault();
    if (onDropClue) {
      onDropClue(e, regionId);
    } else {
      const clueIdStr = e.dataTransfer.getData('text/plain');
      const clueId = parseInt(clueIdStr, 10);
      if (!isNaN(clueId)) {
        onPlaceClue(clueId, regionId);
      }
    }
  };

  return (
    <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col items-center">
      {/* Venn Diagram Header & Status */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Interaktív Halmazábra (Venn-diagram)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Húzd a nyomokat vagy jelölj ki egy állítást, majd kattints a megfelelő halmazmezőre!
          </p>
        </div>

        {activeClue && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] animate-pulse">
            <MousePointerClick className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>
              Kiválasztva: <strong className="text-white font-mono">#{activeClue.id}</strong> {activeClue.text.slice(0, 32)}
              {activeClue.text.length > 32 ? '...' : ''}
            </span>
          </div>
        )}
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative w-full max-w-[620px] aspect-[4/3.4] flex items-center justify-center select-none">
        <svg
          viewBox="0 0 600 520"
          className="w-full h-full filter drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="grad-animals" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#2563eb" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.04" />
            </radialGradient>
            <radialGradient id="grad-plants" cx="65%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.04" />
            </radialGradient>
            <radialGradient id="grad-fungi" cx="50%" cy="75%" r="65%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#d97706" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.04" />
            </radialGradient>

            {/* Glowing filters */}
            <filter id="glow-circle" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main 3 Background Circles */}
          {/* Circle 1: Animals (Top Left) */}
          <circle
            cx="225"
            cy="195"
            r="165"
            fill="url(#grad-animals)"
            stroke="#38bdf8"
            strokeWidth="3"
            className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]"
          />

          {/* Circle 2: Flowering Plants (Top Right) */}
          <circle
            cx="375"
            cy="195"
            r="165"
            fill="url(#grad-plants)"
            stroke="#34d399"
            strokeWidth="3"
            className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]"
          />

          {/* Circle 3: Fungi (Bottom Center) */}
          <circle
            cx="300"
            cy="325"
            r="165"
            fill="url(#grad-fungi)"
            stroke="#fbbf24"
            strokeWidth="3"
            className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]"
          />

          {/* Circle Kingdom Main Labels */}
          {/* Animals Label */}
          <g className="pointer-events-none">
            <rect x="95" y="65" width="115" height="34" rx="10" fill="#0b1329" fillOpacity="0.95" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="152" y="87" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              🐾 Állatok
            </text>
          </g>

          {/* Plants Label */}
          <g className="pointer-events-none">
            <rect x="365" y="65" width="175" height="34" rx="10" fill="#0b1329" fillOpacity="0.95" stroke="#34d399" strokeWidth="1.5" />
            <text x="452" y="87" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              🌿 Virágos növények
            </text>
          </g>

          {/* Fungi Label */}
          <g className="pointer-events-none">
            <rect x="240" y="468" width="120" height="34" rx="10" fill="#0b1329" fillOpacity="0.95" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="300" y="490" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              🍄 Gombák
            </text>
          </g>
        </svg>

        {/* Interactive Zone Buttons Placed on Top with Absolute Coordinates */}
        {/* 1. Only Animals (Top Left) */}
        <ZoneTargetOverlay
          regionId="only_animals"
          title="Csak Állatok"
          positionClass="top-[22%] left-[12%]"
          clues={cluesByRegion.only_animals}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'only_animals'}
          onClick={() => handleRegionClick('only_animals')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'only_animals')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
        />

        {/* 2. Animals + Plants Intersection (Top Center) */}
        <ZoneTargetOverlay
          regionId="animals_plants"
          title="Állatok ∩ Növények"
          positionClass="top-[18%] left-[40%]"
          clues={cluesByRegion.animals_plants}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'animals_plants'}
          onClick={() => handleRegionClick('animals_plants')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'animals_plants')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
        />

        {/* 3. Only Plants (Top Right) */}
        <ZoneTargetOverlay
          regionId="only_plants"
          title="Csak Növények"
          positionClass="top-[22%] right-[10%]"
          clues={cluesByRegion.only_plants}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'only_plants'}
          onClick={() => handleRegionClick('only_plants')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'only_plants')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
        />

        {/* 4. Animals + Fungi Intersection (Center Left) */}
        <ZoneTargetOverlay
          regionId="animals_fungi"
          title="Állatok ∩ Gombák"
          positionClass="top-[48%] left-[22%]"
          clues={cluesByRegion.animals_fungi}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'animals_fungi'}
          onClick={() => handleRegionClick('animals_fungi')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'animals_fungi')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
        />

        {/* 5. Center - All Three (The Core Intersection) */}
        <ZoneTargetOverlay
          regionId="all_three"
          title="Mindhárom (Közös)"
          positionClass="top-[43%] left-[38%]"
          clues={cluesByRegion.all_three}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'all_three'}
          onClick={() => handleRegionClick('all_three')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'all_three')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
          highlightCenter
        />

        {/* 6. Plants + Fungi Intersection (Center Right) */}
        <ZoneTargetOverlay
          regionId="plants_fungi"
          title="Növények ∩ Gombák"
          positionClass="top-[48%] right-[22%]"
          clues={cluesByRegion.plants_fungi}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'plants_fungi'}
          onClick={() => handleRegionClick('plants_fungi')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'plants_fungi')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
        />

        {/* 7. Only Fungi (Bottom Center) */}
        <ZoneTargetOverlay
          regionId="only_fungi"
          title="Csak Gombák"
          positionClass="bottom-[18%] left-[38%]"
          clues={cluesByRegion.only_fungi}
          isActive={activeClueId !== null}
          isHovered={hoveredRegion === 'only_fungi'}
          onClick={() => handleRegionClick('only_fungi')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'only_fungi')}
          onRemoveClue={onRemoveClue}
          onInspectClue={onInspectClue}
          isSubmitted={isSubmitted}
        />
      </div>

      {/* Grid Region Selector for Touch / Mobile Accessibility & Overview */}
      <div className="w-full mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Zóna Áttekintő & Gyors Helyezés
          </span>
          <span className="text-[11px] text-slate-500">
            Kattints bármelyik zónára a kiválasztott nyom behelyezéséhez
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {(Object.keys(VENN_REGIONS) as VennRegionId[]).map((regId) => {
            const region = VENN_REGIONS[regId];
            const count = cluesByRegion[regId].length;
            const isTarget = activeClueId !== null;

            return (
              <button
                key={regId}
                onClick={() => handleRegionClick(regId)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, regId)}
                className={`text-left p-3 rounded-xl border transition-all relative group flex flex-col justify-between ${
                  isTarget
                    ? 'hover:border-cyan-400 hover:bg-cyan-950/40 cursor-pointer ring-1 ring-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'cursor-pointer hover:bg-[#131d35]'
                } ${
                  regId === 'all_three'
                    ? 'bg-gradient-to-br from-rose-950/40 via-[#0a0f1e] to-purple-950/40 border-rose-700/50 shadow-sm'
                    : 'bg-[#0f172a]/70 border-slate-700/60 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {region.shortName}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      count > 0
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800/80 text-slate-500'
                    }`}
                  >
                    {count} db
                  </span>
                </div>

                {/* Badges of items inside this region */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {cluesByRegion[regId].map((clue) => {
                    const isCorrect = isSubmitted && clue.correctRegion === regId;
                    const isWrong = isSubmitted && clue.correctRegion !== regId;

                    return (
                      <span
                        key={clue.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectClue(clue);
                        }}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all hover:scale-105 ${
                          isCorrect
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                            : isWrong
                            ? 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                            : 'bg-[#1e293b] border-slate-600 text-slate-200 hover:border-slate-400'
                        }`}
                        title={clue.text}
                      >
                        #{clue.id}
                        {isCorrect && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {isWrong && <XCircle className="w-3 h-3 text-rose-400" />}
                      </span>
                    );
                  })}
                  {count === 0 && (
                    <span className="text-[11px] text-slate-500 italic">Üres mező</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ZoneTargetOverlayProps {
  regionId: VennRegionId;
  title: string;
  positionClass: string;
  clues: BiologicalClue[];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveClue: (clueId: number) => void;
  onInspectClue: (clue: BiologicalClue) => void;
  isSubmitted: boolean;
  highlightCenter?: boolean;
}

const ZoneTargetOverlay: React.FC<ZoneTargetOverlayProps> = ({
  regionId,
  title,
  positionClass,
  clues,
  isActive,
  onClick,
  onDragOver,
  onDrop,
  onRemoveClue,
  onInspectClue,
  isSubmitted,
  highlightCenter,
}) => {
  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`absolute z-10 p-2 rounded-xl border backdrop-blur-xl transition-all duration-200 flex flex-col items-center justify-center min-w-[90px] max-w-[130px] cursor-pointer shadow-lg select-none ${positionClass} ${
        isActive
          ? 'bg-[#064e3b]/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105 animate-pulse'
          : highlightCenter
          ? 'bg-gradient-to-br from-rose-950/80 to-purple-950/80 border-rose-500/60 hover:border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
          : 'bg-[#0a0f1e]/85 border-slate-700/80 hover:bg-[#131d35] text-slate-200 hover:border-slate-500'
      }`}
    >
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-center leading-tight">
        {title}
      </span>

      {/* Clues badges inside zone */}
      <div className="flex flex-wrap gap-1 mt-1 justify-center max-w-[115px]">
        {clues.map((clue) => {
          const isCorrect = isSubmitted && clue.correctRegion === regionId;
          const isWrong = isSubmitted && clue.correctRegion !== regionId;

          return (
            <div
              key={clue.id}
              className={`group/badge relative inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all ${
                isCorrect
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.3)]'
                  : isWrong
                  ? 'bg-rose-500/30 border-rose-400 text-rose-100 ring-1 ring-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.3)]'
                  : 'bg-[#1e293b] border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span>#{clue.id}</span>

              {/* Quick remove button */}
              {!isSubmitted && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveClue(clue.id);
                  }}
                  className="ml-0.5 text-slate-400 hover:text-rose-400 text-[9px] leading-none"
                  title="Eltávolítás ebből a zónából"
                >
                  ×
                </button>
              )}

              {/* Inspect modal click */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectClue(clue);
                }}
                className="ml-0.5 text-cyan-400 hover:text-cyan-300"
                title="Biológiai mikroszkóp vizsgálat"
              >
                <Eye className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        {clues.length === 0 && (
          <span className="text-[9px] text-slate-500 italic py-0.5">
            {isActive ? '+ Ide helyez' : 'Üres'}
          </span>
        )}
      </div>
    </div>
  );
};
