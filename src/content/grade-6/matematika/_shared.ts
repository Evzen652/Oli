/**
 * Sdílené utility pro matematiku 6. ročníku.
 *
 * Staví na výpočetním vzoru fyziky (`../fyzika/_shared.ts`): stejná stavba
 * select_one úlohy s chybovým modelem a stejné `ruzneUlohy()`. Liší se jen
 * v tom, co matematika potřebuje navíc:
 *  • čísla se píšou česky i s oddělovačem tisíců (`2 500`, `3,75`, `−4`),
 *  • malá nápověda rozpozná i stupně, minuty a jednotky obsahu a objemu
 *    a číslo s mezerou v tisících nerozdělí na dvě.
 *
 * Žák v matematice šestky jen VYBÍRÁ. Číselné pole (`input[type=number]`)
 * zahodí desetinnou čárku, proto desetinné výsledky jen jako možnosti.
 */
import type { PracticeTask } from "@/lib/types";
import { doplnVelkou, pick, shuffle, ruzneUlohy, type Distractor } from "../fyzika/_shared";

export { doplnVelkou, pick, shuffle, ruzneUlohy, type Distractor };

/** Celé číslo z intervalu ⟨min, max⟩. */
export function rnd(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Číslo česky: desetinná čárka, tisíce oddělené mezerou, typografické minus.
 * Zaokrouhluje na 4 desetinná místa, aby `0,1 + 0,2` nevypsalo `0,30000000000000004`.
 */
export function cis(n: number): string {
  const r = Math.round(n * 10000) / 10000;
  const s = Math.abs(r).toLocaleString("cs-CZ", { maximumFractionDigits: 4 }).replace(/\s/g, " ");
  return r < 0 ? `−${s}` : s;
}

/** Úhel ve stupních a minutách: 47° 30′ · 90° · 12′. */
export function uhel(minut: number): string {
  const st = Math.floor(minut / 60), m = minut % 60;
  if (st === 0) return `${m}′`;
  return m === 0 ? `${st}°` : `${st}° ${m}′`;
}

// Číslo (i s mezerou v tisících a desetinnou čárkou) a případná jednotka.
// Hranice čísla nesmí sousedit s číslicí ani se znakem skryté číslice,
// jinak by se „2 500“ nebo „80 3*2“ rozpadlo na kusy.
const CISLO = /(?<![\d*□,])[−-]?\d{1,3}(?: \d{3})*(?:,\d+)?(?![\d*□]|,\d)(?:\s?(?:°|′|cm²|dm²|m²|mm²|cm³|dm³|m³|mm³|mm|cm|dm|km|kg|g|l|ml|Kč|%)(?![\p{L}\d²³]))?/gu;
/** Zadání se skrytou číslicí (803*2, 4□5) — kusy čísla by nápovědu mátly. */
const SKRYTA_CISLICE = /\d\s?[*□]|[*□]\s?\d/;
const CISELNA_CAST = /^[−-]?\d[\d ]*(?:,\d+)?/;
const STRATEGIE: { text: string; uzZaznelo: RegExp }[] = [
  { text: "Nakonec si výsledek ověř zkouškou.", uzZaznelo: /zkouš/i },
  { text: "Porovnej výsledek s odhadem: dává takové číslo smysl?", uzZaznelo: /odhad/i },
  { text: "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.", uzZaznelo: /na co se (otázka )?ptá/i },
];

/**
 * Dvě nápovědy podle CONTENT_AUTHORING §0: malá = první krok + čísla ze
 * zadání (konkrétní pro úlohu), velká = zbylé kroky dohromady, aspoň o pětinu
 * delší.
 *
 * Čísla se v seznamu oddělují středníkem — čárka by splynula s desetinnou
 * („0,9, 3,25“). Vynechá se jen číslo, které se klíči rovná; dřív se
 * porovnávalo podřetězcem a z nápovědy mizela zadaná čísla (u klíče 55
 * i zadaná 5). Obecná rada se nepřidá, když totéž nápověda už říká.
 */
export function dveNapovedy(question: string, correct: string, hints: string[]): [string, string] {
  const [prvni, ...zbytek] = hints.map((h) => h.replace(/^Krok \d+:\s*/, ""));
  const klic = correct.match(CISELNA_CAST)?.[0].trim();
  const cisla = SKRYTA_CISLICE.test(question)
    ? []
    : [...new Set((question.match(CISLO) ?? []).map((z) => z.trim()))]
        .filter((z) => z.match(CISELNA_CAST)?.[0].trim() !== klic);
  const h0 = cisla.length ? `${prvni} Čísla ze zadání: ${cisla.join("; ")}.` : prvni;
  let h1 = zbytek.join(" ") || prvni;
  for (const s of STRATEGIE) {
    if (h1.length >= h0.length * 1.2) break;
    if (!s.uzZaznelo.test(h1)) h1 = `${h1} ${s.text}`;
  }
  return [h0, h1];
}

/**
 * Sestaví select_one úlohu s chybovým modelem (stejná smlouva jako ve fyzice).
 * Distraktor, který po dosazení vyjde shodně s klíčem nebo s jiným
 * distraktorem, se zahodí. Když pak zbydou méně než tři, vrátí `null` —
 * úloha se čtyřmi možnostmi je požadavek, ne přání. `ruzneUlohy` s tím počítá
 * přes `losUlohy()`.
 */
export function buildChoiceTask(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
): PracticeTask | null {
  const seen = new Set<string>([correct]);
  const optionFeedback: Record<string, string> = {};
  const uniq: string[] = [];
  for (const d of distractors) {
    if (seen.has(d.value) || uniq.length === 3) continue;
    seen.add(d.value);
    uniq.push(d.value);
    optionFeedback[d.value] = d.why;
  }
  if (uniq.length < 3) return null;
  return {
    question,
    correctAnswer: correct,
    options: shuffle([correct, ...uniq]),
    optionFeedback,
    hints: dveNapovedy(question, correct, parts.hints),
    solutionSteps: parts.solutionSteps,
    explanation: parts.explanation,
  };
}

/**
 * Losuje, dokud tvůrce nevrátí úlohu (tvůrce smí vrátit `null`, když mu
 * distraktory splynuly). Použití: `ruzneUlohy(() => losUlohy(genL2))`.
 */
export function losUlohy(tvor: () => PracticeTask | null, pokusu = 200): PracticeTask {
  for (let i = 0; i < pokusu; i++) {
    const t = tvor();
    if (t) return t;
  }
  throw new Error("losUlohy: tvůrce ani po opakování nevrátil úlohu se čtyřmi možnostmi");
}
