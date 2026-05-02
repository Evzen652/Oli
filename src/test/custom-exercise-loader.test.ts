import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * customExerciseLoader — DB fetch wrapper pro custom_exercises tabulku.
 *
 * Klíčové invariants:
 *  - Žák vidí JEN approved exercises (status='approved')
 *  - is_active filter (mazání = soft delete)
 *  - Volitelný source filter (simple/advanced/expert)
 *  - Volitelná validace přes filterValidTasks pro inputType
 *  - Error / no data → []
 *  - Shuffle pro variety
 */

// Mock supabase BEFORE import
const mockChain: Record<string, unknown> = {};
const supabaseMock = {
  from: vi.fn(() => mockChain),
};
const setupChain = (data: unknown[] | null, error: unknown = null) => {
  const builder: Record<string, unknown> = {};
  ["select", "eq"].forEach((m) => {
    builder[m] = vi.fn().mockReturnValue(builder);
  });
  builder.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error }).then(resolve);
  return builder;
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: supabaseMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loadCustomExercises", () => {
  it("vrátí [] pokud DB error", async () => {
    supabaseMock.from.mockReturnValue(setupChain(null, { message: "err" }));
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x");
    expect(r).toEqual([]);
  });

  it("vrátí [] pokud DB vrátí prázdný array", async () => {
    supabaseMock.from.mockReturnValue(setupChain([]));
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x");
    expect(r).toEqual([]);
  });

  it("mapuje DB row na PracticeTask (question, correctAnswer)", async () => {
    supabaseMock.from.mockReturnValue(
      setupChain([
        {
          question: "Q1",
          correct_answer: "A1",
          options: null,
          hints: null,
          solution_steps: null,
        },
      ]),
    );
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x");
    expect(r).toHaveLength(1);
    expect(r[0].question).toBe("Q1");
    expect(r[0].correctAnswer).toBe("A1");
    expect(r[0].options).toBeUndefined();
    expect(r[0].hints).toBeUndefined();
  });

  it("mapuje options/hints/solution_steps array fields", async () => {
    supabaseMock.from.mockReturnValue(
      setupChain([
        {
          question: "Q",
          correct_answer: "A",
          options: ["A", "B", "C"],
          hints: ["hint1", "hint2"],
          solution_steps: ["step1", "step2"],
        },
      ]),
    );
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x");
    expect(r[0].options).toEqual(["A", "B", "C"]);
    expect(r[0].hints).toEqual(["hint1", "hint2"]);
    expect(r[0].solutionSteps).toEqual(["step1", "step2"]);
  });

  it("prázdné array fields → undefined (ne []) v PracticeTask", async () => {
    supabaseMock.from.mockReturnValue(
      setupChain([
        {
          question: "Q",
          correct_answer: "A",
          options: [],
          hints: [],
          solution_steps: [],
        },
      ]),
    );
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x");
    // Filter "length > 0" → undefined pro prázdné
    expect(r[0].options).toBeUndefined();
    expect(r[0].hints).toBeUndefined();
    expect(r[0].solutionSteps).toBeUndefined();
  });

  it("inputType validation filtruje invalid tasks", async () => {
    supabaseMock.from.mockReturnValue(
      setupChain([
        { question: "Q1", correct_answer: ">", options: null, hints: null, solution_steps: null },
        { question: "Q2", correct_answer: "5", options: null, hints: null, solution_steps: null },
      ]),
    );
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x", { inputType: "comparison" });
    // Pouze ">" je validní comparison
    expect(r).toHaveLength(1);
    expect(r[0].correctAnswer).toBe(">");
  });

  it("bez inputType: žádná validace, vrátí všechno (i nevalidní)", async () => {
    supabaseMock.from.mockReturnValue(
      setupChain([
        { question: "Q1", correct_answer: "abc", options: null, hints: null, solution_steps: null },
        { question: "Q2", correct_answer: "xyz", options: null, hints: null, solution_steps: null },
      ]),
    );
    const { loadCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await loadCustomExercises("skill-x");
    expect(r).toHaveLength(2);
  });
});

describe("hasCustomExercises", () => {
  it("vrátí true pokud count > 0", async () => {
    const builder: Record<string, unknown> = {};
    ["select", "eq"].forEach((m) => {
      builder[m] = vi.fn().mockReturnValue(builder);
    });
    builder.then = (resolve: (v: unknown) => unknown) =>
      Promise.resolve({ count: 5, error: null }).then(resolve);
    supabaseMock.from.mockReturnValue(builder);

    const { hasCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await hasCustomExercises("skill-x");
    expect(r).toBe(true);
  });

  it("vrátí false pokud count = 0", async () => {
    const builder: Record<string, unknown> = {};
    ["select", "eq"].forEach((m) => {
      builder[m] = vi.fn().mockReturnValue(builder);
    });
    builder.then = (resolve: (v: unknown) => unknown) =>
      Promise.resolve({ count: 0, error: null }).then(resolve);
    supabaseMock.from.mockReturnValue(builder);

    const { hasCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await hasCustomExercises("skill-x");
    expect(r).toBe(false);
  });

  it("vrátí false pokud DB error", async () => {
    const builder: Record<string, unknown> = {};
    ["select", "eq"].forEach((m) => {
      builder[m] = vi.fn().mockReturnValue(builder);
    });
    builder.then = (resolve: (v: unknown) => unknown) =>
      Promise.resolve({ count: null, error: { message: "err" } }).then(resolve);
    supabaseMock.from.mockReturnValue(builder);

    const { hasCustomExercises } = await import("@/lib/customExerciseLoader");
    const r = await hasCustomExercises("skill-x");
    expect(r).toBe(false);
  });
});
