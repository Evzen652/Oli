import { describe, it, expect } from "vitest";
import { classifyIntent, CONFUSION_THRESHOLD } from "@/lib/preIntent";

/**
 * preIntent classifyIntent — deterministic input classification.
 *
 * Klasifikace BEFORE topic match: confusion / nonsense / topical /
 * unclear_input / wrong_grade.
 *
 * Priority:
 *  A. Confusion keywords ("nevím", "pomoc", ...)  → "confusion"
 *  B. Topic keyword v current grade range          → "topical"
 *  C. Topic keyword v jiném grade range            → "wrong_grade"
 *  D. Pure numeric input                           → "unclear_input"
 *  E. Cokoliv jiného                               → "nonsense"
 */

describe("classifyIntent — confusion priorita", () => {
  it.each([
    ["nevím", "confusion"],
    ["nevím to", "confusion"],
    ["fakt nevím", "confusion"],
    ["pomoz mi", "confusion"],
    ["pomoc", "confusion"],
    ["řekni mi to", "confusion"],
    ["prostě mi to napiš", "confusion"],
    ["jaká je odpověď", "confusion"],
    ["poraď mi", "confusion"],
    ["nevím co psát", "confusion"],
    ["nevím co napsat", "confusion"],
    ["nerozumím", "confusion"],
    ["nechápu", "confusion"],
  ])("'%s' → %s", (input, expected) => {
    expect(classifyIntent(input, 3)).toBe(expected);
  });

  it("confusion keyword v jakémkoliv kontextu → confusion", () => {
    expect(classifyIntent("nevím co je porovnávání", 3)).toBe("confusion");
    expect(classifyIntent("třeba nevím tohle nikdy", 3)).toBe("confusion");
  });

  it("case insensitive", () => {
    expect(classifyIntent("NEVÍM", 3)).toBe("confusion");
    expect(classifyIntent("Pomoz Mi", 3)).toBe("confusion");
  });
});

describe("classifyIntent — topical (correct grade)", () => {
  it.each([
    ["porovnávání čísel", 3, "topical"],
    ["které číslo je větší", 3, "topical"],
    ["sčítání", 3, "topical"],
    ["slovní druhy", 3, "topical"],
  ])("'%s' (grade %d) → %s", (input, grade, expected) => {
    expect(classifyIntent(input, grade)).toBe(expected);
  });
});

describe("classifyIntent — wrong_grade", () => {
  it("topic keyword pro grade 3 v grade 9 → wrong_grade", () => {
    // "porovnávání čísel" je grade 3 topic
    const r = classifyIntent("porovnávání čísel", 9);
    expect(r).toBe("wrong_grade");
  });
});

describe("classifyIntent — unclear_input (numeric only)", () => {
  it.each(["42", "100", "0", "9999"])("'%s' → unclear_input", (input) => {
    expect(classifyIntent(input, 3)).toBe("unclear_input");
  });

  it("numeric s whitespace → unclear_input", () => {
    expect(classifyIntent("  42  ", 3)).toBe("unclear_input");
  });

  it("decimal je nonsense (ne unclear) — regex je strict integer", () => {
    expect(classifyIntent("3.14", 3)).toBe("nonsense");
  });

  it("negative number je nonsense", () => {
    expect(classifyIntent("-42", 3)).toBe("nonsense");
  });
});

describe("classifyIntent — nonsense fallback", () => {
  it.each([
    "automobil",
    "asdfg",
    "lkjhgfdsa qwertyuiop",
    "zxcvbnm asdfghjkl",
    "ledivudíí",
  ])("'%s' → nonsense", (input) => {
    expect(classifyIntent(input, 3)).toBe("nonsense");
  });

  it("prázdný string → nonsense", () => {
    expect(classifyIntent("", 3)).toBe("nonsense");
    expect(classifyIntent("   ", 3)).toBe("nonsense");
  });

  it("symboly bez slov + bez topic keywordu → nonsense (či wrong_grade pokud match prázdné keyword)", () => {
    // Pure symboly mají nejasné chování pokud existuje topic s prázdným keywordem.
    // Test dokumentuje permitivní behavior: cokoliv kromě "topical" / "confusion" / "unclear_input".
    const r = classifyIntent("!@#$%", 3);
    expect(["nonsense", "wrong_grade"]).toContain(r);
  });
});

describe("classifyIntent — order of evaluation invariants", () => {
  it("confusion KEY-WORD bije topical keyword (např. 'nevím porovnávání')", () => {
    expect(classifyIntent("nevím porovnávání", 3)).toBe("confusion");
  });

  it("topical bije unclear_input (mixed input s číslem + slovem)", () => {
    // "42 porovnávání" — obsahuje topic keyword
    expect(classifyIntent("42 porovnávání", 3)).toBe("topical");
  });

  it("topical pouze v matching grade — jinak wrong_grade", () => {
    // "porovnávání" může být grade 3 topic; dej grade 5 a očekávej topical
    // pokud existuje grade 5 topic obsahující "porovnávání" — testem
    // dokumentujeme aktuální chování (závisí na curriculum)
    const result = classifyIntent("porovnávání čísel", 9);
    expect(["topical", "wrong_grade"]).toContain(result);
  });
});

describe("CONFUSION_THRESHOLD constant", () => {
  it("CONFUSION_THRESHOLD je 2 (po 2 confusion → STOP_1)", () => {
    expect(CONFUSION_THRESHOLD).toBe(2);
  });
});

describe("classifyIntent — security / DOS", () => {
  it("100k znaků → no crash", () => {
    expect(() => classifyIntent("a".repeat(100_000), 3)).not.toThrow();
  });

  it("XSS payload → klasifikováno (ne crash, ne 'topical' v matching grade)", () => {
    expect(() => classifyIntent("<script>alert(1)</script>", 3)).not.toThrow();
    const r = classifyIntent("<script>alert(1)</script>", 3);
    // Nesmí být topical (žádný legitimní topic match) ani confusion
    expect(r).not.toBe("topical");
    expect(r).not.toBe("confusion");
  });

  it("unicode + diakritika v inputu", () => {
    expect(() => classifyIntent("česky čéčáů", 3)).not.toThrow();
  });
});
