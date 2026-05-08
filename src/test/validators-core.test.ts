/**
 * Validators — komplexní testy všech validátorů a hlavního vstupního bodu.
 *
 * Pokrývá: stringExact, numericTolerance, setMatch, orderedSequence,
 *           fraction, algebraicEquivalence, multiStep, numericRange,
 *           validateAnswer (dispatch + defaultValidator logic).
 */
import { describe, it, expect } from "vitest";
import {
  stringExactValidator,
  numericToleranceValidator,
  setMatchValidator,
  orderedSequenceValidator,
  fractionValidator,
  algebraicEquivalenceValidator,
  multiStepValidator,
  numericRangeValidator,
  validateAnswer,
} from "@/lib/validators/index";

// ─────────────────────────────────────────────────────────
// stringExactValidator
// ─────────────────────────────────────────────────────────
describe("stringExactValidator", () => {
  it("přesná shoda → correct: true", () => {
    expect(stringExactValidator.validate("pes", "pes").correct).toBe(true);
  });
  it("case-insensitive → correct: true", () => {
    expect(stringExactValidator.validate("PES", "pes").correct).toBe(true);
  });
  it("přebytečné mezery ignorovány", () => {
    expect(stringExactValidator.validate("  pes  ", "pes").correct).toBe(true);
  });
  it("unicode NFC normalizace (diakritika)", () => {
    // 'č' může přijít jako composed nebo decomposed
    const composed = "č"; // č (NFC)
    const decomposed = "č"; // c + combining caron (NFD)
    expect(stringExactValidator.validate(decomposed, composed).correct).toBe(true);
  });
  it("špatná odpověď → correct: false, errorType: wrong_string", () => {
    const r = stringExactValidator.validate("kočka", "pes");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("wrong_string");
  });
  it("prázdná odpověď vs prázdný expected → true", () => {
    expect(stringExactValidator.validate("", "").correct).toBe(true);
  });
  it("prázdná odpověď vs neprázdný expected → false", () => {
    expect(stringExactValidator.validate("", "pes").correct).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// numericToleranceValidator
// ─────────────────────────────────────────────────────────
describe("numericToleranceValidator", () => {
  it("přesná shoda celých čísel", () => {
    expect(numericToleranceValidator.validate("42", "42").correct).toBe(true);
  });
  it("desetinná čárka jako oddělovač", () => {
    expect(numericToleranceValidator.validate("3,14", "3.14").correct).toBe(true);
  });
  it("v toleranci 0.001", () => {
    expect(numericToleranceValidator.validate("0.333", "0.3333").correct).toBe(true);
  });
  it("mimo toleranci → false", () => {
    expect(numericToleranceValidator.validate("4", "5").correct).toBe(false);
  });
  it("text místo čísla → errorType: not_a_number", () => {
    const r = numericToleranceValidator.validate("abc", "5");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("not_a_number");
  });
  it("záporné číslo", () => {
    expect(numericToleranceValidator.validate("-7", "-7").correct).toBe(true);
  });
  it("nula", () => {
    expect(numericToleranceValidator.validate("0", "0").correct).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// setMatchValidator
// ─────────────────────────────────────────────────────────
describe("setMatchValidator", () => {
  it("stejné položky ve stejném pořadí → true", () => {
    expect(setMatchValidator.validate("a,b,c", "a,b,c").correct).toBe(true);
  });
  it("stejné položky v jiném pořadí → true (pořadí nezáleží)", () => {
    expect(setMatchValidator.validate("c,a,b", "a,b,c").correct).toBe(true);
  });
  it("case-insensitive", () => {
    expect(setMatchValidator.validate("A,B", "a,b").correct).toBe(true);
  });
  it("jiný počet → false, wrong_count", () => {
    const r = setMatchValidator.validate("a,b", "a,b,c");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("wrong_count");
  });
  it("jiné položky → false, wrong_items", () => {
    const r = setMatchValidator.validate("a,b,x", "a,b,c");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("wrong_items");
  });
  it("bílé znaky kolem čárek ignorovány", () => {
    expect(setMatchValidator.validate("a , b , c", "a,b,c").correct).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// orderedSequenceValidator
// ─────────────────────────────────────────────────────────
describe("orderedSequenceValidator", () => {
  it("správné pořadí → true", () => {
    expect(orderedSequenceValidator.validate("a,b,c", "a,b,c").correct).toBe(true);
  });
  it("špatné pořadí → false, wrong_order", () => {
    const r = orderedSequenceValidator.validate("b,a,c", "a,b,c");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("wrong_order");
  });
  it("jiná délka → false, wrong_length", () => {
    const r = orderedSequenceValidator.validate("a,b", "a,b,c");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("wrong_length");
  });
  it("case-insensitive", () => {
    expect(orderedSequenceValidator.validate("A,B,C", "a,b,c").correct).toBe(true);
  });
  it("jeden prvek", () => {
    expect(orderedSequenceValidator.validate("x", "x").correct).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// fractionValidator
// ─────────────────────────────────────────────────────────
describe("fractionValidator", () => {
  it("stejné zlomky → true", () => {
    expect(fractionValidator.validate("3/8", "3/8").correct).toBe(true);
  });
  it("ekvivalentní zlomky (6/16 = 3/8) → true", () => {
    expect(fractionValidator.validate("6/16", "3/8").correct).toBe(true);
  });
  it("1/2 = 0.5 → true", () => {
    expect(fractionValidator.validate("1/2", "0.5").correct).toBe(true);
  });
  it("desetinná čárka", () => {
    expect(fractionValidator.validate("0,5", "1/2").correct).toBe(true);
  });
  it("smíšené číslo: 1 1/2 = 3/2 → true", () => {
    expect(fractionValidator.validate("1 1/2", "3/2").correct).toBe(true);
  });
  it("záporný zlomek: -3/4 → true", () => {
    expect(fractionValidator.validate("-3/4", "-3/4").correct).toBe(true);
  });
  it("různé hodnoty → false", () => {
    expect(fractionValidator.validate("1/3", "1/4").correct).toBe(false);
  });
  it("nevalidní formát → errorType: answer_invalid_format", () => {
    const r = fractionValidator.validate("abc", "1/2");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("answer_invalid_format");
  });
  it("celé číslo jako expected: 4 = 8/2 → true", () => {
    expect(fractionValidator.validate("8/2", "4").correct).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// algebraicEquivalenceValidator
// ─────────────────────────────────────────────────────────
describe("algebraicEquivalenceValidator", () => {
  it("stejný výraz → true", () => {
    expect(algebraicEquivalenceValidator.validate("x+1", "x+1").correct).toBe(true);
  });
  it("mezery ignorovány", () => {
    expect(algebraicEquivalenceValidator.validate("x + 1", "x+1").correct).toBe(true);
  });
  it("hvězdičky (násobení) ignorovány", () => {
    expect(algebraicEquivalenceValidator.validate("2*x", "2x").correct).toBe(true);
  });
  it("jiný výraz → false", () => {
    expect(algebraicEquivalenceValidator.validate("x+2", "x+1").correct).toBe(false);
  });
  it("čísla: 0.5 ≈ 0.500 → true", () => {
    expect(algebraicEquivalenceValidator.validate("0.5", "0.500").correct).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// multiStepValidator
// ─────────────────────────────────────────────────────────
describe("multiStepValidator", () => {
  it("všechny kroky správně → correct: true, partialScore: 1", () => {
    const r = multiStepValidator.validate("krok1|krok2|krok3", "krok1|krok2|krok3");
    expect(r.correct).toBe(true);
    expect(r.partialScore).toBe(1);
  });
  it("jeden špatný krok → partialScore < 1, correct: false", () => {
    const r = multiStepValidator.validate("krok1|ŠPATNĚ|krok3", "krok1|krok2|krok3");
    expect(r.correct).toBe(false);
    expect(r.partialScore).toBeCloseTo(2 / 3);
  });
  it("všechny kroky špatně → partialScore: 0", () => {
    const r = multiStepValidator.validate("x|y|z", "a|b|c");
    expect(r.correct).toBe(false);
    expect(r.partialScore).toBe(0);
  });
  it("prázdný expected → correct: false (split na [''] dá 1 krok, žák neuspěje)", () => {
    // "" se rozdělí na [""] — 1 prázdný krok, žák "krok1" nesedí
    const r = multiStepValidator.validate("krok1", "");
    expect(r.correct).toBe(false);
  });
  it("case-insensitive kroky", () => {
    const r = multiStepValidator.validate("KROK1|krok2", "krok1|krok2");
    expect(r.correct).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// numericRangeValidator
// ─────────────────────────────────────────────────────────
describe("numericRangeValidator", () => {
  it("přesná hodnota → true", () => {
    expect(numericRangeValidator.validate("5", "5").correct).toBe(true);
  });
  it("rozsah min..max, hodnota uvnitř → true", () => {
    expect(numericRangeValidator.validate("5", "3..7").correct).toBe(true);
  });
  it("rozsah min..max, hodnota mimo → false, out_of_range", () => {
    const r = numericRangeValidator.validate("10", "3..7");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("out_of_range");
  });
  it("tolerance: 5.5±0.1, hodnota 5.55 → true", () => {
    expect(numericRangeValidator.validate("5.55", "5.5±0.1").correct).toBe(true);
  });
  it("tolerance: 5.5±0.1, hodnota 5.7 → false", () => {
    expect(numericRangeValidator.validate("5.7", "5.5±0.1").correct).toBe(false);
  });
  it("středníkový rozsah: 3;7 → funguje stejně jako ..", () => {
    expect(numericRangeValidator.validate("5", "3;7").correct).toBe(true);
  });
  it("nečíselný vstup → false, not_a_number", () => {
    const r = numericRangeValidator.validate("abc", "5");
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe("not_a_number");
  });
});

// ─────────────────────────────────────────────────────────
// validateAnswer — dispatch logika
// ─────────────────────────────────────────────────────────
describe("validateAnswer — dispatch", () => {
  it("bez inputType → text (stringExact fallback)", () => {
    expect(validateAnswer("ahoj", "ahoj").correct).toBe(true);
    expect(validateAnswer("ahoj", "čau").correct).toBe(false);
  });
  it("inputType: number → numericTolerance", () => {
    expect(validateAnswer("42", "42", { inputType: "number" }).correct).toBe(true);
    expect(validateAnswer("abc", "42", { inputType: "number" }).correct).toBe(false);
  });
  it("inputType: fraction → fractionValidator", () => {
    expect(validateAnswer("3/8", "6/16", { inputType: "fraction" }).correct).toBe(true);
  });
  it("inputType: multi_select → setMatch (pořadí nezáleží)", () => {
    expect(validateAnswer("c,a,b", "a,b,c", { inputType: "multi_select" }).correct).toBe(true);
  });
  it("inputType: drag_order → orderedSequence (pořadí záleží)", () => {
    expect(validateAnswer("b,a", "a,b", { inputType: "drag_order" }).correct).toBe(false);
  });
  it("explicitní validatorId přepíše inputType", () => {
    // fraction validátor i pro inputType 'text'
    expect(validateAnswer("6/16", "3/8", { inputType: "text", validatorId: "fraction" }).correct).toBe(true);
  });
  it("self-validation: correctAnswer projde vlastním validátorem", () => {
    // Invariant: každá correctAnswer musí projít svým vlastním validátorem
    const cases: Array<[string, string]> = [
      ["42", "number"],
      ["3/8", "fraction"],
      ["a,b,c", "multi_select"],
      ["x,y,z", "drag_order"],
      ["hello", "text"],
    ];
    for (const [answer, inputType] of cases) {
      const r = validateAnswer(answer, answer, { inputType });
      expect(r.correct, `Self-validation selhala pro ${inputType}: "${answer}"`).toBe(true);
    }
  });
});
