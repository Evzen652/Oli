/**
 * Detekce dostupnosti obsahu pro jednotlivé ročníky.
 * Pokud ročník nemá vlastní obsah, najde nejbližší dostupný
 * (aktuálně typicky grade-4).
 *
 * Používá se v onboardingu (vizuální rozlišení), AnonStudentPage
 * (banner) a v anonDailyTasks (effective grade pro výběr topics).
 */

import { getAllTopics } from "@/lib/contentRegistry";

/**
 * Aktivní scope pilotu (rozhodnutí D9 + zamknutí 2026-07-12):
 * žákům nabízíme jen ročníky 2–4. Ročníky 5+ mají obsah v repu,
 * ale nejsou auditované → v onboardingu zamčené („připravujeme").
 * JEDINÝ zdroj pravdy — odemčení ročníku = přidat ho sem.
 */
export const ACTIVE_GRADES: readonly number[] = [2, 3, 4];

const FALLBACK_GRADE = 4;

/** True pokud existuje aspoň 1 topic pokrývající daný ročník (bez ohledu na scope). */
export function hasContentForGrade(grade: number): boolean {
  return getAllTopics().some(
    (t) => t.gradeRange[0] <= grade && t.gradeRange[1] >= grade,
  );
}

/**
 * True pokud je ročník pro žáky dostupný: je v aktivním scope A má obsah.
 * Používat všude na žákovské cestě (onboarding, fallbacky, bannery).
 */
export function isGradeAvailable(grade: number): boolean {
  return ACTIVE_GRADES.includes(grade) && hasContentForGrade(grade);
}

/**
 * Vrátí nejlepší dostupný ročník pro daný požadovaný ročník.
 * Pokud je dostupný (aktivní scope + obsah) → vrátí ho.
 * Jinak → vrátí nejbližší dostupný ročník (preferuje grade-4 jako primární).
 */
export function getBestAvailableGrade(grade: number): number {
  if (isGradeAvailable(grade)) return grade;
  if (isGradeAvailable(FALLBACK_GRADE)) return FALLBACK_GRADE;
  // Krajní případ — najdi jakýkoli dostupný ročník (1..9)
  for (let g = 1; g <= 9; g++) {
    if (isGradeAvailable(g)) return g;
  }
  return FALLBACK_GRADE; // unreachable za normálních okolností
}

/**
 * Vrátí lidsky čitelnou zprávu pro dítě, pokud je nutný fallback.
 * Null pokud je ročník dostupný (aktivní scope + obsah).
 */
export function getContentWarning(grade: number): string | null {
  if (isGradeAvailable(grade)) return null;
  const fallbackGrade = getBestAvailableGrade(grade);
  return `Obsah pro ${grade}. ročník připravujeme. Zatím ti ukážeme cvičení pro ${fallbackGrade}. ročník.`;
}
