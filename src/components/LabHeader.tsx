import React from 'react';
import { Microscope, Volume2, VolumeX, RefreshCw, BookOpen, ShieldCheck, Sparkles, Zap, Award } from 'lucide-react';
import { GameMode } from '../types';

interface LabHeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onOpenStory: () => void;
  onOpenProfile?: () => void;
  detectiveName?: string;
  solvedCount: number;
  totalCount: number;
  score?: number;
  isSubmitted: boolean;
}

export const LabHeader: React.FC<LabHeaderProps> = ({
  currentMode,
  onSelectMode,
  soundOn,
  onToggleSound,
  onReset,
  onOpenStory,
  onOpenProfile,
  detectiveName,
  solvedCount,
  totalCount,
  score,
  isSubmitted,
}) => {
  return (
    <header className="bg-[#0a0f1e]/90 border-b border-slate-800/90 backdrop-blur-xl text-white shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="relative p-2.5 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-cyan-950/80 border border-emerald-500/40 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] text-emerald-400">
              <Microscope className="w-7 h-7 animate-pulse text-cyan-300" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-[#0a0f1e] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Biológiai nyomozó
                </h1>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                  Labor v2.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Titkos Laboratórium • Állatok, Virágos növények & Gombák halmazábrás nyomozása
              </p>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="flex items-center gap-2.5 flex-wrap justify-end w-full md:w-auto">
            {/* Detective Profile Badge */}
            {detectiveName && (
              <button
                onClick={onOpenProfile}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
                title="Nyomozói adatlap megtekintése és szerkesztése"
              >
                <span>🕵️ Nyomozó: <span className="text-white font-mono">{detectiveName}</span></span>
              </button>
            )}

            {/* Story Briefing Button */}
            <button
              onClick={onOpenStory}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer"
              title="Vészhelyzet és Történet megtekintése"
            >
              <span>🚨 Vészhelyzet Info</span>
            </button>

            {/* Mode Badge */}
            <div className="flex items-center gap-2 bg-[#05070a]/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-sm shadow-inner">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-xs">Mód:</span>
              <span className="font-mono font-bold text-amber-300 text-xs">
                Gyors Labor Szkenner
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                soundOn
                  ? 'bg-[#0f172a] border-slate-700 text-cyan-400 hover:bg-[#1e293b] shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-[#0f172a] border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundOn ? 'Hanghatások bekapcsolva' : 'Hanghatások némítva'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/80 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Tábla alaphelyzetbe állítása"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Újrakezdés</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectMode('speed_scanner')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              currentMode === 'speed_scanner'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-bold'
                : 'bg-[#0f172a]/80 text-slate-300 hover:bg-[#1e293b] hover:text-white border border-slate-700/60'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Gyors Labor Szkenner</span>
          </button>

          <button
            onClick={() => onSelectMode('handbook')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              currentMode === 'handbook'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-bold'
                : 'bg-[#0f172a]/80 text-slate-300 hover:bg-[#1e293b] hover:text-white border border-slate-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Nyomozati Kézikönyv & Tudástár</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
