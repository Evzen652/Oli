import { describe, it, expect, vi } from "vitest";
import { computeAdaptiveDecision, clampLevel, type SkillSnapshot } from "@/lib/adaptiveEngine";

/**
 * Adaptive E2E s misconception (Bod 10).
 *
 * Cíl: ověřit pedagogicky kritický flow — když dítě má aktivní misconception
 * (vysoká confidence), engine přepne do terapeutického módu:
 *   - Snížit obtížnost (level-1)
 *   - Vždy nabídnout pomoc (offerHelp=true)
 *   - NE fallback na prerequisite (terapeutický mód cílí na konkrétní bolístku)
 *   - Misconception priorita BIJE všechno ostatní (i mastery_high)
 *
 * Tady simulujeme celý cyklus přes adaptive engine:
 *   1. Žák začíná s mastery 0.5, žádné chyby
 *   2. Detekce misconception (analyze-misconceptions edge fn) → confidence 0.8
 *   3. Příští session si engine pre-fetch confidence → terapeutický mód
 *   4. Po 3 úspěšných odpovědích na snadnější úloze → mastery roste
 *   5. Misconception confidence by měla klesnout → návrat k normálnímu módu
 */

const baseSnap = (overrides: Partial<SkillSnapshot> = {}): SkillSnapshot => ({
  mastery_score: 0.5,
  error_streak: 0,
  success_streak: 0,
  attempts_total: 5,
  active_misconception_confidence: 0,
  ...overrides,
});

describe("Adaptive E2E — žák s aktivní misconception", () => {
  it("session start: confidence 0.8 → terapeutický mód", () => {
    const d = computeAdaptiveDecision(baseSnap({ active_misconception_confidence: 0.8 }));
    expect(d.reason).toBe("active_misconception");
    expect(d.levelDelta).toBe(-1);
    expect(d.offerHelp).toBe(true);
    expect(d.fallbackToPrerequisite).toBe(false);
  });

  it("po prvním task úspěch: success_streak=1, terapeutický mód STÁLE aktivní", () => {
    // Aktivní misconception bije všechno
    const d = computeAdaptiveDecision(baseSnap({
      active_misconception_confidence: 0.8,
      success_streak: 1,
      mastery_score: 0.55, // mírný posun nahoru
    }));
    expect(d.reason).toBe("active_misconception");
  });

  it("po 3 úspěších + cleared misconception (confidence < 0.7) → návrat normální", () => {
    // Po analyze-misconceptions cycle dropne confidence. Test simulates
    // 3 success_streak + low confidence → mastery scaling kicks in.
    const d = computeAdaptiveDecision(baseSnap({
      active_misconception_confidence: 0.4, // sub-threshold
      success_streak: 3,
      mastery_score: 0.7,
      attempts_total: 8,
    }));
    expect(d.reason).toBe("normal");
  });

  it("misconception cleared + high mastery → level UP", () => {
    const d = computeAdaptiveDecision(baseSnap({
      active_misconception_confidence: 0,
      success_streak: 5,
      mastery_score: 0.9,
    }));
    expect(d.reason).toBe("mastery_high");
    expect(d.levelDelta).toBe(1);
  });
});

describe("Adaptive E2E — error escalation s misconception", () => {
  it("misconception 0.8 + error_streak 2 → STÁLE terapeutický (priorita)", () => {
    const d = computeAdaptiveDecision(baseSnap({
      active_misconception_confidence: 0.8,
      error_streak: 2,
    }));
    // Misconception priorita > error streak
    expect(d.reason).toBe("active_misconception");
  });

  it("misconception 0.6 (sub-threshold) + error_streak 3 → fallback prerequisite", () => {
    const d = computeAdaptiveDecision(baseSnap({
      active_misconception_confidence: 0.6,
      error_streak: 3,
    }));
    expect(d.reason).toBe("error_streak_fallback");
    expect(d.fallbackToPrerequisite).toBe(true);
  });

  it("misconception 0.6 + error_streak 2 → offer help (ne fallback)", () => {
    const d = computeAdaptiveDecision(baseSnap({
      active_misconception_confidence: 0.6,
      error_streak: 2,
    }));
    expect(d.reason).toBe("error_streak_help");
    expect(d.offerHelp).toBe(true);
    expect(d.fallbackToPrerequisite).toBe(false);
  });
});

