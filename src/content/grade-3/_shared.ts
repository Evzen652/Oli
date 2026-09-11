/**
 * Sdílené stavební bloky pro obsah 3. ročníku (2026-09-11, audit 3. ročníku).
 *
 * Stejný princip jako `grade-5/_shared.ts`: každá výběrová úloha nese dvě vlastní
 * nápovědy, zpětnou vazbu u každé chybné možnosti a vysvětlení PROČ
 * (CONTENT_AUTHORING §0). Velká nápověda se v případě potřeby doplní obecnou
 * radou, aby byla aspoň o pětinu delší než malá (audit hint_progression).
 */
import type { PracticeTask } from "@/lib/types";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Distraktor = konkrétní typická chyba + vysvětlení, proč to tak není. */
export interface Distractor {
  value: string;
  why: string;
}

export interface TaskDocs {
  hints: [string, string];
  explanation: string;
}

const STRATEGIE_VYBER = [
  "Nejdřív škrtni možnost, která s otázkou vůbec nesouvisí.",
  "Pak porovnej zbylé možnosti a vyber tu, která sedí úplně celá.",
];

/** Velká nápověda má být aspoň o pětinu delší než malá (audit hint_progression). */
export function doplnVelkou(h0: string, h1: string, doplnky: string[]): string {
  let out = h1;
  for (const d of doplnky) {
    if (out.length >= h0.length * 1.2) break;
    if (!out.includes(d)) out = `${out} ${d}`;
  }
  return out;
}

/** select_one úloha s chybovým modelem; správná odpověď zpětnou vazbu nemá. */
export function choice(
  question: string,
  correct: string,
  distractors: [Distractor, Distractor, Distractor],
  docs: TaskDocs,
): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const d of distractors) optionFeedback[d.value] = d.why;
  return {
    question,
    correctAnswer: correct,
    options: shuffle([correct, ...distractors.map((d) => d.value)]),
    optionFeedback,
    hints: [docs.hints[0], doplnVelkou(docs.hints[0], docs.hints[1], STRATEGIE_VYBER)],
    explanation: docs.explanation,
  };
}

/**
 * Určovací úloha: položka patří do jedné z kategorií, chybné možnosti jsou ostatní
 * kategorie a jejich zpětná vazba připomene, podle čeho se poznají.
 */
export interface Kategorie {
  nazev: string;
  /** Podle čeho se kategorie pozná — jde do zpětné vazby. */
  znak: string;
}

export function urcovaci(
  question: string,
  spravna: string,
  kategorie: Kategorie[],
  docs: TaskDocs,
  /** Kategorie, které se mají mezi chybnými možnostmi objevit přednostně (typická záměna). */
  prednost: string[] = [],
): PracticeTask {
  const ostatni = kategorie.filter((k) => k.nazev !== spravna);
  const jine = [
    ...ostatni.filter((k) => prednost.includes(k.nazev)),
    ...shuffle(ostatni.filter((k) => !prednost.includes(k.nazev))),
  ].slice(0, 3);
  if (jine.length < 3) throw new Error(`Málo kategorií pro „${question}“`);
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  return choice(question, spravna, jine.map((k) => ({ value: k.nazev, why: `${cap(k.nazev)}: ${k.znak}` })) as [Distractor, Distractor, Distractor], docs);
}
