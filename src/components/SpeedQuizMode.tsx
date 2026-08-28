import React, { useState, useEffect, useRef } from 'react';
import { BiologicalClue, VennRegionId, UserRole } from '../types';
import { VENN_REGIONS } from '../data/clues';
import { playCorrectSound, playWrongSound, playScanSound } from '../utils/audio';
import { getDetectiveRank } from '../utils/ranks';
import {
  Zap,
  Timer,
  Flame,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
  Award,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveTaskScore, saveGameSession } from '../lib/storage';

interface SpeedQuizModeProps {
  clues: BiologicalClue[];
  detectiveName?: string;
  userRole?: UserRole;
  classCode?: string;
  userTotalScore?: number;
  onScoreUpdated?: (newTotalScore: number) => void;
  onOpenDatabase?: () => void;
  onFinish?: () => void;
}

export const SpeedQuizMode: React.FC<SpeedQuizModeProps> = ({
  clues,
  detectiveName = 'Diák',
  userRole = 'student',
  classCode = '',
  userTotalScore = 0,
  onScoreUpdated,
  onOpenDatabase,
  onFinish,
}) => {
  const [shuffledClues, setShuffledClues] = useState<BiologicalClue[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<VennRegionId | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  const [lastAwardedPoints, setLastAwardedPoints] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => `sess-${Date.now()}`);

  const startTimeRef = useRef<number>(Date.now());
  const hasInitializedRef = useRef<boolean>(false);

  // Fisher-Yates strict shuffle to guarantee each unique clue appears exactly once
  const shuffleCluesOnce = (sourceClues: BiologicalClue[]) => {
    // Deduplicate by ID and text to guarantee absolute uniqueness
    const seen = new Set<number>();
    const uniquePool: BiologicalClue[] = [];
    for (const c of sourceClues) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        uniquePool.push(c);
      }
    }

    const array = [...uniquePool];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startNewGame = () => {
    const uniqueShuffled = shuffleCluesOnce(clues);
    setShuffledClues(uniqueShuffled);
    setCurrentIndex(0);
    setSelectedRegion(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(15);
    setIsFinished(false);
    setLastAwardedPoints(null);
    setSessionId(`sess-${Date.now()}`);
    startTimeRef.current = Date.now();
    playScanSound();
  };

  // Initialize once on mount
  useEffect(() => {
    if (!hasInitializedRef.current && clues.length > 0) {
      hasInitializedRef.current = true;
      startNewGame();
    }
  }, [clues.length]);

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
    if (isAnswered || isFinished || shuffledClues.length === 0) return;
    setIsAnswered(true);
    setStreak(0);
    setWrongCount((prev) => prev + 1);
    setLastAwardedPoints(0);
    playWrongSound();

    const currentClue = shuffledClues[currentIndex];
    // Save 0-point timeout attempt locally
    saveTaskScore({
      username: detectiveName,
      clue_id: currentClue.id,
      clue_text: currentClue.text,
      chosen_region: 'all_three',
      correct_region: currentClue.correctRegion,
      is_correct: false,
      points_awarded: 0,
      time_spent_seconds: 15,
      streak_count: 0,
      session_id: sessionId,
    });
  };

  const handleAnswer = async (regionId: VennRegionId) => {
    if (isAnswered || isFinished) return;

    setSelectedRegion(regionId);
    setIsAnswered(true);

    const currentClue = shuffledClues[currentIndex];
    const isCorrect = regionId === currentClue.correctRegion;
    const timeSpent = Math.max(1, 15 - timeLeft);

    let pointsAwarded = 0;
    if (isCorrect) {
      playCorrectSound();
      const newStreak = streak + 1;
      pointsAwarded = 1;
      setScore((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setLastAwardedPoints(1);
    } else {
      playWrongSound();
      setStreak(0);
      setWrongCount((prev) => prev + 1);
      setLastAwardedPoints(0);
    }

    // Save individual task score locally (1 point per correct answer)
    const saveResult = await saveTaskScore({
      username: detectiveName,
      clue_id: currentClue.id,
      clue_text: currentClue.text,
      chosen_region: regionId,
      correct_region: currentClue.correctRegion,
      is_correct: isCorrect,
      points_awarded: pointsAwarded,
      time_spent_seconds: timeSpent,
      streak_count: isCorrect ? streak + 1 : 0,
      session_id: sessionId,
    });

    if (onScoreUpdated && saveResult.newTotalScore) {
      onScoreUpdated(saveResult.newTotalScore);
    }
  };

  const handleNext = async () => {
    if (currentIndex < shuffledClues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedRegion(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setLastAwardedPoints(null);
      startTimeRef.current = Date.now();
      playScanSound();
    } else {
      setIsFinished(true);
      const totalQuestions = shuffledClues.length;
      const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
      const rank = getDetectiveRank(correctCount, totalQuestions);
      const totalTimeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

      // Save complete game session to Supabase database
      await saveGameSession({
        username: detectiveName,
        role: (userRole || 'detective') as UserRole,
        class_code: classCode,
        total_score: correctCount,
        correct_count: correctCount,
        wrong_count: wrongCount,
        accuracy_percentage: Number(accuracy.toFixed(2)),
        max_streak: maxStreak,
        rank_achieved: rank.title,
        completion_time_seconds: totalTimeSpentSeconds,
        created_at: new Date().toISOString(),
      });

      if (correctCount >= 11) {
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
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
      <div className="bg-[#0a0f1e]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Gyors Labor Szkenner
              </h2>
              {detectiveName && (
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  👤 {detectiveName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-mono">
              <span>
                Kérdés <strong className="text-cyan-300">{currentIndex + 1}</strong> / {shuffledClues.length}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                1x ismétlés nélkül
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-[#05070a] px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-bold text-amber-400 shadow-sm">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span className="font-mono">{streak}x</span>
          </div>

          {/* Session Score */}
          <div className="bg-emerald-950/80 border border-emerald-500/50 px-3 py-1.5 rounded-xl text-emerald-300 font-mono font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Futam: {score} pont
          </div>

          {/* User Total Score */}
          <div className="bg-amber-950/80 border border-amber-500/50 px-3 py-1.5 rounded-xl text-amber-300 font-mono font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Össz: {userTotalScore + score} pont</span>
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

          {/* Timer Clock & Database indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-cyan-400" />
              Hátralévő idő: <strong className="text-white font-mono text-sm">{timeLeft} mp</strong>
            </span>
            <span className="font-mono text-cyan-400">
              #{currentClue.id}. feladat
            </span>
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
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-cyan-300 font-bold font-mono">Indoklás:</strong>
                  {lastAwardedPoints !== null && lastAwardedPoints > 0 ? (
                    <span className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      💾 +{lastAwardedPoints} pont elmentve az adatbázisba!
                    </span>
                  ) : (
                    <span className="text-rose-400 font-mono font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                      0 pont
                    </span>
                  )}
                </div>
                {currentClue.explanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <span>{currentIndex < shuffledClues.length - 1 ? 'Következő feladat' : 'Eredmények mentése'}</span>
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
              Az összes feladat pontszáma és a futam eredménye elmentve a Supabase adatbázisba!
            </p>
          </div>

          {/* Rank Badge Banner */}
          {(() => {
            const finalRank = getDetectiveRank(correctCount, shuffledClues.length);
            return (
              <div className="p-4 rounded-2xl bg-[#05070a] border border-slate-800 max-w-lg mx-auto flex items-center justify-center gap-4">
                <span className="text-4xl">{finalRank.icon}</span>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    Elért nyomozói fokozat:
                  </span>
                  <span className={`inline-block text-sm font-bold px-3 py-0.5 rounded-full border mt-0.5 ${finalRank.badgeClass}`}>
                    {finalRank.title}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{finalRank.description}</p>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400">Futam Eredmény:</span>
              <span className="text-2xl font-bold text-emerald-400 block mt-1 font-mono">
                {score} / {shuffledClues.length} pont
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400">Legnagyobb Sorozat:</span>
              <span className="text-2xl font-bold text-amber-400 block mt-1 font-mono">
                {maxStreak}x
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070a] border border-amber-500/40 shadow-sm bg-amber-950/20">
              <span className="text-xs text-amber-300 font-semibold flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5" /> Új Összpontszám:
              </span>
              <span className="text-2xl font-black text-amber-300 block mt-1 font-mono">
                {userTotalScore + score} pont
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startNewGame}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Új Gyors Szkenner Futam</span>
            </button>

            {onOpenDatabase && (
              <button
                onClick={onOpenDatabase}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Diák Ranglista & Supabase Adatok</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
