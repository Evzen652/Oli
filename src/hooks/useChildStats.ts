import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SkillBreakdown {
  skillId: string;
  attempts: number;
  correct: number;
  helpUsed: number;
  wrong: number;
}

export interface ChildStats {
  sessions: number;
  tasks: number;
  accuracy: number;
  /** Úloh správně s pomocí nápovědy */
  helpUsed: number;
  /** Úloh chybně */
  wrong: number;
  /** Počet různých dnů, kdy proběhlo procvičování (za posledních 7 dní) */
  daysActive: number;
  /** Per-skill rozpis (řazený podle počtu pokusů, sestupně) */
  skills: SkillBreakdown[];
  loading: boolean;
}

export function useChildStats(childId: string | null): ChildStats {
  const [stats, setStats] = useState<ChildStats>({
    sessions: 0, tasks: 0, accuracy: 0, helpUsed: 0, wrong: 0, daysActive: 0, skills: [], loading: true,
  });

  useEffect(() => {
    if (!childId) {
      setStats({ sessions: 0, tasks: 0, accuracy: 0, helpUsed: 0, wrong: 0, daysActive: 0, skills: [], loading: false });
      return;
    }

    let cancelled = false;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    (async () => {
      const { data, error } = await supabase
        .from("session_logs")
        .select("session_id, skill_id, correct, help_used, created_at")
        .eq("child_id", childId)
        .gte("created_at", weekAgo);

      if (cancelled) return;

      if (error || !data) {
        setStats({ sessions: 0, tasks: 0, accuracy: 0, helpUsed: 0, wrong: 0, daysActive: 0, skills: [], loading: false });
        return;
      }

      const sessions = new Set(data.map((r) => r.session_id)).size;
      const tasks = data.length;
      const independent = data.filter((r) => r.correct && !r.help_used).length;
      const helpUsed = data.filter((r) => r.correct && r.help_used).length;
      const wrong = data.filter((r) => !r.correct).length;
      const accuracy = tasks > 0 ? Math.round((independent / tasks) * 100) : 0;

      // Počet různých dnů s aktivitou
      const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);
      const days = new Set(data.map((r) => dayKey(r.created_at as string)));
      const daysActive = days.size;

      // Per-skill rozpis
      const skillMap = new Map<string, SkillBreakdown>();
      for (const row of data) {
        const sid = row.skill_id as string;
        if (!sid) continue;
        const existing = skillMap.get(sid) ?? { skillId: sid, attempts: 0, correct: 0, helpUsed: 0, wrong: 0 };
        existing.attempts++;
        if (row.correct && !row.help_used) existing.correct++;
        if (row.correct && row.help_used) existing.helpUsed++;
        if (!row.correct) existing.wrong++;
        skillMap.set(sid, existing);
      }
      const skills = Array.from(skillMap.values()).sort((a, b) => b.attempts - a.attempts);

      setStats({ sessions, tasks, accuracy, helpUsed, wrong, daysActive, skills, loading: false });
    })();

    return () => { cancelled = true; };
  }, [childId]);

  return stats;
}
