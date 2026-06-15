/**
 * Sdílené utility pro FAKTICKÁ témata dějepisu 6. ročníku.
 *
 * Obsahuje jen obecné stavební bloky (výběr, míchání, stavba select_one úlohy
 * s chybovým modelem). Konkrétní generátory — jaké otázky, jaké distraktory,
 * jaká fakta — zůstávají v jednotlivých topic souborech (konvence projektu:
 * jedno téma = jeden samostatný generátor).
 *
 * Faktický vzor 2. stupně se od výpočetního (fyzika `_shared.ts`) liší jen
 * povahou distraktorů: nejsou to numerické posuny, ale TYPICKÉ HISTORICKÉ OMYLY
 * (záměna éry, „menší číslo = dřív" u př. n. l., zapomenutý rok 0). Princip
 * „distraktor = konkrétní chyba → zároveň diagnostikuje" zůstává stejný.
 */
import type { PracticeTask } from "@/lib/types";

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

/** Vybere `n` různých prvků z pole (bez opakování). */
export function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Distraktor = konkrétní typická chyba + její diagnostické vysvětlení. */
export interface Distractor {
  value: string;
  why: string;
}

/**
 * Sestaví select_one úlohu s chybovým modelem.
 *  • options se deduplikují (kdyby distraktor vyšel jako správná nebo jiný
 *    distraktor) a zamíchají.
 *  • optionFeedback se naplní z `why` jen pro reálně zařazené distraktory.
 *  • Správná odpověď nikdy nemá optionFeedback (řeší fallback na explanation).
 */
export function buildChoiceTask(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; explanation: string; solutionSteps?: string[] },
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
  const task: PracticeTask = {
    question,
    correctAnswer: correct,
    options: shuffle([correct, ...uniq]),
    optionFeedback,
    hints: parts.hints,
    explanation: parts.explanation,
  };
  if (parts.solutionSteps) task.solutionSteps = parts.solutionSteps;
  return task;
}
