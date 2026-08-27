import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Radio } from 'lucide-react';
import { startAlarmSound, stopAlarmSound } from '../utils/audio';

const AUDIO_TOTAL_DURATION_SEC = 45; // 00:45 matching the audio clip

export const EmergencyAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.15);
  const intervalRef = useRef<number | null>(null);

  // Play / Stop synchronization
  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    if (!isMuted) {
      startAlarmSound(volume);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    stopAlarmSound();
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (!isPlaying) {
      startPlayback();
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopAlarmSound();
    } else if (isPlaying) {
      startAlarmSound(volume);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
  };

  // Timer tick
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= AUDIO_TOTAL_DURATION_SEC) {
            stopPlayback();
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTime / AUDIO_TOTAL_DURATION_SEC) * 100);

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#0c1222] to-amber-950/30 border border-rose-500/30 shadow-lg relative overflow-hidden">
      {/* Background alarm pulse glow */}
      {isPlaying && (
        <div className="absolute inset-0 bg-rose-500/05 animate-pulse pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              isPlaying
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPlaying ? 'bg-rose-500 animate-ping' : 'bg-slate-500'
                }`}
              />
              Laboratóriumi Riasztás & Hangüzenet
            </span>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Vészhelyzeti Sziréna Hangfájl
            </h4>
          </div>
        </div>

        {/* Audio Waveform Animation Bars */}
        <div className="flex items-end gap-1 h-6 px-2 py-1 bg-slate-950/70 rounded-lg border border-slate-800/80">
          {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50, 85, 95].map((h, i) => (
            <div
              key={`bar-${i}`}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying
                  ? 'bg-gradient-to-t from-amber-500 to-rose-500 animate-pulse'
                  : 'bg-slate-700/60'
              }`}
              style={{
                height: isPlaying ? `${Math.max(20, (h * (0.5 + Math.sin(currentTime * 4 + i) * 0.5)))}%` : '25%',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Timeline Slider and Times */}
      <div className="space-y-1.5 mb-3">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={AUDIO_TOTAL_DURATION_SEC}
            step="0.5"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span className={isPlaying ? 'text-rose-300 font-bold' : ''}>
            {formatTime(currentTime)}
          </span>
          <span className="text-slate-400">
            {formatTime(AUDIO_TOTAL_DURATION_SEC)}
          </span>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/70">
        <div className="flex items-center gap-2">
          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Szünet</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Hangfájl lejátszása</span>
              </>
            )}
          </button>

          {/* Replay */}
          <button
            type="button"
            onClick={handleRestart}
            title="Újraindítás"
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMuteToggle}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title={isMuted ? 'Némítás feloldása' : 'Némítás'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            {isMuted ? 'Némítva' : 'Sziréna aktív'}
          </span>
        </div>
      </div>
    </div>
  );
};
