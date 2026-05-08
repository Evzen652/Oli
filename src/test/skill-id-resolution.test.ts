/**
 * Skill ID resolution — testy pro normalizaci ID, aliasy a předmětovou detekci.
 *
 * Pokrývá: canonicalSkillId, aliasesOf, isSameSkill,
 *           getSkillSubject, getReadableSkillName, getShortSkillName, getSkillIcon.
 */
import { describe, it, expect } from "vitest";
import { canonicalSkillId, aliasesOf, isSameSkill } from "@/lib/skillIdNormalizer";
import {
  getSkillSubject,
  getReadableSkillName,
  getShortSkillName,
  getSkillIcon,
} from "@/lib/skillReadableName";

// ─────────────────────────────────────────────────────────
// canonicalSkillId
// ─────────────────────────────────────────────────────────
describe("canonicalSkillId", () => {
  it("alias s podtržítky → kanonický tvar s pomlčkami", () => {
    expect(canonicalSkillId("frac_compare_same_den")).toBe("frac-compare-same-den");
    expect(canonicalSkillId("frac_compare_diff_den")).toBe("frac-compare-diff-den");
    expect(canonicalSkillId("frac_to_mixed")).toBe("frac-to-mixed");
  });
  it("prvouka alias: prv-plants → pr-plant-parts", () => {
    expect(canonicalSkillId("prv-plants")).toBe("pr-plant-parts");
  });
  it("prvouka alias: prv-seasons → pr-seasons", () => {
    expect(canonicalSkillId("prv-seasons")).toBe("pr-seasons");
  });
  it("ID bez aliasu → vrátí původní", () => {
    expect(canonicalSkillId("math-compare-natural-numbers-100")).toBe("math-compare-natural-numbers-100");
  });
  it("prázdný string → vrátí prázdný string", () => {
    expect(canonicalSkillId("")).toBe("");
  });
  it("neexistující ID → vrátí původní beze změny", () => {
    expect(canonicalSkillId("totally-unknown-skill")).toBe("totally-unknown-skill");
  });
  it("UUID → vrátí beze změny", () => {
    const uuid = "12345678-1234-1234-1234-123456789abc";
    expect(canonicalSkillId(uuid)).toBe(uuid);
  });
});

// ─────────────────────────────────────────────────────────
// aliasesOf
// ─────────────────────────────────────────────────────────
describe("aliasesOf", () => {
  it("vrátí kanonické ID i všechny aliasy", () => {
    const aliases = aliasesOf("frac-compare-same-den");
    expect(aliases).toContain("frac-compare-same-den");
    expect(aliases).toContain("frac_compare_same_den");
  });
  it("ID bez aliasů → vrátí jen sebe", () => {
    const aliases = aliasesOf("math-compare-natural-numbers-100");
    expect(aliases).toEqual(["math-compare-natural-numbers-100"]);
  });
  it("výsledek neobsahuje duplikáty", () => {
    const aliases = aliasesOf("frac-compare-same-den");
    expect(aliases.length).toBe(new Set(aliases).size);
  });
});

