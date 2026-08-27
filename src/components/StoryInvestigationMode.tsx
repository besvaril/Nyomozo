import React, { useState } from 'react';
import { BiologicalClue, VennRegionId } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { getDetectiveRank, getEvaluationSummary } from '../utils/ranks';
import { playCorrectSound, playWrongSound, playClueSelectSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Microscope,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
  BookOpen,
  Eye,
  Zap,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface StoryInvestigationModeProps {
  clues: BiologicalClue[];
  detectiveName?: string;
  onOpenHandbook: () => void;
}

export const StoryInvestigationMode: React.FC<StoryInvestigationModeProps> = ({
  clues,
  detectiveName,
  onOpenHandbook,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, VennRegionId>>({});
  const [selectedRegion, setSelectedRegion] = useState<VennRegionId | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [hoveredRegion, setHoveredRegion] = useState<VennRegionId | null>(null);

  const currentClue = clues[currentIndex];

  // Calculate live score
  const correctAnswersCount = Object.keys(answers).filter(
    (id) => answers[Number(id)] === clues.find((c) => c.id === Number(id))?.correctRegion
  ).length;

  const currentScore = correctAnswersCount;
  const currentRank = getDetectiveRank(currentScore, clues.length);

  // Handle region click
  const handleSelectRegion = (regionId: VennRegionId) => {
    if (isAnswered) return;

    setSelectedRegion(regionId);
    setIsAnswered(true);

    const isCorrect = regionId === currentClue.correctRegion;
    setAnswers((prev) => ({
      ...prev,
      [currentClue.id]: regionId,
    }));

    if (isCorrect) {
      setStreak((prev) => prev + 1);
      playCorrectSound();
      if (currentScore + 1 === clues.length) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    } else {
      setStreak(0);
      playWrongSound();
    }
  };

  // Next round
  const handleNext = () => {
    if (currentIndex < clues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedRegion(null);
      setIsAnswered(false);
      playClueSelectSound();
    } else {
      setIsCompleted(true);
      if (currentScore >= clues.length * 0.8) {
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  // Restart
  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedRegion(null);
    setIsAnswered(false);
    setIsCompleted(false);
    setStreak(0);
  };

  const isCorrect = selectedRegion === currentClue?.correctRegion;
  const correctRegionInfo = currentClue ? VENN_REGIONS[currentClue.correctRegion] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Status Bar: Detective XP & Progress */}
      <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Detective Rank */}
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 rounded-2xl bg-[#05070a] border border-slate-800 shadow-inner flex items-center justify-center">
            {currentRank.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">
                Nyomozói Szint:
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${currentRank.badgeClass}`}>
                {currentRank.title}
              </span>
              {detectiveName && (
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                  🕵️ {detectiveName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentRank.description.slice(0, 75)}...
            </p>
          </div>
        </div>

        {/* Right: Round & Score */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-300 text-xs font-bold animate-bounce shadow-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-mono">{streak}x sorozat!</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Forduló</span>
              <span className="font-mono font-bold text-white text-sm">
                {isCompleted ? clues.length : currentIndex + 1} / {clues.length}
              </span>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-300 font-mono font-black text-base shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              {currentScore} pont
            </div>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: The Large NYOM (CLUE) Card & Feedback */}
          <div className="lg:col-span-5 space-y-4">
            {/* Clue Prompt Card */}
            <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Clue Header */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-xs px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm">
                    NYOM #{currentClue.id}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                    {currentClue.category}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {currentIndex + 1}. kérdés
                </span>
              </div>

              {/* Biological Statement */}
              <div className="my-3 py-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Biológiai Állítás:
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                  „{currentClue.text}”
                </h3>
              </div>

              {/* Prompt instruction */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isAnswered
                    ? 'Vizsgáld meg az indoklást, majd lépj a következő nyomra!'
                    : 'Kattints a megfelelő halmazra vagy metszetre a diagramon!'}
                </span>
              </div>
            </div>

            {/* Answer Feedback Card (Shown after selection) */}
            {isAnswered && (
              <div
                className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-200 ${
                  isCorrect
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-rose-950/60 border-rose-500/60 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                }`}
              >
                {/* Result Title */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 font-bold text-base">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">Helyes Besorolás! (+1 pont)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                        <span className="text-rose-300">Nem a megfelelő halmaz!</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Expected solution */}
                <div className="p-3 rounded-xl bg-[#05070a]/80 border border-slate-800 text-xs mb-3 space-y-1">
                  <div>
                    <span className="text-slate-400">Helyes csoport: </span>
                    <strong className="text-emerald-300 font-bold">
                      {correctRegionInfo?.label} ({correctRegionInfo?.shortName})
                    </strong>
                  </div>
                  {!isCorrect && selectedRegion && (
                    <div>
                      <span className="text-slate-400">Te választásod: </span>
                      <span className="text-rose-300 font-medium">
                        {VENN_REGIONS[selectedRegion].label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Biological explanation */}
                <div className="text-xs text-slate-200 leading-relaxed bg-[#05070a]/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <strong className="text-cyan-300 font-mono block mb-1 font-bold">
                    Biológiai Magyarázat:
                  </strong>
                  {currentClue.explanation}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <span>
                    {currentIndex < clues.length - 1 ? 'Következő Nyom Vizsgálata' : 'Nyomozási Jegyzőkönyv (Befejezés)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Direct Quick Selection Pills (Optional for ultra fast/accessible clicking) */}
            <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-md">
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 block mb-2.5">
                Gyors Halmazválasztó Gombok:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(Object.keys(VENN_REGIONS) as VennRegionId[]).map((regId) => {
                  const reg = VENN_REGIONS[regId];
                  const isSelected = selectedRegion === regId;
                  const isCorrectTarget = isAnswered && currentClue.correctRegion === regId;

                  let style = 'bg-[#0f172a]/80 border-slate-700/80 hover:bg-[#15203b] hover:border-slate-500 text-slate-200';

                  if (isAnswered) {
                    if (isCorrectTarget) {
                      style = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400 font-bold shadow-[0_0_10px_rgba(52,211,153,0.3)]';
                    } else if (isSelected && !isCorrectTarget) {
                      style = 'bg-rose-950/80 border-rose-400 text-rose-100 ring-1 ring-rose-400';
                    } else {
                      style = 'opacity-40 bg-[#05070a] border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={regId}
                      disabled={isAnswered}
                      onClick={() => handleSelectRegion(regId)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${style}`}
                    >
                      <span className="block font-bold text-xs">{reg.shortName}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{reg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: The 3-Set Venn Diagram (Interactive Clickable SVG) */}
          <div className="lg:col-span-7 bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Microscope className="w-4 h-4 text-cyan-400" />
                Interaktív Háromhalmazos Venn-diagram
              </h4>
              <span className="text-xs text-slate-400">
                Kattints a kívánt zónára a diagramon
              </span>
            </div>

            {/* Venn SVG Stage */}
            <div className="relative w-full max-w-[560px] aspect-[600/540] my-2 select-none">
              <svg viewBox="0 0 600 540" className="w-full h-full">
                <defs>
                  {/* Glowing Circles Gradients */}
                  <radialGradient id="story-grad-animals" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#2563eb" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
                  </radialGradient>
                  <radialGradient id="story-grad-plants" cx="65%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#059669" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#064e3b" stopOpacity="0.05" />
                  </radialGradient>
                  <radialGradient id="story-grad-fungi" cx="50%" cy="75%" r="65%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#d97706" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#78350f" stopOpacity="0.05" />
                  </radialGradient>
                </defs>

                {/* Circle 1: Animals (Top Left) */}
                <circle
                  cx="210"
                  cy="195"
                  r="165"
                  fill="url(#story-grad-animals)"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                />

                {/* Circle 2: Flowering Plants (Top Right) */}
                <circle
                  cx="390"
                  cy="195"
                  r="165"
                  fill="url(#story-grad-plants)"
                  stroke="#34d399"
                  strokeWidth="3"
                  className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                />

                {/* Circle 3: Fungi (Bottom Center) */}
                <circle
                  cx="300"
                  cy="325"
                  r="165"
                  fill="url(#story-grad-fungi)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                />

                {/* Titles */}
                <g className="pointer-events-none">
                  <rect x="95" y="65" width="115" height="34" rx="10" fill="#0b1329" fillOpacity="0.95" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="152" y="87" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="bold">
                    🐾 Állatok
                  </text>
                </g>

                <g className="pointer-events-none">
                  <rect x="365" y="65" width="175" height="34" rx="10" fill="#0b1329" fillOpacity="0.95" stroke="#34d399" strokeWidth="1.5" />
                  <text x="452" y="87" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold">
                    🌿 Virágos növények
                  </text>
                </g>

                <g className="pointer-events-none">
                  <rect x="240" y="468" width="120" height="34" rx="10" fill="#0b1329" fillOpacity="0.95" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="300" y="490" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold">
                    🍄 Gombák
                  </text>
                </g>
              </svg>

              {/* Clickable Zone Interactive Overlays */}
              {/* 1. Only Animals */}
              <InteractiveZoneButton
                label="Csak Állatok"
                short="Állatok"
                positionClass="top-[24%] left-[12%]"
                isSelected={selectedRegion === 'only_animals'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'only_animals'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('only_animals')}
                onHover={setHoveredRegion}
                regionId="only_animals"
              />

              {/* 2. Only Plants */}
              <InteractiveZoneButton
                label="Csak Növények"
                short="Növények"
                positionClass="top-[24%] right-[12%]"
                isSelected={selectedRegion === 'only_plants'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'only_plants'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('only_plants')}
                onHover={setHoveredRegion}
                regionId="only_plants"
              />

              {/* 3. Only Fungi */}
              <InteractiveZoneButton
                label="Csak Gombák"
                short="Gombák"
                positionClass="bottom-[18%] left-[40%]"
                isSelected={selectedRegion === 'only_fungi'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'only_fungi'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('only_fungi')}
                onHover={setHoveredRegion}
                regionId="only_fungi"
              />

              {/* 4. Animals ∩ Plants (Top Center Intersection) */}
              <InteractiveZoneButton
                label="Állatok ∩ Növények"
                short="Állat + Növény"
                positionClass="top-[23%] left-[38%]"
                isSelected={selectedRegion === 'animals_plants'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'animals_plants'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('animals_plants')}
                onHover={setHoveredRegion}
                regionId="animals_plants"
              />

              {/* 5. Animals ∩ Fungi (Bottom Left Intersection) */}
              <InteractiveZoneButton
                label="Állatok ∩ Gombák"
                short="Állat + Gomba"
                positionClass="top-[49%] left-[23%]"
                isSelected={selectedRegion === 'animals_fungi'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'animals_fungi'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('animals_fungi')}
                onHover={setHoveredRegion}
                regionId="animals_fungi"
              />

              {/* 6. Plants ∩ Fungi (Bottom Right Intersection) */}
              <InteractiveZoneButton
                label="Növények ∩ Gombák"
                short="Növény + Gomba"
                positionClass="top-[49%] right-[23%]"
                isSelected={selectedRegion === 'plants_fungi'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'plants_fungi'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('plants_fungi')}
                onHover={setHoveredRegion}
                regionId="plants_fungi"
              />

              {/* 7. All Three (Center Intersection) */}
              <InteractiveZoneButton
                label="Mindhárom (Közös)"
                short="Mindhárom"
                positionClass="top-[43%] left-[38%]"
                isSelected={selectedRegion === 'all_three'}
                isCorrectTarget={isAnswered && currentClue.correctRegion === 'all_three'}
                isAnswered={isAnswered}
                onClick={() => handleSelectRegion('all_three')}
                onHover={setHoveredRegion}
                regionId="all_three"
                isCenter
              />
            </div>
          </div>
        </div>
      ) : (
        /* Final Game End Screen */
        <div className="max-w-3xl mx-auto bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center space-y-8 animate-in zoom-in-95 duration-300">
          {/* Header Trophy & Rank */}
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400/20 via-emerald-400/20 to-cyan-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              {currentRank.icon}
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
                Biológiai Nyomozás Befejezve {detectiveName ? `• ${detectiveName}` : ''}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {currentRank.title}
              </h2>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-[#05070a]/90 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 block font-mono">Elért Pontszám:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {currentScore} / {clues.length} pont
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#05070a]/90 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 block font-mono">Helyes válaszok:</span>
              <span className="text-2xl font-black text-emerald-300 font-mono mt-1 block">
                {currentScore} db
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#05070a]/90 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 block font-mono">Hibás válaszok:</span>
              <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                {clues.length - currentScore} db
              </span>
            </div>
          </div>

          {/* Short Evaluation & Feedback */}
          <div className="p-5 rounded-2xl bg-[#05070a]/90 border border-slate-800/90 text-left space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Hivatalos Értékelés:
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {getEvaluationSummary(currentScore, clues.length)}
            </p>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
              {currentRank.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenHandbook}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0f172a] hover:bg-[#15203b] border border-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Nyomozati Kézikönyv</span>
            </button>

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Új Nyomozás Indítása</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface InteractiveZoneButtonProps {
  label: string;
  short: string;
  positionClass: string;
  isSelected: boolean;
  isCorrectTarget: boolean;
  isAnswered: boolean;
  onClick: () => void;
  onHover: (id: VennRegionId | null) => void;
  regionId: VennRegionId;
  isCenter?: boolean;
}

const InteractiveZoneButton: React.FC<InteractiveZoneButtonProps> = ({
  label,
  short,
  positionClass,
  isSelected,
  isCorrectTarget,
  isAnswered,
  onClick,
  onHover,
  regionId,
  isCenter = false,
}) => {
  let stateClasses = 'bg-[#0a0f1e]/85 border-slate-700/80 hover:bg-[#131d35] text-slate-200 hover:border-slate-500 hover:scale-105';

  if (isAnswered) {
    if (isCorrectTarget) {
      stateClasses = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105 animate-pulse';
    } else if (isSelected && !isCorrectTarget) {
      stateClasses = 'bg-rose-950/90 border-rose-400 text-rose-100 ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]';
    } else {
      stateClasses = 'opacity-35 bg-[#05070a] border-slate-800 text-slate-500 pointer-events-none';
    }
  } else if (isCenter) {
    stateClasses = 'bg-gradient-to-br from-rose-950/80 to-purple-950/80 border-rose-500/60 hover:border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)] hover:scale-105';
  }

  return (
    <button
      type="button"
      disabled={isAnswered}
      onClick={onClick}
      onMouseEnter={() => onHover(regionId)}
      onMouseLeave={() => onHover(null)}
      className={`absolute z-10 p-2 rounded-xl border backdrop-blur-xl transition-all duration-200 flex flex-col items-center justify-center min-w-[95px] max-w-[130px] cursor-pointer shadow-lg select-none ${positionClass} ${stateClasses}`}
    >
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-center leading-tight">
        {short}
      </span>
      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
        {isCenter ? 'Közös metszet' : 'Halmaz'}
      </span>
    </button>
  );
};
