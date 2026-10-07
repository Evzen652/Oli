import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSubjectMeta, SUBJECTS } from "@/lib/subjectRegistry";
import { validateTaskForInputType, filterValidTasks } from "@/lib/taskValidator";
import type { PracticeTask } from "@/lib/types";

/**
 * Lib utility coverage:
 *  - subjectRegistry: known subject lookup + dynamic fallback
 *  - taskValidator: per-inputType validation + filterValidTasks
 */

beforeEach(() => {
  vi.clearAllMocks();
});

describe("subjectRegistry — known subjects", () => {
  it.each(["matematika", "čeština", "prvouka", "přírodověda", "vlastivěda"])(
    "%s má všechny required fields",
    (subject) => {
      const meta = getSubjectMeta(subject);
      expect(meta.label).toBeTruthy();
      expect(meta.emoji).toBeTruthy();
      expect(meta.tintClass).toBeTruthy();
      expect(meta.borderClass).toBeTruthy();
      expect(meta.color).toBeTruthy();
      expect(meta.accentClass).toBeTruthy();
    }
  );

  it("matematika má hook string", () => {
    expect(getSubjectMeta("matematika").hook).toBeTruthy();
  });

  it("matematika emoji = 🔢", () => {
    expect(getSubjectMeta("matematika").emoji).toBe("🔢");
  });
});

describe("subjectRegistry — dynamic fallback pro neznámý subject", () => {
  it("neznámý subject → fallback meta s emoji + classes", () => {
    const meta = getSubjectMeta("hudebka");
    expect(meta.label).toBe("Hudebka"); // Capitalized
    expect(meta.emoji).toBeTruthy();
    expect(meta.tintClass).toContain("bg-");
    expect(meta.borderClass).toContain("border-");
  });

  it("deterministic fallback: stejný subject → stejný emoji + hue", () => {
    const a = getSubjectMeta("xx-neznamy");
    const b = getSubjectMeta("xx-neznamy");
    expect(a.emoji).toBe(b.emoji);
    expect(a.tintClass).toBe(b.tintClass);
  });

  it("různé subjects mají různé hue", () => {
    const a = getSubjectMeta("xx-aaa");
    const b = getSubjectMeta("xx-bbb");
    // Possibly stejný (hash collision), ale typicky jiný
    expect([a.tintClass !== b.tintClass, a.emoji !== b.emoji].some(Boolean)).toBe(true);
  });

  it("fallback emoji je z sady fallback emojis", () => {
    const validEmojis = ["📚", "🧪", "🎨", "🌐", "🔬", "🎵", "🏛️", "💡"];
    const meta = getSubjectMeta("xx-test-123");
    expect(validEmojis).toContain(meta.emoji);
  });

  it("Empty subject → fallback no crash", () => {
    expect(() => getSubjectMeta("")).not.toThrow();
  });
});

describe("subjectRegistry — SUBJECTS constant", () => {
  it("má aspoň 5 known subjects", () => {
    expect(Object.keys(SUBJECTS).length).toBeGreaterThanOrEqual(5);
  });

  it("všechny entries mají label + emoji + classes", () => {
    Object.entries(SUBJECTS).forEach(([key, meta]) => {
      expect(meta.label, key).toBeTruthy();
      expect(meta.emoji, key).toBeTruthy();
      expect(meta.tintClass, key).toContain("bg-");
    });
  });
});

// ─────────────────────────────────────────────────────────
// taskValidator
// ─────────────────────────────────────────────────────────

describe("validateTaskForInputType — universal requirements", () => {
  const valid: PracticeTask = { question: "Q?", correctAnswer: "A" };

  it("missing question → false", () => {
    expect(validateTaskForInputType({ ...valid, question: "" }, "text")).toBe(false);
  });

  it("missing correctAnswer → false", () => {
    expect(validateTaskForInputType({ ...valid, correctAnswer: "" }, "text")).toBe(false);
  });

  it("whitespace-only question/answer → false", () => {
    expect(validateTaskForInputType({ ...valid, question: "   " }, "text")).toBe(false);
    expect(validateTaskForInputType({ ...valid, correctAnswer: "   " }, "text")).toBe(false);
  });

  it("text inputType + non-empty Q/A → valid", () => {
    expect(validateTaskForInputType(valid, "text")).toBe(true);
  });
});

describe("validateTaskForInputType — comparison", () => {
  it.each(["<", "=", ">"])("'%s' jako correctAnswer → valid", (sym) => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: sym }, "comparison")).toBe(true);
  });

  it("non-symbol → invalid", () => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: "5" }, "comparison")).toBe(false);
  });
});

