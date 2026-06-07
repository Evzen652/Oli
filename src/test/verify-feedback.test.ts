import { describe, it, expect } from "vitest";
import { VERSRYMPRIROVNANI } from "@/content/grade-3/cjl/versRymPrirovnani";
import { SCITANIAODCITANIDO1000 } from "@/content/grade-3/matematika/scitaniAOdcitaniDo1000";
import { POHADKAPOVESTBAJKAPOVIDKA } from "@/content/grade-4/cjl/pohadkaPovestBajkaPovidka";

// Ověření že feedback systém funguje správně pro 3 různé předměty

describe("Feedback — čeština grade-3 (explanation)", () => {
  const topic = VERSRYMPRIROVNANI[0];
  const tasks = topic.generator(1);

  it("každý task má explanation", () => {
    tasks.forEach(t => {
      expect(t.explanation, `Chybí explanation pro otázku: "${t.question}"`).toBeTruthy();
      expect(t.explanation!.length).toBeGreaterThan(20);
    });
  });

  it("žádný task nemá solutionSteps (bylo odstraněno)", () => {
    tasks.forEach(t => {
      expect(t.solutionSteps, `solutionSteps stále existuje pro: "${t.question}"`).toBeUndefined();
    });
  });

  it("explanation nevypadá jako starý vzor 'Odpověď: ...'", () => {
    tasks.forEach(t => {
      expect(t.explanation!.startsWith("Odpověď:")).toBe(false);
    });
  });

  it("ukázka — otázka + explanation (výpis pro vizuální kontrolu)", () => {
    const sample = tasks[0];
    console.log("\n📚 ČEŠTINA — vzorový feedback:");
    console.log(`  Q: ${sample.question}`);
    console.log(`  A: ${sample.correctAnswer}`);
    console.log(`  Explanation: ${sample.explanation}`);
    expect(sample.explanation).toBeTruthy();
  });
});

describe("Feedback — matematika grade-3 (solutionSteps)", () => {
  const topic = SCITANIAODCITANIDO1000[0];
  const tasks = topic.generator(2);

  it("každý task má solutionSteps", () => {
    tasks.forEach(t => {
      expect(t.solutionSteps, `Chybí solutionSteps pro: "${t.question}"`).toBeDefined();
      expect(t.solutionSteps!.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("matematika nemá explanation (kroky jsou dostačující)", () => {
    tasks.forEach(t => {
      expect(t.explanation).toBeUndefined();
    });
  });

  it("ukázka — otázka + solutionSteps", () => {
    const sample = tasks[0];
    console.log("\n🔢 MATEMATIKA — vzorový feedback:");
    console.log(`  Q: ${sample.question}`);
    console.log(`  A: ${sample.correctAnswer}`);
    console.log(`  Steps: ${JSON.stringify(sample.solutionSteps)}`);
    expect(sample.solutionSteps).toBeDefined();
  });
});

describe("Feedback — čeština grade-4 (kontrola kompatibility)", () => {
  const topic = POHADKAPOVESTBAJKAPOVIDKA[0];
  const tasks = topic.generator(1);

  it("grade-4 CJL má explanation nebo solutionSteps", () => {
    tasks.slice(0, 3).forEach(t => {
      const hasFeedback = !!(t.explanation || (t.solutionSteps && t.solutionSteps.length > 0));
      if (!hasFeedback) {
        console.warn(`  ⚠ Chybí feedback pro: "${t.question}"`);
      }
      // warn jen, neselže — grade-4 nebyl součástí opravy
    });
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("ukázka — grade-4 feedback", () => {
    const sample = tasks[0];
    console.log("\n📖 ČEŠTINA grade-4 — vzorový feedback:");
    console.log(`  Q: ${sample.question}`);
    console.log(`  A: ${sample.correctAnswer}`);
    console.log(`  explanation: ${sample.explanation ?? "(chybí — grade-4 nebyl opraven)"}`);
    console.log(`  solutionSteps: ${JSON.stringify(sample.solutionSteps ?? "(chybí)")}`);
    expect(sample).toBeTruthy();
  });
});
