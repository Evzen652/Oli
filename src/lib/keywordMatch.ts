/**
 * Sdílené keyword matching pro bránu (preIntent) i topic matcher (contentRegistry).
 *
 * DETERMINISTICKÉ, bez AI/heuristik. Klíčový rozdíl oproti naivnímu
 * `input.includes(kw)`:
 *  - shoda na HRANICI SLOVA (písmena i číslice jsou součást slova) —
 *    "cm" neodpovídá "scammer", "10" neodpovídá "100", "les" neodpovídá "blesk"
 *  - keywordy kratší než MIN_KEYWORD_LEN se ignorují — jednoznakové keywordy
 *    ("a", "s", "6"…) jsou příliš nejednoznačné a kolidovaly s nesmysly/čísly
 *  - obrana proti tématům bez `keywords` pole (nesmí shodit bránu)
 */

/**
 * Minimální délka keywordu pro matching. Jednoznakové keywordy
 * ("a", "s", "z", "m", "6"…) jsou příliš nejednoznačné.
 */
export const MIN_KEYWORD_LEN = 2;

function isWordChar(ch: string | undefined): boolean {
  return !!ch && /[\p{L}\p{N}]/u.test(ch);
}

/**
 * True pokud `needle` je v `haystack` obsažen jako celé slovo.
 * Hranice slova = začátek/konec řetězce nebo znak, který není písmeno ani číslice.
 */
export function containsWord(haystack: string, needle: string): boolean {
  if (!needle) return false;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    const before = haystack[idx - 1];
    const after = haystack[idx + needle.length];
    if (!isWordChar(before) && !isWordChar(after)) return true;
    idx = haystack.indexOf(needle, idx + 1);
  }
  return false;
}

/** Vrátí normalizovaný keyword pokud je použitelný (délka ≥ MIN_KEYWORD_LEN), jinak null. */
function usableKeyword(kw: unknown): string | null {
  const k = String(kw).toLowerCase().trim();
  return k.length >= MIN_KEYWORD_LEN ? k : null;
}

/** True pokud `normalized` obsahuje aspoň jeden použitelný keyword jako celé slovo. */
export function matchesAnyKeyword(normalized: string, keywords: unknown): boolean {
  if (!Array.isArray(keywords)) return false;
  return keywords.some((kw) => {
    const k = usableKeyword(kw);
    return k !== null && containsWord(normalized, k);
  });
}

/** Délka nejdelšího použitelného keywordu, který se shodne jako celé slovo (0 = žádný). */
export function longestMatchingKeywordLen(normalized: string, keywords: unknown): number {
  if (!Array.isArray(keywords)) return 0;
  let best = 0;
  for (const kw of keywords) {
    const k = usableKeyword(kw);
    if (k !== null && k.length > best && containsWord(normalized, k)) best = k.length;
  }
  return best;
}
