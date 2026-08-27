import React, { useState } from 'react';
import { GameMode } from './types';
import { WORKSHEET_CLUES, EXTENDED_CLUES } from './data/clues';
import { LabHeader } from './components/LabHeader';
import { DetectiveHandbook } from './components/DetectiveHandbook';
import { SpeedQuizMode } from './components/SpeedQuizMode';
import { DetectiveProfileModal } from './components/DetectiveProfileModal';
import { StoryIntroModal } from './components/StoryIntroModal';
import { BiologyBackground } from './components/BiologyBackground';
import {
  isSoundEnabled,
  setSoundEnabled,
} from './utils/audio';

const STORAGE_NAME_KEY = 'biologiai_nyomozo_nev';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('speed_scanner');
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [detectiveName, setDetectiveName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_NAME_KEY) || '';
    } catch {
      return '';
    }
  });
  const [showProfileModal, setShowProfileModal] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(STORAGE_NAME_KEY);
    } catch {
      return true;
    }
  });
  const [showStoryIntro, setShowStoryIntro] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  // All clues for the rapid scanner
  const allClues = [...WORKSHEET_CLUES, ...EXTENDED_CLUES];

  // Audio toggle
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  // Save profile and start
  const handleSaveProfileAndStart = (name: string) => {
    setDetectiveName(name);
    try {
      localStorage.setItem(STORAGE_NAME_KEY, name);
    } catch {
      // ignore
    }
    setShowProfileModal(false);
    setCurrentMode('speed_scanner');
  };

  // Switch game mode
  const handleSelectMode = (mode: GameMode) => {
    setCurrentMode(mode);
  };

  // Reset current scanner session
  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Biological Laboratory Schematics & Ambient Background */}
      <BiologyBackground />

      {/* Top Header */}
      <div className="relative z-10">
        <LabHeader
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onReset={handleReset}
          onOpenStory={() => setShowStoryIntro(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          detectiveName={detectiveName}
          solvedCount={allClues.length}
          totalCount={allClues.length}
          isSubmitted={false}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 relative z-10">
        {currentMode === 'speed_scanner' && (
          <SpeedQuizMode
            key={resetKey}
            clues={allClues}
            detectiveName={detectiveName}
          />
        )}

        {currentMode === 'handbook' && <DetectiveHandbook />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0a0f1e]/80 backdrop-blur-md py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            „Biológiai nyomozó” • Gyors Laboratóriumi Szkenner
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Állatok (Animalia) ∩ Virágos növények (Plantae) ∩ Gombák (Fungi)
          </span>
        </div>
      </footer>

      {/* Detective Profile Modal (Required before starting) */}
      <DetectiveProfileModal
        isOpen={showProfileModal}
        currentName={detectiveName}
        onSaveAndStart={handleSaveProfileAndStart}
        onClose={() => {
          if (detectiveName.trim()) {
            setShowProfileModal(false);
          }
        }}
      />

      {/* Story Introduction Modal (Emergency Alert) */}
      <StoryIntroModal
        isOpen={showStoryIntro}
        onClose={() => setShowStoryIntro(false)}
        onStartGame={() => {
          setShowStoryIntro(false);
          setCurrentMode('speed_scanner');
        }}
      />
    </div>
  );
}
