/**
 * Pokrytí obtížnostních úrovní z kódového generátoru.
 *
 * `gen(level)` je **jediný zdroj pravdy o obtížnosti**. Tento modul z něj
 * odvozuje, kolik *odlišných* úloh téma nabízí na úrovních I / II / III —
 * přes rozdíl množin podle textu otázky (`question`):
 *
 *   l1 = generator(1)
 *   l2 = generator(2) \ l1
 *   l3 = generator(3) \ (l1 ∪ l2)
 *
 * Doporučený model pro NOVÁ témata jsou disjunktní pooly POOL_L1/L2/L3
 * (referenční vzor: `src/content/grade-4/cjl/vzoryPodstatnychJmenPanHrad…`).
 * U takových generátorů rozdíl množin přesně odpovídá poolům.
 *
 * Tento helper je JEDINÉ místo, kde se rozdílové pravidlo definuje —
 * sdílí ho admin (karty Level I/II/III), audit (pokrytí) i runtime
 * (`maxAvailableLevel` jako pojistka proti prázdné/duplicitní úrovni).
 */

import type { TopicMetadata, PracticeTask } from "@/lib/types";

export interface TierTasks {
  /** Úlohy úrovně I (vše z generator(1)). */
  l1: PracticeTask[];
  /** Úlohy úrovně II — odlišné od l1. */
  l2: PracticeTask[];
  /** Úlohy úrovně III — odlišné od l1 ∪ l2. */
  l3: PracticeTask[];
}

const EMPTY_TIERS: TierTasks = { l1: [], l2: [], l3: [] };

/** Bezpečně zavolá generátor — při výjimce vrátí prázdné pole. */
function safeGenerate(topic: TopicMetadata, level: number): PracticeTask[] {
  try {
    const tasks = topic.generator(level);
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
}

/**
 * Klíč identity úlohy pro rozdílové pravidlo.
 *
 * Pro většinu typů (select_one, fill_blank, number, …) je klíč = `question`
 * (beze změny — historické chování zachováno 1:1).
 *
 * Pro STRUKTUROVANÉ typy (match_pairs/categorize/drag_order/multi_select) je
 * `question` často fixní instruktážní text ("Spoj…", "Zařaď…") napříč celým
 * poolem — skutečná odlišnost úlohy je v `pairs`/`categories`/`items`/
 * `correctAnswers`. Bez zahrnutí payloadu do klíče getTierTasks kolabuje
 * celý pool na 1 "unikátní" otázku, i když je obsah po dvojicích/kategoriích
 * zcela odlišný — což falešně ořízne `maxAvailableLevel` na 1 (runtime bug)
 * a zkreslí audit pokrytí úrovní.
 *
 * Rozšíření je čistě ADITIVNÍ — pro tasky bez strukturovaného payloadu vrací
 * identický klíč jako dřív (`question`), takže nemůže nic rozbít, jen opravit
 * falešné duplicity.
 */
function taskKey(t: PracticeTask): string {
  const parts: string[] = [String(t.question ?? "")];
  if (t.pairs && t.pairs.length > 0) parts.push(JSON.stringify(t.pairs));
  if (t.categories && t.categories.length > 0) parts.push(JSON.stringify(t.categories));
  if (t.items && t.items.length > 0) parts.push(JSON.stringify(t.items));
  if (t.correctAnswers && t.correctAnswers.length > 0) parts.push(JSON.stringify(t.correctAnswers));
  return parts.join("||");
}

/**
 * Vrátí úlohy rozdělené na úrovně I/II/III přes rozdíl množin (klíč = `taskKey`,
 * viz výše — question + strukturovaný payload pro match_pairs/categorize/…).
 * Když generátor selže na kterékoli úrovni, ta úroveň zůstane prázdná.
 */
export function getTierTasks(topic: TopicMetadata): TierTasks {
  try {
    const l1 = safeGenerate(topic, 1);
    const l2raw = safeGenerate(topic, 2);
    const l3raw = safeGenerate(topic, 3);

    const l1Keys = new Set(l1.map(taskKey));
    const l2 = l2raw.filter((t) => !l1Keys.has(taskKey(t)));

    const l2Keys = new Set(l2.map(taskKey));
    const l3 = l3raw.filter((t) => !l1Keys.has(taskKey(t)) && !l2Keys.has(taskKey(t)));

    return { l1, l2, l3 };
  } catch {
    return EMPTY_TIERS;
  }
}

/**
 * Nejvyšší úroveň s >0 *odlišnými* úlohami.
 * Runtime nikdy nesmí servírovat prázdnou/duplicitní úroveň → engine ořízne
 * `currentLevel` na tuto hodnotu.
 */
export function maxAvailableLevel(topic: TopicMetadata): 1 | 2 | 3 {
  const tiers = getTierTasks(topic);
  if (tiers.l3.length > 0) return 3;
  if (tiers.l2.length > 0) return 2;
  return 1;
}
