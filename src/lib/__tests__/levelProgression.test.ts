import { describe, it, expect } from "vitest";
import { computeNextLevel } from "../levelProgression";
import type { SkillLevelState } from "../levelProgression";

const base: SkillLevelState = {
  level: 1,
  consecutiveGood: 0,
  consecutiveBad: 0,
  lastScore: 0,
};

describe("computeNextLevel", () => {
  it("level 1 + score 0.9 × 1 sezení → zůstane 1 (ještě ne 2×)", () => {
    const result = computeNextLevel({ ...base, level: 1 }, 0.9);
    expect(result.newLevel).toBe(1);
    expect(result.direction).toBe("same");
    expect(result.newConsecutiveGood).toBe(1);
    expect(result.didChange).toBe(false);
  });

  it("level 1 + score 0.9 × 2 sezení → postoupí na 2", () => {
    const after1 = computeNextLevel({ ...base, level: 1 }, 0.9);
    const after2 = computeNextLevel(
      { level: 1, consecutiveGood: after1.newConsecutiveGood, consecutiveBad: 0, lastScore: 0.9 },
      0.9
    );
    expect(after2.newLevel).toBe(2);
    expect(after2.direction).toBe("up");
    expect(after2.didChange).toBe(true);
    expect(after2.newConsecutiveGood).toBe(0); // reset po změně
  });

  it("level 3 + score 0.9 × 2 sezení → zůstane 3 (already max)", () => {
    const after1 = computeNextLevel({ ...base, level: 3 }, 0.9);
    const after2 = computeNextLevel(
      { level: 3, consecutiveGood: after1.newConsecutiveGood, consecutiveBad: 0, lastScore: 0.9 },
      0.9
    );
    expect(after2.newLevel).toBe(3);
    expect(after2.direction).toBe("same");
    expect(after2.didChange).toBe(false);
  });

  it("level 2 + score 0.3 × 1 sezení → okamžitě na 1", () => {
    const result = computeNextLevel({ ...base, level: 2 }, 0.3);
    expect(result.newLevel).toBe(1);
    expect(result.direction).toBe("down");
    expect(result.didChange).toBe(true);
    expect(result.newConsecutiveBad).toBe(0); // reset po změně
  });

  it("level 1 + score 0.3 × 1 sezení → zůstane 1 (already min)", () => {
    const result = computeNextLevel({ ...base, level: 1 }, 0.3);
    expect(result.newLevel).toBe(1);
    expect(result.direction).toBe("same");
    expect(result.didChange).toBe(false);
  });

  it("score mezi 0.4 a 0.8 → žádná změna, countery se resetují", () => {
    const result = computeNextLevel(
      { level: 2, consecutiveGood: 1, consecutiveBad: 0, lastScore: 0.9 },
      0.6
    );
    expect(result.newLevel).toBe(2);
    expect(result.direction).toBe("same");
    expect(result.newConsecutiveGood).toBe(0); // reset protože score < 0.8
    expect(result.newConsecutiveBad).toBe(0);  // score > 0.4
  });

  it("přesně na hranici GOOD (0.8) → počítá se jako dobré", () => {
    const result = computeNextLevel({ ...base, level: 1 }, 0.8);
    expect(result.newConsecutiveGood).toBe(1);
  });

  it("přesně na hranici BAD (0.4) → počítá se jako špatné", () => {
    const result = computeNextLevel({ ...base, level: 2 }, 0.4);
    expect(result.newLevel).toBe(1);
    expect(result.direction).toBe("down");
  });
});
