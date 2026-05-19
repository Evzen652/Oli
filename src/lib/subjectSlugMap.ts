/**
 * Single Source of Truth pro mapování slug → kanonické jméno předmětu.
 *
 * INVARIANT:
 *  Když DB obsahuje subject s daným slug, jeho zobrazené jméno (s diakritikou)
 *  je definováno TADY. Žádné jiné místo v kódu nesmí mít vlastní slug→name mapu.
 *
 *  - useAdminCurriculum: opraví `name` při fetch z curriculum_subjects
 *  - useDbCurriculum: vyplní `subject` v dbSkillToTopicMetadata
 *  - Test curriculum-naming-consistency.test.ts ověří, že nikdo nemá vlastní mapu
 *
 *  Když AI vygeneruje nový předmět, slug MUSÍ být lowercase bez diakritiky
 *  a tady ho přidat, jinak nebude správně normalizován.
 */

export const SUBJECT_SLUG_TO_NAME: Record<string, string> = {
  // 1. stupeň
  matematika:   "matematika",
  cestina:      "čeština",
  prvouka:      "prvouka",
  prirodoveda:  "přírodověda",
  vlastiveda:   "vlastivěda",

  // 2. stupeň
  biologie:     "biologie",
  chemie:       "chemie",
  fyzika:       "fyzika",
  dejepis:      "dějepis",
  zemeris:      "zeměpis",
  zemeopis:     "zeměpis",
  zemepis:      "zeměpis",

  // Cizí jazyky
  anglictina:   "anglický jazyk",
  nemcina:      "německý jazyk",

  // Ostatní
  informatika:  "informatika",
  obcanska:     "občanská výchova",
  hudebni:      "hudební výchova",
  vytvarnahm:   "výtvarná výchova",
  telesna:      "tělesná výchova",
};

/**
 * Vrátí kanonické jméno pro daný slug, nebo `fallback` pokud slug není v mapě.
 * Fallback se používá pro nové subjekty, které AI vygeneruje a ještě nejsou v mapě.
 */
export function canonicalSubjectName(slug: string, fallback: string = slug): string {
  return SUBJECT_SLUG_TO_NAME[slug] ?? fallback;
}

/**
 * Validace tvaru slugu — pouze lowercase ASCII a pomlčky.
 * AI návrhy nových předmětů musí dodržet.
 */
export function isValidSubjectSlug(slug: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(slug);
}
