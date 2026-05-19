import { describe, it, expect } from "vitest";
import {
  isSubjectVisibleForGrade,
  filterSubjectsByGrade,
  type SubjectGradeRange,
} from "@/lib/curriculumSubjectFilter";

/**
 * Pure function testy pro Single Source of Truth filtru předmětů.
 *
 * Pokud tyto testy projdou, garance:
 *   - AdminDashboard, AdminCurriculumSidebar a CurriculumWizard
 *     uvidí přesně stejné předměty pro stejný stav DB.
 *
 * Pokud změníš isSubjectVisibleForGrade, MUSÍŠ aktualizovat tyto testy
 * a všechny consumery se chovají konzistentně automaticky.
 */

const noRange: SubjectGradeRange = { grade_min: null, grade_max: null };
const range_1_9: SubjectGradeRange = { grade_min: 1, grade_max: 9 };
const range_1_3: SubjectGradeRange = { grade_min: 1, grade_max: 3 };
const range_8_8: SubjectGradeRange = { grade_min: 8, grade_max: 8 };
const range_6_9: SubjectGradeRange = { grade_min: 6, grade_max: 9 };

describe("isSubjectVisibleForGrade — no filter", () => {
  it("grade=null vždy vrátí true (i bez obsahu, i bez rozsahu)", () => {
    expect(isSubjectVisibleForGrade(noRange, null, false)).toBe(true);
    expect(isSubjectVisibleForGrade(range_1_9, null, false)).toBe(true);
    expect(isSubjectVisibleForGrade(range_8_8, null, true)).toBe(true);
  });
});

describe("isSubjectVisibleForGrade — has content overrides everything", () => {
  it("předmět s obsahem pro daný ročník je viditelný i bez grade range", () => {
    expect(isSubjectVisibleForGrade(noRange, 5, true)).toBe(true);
  });
  it("předmět s obsahem je viditelný i když je grade mimo rozsah", () => {
    expect(isSubjectVisibleForGrade(range_8_8, 3, true)).toBe(true);
  });
  it("předmět s obsahem pro grade 9 je viditelný i s rozsahem [1,3]", () => {
    expect(isSubjectVisibleForGrade(range_1_3, 9, true)).toBe(true);
  });
});

describe("isSubjectVisibleForGrade — grade range without content", () => {
  it.each([
    [range_1_9, 1, true],
    [range_1_9, 5, true],
    [range_1_9, 9, true],
    [range_1_3, 1, true],
    [range_1_3, 3, true],
    [range_1_3, 4, false],
    [range_1_3, 9, false],
    [range_8_8, 7, false],
    [range_8_8, 8, true],
    [range_8_8, 9, false],
    [range_6_9, 5, false],
    [range_6_9, 6, true],
    [range_6_9, 9, true],
  ])("rozsah %j s grade %i → %s", (range, grade, expected) => {
    expect(isSubjectVisibleForGrade(range, grade, false)).toBe(expected);
  });
});

describe("isSubjectVisibleForGrade — žádný rozsah ani obsah", () => {
  it("grade_min=null a grade_max=null bez obsahu → false (skrytý)", () => {
    expect(isSubjectVisibleForGrade(noRange, 5, false)).toBe(false);
  });
  it("jen grade_min=null + grade_max=8 (nekonzistentní data) → false", () => {
    expect(
      isSubjectVisibleForGrade({ grade_min: null, grade_max: 8 }, 5, false),
    ).toBe(false);
  });
  it("jen grade_max=null + grade_min=6 (nekonzistentní data) → false", () => {
    expect(
      isSubjectVisibleForGrade({ grade_min: 6, grade_max: null }, 5, false),
    ).toBe(false);
  });
});

describe("isSubjectVisibleForGrade — boundary podmínky", () => {
  it("grade přesně rovno grade_min", () => {
    expect(isSubjectVisibleForGrade(range_6_9, 6, false)).toBe(true);
  });
  it("grade přesně rovno grade_max", () => {
    expect(isSubjectVisibleForGrade(range_6_9, 9, false)).toBe(true);
  });
  it("grade_min === grade_max → viditelný jen pro tu jednu hodnotu", () => {
    expect(isSubjectVisibleForGrade(range_8_8, 7, false)).toBe(false);
    expect(isSubjectVisibleForGrade(range_8_8, 8, false)).toBe(true);
    expect(isSubjectVisibleForGrade(range_8_8, 9, false)).toBe(false);
  });
});

