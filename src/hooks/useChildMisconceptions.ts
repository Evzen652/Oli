import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Misconception {
  id: string;
  skill_id: string;
  pattern_label: string;
  description: string | null;
  suggestion: string | null;
  confidence: number;
  evidence_count: number;
  status: "active" | "resolved" | "dismissed";
  detected_at: string;
}

/**
 * Načte AI-detekované misconceptions (vzorce chyb) pro dítě.
 * Vrací jen aktivní (status='active'), seřazené podle confidence DESC.
 */
export function useChildMisconceptions(childId: string | null) {
  const [data, setData] = useState<Misconception[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!childId) {
      setData([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data: rows } = await (supabase as any)
        .from("student_misconceptions")
        .select("*")
        .eq("child_id", childId)
        .eq("status", "active")
        .order("confidence", { ascending: false })
        .limit(5);
      if (cancelled) return;
      setData((rows ?? []) as Misconception[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [childId]);

  return { data, loading };
}
