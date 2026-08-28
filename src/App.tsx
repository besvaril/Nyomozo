import React, { useState, useEffect } from 'react';
import { GameMode, UserRole, BiologicalClue } from './types';
import { WORKSHEET_CLUES, EXTENDED_CLUES } from './data/clues';
import { EmergencyHomeView } from './components/EmergencyHomeView';
import { DetectiveHandbook } from './components/DetectiveHandbook';
import { SpeedQuizMode } from './components/SpeedQuizMode';
import { DetectiveProfileModal } from './components/DetectiveProfileModal';
import { DatabaseModal } from './components/DatabaseModal';
import { BiologyBackground } from './components/BiologyBackground';
import { getOrCreateUserProfile, getUserStats } from './lib/storage';

// Deduplicated master list of all unique biological clues
const ALL_UNIQUE_CLUES: BiologicalClue[] = (() => {
  const seenIds = new Set<number>();
  const seenTexts = new Set<string>();
  const list: BiologicalClue[] = [];

  for (const clue of [...WORKSHEET_CLUES, ...EXTENDED_CLUES]) {
    const textKey = clue.text.trim().toLowerCase();
    if (!seenIds.has(clue.id) && !seenTexts.has(textKey)) {
      seenIds.add(clue.id);
      seenTexts.add(textKey);
      list.push(clue);
    }
  }
  return list;
})();

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('home');
  const [detectiveName, setDetectiveName] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('detective');
  const [classCode, setClassCode] = useState<string>('');
  const [userTotalScore, setUserTotalScore] = useState<number>(0);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  // All unique clues for the rapid scanner
  const allClues = ALL_UNIQUE_CLUES;

  // Fetch student stats when username or role changes
  useEffect(() => {
    if (detectiveName.trim()) {
      getUserStats(detectiveName.trim()).then((stats) => {
        setUserTotalScore(stats.totalScore);
      });
    }
  }, [detectiveName, resetKey]);

  // Save profile and start (Directly in Supabase)
  const handleSaveProfileAndStart = async (
    name: string,
    role: UserRole,
    classCodeInput?: string
  ) => {
    const trimmed = name.trim();
    setDetectiveName(trimmed);
    setUserRole(role);
    if (classCodeInput !== undefined) {
      setClassCode(classCodeInput);
    }

    // Save/fetch profile directly in Supabase
    try {
      const profile = await getOrCreateUserProfile(trimmed, role, classCodeInput);
      if (typeof profile.total_score === 'number') {
        setUserTotalScore(profile.total_score);
      }
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }

    setShowProfileModal(false);
    setCurrentMode('speed_scanner');
  };

  const handleScoreUpdated = (newTotalScore: number) => {
    setUserTotalScore(newTotalScore);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Biological Laboratory Schematics & Ambient Background */}
      <BiologyBackground />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 py-4 sm:py-6 relative z-10">
        {currentMode === 'home' && (
          <EmergencyHomeView
            currentName={detectiveName}
            currentRole={userRole}
            currentClassCode={classCode}
            userTotalScore={userTotalScore}
            onSaveAndStart={handleSaveProfileAndStart}
            onOpenDatabase={() => setShowDatabaseModal(true)}
          />
        )}

        {currentMode === 'speed_scanner' && (
          <SpeedQuizMode
            key={resetKey}
            clues={allClues}
            detectiveName={detectiveName}
            userRole={userRole}
            classCode={classCode}
            userTotalScore={userTotalScore}
            onScoreUpdated={handleScoreUpdated}
            onOpenDatabase={() => setShowDatabaseModal(true)}
            onGoHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'handbook' && <DetectiveHandbook />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0a0f1e]/80 backdrop-blur-md py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>„Biológiai nyomozó” • Supabase PostgreSQL Integráció</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDatabaseModal(true)}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] cursor-pointer"
            >
              Supabase SQL Kód & Ranglista megtekintése
            </button>
            <span className="text-slate-500 font-mono text-[11px]">
              Állatok ∩ Növények ∩ Gombák
            </span>
          </div>
        </div>
      </footer>

      {/* Unified Emergency Briefing & Detective Profile Starting Screen */}
      <DetectiveProfileModal
        isOpen={showProfileModal}
        currentName={detectiveName}
        currentRole={userRole}
        currentClassCode={classCode}
        onSaveAndStart={handleSaveProfileAndStart}
        onOpenDatabase={() => {
          setShowProfileModal(false);
          setShowDatabaseModal(true);
        }}
        onClose={() => {
          if (detectiveName.trim()) {
            setShowProfileModal(false);
          }
        }}
      />

      {/* Supabase Database & Leaderboard Modal */}
      <DatabaseModal
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        currentUsername={detectiveName}
        currentRole={userRole}
        currentClassCode={classCode}
      />
    </div>
  );
}
