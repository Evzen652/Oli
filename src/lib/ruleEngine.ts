import type { Grade, Modality, SessionRules, SessionData } from "./types";

/** Derive session rules from grade (technical parameter only). */
export function getRulesForGrade(grade: Grade): SessionRules {
  const timeLimits: Record<Grade, number> = {
    1: 8 * 60,   // 8 min
    2: 8 * 60,
    3: 10 * 60,  // 10 min
    4: 12 * 60,
    5: 15 * 60,
    6: 15 * 60,
    7: 20 * 60,
    8: 20 * 60,
    9: 25 * 60,
  };

  const modalities: Record<Grade, Modality> = {
    1: "voice",
    2: "voice",
    3: "voice",
    4: "mixed",
    5: "text",
    6: "text",
    7: "text",
    8: "text",
    9: "text",
  };

  return {
    maxDurationSeconds: timeLimits[grade],
    modality: modalities[grade],
    maxErrorRepetitions: 3,
  };
}

/** Evaluate whether STOP should trigger. Returns null, "STOP_1", or "STOP_2". */
export function evaluateStop(session: SessionData): "STOP_1" | "STOP_2" | null {
  // Time expired → STOP_2
  if (session.elapsedSeconds >= session.rules.maxDurationSeconds) {
    return "STOP_2";
  }

  // Never terminate early due to errors — the full batch must always complete.
  // Error-based stops are removed per pilot requirement.

  return null;
}

/** Check if time limit is reached. */
export function isTimeExpired(session: SessionData): boolean {
  return session.elapsedSeconds >= session.rules.maxDurationSeconds;
}
