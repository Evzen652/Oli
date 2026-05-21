import type { TopicMetadata } from "../types";
import { MATH_TOPICS } from "./math";
import { CZECH_TOPICS } from "./czech";
import { PRVOUKA_TOPICS } from "./prvouka";
// ── Grade-N moduly (vlastněné grade-N sessions) ──
import { GRADE_4_TOPICS } from "@/content/grade-4";

export { setDiktatFilter } from "./czech";

export const ALL_TOPICS: TopicMetadata[] = [
  ...MATH_TOPICS,
  ...CZECH_TOPICS,
  ...PRVOUKA_TOPICS,
  ...GRADE_4_TOPICS,
];
