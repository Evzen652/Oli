import { describe, it, expect } from "vitest";
import { checkCzechAgreement, agreementFields } from "@/lib/czechAgreementLint";

/**
 * Vzorky jsou skutečné věty z obsahu, ne vymyšlené.
 *
 * Sekce „nesmí hlásit" je důležitější než ta první: gramatická kontrola už
 * jednou vyrobila 22 falešných nálezů na správných tvarech („4 balení“) a
 * podle nich se pak „opravoval" zmrazený obsah. Každé nové pravidlo proto
 * musí projít i tímhle seznamem.
 */
describe("lint shody přísudku s číslovkou", () => {
  describe("musí hlásit", () => {
    it("spona u 2–4: „od 0 do 4 je 4 centimetry“ (nález z kontroly g2mat-d)", () => {
      const f = checkCzechAgreement(
        "Pravítko měří od nuly, takže číslo na konci úsečky rovnou udává její délku: od 0 do 4 je 4 centimetry.",
      );
      expect(f).toHaveLength(1);
      expect(f[0].rule).toBe("shoda_prisudku");
      expect(f[0].detail).toContain("jsou 4 centimetry");
    });

    it("minulý čas u mužského životného: „Ve třídě bylo 3 žáci“", () => {
      const f = checkCzechAgreement("Ve třídě bylo 3 žáci.");
      expect(f.map((x) => x.rule)).toEqual(["shoda_prisudku"]);
      expect(f[0].detail).toContain("byli 3 žáci");
    });

    it("minulý čas u středního rodu: „bylo 2 jablka“ → „byla“", () => {
      const f = checkCzechAgreement("V míse bylo 2 jablka.");
      expect(f[0].detail).toContain("byla 2 jablka");
    });

    it("„mají dva a půl litru“ — po „půl“ je přísudek v jednotném čísle", () => {
      const f = checkCzechAgreement("Kolik decilitrů mají dva a půl litru?");
      expect(f.map((x) => x.rule)).toEqual(["pul_s_mnoznym_cislem"]);
    });

    it("genitiv plurálu po 2–4: „3 dílů“", () => {
      const f = checkCzechAgreement("Rozděl to na 3 dílů.");
      expect(f.map((x) => x.rule)).toEqual(["genitiv_po_2_4"]);
    });
  });

  describe("nesmí hlásit", () => {
    const spravne = [
      "Ve třídě byli 3 žáci.",            // mužský životný, správně
      "V pondělí byla 2 jablka.",         // střední rod, správně
      "V krabici byly 3 kostky.",         // ženský rod, správně
      "Od 0 do 4 jsou 4 centimetry.",     // opravená verze nálezu
      "Bylo 5 jablek.",                   // 5+ → střední j. č., správně
      "Je 5 centimetrů.",                 // 5+ → spona v j. č., správně
      "Vezmi ze 3 bodů jen dva.",         // po předložce je genitiv správně
      "Do 4 hodin to zvládneš.",          // totéž
      "Zbyla 4 balení.",                  // historický falešný nález
      "Výsledek je 3 centimetry.",        // podmět v j. č. → spona v j. č.
      "Délka je 2 metry.",                // totéž
      "Je to 4 centimetry.",              // podmět „to"
      "Máš 3 kuličky a 2 kostky.",        // „mít" se s číslovkou neshoduje
      "Petr má 2 auta.",                  // totéž
      "Výsledek: 3 zbytek 0.",            // -ek je tu nominativ sg., ne genitiv pl.
      "6 ÷ 2 = 3 zbytek 0.",              // číslo za rovnítkem neřídí slovo za sebou
      "Rozděl to na 3 zlomek?",           // „zlomek" je taky nominativ sg.
    ];
    for (const veta of spravne) {
      it(`„${veta}“`, () => {
        expect(checkCzechAgreement(veta)).toEqual([]);
      });
    }
  });

  it("prochází všechna textová pole úlohy, ne jen otázku", () => {
    const fields = agreementFields({
      question: "Kolik měří úsečka?",
      explanation: "Od 0 do 4 je 4 centimetry.",
      hints: ["Spočítej dílky.", "Každý dílek je 1 cm."],
      optionFeedback: { "3 cm": "Ve třídě bylo 3 žáci." },
      solutionSteps: undefined,
    });
    expect(fields.map((f) => f.label)).toEqual([
      "otázka",
      "vysvětlení",
      "nápověda 1",
      "nápověda 2",
      "zpětná vazba (3 cm)",
    ]);
    const nalezy = fields.flatMap((f) => checkCzechAgreement(f.text));
    expect(nalezy).toHaveLength(2); // vysvětlení + zpětná vazba
  });
});
