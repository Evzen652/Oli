import { describe, it, expect } from "vitest";
import {
  ACTIVE_GRADES,
  hasContentForGrade,
  isGradeAvailable,
  getBestAvailableGrade,
  getContentWarning,
} from "@/lib/contentAvailability";

/**
 * Aktivní scope ročníků. Do 2026-09-11 byly otevřené jen 2–4; ročníky 5 a 6
 * se otevřely po auditu obsahu. Odemčení = přidat do ACTIVE_GRADES (vědomé
 * rozhodnutí), ne vedlejší efekt registrace obsahu.
 */
describe("contentAvailability — aktivní scope ročníků", () => {
  it("aktivní scope je 2–6", () => {
    expect([...ACTIVE_GRADES]).toEqual([2, 3, 4, 5, 6]);
  });

  it.each([2, 3, 4, 5, 6])("ročník %i je dostupný (scope + obsah)", (g) => {
    expect(hasContentForGrade(g)).toBe(true);
    expect(isGradeAvailable(g)).toBe(true);
    expect(getBestAvailableGrade(g)).toBe(g);
    expect(getContentWarning(g)).toBeNull();
  });

  it.each([1, 7, 8, 9])(
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
