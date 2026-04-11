import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChildStats {
  sessions: number;
  tasks: number;
  accuracy: number;
  loading: boolean;
}

export function useChildStats(childId: string | null): ChildStats {
  const [stats, setStats] = useState<ChildStats>({ sessions: 0, tasks: 0, accuracy: 0, loading: true });

  useEffect(() => {
    if (!childId) {
      setStats({ sessions: 0, tasks: 0, accuracy: 0, loading: false });
      return;
    }

    let cancelled = false;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    (async () => {
      const { data, error } = await supabase
        .from("session_logs")
        .select("session_id, correct, help_used")
        .eq("child_id", childId)
        .gte("created_at", weekAgo);

      if (cancelled) return;

      if (error || !data) {
        setStats({ sessions: 0, tasks: 0, accuracy: 0, loading: false });
        return;
      }

      const sessions = new Set(data.map((r) => r.session_id)).size;
      const tasks = data.length;
      const independent = data.filter((r) => r.correct && !r.help_used).length;
      const accuracy = tasks > 0 ? Math.round((independent / tasks) * 100) : 0;

      setStats({ sessions, tasks, accuracy, loading: false });
    })();

    return () => { cancelled = true; };
  }, [childId]);

  return stats;
}
