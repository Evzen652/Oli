/**
 * Bezpečný přístup k `localStorage`.
 *
 * Proč to vůbec je: v Safari v anonymním režimu a všude tam, kde uživatel
 * zakázal data stránek, **`localStorage` vyhazuje výjimku** — a to i u pouhého
 * čtení. Projekt to na většině míst ošetřuje (`anonServerSync.ts`, `anonTrial.ts`,
 * `imageVersions.ts`), ale audit 2026-09-03 našel deset volání bez ochrany.
 * Dvě z nich na místech, kde výjimka znamená konec:
 *
 * - `Onboarding.tsx` — zápis při **prvním kliknutí nového návštěvníka**
 *   („vyber ročník"). Výjimka = do aplikace se nedostane vůbec.
 * - `SessionView.tsx` — čtení **během renderu**. Výjimka = spadne ErrorBoundary
 *   a zmizí celá aplikace.
 *
 * Chování při dostupném úložišti je beze změny. Když úložiště selže, čtení vrátí
 * `null` a zápis `false` — volající se tak může rozhodnout, jestli mu to vadí.
 * Žádné logování do konzole: tohle je očekávaný stav prohlížeče, ne chyba.
 */

/** Přečte klíč. `null` = klíč není, nebo je úložiště nedostupné. */
export function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Zapíše klíč. Vrací `false`, pokud úložiště zápis odmítlo. */
export function writeLocal(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Smaže klíč. Vrací `false`, pokud úložiště operaci odmítlo. */
export function removeLocal(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
