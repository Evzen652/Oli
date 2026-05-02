import { describe, it, expect } from "vitest";
import { getReadableSkillName, getShortSkillName, getSkillSubject, getSkillIcon } from "@/lib/skillReadableName";

/**
 * Skill readable name — lidsky srozumitelné názvy skillů pro UI
 * (rodičovský dashboard, notifikace, weekly report).
 *
 * Strategie pokrytí:
 *  1. Lookup v contentRegistry (přímý + alias přes canonicalSkillId)
 *  2. Topic prefix logic ("Topic: Title" pokud se liší)
 *  3. Curated FALLBACK_NAMES pro neexistující IDs
 *  4. humanizeId() poslední záchrana (kebab → Sentence case)
 *
 * + getSkillSubject + getSkillIcon (emoji per topic patterns)
 */

describe("getReadableSkillName — registry lookup", () => {
  it("existující skill → vrátí title", () => {
    const name = getReadableSkillName("math-compare-natural-numbers-100");
    expect(name).toBeTruthy();
    expect(name).not.toBe("—");
  });

  it("prázdný skillId → '—' fallback", () => {
    expect(getReadableSkillName("")).toBe("—");
  });

  it("undefined-like → '—'", () => {
    expect(getReadableSkillName(undefined as unknown as string)).toBe("—");
    expect(getReadableSkillName(null as unknown as string)).toBe("—");
  });
});

describe("getReadableSkillName — curated fallback", () => {
  it.each([
    ["math-multiply-full", "Násobilka"],
    ["math-multiply-small", "Malá násobilka"],
    ["math-multiply-twodigit", "Násobení dvojciferným"],
    ["addSub20", "Sčítání a odčítání do 20"],
    ["addSub100", "Sčítání a odčítání do 100"],
    ["divideOneDigit", "Písemné dělení"],
    ["divideRemainder", "Dělení se zbytkem"],
    ["compareNatural", "Porovnávání čísel"],
    ["frac-compare-same-den", "Porovnávání zlomků (stejný jmenovatel)"],
  ])("'%s' → '%s'", (id, expected) => {
    expect(getReadableSkillName(id)).toBe(expected);
  });
});

describe("getReadableSkillName — humanize fallback (last resort)", () => {
  it("neznámý kebab-case ID → Sentence case", () => {
    const name = getReadableSkillName("xxx-some-random-skill-id");
    // První velké, ostatní lowercase, prefix odstraněn pokud má xxx-
    expect(name.charAt(0)).toBe(name.charAt(0).toUpperCase());
  });

  it("'math-' prefix se odstraní", () => {
    expect(getReadableSkillName("math-unknown-fake")).not.toContain("math-");
  });

  it("'pr-' prefix se odstraní", () => {
    expect(getReadableSkillName("pr-unknown-fake")).not.toContain("pr-");
  });

  it("'cz-' prefix se odstraní", () => {
    expect(getReadableSkillName("cz-unknown-fake")).not.toContain("cz-");
  });

  it("'frac-' prefix se odstraní", () => {
    expect(getReadableSkillName("frac-unknown-fake")).not.toContain("frac-");
  });

  it("underscore se nahradí mezerou", () => {
    expect(getReadableSkillName("some_unknown_id")).toContain(" ");
  });
});

describe("getShortSkillName — bez topic prefixu", () => {
  it("vrátí kratší název než getReadableSkillName (kde to je různé)", () => {
    const skillId = "math-compare-natural-numbers-100";
    const long = getReadableSkillName(skillId, { includeTopic: true });
    const short = getShortSkillName(skillId);
    // Short nikdy delší než long
    expect(short.length).toBeLessThanOrEqual(long.length);
  });
});

describe("getSkillSubject — subject extraction", () => {
  it("matematika skill → 'matematika'", () => {
    expect(getSkillSubject("math-compare-natural-numbers-100")).toBe("matematika");
  });

  it("neexistující skill → null", () => {
    expect(getSkillSubject("xxx-nonexistent")).toBeNull();
  });

  it("prázdný ID → null", () => {
    expect(getSkillSubject("")).toBeNull();
  });
});

describe("getSkillIcon — emoji patterns", () => {
  it("vrátí emoji string (vždy 1+ chars)", () => {
    expect(getSkillIcon("math-compare-natural-numbers-100").length).toBeGreaterThan(0);
  });

  it("comparison topic → ⚖️", () => {
    expect(getSkillIcon("math-compare-natural-numbers-100")).toBe("⚖️");
  });

  it("násobilka pattern → ✖️", () => {
    expect(getSkillIcon("math-multiply-full")).toBe("✖️");
  });

  it("dělení pattern → ➗", () => {
    expect(getSkillIcon("divideOneDigit")).toBe("➗");
  });

  it("zlomek pattern → 🍕 (samostatný název bez 'compare' pattern collision)", () => {
    // frac-compare-* matchne "comparison" pattern dřív, je to ⚖️.
    // Pro test čistého zlomek pattern použij ID bez "compare":
    expect(getSkillIcon("math-zlomek-pattern")).toBe("🍕");
  });

  it("zaokrouhlení → 🎯", () => {
    expect(getSkillIcon("math-rounding-fake-id")).toBe("🎯");
  });

  it("diktát → ✍️", () => {
    expect(getSkillIcon("cz-diktat")).toBe("✍️");
  });

  it("vyjmenovaná → 📚", () => {
    expect(getSkillIcon("cz-vyjmenovana-fake")).toBe("📚");
  });

  it("rostliny → 🌱", () => {
    expect(getSkillIcon("pr-rostliny-fake")).toBe("🌱");
  });

  it("zvířata → 🐾", () => {
    expect(getSkillIcon("pr-zvirata-fake")).toBe("🐾");
  });

  it("prázdný ID → 📚 (universal fallback)", () => {
    expect(getSkillIcon("")).toBe("📚");
  });

  it("'math' prefix bez patternu → 🔢 (subject fallback)", () => {
    expect(getSkillIcon("math-totally-unknown-pattern")).toBe("🔢");
  });

  it("'cz-' prefix bez patternu → 📝 (subject fallback)", () => {
    expect(getSkillIcon("cz-totally-unknown")).toBe("📝");
  });

  it("'pr-' prefix bez patternu → 🌍 (subject fallback)", () => {
    expect(getSkillIcon("pr-totally-unknown")).toBe("🌍");
  });

  it("totally unknown bez prefixu → 📚", () => {
    expect(getSkillIcon("xxx-no-pattern-no-prefix")).toBe("📚");
  });
});

describe("getReadableSkillName — robustness", () => {
  it("velmi dlouhý ID → no crash", () => {
    expect(() => getReadableSkillName("a".repeat(1000))).not.toThrow();
  });

  it("XSS payload v ID → no crash", () => {
    expect(() => getReadableSkillName("<script>alert(1)</script>")).not.toThrow();
  });

  it("unicode v ID → no crash", () => {
    expect(() => getReadableSkillName("česky-čéčáů")).not.toThrow();
  });
});
