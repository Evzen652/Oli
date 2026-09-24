/**
 * Sdílené utility pro výchovu k občanství 6. ročníku (konceptuální předmět).
 *
 * Stavba úloh je stejná jako v přírodopise (`../prirodopis/_shared.ts`), liší
 * se jen rady ve velké nápovědě — ty musí mluvit o pojmech a situacích, ne
 * o organismech. `buildChoiceTask` vrací `null`, když po vyřazení shod
 * nezbydou tři různé distraktory; generátor pak úlohu vylosuje znovu přes
 * `losUlohy()`.
 *
 * Distraktor = typická záměna pojmů šesťáka (vlastnost ↔ dovednost,
 * obec ↔ kraj, znak ↔ vlajka, výdaj ↔ příjem…), ne náhodný pojem a nikdy
 * hodnotový soud u sporného tématu.
 */
import type { PracticeTask } from "@/lib/types";
import { pick, shuffle, pickN, doplnVelkou, type Distractor } from "../dejepis/_shared";
import { ruzneUlohy } from "../fyzika/_shared";

export { pick, shuffle, pickN, ruzneUlohy, type Distractor };

const STRATEGIE_VYBER = [
  "Zkus si situaci představit a rozhodni, ke kterému pojmu skutečně patří.",
  "Nejdřív vylouči možnost, která je jasně mimo, a pak porovnej zbylé.",
];
const STRATEGIE_RAZENI = [
  "Najdi nejdřív první a poslední krok, zbytek doplň mezi ně.",
  "U každé položky se ptej, co musí proběhnout před ní.",
];
const STRATEGIE_TRIDENI = [
  "Zařaď nejdřív položky, u kterých si jsi jistý nebo jistá, a zbytek podle rozlišovacího znaku.",
  "U každé položky se ptej, podle jakého znaku do skupiny patří, ne jak zní podobně.",
];

/** Dvě nápovědy: malá beze změny, velká = zbytek dohromady, aspoň o pětinu delší. */
const dve = (hints: string[], doplnky: string[]): string[] =>
  hints.length >= 2 ? [hints[0], doplnVelkou(hints[0], hints.slice(1).join(" "), doplnky)] : hints;

/**
 * select_one s chybovým modelem. Bere první tři distraktory, které se liší od
 * klíče i od sebe; když tři nezbydou, vrátí `null`.
 */
export function buildChoiceTask(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; explanation: string; solutionSteps?: string[] },
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

/** drag_order — `orderedItems` ve správném pořadí, UI je zamíchá. */
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

/** categorize — skutečná odpověď je v `categories`. */
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

/** Losuje, dokud tvůrce nevrátí úlohu. Použití: `ruzneUlohy(() => losUlohy(genL2))`. */
export function losUlohy(tvor: () => PracticeTask | null, pokusu = 200): PracticeTask {
  for (let i = 0; i < pokusu; i++) {
    const t = tvor();
    if (t) return t;
  }
  throw new Error("losUlohy: tvůrce ani po opakování nevrátil úlohu se čtyřmi možnostmi");
}
