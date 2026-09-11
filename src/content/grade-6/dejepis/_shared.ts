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

/** Velká nápověda má být aspoň o pětinu delší než malá (audit hint_progression). */
export function doplnVelkou(h0: string, h1: string, doplnky: string[]): string {
  let out = h1;
  for (const d of doplnky) {
    if (out.length >= h0.length * 1.2) break;
    if (!out.includes(d)) out = `${out} ${d}`;
  }
  return out;
}

const STRATEGIE_VYBER = ["Vylučuj možnosti, které odporují tomu, co o tématu víš.", "Nejdřív škrtni tu, která je jasně mimo, a pak porovnej zbylé."];
const STRATEGIE_RAZENI = ["Najdi nejdřív nejstarší položku, pak nejnovější, a zbytek doplň mezi ně.", "U každé položky se ptej, z jaké doby pochází a co bylo před ní.", "Kámen byl dřív než kov a bronz dřív než železo."];
const STRATEGIE_TRIDENI = ["Zařaď nejdřív položky, u kterých si jsi jistý nebo jistá, a zbytek podle rozlišovacího znaku.", "U každé položky se ptej, co je na ní to podstatné, ne z čeho je vyrobená."];
/** Dvě nápovědy: malá beze změny, velká = zbytek dohromady, aspoň o pětinu delší. */
const dve = (hints: string[], doplnky: string[]): string[] =>
  hints.length >= 2 ? [hints[0], doplnVelkou(hints[0], hints.slice(1).join(" "), doplnky)] : hints;

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
    hints: dve(parts.hints, STRATEGIE_VYBER),
    explanation: parts.explanation,
  };
  if (parts.solutionSteps) task.solutionSteps = parts.solutionSteps;
  return task;
}

/**
 * Sestaví drag_order (chronologickou) úlohu.
 *  • `orderedItems` jsou ve SPRÁVNÉM pořadí (od nejstaršího po nejnovější);
 *    UI je při zobrazení zamíchá, žák je seřazuje zpět.
 *  • drag_order nemá distraktory ani optionFeedback — kvalita je v jednoznačné
 *    chronologii a ve vysvětlení PROČ to pořadí (kauzální logika, ne jen „je to tak").
 *  • Nápovědy navádějí kotvou (co je první/poslední), neprozrazují celé pořadí.
 */
export function buildOrderTask(
  question: string,
  orderedItems: string[],
  parts: { hints: string[]; explanation: string },
): PracticeTask {
  return {
    question,
    correctAnswer: "order",
    items: orderedItems,
    hints: dve(parts.hints, STRATEGIE_RAZENI),
    explanation: parts.explanation,
  };
}

/**
 * Sestaví categorize úlohu (žák třídí položky do skupin).
 *  • `categories` = cílové skupiny s položkami, které do nich patří.
 *  • correctAnswer je technický marker "categorize" (skutečná odpověď je
 *    v `categories`); kvalita leží v JEDNOZNAČNÉM zařazení a ve vysvětlení
 *    ROZLIŠOVACÍHO znaku (např. pramen „nese text" = písemný).
 *  • Chybový model u categorize = záměrně zařadit položku, která NAVENEK vypadá
 *    jako jiná skupina (klínová tabulka = hmotná hlína, ale nese text → písemný);
 *    vysvětlení pak pojmenuje, podle čeho se rozhoduje.
 */
export function buildCategorizeTask(
  question: string,
  categories: { name: string; items: string[] }[],
  parts: { hints: string[]; explanation: string },
): PracticeTask {
  return {
    question,
    correctAnswer: "categorize",
    categories,
    hints: dve(parts.hints, STRATEGIE_TRIDENI),
    explanation: parts.explanation,
  };
}
