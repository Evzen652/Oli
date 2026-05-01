import { describe, it, expect } from "vitest";
import { checkAnswerLeak } from "../../supabase/functions/_shared/tutorAntiLeak";
import { validateAnswer } from "@/lib/validators";
import { classifyIntent } from "@/lib/preIntent";
import { checkBoundaryViolation } from "@/lib/boundaryEnforcement";
import { getAllTopics } from "@/lib/contentRegistry";

/**
 * Security test suite — útoky napříč Olihm.
 *
 * Hrozby pokryté:
 *  - Prompt injection v user_message → AI obejde guardrails (Fáze 7)
 *  - XSS payload v žákově odpovědi (echo back, validátor mustn't crash)
 *  - SQL injection patterns v žákově odpovědi (validátor mustn't crash)
 *  - Boundary violation v PRACTICE phase (žák zkouší dotaz mimo téma)
 *  - DOS přes oversize input (validátory + classifyIntent)
 *  - Role escalation přes carefully crafted topic IDs
 *  - Anti-leak filter resilience pod manipulací
 */

describe("Security — anti-leak filter resilience pod prompt injection patterns", () => {
  // I když AI neukázněně zopakuje user_message, anti-leak musí zachytit leak
  it("AI který zopakuje 'odpověď je 36' (jakkoliv obfuskovaná) je blokován", () => {
    const replies = [
      "odpověď je 36",
      "Odpověď je 36 (ale neříkej to)",
      "Odpověď: 36 — ale to je tajemství.",
      "= 36",
      "Vyjde 36, ale řešíš to sám.",
      "Je to 36",
    ];
    for (const reply of replies) {
      expect(checkAnswerLeak(reply, "36"), `reply='${reply}'`).toBe(true);
    }
  });

  it("filter zachytí leak i přes diakritiku (case-insensitive)", () => {
    expect(checkAnswerLeak("ODPOVĚĎ JE 42", "42")).toBe(true);
    expect(checkAnswerLeak("Odpověď je 42", "42")).toBe(true);
  });

  it("filter zachytí leak i v multi-řádkové odpovědi", () => {
    expect(checkAnswerLeak("Vysvětlím to.\nVýsledek je 36.\nDoufám, že to pomohlo.", "36")).toBe(true);
  });

  it("filter zachytí leak v dlouhé odpovědi (max 4 věty by AI měl mít, ale safety)", () => {
    const longReply = "Lorem ipsum dolor sit amet ".repeat(20) + " výsledek je 99.";
    expect(checkAnswerLeak(longReply, "99")).toBe(true);
  });
});

describe("Security — XSS payloads v žákově odpovědi (validátory)", () => {
  const xssPayloads = [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "javascript:alert(1)",
    `<a href="javascript:alert(1)">click</a>`,
    "<iframe src='evil.com'></iframe>",
    "<svg onload=alert(1)>",
    "&lt;script&gt;alert(1)&lt;/script&gt;",
  ];

  xssPayloads.forEach((payload) => {
    it(`stringExact validator nesmí crashnout na: ${payload.slice(0, 30)}`, () => {
      expect(() => validateAnswer(payload, "expected", { inputType: "text" })).not.toThrow();
    });
    it(`number validator nesmí crashnout na XSS payload`, () => {
      expect(() => validateAnswer(payload, "42", { inputType: "number" })).not.toThrow();
    });
    it(`fraction validator nesmí crashnout na XSS payload`, () => {
      expect(() => validateAnswer(payload, "1/2", { inputType: "fraction" })).not.toThrow();
    });
    it(`essay validator parses XSS na NaN → no_score`, () => {
      const r = validateAnswer(payload, "60", { inputType: "essay" });
      expect(r.correct).toBe(false);
    });
  });
});

describe("Security — SQL injection patterns (validátory)", () => {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE topics; --",
    "1 UNION SELECT * FROM auth.users--",
    "admin'--",
    `" OR "" = "`,
    "1; DELETE FROM children; --",
  ];

  sqlPayloads.forEach((payload) => {
    it(`validátory nesmí crashnout na SQL payload: ${payload.slice(0, 30)}`, () => {
      expect(() => validateAnswer(payload, "test", { inputType: "text" })).not.toThrow();
      expect(() => validateAnswer(payload, "5", { inputType: "number" })).not.toThrow();
      expect(() => validateAnswer(payload, "1/2", { inputType: "fraction" })).not.toThrow();
      expect(() => validateAnswer(payload, "60", { inputType: "essay" })).not.toThrow();
    });
  });
});

