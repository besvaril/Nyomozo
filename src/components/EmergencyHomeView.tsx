import React, { useState, useEffect } from 'react';
import labBgImage from '../assets/images/biology_lab_bg_1787840733818.jpg';
import {
  ShieldAlert,
  User,
  Play,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  Volume2,
  VolumeX,
  Shield,
  BookOpen,
  Building,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { startAlarmSound, stopAlarmSound, isSoundEnabled } from '../utils/audio';
import { UserRole } from '../types';
import { getUserStats } from '../lib/storage';

interface EmergencyHomeViewProps {
  currentName: string;
  currentRole: UserRole;
  currentClassCode?: string;
  userTotalScore: number;
  onSaveAndStart: (username: string, role: UserRole, classCode?: string) => void;
  onGoToHandbook?: () => void;
  onOpenDatabase?: () => void;
}

export const EmergencyHomeView: React.FC<EmergencyHomeViewProps> = ({
  currentName,
  currentRole,
  currentClassCode = '',
  userTotalScore,
  onSaveAndStart,
  onOpenDatabase,
}) => {
  const [name, setName] = useState<string>(currentName || '');
  const [role, setRole] = useState<UserRole>(currentRole === 'teacher' ? 'teacher' : 'detective');
  const [classCode, setClassCode] = useState<string>(currentClassCode || '');
  const [touched, setTouched] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [loadedTotalScore, setLoadedTotalScore] = useState<number>(userTotalScore || 0);
  const [loadedTasksCount, setLoadedTasksCount] = useState<number>(0);

  // Sync props
  useEffect(() => {
    setName(currentName || '');
    setRole(currentRole === 'teacher' ? 'teacher' : 'detective');
    setClassCode(currentClassCode || '');
  }, [currentName, currentRole, currentClassCode]);

  // Query user's current score when username changes
  useEffect(() => {
    let isSubscribed = true;
    if (name.trim()) {
      getUserStats(name.trim()).then((stats) => {
        if (isSubscribed) {
          setLoadedTotalScore(stats.totalScore);
          setLoadedTasksCount(stats.tasksCount);
        }
      });
    } else {
      setLoadedTotalScore(userTotalScore || 0);
      setLoadedTasksCount(0);
    }
    return () => {
      isSubscribed = false;
    };
  }, [name, userTotalScore]);

  const isFormValid = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    stopAlarmSound();
    onSaveAndStart(name.trim(), role, classCode.trim() || undefined);
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (nextMuted) {
      stopAlarmSound();
    } else {
      startAlarmSound(0.12);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Main Glassmorphic Hero Container */}
      <div className="relative bg-[#0a0f1e]/90 border border-cyan-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
        
        {/* Background Biological Wallpaper */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <img
            src={labBgImage}
            alt="Biológiai Laboratórium"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-15 mix-blend-screen filter saturate-150 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/85 to-[#0a0f1e]/95" />
          
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        {/* Top Header Alert Strip */}
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-cyan-500/20 border-b border-cyan-500/30 px-5 sm:px-8 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-mono tracking-widest text-amber-400 font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Rendszerriasztás • Központi Kezdőlap
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Vészhelyzet a laborban! • Nyomozó Adatlapja</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute/Unmute button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
                isAudioMuted
                  ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
              }`}
              title={isAudioMuted ? 'Riasztási sziréna bekapcsolása' : 'Riasztási sziréna némítása'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-rose-400" />
              )}
              <span className="hidden sm:inline text-xs font-bold">
                {isAudioMuted ? 'Néma' : 'Sziréna'}
              </span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="p-5 sm:p-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN: Story Briefing & Ranking (7 cols) */}
            <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
              
              {/* Emergency Banner */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#05070a]/90 border border-amber-500/40 relative overflow-hidden shadow-inner space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">🚨</span>
                  <h3 className="text-lg sm:text-xl font-bold text-amber-300">
                    Összekeveredtek az élőlények tulajdonságai!
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  A titkos biológiai laboratórium központi adatbázisában egy incidens miatt felcserélődtek az <strong>állatok</strong>, <strong>virágos növények</strong> és <strong>gombák</strong> kulcsfontosságú jellemzői. A rendszer csak akkor indítható újra, ha az összes biológiai nyomot a megfelelő Venn-halmazba és metszetbe rendezed!
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs text-cyan-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Válassz szerepkört, add meg a neved, és hárítsd el a vészhelyzetet!</span>
                </div>
              </div>

              {/* Detective Ranks Bar */}
              <div className="p-4 rounded-2xl bg-[#05070a] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 uppercase font-mono tracking-wider font-bold text-[11px] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Elérhető Nyomozói Szintek & Ponthatárok:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">18 állítás összesen</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
                    <span className="block font-bold text-amber-300 text-sm">🕵️ 0–5 p</span>
                    <span className="text-slate-300 font-semibold text-xs mt-0.5">Kezdő</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
                    <span className="block font-bold text-emerald-300 text-sm">🧬 6–10 p</span>
                    <span className="text-slate-300 font-semibold text-xs mt-0.5">Haladó</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
                    <span className="block font-bold text-cyan-300 text-sm">🔬 11–15 p</span>
                    <span className="text-slate-300 font-semibold text-xs mt-0.5">Kutató</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/40 shadow-sm flex flex-col justify-center">
                    <span className="block font-bold text-amber-200 text-sm">🏆 16–18 p</span>
                    <span className="text-amber-300 font-bold text-xs mt-0.5">Mester</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation to Supabase Database */}
              {onOpenDatabase && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenDatabase}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  >
                    <span>📊 Központi Nyomozói Ranglista & Supabase Adatbázis Megnyitása</span>
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Detective Profile & Registration Form (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-6 rounded-2xl bg-[#05070a]/95 border border-cyan-500/30 space-y-4 shadow-xl flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                        Nyomozói Adatlap & Belépés
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      * Kötelező
                    </span>
                  </div>

                  {/* Username Input Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="home-detective-username"
                      className="block text-xs font-bold text-slate-200 font-mono flex items-center justify-between"
                    >
                      <span>Felhasználónév / Nyomozó neve: <span className="text-rose-400 font-bold">*</span></span>
                      {isFormValid && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Érvényes név
                        </span>
                      )}
                    </label>

                    <input
                      id="home-detective-username"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!touched) setTouched(true);
                      }}
                      onBlur={() => setTouched(true)}
                      placeholder="pl. Kovács Anna vagy Nyomozo_01"
                      required
                      className={`w-full bg-[#0a0f1e] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner font-medium ${
                        isFormValid
                          ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30'
                          : touched && !isFormValid
                          ? 'border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30'
                          : 'border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
                      }`}
                    />
                  </div>

                  {/* Role Selection (Only 2 roles: Detective & Teacher) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-200 font-mono">
                      Szerepkör (Role): <span className="text-rose-400 font-bold">*</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Detective */}
                      <button
                        type="button"
                        onClick={() => setRole('detective')}
                        className={`p-3 rounded-xl border text-left flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          role === 'detective'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold font-mono">Nyomozó</span>
                      </button>

                      {/* Teacher */}
                      <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`p-3 rounded-xl border text-left flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          role === 'teacher'
                            ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold font-mono">Tanár</span>
                      </button>
                    </div>
                  </div>

                  {/* Class Code (Optional) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="home-detective-class-code"
                      className="block text-xs font-bold text-slate-300 font-mono flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        Osztály / Csoportkód:
                      </span>
                      <span className="text-[10px] text-slate-500">pl. 7.A</span>
                    </label>
                    <input
                      id="home-detective-class-code"
                      type="text"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                      placeholder="pl. 7.A vagy Biológia Szakkör"
                      className="w-full bg-[#0a0f1e] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                    />
                  </div>

                  {/* Existing Total Score Badge */}
                  <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Tárolt összpontszám:</span>
                    </div>
                    <span className="font-mono font-extrabold text-amber-300 text-sm">
                      {loadedTotalScore} pont {loadedTasksCount > 0 ? `(${loadedTasksCount} db)` : ''}
                    </span>
                  </div>
                </div>

                {/* Start Nyomozás Button */}
                <div className="pt-3 space-y-2 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    id="start-investigation-main-button"
                    className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                      isFormValid
                        ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 hover:brightness-110 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer active:scale-[0.99]'
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isFormValid ? (
                      <>
                        <Play className="w-5 h-5 fill-slate-950" />
                        <span>Készen állok a nyomozásra!</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>Név megadása szükséges</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
