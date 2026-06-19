import { describe, it, expect } from "vitest";
import { createSession, processState } from "@/lib/sessionOrchestrator";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

function makeTopic(generator: TopicMetadata["generator"], over: Partial<TopicMetadata> = {}): TopicMetadata {
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
    generator,
    ...over,
  };
}

// Sestaví session ve stavu PRACTICE stejně jako handleTopicSelect (matchedTopic + EXPLAIN).
async function startAt(topic: TopicMetadata) {
  const s = createSession(topic.gradeRange[0]);
  s.matchedTopic = topic;
  s.childInput = topic.title;
  (s as unknown as { _maxLevel?: number })._maxLevel = 1;
  s.state = "EXPLAIN";
  return processState(s);
}

describe("Žákovská smyčka — integrace orchestrátoru", () => {
  it("empty-batch guard: generátor vrátí [] → session jde do END, ne pád", async () => {
    const { session } = await startAt(makeTopic(() => []));
    expect(session.state).toBe("END");
  });

  it("happy path: smyčka dojde od první do poslední úlohy a skončí v END", async () => {
    const tasks: PracticeTask[] = Array.from({ length: 6 }, (_, i) => ({
      question: `Otázka ${i}`,
      correctAnswer: String(i),
      options: [String(i), "x", "y"],
    }));

    let { session } = await startAt(makeTopic(() => tasks));
    expect(session.state).toBe("PRACTICE");
    expect(session.practiceBatch.length).toBeGreaterThan(0);

    // Odpověz správně na každou úlohu, dokud smyčka neskončí.
    let guard = 0;
    while (session.state === "PRACTICE" && guard++ < 30) {
      const task = session.practiceBatch[session.currentTaskIndex];
      expect(task).toBeDefined();
      const res = await processState(session, task.correctAnswer);
      session = res.session;
    }

    expect(guard).toBeLessThan(30); // smyčka se nezacyklila
    expect(session.state).toBe("END");
  });
});
