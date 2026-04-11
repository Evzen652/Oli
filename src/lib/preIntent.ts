import type { TopicMetadata } from "./types";
import { getAllTopics } from "./contentRegistry";

/**
 * PRE_INTENT CLASSIFICATION
 *
 * Deterministic, keyword-based classification of user input
 * BEFORE topic matching. No AI, no heuristics.
 *
 * Returns:
 * - "confusion" → user is confused / asking for help
 * - "nonsense"  → input is nonsensical
 * - "topical"   → input contains topic-related keywords, proceed to TOPIC_MATCH
 */

export type PreIntentResult = "confusion" | "nonsense" | "topical" | "unclear_input" | "wrong_grade";

/** Confusion / help-request keywords. */
const CONFUSION_KEYWORDS = [
  "nevím",
  "nevím to",
  "fakt nevím",
  "pomoz mi",
  "pomoc",
  "řekni mi to",
  "prostě mi to napiš",
  "jaká je odpověď",
  "poraď mi",
  "nevím co psát",
  "nevím co napsat",
  "nerozumím",
  "nechápu",
];

/** Classify user input deterministically. */
export function classifyIntent(input: string, grade: number): PreIntentResult {
  const normalized = input.toLowerCase().trim();

  if (!normalized) return "nonsense";

  // A) Check confusion / help request first
  if (CONFUSION_KEYWORDS.some((kw) => normalized.includes(kw))) {
    return "confusion";
  }

  // B) Check if input contains any topic-related keyword for this grade
  const topics = getAllTopics();
  for (const topic of topics) {
    if (grade < topic.gradeRange[0] || grade > topic.gradeRange[1]) continue;
    if (topic.keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      return "topical";
    }
  }

  // C) Check if input matches a keyword in ANY grade (wrong grade selected)
  for (const topic of topics) {
    if (topic.keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      return "wrong_grade";
    }
  }

  // D) Pure numeric input → likely an answer, not a topic description
  if (/^\d+$/.test(normalized)) {
    return "unclear_input";
  }

  // E) Everything else is nonsense
  return "nonsense";
}

/** Confusion threshold before triggering STOP_1. */
export const CONFUSION_THRESHOLD = 2;
