/**
 * Texty pro dítě bez rodových lomítkových tvarů.
 *
 * Aplikace pohlaví dítěte nezná a „zvládl/a", „sám/sama" nebo „vedl(a)" je pro
 * druháka, který se teprve rozečítá, překážka. Slovní hodnocení to hlídá
 * v `session-evaluator-text.test.ts`; tady jsou ostatní plochy, na kterých
 * dítě čte: domovská stránka, karty „Co je dobré vědět", popisy okruhů,
 * dialogy sezení a dětská větev zpětné vazby k dovednosti.
 *
 * Měří se jen řetězcové literály (komentáře ani regexy ne) — komentář smí
 * o lomítkovém tvaru mluvit, dítě ho nevidí.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getIntroSentence } from "@/lib/skillFeedback";

const SOUBORY = [
  "src/components/ChildHomePage.tsx",
  "src/components/SessionRecoveryDialog.tsx",
  "src/components/ExitSessionDialog.tsx",
  "src/components/InviteParentDialog.tsx",
  "src/hooks/useSessionDispatch.ts",
  "src/lib/categoryInfo.ts",
  "src/lib/topicInsight.ts",
  "src/lib/studentLabels.ts",
  "src/lib/i18n/cs.ts",
];

// „zvládl/a", „hrdý/á", „přihlášen/a", „sám/sama", „došel/došla" i „vedl(a)".
// Ne obecné „písmeno/písmeno" — „Y/Ý", „ten/ta/to" nebo „km/h" jsou v pořádku.
const LOMITKO = /\p{L}(?:l|n|ý)\/(?:a|á)(?!\p{L})|sám\/sama|\p{L}l\/\p{L}+la|\p{L}l\(a\)/u;

/** Obsahy řetězcových literálů ("…", '…', `…`) bez komentářů. */
function literaly(zdroj: string): string[] {
  const bezKomentaru = zdroj
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
  const out: string[] = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(bezKomentaru))) out.push(m[1] ?? m[2] ?? m[3] ?? "");
  return out;
}

describe("dětské texty bez rodových lomítkových tvarů", () => {
  it.each(SOUBORY)("%s", (soubor) => {
    const nalezy = literaly(readFileSync(resolve(process.cwd(), soubor), "utf-8"))
      .filter((t) => !/^https?:/.test(t) && !t.includes("://"))
      .filter((t) => LOMITKO.test(t));
    expect(nalezy, nalezy.map((t) => `  „${t}"`).join("\n")).toEqual([]);
  });

  it("úvodní věta zpětné vazby pro dítě", () => {
    const veta = getIntroSentence(
      "child",
      { date: "2026-10-01", total: 6, correct: 5, pct: 83 } as never,
      2,
    );
    expect(veta).not.toMatch(LOMITKO);
  });
});
