/**
 * Rodičovská brána — hlídač předpokladu, na kterém stojí.
 *
 * Brána chce spočítat procenta („30 % z 240"). Obhajoba zní: procenta jsou
 * podle RVP učivo 7. ročníku, takže jsou nad možnostmi dětí, které Oli dnes
 * obsluhuje (ročníky 2–6).
 *
 * Ten předpoklad ale platí jen do chvíle, než se 7. ročník otevře. Pak by Oli
 * sama učila, jak vlastní bránu překonat — a nikdo by si toho nemusel
 * všimnout, protože kód by dál procházel a testy taky.
 *
 * Proto tenhle test: spadne přesně ve chvíli, kdy se předpoklad rozpadne.
 * Není to test chování, je to **budík na zestárlé rozhodnutí**.
 * (Do 2026-09-11 brána násobila dvojciferná čísla a budík hlídal 5. ročník;
 * při jeho otevření zazvonil a úloha se vyměnila.)
 */
import { describe, it, expect } from "vitest";
import { isGradeAvailable } from "@/lib/contentAvailability";
import { novaUloha } from "@/components/ParentGate";

describe("rodičovská brána — předpoklad o obtížnosti", () => {
  it("7. ročník ještě není otevřený, takže procenta jsou nad rámec uživatelů", () => {
    expect(
      isGradeAvailable(7),
      "7. ročník je otevřený → Oli teď učí procenta, tedy přesně to, co má " +
        "rodičovská brána bránit. Vyměň úlohu v src/components/ParentGate.tsx " +
        "a uprav tenhle test.",
    ).toBe(false);
  });

  it("ročníky, na které Oli dnes míří, jsou pod hranicí té dovednosti", () => {
    // Kdyby se naopak zavřely, brána zůstane bezpečná — hlídáme jen horní hranu.
    expect([2, 3, 4, 5, 6].some((g) => isGradeAvailable(g))).toBe(true);
  });
});

describe("rodičovská brána — úloha", () => {
  it("výsledek je vždy celé číslo a procento není triviální", () => {
    for (let i = 0; i < 500; i++) {
      const { procento, zaklad, vysledek } = novaUloha();
      expect(Number.isInteger(vysledek)).toBe(true);
      expect(vysledek).toBe((procento * zaklad) / 100);
      // Ze sta by výsledek byl rovnou procento — to by nic neověřilo.
      expect(zaklad).not.toBe(100);
      expect([50, 100]).not.toContain(procento);
    }
  });
});
