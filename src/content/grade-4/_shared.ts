/**
 * Sdílené stavební bloky pro faktická témata 4. ročníku (přírodověda, vlastivěda).
 *
 * Kopie vzoru z `grade-6/dejepis/_shared.ts`, ne import: každý ročník vlastní
 * jen svou složku (docs/SESSION_OWNERSHIP.md) a sdílení přes hranici ročníku
 * by z jednoho ročníku udělalo závislost druhého.
 *
 * Proč vůbec helper: do 2026-09-11 měla přírodověda 4. ročníku u úloh jen
 * otázku, klíč a možnosti. Nápověda se brala z `helpTemplate` celého tématu,
 * takže u otázky na zimní spánek dítě četlo „Velryba a netopýr jsou savci!".
 * `choice()` vynucuje úplnou dokumentaci úlohy (CONTENT_AUTHORING §0) už
 * tvarem volání — bez nápověd, vysvětlení a diagnostiky distraktorů úlohu
 * nejde sestavit.
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

/** Distraktor = konkrétní typická chyba + vysvětlení, proč to tak není. */
export interface Distractor {
  value: string;
  why: string;
}

export interface TaskDocs {
  /** [malá, velká] — obě k TÉHLE úloze, velká o kus konkrétnější. */
  hints: [string, string];
  /** Proč je správná odpověď správná — ne jen co je správně. */
  explanation: string;
}

/**
 * select_one úloha s chybovým modelem. Možnosti se zamíchají, optionFeedback
 * se naplní z `why` každého distraktoru; správná odpověď feedback nemá
 * (po chybě se ukáže `explanation`).
 */
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
    hints: docs.hints,
    explanation: docs.explanation,
  };
}

/** match_pairs úloha. Distraktory nemá, po chybě UI vypíše správné páry. */
export function match(
  question: string,
  pairs: { left: string; right: string }[],
  docs: TaskDocs,
): PracticeTask {
  return {
    question,
    correctAnswer: "match",
    pairs,
    hints: docs.hints,
    explanation: docs.explanation,
  };
}

/**
 * Posílí nápovědy u úloh, které se převzaly ze starších poolů (2026-09-11):
 *  • malá nápověda, která se v tématu opakuje u víc úloh, se nahradí
 *    nápovědou vázanou na položku té konkrétní úlohy — opakovaná nápověda
 *    typu „Slované přišli jako první.“ navíc prozrazovala první položku;
 *  • velká nápověda, která není aspoň o pětinu delší než malá (audit
 *    hint_progression), dostane doplněk se strategií pro danou úroveň.
 *    Doplněk radí jak řadit, ne v jakém pořadí.
 */
export function posilNapovedy(pools: PracticeTask[][], doplnek: Record<number, string>): PracticeTask[][] {
  const pocet = new Map<string, number>();
  for (const pool of pools) for (const t of pool) {
    const h = t.hints?.[0];
    if (h) pocet.set(h, (pocet.get(h) ?? 0) + 1);
  }
  const pouzite = new Set(pocet.keys());
  return pools.map((pool, i) => pool.map((t) => {
    let [h0, h1] = t.hints ?? [];
    if (!h0 || !h1) return t;
    if ((pocet.get(h0) ?? 0) > 1 && t.items && t.items.length > 1) {
      // První položku vynecháváme — nápověda „začni u X" by prozradila začátek řady.
      const nova = t.items.slice(1)
        .map((it) => `Najdi nejdřív místo pro „${it}“ a porovnej ji s ostatními položkami.`)
        .find((h) => !pouzite.has(h));
      if (nova) { h0 = nova; pouzite.add(nova); }
    }
    if (h1.length < h0.length * 1.2) h1 = `${h1} ${doplnek[i + 1] ?? ""}`.trim();
    return { ...t, hints: [h0, h1] };
  }));
}
