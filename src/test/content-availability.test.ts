import { describe, it, expect } from "vitest";
import {
  ACTIVE_GRADES,
  hasContentForGrade,
  isGradeAvailable,
  getBestAvailableGrade,
  getContentWarning,
} from "@/lib/contentAvailability";

/**
 * Zamknutí ročníků mimo aktivní scope pilotu (2026-07-12).
 * Ročníky 5 a 6 MAJÍ obsah v repu, ale nejsou auditované →
 * žákům se nesmí nabízet. Odemčení = přidat do ACTIVE_GRADES
 * (vědomé rozhodnutí), ne vedlejší efekt registrace obsahu.
 */
describe("contentAvailability — aktivní scope ročníků", () => {
  it("aktivní scope pilotu je 2–4", () => {
    expect([...ACTIVE_GRADES]).toEqual([2, 3, 4]);
  });

  it.each([2, 3, 4])("ročník %i je dostupný (scope + obsah)", (g) => {
    expect(hasContentForGrade(g)).toBe(true);
    expect(isGradeAvailable(g)).toBe(true);
    expect(getBestAvailableGrade(g)).toBe(g);
    expect(getContentWarning(g)).toBeNull();
  });

  it.each([5, 6])(
    "ročník %i má obsah v repu, ale je ZAMČENÝ (mimo aktivní scope)",
    (g) => {
      expect(hasContentForGrade(g)).toBe(true); // obsah existuje…
      expect(isGradeAvailable(g)).toBe(false); // …ale žákům se nenabízí
    },
  );

  it.each([1, 5, 6, 7, 8, 9])(
    "ročník %i není dostupný → fallback na 4 + varování",
    (g) => {
      expect(isGradeAvailable(g)).toBe(false);
      expect(getBestAvailableGrade(g)).toBe(4);
      const warning = getContentWarning(g);
      expect(warning).toContain(`${g}. ročník`);
      expect(warning).toContain("4. ročník");
    },
  );
});
