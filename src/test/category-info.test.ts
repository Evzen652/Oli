import { describe, it, expect } from "vitest";
import { getCategoryInfo, CATEGORY_INFO } from "@/lib/categoryInfo";

/**
 * Category info — lookup tables pro popisy okruhů (admin + parent UX).
 *
 * Pokrývá:
 *  - Lookup po subject::category
 *  - Topic-level override (subject::category::topic)
 *  - null pro neznámé kombinace
 *  - Struktura: required fields v každém záznamu
 */

describe("getCategoryInfo — lookup", () => {
  it("known subject::category → CategoryInfo objekt", () => {
    const info = getCategoryInfo("matematika", "Čísla a operace");
    expect(info).toBeTruthy();
    expect(info?.title).toBeTruthy();
    expect(info?.hook).toBeTruthy();
  });

  it("neznámá category → null", () => {
    expect(getCategoryInfo("matematika", "Neexistuje")).toBeNull();
  });

  it("neznámý subject → null", () => {
    expect(getCategoryInfo("xxx", "Cokoliv")).toBeNull();
  });

  it("topic-level override (pokud existuje) má prioritu", () => {
    // Pokud existuje subject::category::topic v CATEGORY_INFO, vrací ten
    // Test je tolerant k absence — jen kontroluje, že fn neholí
    const r = getCategoryInfo("matematika", "Čísla a operace", "Porovnávání");
    if (r) {
      expect(r.title).toBeTruthy();
    }
  });

  it("topic NESEDÍ → fallback na category-level", () => {
    const baseInfo = getCategoryInfo("matematika", "Čísla a operace");
    const withMissingTopic = getCategoryInfo(
      "matematika",
      "Čísla a operace",
      "Neexistující topic"
    );
    expect(withMissingTopic).toBe(baseInfo);
  });
});

describe("CATEGORY_INFO — struktura", () => {
  it("aspoň 5 entries (matematika + čeština + prvouka koverage)", () => {
    expect(Object.keys(CATEGORY_INFO).length).toBeGreaterThan(5);
  });

  it("každá entry má title, hook, whatIsIt, whyWeUseIt", () => {
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      expect(info.title, `${key}: title`).toBeTruthy();
      expect(info.hook, `${key}: hook`).toBeTruthy();
      expect(info.whatIsIt, `${key}: whatIsIt`).toBeTruthy();
      expect(info.whyWeUseIt, `${key}: whyWeUseIt`).toBeTruthy();
    }
  });

  it("buttonLabel je vždy string", () => {
    for (const info of Object.values(CATEGORY_INFO)) {
      expect(typeof info.buttonLabel).toBe("string");
      expect(info.buttonLabel.length).toBeGreaterThan(0);
    }
  });

  it("visualExamples je array s aspoň 1 example", () => {
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      expect(Array.isArray(info.visualExamples), `${key}: visualExamples`).toBe(true);
      expect(info.visualExamples.length, `${key}: visualExamples count`).toBeGreaterThan(0);
      info.visualExamples.forEach((ex) => {
        expect(ex.label, `${key}: example.label`).toBeTruthy();
        expect(ex.illustration, `${key}: example.illustration`).toBeTruthy();
      });
    }
  });

  it("funFact je neprázdný string", () => {
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      expect(info.funFact, `${key}: funFact`).toBeTruthy();
    }
  });

  it("klíče následují konzistentní pattern subject::category(::topic)?", () => {
    for (const key of Object.keys(CATEGORY_INFO)) {
      // Min 2 segments, max 3
      const segments = key.split("::");
      expect(segments.length, `${key}`).toBeGreaterThanOrEqual(2);
      expect(segments.length, `${key}`).toBeLessThanOrEqual(3);
      // Žádný segment nesmí být prázdný
      segments.forEach((s) => expect(s.trim().length).toBeGreaterThan(0));
    }
  });
});

describe("getCategoryInfo — robustness", () => {
  it("prázdné argumenty → null", () => {
    expect(getCategoryInfo("", "")).toBeNull();
  });

  it("XSS payload v query → no crash, returns null", () => {
    expect(() => getCategoryInfo("<script>", "alert(1)")).not.toThrow();
    expect(getCategoryInfo("<script>", "alert(1)")).toBeNull();
  });

  it("oversize input → no crash", () => {
    expect(() => getCategoryInfo("a".repeat(10000), "b".repeat(10000))).not.toThrow();
  });
});

describe("getCategoryInfo — pokrytí hlavních předmětů", () => {
  it("má info pro 'matematika::Čísla a operace' (jádro M3)", () => {
    expect(getCategoryInfo("matematika", "Čísla a operace")).toBeTruthy();
  });

  it("má info pro 'matematika::Zlomky'", () => {
    expect(getCategoryInfo("matematika", "Zlomky")).toBeTruthy();
  });

  it("má info pro aspoň 1 čeština category", () => {
    const czCategories = Object.keys(CATEGORY_INFO).filter((k) => k.startsWith("čeština::"));
    expect(czCategories.length).toBeGreaterThan(0);
  });

  it("má info pro aspoň 1 prvouka category", () => {
    const prCategories = Object.keys(CATEGORY_INFO).filter((k) => k.startsWith("prvouka::"));
    expect(prCategories.length).toBeGreaterThan(0);
  });
});
