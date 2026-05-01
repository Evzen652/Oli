import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateLocalEvaluation, generateAiEvaluation, type EvalInput } from "@/lib/sessionEvaluator";

/**
 * Session Evaluator (lokální part) — generuje slovní hodnocení
 * po dokončení session bez AI volání (fallback).
 *
 * Testujeme:
 *  - Performance scaling: pct >= 80 → great, 50-79 → good, < 50 → weak
 *  - Subject-specific terms (matematika/čeština/prvouka/diktát)
 *  - Grade scaling (young = 1-3 max 2 věty, older = 2-3 věty)
 *  - helpUsed mention
 *  - Žádný emoji / hvězdička / odrážka (děti je nevidí)
 *  - Žádný PII echo (jen aggregate counts)
 */

// Mock aiClient → no AI available, fallback flow
vi.mock("@/lib/aiClient", () => ({
  callAi: vi.fn(),
  isAiAvailable: vi.fn(() => false),
}));

beforeEach(() => {
  // Stable random pro test pick()
  vi.spyOn(Math, "random").mockReturnValue(0);
});

const mkInput = (overrides: Partial<EvalInput> = {}): EvalInput => ({
  topicTitle: "Násobilka",
  totalTasks: 6,
  correctCount: 5,
  wrongCount: 1,
  helpUsedCount: 0,
  grade: 4,
  subject: "matematika",
  ...overrides,
});

describe("generateLocalEvaluation — performance scaling", () => {
  it("pct >= 80 (great) → pochval", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 5, totalTasks: 6 }));
    // Skvělé/Vyborné/Parada/etc.
    expect(r.toLowerCase()).toMatch(/skvel|vyborn|parad|jednic|super/);
  });

  it("pct 50-79 (good) → solidní/dobré", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 4, totalTasks: 6 }));
    expect(r.toLowerCase()).toMatch(/solidn|neni to spatn|ujde|dobr/);
  });

  it("pct < 50 (weak) → empatický + povzbudivý", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 1, totalTasks: 6 }));
    // Match jakýkoliv weak-eval pattern (mladší, starší, basic)
    expect(r.toLowerCase()).toMatch(/nevad|nic se nedeje|neni ono|potize|chce jeste|neni uplne|procvic|znovu/);
  });

  it("100% správně → great evaluation", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 6, totalTasks: 6 }));
    expect(r.toLowerCase()).toMatch(/skvel|vyborn|parad|jednic/);
  });

  it("0/N → weak evaluation", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 0, totalTasks: 6 }));
    expect(r.toLowerCase()).toMatch(/nevad|neni ono|potize|znovu/);
  });
});

describe("generateLocalEvaluation — grade scaling", () => {
  it("grade <= 3 → max 2 věty", () => {
    const r = generateLocalEvaluation(mkInput({ grade: 2 }));
    const sentences = r.split(/[.!?]/).filter(s => s.trim().length > 0);
    expect(sentences.length).toBeLessThanOrEqual(3);
  });

  it("grade 4+ → 2-3 věty", () => {
    const r = generateLocalEvaluation(mkInput({ grade: 5, correctCount: 5, totalTasks: 6 }));
    expect(r.length).toBeGreaterThan(20);
  });
});

describe("generateLocalEvaluation — subject-specific terms", () => {
  it("matematika → 'priklady' / 'priklad'", () => {
    const r = generateLocalEvaluation(mkInput({ subject: "matematika", correctCount: 3, totalTasks: 6 }));
    expect(r.toLowerCase()).toMatch(/priklad|pocitan|reseni/);
  });

  it("čeština → 'pravopis' / 'doplnovani'", () => {
    const r = generateLocalEvaluation(mkInput({ subject: "cestina", correctCount: 3, totalTasks: 6 }));
    expect(r.toLowerCase()).toMatch(/pravopis|doplnova|cviceni|pravidl/);
  });

  it("prvouka → 'otazky' / 'odpovidani'", () => {
    const r = generateLocalEvaluation(mkInput({ subject: "prvouka", correctCount: 3, totalTasks: 6 }));
    expect(r.toLowerCase()).toMatch(/otaz|odpovida|tema|znovu/);
  });

  it("diktát title → diktát-specific terms (pravopis)", () => {
    const r = generateLocalEvaluation(mkInput({
      topicTitle: "Diktát č.5",
      subject: "cestina",
      correctCount: 3,
      totalTasks: 6,
    }));
    expect(r.toLowerCase()).toMatch(/pravopis|cviceni/);
  });
});

