/**
 * PERFORMANCE TRACKER
 * 
 * Async, fire-and-forget persistence layer.
 * Records session logs and updates skill profiles after each CHECK.
 * NEVER blocks the UI — all operations are async with no await in the hot path.
 */

import { supabase } from "@/integrations/supabase/client";

export interface CheckResult {
  sessionId: string;
  skillId: string;
  level: number;
  exampleId?: string;
  correct: boolean;
  responseTimeMs: number;
  errorType?: string;
  helpUsed?: boolean;
  questionText?: string;
  correctAnswer?: string;
}

/** Mastery score exponential weighting factor (recent results matter more). */
const MASTERY_ALPHA = 0.3;

/**
 * Record a check result. Call this fire-and-forget from the orchestrator.
 * It logs the session entry and updates the skill profile.
 * Returns immediately — errors are logged to console, never thrown.
 */
export function recordCheckResult(result: CheckResult): void {
  // Fire and forget — no await, no blocking
  persistResult(result).catch((err) => {
    console.warn("[PerformanceTracker] Background persist failed:", err);
  });
}

async function persistResult(result: CheckResult): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn("[PerformanceTracker] No authenticated user, skipping persistence");
    return;
  }

  const userId = user.id;

  // Resolve child_id if the current user is a paired child
  let childId: string | null = null;
  const { data: childRow } = await supabase
    .from("children")
    .select("id")
    .eq("child_user_id", userId)
    .maybeSingle();
  if (childRow) {
    childId = childRow.id;
  } else {
    // Admin/parent preview: find first child owned by this user
    const { data: childByParent } = await supabase
      .from("children")
      .select("id")
      .eq("parent_user_id", userId)
      .limit(1)
      .maybeSingle();
    if (childByParent) childId = childByParent.id;
  }

  // 1. Insert session log
  await supabase.from("session_logs").insert({
    session_id: result.sessionId,
    user_id: userId,
    skill_id: result.skillId,
    level: result.level,
    example_id: result.exampleId ?? null,
    correct: result.correct,
    response_time_ms: result.responseTimeMs,
    error_type: result.errorType ?? null,
    help_used: result.helpUsed ?? false,
    child_id: childId,
    question_text: result.questionText ?? null,
    correct_answer: result.correctAnswer ?? null,
  } as any);

  // 2. Upsert skill profile
  const { data: existing } = await supabase
    .from("skill_profiles")
    .select("*")
    .eq("user_id", userId)
    .eq("skill_id", result.skillId)
    .maybeSingle();

  if (existing) {
    const newAttempts = existing.attempts_total + 1;
    const newCorrect = existing.correct_total + (result.correct ? 1 : 0);
    const newErrorStreak = result.correct ? 0 : existing.error_streak + 1;
    const newSuccessStreak = result.correct ? existing.success_streak + 1 : 0;

    // Exponential weighted mastery: new = alpha * latest + (1-alpha) * old
    const latestScore = result.correct ? 1.0 : 0.0;
    const newMastery = MASTERY_ALPHA * latestScore + (1 - MASTERY_ALPHA) * existing.mastery_score;

    // Update weak patterns
    const patterns: string[] = Array.isArray(existing.weak_pattern_flags)
      ? [...existing.weak_pattern_flags as string[]]
      : [];
    if (result.errorType && !patterns.includes(result.errorType)) {
      patterns.push(result.errorType);
    }

    await supabase
      .from("skill_profiles")
      .update({
        attempts_total: newAttempts,
        correct_total: newCorrect,
        error_streak: newErrorStreak,
        success_streak: newSuccessStreak,
        mastery_score: Math.round(newMastery * 1000) / 1000,
        weak_pattern_flags: patterns,
        last_practiced_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    // Create new profile
    await supabase.from("skill_profiles").insert({
      user_id: userId,
      skill_id: result.skillId,
      attempts_total: 1,
      correct_total: result.correct ? 1 : 0,
      error_streak: result.correct ? 0 : 1,
      success_streak: result.correct ? 1 : 0,
      mastery_score: result.correct ? MASTERY_ALPHA : 0.0,
      weak_pattern_flags: result.errorType ? [result.errorType] : [],
      last_practiced_at: new Date().toISOString(),
      child_id: childId,
    });
  }

  // 3. Fire-and-forget AI misconception analysis trigger.
  // Spustí se max 1× za 6 hodin per dítě (rate limit přes localStorage),
  // a jen pokud má žák nedávné chyby. Ne-blokující — nečekáme na výsledek.
  if (!result.correct) {
    triggerMisconceptionAnalysis(childId, userId).catch(() => {
      /* swallow — fire-and-forget */
    });
  }
}

/**
 * Spustí analýzu misconceptions na pozadí.
 * Rate-limit: max 1× za 6 hodin per child (přes localStorage timestamp).
 * Princip: drobná latence prohraje proti rychlým iteracím — analyzujeme
 * jen občas, ne po každé chybě.
 */
const ANALYSIS_COOLDOWN_MS = 6 * 60 * 60 * 1000;
async function triggerMisconceptionAnalysis(childId: string | null, userId: string) {
  const target = childId ?? userId;
  const key = `oli_last_misconception_analysis_${target}`;
  try {
    const last = typeof window !== "undefined" ? Number(window.localStorage.getItem(key) ?? "0") : 0;
    if (Date.now() - last < ANALYSIS_COOLDOWN_MS) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, String(Date.now()));
    }
    const body: Record<string, unknown> = { days: 30 };
    if (childId) body.child_id = childId;
    else body.user_id = userId;
    // Fire and forget — výsledek se ukáže rodiči až při příštím refreshi
    await supabase.functions.invoke("analyze-misconceptions", { body });
  } catch {
    // Tichá chyba — feature nesmí blokovat zápis session_log
  }
}

/**
 * Fetch skill profile for adaptive engine decisions.
 * Returns null if no profile exists yet.
 */
export async function getSkillProfile(skillId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("skill_profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("skill_id", skillId)
    .maybeSingle();

  return data;
}

/**
 * Vrátí confidence aktivní misconception pro daný skill, 0 pokud žádná.
 *
 * Hledá nejvyšší confidence z aktivních misconceptions:
 *   - primárně podle child_id (paired session)
 *   - fallback podle user_id (admin/parent preview)
 *
 * Volá se 1× na začátku session (při TOPIC_MATCH), výsledek se cache-uje
 * v SessionData.misconceptionConfidence — orchestrator pak v realtime
 * loop jen čte z paměti, žádné DB calls (CHECK < 60ms invariant).
 */
export async function getActiveMisconceptionConfidence(skillId: string): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // Najdi child_id přes pairing (stejná logika jako recordOutcome)
  let childId: string | null = null;
  const { data: childByUser } = await supabase
    .from("children")
    .select("id")
    .eq("child_user_id", user.id)
    .maybeSingle();
  if (childByUser) {
    childId = childByUser.id;
  } else {
    const { data: childByParent } = await supabase
      .from("children")
      .select("id")
      .eq("parent_user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (childByParent) childId = childByParent.id;
  }

  let query = supabase
    .from("student_misconceptions")
    .select("confidence")
    .eq("skill_id", skillId)
    .eq("status", "active")
    .order("confidence", { ascending: false })
    .limit(1);

  if (childId) {
    query = query.eq("child_id", childId);
  } else {
    query = query.eq("user_id", user.id);
  }

  const { data } = await query.maybeSingle();
  return typeof data?.confidence === "number" ? data.confidence : 0;
}
