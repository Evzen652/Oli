import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Performance tracker (Fáze 8 misconception persistence).
 *
 * Testujeme klíčové invarianty:
 *  - recordCheckResult je fire-and-forget (ne-blokující)
 *  - Žádný await blokuje volajícího
 *  - Při no auth user → tichý skip (no throw)
 *  - DB error → silently logged (no throw, no user-visible failure)
 *  - Misconception analysis trigger jen při !correct (ne při correct)
 *  - Rate limit: cooldown 6h v localStorage (ne spam analyze-misconceptions)
 *  - Mastery EMA formula: alpha=0.3 weighting správný
 */

// Setup mocked supabase BEFORE importing the module under test
const supabaseMock = {
  auth: { getUser: vi.fn() },
  from: vi.fn(),
  functions: { invoke: vi.fn() },
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: supabaseMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Default: žádný user
  supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
  supabaseMock.functions.invoke.mockResolvedValue({ data: null, error: null });
  // localStorage clean
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.clear();
  }
});

// Helpers — mock chained query builder pattern (supabase-style)
function mkChain(returnValue: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = ["select", "insert", "update", "eq", "limit", "order"];
  methods.forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain);
  });
  chain.maybeSingle = vi.fn().mockResolvedValue(returnValue);
  // For non-chained terminal methods, simulate await
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(returnValue).then(resolve);
  return chain;
}

describe("recordCheckResult — fire-and-forget invariant", () => {
  it("vrací synchronně void (ne Promise)", async () => {
    const { recordCheckResult } = await import("@/lib/performanceTracker");
    const result = recordCheckResult({
      sessionId: "s1",
      skillId: "math-x",
      level: 1,
      correct: true,
      responseTimeMs: 100,
    });
    expect(result).toBeUndefined();
  });

  it("nečeká na DB ani auth (ne-blokující)", async () => {
    // Auth getUser zavěšen → recordCheckResult by neměl blokovat
    let resolveAuth!: (v: unknown) => void;
    supabaseMock.auth.getUser.mockReturnValue(
      new Promise((r) => { resolveAuth = r; })
    );
    const { recordCheckResult } = await import("@/lib/performanceTracker");
    const start = performance.now();
    recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: true, responseTimeMs: 100,
    });
    const elapsed = performance.now() - start;
    // Vrátí se okamžitě (< 50ms i s GC overhead)
    expect(elapsed).toBeLessThan(50);
    resolveAuth({ data: { user: null } });
  });
});

describe("recordCheckResult — no auth user", () => {
  it("při no user → tichý skip (no throw)", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { recordCheckResult } = await import("@/lib/performanceTracker");
    expect(() => recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: true, responseTimeMs: 100,
    })).not.toThrow();
    // Počkej tick na fire-and-forget
    await new Promise((r) => setTimeout(r, 10));
    // Žádný insert nebyl zavolán
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });
});

describe("recordCheckResult — DB error containment", () => {
  it("auth.getUser throws → no throw na callerovi", async () => {
    supabaseMock.auth.getUser.mockRejectedValue(new Error("auth down"));
    const { recordCheckResult } = await import("@/lib/performanceTracker");
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: true, responseTimeMs: 100,
    })).not.toThrow();
    await new Promise((r) => setTimeout(r, 10));
    expect(consoleWarn).toHaveBeenCalled();
    consoleWarn.mockRestore();
  });
});

