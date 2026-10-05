/**
 * Předměty, které má aplikace hotové, ale dítěti je nenabízí.
 *
 * Rozhodnutí Evžena 5. 10. 2026: **informatika do aplikace nepatří.** Obsah
 * (20 témat ve 4. a 5. ročníku) se nemaže — zůstává v kódu, v auditech i ve
 * zmrazeném snapshotu, takže se rozhodnutí dá otočit odebráním jednoho řádku
 * níž. Skrývá se jen cesta dítěte k němu.
 *
 * JEDINÝ zdroj pravdy. Kdo staví seznam témat pro dítě, filtruje přes
 * `getTopicsForGrade` (nebo aspoň přes `isSubjectHidden`) — ne vlastním
 * `filter` nad `getAllTopics()`. Admin a audity vidí dál všechno:
 * `getTopicsForGrade(grade, { includeHidden: true })`.
 *
 * Pozor na zápis: `TopicMetadata.subject` je česky a s diakritikou
 * („informatika", „čeština", „přírodověda"), ne slug z RVP datasetu.
 */
export const HIDDEN_SUBJECTS: readonly string[] = ["informatika"];

/** True pokud se předmět dítěti nenabízí. */
export function isSubjectHidden(subject: string): boolean {
  return HIDDEN_SUBJECTS.includes(subject);
}