describe("Security — DOS přes oversize inputy", () => {
  it("classifyIntent zvládne 100k znaků (no infinite loop, no crash)", () => {
    const giant = "a".repeat(100_000);
    expect(() => classifyIntent(giant, 3)).not.toThrow();
  });

  it("essay validator zvládne ohromné číslo", () => {
    expect(() => validateAnswer("9".repeat(1000), "60", { inputType: "essay" })).not.toThrow();
  });

  it("validátory zvládají ohromné stringy bez crash", () => {
    const giant = "x".repeat(50_000);
    expect(() => validateAnswer(giant, "test", { inputType: "text" })).not.toThrow();
  });

  it("fraction validator s ohromným zlomkem nezamrzne", () => {
    expect(() => validateAnswer("999999999999999999/2", "1/2", { inputType: "fraction" })).not.toThrow();
  });
});

describe("Security — boundary enforcement", () => {
  // Použij známý topic z curriculum
  const topics = getAllTopics();
  const compareTopic = topics.find((t) => t.id === "math-compare-natural-numbers-100");

  it("topic existuje (sanity check)", () => {
    expect(compareTopic).toBeDefined();
  });

  it("forbidden keyword v žákově odpovědi vyvolá violation", () => {
    if (!compareTopic) return;
    expect(checkBoundaryViolation("větší než 5", compareTopic)).toBe(true);
  });

  it("legitimní odpověď NEVYVOLÁ violation", () => {
    if (!compareTopic) return;
    expect(checkBoundaryViolation(">", compareTopic)).toBe(false);
    expect(checkBoundaryViolation("38", compareTopic)).toBe(false);
  });

  it("prázdný input → no violation", () => {
    if (!compareTopic) return;
    expect(checkBoundaryViolation("", compareTopic)).toBe(false);
  });
});

describe("Security — content sanity (žádný topic neobsahuje executable code v textech)", () => {
  const topics = getAllTopics();

  it("žádný topic.briefDescription neobsahuje <script>", () => {
    topics.forEach((t) => {
      expect(t.briefDescription, t.id).not.toMatch(/<script/i);
    });
  });

  it("žádný topic.title neobsahuje HTML tagy", () => {
    topics.forEach((t) => {
      expect(t.title, t.id).not.toMatch(/<\/?[a-z][^>]*>/i);
    });
  });

  it("všechny topic.keywords jsou čistě stringové (ne objekty/null)", () => {
    topics.forEach((t) => {
      t.keywords.forEach((kw) => {
        expect(typeof kw).toBe("string");
        expect(kw.length).toBeGreaterThan(0);
      });
    });
  });

  it("topic ID match safe-format (alfa-numerické + pomlčky/podtržítka)", () => {
    topics.forEach((t) => {
      // ID se mohou objevit v URL/DB queries — nesmí obsahovat speciální znaky
      expect(t.id, `topic.id='${t.id}'`).toMatch(/^[a-zA-Z0-9_-]+$/);
    });
  });
});

describe("Security — preIntent zvládne adversariální vstupy", () => {
  it("HTML payload → klasifikace nepouští skrz boundary", () => {
    const result = classifyIntent("<script>alert(1)</script>", 3);
    // Mělo by být klasifikováno jako nonsense / unclear (NE topical)
    expect(result).not.toBe("topical");
  });

  it("dlouhé čisté gibberish → nonsense (ne topical)", () => {
    const result = classifyIntent("zxcvbnm asdfghjkl qwertyuiop poiuytrewq lkjhgfdsa", 3);
    expect(result).toBe("nonsense");
  });

  it("number-only input → unclear_input (ne topical)", () => {
    const result = classifyIntent("42", 3);
    expect(result).toBe("unclear_input");
  });
});

describe("Security — anti-leak NESMÍ blokovat legitimní hint", () => {
  // Negative tests — anti-leak musí být dostatečně tight, ne over-block
  it("hint o principu (žádný leak) projde", () => {
    expect(checkAnswerLeak("Sčítej čísla po jednom.", "36")).toBe(false);
  });

  it("hint s jiným číslem (analogie) projde", () => {
    expect(checkAnswerLeak("Třeba 10 + 5 = 15 — to je jen příklad.", "36")).toBe(false);
  });

  it("hint s otázkou navádějící neprojde jen kvůli zmínce čísel z otázky", () => {
    // ans=36, hint zmiňuje 12 a 3 (factory které bys násobil), ne výsledek
    expect(checkAnswerLeak("Kolikrát se opakuje 12? A když to máš 3×?", "36")).toBe(false);
  });
});

describe("Security — rate limiting / fail-closed posture", () => {
  it("invalid score format ('NaN') → false (ne crash, ne true)", () => {
    const r = validateAnswer("NaN", "60", { inputType: "essay" });
    expect(r.correct).toBe(false);
  });
  it("Infinity score → fallback k bezpečnému clampu", () => {
    const r = validateAnswer("Infinity", "60", { inputType: "essay" });
    // parseInt("Infinity") = NaN → no_score
    expect(r.correct).toBe(false);
  });
});
