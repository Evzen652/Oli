import type { TopicMetadata } from "./types";

/**
 * RUNTIME BOUNDARY ENFORCEMENT
 *
 * Validates user input against topic boundaries during PRACTICE and CHECK states.
 * Uses deterministic keyword-based rules only.
 * Returns true if a boundary violation is detected.
 */

/**
 * Boundary rules per topic. Each rule is a list of forbidden keywords/patterns.
 * These are runtime constraints, NOT documentation.
 */
/** Shared forbidden keywords for all math topics */
const COMMON_MATH_FORBIDDEN = ["záporné", "desetinné", "slovní úloha", "co znamená", "jak se značí", "jaký je znak"];
const FRAC_FORBIDDEN = [...COMMON_MATH_FORBIDDEN, "číselná řada"];

const BOUNDARY_RULES: Record<string, { forbiddenKeywords: string[]; numericRange?: [number, number] }> = {
  "math-compare-natural-numbers-100": {
    forbiddenKeywords: [
      "větší než", "menší než", ">", "<", "=",
      "plus", "mínus", "krát", "děleno",
      "sčítání", "odčítání", "násobení", "dělení",
      ...COMMON_MATH_FORBIDDEN, "číselná řada",
    ],
    numericRange: [0, 100],
  },
  "math-add-sub-100": {
    forbiddenKeywords: ["násobení", "dělení", "zlomky", ...COMMON_MATH_FORBIDDEN],
    numericRange: [0, 200],
  },
  "math-multiply": {
    forbiddenKeywords: ["zlomky", ...COMMON_MATH_FORBIDDEN],
    numericRange: [0, 10000],
  },
  "math-divide": {
    forbiddenKeywords: ["zlomky", ...COMMON_MATH_FORBIDDEN],
    numericRange: [0, 10000],
  },
  "math-rounding": {
    forbiddenKeywords: ["zlomky", ...COMMON_MATH_FORBIDDEN],
    numericRange: [0, 100000],
  },
  "math-order-numbers": {
    forbiddenKeywords: ["zlomky", ...COMMON_MATH_FORBIDDEN],
    numericRange: [0, 100000],
  },
  "math-perimeter": {
    forbiddenKeywords: ["zlomky", ...COMMON_MATH_FORBIDDEN],
    numericRange: [0, 10000],
  },
  "math-shapes": {
    forbiddenKeywords: [...COMMON_MATH_FORBIDDEN],
  },
  // Fraction topics — forbid negatives and decimals
  frac_compare_same_den: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_compare_diff_den: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_compare_whole: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_add_same_den: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_add_diff_den: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_sub_same_den: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_sub_diff_den: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_reduce_simple: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_reduce_full: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_is_reduced: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_expand_by: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_expand_target: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_to_mixed: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_from_mixed: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_mixed_add: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_mixed_sub: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 100] },
  frac_of_number_simple: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 1000] },
  frac_of_number_word: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 1000] },
  frac_find_whole: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 1000] },
  frac_mul_whole_basic: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 1000] },
  frac_mul_whole_reduce: { forbiddenKeywords: FRAC_FORBIDDEN, numericRange: [0, 1000] },
};

/**
 * Check if user input violates topic boundaries.
 * Returns true if violation detected → should trigger STOP_2.
 */
export function checkBoundaryViolation(input: string, topic: TopicMetadata): boolean {
  const rules = BOUNDARY_RULES[topic.id];
  if (!rules) return false;

  const normalized = input.toLowerCase().trim();

  // Single-character comparison symbols are valid answers, not boundary violations
  if (normalized === ">" || normalized === "<" || normalized === "=") {
    return false;
  }

  // Check forbidden keywords
  if (rules.forbiddenKeywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
    return true;
  }

  // Check numeric range: if input contains numbers outside allowed range
  if (rules.numericRange) {
    const numbers = normalized.match(/\d+/g);
    if (numbers) {
      const [min, max] = rules.numericRange;
      if (numbers.some((n) => {
        const num = parseInt(n, 10);
        return num < min || num > max;
      })) {
        return true;
      }
    }
  }

  return false;
}
