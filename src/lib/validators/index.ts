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

// ─── Registry ────────────────────────────────────────────────────────────
const VALIDATORS: Record<string, Validator> = {
  string_exact: stringExactValidator,
  numeric_tolerance: numericToleranceValidator,
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
    case "number":
    case "fraction":
      return numericToleranceValidator;
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
