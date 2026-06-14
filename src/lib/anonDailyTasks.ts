/**
 * Anonymní mód: výběr 4 denních úkolů pro nepřihlášené dítě.
 * Deterministický (stejný den + ročník = stejné úkoly), preferuje různé předměty.
 */

import type { TopicMetadata } from "@/lib/types";
import { getAllTopics } from "@/lib/contentRegistry";
import { getBestAvailableGrade } from "./contentAvailability";

const DEFAULT_DAILY_COUNT = 4;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // force i32
  }
  return Math.abs(hash);
}

function pickDailyTopics(
  topics: readonly TopicMetadata[],
  seed: number,
  count: number,
): TopicMetadata[] {
  // Deterministický shuffle podle seedu
  const shuffled = [...topics].sort((a, b) => {
    const ha = hashString(String(seed) + a.id);
    const hb = hashString(String(seed) + b.id);
    return ha - hb;
  });

  // Preferuj různé předměty
  const result: TopicMetadata[] = [];
  const usedSubjects = new Set<string>();

  for (const t of shuffled) {
    if (result.length >= count) break;
    if (!usedSubjects.has(t.subject)) {
      result.push(t);
      usedSubjects.add(t.subject);
    }
  }

  // Doplň zbytek pokud nemáme dost různých předmětů
  for (const t of shuffled) {
    if (result.length >= count) break;
    if (!result.includes(t)) result.push(t);
  }

  return result;
}

/** Den ve tvaru YYYY-MM-DD (lokální čas, pro deterministický seed). */
export function getTodayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Vrátí 4 denní úkoly pro daný ročník. Fallback na grade-4 pokud ročník nemá obsah.
 * Deterministické per (datum, ročník).
 */
export function getDailyTasksForGrade(
  grade: number,
  count: number = DEFAULT_DAILY_COUNT,
): TopicMetadata[] {
  // Pokud daný ročník nemá obsah, použij nejlepší dostupný (typicky grade-4)
  const effectiveGrade = getBestAvailableGrade(grade);
  const allTopics = getAllTopics();
  // Denní úkoly = ochutnávka napříč VŠEMI okruhy (i zamčenými v TopicBrowseru).
  // Zamykání se týká jen volného výběru okruhů, ne kurátorovaných denních úkolů.
  const sourceTopics = allTopics.filter(
    (t) => t.gradeRange[0] <= effectiveGrade && t.gradeRange[1] >= effectiveGrade,
  );

  if (sourceTopics.length === 0) return [];

  const today = getTodayDateString();
  // Seed založen na původně vybraném ročníku — různá volba dává různý mix,
  // i když oba spadají na stejný effective grade
  const seed = hashString(today + String(grade));

  return pickDailyTopics(sourceTopics, seed, count);
}
