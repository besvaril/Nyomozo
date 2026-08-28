-- ========================================================================
-- BIOLÓGIAI NYOMOZO - SUPABASE ADATBÁZIS SÉMA (POSTGRESQL)
-- ========================================================================
-- Másold be ezt az SQL kódot a Supabase vezérlőpult 'SQL Editor' menüpontjába,
-- majd kattints a 'Run' gombra az adatbázis táblák és nézetek létrehozásához.

-- 1. Profilok (Diákok, Nyomozók, Tanárok) tábla
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'detective', 'teacher')),
    class_code TEXT, -- pl. '7.A', 'Biológia szakkör'
    total_score INTEGER NOT NULL DEFAULT 0,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Feladatok / Nyomok (Tasks) tábla (opcionális referenciatábla)
CREATE TABLE IF NOT EXISTS public.tasks (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    correct_region TEXT NOT NULL,
    explanation TEXT
);

-- 3. Feladatonkénti pontszámok és válaszok (Task Scores / Question Attempts) tábla
CREATE TABLE IF NOT EXISTS public.task_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    clue_id INTEGER NOT NULL,
    clue_text TEXT NOT NULL,
    chosen_region TEXT NOT NULL,
    correct_region TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Teljes játék menetek / Munkamenetek (Game Sessions) tábla
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    total_score INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    wrong_count INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    max_streak INTEGER NOT NULL DEFAULT 0,
    rank_achieved TEXT NOT NULL DEFAULT 'Kezdő nyomozó',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Automatikus trigger az összpontszám frissítésére a profiles táblában
CREATE OR REPLACE FUNCTION public.handle_task_score_inserted()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        total_score = total_score + NEW.points_awarded,
        tasks_completed = tasks_completed + 1,
        updated_at = now()
    WHERE username = NEW.username OR id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_task_score_inserted ON public.task_scores;
CREATE TRIGGER on_task_score_inserted
    AFTER INSERT ON public.task_scores
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_task_score_inserted();

-- 6. Összesített ranglista nézet (Leaderboard View)
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
    p.id AS user_id,
    p.username,
    p.display_name,
    p.role,
    p.class_code,
    p.total_score,
    p.tasks_completed,
    COALESCE(SUM(CASE WHEN ts.is_correct THEN 1 ELSE 0 END), 0) AS correct_tasks_count,
    ROUND(
        COALESCE(
            (SUM(CASE WHEN ts.is_correct THEN 1 ELSE 0 END)::NUMERIC / NULLIF(COUNT(ts.id), 0)) * 100, 
            0
        ), 1
    ) AS accuracy_percent,
    MAX(ts.created_at) AS last_active
FROM public.profiles p
LEFT JOIN public.task_scores ts ON p.username = ts.username
GROUP BY p.id, p.username, p.display_name, p.role, p.class_code, p.total_score, p.tasks_completed
ORDER BY p.total_score DESC, p.tasks_completed DESC;

-- 7. Row Level Security (RLS) beállítások
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Nyilvános olvasási és írási szabályok (anon kulccsal való osztálytermi használathoz)
CREATE POLICY "Public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert access on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access on profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read access on tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public insert access on tasks" ON public.tasks FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access on task_scores" ON public.task_scores FOR SELECT USING (true);
CREATE POLICY "Public insert access on task_scores" ON public.task_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access on game_sessions" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Public insert access on game_sessions" ON public.game_sessions FOR INSERT WITH CHECK (true);

-- Indexek a gyorsabb lekérdezésekhez
CREATE INDEX IF NOT EXISTS idx_task_scores_username ON public.task_scores(username);
CREATE INDEX IF NOT EXISTS idx_task_scores_clue_id ON public.task_scores(clue_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_username ON public.game_sessions(username);
CREATE INDEX IF NOT EXISTS idx_profiles_total_score ON public.profiles(total_score DESC);
