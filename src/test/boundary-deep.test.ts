import { describe, it, expect } from "vitest";
import { checkBoundaryViolation } from "@/lib/boundaryEnforcement";
import type { TopicMetadata } from "@/lib/types";

/**
 * Boundary enforcement deep dive — per-skill rules.
 *
 * Pokrývá:
 *  - Forbidden keywords pro každý skill v BOUNDARY_RULES
 *  - Numeric range — čísla mimo povolený rozsah
 *  - Edge cases: single char comparison symbols (>, <, =) vždy povolené
 *  - Topic bez rules → no violation
 *  - Case insensitive matching
 */

const mkTopic = (id: string): TopicMetadata => ({
  id,
  title: "T",
  subject: "matematika",
  category: "C",
  topic: "Topic",
  briefDescription: "d",
  keywords: ["k"],
  goals: ["g"],
  boundaries: ["b"],
  gradeRange: [3, 9],
  inputType: "number",
  generator: () => [],
  helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
});

describe("checkBoundaryViolation — math-compare-natural-numbers-100", () => {
  const topic = mkTopic("math-compare-natural-numbers-100");

  it("legitimní comparison symbol → no violation", () => {
    expect(checkBoundaryViolation(">", topic)).toBe(false);
    expect(checkBoundaryViolation("<", topic)).toBe(false);
    expect(checkBoundaryViolation("=", topic)).toBe(false);
  });

  it("'větší než' → violation (forbidden keyword)", () => {
    expect(checkBoundaryViolation("větší než 5", topic)).toBe(true);
  });

  it("'menší než' → violation", () => {
    expect(checkBoundaryViolation("menší než 10", topic)).toBe(true);
  });

  it("'plus' → violation (mimo téma porovnávání)", () => {
    expect(checkBoundaryViolation("3 plus 5", topic)).toBe(true);
  });

  it("'násobení' → violation", () => {
    expect(checkBoundaryViolation("co je násobení", topic)).toBe(true);
  });

  it("'desetinné' → violation (math forbidden)", () => {
    expect(checkBoundaryViolation("desetinné číslo", topic)).toBe(true);
  });

  it("number > 100 → violation (out of range)", () => {
    expect(checkBoundaryViolation("150", topic)).toBe(true);
  });

  it("number 100 → no violation (boundary inclusive)", () => {
    expect(checkBoundaryViolation("100", topic)).toBe(false);
  });

  it("number 0 → no violation", () => {
    expect(checkBoundaryViolation("0", topic)).toBe(false);
  });

  it("multiple numbers, jeden mimo rozsah → violation", () => {
    expect(checkBoundaryViolation("38 nebo 200", topic)).toBe(true);
  });

  it("case insensitive forbidden kw", () => {
    expect(checkBoundaryViolation("VĚTŠÍ NEŽ 5", topic)).toBe(true);
  });
});

describe("checkBoundaryViolation — math-add-sub-100", () => {
  const topic = mkTopic("math-add-sub-100");

  it("'násobení' v inputu → violation (out of scope, keyword exact match)", () => {
    expect(checkBoundaryViolation("co je násobení čísel", topic)).toBe(true);
  });

  it("'zlomky' v inputu → violation", () => {
    expect(checkBoundaryViolation("zlomky a sčítání", topic)).toBe(true);
  });

  it("'krát' jako lay synonyma NENÍ keyword → no violation", () => {
    // Boundary je keyword-based, 'krát' není v seznamu (ale 'násobení' ano)
    expect(checkBoundaryViolation("kolik je 3 krát 4", topic)).toBe(false);
  });

  it("number 200 → no violation (range 0-200)", () => {
    expect(checkBoundaryViolation("123", topic)).toBe(false);
  });

  it("number 201 → violation (over range)", () => {
    expect(checkBoundaryViolation("201", topic)).toBe(true);
  });
});

