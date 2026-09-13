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
 *
 * **Pořadí možností se do klíče nepočítá** (2026-09-13). `buildChoiceTask`
 * nabídku vždycky zamíchá, takže dvě úlohy se stejným zadáním i stejnou
 * čtveřicí možností vycházely jako různé — a počítadlo unikátnosti tím nafouklo
 * každé téma typu select_one. U tématu Skupenství látek hlásilo 24 úloh tam,
 * kde jich ve skutečnosti bylo 18. Pro dítě je přeházená nabídka táž úloha;
 * kdyby na pořadí záleželo, stačilo by pár zadání a brána `>= 12 unikátních`
 * by prošla permutacemi místo obsahem. Ostatní pole se schválně neřadí — u
 * `items` nebo `pairs` může být pořadí součástí zadání.
 */
import type { PracticeTask } from "./types";

/** Otisk úlohy pro počítání unikátnosti. */
export function klicUlohy(task: PracticeTask): string {
  return JSON.stringify([
    task.question,
    task.correctAnswer,
    task.options ? [...task.options].sort() : undefined,
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