describe("filterSubjectsByGrade — integrace", () => {
  const subjects = [
    { name: "Matematika", grade_min: 1, grade_max: 9 },
    { name: "Čeština", grade_min: 8, grade_max: 8 },
    { name: "Biologie", grade_min: 8, grade_max: 8 },
    { name: "Prvouka", grade_min: 1, grade_max: 3 },
    { name: "Custom", grade_min: null, grade_max: null },
  ];

  it("bez filtru vrátí všechny", () => {
    const result = filterSubjectsByGrade(subjects, null, new Set());
    expect(result.map((s) => s.name).sort()).toEqual(
      ["Biologie", "Custom", "Matematika", "Prvouka", "Čeština"].sort(),
    );
  });

  it("grade=2: Matematika [1,9] + Prvouka [1,3]; Biologie/Čeština skryté", () => {
    const result = filterSubjectsByGrade(subjects, 2, new Set());
    expect(result.map((s) => s.name).sort()).toEqual(["Matematika", "Prvouka"]);
  });

  it("grade=8: Matematika + Čeština + Biologie; Prvouka skrytá", () => {
    const result = filterSubjectsByGrade(subjects, 8, new Set());
    expect(result.map((s) => s.name).sort()).toEqual([
      "Biologie", "Matematika", "Čeština",
    ].sort());
  });

  it("grade=9: jen Matematika; Biologie [8,8] skrytá", () => {
    const result = filterSubjectsByGrade(subjects, 9, new Set());
    expect(result.map((s) => s.name)).toEqual(["Matematika"]);
  });

  it("Custom (žádný rozsah) získá viditelnost přes obsah", () => {
    const withContent = new Set(["custom"]);
    const result = filterSubjectsByGrade(subjects, 5, withContent);
    expect(result.map((s) => s.name)).toContain("Custom");
  });

  it("Custom (žádný rozsah, žádný obsah) je skrytý při aktivním filtru", () => {
    const result = filterSubjectsByGrade(subjects, 5, new Set());
    expect(result.map((s) => s.name)).not.toContain("Custom");
  });
});

describe("Realný scénář — uživatel měl tyto stížnosti", () => {
  // Aktuální DB stav (ověřeno přes REST API 2026-05-19)
  const realSubjects = [
    { name: "matematika", grade_min: 1, grade_max: 9 },
    { name: "čeština", grade_min: 8, grade_max: 8 },
    { name: "prvouka", grade_min: 1, grade_max: 3 },
    { name: "biologie", grade_min: 8, grade_max: 8 },
    { name: "chemie", grade_min: 8, grade_max: 8 },
    { name: "fyzika", grade_min: 8, grade_max: 8 },
    { name: "dějepis", grade_min: 8, grade_max: 8 },
    { name: "zeměpis", grade_min: 8, grade_max: 8 },
  ];

  it("grade 2: jen matematika + prvouka", () => {
    const result = filterSubjectsByGrade(realSubjects, 2, new Set(["matematika"]));
    expect(result.map((s) => s.name).sort()).toEqual(["matematika", "prvouka"]);
  });

  it("grade 6: jen matematika (žádné 2. stupně bez obsahu)", () => {
    const result = filterSubjectsByGrade(realSubjects, 6, new Set(["matematika"]));
    expect(result.map((s) => s.name)).toEqual(["matematika"]);
  });

  it("grade 8: všechny zaregistrované předměty", () => {
    const result = filterSubjectsByGrade(realSubjects, 8, new Set(["matematika"]));
    expect(result.map((s) => s.name).sort()).toEqual([
      "biologie", "chemie", "dějepis", "fyzika", "matematika", "zeměpis", "čeština",
    ].sort());
  });

  it("grade 9: jen matematika (2. stupeň má grade_max=8)", () => {
    const result = filterSubjectsByGrade(realSubjects, 9, new Set(["matematika"]));
    expect(result.map((s) => s.name)).toEqual(["matematika"]);
  });
});
