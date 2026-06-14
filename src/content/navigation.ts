/**
 * Sdílená display navigace „předmět → okruh → téma" napříč ročníky.
 *
 * Okruh je čistě prezentační seskupení existujících cvičení (přes jejich `id`).
 * NEMĚNÍ obsah cvičení ani jejich RVP pole (category/topic). Každé téma
 * (cvičení) patří do právě jednoho okruhu — hlídá konzistenční test
 * `src/test/navigation-consistency.test.ts`.
 *
 * Předměty bez záznamu (např. informatika) zůstávají v TopicBrowseru ploché.
 */

import type { Grade } from "@/lib/types";
import { GRADE2_NAVIGATION } from "./grade-2/navigation";
import { GRADE3_NAVIGATION } from "./grade-3/navigation";
import { GRADE4_NAVIGATION } from "./grade-4/navigation";
import { GRADE5_NAVIGATION } from "./grade-5/navigation";

/** Jeden okruh = dětsky pojmenovaná skupina cvičení (témat). */
export interface Okruh {
  id: string;
  name: string;
  description: string;
  emoji: string;
  topicIds: string[];
}

/** Navigace jednoho předmětu = seznam jeho okruhů. */
export interface SubjectNav {
  subject: string;
  okruhy: Okruh[];
}

const BY_GRADE: Partial<Record<Grade, SubjectNav[]>> = {
  2: GRADE2_NAVIGATION,
  3: GRADE3_NAVIGATION,
  4: GRADE4_NAVIGATION,
  5: GRADE5_NAVIGATION,
};

/** Vrátí navigaci (okruhy po předmětech) pro daný ročník, nebo null. */
export function getGradeNavigation(grade: Grade): SubjectNav[] | null {
  return BY_GRADE[grade] ?? null;
}

/**
 * Vrátí okruhy daného předmětu v daném ročníku, nebo null pokud předmět
 * okruhovou navigaci nemá (pak zůstává plochý — všechna témata najednou).
 */
export function getSubjectOkruhy(grade: Grade, subject: string): Okruh[] | null {
  return getGradeNavigation(grade)?.find((n) => n.subject === subject)?.okruhy ?? null;
}

/**
 * Anon režim: množina `topicId`, které jsou v každém předmětu ODEMČENÉ —
 * tj. patří do prvního okruhu předmětu. Stejné pořadí jako TopicBrowser
 * (index 0 = odemčený), takže výběr okruhů i denní doporučení jsou konzistentní.
 */
export function getAnonUnlockedTopicIds(grade: Grade): Set<string> {
  const ids = new Set<string>();
  const nav = getGradeNavigation(grade);
  if (!nav) return ids;
  for (const subjectNav of nav) {
    subjectNav.okruhy[0]?.topicIds.forEach((id) => ids.add(id));
  }
  return ids;
}
