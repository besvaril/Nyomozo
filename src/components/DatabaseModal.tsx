import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  RefreshCw,
  Trophy,
  Users,
  Copy,
  Check,
  Code,
  Sparkles,
  Award,
  Clock,
  Shield,
  GraduationCap,
  FileSpreadsheet
} from 'lucide-react';
import { fetchLeaderboard, fetchGameSessions } from '../lib/storage';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
  currentRole?: string;
  currentClassCode?: string;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
  currentRole,
  currentClassCode,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'sessions' | 'sql'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [boardData, sessData] = await Promise.all([
        fetchLeaderboard(),
        fetchGameSessions(),
      ]);
      setLeaderboard(boardData);
      setSessions(sessData);
      setConnectionStatus('connected');
    } catch (e) {
      console.warn('Error loading data from Supabase:', e);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sqlCode = `-- ==============================================================================
-- 🧬 BIOLÓGIAI NYOMOZO - SUPABASE POSTGRESQL TÁBLÁK ÉS BIZTONSÁGI SZABÁLYOK
-- Futtasd le ezt a Supabase Dashboard -> SQL Editor felületén!
-- ==============================================================================

-- 1. Felhasználói profilok tábla (Felhasználónév, Szerepkör, Osztály, Összpontszám)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'detective' NOT NULL, -- 'detective' (diák) vagy 'teacher' (tanár)
    class_code TEXT DEFAULT '',            -- Osztály azonosító (pl. 7.A, 8.B)
    total_score INTEGER DEFAULT 0 NOT NULL,-- Összesített pontszám
    rank_achieved TEXT DEFAULT 'Kezdő nyomozó',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Játékkörök és Kitöltések tábla (Felhasználónév, Szerepkör, Osztály, Pontszám, Kitöltési idő)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    role TEXT DEFAULT 'detective',
    class_code TEXT DEFAULT '',
    total_score INTEGER DEFAULT 0 NOT NULL,
    correct_count INTEGER DEFAULT 0 NOT NULL,
    wrong_count INTEGER DEFAULT 0 NOT NULL,
    accuracy_percentage NUMERIC(5,2) DEFAULT 0.00,
    max_streak INTEGER DEFAULT 0,
    rank_achieved TEXT DEFAULT '',
    completion_time_seconds INTEGER DEFAULT 0, -- Kitöltési idő másodpercben
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Feladatonkénti részletes pontszámok tábla (Minden állításra adott válasz és idő)
CREATE TABLE IF NOT EXISTS public.task_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    clue_id INTEGER NOT NULL,
    clue_text TEXT NOT NULL,
    chosen_region TEXT NOT NULL,
    correct_region TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_awarded INTEGER DEFAULT 0 NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,      -- Válaszidő az adott feladatra
    streak_count INTEGER DEFAULT 0,
    session_id TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexek a gyorsabb lekérdezésekhez
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles (username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_total_score ON public.user_profiles (total_score DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_username ON public.game_sessions (username);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_scores_username ON public.task_scores (username);

-- RLS (Row Level Security) engedélyezése
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_scores ENABLE ROW LEVEL SECURITY;

-- Anonim olvasási és írási szabályok (diákok számára közvetlen hozzáféréssel)
DROP POLICY IF EXISTS "Allow public read access on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow public read access on user_profiles" ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow public insert on user_profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on user_profiles" ON public.user_profiles;
CREATE POLICY "Allow public update on user_profiles" ON public.user_profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read access on game_sessions" ON public.game_sessions;
CREATE POLICY "Allow public read access on game_sessions" ON public.game_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on game_sessions" ON public.game_sessions;
CREATE POLICY "Allow public insert on game_sessions" ON public.game_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on task_scores" ON public.task_scores;
CREATE POLICY "Allow public read access on task_scores" ON public.task_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on task_scores" ON public.task_scores;
CREATE POLICY "Allow public insert on task_scores" ON public.task_scores FOR INSERT WITH CHECK (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0f1e] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#070b16]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Supabase Felhő Adatbázis & Eredmények
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : connectionStatus === 'testing'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {connectionStatus === 'connected'
                    ? '● Élő Kapcsolat'
                    : connectionStatus === 'testing'
                    ? '○ Kapcsolódás...'
                    : '⚠ Helyi Mód'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Felhasználók, osztályok, elért pontszámok és kitöltési idők
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-3 bg-[#05070a] border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Nyomozói Ranglista ({leaderboard.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sessions'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Kitöltések & Idők ({sessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Supabase SQL Kód</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Frissítés</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Összesített pontszámok felhasználónként</span>
                <span className="font-mono">Supabase projekt: jcofukpxhezhvzaonfxe</span>
              </div>

              {leaderboard.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#05070a] border border-slate-800 text-center text-slate-400 text-sm">
                  Még nem érkezett pontszám. Tölts ki egy tesztet a pontgyűjtéshez!
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-[#05070a] overflow-hidden">
                  {leaderboard.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 sm:p-4 flex items-center justify-between gap-3 ${
                        item.username?.toLowerCase() === currentUsername?.toLowerCase()
                          ? 'bg-emerald-950/20 border-l-2 border-emerald-400'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : idx === 1
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                              : idx === 2
                              ? 'bg-amber-700/20 text-amber-400 border border-amber-600/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{item.username}</span>
                            {item.class_code && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-mono">
                                🏫 {item.class_code}
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                              {item.role === 'teacher' ? 'Tanár' : 'Diák'}
                            </span>
                          </div>
                          {item.rank_achieved && (
                            <span className="text-xs text-slate-400 mt-0.5 block">
                              🏅 {item.rank_achieved}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                          {item.total_score || 0} pont
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Legutóbbi befejezett futamok és kitöltési idők</span>
                <span className="font-mono">Részletes adatok</span>
              </div>

              {sessions.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#05070a] border border-slate-800 text-center text-slate-400 text-sm">
                  Még nincsenek befejezett játékkörök.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-[#05070a] overflow-hidden">
                  {sessions.map((sess, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{sess.username}</span>
                          {sess.class_code && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-mono">
                              🏫 {sess.class_code}
                            </span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {sess.rank_achieved || 'Kitöltő'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Helyes: <strong className="text-emerald-400">{sess.correct_count}</strong> | Hibás: <strong className="text-rose-400">{sess.wrong_count}</strong> ({sess.accuracy_percentage}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block flex items-center sm:justify-end gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {sess.completion_time_seconds ? `${sess.completion_time_seconds} mp` : 'N/A'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {sess.created_at ? new Date(sess.created_at).toLocaleTimeString('hu-HU') : ''}
                          </span>
                        </div>

                        <span className="text-base font-bold text-emerald-400 font-mono min-w-[70px]">
                          +{sess.total_score} pont
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Supabase SQL Séma</h3>
                  <p className="text-xs text-slate-400">
                    Másold ki és futtasd le a Supabase kezelőfelületén a táblák automatikus létrehozásához.
                  </p>
                </div>

                <button
                  onClick={copySql}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kimásolva!' : 'SQL másolása'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#05070a] border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed select-all">
                {sqlCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
