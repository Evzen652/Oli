/**
 * Sdílené utility pro výpočetní témata fyziky 6. ročníku.
 *
 * Obsahuje JEN obecné stavební bloky (formátování čísel, výběr, stavba
 * select_one úlohy s chybovým modelem). Konkrétní generátory (jaké úlohy,
 * jaké distraktory) zůstávají v jednotlivých topic souborech — konvence
 * projektu: jedno téma = jeden samostatný generátor.
 */
import type { PracticeTask } from "@/lib/types";

/** České desetinné číslo (čárka), zaokrouhlené, bez zbytečných nul. */
export function cz(n: number): string {
  return Number(n.toFixed(3)).toString().replace(".", ",");
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Velká nápověda má být aspoň o pětinu delší než malá (audit hint_progression). */
export function doplnVelkou(h0: string, h1: string, doplnky: string[]): string {
  let out = h1;
  for (const d of doplnky) {
    if (out.length >= h0.length * 1.2) break;
    if (!out.includes(d)) out = `${out} ${d}`;
  }
  return out;
}

// Čísla a veličiny ze zadání dají malé nápovědě konkrétní kotvu, aby se
// nápověda neopakovala u všech úloh se stejnými jednotkami.
const CISLO = /[−-]?\d+(?:[,:]\d+)?(?:\s?(?:g\/cm³|kg\/m³|cm³|dm³|m³|mm|cm|dm|km|mg|dkg|kg|g|t|ml|dl|hl|l|min|m|h|s|°C|K)(?![\p{L}\d³/]))?/gu;
const STRATEGIE = [
  "Nakonec si odpověď ověř zpětným výpočtem.",
  "Zkontroluj i jednotku v odpovědi — musí odpovídat tomu, na co se otázka ptá.",
  "Porovnej odpověď s odhadem: dává takové číslo smysl?",
];

/**
 * Dvě nápovědy podle CONTENT_AUTHORING §0: malá = první krok + čísla ze
 * zadání (konkrétní pro úlohu), velká = zbylé kroky dohromady, aspoň o pětinu
 * delší. Označení „Krok N:“ se zahodí — uprostřed spojené nápovědy by číslo
 * kroku vypadalo jako číslo z výpočtu.
 */
export function dveNapovedy(question: string, correct: string, hints: string[]): [string, string] {
  const [prvni, ...zbytek] = hints.map((h) => h.replace(/^Krok \d+:\s*/, ""));
  // Do nápovědy nepatří veličina, ve které je klíč schovaný (0,7 g/cm³ u klíče 7 g),
  // ani holé desetinné číslo z tabulky v zadání (u určování látky by prozradilo hustotu).
  const cisla = [...new Set(question.match(CISLO) ?? [])]
    .filter((z) => !z.includes(correct) && !/^\d+,\d+$/.test(z));
  const h0 = cisla.length ? `${prvni} Čísla ze zadání: ${cisla.join(", ")}.` : prvni;
  return [h0, doplnVelkou(h0, zbytek.join(" ") || prvni, STRATEGIE)];
}

/** Distraktor = konkrétní typická chyba + její diagnostické vysvětlení. */
export interface Distractor {
  value: string;
  why: string;
}

/**
 * Sestaví select_one úlohu s chybovým modelem.
 *  • options se deduplikují (kdyby distraktor vyšel jako správná nebo jiný distraktor)
 *    a zamíchají.
 *  • optionFeedback se naplní z `why` jen pro reálně zařazené distraktory.
 *  • Správná odpověď nikdy nemá optionFeedback (řeší to fallback na explanation).
 */
export function buildChoiceTask(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
): PracticeTask {
  const seen = new Set<string>([correct]);
  const optionFeedback: Record<string, string> = {};
  const uniq: string[] = [];
  for (const d of distractors) {
    if (seen.has(d.value)) continue;
    seen.add(d.value);
    uniq.push(d.value);
    optionFeedback[d.value] = d.why;
  }
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
