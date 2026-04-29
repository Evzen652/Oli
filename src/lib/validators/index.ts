/**
 * Pluggable validator system.
 *
 * Each validator implements `validate(answer, expected, context?) -> ValidationResult`.
 * Validators are pure functions — no side effects, deterministic, fast (<60ms).
 *
 * Use cases:
 * - StringExact: vyjmenovaná slova, párové souhlásky (string match)
 * - NumericTolerance: matematika s desetinnými čísly (1/3 ≈ 0.333)
 * - AlgebraicEquivalence: rovnice (x+1 = 1+x)
 * - SetMatch: multi_select (pořadí nezáleží)
 * - OrderedSequence: drag_order (pořadí záleží)
 * - MultiStep: vícekrokové úlohy (každý krok zvlášť)
 * - Rubric: AI-graded essays / open answers
 */

export interface ValidationResult {
  correct: boolean;
  /** Pokud nesprávně, jaký byl důvod (pro audit a hint engine) */
  errorType?: string;
  /** Volitelná zpětná vazba pro žáka */
  feedback?: string;
  /** Skóre 0-1 pro částečně správné odpovědi (multi-step, essays) */
  partialScore?: number;
}

export interface ValidatorContext {
  inputType?: string;
  topic?: string;
  level?: number;
}

export interface Validator {
  readonly id: string;
  validate(answer: string, expected: string, context?: ValidatorContext): ValidationResult;
}

// ─── String Exact (default for vyjmenovaná, párové, etc.) ───────────────
export const stringExactValidator: Validator = {
  id: "string_exact",
  validate(answer, expected) {
    const norm = (s: string) =>
      s.trim().toLowerCase().replace(/\s+/g, " ").normalize("NFC");
    const ok = norm(answer) === norm(expected);
    return ok
      ? { correct: true }
      : { correct: false, errorType: "wrong_string" };
  },
};

// ─── Numeric Tolerance (matika s desetinnými čísly) ──────────────────────
export const numericToleranceValidator: Validator = {
  id: "numeric_tolerance",
  validate(answer, expected) {
    const a = parseFloat(answer.replace(",", ".").trim());
    const e = parseFloat(expected.replace(",", ".").trim());
    if (Number.isNaN(a)) return { correct: false, errorType: "not_a_number" };
    if (Number.isNaN(e)) return { correct: false, errorType: "expected_invalid" };
    // Tolerance: 0.001 absolutní, 0.1% relativní (větší z obou)
    const tol = Math.max(0.001, Math.abs(e) * 0.001);
    const ok = Math.abs(a - e) <= tol;
    return ok ? { correct: true } : { correct: false, errorType: "numeric_off" };
  },
};

// ─── Set Match (multi_select — pořadí nezáleží) ──────────────────────────
export const setMatchValidator: Validator = {
  id: "set_match",
  validate(answer, expected) {
    const toSet = (s: string) =>
      new Set(
        s.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean),
      );
    const a = toSet(answer);
    const e = toSet(expected);
    if (a.size !== e.size) return { correct: false, errorType: "wrong_count" };
    for (const item of a) if (!e.has(item)) return { correct: false, errorType: "wrong_items" };
    return { correct: true };
  },
};

// ─── Ordered Sequence (drag_order — pořadí záleží) ───────────────────────
export const orderedSequenceValidator: Validator = {
  id: "ordered_sequence",
  validate(answer, expected) {
    const a = answer.split(",").map((x) => x.trim().toLowerCase());
    const e = expected.split(",").map((x) => x.trim().toLowerCase());
    if (a.length !== e.length) return { correct: false, errorType: "wrong_length" };
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== e[i]) return { correct: false, errorType: "wrong_order" };
    }
    return { correct: true };
  },
};

// ─── Fraction (zlomky — porovnává matematickou hodnotu, ne string) ──────
/**
 * Parsuje "a/b" a ověřuje matematickou ekvivalenci dvou zlomků.
 * Klíčové vlastnosti:
 *  • "3/8" ≡ "6/16" ≡ "9/24" — všechny dávají TRUE (ekvivalentní)
 *  • "1/2" ≡ "0,5" ≡ "0.5"   — TRUE (číselná hodnota stejná)
 *  • Smíšené číslo "1 1/2"   — TRUE (1+1/2 = 3/2)
 *  • Záporný "-3/4"          — TRUE
 *  • Nula ve jmenovateli     — FALSE (errorType: zero_denominator)
 *
 * Implementace přes a*d === b*c (zachovává přesnost u celých čísel).
 */
