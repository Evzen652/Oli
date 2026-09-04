import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Krok B — orchestrátor musí do persistence předat SKUTEČNOU odpověď dítěte.
 *
 * Rodič v modalu „Ukázat výsledky a hodnocení" potřebuje u chybných úloh vidět,
 * co přesně dítě napsalo (student_answer), ne jen správný klíč. Zdroj té hodnoty
 * je `userInput` ve stavu CHECK — tenhle test hlídá, že se skutečně propíše.
 */

const recordCheckResult = vi.fn();
vi.mock("@/lib/performanceTracker", () => ({
  recordCheckResult: (...args: unknown[]) => recordCheckResult(...args),
}));

import { createSession, processState } from "@/lib/sessionOrchestrator";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

function makeTopic(tasks: PracticeTask[]): TopicMetadata {
  return {
    id: "test-topic",
    title: "Test",
    subject: "matematika",
    category: "Test",
    topic: "Test",
    briefDescription: "Test",
    keywords: [],
    goals: [],
    boundaries: [],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    helpTemplate: { hint: "h", steps: ["s"], commonMistake: "m", example: "e" },
    generator: () => tasks,
  };
}

async function startAt(topic: TopicMetadata) {
  const s = createSession(topic.gradeRange[0]);
  s.matchedTopic = topic;
  s.childInput = topic.title;
  (s as unknown as { _maxLevel?: number })._maxLevel = 1;
  s.state = "EXPLAIN";
  return processState(s);
}

beforeEach(() => {
  recordCheckResult.mockClear();
});

describe("Krok B — student_answer se propíše z CHECK do persistence", () => {
  it("chybná odpověď: studentAnswer = to, co dítě napsalo (ne klíč)", async () => {
    const tasks: PracticeTask[] = [
      { question: "Doplň i/y: b__k", correctAnswer: "býk", options: ["býk", "bik", "byk"] },
    ];
    const { session } = await startAt(makeTopic(tasks));
    expect(session.state).toBe("PRACTICE");

    await processState(session, "  bik  "); // dítě odpoví špatně (s whitespace)

    expect(recordCheckResult).toHaveBeenCalledTimes(1);
    const arg = recordCheckResult.mock.calls[0][0];
    expect(arg.correct).toBe(false);
    expect(arg.studentAnswer).toBe("bik"); // trimnuto
    expect(arg.correctAnswer).toBe("býk");
    expect(arg.questionText).toBe("Doplň i/y: b__k");
  });

  it("správná odpověď: studentAnswer = klíč", async () => {
    const tasks: PracticeTask[] = [
      { question: "Doplň i/y: b__k", correctAnswer: "býk", options: ["býk", "bik", "byk"] },
    ];
    const { session } = await startAt(makeTopic(tasks));

    await processState(session, "býk");

    const arg = recordCheckResult.mock.calls[0][0];
    expect(arg.correct).toBe(true);
    expect(arg.studentAnswer).toBe("býk");
  });
});
