import { UserProfile, UserRole, TaskScoreRecord, GameSessionRecord } from '../types';
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_PROFILES = 'bio_user_profiles';
const LOCAL_STORAGE_SESSIONS = 'bio_game_sessions';
const LOCAL_STORAGE_TASKS = 'bio_task_scores';

function getLocalProfiles(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalProfile(profile: UserProfile) {
  try {
    const profiles = getLocalProfiles();
    profiles[profile.username.toLowerCase()] = profile;
    localStorage.setItem(LOCAL_STORAGE_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Local storage write failed:', e);
  }
}

/**
 * Lekéri vagy létrehozza a felhasználói profilt közvetlenül a Supabase adatbázisban (Vercel-kompatibilis).
 */
export async function getOrCreateUserProfile(
  username: string,
  role: UserRole = 'detective',
  classCode: string = ''
): Promise<UserProfile> {
  const cleanName = (username || '').trim() || 'Nyomozó';
  const localProfiles = getLocalProfiles();
  const cached = localProfiles[cleanName.toLowerCase()];

  try {
    // 1. Lekérdezés a Supabase-ből
    const { data: existing, error: selectErr } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('username', cleanName)
      .maybeSingle();

    if (!selectErr && existing) {
      const prof: UserProfile = {
        username: existing.username,
        role: existing.role as UserRole,
        class_code: existing.class_code || classCode,
        total_score: existing.total_score || 0,
        rank_achieved: existing.rank_achieved || 'Kezdő nyomozó',
      };
      saveLocalProfile(prof);
      return prof;
    }

    // 2. Ha még nem létezik, létrehozzuk
    const newProfileData = {
      username: cleanName,
      role: role || 'detective',
      class_code: classCode || '',
      total_score: 0,
      rank_achieved: 'Kezdő nyomozó',
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('user_profiles')
      .insert([newProfileData])
      .select()
      .maybeSingle();

    if (!insertErr && inserted) {
      const prof: UserProfile = {
        username: inserted.username,
        role: inserted.role as UserRole,
        class_code: inserted.class_code,
        total_score: inserted.total_score,
        rank_achieved: inserted.rank_achieved,
      };
      saveLocalProfile(prof);
      return prof;
    }
  } catch (err) {
    console.warn('Supabase profile query failed, using fallback:', err);
  }

  // Fallback ha offline vagy hálózati hiba lép fel
  const fallbackProfile: UserProfile = cached || {
    username: cleanName,
    role,
    class_code: classCode,
    total_score: 0,
    rank_achieved: 'Kezdő nyomozó',
  };
  saveLocalProfile(fallbackProfile);
  return fallbackProfile;
}

/**
 * Lekéri a felhasználó statisztikáit közvetlenül a Supabase-ből.
 */
export async function getUserStats(
  username: string
): Promise<{ totalScore: number; tasksCount: number; classCode?: string; role?: UserRole }> {
  if (!username || !username.trim()) {
    return { totalScore: 0, tasksCount: 0 };
  }
  const cleanName = username.trim();

  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_score, class_code, role')
      .ilike('username', cleanName)
      .maybeSingle();

    const { count } = await supabase
      .from('task_scores')
      .select('*', { count: 'exact', head: true })
      .ilike('username', cleanName);

    if (profile) {
      return {
        totalScore: profile.total_score || 0,
        tasksCount: count || 0,
        classCode: profile.class_code,
        role: profile.role as UserRole,
      };
    }
  } catch (err) {
    console.warn('getUserStats error:', err);
  }

  const cached = getLocalProfiles()[cleanName.toLowerCase()];
  return {
    totalScore: cached?.total_score || 0,
    tasksCount: 0,
    classCode: cached?.class_code,
    role: cached?.role,
  };
}

/**
 * Elmenti a részletes feladateredményt és növeli a felhasználó összpontszámát.
 */
export async function saveTaskScore(
  record: Omit<TaskScoreRecord, 'id' | 'created_at'> & { created_at?: string }
): Promise<{ success: boolean; newTotalScore?: number }> {
  const cleanName = (record.username || '').trim();
  if (!cleanName) return { success: false };

  try {
    // 1. Feladat pontszám mentése
    await supabase.from('task_scores').insert([
      {
        username: cleanName,
        clue_id: record.clue_id,
        clue_text: record.clue_text,
        chosen_region: record.chosen_region,
        correct_region: record.correct_region,
        is_correct: record.is_correct,
        points_awarded: record.points_awarded,
        time_spent_seconds: record.time_spent_seconds || 0,
        streak_count: record.streak_count || 0,
        session_id: record.session_id || '',
        created_at: record.created_at || new Date().toISOString(),
      },
    ]);

    // 2. Összesített pontszám frissítése a profilban
    if (record.is_correct && record.points_awarded > 0) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('total_score')
        .ilike('username', cleanName)
        .maybeSingle();

      const newScore = (profile?.total_score || 0) + record.points_awarded;

      await supabase
        .from('user_profiles')
        .update({
          total_score: newScore,
          updated_at: new Date().toISOString(),
        })
        .ilike('username', cleanName);

      return { success: true, newTotalScore: newScore };
    }

    return { success: true };
  } catch (err) {
    console.warn('saveTaskScore direct Supabase error:', err);
    return { success: false };
  }
}

/**
 * Elmenti a lezárult játékkört és kitöltési időt a Supabase-be.
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
    const sessionData = {
      username: cleanName,
      role: session.role || 'detective',
      class_code: session.class_code || '',
      total_score: session.total_score,
      correct_count: session.correct_count,
      wrong_count: session.wrong_count,
      accuracy_percentage: session.accuracy_percentage,
      max_streak: session.max_streak,
      rank_achieved: session.rank_achieved || '',
      completion_time_seconds: session.completion_time_seconds || 0,
      created_at: session.created_at || new Date().toISOString(),
    };

    // 1. Session beszúrása
    await supabase.from('game_sessions').insert([sessionData]);

    // 2. Felhasználói profil rang és pontszám frissítése
    await supabase
      .from('user_profiles')
      .update({
        total_score: session.total_score,
        rank_achieved: session.rank_achieved || 'Kezdő nyomozó',
        class_code: session.class_code || '',
        updated_at: new Date().toISOString(),
      })
      .ilike('username', cleanName);

    // Helyi mentés biztonsági másolatként
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(sessionData);
      localStorage.setItem(LOCAL_STORAGE_SESSIONS, JSON.stringify(list.slice(0, 50)));
    } catch {
      // Ignore local storage error
    }

    return { success: true };
  } catch (err) {
    console.warn('saveGameSession direct Supabase error:', err);
    return { success: false };
  }
}

/**
 * Lekéri az összesített ranglistát közvetlenül a Supabase-ből (Vercel-kompatibilis).
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
    const { data, error } = await supabase
      .from('user_profiles')
      .select('username, role, class_code, total_score, rank_achieved, updated_at')
      .order('total_score', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('fetchLeaderboard direct Supabase error:', e);
  }

  // Fallback helyi profilokból
  try {
    const local = Object.values(getLocalProfiles());
    if (local.length > 0) {
      return local
        .map((p) => ({
          username: p.username,
          role: p.role,
          class_code: p.class_code,
          total_score: p.total_score,
          rank_achieved: p.rank_achieved,
        }))
        .sort((a, b) => b.total_score - a.total_score);
    }
  } catch {
    // Ignore
  }

  return [];
}

/**
 * Lekéri a legutóbbi futamokat és kitöltési időket a Supabase-ből.
 */
export async function fetchGameSessions(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('fetchGameSessions direct Supabase error:', e);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
