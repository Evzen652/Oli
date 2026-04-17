import type { TopicMetadata } from "../../types";
import { COMPARE_NATURAL_TOPICS } from "./compareNatural";
import { FRAC_COMPARE_TOPICS } from "./fracCompare";
import { FRAC_REDUCE_TOPICS } from "./fracReduce";
import { FRAC_EXPAND_TOPICS } from "./fracExpand";
import { FRAC_ADD_TOPICS } from "./fracAdd";
import { FRAC_SUB_TOPICS } from "./fracSub";
import { FRAC_MIXED_TOPICS } from "./fracMixed";
import { FRAC_OF_NUMBER_TOPICS } from "./fracOfNumber";
import { FRAC_MUL_WHOLE_TOPICS } from "./fracMulWhole";
import { ADD_SUB_TOPICS } from "./addSub";
import { MULTIPLY_TOPICS } from "./multiply";
import { DIVIDE_TOPICS } from "./divide";
import { ROUNDING_TOPICS } from "./rounding";
import { ORDER_NUMBERS_TOPICS } from "./orderNumbers";
import { SHAPES_TOPICS } from "./shapes";
import { PERIMETER_TOPICS } from "./perimeter";
import { MEASUREMENT_TOPICS } from "./measurement";
import { PERCENTAGE_TOPICS } from "./percentage";
import { INTEGER_TOPICS } from "./integer";
import { EQUATION_TOPICS } from "./equation";
// ── 4. ročník ──
import { ADD_SUB_10K_TOPICS } from "./addSub10k";
import { MULT_WRITTEN_TOPICS } from "./multWritten";
import { DIVIDE_REMAINDER_TOPICS } from "./divideRemainder";
import { ROUNDING_4_TOPICS } from "./rounding4";
import { FRAC_INTRO_TOPICS } from "./fracIntro";
import { UNITS_4_TOPICS } from "./units4";
import { PERIMETER_4_TOPICS } from "./perimeter4";

export const MATH_TOPICS: TopicMetadata[] = [
  ...COMPARE_NATURAL_TOPICS,
  ...FRAC_COMPARE_TOPICS,
  ...FRAC_REDUCE_TOPICS,
  ...FRAC_EXPAND_TOPICS,
  ...FRAC_ADD_TOPICS,
  ...FRAC_SUB_TOPICS,
  ...FRAC_MIXED_TOPICS,
  ...FRAC_OF_NUMBER_TOPICS,
  ...FRAC_MUL_WHOLE_TOPICS,
  ...ADD_SUB_TOPICS,
  ...MULTIPLY_TOPICS,
  ...DIVIDE_TOPICS,
  ...ROUNDING_TOPICS,
  ...ORDER_NUMBERS_TOPICS,
  ...SHAPES_TOPICS,
  ...PERIMETER_TOPICS,
  ...MEASUREMENT_TOPICS,
  // ── 4.–5. ročník (bridge) ──
  ...ADD_SUB_10K_TOPICS,
  ...MULT_WRITTEN_TOPICS,
  ...DIVIDE_REMAINDER_TOPICS,
  ...ROUNDING_4_TOPICS,
  ...FRAC_INTRO_TOPICS,
  ...UNITS_4_TOPICS,
  ...PERIMETER_4_TOPICS,
  // ── II. stupeň ZŠ (6.–9. ročník) ──
  ...PERCENTAGE_TOPICS, // 7.–9. r.
  ...INTEGER_TOPICS,    // 7.–8. r.
  ...EQUATION_TOPICS,   // 8.–9. r.
];