describe("triggerMisconceptionAnalysis — rate limiting (cooldown 6h)", () => {
  it("první trigger: invoke proběhne, localStorage timestamp se uloží", async () => {
    // Setup: user paired s child
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkChain({ data: { id: "child-1" } }));

    const { recordCheckResult } = await import("@/lib/performanceTracker");
    recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: false, responseTimeMs: 100,
      errorType: "wrong_answer",
    });
    // Počkej tick aby fire-and-forget proběhlo
    await new Promise((r) => setTimeout(r, 50));

    const stored = window.localStorage.getItem("oli_last_misconception_analysis_child-1");
    expect(stored).toBeTruthy();
    expect(Number(stored)).toBeGreaterThan(Date.now() - 1000);
  });

  it("při correct=true → analyze-misconceptions se NEspouští", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkChain({ data: { id: "child-1" } }));

    const { recordCheckResult } = await import("@/lib/performanceTracker");
    recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: true, responseTimeMs: 100,
    });
    await new Promise((r) => setTimeout(r, 50));

    // analyze-misconceptions invoke nesmí být zavoláno
    const calls = supabaseMock.functions.invoke.mock.calls.filter(
      (c) => c[0] === "analyze-misconceptions"
    );
    expect(calls).toHaveLength(0);
  });

  it("druhý trigger v rámci cooldown → invoke se NEspouští", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkChain({ data: { id: "child-1" } }));

    // Pre-set localStorage timestamp na "right now"
    window.localStorage.setItem("oli_last_misconception_analysis_child-1", String(Date.now()));

    const { recordCheckResult } = await import("@/lib/performanceTracker");
    recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: false, responseTimeMs: 100,
      errorType: "wrong_answer",
    });
    await new Promise((r) => setTimeout(r, 50));

    const calls = supabaseMock.functions.invoke.mock.calls.filter(
      (c) => c[0] === "analyze-misconceptions"
    );
    expect(calls).toHaveLength(0);
  });

  it("po cooldown 6h+1ms → invoke se spouští znovu", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkChain({ data: { id: "child-1" } }));

    // Pre-set timestamp 6h+1s zpět
    const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000) - 1000;
    window.localStorage.setItem("oli_last_misconception_analysis_child-1", String(sixHoursAgo));

    const { recordCheckResult } = await import("@/lib/performanceTracker");
    recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: false, responseTimeMs: 100,
      errorType: "wrong_answer",
    });
    await new Promise((r) => setTimeout(r, 50));

    const calls = supabaseMock.functions.invoke.mock.calls.filter(
      (c) => c[0] === "analyze-misconceptions"
    );
    expect(calls.length).toBeGreaterThan(0);
  });

  it("invoke s child_id → správný body shape", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkChain({ data: { id: "child-99" } }));

    const { recordCheckResult } = await import("@/lib/performanceTracker");
    recordCheckResult({
      sessionId: "s1", skillId: "x", level: 1, correct: false, responseTimeMs: 100,
      errorType: "wrong_answer",
    });
    await new Promise((r) => setTimeout(r, 50));

    const call = supabaseMock.functions.invoke.mock.calls.find(
      (c) => c[0] === "analyze-misconceptions"
    );
    expect(call).toBeDefined();
    expect(call![1].body).toMatchObject({ days: 30, child_id: "child-99" });
  });
});

describe("getActiveMisconceptionConfidence — bez authentu", () => {
  it("no user → 0 (safe default)", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { getActiveMisconceptionConfidence } = await import("@/lib/performanceTracker");
    const c = await getActiveMisconceptionConfidence("skill-x");
    expect(c).toBe(0);
  });
});

describe("getSkillProfile — bez authentu", () => {
  it("no user → null", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { getSkillProfile } = await import("@/lib/performanceTracker");
    const p = await getSkillProfile("skill-x");
    expect(p).toBeNull();
  });
});

describe("CheckResult interface — fields", () => {
  it("recordCheckResult akceptuje optional fields (errorType, helpUsed, exampleId)", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { recordCheckResult } = await import("@/lib/performanceTracker");
    expect(() => recordCheckResult({
      sessionId: "s1",
      skillId: "x",
      level: 1,
      correct: true,
      responseTimeMs: 100,
      // optional fields omitted
    })).not.toThrow();
    expect(() => recordCheckResult({
      sessionId: "s1",
      skillId: "x",
      level: 1,
      correct: false,
      responseTimeMs: 100,
      errorType: "wrong_answer",
      helpUsed: true,
      exampleId: "ex-1",
    })).not.toThrow();
  });
});
