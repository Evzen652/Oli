import type { TopicMetadata } from "../types";
// ── Legacy topics — zachovány jako reference, ale NEAKTIVNÍ.
// Nahrazeny grade-N session moduly (RVP struktura).
// Odkomentuj jen pokud potřebuješ dočasně zpřístupnit starý obsah.
// import { MATH_TOPICS } from "./math";
// import { CZECH_TOPICS } from "./czech";
// import { PRVOUKA_TOPICS } from "./prvouka";

// ── Grade-N moduly (vlastněné grade-N sessions) ──
import { GRADE_2_TOPICS } from "@/content/grade-2";
import { GRADE_3_TOPICS } from "@/content/grade-3";
import { GRADE_4_TOPICS } from "@/content/grade-4";
import { GRADE_5_TOPICS } from "@/content/grade-5";
import { GRADE_6_TOPICS } from "@/content/grade-6";

export { setDiktatFilter } from "./czech";

export const ALL_TOPICS: TopicMetadata[] = [
  // Legacy (skryté — viz komentář výše):
  // ...MATH_TOPICS,
  // ...CZECH_TOPICS,
  // ...PRVOUKA_TOPICS,

  // ── Aktivní obsah (grade-N RVP sessions) ──
  ...GRADE_2_TOPICS,
  ...GRADE_3_TOPICS,
  ...GRADE_4_TOPICS,
  ...GRADE_5_TOPICS,
  ...GRADE_6_TOPICS,
];
