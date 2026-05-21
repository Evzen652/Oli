/**
 * skillLevel — DB vrstva pro student_skill_level tabulku.
 *
 * Používá se fire-and-forget (výsledky nikdy neblokují UI).
 * Supabase client je importován lazy — nezpůsobí problém v testech pure funkcí.
 */

import { supabase } from "@/integrations/supabase/client";
import type { SkillLevelState } from "../levelProgression";

interface SkillLevelRow {
  level: number;
  sessions_at_level: number;
  last_score: number | null;
  consecutive_good: number;
  consecutive_bad: number;
}

/**
 * Načte aktuální stav levelu žáka pro dané téma.
 * Vrátí null pokud záznam neexistuje (první sezení žáka na tomto tématu).
 */
export async function getSkillLevel(
  studentId: string,
  topicId: string
): Promise<SkillLevelState | null> {
  const { data, error } = await supabase
    .from("student_skill_level")
    .select("level, consecutive_good, consecutive_bad, last_score")
    .eq("student_id", studentId)
    .eq("topic_id", topicId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as SkillLevelRow;
  return {
    level: row.level,
    consecutiveGood: row.consecutive_good,
    consecutiveBad: row.consecutive_bad,
    lastScore: row.last_score ?? 0,
  };
}

interface UpsertPayload {
  level: number;
  consecutiveGood: number;
  consecutiveBad: number;
  lastScore: number;
}

/**
 * Uloží nový stav levelu (insert nebo update).
 * Fire-and-forget — chyby se logují, ale neblokují UI.
 */
export async function upsertSkillLevel(
  studentId: string,
  topicId: string,
  payload: UpsertPayload
): Promise<void> {
  const { error } = await supabase
    .from("student_skill_level")
    .upsert(
      {
        student_id: studentId,
        topic_id: topicId,
        level: payload.level,
        consecutive_good: payload.consecutiveGood,
        consecutive_bad: payload.consecutiveBad,
        last_score: payload.lastScore,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_id,topic_id" }
    );

  if (error) {
    console.warn("[skillLevel] upsert failed:", error.message);
  }
}