describe("validateTaskForInputType — select_one", () => {
  it("options array + correctAnswer in options → valid", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "A", options: ["A", "B", "C"] },
        "select_one"
      )
    ).toBe(true);
  });

  it("missing options → invalid", () => {
    expect(
      validateTaskForInputType({ question: "Q", correctAnswer: "A" }, "select_one")
    ).toBe(false);
  });

  it("correctAnswer NEN� v options → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "X", options: ["A", "B"] },
        "select_one"
      )
    ).toBe(false);
  });

  it("only 1 option → invalid (needs at least 2)", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "A", options: ["A"] },
        "select_one"
      )
    ).toBe(false);
  });

  it("i/y option set vyžaduje 1 underscore v question", () => {
    expect(
      validateTaskForInputType(
        { question: "b_l", correctAnswer: "y", options: ["i", "y"] },
        "select_one"
      )
    ).toBe(true);
  });

  it("i/y option bez underscore → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "byl", correctAnswer: "y", options: ["i", "y"] },
        "select_one"
      )
    ).toBe(false);
  });

  it("i/y option s 2+ underscores → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "b_l_", correctAnswer: "y", options: ["i", "y"] },
        "select_one"
      )
    ).toBe(false);
  });
});

describe("validateTaskForInputType — fraction", () => {
  it.each(["3/8", "1/2", "0/1", "10/20"])("'%s' → valid", (frac) => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: frac }, "fraction")).toBe(true);
  });

  it.each(["abc", "1.5", "1/0/2", "1.5/2"])("'%s' → invalid", (frac) => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: frac }, "fraction")).toBe(false);
  });

  it("celé číslo (3) → valid (zlomek 3/1)", () => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: "3" }, "fraction")).toBe(true);
  });
});

describe("validateTaskForInputType — fill_blank", () => {
  it("question s 1 _ + 1 blank → valid", () => {
    expect(
      validateTaskForInputType(
        { question: "Doplň _", correctAnswer: "x", blanks: ["x"] },
        "fill_blank"
      )
    ).toBe(true);
  });

  it("question bez underscores → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "Doplň text", correctAnswer: "x", blanks: ["x"] },
        "fill_blank"
      )
    ).toBe(false);
  });

  it("blanks count ≠ underscore count → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "_ _ _", correctAnswer: "x", blanks: ["a", "b"] },
        "fill_blank"
      )
    ).toBe(false);
  });
});

describe("validateTaskForInputType — drag_order / match_pairs / multi_select / categorize", () => {
  it("drag_order: items array s ≥2 → valid", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "a,b", items: ["a", "b"] },
        "drag_order"
      )
    ).toBe(true);
  });

  it("drag_order: items < 2 → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "a", items: ["a"] },
        "drag_order"
      )
    ).toBe(false);
  });

  it("match_pairs: ≥3 párů → valid", () => {
    expect(
      validateTaskForInputType(
        {
          question: "Q",
          correctAnswer: "[]",
          pairs: [{ left: "a", right: "1" }, { left: "b", right: "2" }, { left: "c", right: "3" }],
        },
        "match_pairs"
      )
    ).toBe(true);
  });

  it("multi_select: correctAnswers ≥ 1 → valid", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "x", correctAnswers: ["x", "y"] },
        "multi_select"
      )
    ).toBe(true);
  });

  it("multi_select: prázdné correctAnswers → invalid", () => {
    expect(
      validateTaskForInputType(
        { question: "Q", correctAnswer: "x", correctAnswers: [] },
        "multi_select"
      )
    ).toBe(false);
  });

  it("categorize: ≥ 2 kategorie → valid", () => {
    expect(
      validateTaskForInputType(
        {
          question: "Q",
          correctAnswer: "{}",
          categories: [{ name: "A", items: ["x"] }, { name: "B", items: ["y"] }],
        },
        "categorize"
      )
    ).toBe(true);
  });
});

describe("validateTaskForInputType — number", () => {
  it.each(["42", "-3", "1.5", "1,5", "0", "100"])("'%s' → valid", (num) => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: num }, "number")).toBe(true);
  });

  it.each(["abc", "1.5.5", "--3", "1/2"])("'%s' → invalid", (num) => {
    expect(validateTaskForInputType({ question: "Q", correctAnswer: num }, "number")).toBe(false);
  });
});

describe("filterValidTasks", () => {
  it("vrátí jen validní tasks pro daný inputType", () => {
    const tasks: PracticeTask[] = [
      { question: "Q1", correctAnswer: ">" },          // valid comparison
      { question: "Q2", correctAnswer: "5" },          // invalid comparison
      { question: "Q3", correctAnswer: "<" },          // valid comparison
    ];
    const valid = filterValidTasks(tasks, "comparison");
    expect(valid).toHaveLength(2);
    expect(valid.every((t) => ["<", ">"].includes(t.correctAnswer))).toBe(true);
  });

  it("prázdný array → prázdný output", () => {
    expect(filterValidTasks([], "text")).toEqual([]);
  });

  it("všechny invalid → prázdný output (s console.warn)", () => {
    const tasks: PracticeTask[] = [
      { question: "Q", correctAnswer: "abc" },
    ];
    expect(filterValidTasks(tasks, "number")).toEqual([]);
  });
});
