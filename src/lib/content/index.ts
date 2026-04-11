import type { TopicMetadata } from "../types";
import { MATH_TOPICS } from "./math";
import { CZECH_TOPICS } from "./czech";
import { PRVOUKA_TOPICS } from "./prvouka";

export { setDiktatFilter } from "./czech";

export const ALL_TOPICS: TopicMetadata[] = [
  ...MATH_TOPICS,
  ...CZECH_TOPICS,
  ...PRVOUKA_TOPICS,
];
