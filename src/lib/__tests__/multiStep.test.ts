import { describe, it, expect } from "vitest";
import { explodeMultiStep, generateQuadraticEquation, type MultiStepTask } from "../multiStep";

describe("multiStep", () => {
  it("explodes task into PracticeTask sequence", () => {
    const task: MultiStepTask = {
      id: "test",
      problem: "2 + 2 = ?",
      steps: [
        { id: "s1", prompt: "Sečti", correctAnswer: "4" },
      ],
    };
    const tasks = explodeMultiStep(task);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].correctAnswer).toBe("4");
    expect(tasks[0].question).toContain("2 + 2 = ?");
    expect(tasks[0].question).toContain("Sečti");
  });

  it("uses contextFromPrevious for later steps", () => {
    const task: MultiStepTask = {
      id: "test",
      problem: "Hlavní problém",
      steps: [
        { id: "s1", prompt: "Krok 1", correctAnswer: "10" },
        {
          id: "s2",
          prompt: "Krok 2",
          correctAnswer: "20",
          contextFromPrevious: (prev) => `Z minulého kroku: ${prev[0]}`,
        },
      ],
    };
    const tasks = explodeMultiStep(task, ["10"]);
    expect(tasks[1].question).toContain("Z minulého kroku: 10");
    expect(tasks[1].question).toContain("Krok 2");
  });

  it("generates valid quadratic equation", () => {
    const task = generateQuadraticEquation(1);
    expect(task.steps).toHaveLength(3);
    expect(task.problem).toMatch(/x²/);
    expect(task.meta?.skillId).toBe("math-quadratic-equation");
  });

  it("quadratic discriminant step has correct answer format", () => {
    const task = generateQuadraticEquation(1);
    const D = parseInt(task.steps[0].correctAnswer, 10);
    expect(Number.isFinite(D)).toBe(true);
    expect(D).toBeGreaterThanOrEqual(0); // Pro celočíselné kořeny D ≥ 0
  });
});