describe("Adaptive E2E — level clamping kombinovaný s adaptive", () => {
  it("clampLevel(currentLevel + decision.levelDelta) udržuje range [1,3]", () => {
    // Žák na levelu 1 + misconception → levelDelta=-1 → cílový level=0 → clamp=1
    expect(clampLevel(1 + -1)).toBe(1);
    // Level 3 + mastery_high → levelDelta=+1 → 4 → clamp=3
    expect(clampLevel(3 + 1)).toBe(3);
    // Level 2 + 0 → 2
    expect(clampLevel(2 + 0)).toBe(2);
  });

  it("vícenásobný adaptive cycle nepřekročí range", () => {
    let level = 2;
    // Simuluj 10 ticks s mastery_high
    for (let i = 0; i < 10; i++) {
      const d = computeAdaptiveDecision(baseSnap({ mastery_score: 0.9, success_streak: i + 1 }));
      level = clampLevel(level + d.levelDelta);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(3);
    }
    expect(level).toBe(3); // capped na 3
  });
});

describe("Adaptive E2E — misconception lifecycle (přímý simulace)", () => {
  // Trasujeme snapshot updates jak by je dělal sessionOrchestrator
  function runIteration(prev: SkillSnapshot, correct: boolean): SkillSnapshot {
    return {
      mastery_score: correct
        ? Math.min(1, prev.mastery_score + 0.1)
        : Math.max(0, prev.mastery_score - 0.05),
      error_streak: correct ? 0 : prev.error_streak + 1,
      success_streak: correct ? prev.success_streak + 1 : 0,
      attempts_total: prev.attempts_total + 1,
      active_misconception_confidence: prev.active_misconception_confidence,
    };
  }

  it("žák začne s confidence 0.8 → 5 správných odpovědí → confidence still 0.8 (analyze-misconceptions je out-of-band)", () => {
    let snap: SkillSnapshot = baseSnap({ active_misconception_confidence: 0.8, mastery_score: 0.4 });
    for (let i = 0; i < 5; i++) {
      const decision = computeAdaptiveDecision(snap);
      expect(decision.reason).toBe("active_misconception");
      snap = runIteration(snap, true);
    }
    // Confidence neměníme v engine — to je úkol analyze-misconceptions edge fn
    expect(snap.active_misconception_confidence).toBe(0.8);
    expect(snap.mastery_score).toBeCloseTo(0.9, 1);
  });

  it("simulace: žák s confidence 0.8 + 5 chyb → STÁLE terapeutický (ne escalation)", () => {
    let snap: SkillSnapshot = baseSnap({ active_misconception_confidence: 0.8 });
    for (let i = 0; i < 5; i++) {
      const decision = computeAdaptiveDecision(snap);
      expect(decision.reason).toBe("active_misconception");
      expect(decision.fallbackToPrerequisite).toBe(false);
      snap = runIteration(snap, false);
    }
    expect(snap.error_streak).toBe(5);
    expect(snap.mastery_score).toBeCloseTo(0.25, 1);
  });
});

describe("Adaptive E2E — performance pod realtime invariantem", () => {
  it("computeAdaptiveDecision opakovaně volaný s varying inputs < 5ms / call průměrně", () => {
    const start = performance.now();
    let snap: SkillSnapshot = baseSnap();
    for (let i = 0; i < 10000; i++) {
      snap = {
        mastery_score: Math.random(),
        error_streak: Math.floor(Math.random() * 5),
        success_streak: Math.floor(Math.random() * 5),
        attempts_total: i,
        active_misconception_confidence: Math.random(),
      };
      computeAdaptiveDecision(snap);
    }
    const elapsed = performance.now() - start;
    const perCall = elapsed / 10000;
    // Tested: typicky < 0.01ms / call. 5ms / call by byl regrese.
    expect(perCall).toBeLessThan(0.5);
  });
});

describe("Adaptive E2E — pre-fetch invariant", () => {
  it("misconceptionConfidence se cache-uje v session (read-only během CHECK loop)", () => {
    // Toto je strukturální invariant: orchestrator pre-fetch při TOPIC_MATCH,
    // adaptive engine pak čte ze snapshot. Tady jen ověříme, že
    // computeAdaptiveDecision je čistá funkce (žádný side effect, žádné
    // network / DB volání)
    const snap = baseSnap({ active_misconception_confidence: 0.8 });

    // Spy na global fetch — adaptive engine ho NESMÍ volat
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() => {
      throw new Error("Adaptive engine NESMÍ volat fetch");
    });

    expect(() => computeAdaptiveDecision(snap)).not.toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
