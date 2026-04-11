import { describe, it, expect } from "vitest";
import type { TopicMetadata, PracticeTask, Grade } from "../lib/types";
import { getSubjectMeta } from "../lib/subjectRegistry";
import { getPrvoukaCategoryVisual, getPrvoukaTopicEmoji } from "../lib/prvoukaVisuals";
import { computeAdaptiveDecision, type SkillSnapshot } from "../lib/adaptiveEngine";

// ── Fake subject: "testověda" with 5 topics ──

function makeGenerator(prefix: string) {
  return (level: number): PracticeTask[] => [
    { question: `${prefix} L${level} Q1`, correctAnswer: "A1" },
    { question: `${prefix} L${level} Q2`, correctAnswer: "A2" },
    { question: `${prefix} L${level} Q3`, correctAnswer: "A3" },
  ];
}

const FAKE_TOPICS: TopicMetadata[] = [
  {
    id: "test-alpha", title: "Alpha", subject: "testověda", category: "Kategorie A",
    topic: "Alpha", briefDescription: "Test topic alpha", keywords: ["alpha", "testověda"],
    goals: ["Goal A"], boundaries: [], gradeRange: [3, 5] as [Grade, Grade],
    inputType: "number", generator: makeGenerator("alpha"), helpTemplate: {
      hint: "h", steps: ["s"], commonMistake: "m", example: "e",
    },
  },
  {
    id: "test-beta", title: "Beta", subject: "testověda", category: "Kategorie A",
    topic: "Beta", briefDescription: "Test topic beta", keywords: ["beta"],
    goals: ["Goal B"], boundaries: [], gradeRange: [3, 5] as [Grade, Grade],
    inputType: "select_one", generator: makeGenerator("beta"), helpTemplate: {
      hint: "h", steps: ["s"], commonMistake: "m", example: "e",
    },
  },
  {
    id: "test-gamma", title: "Gamma", subject: "testověda", category: "Kategorie B",
    topic: "Gamma", briefDescription: "Test topic gamma", keywords: ["gamma"],
    goals: ["Goal G"], boundaries: [], gradeRange: [4, 6] as [Grade, Grade],
    inputType: "number", generator: makeGenerator("gamma"), helpTemplate: {
      hint: "h", steps: ["s"], commonMistake: "m", example: "e",
    },
  },
  {
    id: "test-delta", title: "Delta", subject: "testověda", category: "Kategorie B",
    topic: "Delta", briefDescription: "Test topic delta", keywords: ["delta"],
    goals: ["Goal D"], boundaries: [], gradeRange: [4, 7] as [Grade, Grade],
    inputType: "text", generator: makeGenerator("delta"), helpTemplate: {
      hint: "h", steps: ["s"], commonMistake: "m", example: "e",
    },
  },
  {
    id: "test-epsilon", title: "Epsilon", subject: "testověda", category: "Kategorie C",
    topic: "Epsilon", briefDescription: "Test topic epsilon", keywords: ["epsilon"],
    goals: ["Goal E"], boundaries: [], gradeRange: [3, 9] as [Grade, Grade],
    inputType: "number", generator: makeGenerator("epsilon"), helpTemplate: {
      hint: "h", steps: ["s"], commonMistake: "m", example: "e",
    },
  },
];

describe("Scalability smoke test – fake subject 'testověda'", () => {
  it("getSubjectMeta returns a valid fallback (not crash)", () => {
    const meta = getSubjectMeta("testověda");
    expect(meta.label).toBeTruthy();
    expect(meta.emoji).toBeTruthy();
    expect(meta.gradientClass).toContain("bg-gradient");
    expect(meta.borderClass).toContain("border-");
  });

  it("fallback colors are deterministic", () => {
    const a = getSubjectMeta("testověda");
    const b = getSubjectMeta("testověda");
    expect(a.gradientClass).toBe(b.gradientClass);
    expect(a.borderClass).toBe(b.borderClass);
    expect(a.emoji).toBe(b.emoji);
  });

  it("different subjects get different hues", () => {
    const a = getSubjectMeta("přírodověda");
    const b = getSubjectMeta("dějepis");
    expect(a.gradientClass).not.toBe(b.gradientClass);
  });

  it("visual functions return null gracefully for unknown subject", () => {
    const catVisual = getPrvoukaCategoryVisual("testověda", "Kategorie A");
    expect(catVisual).toBeNull();

    const emoji = getPrvoukaTopicEmoji("testověda", "Kategorie A", "Alpha");
    expect(emoji).toBeNull();
  });

  it("all 5 fake topics have generators that produce tasks", () => {
    for (const topic of FAKE_TOPICS) {
      for (const level of [1, 2, 3]) {
        const tasks = topic.generator(level);
        expect(tasks.length).toBeGreaterThan(0);
        for (const t of tasks) {
          expect(t.question).toBeTruthy();
          expect(t.correctAnswer).toBeTruthy();
        }
      }
    }
  });

  it("grade filtering works for fake topics", () => {
    const grade4 = FAKE_TOPICS.filter(
      (t) => 4 >= t.gradeRange[0] && 4 <= t.gradeRange[1]
    );
    expect(grade4.length).toBe(5); // all include grade 4

    const grade3 = FAKE_TOPICS.filter(
      (t) => 3 >= t.gradeRange[0] && 3 <= t.gradeRange[1]
    );
    expect(grade3.length).toBe(3); // alpha, beta, epsilon
  });

  it("keyword matching works for fake topics", () => {
    const input = "alpha testověda";
    const matches = FAKE_TOPICS.filter((t) =>
      t.keywords.some((kw) => input.includes(kw.toLowerCase()))
    );
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((m) => m.id === "test-alpha")).toBe(true);
  });

  it("adaptive engine works with any skill snapshot", () => {
    const snapshot: SkillSnapshot = {
      mastery_score: 0.6,
      error_streak: 2,
      success_streak: 0,
      attempts_total: 5,
    };
    const decision = computeAdaptiveDecision(snapshot);
    expect(decision.levelDelta).toBe(-1);
    expect(decision.offerHelp).toBe(true);
    expect(decision.fallbackToPrerequisite).toBe(false);
  });
});
