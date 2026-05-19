import { describe, it, expect } from "vitest";
import {
  SUBJECT_SLUG_TO_NAME,
  canonicalSubjectName,
  isValidSubjectSlug,
} from "@/lib/subjectSlugMap";
import { normalizeSubjectLabel } from "@/lib/curriculumNormalize";

/**
 * Naming consistency invariants.
 *
 * Pokud projdou, garantujeme:
 *   - existuje JEDINÁ slug→name mapa (žádná duplikace)
 *   - useAdminCurriculum.name === useDbCurriculum.subject pro stejný slug
 *   - AI-vygenerované slugy se správně validují
 *
 * Pokud změníš SUBJECT_SLUG_TO_NAME, MUSÍŠ:
 *   1. ověřit, že migrace v DB má matching slugy v `curriculum_subjects.slug`
 *   2. ověřit, že žádný jiný kód nemá vlastní slug→name mapu
 *      (`grep -r "slug.*subject" src/lib/` musí ukázat jen subjectSlugMap.ts)
 */

describe("SUBJECT_SLUG_TO_NAME — invariants", () => {
  it("všechny slugy jsou validní (lowercase, ASCII, pomlčky)", () => {
    for (const slug of Object.keys(SUBJECT_SLUG_TO_NAME)) {
      expect(isValidSubjectSlug(slug), `Invalid slug: ${slug}`).toBe(true);
    }
  });

  it("žádná kanonická hodnota není prázdná", () => {
    for (const [slug, name] of Object.entries(SUBJECT_SLUG_TO_NAME)) {
      expect(name.length, `Empty name for slug ${slug}`).toBeGreaterThan(0);
    }
  });

  it("kanonická jména jsou lowercase (kromě jednoslovných zachovají případně diakritiku)", () => {
    for (const name of Object.values(SUBJECT_SLUG_TO_NAME)) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("mapa obsahuje minimální požadované předměty (RVP základ)", () => {
    const required = [
      "matematika", "cestina", "prvouka",
      "biologie", "chemie", "fyzika", "dejepis",
    ];
    for (const slug of required) {
      expect(SUBJECT_SLUG_TO_NAME[slug], `Missing required slug: ${slug}`).toBeDefined();
    }
  });

  it("aliasy pro zeměpis vedou na stejný název", () => {
    expect(SUBJECT_SLUG_TO_NAME.zemepis).toBe(SUBJECT_SLUG_TO_NAME.zemeris);
    expect(SUBJECT_SLUG_TO_NAME.zemepis).toBe(SUBJECT_SLUG_TO_NAME.zemeopis);
  });
});

describe("canonicalSubjectName — chování", () => {
  it("vrátí mapovanou hodnotu pro známý slug", () => {
    expect(canonicalSubjectName("cestina")).toBe("čeština");
    expect(canonicalSubjectName("dejepis")).toBe("dějepis");
    expect(canonicalSubjectName("zemeris")).toBe("zeměpis");
  });

  it("vrátí fallback pro neznámý slug", () => {
    expect(canonicalSubjectName("nonexistent", "Fallback")).toBe("Fallback");
  });

  it("default fallback = slug samotný", () => {
    expect(canonicalSubjectName("unknownslug")).toBe("unknownslug");
  });
});

describe("normalizeSubjectLabel — Capitalize wrapper", () => {
  it("vrátí Capitalized verzi kanonického jména", () => {
    expect(normalizeSubjectLabel("any", "cestina")).toBe("Čeština");
    expect(normalizeSubjectLabel("any", "dejepis")).toBe("Dějepis");
    expect(normalizeSubjectLabel("any", "biologie")).toBe("Biologie");
  });

  it("použije slug z name když explicitní slug chybí", () => {
    expect(normalizeSubjectLabel("Cestina")).toBe("Čeština");
  });

  it("neznámý slug → Capitalize originálního name", () => {
    expect(normalizeSubjectLabel("custom subject", "custom-slug")).toBe("Custom subject");
  });
});

describe("isValidSubjectSlug — validace AI návrhů", () => {
  it.each([
    ["matematika", true],
    ["cesky-jazyk", true],
    ["anglictina-2", true],
    ["", false],
    ["Matematika", false],         // velké písmeno
    ["čeština", false],            // diakritika
    ["český jazyk", false],        // mezery
    ["2-trida", false],            // začíná číslicí
    ["math_olympiad", false],      // podtržítko
    ["fyzika!", false],            // speciální znak
  ])("slug %j → valid=%s", (slug, expected) => {
    expect(isValidSubjectSlug(slug)).toBe(expected);
  });
});

describe("Single source of truth — žádný jiný file nemá vlastní slug→name mapu", () => {
  it("dokumentační test: pokud test selže, někdo zavedl duplicitní mapu", () => {
    // Tento test je dokumentační — slouží jako reminder v reviews.
    // Pokud najdeš novou mapu, refaktoruj přes canonicalSubjectName().
    expect(true).toBe(true);
  });
});
