/**
 * Dětské varianty RVP jmen okruhů a témat pro 4. ročník (9–10 let).
 *
 * RVP zůstává backbone (mapování na standard, audit, reporty).
 * Dítě vidí tyto varianty — krátké, srozumitelné, bez odborného žargonu.
 *
 * Pravidla viz `src/content/grade-4/README.md` sekce "Tone of voice".
 *
 * Per-grade — neimportovat z jiných ročníků, každý má vlastní slovník.
 */

export const DISPLAY_NAMES = {
  // RVP okruh → dětsky (2-4 slova, konkrétní)
  categories: {
    "Číslo a početní operace": "Počítání s čísly",
    "Geometrie v rovině a v prostoru": "Tvary a prostor",
    "Závislosti, vztahy a práce s daty": "Tabulky a vzorce",
    "Nestandardní aplikační úlohy a problémy": "Logické hádanky",
  } as Record<string, string>,

  // RVP téma → dětsky (2-4 slova, konkrétní)
  topics: {
    // Číslo a početní operace
    "Číselný obor 0–1 000 000": "Velká čísla",
    "Písemné početní operace": "Počítání pod sebou",
    "Zlomky": "Zlomky",
    // Geometrie v rovině a v prostoru
    "Obvod a obsah": "Obvod a obsah",
    "Rovinné útvary": "Rovinné tvary",
    "Souměrnost": "Souměrnost",
    // Závislosti, vztahy a práce s daty
    "Práce s daty": "Tabulky a grafy",
    // Nestandardní aplikační úlohy a problémy
    "Logické úlohy": "Hlavolamy",
  } as Record<string, string>,
} as const;