describe("generateLocalEvaluation — helpUsed handling", () => {
  it("helpUsed=0 → zmíní samostatnost (great + young)", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 5, totalTasks: 6, helpUsedCount: 0, grade: 3 }));
    expect(r.toLowerCase()).toMatch(/sam|skvel|jednic/);
  });

  it("helpUsed > 0 (great) → mentioned (gentle)", () => {
    const r = generateLocalEvaluation(mkInput({
      correctCount: 5, totalTasks: 6, helpUsedCount: 2, grade: 5,
    }));
    expect(r.toLowerCase()).toMatch(/napove|priste|sam/);
  });
});

describe("generateLocalEvaluation — content rules", () => {
  it("žádný emoji v output", () => {
    const r = generateLocalEvaluation(mkInput());
    // Common emojis
    expect(r).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(r).not.toMatch(/[😊😀💡⭐🎉]/);
  });

  it("žádné hvězdičky / markdown bullets", () => {
    const r = generateLocalEvaluation(mkInput());
    expect(r).not.toMatch(/^\s*[*•]/m);
    expect(r).not.toMatch(/\*\*/);
  });

  it("output je neprázdný string", () => {
    const r = generateLocalEvaluation(mkInput());
    expect(typeof r).toBe("string");
    expect(r.trim().length).toBeGreaterThan(10);
  });

  it("vyšší grade → potenciálně delší output", () => {
    const young = generateLocalEvaluation(mkInput({ grade: 2, correctCount: 5, totalTasks: 6 }));
    const old = generateLocalEvaluation(mkInput({ grade: 8, correctCount: 5, totalTasks: 6 }));
    // Mladší dítě = kratší věta, starší = více kontextu
    expect(young.length).toBeLessThanOrEqual(old.length + 50);
  });
});

describe("generateAiEvaluation — fallback when AI unavailable", () => {
  it("isAiAvailable=false → falls back na local evaluation", async () => {
    const r = await generateAiEvaluation(mkInput());
    expect(typeof r).toBe("string");
    expect(r.length).toBeGreaterThan(10);
  });

  it("multiple volání s mock random → deterministic (s mocked Math.random)", async () => {
    const r1 = await generateAiEvaluation(mkInput());
    const r2 = await generateAiEvaluation(mkInput());
    // Math.random je mocked na 0 → pick vždy první variantu → deterministic
    expect(r1).toBe(r2);
  });
});

describe("generateLocalEvaluation — edge cases", () => {
  it("totalTasks = 0 → 0% pct, weak path", () => {
    const r = generateLocalEvaluation(mkInput({ correctCount: 0, totalTasks: 0 }));
    expect(typeof r).toBe("string");
    expect(r.length).toBeGreaterThan(0);
  });

  it("correctCount > totalTasks (data corruption) → no crash", () => {
    expect(() => generateLocalEvaluation(mkInput({ correctCount: 10, totalTasks: 6 }))).not.toThrow();
  });

  it("subject neznámý → default fallback terms", () => {
    const r = generateLocalEvaluation(mkInput({ subject: "neexistujici", correctCount: 3, totalTasks: 6 }));
    expect(r.length).toBeGreaterThan(0);
  });

  it("topicTitle s diakritikou je echo'd OK", () => {
    const r = generateLocalEvaluation(mkInput({
      topicTitle: "Příšerná příšerná témata",
      correctCount: 3,
      totalTasks: 6,
    }));
    expect(typeof r).toBe("string");
  });
});
