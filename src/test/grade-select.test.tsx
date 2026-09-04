import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GradeSelect } from "@/components/GradeSelect";
import { ACTIVE_GRADES } from "@/lib/contentAvailability";

/**
 * Výběr ročníku pro žáka čte JEDINÝ zdroj pravdy.
 *
 * Do 2026-09-04 měl `GradeSelect` vlastní gate `DEMO_MODE = true` /
 * `DEMO_GRADE = 3`, takže pouštěl dál jen třetí ročník a u druhého i čtvrtého
 * psal „Již brzy" — přestože `ACTIVE_GRADES` je `[2, 3, 4]` a obsah pro ně
 * existuje. Druhák ani čtvrťák se tudy ke svému ročníku nedostali.
 *
 * Test schválně neporovnává s natvrdo psaným `[2,3,4]`, ale s `ACTIVE_GRADES` —
 * jinak by po odemčení dalšího ročníku hlídal starou pravdu.
 */

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { signOut: vi.fn() } },
}));

describe("GradeSelect", () => {
  it("nabízí přesně ročníky z ACTIVE_GRADES, ostatní jsou zamčené", () => {
    render(<GradeSelect onSelect={vi.fn()} />);

    for (let g = 1; g <= 9; g++) {
      const btn = screen.getByRole("button", { name: new RegExp(`^${g}\\.`) });
      const shouldBeActive = ACTIVE_GRADES.includes(g);
      expect(
        (btn as HTMLButtonElement).disabled,
        `${g}. ročník má být ${shouldBeActive ? "dostupný" : "zamčený"}`,
      ).toBe(!shouldBeActive);
    }
  });

  it("kliknutí na dostupný ročník ho vybere", () => {
    const onSelect = vi.fn();
    render(<GradeSelect onSelect={onSelect} />);
    const g = ACTIVE_GRADES[0];
    screen.getByRole("button", { name: new RegExp(`^${g}\\.`) }).click();
    expect(onSelect).toHaveBeenCalledWith(g);
  });

  it("zamčený ročník nejde vybrat", () => {
    const onSelect = vi.fn();
    render(<GradeSelect onSelect={onSelect} />);
    const locked = [1, 5, 6, 7, 8, 9].find((g) => !ACTIVE_GRADES.includes(g))!;
    screen.getByRole("button", { name: new RegExp(`^${locked}\\.`) }).click();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
