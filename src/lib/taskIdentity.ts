/**
 * Kdy jsou dvě vygenerované úlohy tatáž úloha.
 *
 * Vypadá to jako maličkost, ale spletlo to už jednu kontrolu: sonda počítala
 * unikátnost podle `question` a nahlásila „1 úloha" u stovky dvojic téma ×
 * úroveň. Chyba nebyla v obsahu — u `match_pairs`, `categorize` a `drag_order`
 * je otázka pořád stejná („Seřaď pět úseků pravěku od nejstaršího") a mění se
 * jen položky. Podle otázky vyšly všechny varianty jako jedna.
 *
 * Identita úlohy proto stojí na tom, **co dítě na obrazovce vidí a řeší**:
 * zadání, klíč, nabídka možností a strukturovaná data. Nápovědy a vysvětlení do
 * klíče nepatří — dvě úlohy se stejným zadáním i možnostmi jsou z pohledu
 * procvičování táž úloha, i kdyby se k nim losovala jiná nápověda.
 */
import type { PracticeTask } from "./types";

/** Otisk úlohy pro počítání unikátnosti. */
export function klicUlohy(task: PracticeTask): string {
  return JSON.stringify([
    task.question,
    task.correctAnswer,
    task.options,
    task.items,
    task.pairs,
    task.categories,
    task.blanks,
    task.correctAnswers,
    task.timelineEvents?.map((e) => e.label),
    task.chemEquation?.tokens.map((t) => `${t.value}:${t.isCoefficient}`),
    task.formulaPool?.map((f) => f.token),
    task.diagram?.labelPool,
    task.imageOptions?.map((i) => i.id),
  ]);
}

/** Počet různých úloh v poli (prázdné položky se nepočítají). */
export function pocetUnikatnich(tasks: (PracticeTask | null | undefined)[]): number {
  return new Set(tasks.filter(Boolean).map((t) => klicUlohy(t as PracticeTask))).size;
}
