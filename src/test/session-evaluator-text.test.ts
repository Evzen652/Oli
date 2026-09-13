/**
 * Slovní hodnocení po sezení — jazyk a věcná správnost.
 *
 * Hodnocení čte dítě hned po dokončení sezení, takže se sem nedostane text,
 * který mu buď nejde přečíst, nebo mu tvrdí něco jiného, než jak dopadlo.
 *
 * Hlídané dvě věci (obojí nalezeno 2026-09-13 na skutečném výstupu):
 *  1. **Rodové koncovky a lomítkové tvary** — „Zvládl/a jsi", „sám/sama",
 *     „hrdý/á", „využil/a 1krát". Aplikace pohlaví dítěte nezná, takže rod
 *     hádat nemůže; lomítko je navíc pro druháka, který se teprve rozečítá,
 *     překážka. Věta se má postavit tak, aby rod nepotřebovala.
 *  2. **„skoro všechno" při plném počtu** — varianty se losují, a bez ošetření
 *     dostalo dítě za 6 z 6 větu „skoro všechno bylo správně".
 *
 * Šablona losuje, takže se každý scénář projede mnohokrát — jeden běh by
 * variantu s chybou minul.
 */
import { describe, it, expect } from "vitest";
import { generateLocalEvaluation, type EvalInput } from "@/lib/sessionEvaluator";

const PREDMETY = ["matematika", "čeština", "prvouka", "vlastivěda"];
const TEMATA = ["Sčítání do 100", "Vyjmenovaná slova po B", "Doplňovací diktát", "Zima a zvířata"];

/** Projede křížem ročníky, předměty, úspěšnost i použití nápovědy. */
function vsechnyVystupy(opakovani = 30): { vstup: EvalInput; text: string }[] {
  const out: { vstup: EvalInput; text: string }[] = [];
  for (const grade of [1, 2, 3, 4, 5]) {
    for (const subject of PREDMETY) {
      for (const topicTitle of TEMATA) {
        for (const totalTasks of [1, 5, 6, 8]) {
          for (const correctCount of [0, 1, Math.floor(totalTasks / 2), totalTasks]) {
            if (correctCount > totalTasks) continue;
            for (const helpUsedCount of [0, 1, 3]) {
              const vstup: EvalInput = {
                topicTitle,
                totalTasks,
                correctCount,
                wrongCount: totalTasks - correctCount,
                helpUsedCount,
                grade,
                subject,
              };
              for (let k = 0; k < opakovani; k++) {
                out.push({ vstup, text: generateLocalEvaluation(vstup) });
              }
            }
          }
        }
      }
    }
  }
  return out;
}

describe("SLOVNÍ HODNOCENÍ — jazyk a věcnost", () => {
  const vystupy = vsechnyVystupy();

  it("neobsahuje rodové koncovky ani lomítkové tvary", () => {
    // Lomítko mezi dvěma písmeny/koncovkami: „l/a", „ý/á", „sám/sama".
    const lomitko = /\p{L}\/\p{L}/u;
    const nalezy = [...new Set(vystupy.filter((v) => lomitko.test(v.text)).map((v) => v.text))];

    expect(
      nalezy.length,
      `Hodnocení obsahuje rodový lomítkový tvar (${nalezy.length} různých vět):\n\n` +
        nalezy.slice(0, 8).map((t) => `  „${t}"`).join("\n"),
    ).toBe(0);
  });

  it("netvrdi slovo skoro, kdyz ma dite vsechno spravne", () => {
    const nalezy = [
      ...new Set(
        vystupy
          .filter((v) => v.vstup.correctCount === v.vstup.totalTasks && /skoro/i.test(v.text))
          .map((v) => `${v.vstup.correctCount}/${v.vstup.totalTasks}: ${v.text}`),
      ),
    ];

    expect(
      nalezy.length,
      `Při plném počtu hodnocení říká „skoro" (${nalezy.length} různých vět):\n\n` +
        nalezy.slice(0, 8).map((t) => `  ${t}`).join("\n"),
    ).toBe(0);
  });

  it("netvrdi vsechno spravne, kdyz dite chybovalo", () => {
    const nalezy = [
      ...new Set(
        vystupy
          .filter((v) => v.vstup.correctCount < v.vstup.totalTasks && /všechno správně/i.test(v.text))
          .map((v) => `${v.vstup.correctCount}/${v.vstup.totalTasks}: ${v.text}`),
      ),
    ];

    expect(
      nalezy.length,
      `Hodnocení tvrdí „všechno správně" i při chybě (${nalezy.length} různých vět):\n\n` +
        nalezy.slice(0, 8).map((t) => `  ${t}`).join("\n"),
    ).toBe(0);
  });

  /**
   * Název tématu je jednou v jednotném čísle („Sčítání do 100"), jindy
   * v množném („Vyjmenovaná slova po B"). Jako holý podmět tedy rozbíjel shodu
   * s přísudkem — vznikalo „Vyjmenovaná slova po B ti evidentně jde". Věta ho
   * proto musí uvodit slovem, které číslo drží („Téma X ti jde", „V tématu X").
   */
  it("nestavi nazev tematu jako holy podmet", () => {
    const mnozne = "Vyjmenovaná slova po B";
    const nalezy = [
      ...new Set(
        vystupy
          .filter((v) => v.vstup.topicTitle === mnozne)
          .map((v) => v.text)
          // Zajímá nás jen téma na začátku věty, bez uvozujícího slova.
          .filter((t) => new RegExp(`(^|[.!?] )${mnozne}\\s`).test(t)),
      ),
    ];

    expect(
      nalezy.length,
      `Název tématu stojí jako holý podmět, takže se u témat v množném čísle ` +
        `rozchází shoda s přísudkem (${nalezy.length} vět):\n\n` +
        nalezy.slice(0, 8).map((t) => `  ${t}`).join("\n"),
    ).toBe(0);
  });

  it("vždy vrátí neprázdný text", () => {
    const prazdne = vystupy.filter((v) => !v.text.trim());
    expect(prazdne.length, "hodnocení vrátilo prázdný řetězec").toBe(0);
  });
});
