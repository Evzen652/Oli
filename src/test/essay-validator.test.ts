import { describe, it, expect } from "vitest";
import { validateAnswer, getDefaultValidator, getValidator } from "@/lib/validators";

/**
 * Essay validator (Fáze 11).
 *
 * Kontrakt: AI vrátí skóre 0-100 (přes EssayInput → edge fn).
 * Validátor je pure & sync — porovná score string s threshold string.
 *
 * Default threshold = 60 (passing). Topic může nastavit jinak přes correctAnswer.
 */

describe("essayValidator — passing nad threshold", () => {
  it.each([
    ["60", "60", true],
    ["61", "60", true],
    ["75", "60", true],
    ["100", "60", true],
    ["80", "70", true],
  ])("score=%s, threshold=%s → correct=%s", (answer, expected, correct) => {
    const r = validateAnswer(answer, expected, { inputType: "essay" });
    expect(r.correct).toBe(correct);
    if (correct) expect(r.partialScore).toBeGreaterThanOrEqual(0);
  });
});

describe("essayValidator — fail pod threshold", () => {
  it.each([
    ["59", "60", false],
    ["0", "60", false],
    ["50", "60", false],
    ["1", "60", false],
  ])("score=%s, threshold=%s → correct=%s", (answer, expected, correct) => {
    const r = validateAnswer(answer, expected, { inputType: "essay" });
    expect(r.correct).toBe(correct);
    expect(r.errorType).toBe("below_threshold");
  });
});

describe("essayValidator — partialScore", () => {
  it("score=80 → partialScore = 0.8", () => {
    const r = validateAnswer("80", "60", { inputType: "essay" });
    expect(r.partialScore).toBeCloseTo(0.8, 5);
  });
  it("score=0 → partialScore = 0", () => {
    const r = validateAnswer("0", "60", { inputType: "essay" });
    expect(r.partialScore).toBe(0);
  });
  it("score=100 → partialScore = 1", () => {
    const r = validateAnswer("100", "60", { inputType: "essay" });
    expect(r.partialScore).toBe(1);
  });
  it("score>100 → clamp na 1 (sanity)", () => {
    const r = validateAnswer("150", "60", { inputType: "essay" });
    expect(r.partialScore).toBe(1);
  });
  it("score záporné → clamp na 0", () => {
    const r = validateAnswer("-10", "60", { inputType: "essay" });
    expect(r.partialScore).toBe(0);
  });
});

describe("essayValidator — invalid input", () => {
  it("score 'abc' → no_score errorType", () => {
    const r = validateAnswer("abc", "60", { inputType: "essay" });
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("no_score");
  });
  it("prázdný score → no_score", () => {
    const r = validateAnswer("", "60", { inputType: "essay" });
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("no_score");
  });
  it("nečíselný threshold → fallback na 60", () => {
    // Score 70 vs default 60 → correct
    const r = validateAnswer("70", "neplatný", { inputType: "essay" });
    expect(r.correct).toBe(true);
  });
  it("nečíselný threshold + score pod default → wrong", () => {
    const r = validateAnswer("50", "neplatný", { inputType: "essay" });
    expect(r.correct).toBe(false);
  });
});

describe("essayValidator — registry mapping", () => {
  it("getValidator('essay') vrátí essay validator", () => {
    const v = getValidator("essay");
    expect(v.id).toBe("essay");
  });
  it("getDefaultValidator('essay') vrátí essay validator", () => {
    const v = getDefaultValidator("essay");
    expect(v.id).toBe("essay");
  });
  it("validateAnswer s inputType='essay' používá essay validator", () => {
    // Pokud by routovalo špatně, tenhle by selhal (jiné validátory by neuměly skóre 0-100)
    const r = validateAnswer("65", "60", { inputType: "essay" });
    expect(r.correct).toBe(true);
  });
});

describe("essayValidator — security & robustness", () => {
  it("XSS v score parsuje jako NaN → no_score", () => {
    const r = validateAnswer("<script>alert(1)</script>", "60", { inputType: "essay" });
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("no_score");
  });
  it("score s leading whitespace ('  75') parseInt OK", () => {
    const r = validateAnswer("  75", "60", { inputType: "essay" });
    expect(r.correct).toBe(true);
  });
  it("desetinné skóre parseInt → 75 (zaokrouhlí dolů)", () => {
    // parseInt("75.9") = 75 — neměníme korektnost, jen dokumentujeme
    const r = validateAnswer("75.9", "60", { inputType: "essay" });
    expect(r.correct).toBe(true);
  });
  it("velké číslo přes Int.MAX → stále se chovavá rozumně", () => {
    const r = validateAnswer("999999999999", "60", { inputType: "essay" });
    expect(r.correct).toBe(true);
    expect(r.partialScore).toBe(1); // clamped
  });
  it("threshold 0 znamená vše projde", () => {
    const r = validateAnswer("1", "0", { inputType: "essay" });
    expect(r.correct).toBe(true);
  });
  it("threshold 100 znamená jen perfektní projde", () => {
    expect(validateAnswer("99", "100", { inputType: "essay" }).correct).toBe(false);
    expect(validateAnswer("100", "100", { inputType: "essay" }).correct).toBe(true);
  });
});
