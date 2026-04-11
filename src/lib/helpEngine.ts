/**
 * HELP ENGINE
 * 
 * Returns help data from topic's helpTemplate.
 * No AI. No network calls. Pure data lookup.
 */

import type { HelpData, TopicMetadata } from "./types";

/**
 * Get help data for a topic. Returns null if no help available.
 * Synchronous, deterministic, no AI.
 */
export function getHelpForTopic(topic: TopicMetadata | null): HelpData | null {
  if (!topic) return null;
  return topic.helpTemplate ?? null;
}

/**
 * @deprecated Use getHelpForTopic(topic) instead.
 * Kept for backward compatibility during migration.
 */
export function getHelpForSkill(skillId: string): HelpData | null {
  // Legacy lookup removed — topics carry their own help now.
  // This function should not be called in new code.
  return null;
}

// Re-export HelpData type for consumers
export type { HelpData } from "./types";