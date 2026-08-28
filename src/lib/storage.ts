import { UserProfile, UserRole, TaskScoreRecord, GameSessionRecord } from '../types';

/**
 * Lekéri vagy létrehozza a felhasználói profilt a backend proxy végponton keresztül (közvetlen Supabase írás/olvasás).
 */
export async function getOrCreateUserProfile(
  username: string,
  role: UserRole = 'detective',
  classCode: string = ''
): Promise<UserProfile> {
  const cleanName = (username || '').trim() || 'Nyomozó';

  try {
    const res = await fetch('/api/db/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanName, role, classCode }),
    });

    if (res.ok) {
      const data = await res.json();
      return data as UserProfile;
    }
  } catch (err) {
    console.error('getOrCreateUserProfile network error:', err);
  }

  return {
    username: cleanName,
    role,
    class_code: classCode,
    total_score: 0,
    rank_achieved: 'Kezdő nyomozó',
  };
}

/**
 * Lekéri a felhasználó statisztikáit a backend proxy végponton keresztül.
 */
export async function getUserStats(
  username: string
): Promise<{ totalScore: number; tasksCount: number; classCode?: string; role?: UserRole }> {
  if (!username || !username.trim()) {
    return { totalScore: 0, tasksCount: 0 };
  }
  const cleanName = username.trim();

  try {
    const res = await fetch(`/api/db/user-stats?username=${encodeURIComponent(cleanName)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('getUserStats network error:', err);
  }

  return { totalScore: 0, tasksCount: 0 };
}

/**
 * Elmenti a részletes feladateredményt és frissíti az összpontszámot.
 */
export async function saveTaskScore(
  record: Omit<TaskScoreRecord, 'id' | 'created_at'> & { created_at?: string }
): Promise<{ success: boolean; newTotalScore?: number }> {
  const cleanName = (record.username || '').trim();
  if (!cleanName) return { success: false };

  try {
    const res = await fetch('/api/db/task-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('saveTaskScore network error:', err);
  }
  return { success: false };
}

/**
 * Elmenti a lezárult játékkört és kitöltési időt.
 */
export async function saveGameSession(
  session: Omit<GameSessionRecord, 'id' | 'created_at'> & {
    created_at?: string;
    completion_time_seconds?: number;
    class_code?: string;
  }
): Promise<{ success: boolean }> {
  const cleanName = (session.username || '').trim();
  if (!cleanName) return { success: false };

  try {
    const res = await fetch('/api/db/game-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('saveGameSession network error:', err);
  }
  return { success: false };
}

/**
 * Lekéri az összesített ranglistát a backend API-n keresztül.
 */
export async function fetchLeaderboard(): Promise<
  Array<{
    username: string;
    role: string;
    class_code?: string;
    total_score: number;
    tasks_count?: number;
    rank_achieved?: string;
    updated_at?: string;
  }>
> {
  try {
    const res = await fetch('/api/db/leaderboard');
    if (res.ok) {
      const data = await res.json();
      return data || [];
    }
  } catch (e) {
    console.error('fetchLeaderboard network error:', e);
  }
  return [];
}

/**
 * Lekéri a legutóbbi futamokat és kitöltési időket a backend API-n keresztül.
 */
export async function fetchGameSessions(): Promise<any[]> {
  try {
    const res = await fetch('/api/db/sessions');
    if (res.ok) {
      const data = await res.json();
      return data || [];
    }
  } catch (e) {
    console.error('fetchGameSessions network error:', e);
  }
  return [];
}
