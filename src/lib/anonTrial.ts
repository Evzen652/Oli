/**
 * Anonymní 14-denní trial pro nepřihlášené dítě.
 *
 * Princip:
 * - První návštěva → spuštění trialu (uloženo v localStorage)
 * - Den 1-14: plný přístup ke všemu obsahu
 * - Den 15+: přepnutí do freemium režimu (3 úkoly denně)
 *
 * Trial začíná v Onboarding.tsx při výběru ročníku.
 * AnonStudentPage čte stav a podle něj renderuje plný nebo freemium dashboard.
 */

const STORAGE_KEY = "oli_anon_trial";
export const TRIAL_DAYS = 14;

export interface AnonTrialState {
  startedAt: string; // ISO date
  grade: number;
}

function readState(): AnonTrialState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnonTrialState;
    if (!parsed?.startedAt || typeof parsed?.grade !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeState(s: AnonTrialState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/**
 * Spustí trial pokud ještě neběží. Idempotent — opakované volání nereset.
 * Pokud dítě změní ročník, trial pokračuje od původního data (jen update grade).
 */
export function startTrial(grade: number): void {
  const existing = readState();
  if (existing) {
    // Trial už běží, jen aktualizuj grade pokud se změnil
    if (existing.grade !== grade) {
      writeState({ ...existing, grade });
    }
    return;
  }
  writeState({
    startedAt: new Date().toISOString(),
    grade,
  });
}

/** Stav trialu nebo null pokud nezačal. */
export function getTrialState(): AnonTrialState | null {
  return readState();
}

/**
 * Vrátí počet zbývajících dní (0 pokud expirovalo nebo neběží).
 * Den 1 (právě spuštěno) → 14
 * Den 15 → 0
 */
export function getTrialDaysRemaining(): number {
  const state = readState();
  if (!state) return 0;
  const started = new Date(state.startedAt).getTime();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const elapsed = Math.floor((now - started) / dayMs);
  return Math.max(0, TRIAL_DAYS - elapsed);
}

/** Den od začátku trialu (1 = první den, 14 = poslední den). */
export function getTrialCurrentDay(): number {
  const remaining = getTrialDaysRemaining();
  if (remaining === 0) return TRIAL_DAYS + 1; // expired
  return TRIAL_DAYS - remaining + 1;
}

/** True pokud trial běží (zbývá > 0 dní). */
export function isTrialActive(): boolean {
  return getTrialDaysRemaining() > 0;
}

/** True pokud trial existuje ale vypršel (přechod na freemium). */
export function isTrialExpired(): boolean {
  const state = readState();
  return state !== null && getTrialDaysRemaining() === 0;
}

/** Smaže trial state (např. po registraci). */
export function clearTrial(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Restartuje trial na „den 1" (startedAt = teď). Volitelně posune start do
 * minulosti (`daysAgo`) pro testování stavu před koncem / po expiraci.
 * Zachová ročník (nebo nastaví předaný / default 4). Na rozdíl od `startTrial`
 * NENÍ idempotentní — vždy přepíše `startedAt`. Slouží k resetu / testování flow.
 */
export function restartTrial(grade?: number, daysAgo = 0): void {
  const existing = readState();
  const g = grade ?? existing?.grade ?? 4;
  const d = new Date();
  if (daysAgo > 0) d.setDate(d.getDate() - daysAgo);
  writeState({ startedAt: d.toISOString(), grade: g });
}

/**
 * Vrátí aktuální ročník anonymního uživatele.
 * SINGLE SOURCE OF TRUTH — trial state má přednost před legacy `oli_anon_grade`.
 * Použij všude, kde se čte ročník anonymního uživatele.
 */
export function getCurrentAnonGrade(): number | null {
  const trial = getTrialState();
  if (trial) return trial.grade;
  // Fallback: legacy klíč pro zpětnou kompatibilitu
  try {
    const legacy = localStorage.getItem("oli_anon_grade");
    if (!legacy) return null;
    const n = parseInt(legacy, 10);
    return isNaN(n) ? null : n;
  } catch {
    return null;
  }
}
