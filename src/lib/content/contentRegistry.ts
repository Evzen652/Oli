import type { Grade, TopicMetadata } from '../engine/types';
import { mathTopics } from './math';
import { czechTopics } from './czech';
import { prvoukaTopics } from './prvouka';

// Combined registry of all topics from all subjects
let ALL_TOPICS: readonly TopicMetadata[] = [];
let diktatFilter: string[] | null = null;

function ensureLoaded(): readonly TopicMetadata[] {
  if (ALL_TOPICS.length === 0) {
    ALL_TOPICS = Object.freeze([...mathTopics, ...czechTopics, ...prvoukaTopics]);
  }
  return ALL_TOPICS;
}

export function getAllTopics(): readonly TopicMetadata[] {
  return ensureLoaded();
}

export function getTopicsForGrade(grade: Grade): readonly TopicMetadata[] {
  return ensureLoaded().filter(
    (t) => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]
  );
}

export function getTopicById(topicId: string): TopicMetadata | undefined {
  return ensureLoaded().find((t) => t.id === topicId);
}

/**
 * Deterministic keyword matching — NO AI, NO heuristics
 * 1. Filter topics by grade
 * 2. Check if input contains any keyword
 * 3. Pick topic with longest matching keyword
 */
export function matchTopic(childInput: string, grade: Grade): TopicMetadata | null {
  const normalized = childInput.trim().toLowerCase();
  const gradeTopics = getTopicsForGrade(grade);

  let bestMatch: TopicMetadata | null = null;
  let bestKeywordLength = 0;

  for (const topic of gradeTopics) {
    for (const keyword of topic.keywords) {
      const kw = keyword.toLowerCase();
      if (normalized.includes(kw) && kw.length > bestKeywordLength) {
        bestMatch = topic;
        bestKeywordLength = kw.length;
      }
    }
  }

  return bestMatch;
}

// Prerequisite map
const PREREQUISITE_MAP: Record<string, string[]> = {
  'frac-compare-diff-den': ['frac-compare-same-den', 'frac-expand'],
  'frac-add-diff-den': ['frac-add-same-den', 'frac-expand'],
  'math-divide': ['math-multiply'],
  'cz-diktat': ['cz-tvrde-mekke', 'cz-parove-souhlasky'],
};

export function getPrerequisites(skillId: string): string[] {
  return PREREQUISITE_MAP[skillId] ?? [];
}

export function setDiktatFilter(types: string[]): void {
  diktatFilter = types;
}

export function getDiktatFilter(): string[] | null {
  return diktatFilter;
}