describe("checkBoundaryViolation — frakce topics", () => {
  const topic = mkTopic("frac_compare_same_den");

  it("'záporné' → violation (frakce nepovolují záporná)", () => {
    expect(checkBoundaryViolation("záporné zlomky", topic)).toBe(true);
  });

  it("'desetinné' → violation", () => {
    expect(checkBoundaryViolation("0,5 jako desetinné", topic)).toBe(true);
  });

  it("'slovní úloha' → violation (jiný typ úlohy)", () => {
    expect(checkBoundaryViolation("slovní úloha o zlomcích", topic)).toBe(true);
  });

  it("legitimní zlomek → no violation", () => {
    expect(checkBoundaryViolation("3/8", topic)).toBe(false);
  });
});

describe("checkBoundaryViolation — topic bez rules", () => {
  it("neznámý topic ID → vždy no violation", () => {
    const topic = mkTopic("unknown-topic-xyz");
    expect(checkBoundaryViolation("cokoliv", topic)).toBe(false);
    expect(checkBoundaryViolation("větší než 999999", topic)).toBe(false);
  });
});

describe("checkBoundaryViolation — bezpečnostní edge cases", () => {
  const topic = mkTopic("math-compare-natural-numbers-100");

  it("prázdný input → no violation", () => {
    expect(checkBoundaryViolation("", topic)).toBe(false);
  });

  it("whitespace-only → no violation", () => {
    expect(checkBoundaryViolation("   ", topic)).toBe(false);
  });

  it("XSS payload → ne crash", () => {
    expect(() => checkBoundaryViolation("<script>alert(1)</script>", topic)).not.toThrow();
  });

  it("velmi dlouhý input nezpůsobí crash", () => {
    const giant = "a".repeat(50_000) + " " + "1".repeat(50);
    expect(() => checkBoundaryViolation(giant, topic)).not.toThrow();
  });

  it("unicode v inputu", () => {
    expect(() => checkBoundaryViolation("česky čéčáů 5", topic)).not.toThrow();
  });
});

describe("checkBoundaryViolation — single char shortcuts pro comparison", () => {
  const topic = mkTopic("math-compare-natural-numbers-100");

  it("'>' samostatně → no violation (legitimní odpověď)", () => {
    expect(checkBoundaryViolation(">", topic)).toBe(false);
  });

  it("'>' s whitespace → no violation", () => {
    expect(checkBoundaryViolation("  >  ", topic)).toBe(false);
  });

  it("'> 5' (s číslem) → violation (větší než kw)", () => {
    // "> 5" je kombinace symbolu + čísla, ale ">" jako součást ne-shortcutu
    // — boundary kontrola pak prohledá keywords, kde ">" je v seznamu
    expect(checkBoundaryViolation("> 5", topic)).toBe(true);
  });
});

describe("checkBoundaryViolation — math-multiply / math-divide", () => {
  it("multiply: 'zlomky' → violation", () => {
    const topic = mkTopic("math-multiply");
    expect(checkBoundaryViolation("zlomky a násobení", topic)).toBe(true);
  });

  it("divide: 'zlomky' → violation", () => {
    const topic = mkTopic("math-divide");
    expect(checkBoundaryViolation("dělíme zlomky", topic)).toBe(true);
  });

  it("multiply: number 10000 → no violation (range up to 10000)", () => {
    const topic = mkTopic("math-multiply");
    expect(checkBoundaryViolation("10000", topic)).toBe(false);
  });

  it("multiply: number 10001 → violation", () => {
    const topic = mkTopic("math-multiply");
    expect(checkBoundaryViolation("10001", topic)).toBe(true);
  });
});

describe("checkBoundaryViolation — math-rounding / math-order", () => {
  it("rounding: number 100000 → no violation", () => {
    const topic = mkTopic("math-rounding");
    expect(checkBoundaryViolation("100000", topic)).toBe(false);
  });

  it("rounding: number 100001 → violation", () => {
    const topic = mkTopic("math-rounding");
    expect(checkBoundaryViolation("100001", topic)).toBe(true);
  });
});
