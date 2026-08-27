import React, { useState, useEffect } from 'react';
import labBgImage from '../assets/images/biology_lab_bg_1787840733818.jpg';
import { ShieldAlert, User, Play, Sparkles, Award, CheckCircle2, Lock, Volume2, VolumeX } from 'lucide-react';
import { startAlarmSound, stopAlarmSound, isSoundEnabled } from '../utils/audio';

interface DetectiveProfileModalProps {
  isOpen: boolean;
  currentName: string;
  onSaveAndStart: (name: string) => void;
  onClose?: () => void;
}

export const DetectiveProfileModal: React.FC<DetectiveProfileModalProps> = ({
  isOpen,
  currentName,
  onSaveAndStart,
}) => {
  const [name, setName] = useState<string>(currentName || '');
  const [touched, setTouched] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Auto-play audio when modal is opened
  useEffect(() => {
    if (!isOpen) return;

    if (!isAudioMuted && isSoundEnabled()) {
      startAlarmSound(0.12);
    }

    // Handle browser autoplay policy by starting on first user interaction
    const handleFirstGesture = () => {
      if (!isAudioMuted && isSoundEnabled()) {
        startAlarmSound(0.12);
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      stopAlarmSound();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [isOpen, isAudioMuted]);

  useEffect(() => {
    setName(currentName || '');
  }, [currentName, isOpen]);

  if (!isOpen) return null;

  const isFormValid = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    stopAlarmSound();
    onSaveAndStart(name.trim());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300 overflow-hidden">
      {/* Background Biological Wallpaper and Ambient Schematics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <img
          src={labBgImage}
          alt="Biológiai Laboratórium"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-screen filter saturate-150 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/75 to-[#05070a]/90" />
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />

        {/* Large Decorative DNA Vector Overlay in Backdrop */}
        <svg className="absolute inset-0 w-full h-full opacity-20 hidden sm:block">
          <g transform="translate(60, 100)">
            <path
              d="M 20 0 Q 60 50 20 100 T 20 200 T 20 300 T 20 400 T 20 500"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 60 0 Q 20 50 60 100 T 60 200 T 60 300 T 60 400 T 60 500"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </g>
          {/* Top Right Plant Cell */}
          <g transform="translate(1000, 80)">
            <polygon
              points="50,0 120,0 160,50 120,100 50,100 10,50"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <ellipse cx="85" cy="50" rx="30" ry="20" fill="none" stroke="#06b6d4" strokeWidth="1" />
            <circle cx="85" cy="50" r="8" fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Main Dossier Card */}
      <div className="relative w-full max-w-xl bg-[#0a0f1e]/95 border border-cyan-500/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-xl">
        
        {/* Subtle In-Card Biological Schematic Watermark */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 translate-x-12 translate-y-12">
          <svg width="260" height="260" viewBox="0 0 200 200">
            {/* Plant & Cell Schematic */}
            <polygon points="50,10 150,10 190,80 150,150 50,150 10,80" fill="none" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="100" cy="80" r="40" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="80" r="15" fill="#a855f7" />
          </svg>
        </div>

        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-emerald-500/20 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-mono tracking-widest text-amber-400 font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Laboratóriumi Beléptetés • Rendszerriasztás
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Nyomozó adatlapja</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  BIO-LAB DOSSIER
                </span>
              </h2>
            </div>
          </div>

          {/* Audio Mute/Unmute quick button in Header */}
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
              isAudioMuted
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
            }`}
            title={isAudioMuted ? 'Riasztási hang bekapcsolása' : 'Riasztási hang némítása'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-rose-400" />
            )}
            <span className="hidden sm:inline text-[10px]">
              {isAudioMuted ? 'Néma' : 'Sziréna'}
            </span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-5 text-slate-200 relative z-10">
          {/* Emergency Briefing Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#05070a]/90 border border-slate-800/90 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              <span className="text-xl mr-1.5">🚨</span>
              <strong className="text-amber-300 font-bold">Vészhelyzet a biológiai laborban!</strong> Összekeveredtek az élőlények tulajdonságai. A labor rendszere csak akkor indítható újra, ha minden biológiai nyomot a megfelelő helyre rendezel.
            </p>
            <p className="text-xs text-cyan-300 font-semibold mt-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>A nyomozás indításához kérjük töltsd ki a nyomozói adatlapot!</span>
            </p>
          </div>

          {/* Form Fields Dossier Card */}
          <div className="p-5 rounded-2xl bg-[#05070a]/95 border border-cyan-500/30 space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Azonosítási Adatok
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                * Kötelező mező
              </span>
            </div>

            {/* Name Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="detective-name-input" className="block text-xs font-bold text-slate-200 font-mono flex items-center justify-between">
                <span>Név: <span className="text-rose-400 font-bold">*</span></span>
                {isFormValid && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Kitöltve
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  id="detective-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!touched) setTouched(true);
                  }}
                  onBlur={() => setTouched(true)}
                  placeholder="pl. Kovács Anna"
                  autoFocus
                  required
                  className={`w-full bg-[#0a0f1e] border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner font-medium ${
                    isFormValid
                      ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30'
                      : touched && !isFormValid
                      ? 'border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
                  }`}
                />
              </div>

              {!isFormValid && touched && (
                <p className="text-xs text-rose-400 flex items-center gap-1 font-medium mt-1">
                  <span>⚠️ Kérjük, add meg a neved a folytatáshoz!</span>
                </p>
              )}
            </div>

            {/* Detective Level Preview */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Kezdő nyomozói besorolás:</span>
              </div>
              <span className="font-mono font-bold text-amber-300">🕵️ Kezdő nyomozó (0 XP)</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={!isFormValid}
              id="start-game-button"
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md ${
                isFormValid
                  ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 hover:brightness-110 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer active:scale-[0.99]'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
              }`}
            >
              {isFormValid ? (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Játék indítása</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Játék indítása (Név megadása kötelező)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

