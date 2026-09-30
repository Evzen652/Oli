import type { PracticeTask } from "@/lib/types";

/**
 * Z výběrové úlohy udělá úlohu na ZÁPIS ČÍSLA (`inputType: "number"`).
 *
 * Menu zmizí, diagnostika chyb zůstane: `optionFeedback` je klíčované
 * hodnotou distraktoru, a `getTargetedFeedback` ji hledá podle toho, co dítě
 * napsalo. Takže „zapomenutý přenos" se vysvětlí právě tomu dítěti, které tu
 * chybu skutečně udělalo — u výběru ze čtyř možností ji naopak mohlo jen
 * tipnout, nebo výsledek uhádnout podle poslední číslice či řádu.
 *
 * `options` se MUSÍ zahodit, ne vyprázdnit: `PracticeInputRouter` dává
 * přednost tvaru úlohy před `topic.inputType`, takže úloha s neprázdnými
 * `options` dostane tlačítka i u `inputType: "number"`.
 *
 * Podmínka pro převedené téma: klíč musí projít `validateTaskForInputType`
 * pro `number` (`/^-?\d+([.,]\d+)?$/`) — tedy žádná jednotka, žádný „zb. 2"
 * a žádná mezera mezi řády. Jinak úlohu zahodí offline audit i
 * `filterValidTasks` a dítě dostane prázdné sezení.
 */
export function napisCislo(t: PracticeTask): PracticeTask {
  const { options: _options, ...bezMenu } = t;
  return bezMenu;
}

/** Celý generátor tématu najednou. */
export const napisCisla = (tasks: PracticeTask[]): PracticeTask[] => tasks.map(napisCislo);
