/**
 * Pravidla viditelnosti předmětů při filtrování podle ročníku.
 *
 * INVARIANT — Single Source of Truth:
 * Tato funkce JE jediným místem, které rozhoduje, zda předmět má být
 * viditelný v zadaném ročníku. Všechny komponenty (AdminDashboard,
 * AdminCurriculumSidebar, CurriculumWizard, …) MUSÍ používat tento helper.
 *
 * Pravidla:
 *  - Bez grade filtru (grade === null) → vždy viditelný
 *  - S grade filtrem → viditelný, pokud:
 *      (a) má skutečný obsah (skills/code topic) pro daný ročník, NEBO
 *      (b) jeho curriculum_subjects.grade_min/grade_max ten ročník pokrývá
 *  - Předmět bez grade_min/grade_max a bez obsahu → skrytý
 *
 * Důsledek pro AI:
 *  AI návrhy NOVÝCH předmětů MUSÍ obsahovat grade_min/grade_max, jinak
 *  předmět nikdy nebude viditelný v žádném grade-filtered pohledu.
 */

/** Minimální tvar předmětu, který má grade rozsah. */
export interface SubjectGradeRange {
  grade_min: number | null;
  grade_max: number | null;
}

/**
 * Rozhodne, zda předmět má být viditelný v zadaném ročníku.
 *
 * @param subject - předmět s grade_min/grade_max (z curriculum_subjects)
 * @param grade - aktivní grade filter, nebo null pro "vše"
 * @param hasContentForGrade - má předmět skutečný obsah (skills) pro tento ročník?
 */
export function isSubjectVisibleForGrade(
  subject: SubjectGradeRange,
  grade: number | null,
  hasContentForGrade: boolean,
): boolean {
  if (grade == null) return true;
  if (hasContentForGrade) return true;
  if (subject.grade_min != null && subject.grade_max != null) {
    return grade >= subject.grade_min && grade <= subject.grade_max;
  }
  return false;
}

/**
 * Filter helper pro pole předmětů.
 * Vrátí jen ty, které mají být viditelné v zadaném ročníku.
 */
export function filterSubjectsByGrade<T extends SubjectGradeRange & { name: string }>(
  subjects: T[],
  grade: number | null,
  /** Set lowercase jmen předmětů, které mají obsah pro daný ročník */
  subjectsWithContentLc: Set<string>,
): T[] {
  if (grade == null) return subjects;
  return subjects.filter((s) =>
    isSubjectVisibleForGrade(
      s,
      grade,
      subjectsWithContentLc.has(s.name.toLowerCase()),
    ),
  );
}
