/**
 * Content audit — pure logika pro kontrolu kvality cvičení.
 * Sdílená mezi testy (npm run audit:content) a admin UI.
 *
 * Žádné side-effecty, žádný network. Jen čte topic.generator
 * a aplikuje deterministické checky.
 *
 * Pro AI pedagogickou kontrolu se volá `runAiAuditBatch` z UI
 * proti exercise-validator edge fn (s admin auth) nebo přímo
 * proti AI gateway.
 */

import type { TopicMetadata, PracticeTask } from "./types";
import { validateTaskForInputType } from "./taskValidator";
import { validateAnswer } from "./validators";
import { checkBoundaryViolation } from "./boundaryEnforcement";
import { checkHintLeakage } from "../../supabase/functions/_shared/hintLeakage";

export type AuditCategory = "format" | "self_validation" | "hint_leak" | "boundary";

export interface AuditIssue {
  topicId: string;
  topicTitle: string;
  taskQuestion: string;
  category: AuditCategory;
  detail: string;
}

export interface AuditReport {
  totalTopicsChecked: number;
  totalTasksChecked: number;
  okCount: number;
  passingPct: number;
  issues: AuditIssue[];
  byCategory: Record<AuditCategory, number>;
  byTopic: Record<string, number>;
}

export interface AuditOptions {
  /** Max samples per topic (default 5) */
  maxSamplesPerTopic?: number;
  /** Filter — jen tyto subjekty (default všechny) */
  subjectFilter?: string[];
  /** Filter — jen tento ročník (default všechny) */
  gradeFilter?: number;
  /** Progress callback (0-1) — pro UI progress bar */
  onProgress?: (progress: number) => void;
}

/**
 * Spustí offline audit nad daným setem topics.
 * Synchronní, deterministický, bez network.
 */
export function runOfflineAudit(
  topics: readonly TopicMetadata[],
  options: AuditOptions = {},
): AuditReport {
  const {
    maxSamplesPerTopic = 5,
    subjectFilter,
    gradeFilter,
    onProgress,
  } = options;

  // Filter
  let filteredTopics = [...topics];
  if (subjectFilter && subjectFilter.length > 0) {
    filteredTopics = filteredTopics.filter((t) => subjectFilter.includes(t.subject));
  }
  if (typeof gradeFilter === "number") {
    filteredTopics = filteredTopics.filter(
      (t) => gradeFilter >= t.gradeRange[0] && gradeFilter <= t.gradeRange[1],
    );
  }

  const issues: AuditIssue[] = [];
  let totalTasksChecked = 0;
  let totalTopicsChecked = 0;

  for (let idx = 0; idx < filteredTopics.length; idx++) {
    const topic = filteredTopics[idx];

    if (onProgress) {
      onProgress(idx / filteredTopics.length);
    }

    // a) Generator nezhavaruje — projdeme všechny 3 úrovně
    let allTasks: PracticeTask[] = [];
    try {
      for (const lvl of [1, 2, 3] as const) {
        allTasks.push(...topic.generator(lvl));
      }
    } catch (e) {
      issues.push({
        topicId: topic.id,
        topicTitle: topic.title,
        taskQuestion: "(generator crashed)",
        category: "format",
        detail: e instanceof Error ? e.message : "Unknown error",
      });
      continue;
    }
    totalTopicsChecked++;

    // Sample max N tasks per topic
    const sampled = allTasks.slice(0, maxSamplesPerTopic);

    for (const task of sampled) {
      totalTasksChecked++;

      // b) Neprázdné question + correctAnswer
      if (!task.question?.trim()) {
        issues.push({
          topicId: topic.id,
          topicTitle: topic.title,
          taskQuestion: task.question || "(empty)",
          category: "format",
          detail: "Prázdné question",
        });
        continue;
      }
      if (task.correctAnswer === undefined || task.correctAnswer === null) {
        issues.push({
          topicId: topic.id,
          topicTitle: topic.title,
          taskQuestion: task.question.slice(0, 80),
          category: "format",
          detail: "Chybí correctAnswer",
        });
        continue;
      }

      // c) Format check pro inputType
      if (!validateTaskForInputType(task, topic.inputType)) {
        issues.push({
          topicId: topic.id,
          topicTitle: topic.title,
          taskQuestion: task.question.slice(0, 80),
          category: "format",
          detail: `Nesedí formát pro typ ${topic.inputType}`,
        });
      }

      // d) Hint leak (skip pro essay)
      if (topic.inputType !== "essay" && task.hints && task.hints.length > 0) {
        const leak = checkHintLeakage({
          question: task.question,
          correct_answer: task.correctAnswer,
          hints: task.hints,
        });
        if (!leak.ok) {
          issues.push({
            topicId: topic.id,
            topicTitle: topic.title,
            taskQuestion: task.question.slice(0, 80),
            category: "hint_leak",
            detail: leak.reason ?? "Nápověda prozrazuje odpověď",
          });
        }
      }

      // e) Boundary check
      if (checkBoundaryViolation(task.correctAnswer, topic)) {
        issues.push({
          topicId: topic.id,
          topicTitle: topic.title,
          taskQuestion: task.question.slice(0, 80),
          category: "boundary",
          detail: `Odpověď "${task.correctAnswer}" porušuje hranice tématu`,
        });
      }

      // f) Self-validation (skip pro essay — tam je correctAnswer threshold)
      if (topic.inputType !== "essay") {
        const result = validateAnswer(task.correctAnswer, task.correctAnswer, {
          inputType: topic.inputType,
        });
        if (!result.correct) {
          issues.push({
            topicId: topic.id,
            topicTitle: topic.title,
            taskQuestion: task.question.slice(0, 80),
            category: "self_validation",
            detail: `Odpověď "${task.correctAnswer}" neprojde svým validátorem (${result.errorType})`,
          });
        }
      }
    }
  }

  if (onProgress) onProgress(1);

  // Build by-category histogram
  const byCategory: Record<AuditCategory, number> = {
    format: 0,
    self_validation: 0,
    hint_leak: 0,
    boundary: 0,
  };
  const byTopic: Record<string, number> = {};
  for (const issue of issues) {
    byCategory[issue.category] = (byCategory[issue.category] ?? 0) + 1;
    byTopic[issue.topicId] = (byTopic[issue.topicId] ?? 0) + 1;
  }

  const okCount = totalTasksChecked - issues.length;
  const passingPct = totalTasksChecked > 0
    ? Math.round((okCount / totalTasksChecked) * 100)
    : 0;

  return {
    totalTopicsChecked,
    totalTasksChecked,
    okCount,
    passingPct,
    issues,
    byCategory,
    byTopic,
  };
}

/** Lidsky srozumitelný label pro kategorii problému */
export const CATEGORY_LABELS: Record<AuditCategory, string> = {
  format: "Formát",
  self_validation: "Validace odpovědi",
  hint_leak: "Nápověda prozrazuje",
  boundary: "Mimo hranice tématu",
};

/** Barva pro UI dle kategorie */
export const CATEGORY_COLORS: Record<AuditCategory, string> = {
  format: "bg-rose-100 text-rose-800 border-rose-200",
  self_validation: "bg-orange-100 text-orange-800 border-orange-200",
  hint_leak: "bg-amber-100 text-amber-800 border-amber-200",
  boundary: "bg-violet-100 text-violet-800 border-violet-200",
};
