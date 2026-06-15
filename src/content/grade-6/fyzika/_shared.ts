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
    hints: parts.hints,
    solutionSteps: parts.solutionSteps,
    explanation: parts.explanation,
  };
}
