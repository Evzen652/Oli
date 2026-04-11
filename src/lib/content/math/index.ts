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
];
