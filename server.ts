import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://jcofukpxhezhvzaonfxe.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb2Z1a3B4aGV6aHZ6YW9uZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDE0OTAsImV4cCI6MjEwMzQxNzQ5MH0.9eHKiPncFSRKKCe7BRXr5oMkIkjNjTXh3LzZ0RUWg-o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy API routes to Supabase to bypass any browser CORS / Adblock / iframe NetworkError
  app.get("/api/db/health", async (req, res) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("id").limit(1);
      res.json({ ok: !error, error });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Fetch Leaderboard (User profiles)
  app.get("/api/db/leaderboard", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("username, role, class_code, total_score, rank_achieved, updated_at")
        .order("total_score", { ascending: false })
        .limit(50);

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Fetch Game Sessions
  app.get("/api/db/sessions", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get or Create User Profile
  app.post("/api/db/profile", async (req, res) => {
    try {
      const { username, role = "detective", classCode = "" } = req.body;
      const cleanName = (username || "").trim() || "Nyomozó";

      const { data: existing, error: selectError } = await supabase
        .from("user_profiles")
        .select("*")
        .ilike("username", cleanName)
        .maybeSingle();

      if (!selectError && existing) {
        const { data: updated, error: updateError } = await supabase
          .from("user_profiles")
          .update({
            role,
            class_code: classCode || existing.class_code || "",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        return res.json(updated || existing);
      }

      const { data: inserted, error: insertError } = await supabase
        .from("user_profiles")
        .insert([
          {
            username: cleanName,
            role,
            class_code: classCode,
            total_score: 0,
            rank_achieved: "Kezdő nyomozó",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }
      res.json(inserted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get User Stats
  app.get("/api/db/user-stats", async (req, res) => {
    try {
      const username = (req.query.username as string) || "";
      const cleanName = username.trim();
      if (!cleanName) {
        return res.json({ totalScore: 0, tasksCount: 0 });
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .ilike("username", cleanName)
        .maybeSingle();

      const { count: tasksCount } = await supabase
        .from("task_scores")
        .select("*", { count: "exact", head: true })
        .ilike("username", cleanName);

      res.json({
        totalScore: profile?.total_score || 0,
        tasksCount: tasksCount || 0,
        classCode: profile?.class_code,
        role: profile?.role,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save Task Score
  app.post("/api/db/task-score", async (req, res) => {
    try {
      const record = req.body;
      const cleanName = (record.username || "").trim();
      if (!cleanName) {
        return res.status(400).json({ error: "Missing username" });
      }

      const recordPayload = {
        ...record,
        username: cleanName,
        created_at: record.created_at || new Date().toISOString(),
      };

      await supabase.from("task_scores").insert([recordPayload]);

      if (record.is_correct && record.points_awarded > 0) {
        const { data: prof } = await supabase
          .from("user_profiles")
          .select("id, total_score")
          .ilike("username", cleanName)
          .maybeSingle();

        if (prof) {
          const nextScore = (prof.total_score || 0) + record.points_awarded;
          await supabase
            .from("user_profiles")
            .update({
              total_score: nextScore,
              updated_at: new Date().toISOString(),
            })
            .eq("id", prof.id);

          return res.json({ success: true, newTotalScore: nextScore });
        } else {
          const { data: newProf } = await supabase
            .from("user_profiles")
            .insert([
              {
                username: cleanName,
                role: "detective",
                total_score: record.points_awarded,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          return res.json({ success: true, newTotalScore: newProf?.total_score || record.points_awarded });
        }
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save Game Session
  app.post("/api/db/game-session", async (req, res) => {
    try {
      const session = req.body;
      const cleanName = (session.username || "").trim();
      if (!cleanName) {
        return res.status(400).json({ error: "Missing username" });
      }

      const sessionPayload = {
        ...session,
        username: cleanName,
        created_at: session.created_at || new Date().toISOString(),
      };

      const { error: sessErr } = await supabase.from("game_sessions").insert([sessionPayload]);
      if (sessErr) {
        return res.status(400).json({ error: sessErr.message });
      }

      if (session.rank_achieved) {
        await supabase
          .from("user_profiles")
          .update({
            rank_achieved: session.rank_achieved,
            updated_at: new Date().toISOString(),
          })
          .ilike("username", cleanName);
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
