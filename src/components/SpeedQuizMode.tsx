import React, { useState, useEffect } from 'react';
import { BiologicalClue, VennRegionId } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { playCorrectSound, playWrongSound, playScanSound } from '../utils/audio';
import { Zap, Timer, Flame, CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeedQuizModeProps {
  clues: BiologicalClue[];
  detectiveName?: string;
  onFinish?: () => void;
}

export const SpeedQuizMode: React.FC<SpeedQuizModeProps> = ({ clues, detectiveName }) => {
  const [shuffledClues, setShuffledClues] = useState<BiologicalClue[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<VennRegionId | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize randomized clues
  useEffect(() => {
    startNewGame();
  }, [clues]);

  const startNewGame = () => {
    const randomized = [...clues].sort(() => Math.random() - 0.5);
    setShuffledClues(randomized);
    setCurrentIndex(0);
    setSelectedRegion(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(15);
    setIsFinished(false);
    playScanSound();
  };

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isFinished || shuffledClues.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnswered, isFinished, shuffledClues]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setStreak(0);
    playWrongSound();
  };

  const handleAnswer = (regionId: VennRegionId) => {
    if (isAnswered || isFinished) return;

    setSelectedRegion(regionId);
    setIsAnswered(true);

    const currentClue = shuffledClues[currentIndex];
    const isCorrect = regionId === currentClue.correctRegion;

    if (isCorrect) {
      playCorrectSound();
      const newStreak = streak + 1;
      const points = 100 + timeLeft * 10 + streak * 20;
      setScore((prev) => prev + points);
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      playWrongSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledClues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedRegion(null);
      setIsAnswered(false);
      setTimeLeft(15);
      playScanSound();
    } else {
      setIsFinished(true);
      if (score > 800) {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    }
  };

  if (shuffledClues.length === 0) return null;

  const currentClue = shuffledClues[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Status Bar */}
      <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Gyors Labor Szkenner
              </h2>
              {detectiveName && (
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                  🕵️ {detectiveName}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Kérdés {currentIndex + 1} / {shuffledClues.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-[#05070a] px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-bold text-amber-400 shadow-sm">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span className="font-mono">Streak: {streak}x</span>
          </div>

          {/* Score */}
          <div className="bg-emerald-950/80 border border-emerald-500/50 px-3.5 py-1.5 rounded-xl text-emerald-300 font-mono font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {score} pont
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden">
          {/* Time Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full mb-6 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft > 8
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : timeLeft > 4
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>

          {/* Timer Clock */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-cyan-400" />
              Hátralévő idő: <strong className="text-white font-mono text-sm">{timeLeft} mp</strong>
            </span>
            <span className="font-mono text-cyan-400">#{currentClue.id}. mintavétel</span>
          </div>

          {/* Clue Prompt Box */}
          <div className="p-6 rounded-2xl bg-[#05070a]/90 border border-slate-800/90 text-center mb-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <span className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-wider">
              {currentClue.category}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-2 leading-relaxed">
              "{currentClue.text}"
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Melyik élőlénycsoportra vagy csoportok metszetére érvényes ez az állítás?
            </p>
          </div>

          {/* Answer Zone Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(Object.keys(VENN_REGIONS) as VennRegionId[]).map((regId) => {
              const reg = VENN_REGIONS[regId];
              const isCorrectAnswer = regId === currentClue.correctRegion;
              const isUserSelection = selectedRegion === regId;

              let btnStyle =
                'bg-[#0f172a]/70 border-slate-700/70 hover:bg-[#15203b] hover:border-slate-500 text-slate-100 shadow-sm';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle =
                    'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]';
                } else if (isUserSelection && !isCorrectAnswer) {
                  btnStyle =
                    'bg-rose-950/80 border-rose-400 text-rose-100 ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                } else {
                  btnStyle = 'opacity-40 bg-[#05070a] border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={regId}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(regId)}
                  className={`p-3.5 rounded-xl border font-medium text-sm flex items-center justify-between transition-all text-left cursor-pointer ${btnStyle}`}
                >
                  <div>
                    <span className="block font-bold">{reg.label}</span>
                    <span className="text-xs text-slate-400">{reg.shortName}</span>
                  </div>

                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isUserSelection && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs text-slate-300">
                <strong className="text-cyan-300 block mb-0.5 font-bold font-mono">
                  Indoklás:
                </strong>
                {currentClue.explanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <span>{currentIndex < shuffledClues.length - 1 ? 'Következő' : 'Eredmények'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished State */
        <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.4)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <Trophy className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Biológiai Szkenner Eredmény {detectiveName ? `• ${detectiveName}` : ''}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">Labor Szkenner Vizsgálat Befejezve!</h3>
            <p className="text-sm text-slate-400 mt-1">
              Gratulálunk a biológiai nyomozási gyorsszkennelés teljesítéséhez!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400">Végső Pontszám:</span>
              <span className="text-2xl font-bold text-emerald-400 block mt-1 font-mono">
                {score}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400">Legnagyobb Streak:</span>
              <span className="text-2xl font-bold text-amber-400 block mt-1 font-mono">
                {maxStreak}x
              </span>
            </div>
          </div>

          <button
            onClick={startNewGame}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-sm inline-flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Új Gyors Szkenner Futam</span>
          </button>
        </div>
      )}
    </div>
  );
};
