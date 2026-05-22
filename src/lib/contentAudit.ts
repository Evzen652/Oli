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
  topicSubject: string;
  topicCategory: string;
  topicGradeRange: [number, number];
  taskQuestion: string;
  category: AuditCategory;
  detail: string;
  /** Přesné nápovědy, které selhaly — pro AI opravu */
  failingHints?: string[];
  correctAnswer?: string;
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
        topicSubject: topic.subject,
        topicCategory: topic.category,
        topicGradeRange: topic.gradeRange,
        taskQuestion: "(generator crashed)",
        category: "format",
        detail: e instanceof Error ? e.message : "Unknown error",
      });
      continue;
    }
    totalTopicsChecked++;

    // a2) displayName validace — musí být česky (žádná čistě anglická slova)
    if (topic.displayName) {
      const englishOnlyPattern = /^[a-zA-Z0-9\s\-_]+$/;
      if (englishOnlyPattern.test(topic.displayName)) {
        issues.push({
          topicId: topic.id,
          topicTitle: topic.title,
          topicSubject: topic.subject,
          topicCategory: topic.category,
          topicGradeRange: topic.gradeRange,
          taskQuestion: "(metadata)",
          category: "format",
          detail: `displayName "${topic.displayName}" vypadá jako anglický název — musí být česky.`,
        });
      }
    }

    // Sample max N tasks per topic
    const sampled = allTasks.slice(0, maxSamplesPerTopic);

    for (const task of sampled) {
      totalTasksChecked++;

      const issueMeta = {
        topicId: topic.id,
        topicTitle: topic.title,
        topicSubject: topic.subject,
        topicCategory: topic.category,
        topicGradeRange: topic.gradeRange,
      };

      // b) Neprázdné question + correctAnswer
      if (!task.question?.trim()) {
        issues.push({
          ...issueMeta,
          taskQuestion: task.question || "(empty)",
          category: "format",
          detail: "Prázdné question",
        });
        continue;
      }
      if (task.correctAnswer === undefined || task.correctAnswer === null) {
        issues.push({
          ...issueMeta,
          taskQuestion: task.question.slice(0, 80),
          category: "format",
          detail: "Chybí correctAnswer",
        });
        continue;
      }

      // c) Format check pro inputType
      if (!validateTaskForInputType(task, topic.inputType)) {
        issues.push({
          ...issueMeta,
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
            ...issueMeta,
            taskQuestion: task.question.slice(0, 80),
            category: "hint_leak",
            detail: leak.reason ?? "Nápověda prozrazuje odpověď",
            failingHints: task.hints,
            correctAnswer: String(task.correctAnswer),
          });
        }
      }

      // e) Boundary check
      if (checkBoundaryViolation(task.correctAnswer, topic)) {
        issues.push({
          ...issueMeta,
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
            ...issueMeta,
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

// ─────────────────────────────────────────────────────────
// PEDAGOGICKÝ AUDIT — čistě statická kontrola kvality obsahu
// Bez network, bez AI. Doplňuje offline audit o didaktické metriky.
// ─────────────────────────────────────────────────────────

export type PedagogicalAuditCategory =
  | "difficulty_progression"  // Generátor neprodukuje různou obtížnost pro různé levely
  | "missing_hints"           // Témata bez nápověd pro žáky
  | "distractor_quality"      // Slabé distraktory v select_one (prázdné, příliš podobné, příliš málo)
  | "audit_flag"              // Témata ručně označena jako NEEDS_REVIEW nebo jiným audit flagem
  | "missing_solution_steps"; // Témata kde < 50 % tasků má solutionSteps (pro step_based topics)

export interface PedagogicalAuditIssue {
  topicId: string;
  topicTitle: string;
  topicSubject: string;
  topicGradeRange: [number, number];
  category: PedagogicalAuditCategory;
  detail: string;
  /** Pro audit_flag: flags z topic.auditFlag */
  flags?: string[];
}

export interface PedagogicalAuditReport {
  totalTopicsChecked: number;
  issues: PedagogicalAuditIssue[];
  byCategory: Record<PedagogicalAuditCategory, number>;
  /** Témata s auditFlag "NEEDS_REVIEW" */
  needsReviewTopics: string[];
  /** Témata kde všechny 3 levely vrátí stejný počet tasků (generátor není adaptivní) */
  nonAdaptiveTopics: string[];
}

export const PEDAGOGICAL_CATEGORY_LABELS: Record<PedagogicalAuditCategory, string> = {
  difficulty_progression: "Chybí gradace obtížnosti",
  missing_hints: "Chybí nápovědy",
  distractor_quality: "Slabé distraktory",
  audit_flag: "Označeno k revizi",
  missing_solution_steps: "Chybí postup řešení",
};

export const PEDAGOGICAL_CATEGORY_COLORS: Record<PedagogicalAuditCategory, string> = {
  difficulty_progression: "bg-sky-100 text-sky-800 border-sky-200",
  missing_hints: "bg-yellow-100 text-yellow-800 border-yellow-200",
  distractor_quality: "bg-rose-100 text-rose-800 border-rose-200",
  audit_flag: "bg-red-100 text-red-800 border-red-200",
  missing_solution_steps: "bg-amber-100 text-amber-800 border-amber-200",
};

/**
 * Vrátí generator pro topic — fallback na no-op pokud topic nemá generator.
 * (Ochrana pro případy kdy normalizeTopic neproběhlo — v testu s mock daty.)
 */
function resolveGenerator(topic: TopicMetadata): (level: number) => PracticeTask[] {
  if (topic.generator) return topic.generator;
  return () => [];
}

/**
 * Pedagogický audit — čistě statická analýza kvality obsahu.
 * Doplňuje `runOfflineAudit()` o didaktické metriky.
 * Synchronní, deterministický, bez network.
 *
 * Spuštění: `AUDIT_PEDAGOGICAL=1 npm run audit:content`
 * nebo přímo v admin UI → AdminContentAudit → záložka "Pedagogický audit"
 */
export function runPedagogicalAudit(
  topics: readonly TopicMetadata[],
  options: Pick<AuditOptions, "subjectFilter" | "gradeFilter" | "onProgress"> = {},
): PedagogicalAuditReport {
  const { subjectFilter, gradeFilter, onProgress } = options;

  // Filter
  let filtered = [...topics];
  if (subjectFilter && subjectFilter.length > 0) {
    filtered = filtered.filter((t) => subjectFilter.includes(t.subject));
  }
  if (typeof gradeFilter === "number") {
    filtered = filtered.filter(
      (t) => gradeFilter >= t.gradeRange[0] && gradeFilter <= t.gradeRange[1],
    );
  }

  const issues: PedagogicalAuditIssue[] = [];
  const needsReviewTopics: string[] = [];
  const nonAdaptiveTopics: string[] = [];
  let totalTopicsChecked = 0;

  for (let idx = 0; idx < filtered.length; idx++) {
    const topic = filtered[idx];
    if (onProgress) onProgress(idx / filtered.length);

    const gen = resolveGenerator(topic);
    let lvl1Tasks: PracticeTask[] = [];
    let lvl2Tasks: PracticeTask[] = [];
    let lvl3Tasks: PracticeTask[] = [];

    try {
      lvl1Tasks = gen(1);
      lvl2Tasks = gen(2);
      lvl3Tasks = gen(3);
    } catch {
      // Generator errors jsou zachyceny v runOfflineAudit — tady přeskočíme
      continue;
    }
    totalTopicsChecked++;

    const issueMeta = {
      topicId: topic.id,
      topicTitle: topic.title,
      topicSubject: topic.subject,
      topicGradeRange: topic.gradeRange,
    };

    // ── 1) Audit flags — témata ručně označena k revizi ──────────────────
    if (topic.auditFlag && topic.auditFlag.length > 0) {
      issues.push({
        ...issueMeta,
        category: "audit_flag",
        detail: `Téma je označeno flagem: ${topic.auditFlag.join(", ")}`,
        flags: topic.auditFlag,
      });
      if (topic.auditFlag.includes("NEEDS_REVIEW")) {
        needsReviewTopics.push(topic.id);
      }
    }

    // ── 2) Difficulty progression — generátor by měl produkovat různé počty ──
    // Striktní kontrola: všechny 3 levely mají úplně stejný počet a stejné 1. otázky
    const allSameCount =
      lvl1Tasks.length === lvl2Tasks.length &&
      lvl2Tasks.length === lvl3Tasks.length;
    const allSameFirstQuestion =
      lvl1Tasks[0]?.question === lvl2Tasks[0]?.question &&
      lvl2Tasks[0]?.question === lvl3Tasks[0]?.question;

    if (allSameCount && allSameFirstQuestion && lvl1Tasks.length > 0) {
      nonAdaptiveTopics.push(topic.id);
      issues.push({
        ...issueMeta,
        category: "difficulty_progression",
        detail: `Generátor vrací totožný výstup pro level 1, 2 i 3 (${lvl1Tasks.length} tasků, stejná 1. otázka)`,
      });
    }

    // ── 3) Missing hints — témata bez nápověd ───────────────────────────
    const allTasks = [...lvl1Tasks, ...lvl2Tasks, ...lvl3Tasks];
    const sampleTasks = allTasks.slice(0, 10); // sample max 10
    const tasksWithHints = sampleTasks.filter(
      (t) => t.hints && t.hints.length > 0,
    ).length;
    const hintCoverage = sampleTasks.length > 0 ? tasksWithHints / sampleTasks.length : 1;

    // Pouze pro témata s více než 3 tasky — malé generátory přeskočit
    if (sampleTasks.length >= 4 && hintCoverage === 0) {
      issues.push({
        ...issueMeta,
        category: "missing_hints",
        detail: `0 z ${sampleTasks.length} vzorových tasků má nápovědy`,
      });
    }

    // ── 4) Distractor quality — jen pro select_one ───────────────────────
    if (topic.inputType === "select_one") {
      const selectTasks = allTasks.slice(0, 8);
      for (const task of selectTasks) {
        const opts = task.options ?? [];

        // Příliš málo možností (méně než 3)
        if (opts.length < 3) {
          issues.push({
            ...issueMeta,
            category: "distractor_quality",
            detail: `Jen ${opts.length} možnost(i) pro select_one (min 3): "${task.question.slice(0, 50)}"`,
          });
          break; // 1 issue per topic
        }

        // Prázdné distraktor
        if (opts.some((o) => !o?.trim())) {
          issues.push({
            ...issueMeta,
            category: "distractor_quality",
            detail: `Prázdná nebo whitespace možnost v select_one: "${task.question.slice(0, 50)}"`,
          });
          break;
        }

        // Distraktor identický se správnou odpovědí
        const correct = String(task.correctAnswer).trim().toLowerCase();
        const duplicateDistractor = opts.find(
          (o) => o.trim().toLowerCase() === correct,
        );
        if (!duplicateDistractor) {
          // correctAnswer není v options — chyba formátu (přeskočíme — to řeší offline audit)
        } else {
          const wrongOpts = opts.filter((o) => o.trim().toLowerCase() !== correct);
          if (wrongOpts.some((o) => o.trim().toLowerCase() === correct)) {
            issues.push({
              ...issueMeta,
              category: "distractor_quality",
              detail: `Distraktor identický se správnou odpovědí: "${task.question.slice(0, 50)}"`,
            });
            break;
          }
        }
      }
    }

    // ── 5) Missing solution steps — pro step_based témata ───────────────
    if (topic.practiceType === "step_based") {
      const stepSample = allTasks.slice(0, 10);
      const withSteps = stepSample.filter(
        (t) => t.solutionSteps && t.solutionSteps.length > 0,
      ).length;
      const stepCoverage = stepSample.length > 0 ? withSteps / stepSample.length : 1;

      if (stepSample.length >= 2 && stepCoverage < 0.5) {
        issues.push({
          ...issueMeta,
          category: "missing_solution_steps",
          detail: `step_based téma: jen ${withSteps}/${stepSample.length} tasků má solutionSteps`,
        });
      }
    }
  }

  if (onProgress) onProgress(1);

  // Histogram
  const byCategory: Record<PedagogicalAuditCategory, number> = {
    difficulty_progression: 0,
    missing_hints: 0,
    distractor_quality: 0,
    audit_flag: 0,
    missing_solution_steps: 0,
  };
  for (const issue of issues) {
    byCategory[issue.category] = (byCategory[issue.category] ?? 0) + 1;
  }

  return {
    totalTopicsChecked,
    issues,
    byCategory,
    needsReviewTopics,
    nonAdaptiveTopics,
  };
}
