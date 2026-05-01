import { describe, it, expect } from "vitest";
import { getRulesForGrade, evaluateStop, isTimeExpired } from "@/lib/ruleEngine";
import { createSession } from "@/lib/sessionOrchestrator";
import type { Grade, SessionData } from "@/lib/types";

/**
 * Rule Engine — pure deterministic stop logic.
 *
 * Pokrývá:
 *  - getRulesForGrade: per-grade timeLimits + modality mapping
 *  - evaluateStop: čas-expired only (žádný error-based stop podle pilot req)
 *  - isTimeExpired sanity
 */

describe("getRulesForGrade — timeLimits per grade", () => {
  it.each([
    [1, 8 * 60],
    [2, 8 * 60],
    [3, 10 * 60],
    [4, 12 * 60],
    [5, 15 * 60],
    [6, 15 * 60],
    [7, 20 * 60],
    [8, 20 * 60],
    [9, 25 * 60],
  ])("grade %d → maxDurationSeconds = %d", (grade, expected) => {
    const r = getRulesForGrade(grade as Grade);
    expect(r.maxDurationSeconds).toBe(expected);
  });

  it.each([
    [1, "voice"],
    [2, "voice"],
    [3, "voice"],
    [4, "mixed"],
    [5, "text"],
    [6, "text"],
    [7, "text"],
    [8, "text"],
    [9, "text"],
  ])("grade %d → modality = %s", (grade, expected) => {
    const r = getRulesForGrade(grade as Grade);
    expect(r.modality).toBe(expected);
  });

  it("všechny grades mají maxErrorRepetitions = 3", () => {
    for (let g = 1; g <= 9; g++) {
      expect(getRulesForGrade(g as Grade).maxErrorRepetitions).toBe(3);
    }
  });

  it("vyšší grade = delší / stejný timeLimit (monotonicita)", () => {
    let prev = 0;
    for (let g = 1; g <= 9; g++) {
      const cur = getRulesForGrade(g as Grade).maxDurationSeconds;
      expect(cur).toBeGreaterThanOrEqual(prev);
      prev = cur;
    }
  });
});

describe("evaluateStop — pouze time-based STOP_2", () => {
  function mkSession(grade: Grade, elapsedSeconds: number, overrides: Partial<SessionData> = {}): SessionData {
    return {
      ...createSession(grade),
      elapsedSeconds,
      ...overrides,
    };
  }

  it("čas pod limit → null (no stop)", () => {
    const s = mkSession(3, 100);
    expect(evaluateStop(s)).toBeNull();
  });

  it("čas přesně na limit → STOP_2", () => {
    const s = mkSession(3, 600); // grade 3 = 10 min = 600s
    expect(evaluateStop(s)).toBe("STOP_2");
  });

  it("čas přes limit → STOP_2", () => {
    const s = mkSession(3, 700);
    expect(evaluateStop(s)).toBe("STOP_2");
  });

  it("error-based stop NEPOUŽIT (per pilot req — full batch always)", () => {
    // 100 errors, limit-žádný error stop
    const s = mkSession(3, 100, { errorCount: 100, errorStreak: 50 });
    expect(evaluateStop(s)).toBeNull();
  });

  it("confusion count NEPOUŽIT (zpracovává PRE_INTENT)", () => {
    const s = mkSession(3, 100, { confusionCount: 99 });
    expect(evaluateStop(s)).toBeNull();
  });
});

describe("isTimeExpired — boolean převod", () => {
  function mkSession(grade: Grade, elapsedSeconds: number): SessionData {
    return { ...createSession(grade), elapsedSeconds };
  }

  it("pod limit → false", () => {
    expect(isTimeExpired(mkSession(3, 599))).toBe(false);
  });

  it("na limit → true", () => {
    expect(isTimeExpired(mkSession(3, 600))).toBe(true);
  });

  it("nad limit → true", () => {
    expect(isTimeExpired(mkSession(3, 1000))).toBe(true);
  });
});
