/**
 * ADAPTIVE ENGINE
 * 
 * Pure algorithmic difficulty scaling. No AI. No network calls.
 * Takes a skill profile snapshot and returns decisions synchronously.
 */

export interface SkillSnapshot {
  mastery_score: number;
  error_streak: number;
  success_streak: number;
  attempts_total: number;
  /**
   * Aktivní misconception confidence pro tento skill (0-1).
   * Pokud je > 0.5, engine zařadí cílené terapeutické cvičení
   * (lower difficulty, vždy offer help).
   */
  active_misconception_confidence?: number;
}

export interface AdaptiveDecision {
  /** Recommended difficulty level adjustment: -1, 0, or +1 */
  levelDelta: number;
  /** Should the "Jak na to?" help be offered? */
  offerHelp: boolean;
  /** Should we fall back to a prerequisite skill? */
  fallbackToPrerequisite: boolean;
  /** Human-readable reason for the decision */
  reason: string;
}

const MASTERY_HIGH = 0.85;
const MASTERY_LOW = 0.5;
const ERROR_STREAK_HELP = 2;
const ERROR_STREAK_FALLBACK = 3;

/**
 * Compute adaptive decision from a skill profile snapshot.
 * This is SYNCHRONOUS and DETERMINISTIC — safe for the realtime loop.
 */
export function computeAdaptiveDecision(snapshot: SkillSnapshot | null): AdaptiveDecision {
  // No data yet → neutral
  if (!snapshot || snapshot.attempts_total === 0) {
    return {
      levelDelta: 0,
      offerHelp: false,
      fallbackToPrerequisite: false,
      reason: "no_data",
    };
  }

  // Aktivní misconception s vysokou jistotou → terapeutický mód:
  // snížit obtížnost, vždy offer help. Cíl je léčit konkrétní bolístku.
  if ((snapshot.active_misconception_confidence ?? 0) >= 0.7) {
    return {
      levelDelta: -1,
      offerHelp: true,
      fallbackToPrerequisite: false,
      reason: "active_misconception",
    };
  }

  // Error streak >= 3 → prerequisite fallback
  if (snapshot.error_streak >= ERROR_STREAK_FALLBACK) {
    return {
      levelDelta: -1,
      offerHelp: true,
      fallbackToPrerequisite: true,
      reason: "error_streak_fallback",
    };
  }

  // Error streak >= 2 → offer help, lower difficulty
  if (snapshot.error_streak >= ERROR_STREAK_HELP) {
    return {
      levelDelta: -1,
      offerHelp: true,
      fallbackToPrerequisite: false,
      reason: "error_streak_help",
    };
  }

  // High mastery → increase difficulty
  if (snapshot.mastery_score >= MASTERY_HIGH) {
    return {
      levelDelta: 1,
      offerHelp: false,
      fallbackToPrerequisite: false,
      reason: "mastery_high",
    };
  }

  // Low mastery → decrease difficulty
  if (snapshot.mastery_score < MASTERY_LOW) {
    return {
      levelDelta: -1,
      offerHelp: false,
      fallbackToPrerequisite: false,
      reason: "mastery_low",
    };
  }

  // Normal range
  return {
    levelDelta: 0,
    offerHelp: false,
    fallbackToPrerequisite: false,
    reason: "normal",
  };
}

/**
 * Clamp level to valid range [1, 3].
 */
export function clampLevel(level: number): number {
  return Math.max(1, Math.min(3, level));
}
