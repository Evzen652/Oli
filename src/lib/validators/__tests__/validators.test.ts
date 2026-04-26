import { describe, it, expect } from "vitest";
import {
  stringExactValidator,
  numericToleranceValidator,
  fractionValidator,
  setMatchValidator,
  orderedSequenceValidator,
  algebraicEquivalenceValidator,
  multiStepValidator,
  validateAnswer,
  getDefaultValidator,
} from "../index";

describe("stringExactValidator", () => {
  it("matches exact", () => {
    expect(stringExactValidator.validate("ano", "ano").correct).toBe(true);
  });
  it("ignores case + whitespace", () => {
    expect(stringExactValidator.validate("  ANO ", "ano").correct).toBe(true);
  });
  it("rejects different", () => {
    expect(stringExactValidator.validate("ano", "ne").correct).toBe(false);
  });
  it("handles diacritics correctly", () => {
    expect(stringExactValidator.validate("Příloha", "příloha").correct).toBe(true);
  });
});

describe("numericToleranceValidator", () => {
  it("matches exact integers", () => {
    expect(numericToleranceValidator.validate("42", "42").correct).toBe(true);
  });
  it("matches with comma decimal", () => {
    expect(numericToleranceValidator.validate("3,14", "3.14").correct).toBe(true);
  });
  it("tolerates 0.001 absolute", () => {
    expect(numericToleranceValidator.validate("0.3334", "0.333").correct).toBe(true);
  });
  it("rejects too far", () => {
    expect(numericToleranceValidator.validate("0.4", "0.333").correct).toBe(false);
  });
  it("returns not_a_number for garbage", () => {
    expect(numericToleranceValidator.validate("abc", "42").errorType).toBe("not_a_number");
  });
});

describe("setMatchValidator", () => {
  it("matches same set in any order", () => {
    expect(setMatchValidator.validate("a,b,c", "c,a,b").correct).toBe(true);
  });
  it("rejects missing item", () => {
    expect(setMatchValidator.validate("a,b", "a,b,c").correct).toBe(false);
  });
});

describe("orderedSequenceValidator", () => {
  it("matches same order", () => {
    expect(orderedSequenceValidator.validate("1,2,3", "1,2,3").correct).toBe(true);
  });
  it("rejects different order", () => {
    expect(orderedSequenceValidator.validate("1,3,2", "1,2,3").correct).toBe(false);
  });
});

describe("algebraicEquivalenceValidator", () => {
  it("matches identical normalized", () => {
    expect(algebraicEquivalenceValidator.validate("x+1", "x + 1").correct).toBe(true);
  });
  it("matches fraction vs decimal", () => {
    expect(algebraicEquivalenceValidator.validate("0.5", "0.5").correct).toBe(true);
  });
});

describe("multiStepValidator", () => {
  it("returns correct=true when all steps match", () => {
    const r = multiStepValidator.validate("a|b|c", "a|b|c");
    expect(r.correct).toBe(true);
    expect(r.partialScore).toBe(1);
  });
  it("returns partial score for partial match", () => {
    const r = multiStepValidator.validate("a|wrong|c", "a|b|c");
    expect(r.correct).toBe(false);
    expect(r.partialScore).toBeCloseTo(2 / 3, 2);
  });
});

describe("validateAnswer dispatch", () => {
  it("uses numeric validator for number inputType", () => {
    expect(validateAnswer("3,14", "3.14", { inputType: "number" }).correct).toBe(true);
  });
  it("uses string for select_one", () => {
    expect(validateAnswer("ano", "ANO", { inputType: "select_one" }).correct).toBe(true);
  });
  it("uses set for multi_select", () => {
    expect(validateAnswer("b,a", "a,b", { inputType: "multi_select" }).correct).toBe(true);
  });
});

describe("getDefaultValidator", () => {
  it("maps inputTypes correctly", () => {
    expect(getDefaultValidator("number").id).toBe("numeric_tolerance");
    expect(getDefaultValidator("fraction").id).toBe("fraction");
    expect(getDefaultValidator("multi_select").id).toBe("set_match");
    expect(getDefaultValidator("drag_order").id).toBe("ordered_sequence");
    expect(getDefaultValidator("text").id).toBe("string_exact");
  });
});

// ─── fractionValidator ───────────────────────────────────────────────────
describe("fractionValidator", () => {
  it("matches identical fractions", () => {
    expect(fractionValidator.validate("3/8", "3/8").correct).toBe(true);
  });

  it("EQUIVALENCE: 3/8 = 6/16 = 9/24", () => {
    expect(fractionValidator.validate("6/16", "3/8").correct).toBe(true);
    expect(fractionValidator.validate("9/24", "3/8").correct).toBe(true);
    expect(fractionValidator.validate("3/8", "9/24").correct).toBe(true);
  });

  it("EQUIVALENCE: 1/2 = 5/10 = 50/100", () => {
    expect(fractionValidator.validate("5/10", "1/2").correct).toBe(true);
    expect(fractionValidator.validate("50/100", "1/2").correct).toBe(true);
  });

  it("rejects different values", () => {
    expect(fractionValidator.validate("3/8", "5/8").correct).toBe(false);
    expect(fractionValidator.validate("3/8", "3/7").correct).toBe(false);
  });

  it("integer ↔ fraction equivalence", () => {
    expect(fractionValidator.validate("2", "4/2").correct).toBe(true);
    expect(fractionValidator.validate("3", "9/3").correct).toBe(true);
    expect(fractionValidator.validate("0", "0/5").correct).toBe(true);
  });

  it("decimal ↔ fraction (with tolerance)", () => {
    expect(fractionValidator.validate("0.5", "1/2").correct).toBe(true);
    expect(fractionValidator.validate("0,5", "1/2").correct).toBe(true);
    expect(fractionValidator.validate("0.25", "1/4").correct).toBe(true);
  });

  it("mixed numbers", () => {
    // "1 1/2" = 1 + 1/2 = 3/2
    expect(fractionValidator.validate("1 1/2", "3/2").correct).toBe(true);
    expect(fractionValidator.validate("2 1/4", "9/4").correct).toBe(true);
  });

  it("negative fractions", () => {
    expect(fractionValidator.validate("-3/4", "-3/4").correct).toBe(true);
    expect(fractionValidator.validate("-3/4", "-6/8").correct).toBe(true);
    expect(fractionValidator.validate("3/4", "-3/4").correct).toBe(false);
  });

  it("zero denominator returns error", () => {
    const r = fractionValidator.validate("3/0", "3/0");
    expect(r.correct).toBe(false);
    expect(r.errorType).toMatch(/denominator|invalid/);
  });

  it("invalid format returns error", () => {
    expect(fractionValidator.validate("abc", "1/2").correct).toBe(false);
    expect(fractionValidator.validate("", "1/2").correct).toBe(false);
  });

  it("whitespace tolerated", () => {
    expect(fractionValidator.validate(" 1/2 ", "1/2").correct).toBe(true);
    expect(fractionValidator.validate("3 / 8", "3/8").correct).toBe(false); // mezery uvnitř — restriktivní
  });
});