function parseFraction(s: string): { num: number; den: number } | null {
  const trimmed = s.trim().replace(/\s+/g, " ");

  // Smíšené číslo: "1 1/2" → 1 + 1/2 = 3/2
  const mixedMatch = trimmed.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const n = parseInt(mixedMatch[2], 10);
    const d = parseInt(mixedMatch[3], 10);
    if (d === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    return { num: sign * (Math.abs(whole) * d + n), den: d };
  }

  // Klasický zlomek: "3/8" nebo "-3/8"
  const fracMatch = trimmed.match(/^(-?\d+)\/(-?\d+)$/);
  if (fracMatch) {
    const n = parseInt(fracMatch[1], 10);
    const d = parseInt(fracMatch[2], 10);
    if (d === 0) return null;
    return { num: n, den: d };
  }

  // Celé číslo: "3" → 3/1
  const intMatch = trimmed.match(/^-?\d+$/);
  if (intMatch) {
    return { num: parseInt(trimmed, 10), den: 1 };
  }

  // Desetinné: "0,5" nebo "0.5" → numerický fallback
  const dec = parseFloat(trimmed.replace(",", "."));
  if (!Number.isNaN(dec)) {
    // Reprezentuj jako zlomek až na 4 desetinná místa
    const den = 10000;
    return { num: Math.round(dec * den), den };
  }

  return null;
}

export const fractionValidator: Validator = {
  id: "fraction",
  validate(answer, expected) {
    const a = parseFraction(answer);
    const e = parseFraction(expected);
    if (!a) return { correct: false, errorType: "answer_invalid_format" };
    if (!e) return { correct: false, errorType: "expected_invalid_format" };
    if (a.den === 0 || e.den === 0) return { correct: false, errorType: "zero_denominator" };
    // a.num/a.den === e.num/e.den ⇔ a.num * e.den === e.num * a.den
    const cross1 = a.num * e.den;
    const cross2 = e.num * a.den;
    return cross1 === cross2
      ? { correct: true }
      : { correct: false, errorType: "different_value" };
  },
};

// ─── Algebraic Equivalence (rovnice — bez závislostí, jednoduchá) ────────
/**
 * Naivní algebraická ekvivalence — porovná po normalizaci (whitespace, *, závorky).
 * Pro pokročilé použití (např. x+1 vs 1+x) by bylo třeba CAS knihovnu.
 * V této verzi: stačí pro základní úlohy 8.-9. třídy.
 */
export const algebraicEquivalenceValidator: Validator = {
  id: "algebraic_equivalence",
  validate(answer, expected) {
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\*/g, "")
        .replace(/[(){}[\]]/g, "")
        .replace(/,/g, ".")
        .normalize("NFC");
    // Zkus i jako číslo (pro 1/2 vs 0.5)
    const a = norm(answer);
    const e = norm(expected);
    if (a === e) return { correct: true };
    // Numeric fallback
    const an = parseFloat(a);
    const en = parseFloat(e);
    if (!Number.isNaN(an) && !Number.isNaN(en) && Math.abs(an - en) < 0.001) {
      return { correct: true };
    }
    return { correct: false, errorType: "not_equivalent" };
  },
};

// ─── Multi-Step (vícekrokové úlohy — kvadratické rovnice apod.) ──────────
/**
 * Žák odpovídá ve formátu "krok1|krok2|krok3", validátor kontroluje každý krok.
 * Pokud se některý krok nepovede, vrací partialScore.
 */
export const multiStepValidator: Validator = {
  id: "multi_step",
  validate(answer, expected) {
    const a = answer.split("|").map((s) => s.trim());
    const e = expected.split("|").map((s) => s.trim());
    if (e.length === 0) return { correct: false, errorType: "no_steps" };
    let correctCount = 0;
    for (let i = 0; i < e.length; i++) {
      if (i < a.length && a[i].toLowerCase() === e[i].toLowerCase()) correctCount++;
    }
    const partialScore = correctCount / e.length;
    if (partialScore === 1) return { correct: true, partialScore };
    return {
      correct: false,
      partialScore,
      errorType: "partial_steps",
      feedback: `Správně ${correctCount}/${e.length} kroků.`,
    };
  },
};

