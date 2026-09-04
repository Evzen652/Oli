import type { TopicMetadata } from "../../types";
import { VYJMENOVANA_TOPICS } from "./vyjmenovana";
import { PRAVOPIS_TOPICS } from "./pravopis";
import { MLUVNICE_TOPICS } from "./mluvnice";
import { DIKTAT_TOPICS } from "./diktat";

export { setDiktatFilter } from "./diktat";

export const CZECH_TOPICS: TopicMetadata[] = [
  ...VYJMENOVANA_TOPICS,
  ...PRAVOPIS_TOPICS,
  ...MLUVNICE_TOPICS,
  ...DIKTAT_TOPICS,
];
