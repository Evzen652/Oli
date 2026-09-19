/**
 * Sdílené utility pro zeměpis 6. ročníku.
 *
 * Zeměpis míchá dva vzory:
 *  • faktický (přírodní oblasti, kontinenty, krajinné sféry) — stavba úloh je
 *    stejná jako v přírodopise, jen velká nápověda radí zeměpisně,
 *  • výpočetní (měřítko mapy, zeměpisné souřadnice, časová pásma) — čísla přes
 *    `cis()` z matematiky, souřadnice přes `sirka()` / `delka()`.
 *
 * K obsahu nejsou obrázky map, takže každá úloha musí jít vyřešit ze slov:
 * poloha se popisuje souřadnicemi nebo sousedstvím, ne „podívej se na mapu“.
 *
 * `buildChoiceTask` vrací `null`, když po vyřazení shod nezbydou tři různé
 * distraktory; generátor pak úlohu vylosuje znovu přes `losUlohy()`.
 */
import type { PracticeTask } from "@/lib/types";
import { pick, shuffle, pickN, doplnVelkou, type Distractor } from "../dejepis/_shared";
import { ruzneUlohy } from "../fyzika/_shared";
import { cis, rnd } from "../matematika/_shared";

export { pick, shuffle, pickN, ruzneUlohy, cis, rnd, type Distractor };

/**
 * Zeměpisná šířka česky: `50° s. š.`, `34° j. š.`, `0° (rovník)`.
 * Kladná = sever, záporná = jih. Minuty jen když nejsou nulové.
 */
export function sirka(stupne: number, minuty = 0): string {
  if (stupne === 0 && minuty === 0) return "0° (rovník)";
  const m = minuty ? ` ${minuty}′` : "";
  return `${Math.abs(stupne)}°${m} ${stupne < 0 ? "j. š." : "s. š."}`;
}

/**
 * Zeměpisná délka česky: `14° v. d.`, `74° z. d.`, `0° (nultý poledník)`,
 * `180°`. Kladná = východ, záporná = západ.
 */
export function delka(stupne: number, minuty = 0): string {
  if (stupne === 0 && minuty === 0) return "0° (nultý poledník)";
  if (Math.abs(stupne) === 180 && minuty === 0) return "180°";
  const m = minuty ? ` ${minuty}′` : "";
  return `${Math.abs(stupne)}°${m} ${stupne < 0 ? "z. d." : "v. d."}`;
}

/** Měřítko mapy s mezerou v tisících: `1 : 50 000`. */
export function meritko(jmenovatel: number): string {
  return `1 : ${cis(jmenovatel)}`;
}

/** Čas hh:mm (24hodinový), přetečení přes půlnoc se zabalí: 25 h → `1:00`. */
export function cas(hodin: number, minut = 0): string {
  const celkem = (((hodin * 60 + minut) % 1440) + 1440) % 1440;
  const h = Math.floor(celkem / 60), m = celkem % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

const STRATEGIE_VYBER = [
  "Vylučuj možnosti, které odporují poloze nebo podnebí, které znáš.",
  "Nejdřív škrtni možnost, která je jasně mimo, a pak porovnej zbylé.",
];
const STRATEGIE_VYPOCET = [
  "Nakonec zkontroluj, jestli výsledek dává smysl — třeba jestli vzdálenost není nesmyslně velká.",
  "Dej pozor na jednotky: centimetry na mapě, metry nebo kilometry ve skutečnosti.",
];
const STRATEGIE_RAZENI = [
  "Najdi nejdřív první a poslední položku, zbytek doplň mezi ně.",
  "U každé položky se ptej, co musí být před ní.",
];
const STRATEGIE_TRIDENI = [
  "Zařaď nejdřív položky, u kterých si jsi jistý nebo jistá, a zbytek podle rozlišovacího znaku.",
  "U každé položky se ptej, podle jakého znaku do skupiny patří, ne jak zní na první pohled.",
];

/** Dvě nápovědy: malá beze změny, velká = zbytek dohromady, aspoň o pětinu delší. */
const dve = (hints: string[], doplnky: string[]): string[] =>
  hints.length >= 2 ? [hints[0], doplnVelkou(hints[0], hints.slice(1).join(" "), doplnky)] : hints;

/**
 * select_one s chybovým modelem. Bere první tři distraktory, které se liší od
 * klíče i od sebe; když tři nezbydou, vrátí `null`.
 *
 * `solutionSteps` označuje výpočetní úlohu (měřítko, čas, souřadnice) — pak
 * velká nápověda radí kontrolu výsledku a jednotek místo vylučování.
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
    hints: dve(parts.hints, parts.solutionSteps ? STRATEGIE_VYPOCET : STRATEGIE_VYBER),
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
