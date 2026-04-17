import type { TopicMetadata } from "./types";
import { ALL_TOPICS, setDiktatFilter } from "./content";

export { setDiktatFilter };

/**
 * CONTENT REGISTRY — thin re-export layer.
 *
 * All generators, help templates and topic metadata live in
 * src/lib/content/{math,czech,prvouka}/.
 * This file keeps the public API surface unchanged.
 */

const TOPICS: TopicMetadata[] = ALL_TOPICS;

/**
 * Prerequisite map: skill → prerequisite skills.
 * Used by AdaptiveEngine when fallbackToPrerequisite === true.
 */
export const PREREQUISITE_MAP: Record<string, string[]> = {
  frac_compare_diff_den: ["frac_compare_same_den", "frac_expand_target"],
  frac_compare_whole: ["frac_compare_same_den"],
  frac_add_diff_den: ["frac_add_same_den", "frac_expand_target"],
  frac_add_same_den: ["frac_compare_same_den"],
  frac_sub_same_den: ["frac_add_same_den"],
  frac_sub_diff_den: ["frac_sub_same_den", "frac_expand_target"],
  frac_reduce_simple: ["frac_compare_same_den"],
  frac_reduce_full: ["frac_reduce_simple"],
  frac_is_reduced: ["frac_reduce_simple"],
  frac_expand_by: ["frac_compare_same_den"],
  frac_expand_target: ["frac_expand_by"],
  frac_to_mixed: ["frac_compare_same_den"],
  frac_from_mixed: ["frac_to_mixed"],
  frac_mixed_add: ["frac_from_mixed", "frac_add_same_den"],
  frac_mixed_sub: ["frac_mixed_add", "frac_sub_same_den"],
  frac_of_number_simple: ["frac_compare_same_den"],
  frac_of_number_word: ["frac_of_number_simple"],
  frac_find_whole: ["frac_of_number_simple"],
  frac_mul_whole_basic: ["frac_expand_by"],
  frac_mul_whole_reduce: ["frac_mul_whole_basic", "frac_reduce_simple"],
  // Grade 3 math
  "math-divide": ["math-multiply"],
  "math-rounding": ["math-add-sub-100"],
  "math-order-numbers": ["math-compare-natural-numbers-100"],
  "math-perimeter": ["math-add-sub-100", "math-multiply"],
  // Grade 4 math (bridge do 10 000, písemné, zaokrouhlování, zlomky úvod)
  "math-add-sub-10k-4": ["math-add-sub-100"],
  "math-mult-written-4": ["math-multiply", "math-add-sub-10k-4"],
  "math-divide-remainder-4": ["math-multiply", "math-divide"],
  "math-rounding-4": ["math-rounding"],
  "math-frac-intro-4": ["math-divide", "math-multiply"],
  "math-units-4": ["math-measurement", "math-multiply", "math-divide"],
  "math-perimeter-4": ["math-perimeter", "math-add-sub-100"],
  // Grade 5 math
  "math-numbers-million-5": ["math-compare-natural-numbers-100", "math-rounding-4"],
  "math-decimal-read-5": ["math-numbers-million-5", "math-frac-intro-4"],
  "math-frac-same-den-5": ["math-frac-intro-4"],
  "math-divide-one-digit-5": ["math-divide-remainder-4", "math-mult-written-4"],
  "math-area-grid-5": ["math-multiply", "math-perimeter-4"],
  "math-negative-intro-5": ["math-compare-natural-numbers-100"],
  "math-word-problems-5": ["math-add-sub-10k-4", "math-mult-written-4", "math-divide-remainder-4"],
  // Grade 6 — zlomky stejný jmenovatel stojí na 5. ročníku (most do 6.)
  "frac_compare_same_den": ["math-frac-same-den-5"],
  "frac_add_same_den": ["math-frac-same-den-5"],
  "frac_sub_same_den": ["math-frac-same-den-5"],
  "frac_expand_by": ["math-frac-intro-4", "math-multiply"],
  // Grade 3 Czech
  "cz-parove-souhlasky": [],
  "cz-rod-cislo": ["cz-slovni-druhy"],
  "cz-slovesa-urcovani": ["cz-slovni-druhy"],
  "cz-zaklad-vety": ["cz-slovni-druhy"],
  "cz-diktat": ["cz-tvrde-mekke", "cz-parove-souhlasky"],
};

/** Get prerequisite skills for a given skill. */
export function getPrerequisites(skillId: string): string[] {
  return PREREQUISITE_MAP[skillId] ?? [];
}

/** Get all registered topics (read-only). */
export function getAllTopics(): readonly TopicMetadata[] {
  return Object.freeze([...TOPICS]);
}

/** Get topics available for a specific grade. */
export function getTopicsForGrade(grade: number): readonly TopicMetadata[] {
  return TOPICS.filter((t) => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]);
}

/** Find a topic by ID. */
export function getTopicById(topicId: string): TopicMetadata | undefined {
  return TOPICS.find((t) => t.id === topicId);
}

/**
 * Match child's problem description to a topic.
 * Returns null if no match or ambiguous.
 *
 * MUST be deterministic and rule-based:
 * - Exact keyword substring matching only
 * - No AI, heuristics, or probabilistic methods
 */
export function matchTopic(childInput: string, grade: number): TopicMetadata | null {
  const input = childInput.toLowerCase().trim();
  if (!input) return null;

  const candidates = TOPICS.filter((topic) => {
    if (grade < topic.gradeRange[0] || grade > topic.gradeRange[1]) return false;
    return topic.keywords.some((kw) => input.includes(kw.toLowerCase()));
  });

  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  // Multiple matches: prefer the one with the longest matching keyword
  let best: TopicMetadata | null = null;
  let bestLen = 0;
  for (const c of candidates) {
    for (const kw of c.keywords) {
      if (input.includes(kw.toLowerCase()) && kw.length > bestLen) {
        bestLen = kw.length;
        best = c;
      }
    }
  }
  return best;
}
