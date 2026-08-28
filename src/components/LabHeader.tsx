import React from 'react';
import {
  Microscope,
  Volume2,
  VolumeX,
  RefreshCw,
  BookOpen,
  Zap,
  Award,
  Shield,
  ShieldAlert,
  Database,
} from 'lucide-react';
import { GameMode, UserRole } from '../types';

interface LabHeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onOpenStory: () => void;
  onOpenProfile?: () => void;
  onOpenDatabase?: () => void;
  detectiveName?: string;
  userRole?: UserRole;
  userTotalScore?: number;
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
  onOpenDatabase,
  detectiveName,
  userRole = 'detective',
  userTotalScore = 0,
}) => {
  const getRoleIcon = () => {
    switch (userRole) {
      case 'teacher':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'teacher':
        return 'Tanár';
      default:
        return 'Nyomozó';
    }
  };

  return (
    <header className="bg-[#0a0f1e]/90 border-b border-slate-800/90 backdrop-blur-xl text-white shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto">
            <div className="relative p-2.5 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-cyan-950/80 border border-emerald-500/40 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] text-emerald-400 shrink-0">
              <Microscope className="w-7 h-7 animate-pulse text-cyan-300" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-[#0a0f1e] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Biológiai nyomozó
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Titkos Laboratórium • Állatok, Virágos növények & Gombák halmazábrás nyomozása
              </p>
            </div>
          </div>

          {/* Controls, User Profile, Total Score */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-start lg:justify-end w-full lg:w-auto">
            {/* Total Score Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Össz: <strong className="text-amber-200 font-extrabold text-sm">{userTotalScore}</strong> pont</span>
            </div>

            {/* Detective/Student Profile Badge */}
            {detectiveName && (
              <button
                onClick={onOpenProfile}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
                title="Felhasználói profil és szerepkör szerkesztése"
              >
                {getRoleIcon()}
                <span>{getRoleLabel()}: <strong className="text-white font-mono">{detectiveName}</strong></span>
              </button>
            )}

            {/* Supabase Database & Leaderboard Button */}
            {onOpenDatabase && (
              <button
                onClick={onOpenDatabase}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
                title="Supabase Adatbázis, Kitöltési Idők és SQL séma"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adatbázis & Ranglista</span>
              </button>
            )}

            {/* Story & Profile Briefing Button */}
            <button
              onClick={onOpenProfile || onOpenStory}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer"
              title="Vészhelyzeti eligazítás & Nyomozó adatlapja"
            >
              <span>🚨 Vészhelyzet & Adatlap</span>
            </button>

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
              title="Laboratórium alaphelyzetbe állítása"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Újrakezdés</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectMode('home')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              currentMode === 'home'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] font-black'
                : 'bg-[#0f172a]/80 text-slate-300 hover:bg-[#1e293b] hover:text-white border border-slate-700/60'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${currentMode === 'home' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>🚨 Kezdőlap (Vészhelyzet & Adatlap)</span>
          </button>

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
        </nav>
      </div>
    </header>
  );
};
