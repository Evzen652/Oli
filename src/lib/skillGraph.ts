/**
 * Skill prerequisite graph.
 *
 * Atomická dovednost má prerekvizity (skill_ids které musí žák zvládat předtím).
 * Graf umožňuje:
 * - canStart(skillId, mastery): může žák začít s touto dovedností?
 * - getNextRecommendation(profile): jaký skill doporučit?
 * - getMissingPrerequisites(skillId, mastery): co dohnat?
 *
 * Graf je řízený (DAG) — neumožňuje cykly.
 */

import { getAllTopics } from "./contentRegistry";
import type { TopicMetadata } from "./types";

export type SkillId = string;

export interface SkillNode {
  id: SkillId;
  prerequisites: SkillId[];
  /** Skills které tuto dovednost potřebují (reverzní lookup) */
  unlocks: SkillId[];
}

export interface MasteryMap {
  [skillId: string]: number; // 0..1
}

/** Práh, od kdy považujeme dovednost za zvládnutou */
export const MASTERY_THRESHOLD = 0.7;

let cachedGraph: Map<SkillId, SkillNode> | null = null;

/** Postaví graf z TopicMetadata.prerequisites */
export function buildSkillGraph(topics: readonly TopicMetadata[] = getAllTopics()): Map<SkillId, SkillNode> {
  if (cachedGraph) return cachedGraph;

  const graph = new Map<SkillId, SkillNode>();

  // První pass: uzly + prerekvizity
  for (const t of topics) {
    graph.set(t.id, {
      id: t.id,
      prerequisites: [...(t.prerequisites ?? [])],
      unlocks: [],
    });
  }

  // Druhý pass: reverzní hrany (unlocks)
  for (const node of graph.values()) {
    for (const prereq of node.prerequisites) {
      const prereqNode = graph.get(prereq);
      if (prereqNode) prereqNode.unlocks.push(node.id);
    }
  }

  // Detekce cyklů (DFS)
  const visiting = new Set<SkillId>();
  const visited = new Set<SkillId>();
  function dfs(id: SkillId, path: SkillId[]): void {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      console.warn(`[skillGraph] Cycle detected: ${[...path, id].join(" → ")}`);
      return;
    }
    visiting.add(id);
    const node = graph.get(id);
    if (node) {
      for (const p of node.prerequisites) dfs(p, [...path, id]);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of graph.keys()) dfs(id, []);

  cachedGraph = graph;
  return graph;
}

/** Reset cache (pro testy) */
export function resetSkillGraphCache(): void {
  cachedGraph = null;
}

/** Může žák začít s touto dovedností? */
export function canStart(skillId: SkillId, mastery: MasteryMap, graph?: Map<SkillId, SkillNode>): boolean {
  const g = graph ?? buildSkillGraph();
  const node = g.get(skillId);
  if (!node) return true; // skill není v grafu — povolíme
  return node.prerequisites.every((p) => (mastery[p] ?? 0) >= MASTERY_THRESHOLD);
}

/** Vrátí prerekvizity, které žák ještě nezvládl */
export function getMissingPrerequisites(
  skillId: SkillId,
  mastery: MasteryMap,
  graph?: Map<SkillId, SkillNode>,
): SkillId[] {
  const g = graph ?? buildSkillGraph();
  const node = g.get(skillId);
  if (!node) return [];
  return node.prerequisites.filter((p) => (mastery[p] ?? 0) < MASTERY_THRESHOLD);
}

/** Jaké další dovednosti se "odemknou" zvládnutím této dovednosti */
export function getUnlockedBy(skillId: SkillId, graph?: Map<SkillId, SkillNode>): SkillId[] {
  const g = graph ?? buildSkillGraph();
  return g.get(skillId)?.unlocks ?? [];
}

/**
 * Vrátí topologické pořadí skillů (bez cyklů).
 * Užitečné pro "dejte mi seznam toho co umět" — od základů k pokročilým.
 */
export function topologicalOrder(graph?: Map<SkillId, SkillNode>): SkillId[] {
  const g = graph ?? buildSkillGraph();
  const inDegree = new Map<SkillId, number>();
  for (const [id, node] of g) inDegree.set(id, node.prerequisites.length);

  const queue: SkillId[] = [];
  for (const [id, deg] of inDegree) if (deg === 0) queue.push(id);

  const result: SkillId[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    result.push(id);
    const node = g.get(id);
    if (!node) continue;
    for (const next of node.unlocks) {
      const newDeg = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }
  return result;
}

/**
 * Hlavní recommendation engine.
 * Najde skill který:
 * 1. Žák může začít (prerekvizity splněny)
 * 2. Není ještě plně zvládnutý
 * 3. Má nejvíc "blízko" k zvládnutí (nejvyšší mastery < threshold)
 */
export function getNextRecommendation(
  mastery: MasteryMap,
  topics: readonly TopicMetadata[] = getAllTopics(),
): TopicMetadata | null {
  const graph = buildSkillGraph(topics);
  let best: { topic: TopicMetadata; score: number } | null = null;

  for (const topic of topics) {
    if (!canStart(topic.id, mastery, graph)) continue;
    const m = mastery[topic.id] ?? 0;
    if (m >= MASTERY_THRESHOLD) continue;
    if (!best || m > best.score) {
      best = { topic, score: m };
    }
  }
  return best?.topic ?? null;
}