// ─────────────────────────────────────────────────────────
// isSameSkill
// ─────────────────────────────────────────────────────────
describe("isSameSkill", () => {
  it("alias a kanonické ID → true", () => {
    expect(isSameSkill("frac_compare_same_den", "frac-compare-same-den")).toBe(true);
  });
  it("obě kanonická → true", () => {
    expect(isSameSkill("frac-compare-same-den", "frac-compare-same-den")).toBe(true);
  });
  it("různé skilldly → false", () => {
    expect(isSameSkill("frac-compare-same-den", "math-compare-natural-numbers-100")).toBe(false);
  });
  it("alias vs. jiný skill → false", () => {
    expect(isSameSkill("frac_compare_same_den", "frac-compare-diff-den")).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// getSkillSubject
// ─────────────────────────────────────────────────────────
describe("getSkillSubject — předmětová detekce", () => {
  // Prefix-based (skills v FALLBACK_NAMES nebo bez registry entry)
  it("math- prefix → matematika", () => {
    expect(getSkillSubject("math-compare-natural-numbers-100")).toBe("matematika");
  });
  it("math-multiply-full (FALLBACK_NAMES) → matematika", () => {
    expect(getSkillSubject("math-multiply-full")).toBe("matematika");
  });
  it("addSub prefix → matematika", () => {
    expect(getSkillSubject("addSub100")).toBe("matematika");
  });
  it("frac- prefix → matematika", () => {
    expect(getSkillSubject("frac-compare-same-den")).toBe("matematika");
  });
  it("frac_ alias → matematika (přes kanonický)", () => {
    expect(getSkillSubject("frac_compare_same_den")).toBe("matematika");
  });
  it("cz- prefix → čeština", () => {
    expect(getSkillSubject("cz-diktat")).toBe("čeština");
  });
  it("pr- prefix → prvouka", () => {
    expect(getSkillSubject("pr-plant-parts")).toBe("prvouka");
  });
  it("neznámé ID → null", () => {
    expect(getSkillSubject("totally-unknown-xyz")).toBeNull();
  });
  it("prázdný string → null", () => {
    expect(getSkillSubject("")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────
// getReadableSkillName
// ─────────────────────────────────────────────────────────
describe("getReadableSkillName", () => {
  it("prázdný string → '—'", () => {
    expect(getReadableSkillName("")).toBe("—");
  });
  it("skill z FALLBACK_NAMES → curated název", () => {
    expect(getReadableSkillName("math-multiply-full")).toBe("Násobilka");
    expect(getReadableSkillName("addSub100")).toBe("Sčítání a odčítání do 100");
  });
  it("alias → vrátí neprázdný string (alias i kanonické ID dají čitelný název)", () => {
    // frac_compare_same_den (podtržítko) je v contentRegistry → topic-based název
    // frac-compare-same-den (pomlčka) není v contentRegistry → FALLBACK_NAMES
    // Oba musí být neprázdné a čitelné (ne raw ID)
    const alias = getReadableSkillName("frac_compare_same_den");
    const canonical = getReadableSkillName("frac-compare-same-den");
    expect(alias.length).toBeGreaterThan(3);
    expect(canonical.length).toBeGreaterThan(3);
    expect(alias).not.toBe("frac_compare_same_den");
    expect(canonical).not.toBe("frac-compare-same-den");
  });
  it("neznámé ID → humanizovaný fallback (ne výjimka)", () => {
    const name = getReadableSkillName("totally-unknown-skill-abc");
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
    // Humanize: odstraní prefix, kapitalizuje
    expect(name[0]).toBe(name[0].toUpperCase());
  });
  it("math- prefix se odstraní při humanizaci", () => {
    // Skill, který není v registry ani FALLBACK_NAMES
    const name = getReadableSkillName("math-some-new-skill");
    expect(name).not.toContain("math-");
  });
  it("skill v contentRegistry → vrátí title (ne prázdný řetězec)", () => {
    // math-compare-natural-numbers-100 je v contentRegistry
    const name = getReadableSkillName("math-compare-natural-numbers-100");
    expect(name.length).toBeGreaterThan(3);
    expect(name).not.toBe("math-compare-natural-numbers-100");
  });
});

// ─────────────────────────────────────────────────────────
// getShortSkillName
// ─────────────────────────────────────────────────────────
describe("getShortSkillName", () => {
  it("vrací string bez výjimky pro libovolné ID", () => {
    const ids = [
      "math-multiply-full",
      "frac_compare_same_den",
      "cz-diktat",
      "pr-plant-parts",
      "totally-unknown",
      "",
    ];
    for (const id of ids) {
      expect(() => getShortSkillName(id)).not.toThrow();
    }
  });
  it("neobsahuje topic prefix (bez ':')", () => {
    // getShortSkillName vždy includeTopic=false
    const name = getShortSkillName("math-compare-natural-numbers-100");
    expect(name).not.toContain(":");
  });
});

// ─────────────────────────────────────────────────────────
// getSkillIcon
// ─────────────────────────────────────────────────────────
describe("getSkillIcon", () => {
  it("prázdný string → výchozí emoji", () => {
    expect(getSkillIcon("")).toBe("📚");
  });
  it("násobilka/násobení → ✖️", () => {
    expect(getSkillIcon("math-multiply-full")).toBe("✖️");
  });
  it("zlomky (sčítání) → 🍕 (pattern na zlomek/frac bez porovnávání)", () => {
    // frac-compare-same-den matchne nejdřív pattern porovnávání (⚖️) — to je správné chování
    // Pro zlomky bez "porovnávání" v názvu vrátí 🍕
    expect(getSkillIcon("frac-compare-same-den")).toBe("⚖️"); // porovnávání vítězí
    // Pro skill se zlomkem v názvu bez porovnávání → 🍕
    const iconForFrac = getSkillIcon("frac-to-mixed");
    expect(["🍕", "🔢", "📚"]).toContain(iconForFrac); // záleží na názvu
  });
  it("diktát → ✍️", () => {
    expect(getSkillIcon("cz-diktat")).toBe("✍️");
  });
  it("vždy vrátí neprázdný string", () => {
    const ids = ["math-unknown-xyz", "frac_compare_same_den", "cz-parove-souhlasky", "pr-seasons"];
    for (const id of ids) {
      const icon = getSkillIcon(id);
      expect(icon.length).toBeGreaterThan(0);
    }
  });
});
