/**
 * Rodičovská brána — hlídač předpokladu, na kterém stojí.
 *
 * Brána používá dvojciferné násobení. Obhajoba zní: písemné násobení
 * dvojciferným číslem je podle RVP učivo 5. ročníku, takže je nad možnostmi
 * dětí, které Oli dnes obsluhuje (ročníky 2–4).
 *
 * Ten předpoklad ale platí jen do chvíle, než se 5. ročník otevře. Pak by Oli
 * sama učila, jak vlastní bránu překonat — a nikdo by si toho nemusel
 * všimnout, protože kód by dál procházel a testy taky.
 *
 * Proto tenhle test: spadne přesně ve chvíli, kdy se předpoklad rozpadne.
 * Není to test chování, je to **budík na zestárlé rozhodnutí**.
 */
import { describe, it, expect } from "vitest";
import { isGradeAvailable } from "@/lib/contentAvailability";

describe("rodičovská brána — předpoklad o obtížnosti", () => {
  it("5. ročník ještě není otevřený, takže dvojciferné násobení je nad rámec uživatelů", () => {
    expect(
      isGradeAvailable(5),
      "5. ročník je otevřený → Oli teď učí písemné násobení dvojciferným číslem, " +
        "tedy přesně to, co má rodičovská brána bránit. Vyměň úlohu v " +
        "src/components/ParentGate.tsx (například za rok narození rodiče) " +
        "a uprav tenhle test.",
    ).toBe(false);
  });

  it("ročníky, na které Oli dnes míří, jsou pod hranicí té dovednosti", () => {
    // Kdyby se naopak zavřely, brána zůstane bezpečná — hlídáme jen horní hranu.
    expect([2, 3, 4].some((g) => isGradeAvailable(g))).toBe(true);
  });
});
