// Re-export all prvouka topics from individual modules
import type { TopicMetadata } from "../../types";
import { BODY_PARTS_TOPICS } from "./bodyParts";
import { SENSES_TOPICS } from "./senses";
import { HEALTH_TOPICS } from "./health";
import { PLANTS_TOPICS } from "./plants";
import { ANIMALS_TOPICS } from "./animals";
import { SEASONS_TOPICS } from "./seasons";
import { SOCIETY_TOPICS } from "./society";
import { ORIENTATION_TOPICS } from "./orientation";

export const PRVOUKA_TOPICS: TopicMetadata[] = [
  ...BODY_PARTS_TOPICS,
  ...SENSES_TOPICS,
  ...HEALTH_TOPICS,
  ...PLANTS_TOPICS,
  ...ANIMALS_TOPICS,
  ...SEASONS_TOPICS,
  ...SOCIETY_TOPICS,
  ...ORIENTATION_TOPICS,
];