// ─── Numeric Range (odpověď v rozsahu, např. fyzika ±tolerance) ─────────
/**
 * NumericRange: odpověď je v rozsahu min..max nebo expected ± tolerance.
 * Expected formát:
 *   "5.5"           — exact (default tolerance 0.001)
 *   "5.5±0.1"       — explicitní tolerance
 *   "5.5..6.5"      — explicitní rozsah (inclusive)
 *   "5.5;6.5"       — alternativní rozsah syntax
 *
 * Use case: fyzika, chemie, měření, geografie (cca hodnoty).
 */
export const numericRangeValidator: Validator = {
  id: "numeric_range",
  validate(answer, expected) {
    const parseNum = (s: string) => parseFloat(s.replace(",", ".").trim());
    const a = parseNum(answer);
    if (Number.isNaN(a)) return { correct: false, errorType: "not_a_number" };

    // Rozsah: "min..max" nebo "min;max"
    const rangeMatch = expected.match(/^(-?[\d.,]+)\s*(?:\.\.|;)\s*(-?[\d.,]+)$/);
    if (rangeMatch) {
      const min = parseNum(rangeMatch[1]);
      const max = parseNum(rangeMatch[2]);
      if (Number.isNaN(min) || Number.isNaN(max)) {
        return { correct: false, errorType: "expected_invalid" };
      }
      if (a >= Math.min(min, max) && a <= Math.max(min, max)) {
        return { correct: true };
      }
      return { correct: false, errorType: "out_of_range", feedback: `Očekáván rozsah ${min}–${max}` };
    }

    // Tolerance: "5.5±0.1" nebo "5.5+-0.1"
    const tolMatch = expected.match(/^(-?[\d.,]+)\s*(?:±|\+-|\+\/-)\s*([\d.,]+)$/);
    if (tolMatch) {
      const center = parseNum(tolMatch[1]);
      const tol = parseNum(tolMatch[2]);
      if (Number.isNaN(center) || Number.isNaN(tol)) {
        return { correct: false, errorType: "expected_invalid" };
      }
      if (Math.abs(a - center) <= tol + 1e-9) return { correct: true };
      return { correct: false, errorType: "out_of_tolerance", feedback: `Očekáváno ${center} ± ${tol}` };
    }

    // Plain number → fallback na exact s tolerance 0.001
    const e = parseNum(expected);
    if (Number.isNaN(e)) return { correct: false, errorType: "expected_invalid" };
    if (Math.abs(a - e) <= 0.001) return { correct: true };
    return { correct: false, errorType: "wrong_number" };
  },
};

// ─── Short Answer (volná textová odpověď, AI hodnotí později) ───────────
/**
 * ShortAnswer: žák napíše krátkou odpověď vlastními slovy.
 * Validace má 2 vrstvy:
 *   1) Pokud expected je seznam přijatelných odpovědí "a|b|c", match jakoukoli
 *   2) Jinak fuzzy match s tolerance pro překlepy (2 chars)
 *
 * Pro full AI grading použít rubricValidator (TODO Fáze 7).
 */
export const shortAnswerValidator: Validator = {
  id: "short_answer",
  validate(answer, expected) {
    const norm = (s: string) =>
      s.trim().toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // odstraň diakritiku pro fuzzy match
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");

    const a = norm(answer);
    if (!a) return { correct: false, errorType: "empty" };

    // Multi-accept: "polský|polák|polsko" — match jakoukoli z variant
    const acceptable = expected.split("|").map((s) => norm(s)).filter(Boolean);
    if (acceptable.length === 0) return { correct: false, errorType: "expected_invalid" };

    for (const exp of acceptable) {
      if (a === exp) return { correct: true };
      // Fuzzy: max 2 chars Levenshtein (typo tolerance)
      if (Math.abs(a.length - exp.length) <= 2 && levenshtein(a, exp) <= 2) {
        return { correct: true, feedback: "Správně (s drobným překlepem)" };
      }
    }
    return { correct: false, errorType: "wrong_answer" };
  },
};

