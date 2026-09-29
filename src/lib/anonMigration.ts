/**
 * Anonymní mód: detekce a migrace pokroku z localStorage do Supabase
 * po přihlášení/registraci.
 *
 * Migrace funguje hlavně při přihlášení dítěte přes pairing kód
 * (máme child_id). Pro rodičovskou registraci se data ponechají
 * v localStorage a migrují se až po propojení dítěte (separate flow).
 */

import { supabase } from "@/integrations/supabase/client";
import { clearAnonProgress } from "./anonProgress";
import { clearTrial } from "./anonTrial";
import { ANON_LEVELS_KEY, readAnonLevels, anonHigherLevelCount } from "./levelStore";

const STORAGE_KEY_PROGRESS = "oli_anon_progress";
const STORAGE_KEY_GRADE = "oli_anon_grade";
const STORAGE_KEY_STARTED = "oli_anon_started";

interface RawAnonProgress {
  date: string;
  grade: number;
  tasks: { topicId: string; completed: boolean; score?: number }[];
}

export interface AnonProgressSummary {
  grade: number;
  completedCount: number;
  topics: { topicId: string; score: number; date: string }[];
}

/**
 * Stojí za to nabídnout přenos? Splněný denní úkol NEBO téma na vyšší úrovni.
 * Dřív jen splněný úkol — dítě, které procvičovalo jiné než doporučené téma,
 * tak o dosaženou úroveň přišlo bez ptaní.
 */
export function hasAnonProgressToMigrate(): boolean {
  return hasAnonProgress() || anonHigherLevelCount() > 0;
}

/**
 * Přenese anonymní úrovně (L1–L3 po tématech) do `student_skill_level`.
 *
 * `studentId` MUSÍ být ID přihlášeného DÍTĚTE: RLS dovolí zapsat jen vlastní
 * řádky (`student_id = auth.uid()`). Rodič za dítě zapisovat nemůže —
 * proto se volá jen z `ChildAuth` po spárování, ne z `ParentOnboarding`.
 *
 * Když už dítě v účtu nějakou úroveň má (hrálo přihlášené jinde), vyšší
 * vyhrává — přenos nikdy úroveň nesníží.
 */
export async function migrateAnonLevels(studentId: string): Promise<{ ok: boolean; migrated: number; error?: string }> {
  const anon = readAnonLevels();
  const temata = Object.keys(anon);
  if (temata.length === 0) return { ok: true, migrated: 0 };
  try {
    const { data: stavajici, error: readErr } = await supabase
      .from("student_skill_level")
      .select("topic_id, level")
      .eq("student_id", studentId)
      .in("topic_id", temata);
    if (readErr) return { ok: false, migrated: 0, error: readErr.message };
    const vUctu = new Map((stavajici ?? []).map((r) => [r.topic_id, r.level]));
    const radky = temata
      .filter((t) => (vUctu.get(t) ?? 0) < anon[t].level || !vUctu.has(t))
      .map((t) => ({
        student_id: studentId,
        topic_id: t,
        level: Math.max(anon[t].level, vUctu.get(t) ?? 0),
        consecutive_good: anon[t].consecutiveGood,
        consecutive_bad: anon[t].consecutiveBad,
        last_score: anon[t].lastScore,
        updated_at: new Date().toISOString(),
      }));
    if (radky.length > 0) {
      const { error } = await supabase.from("student_skill_level").upsert(radky, { onConflict: "student_id,topic_id" });
      if (error) return { ok: false, migrated: 0, error: error.message };
    }
    return { ok: true, migrated: radky.length };
  } catch (e) {
    return { ok: false, migrated: 0, error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

/** True pokud má anonymní uživatel alespoň 1 splněný úkol. */
export function hasAnonProgress(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return false;
    const progress = JSON.parse(raw) as RawAnonProgress;
    return progress.tasks?.some((t) => t.completed) ?? false;
  } catch {
    return false;
  }
}

/** Souhrn anonymního pokroku pro zobrazení v dialogu. */
export function getAnonProgressSummary(): AnonProgressSummary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    const grade = localStorage.getItem(STORAGE_KEY_GRADE);
    if (!raw || !grade) return null;

    const progress = JSON.parse(raw) as RawAnonProgress;
    const completed = progress.tasks.filter((t) => t.completed);
    if (completed.length === 0) return null;

    return {
      grade: parseInt(grade, 10),
      completedCount: completed.length,
      topics: completed.map((t) => ({
        topicId: t.topicId,
        score: t.score ?? 1,
        date: progress.date,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Přenese anonymní pokrok na konkrétní dítě.
 * Vloží 1 session_log záznam per splněný topic (synthetic, mark-as-practiced).
 * Aktualizuje grade na child profilu pokud není nastaveno (nebo je default).
 */
export async function migrateAnonProgress(
  userId: string,
  childId: string,
): Promise<{ ok: boolean; migrated: number; error?: string }> {
  const summary = getAnonProgressSummary();
  if (!summary) return { ok: true, migrated: 0 };

  try {
    // Synthetic session_logs — jeden záznam per splněný topic.
    // session_id sdílený mezi všemi (značí "anon migration batch").
    const sessionId = crypto.randomUUID();
    const records = summary.topics.map((t) => ({
      session_id: sessionId,
      user_id: userId,
      child_id: childId,
      skill_id: t.topicId,
      correct: t.score >= 0.5,
      help_used: false,
      level: 1,
    }));

    const { error: insertErr } = await supabase
      .from("session_logs")
      .insert(records);
    if (insertErr) {
      return { ok: false, migrated: 0, error: insertErr.message };
    }

    // Aktualizuj grade na profilu dítěte (jen pokud je default 0)
    const { data: child } = await supabase
      .from("children")
      .select("grade")
      .eq("id", childId)
      .single();

    if (child && (!child.grade || child.grade === 0)) {
      await supabase
        .from("children")
        .update({ grade: summary.grade })
        .eq("id", childId);
    }

    // Úrovně tu NEmazat: rodičovská cesta je přenést nemůže (dítě nemá účet)
    // a dětská je přenáší zvlášť přes `migrateAnonLevels`.
    clearAnonData({ keepLevels: true });
    return { ok: true, migrated: records.length };
  } catch (e) {
    return {
      ok: false,
      migrated: 0,
      error: e instanceof Error ? e.message : "Neznámá chyba",
    };
  }
}

/**
 * Vymaže anonymní data z localStorage (progress, grade, started, trial, úrovně).
 *
 * `keepLevels`: rodičovská registrace úrovně nechá. Dítě ještě nemá účet, kam
 * by šly zapsat (RLS), a přenesou se, až se na tomhle zařízení spáruje.
 */
export function clearAnonData(opts: { keepLevels?: boolean } = {}): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    if (!opts.keepLevels) localStorage.removeItem(ANON_LEVELS_KEY);
    localStorage.removeItem(STORAGE_KEY_GRADE);
    localStorage.removeItem(STORAGE_KEY_STARTED);
    clearAnonProgress(); // belt-and-suspenders
    clearTrial();
  } catch {
    /* ignore */
  }
}
