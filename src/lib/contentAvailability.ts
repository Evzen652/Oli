/**
 * Detekce dostupnosti obsahu pro jednotlivé ročníky.
 * Pokud ročník nemá vlastní obsah, najde nejbližší dostupný
 * (aktuálně typicky grade-4).
 *
 * Používá se v onboardingu (vizuální rozlišení), AnonStudentPage
 * (banner) a v anonDailyTasks (effective grade pro výběr topics).
 */

import { getAllTopics } from "@/lib/contentRegistry";

const FALLBACK_GRADE = 4;

/** True pokud existuje aspoň 1 topic pokrývající daný ročník. */
export function hasContentForGrade(grade: number): boolean {
  return getAllTopics().some(
    (t) => t.gradeRange[0] <= grade && t.gradeRange[1] >= grade,
  );
}

/**
 * Vrátí nejlepší dostupný ročník pro daný požadovaný ročník.
 * Pokud má vlastní obsah → vrátí ho.
 * Jinak → vrátí nejbližší ročník s obsahem (preferuje grade-4 jako primární).
 */
export function getBestAvailableGrade(grade: number): number {
  if (hasContentForGrade(grade)) return grade;
  if (hasContentForGrade(FALLBACK_GRADE)) return FALLBACK_GRADE;
  // Krajní případ — najdi jakýkoli ročník s obsahem (1..9)
  for (let g = 1; g <= 9; g++) {
    if (hasContentForGrade(g)) return g;
  }
  return FALLBACK_GRADE; // unreachable za normálních okolností
}

/**
 * Vrátí lidsky čitelnou zprávu pro dítě, pokud je nutný fallback.
 * Null pokud má ročník vlastní obsah.
 */
export function getContentWarning(grade: number): string | null {
  if (hasContentForGrade(grade)) return null;
  const fallbackGrade = getBestAvailableGrade(grade);
  return `Obsah pro ${grade}. ročník připravujeme. Zatím ti ukážeme cvičení pro ${fallbackGrade}. ročník.`;
}
