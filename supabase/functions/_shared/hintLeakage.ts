/**
 * Hint leakage detector — kontroluje, zda nápověda neprozrazuje odpověď.
 *
 * Pedagogický princip: nápověda má NAVÉST k myšlení, ne dát řešení.
 *   ❌ ŠPATNĚ: "Spočítej 12 × 3 = 36" pro úlohu kde odpověď je 36
 *   ✅ DOBŘE: "Vzpomeň si na násobení desítkami"
 *
 * Strategie (pure heuristic, žádné AI volání):
 *   1) Hledá literální výskyt odpovědi v hintu
 *   2) Hledá obratu které "říkají odpověď" jiným způsobem
 *   3) Pro multi-token answers ignoruje běžná slovíčka (např. "ano/ne")
 *
 * Vrací rejected hints, které je nutno regenerovat.
 */

export interface HintLeakageResult {
  ok: boolean;
  reason?: string;
  /** Index leakující nápovědy (0-based) */
  leakingHintIndex?: number;
  /** Konkrétní substring který v hintu prozrazuje odpověď */
  leakingFragment?: string;
}

/**
 * Slova, která jsou v hintu OK i když jsou v odpovědi
 * (jen krátké funkční prvky, ne věcný obsah).
 */
const HINT_NEUTRAL_WORDS = new Set([
  "a", "i", "u", "v", "o", "k", "s", "z",
  "je", "se", "si", "ne", "to", "ta", "ty", "ten", "ta",
  "ano", "ne", "také", "taky",
  "číslo", "čísla", "výsledek", "odpověď",
  "rovnice", "vzorec", "úloha",
  "například",
]);

/**
 * Normalizace pro porovnávání: lowercase, odstraň interpunkci, mezery.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,;:!?"'„"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Vrátí true pokud hint obsahuje doslovné znění odpovědi.
 * - Pro číselné odpovědi: literál číslo (s pamětí na "5" vs "15")
 * - Pro textové: lowercase substring match s word boundaries
 */
function hintContainsAnswer(hint: string, answer: string): { leaks: boolean; fragment?: string } {
  const normHint = normalize(hint);
  const normAnswer = normalize(answer);

  if (!normAnswer) return { leaks: false };

  // Pure number/fraction answer
  if (/^-?\d+(?:[.,]\d+)?$/.test(normAnswer)) {
    // Hledej s word boundary (aby "5" nematchovalo v "15")
    const numberPattern = new RegExp(`(^|[^\\d.,])${normAnswer.replace(".", "\\.")}([^\\d.,]|$)`);
    if (numberPattern.test(normHint)) {
      return { leaks: true, fragment: normAnswer };
    }
    return { leaks: false };
  }

  // Fraction answer "3/8"
  if (/^-?\d+\/\d+$/.test(normAnswer)) {
    if (normHint.includes(normAnswer)) {
      return { leaks: true, fragment: normAnswer };
    }
    return { leaks: false };
  }

  // Text answer — split na slova a hledej významová
  const answerTokens = normAnswer.split(/\s+/).filter((t) => t.length >= 3 && !HINT_NEUTRAL_WORDS.has(t));

  if (answerTokens.length === 0) return { leaks: false };

  // Pro krátké odpovědi (1-2 významová slova) hledej kompletní match
  if (answerTokens.length <= 2) {
    if (normHint.includes(normAnswer)) {
      return { leaks: true, fragment: normAnswer };
    }
    // Nebo hledej alespoň jedno významové slovo (pokud má >= 4 znaky)
    for (const tok of answerTokens) {
      if (tok.length >= 4) {
        const pattern = new RegExp(`(^|[\\s])${tok}([\\s]|$)`);
        if (pattern.test(normHint)) {
          return { leaks: true, fragment: tok };
        }
      }
    }
    return { leaks: false };
  }

  // Pro delší odpovědi (3+ slov) hledej alespoň 2 spolu jdoucí významová slova
  for (let i = 0; i < answerTokens.length - 1; i++) {
    const phrase = `${answerTokens[i]} ${answerTokens[i + 1]}`;
    if (normHint.includes(phrase)) {
      return { leaks: true, fragment: phrase };
    }
  }
  return { leaks: false };
}

/**
 * Kontrola, zda hint obsahuje "rovnost s odpovědí" — typický pattern
 * "X = 36" kde 36 je odpověď.
 */
function hintShowsEquality(hint: string, answer: string): boolean {
  const normAnswer = answer.trim().replace(/,/g, ".");
  // Hledej "= 36" nebo "= 36." apod.
  const patterns = [
    new RegExp(`=\\s*${normAnswer.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(?:\\s|$|\\.|,)`),
  ];
  return patterns.some((p) => p.test(hint));
}

/**
 * Hlavní API: zkontroluj všechny hinty pro 1 úlohu.
 */
export function checkHintLeakage(task: {
  question: string;
  correct_answer: string;
  hints?: string[];
}): HintLeakageResult {
  if (!task.hints || task.hints.length === 0) return { ok: true };
  if (!task.correct_answer) return { ok: true };

  for (let i = 0; i < task.hints.length; i++) {
    const hint = task.hints[i];
    if (typeof hint !== "string" || !hint.trim()) continue;

    // Test 1: Doslovný výskyt odpovědi
    const direct = hintContainsAnswer(hint, task.correct_answer);
    if (direct.leaks) {
      return {
        ok: false,
        reason: `Hint #${i + 1} obsahuje doslovně odpověď: "${direct.fragment}"`,
        leakingHintIndex: i,
        leakingFragment: direct.fragment,
      };
    }

    // Test 2: Rovnice prozradí (pattern "= X")
    if (hintShowsEquality(hint, task.correct_answer)) {
      return {
        ok: false,
        reason: `Hint #${i + 1} ukazuje rovnost s odpovědí`,
        leakingHintIndex: i,
        leakingFragment: `= ${task.correct_answer}`,
      };
    }
  }

  return { ok: true };
}
