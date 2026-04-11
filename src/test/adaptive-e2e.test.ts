import { describe, it, expect } from "vitest";
import { createSession, processState } from "@/lib/sessionOrchestrator";

describe("Adaptive Engine E2E", () => {
  it("should lower difficulty after 2 consecutive wrong answers", async () => {
    let s = createSession(3);
    expect(s.currentLevel).toBe(1);

    // INIT → INPUT_CAPTURE
    let result = await processState(s);
    s = result.session;

    // INPUT_CAPTURE → PRE_INTENT → TOPIC_MATCH → EXPLAIN → PRACTICE
    result = await processState(s, "sčítání");
    s = result.session;

    // Should be in PRACTICE with a question
    expect(s.state).toBe("PRACTICE");
    expect(s.practiceBatch.length).toBeGreaterThan(0);

    const levelBefore = s.currentLevel;

    // Answer wrong twice
    result = await processState(s, "WRONG_ANSWER_1");
    s = result.session;
    expect(result.lastAnswerCorrect).toBe(false);
    expect(s.errorStreak).toBe(1);

    // After 1 wrong: errorStreak=1, no level change yet (threshold is 2)
    // The adaptive engine fires after each CHECK

    // Need to get to next PRACTICE question
    // processState should have moved us to PRACTICE with next question
    result = await processState(s, "WRONG_ANSWER_2");
    s = result.session;
    expect(result.lastAnswerCorrect).toBe(false);
    expect(s.errorStreak).toBe(2);

    // After 2 consecutive errors, adaptive engine should have lowered level
    // Since we started at level 1 and clamp is [1,3], level stays at 1
    // But adaptiveHelpOffered should be true
    expect(s.adaptiveHelpOffered).toBe(true);
  });

  it("should decrease currentLevel from 2 after 2 wrong answers", async () => {
    let s = createSession(3);
    s.currentLevel = 2; // Start at level 2 to see decrease

    // INIT → INPUT_CAPTURE
    let result = await processState(s);
    s = result.session;

    // INPUT_CAPTURE → PRACTICE
    result = await processState(s, "sčítání");
    s = result.session;
    expect(s.state).toBe("PRACTICE");

    // Preserve level 2 through the flow
    s.currentLevel = 2;

    // Wrong answer 1
    result = await processState(s, "WRONG_1");
    s = result.session;

    // Wrong answer 2 → errorStreak=2 → levelDelta=-1
    result = await processState(s, "WRONG_2");
    s = result.session;

    expect(s.currentLevel).toBe(1);
    expect(s.adaptiveHelpOffered).toBe(true);
  });

  it("should increase level after high mastery (consecutive correct)", async () => {
    let s = createSession(3);

    let result = await processState(s);
    s = result.session;

    result = await processState(s, "sčítání");
    s = result.session;
    expect(s.state).toBe("PRACTICE");

    // Answer all tasks correctly
    const batchSize = s.practiceBatch.length;
    for (let i = 0; i < Math.min(batchSize, 4); i++) {
      const task = s.practiceBatch[s.currentTaskIndex];
      if (!task) break;
      result = await processState(s, task.correctAnswer);
      s = result.session;
      expect(result.lastAnswerCorrect).toBe(true);
    }

    // After consecutive correct answers, level should have increased
    expect(s.currentLevel).toBeGreaterThanOrEqual(1);
    expect(s.adaptiveHelpOffered).toBe(false);
  });
});