/** Levenshtein distance — small impl, ne lib. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

// ─── Table Fill (doplnit prázdné buňky v tabulce) ───────────────────────
/**
 * TableFill: žák vyplní více buněk v tabulce.
 * Expected formát (CSV-like): "buňka1|buňka2|buňka3"
 * Answer formát: stejný (žák vyplnil X buněk, oddělené |)
 * Stejně jako multi_step, ale s permutací a partial scoring.
 */
export const tableFillValidator: Validator = {
  id: "table_fill",
  validate(answer, expected) {
    const norm = (s: string) => s.trim().toLowerCase().normalize("NFC");
    const aCells = answer.split("|").map(norm);
    const eCells = expected.split("|").map(norm);
    if (eCells.length === 0) return { correct: false, errorType: "no_cells" };
    let correctCount = 0;
    for (let i = 0; i < eCells.length; i++) {
      if (i < aCells.length && aCells[i] === eCells[i]) correctCount++;
    }
    const partialScore = correctCount / eCells.length;
    if (partialScore === 1) return { correct: true, partialScore };
    return {
      correct: false,
      partialScore,
      errorType: "partial_cells",
      feedback: `Správně ${correctCount}/${eCells.length} buněk.`,
    };
  },
};

// ─── Sequence Step (seřadit kroky postupu) ──────────────────────────────
/**
 * SequenceStep: žák seřadí kroky do správného pořadí.
 * Stejné jako orderedSequence, ale s lepším error feedbackem
 * (řekne, na které pozici je první chyba — pomáhá adminovi i žákovi).
 */
export const sequenceStepValidator: Validator = {
  id: "sequence_step",
  validate(answer, expected) {
    const norm = (s: string) => s.trim().toLowerCase().normalize("NFC");
    const aSeq = answer.split("|").map(norm);
    const eSeq = expected.split("|").map(norm);
    if (eSeq.length === 0) return { correct: false, errorType: "no_steps" };
    if (aSeq.length !== eSeq.length) {
      return {
        correct: false,
        errorType: "wrong_length",
        feedback: `Očekáváno ${eSeq.length} kroků, dáno ${aSeq.length}`,
      };
    }
    let firstWrongIdx = -1;
    for (let i = 0; i < eSeq.length; i++) {
      if (aSeq[i] !== eSeq[i]) {
        firstWrongIdx = i;
        break;
      }
    }
    if (firstWrongIdx === -1) return { correct: true };
    return {
      correct: false,
      errorType: "wrong_order",
      feedback: `Krok #${firstWrongIdx + 1} je ve špatném pořadí`,
    };
  },
};

// ─── Registry ────────────────────────────────────────────────────────────
const VALIDATORS: Record<string, Validator> = {
  string_exact: stringExactValidator,
  numeric_tolerance: numericToleranceValidator,
  numeric_range: numericRangeValidator,
  short_answer: shortAnswerValidator,
  table_fill: tableFillValidator,
  sequence_step: sequenceStepValidator,
  fraction: fractionValidator,
  set_match: setMatchValidator,
  ordered_sequence: orderedSequenceValidator,
  algebraic_equivalence: algebraicEquivalenceValidator,
  multi_step: multiStepValidator,
};

/** Získá validátor podle ID, fallback na string_exact */
export function getValidator(id?: string): Validator {
  if (!id) return stringExactValidator;
  return VALIDATORS[id] ?? stringExactValidator;
}

/** Mapování InputType → výchozí validátor */
export function getDefaultValidator(inputType: string): Validator {
  switch (inputType) {
    case "fraction":
      return fractionValidator;
    case "number":
      return numericToleranceValidator;
    case "numeric_range":
      return numericRangeValidator;
    case "short_answer":
      return shortAnswerValidator;
    case "table_fill":
      return tableFillValidator;
    case "sequence_step":
      return sequenceStepValidator;
    case "multi_select":
      return setMatchValidator;
    case "drag_order":
      return orderedSequenceValidator;
    case "select_one":
    case "comparison":
    case "fill_blank":
    case "match_pairs":
    case "categorize":
    case "text":
    default:
      return stringExactValidator;
  }
}

/** Hlavní vstupní bod pro orchestrator */
export function validateAnswer(
  answer: string,
  expected: string,
  options?: { validatorId?: string; inputType?: string; context?: ValidatorContext },
): ValidationResult {
  const validator = options?.validatorId
    ? getValidator(options.validatorId)
    : getDefaultValidator(options?.inputType ?? "text");
  return validator.validate(answer, expected, options?.context);
}
