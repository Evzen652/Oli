/**
 * Builds structured AI prompts for curriculum content generation.
 *
 * Design principles:
 * - Prompts are deterministic pure functions — same inputs → same prompt
 * - Existing items are always included to prevent duplicate suggestions
 * - Standard-specific instructions drive language and pedagogical framing
 * - Grade context is mandatory for best results; absent grade triggers a warning
 */

import type { CurriculumStandard } from "./curriculumStandards";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function gradeContext(grade: number | null, standard: CurriculumStandard): string {
  if (grade !== null) return `${grade}. ${standard.gradeLabel}`;
  return `celý rozsah (${standard.gradeMin}–${standard.gradeMax}. ${standard.gradeLabel}) — ⚠ bez konkrétního ročníku bude obsah obecnější`;
}

function existingItemsBlock(items: string[], levelLabel: string): string {
  if (items.length === 0) {
    return `${levelLabel}: (zatím žádné — navrhni kompletní sadu pro daný předmět a ročník)`;
  }
  const list = items.map((i) => `  • ${i}`).join("\n");
  return `${levelLabel} (${items.length}):\n${list}`;
}

// ─── Category prompt ──────────────────────────────────────────────────────────

export interface BuildCategoryPromptParams {
  subject: string;
  grade: number | null;
  /** Names of categories already present in this subject */
  existingCategories: string[];
  standard: CurriculumStandard;
}

/**
 * Builds a prompt for proposing new curriculum categories (okruhy) under a subject.
 */
export function buildCategoryPrompt({
  subject,
  grade,
  existingCategories,
  standard,
}: BuildCategoryPromptParams): string {
  return `\
Jsi expert na vzdělávací systém ${standard.country} — ${standard.name} (${standard.authority}).

━━ KONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Předmět:      ${subject}
Ročník:       ${gradeContext(grade, standard)}
Úroveň:       okruhy — tematické kapitoly předmětu (1 úroveň pod předmětem)

${existingItemsBlock(existingCategories, "Již existující okruhy v tomto předmětu")}

━━ ÚKOL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navrhni 4–6 NOVÝCH okruhů, které:
  ✓ doplňují stávající — nepřekrývají se obsahem
  ✓ společně s existujícími pokrývají klíčové oblasti předmětu
  ✓ jsou formulovány stručně a výstižně (2–5 slov)
  ✓ odpovídají očekávaným výstupům ${standard.name} pro daný ročník

━━ STANDARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${standard.promptInstructions}

━━ FORMÁT ODPOVĚDI ━━━━━━━━━━━━━━━━━━━━━━
Pro každý okruh:
  - název (max 5 slov)
  - popis (1–2 věty, co se dítě naučí)
  - klíčové pojmy (3–5 slov oddělených čárkami)`;
}

// ─── Topic prompt ─────────────────────────────────────────────────────────────

export interface BuildTopicPromptParams {
  subject: string;
  category: string;
  grade: number | null;
  /** Names of topics already present in this category */
  existingTopics: string[];
  standard: CurriculumStandard;
}

/**
 * Builds a prompt for proposing new curriculum topics (témata) under a category.
 */
export function buildTopicPrompt({
  subject,
  category,
  grade,
  existingTopics,
  standard,
}: BuildTopicPromptParams): string {
  return `\
Jsi expert na vzdělávací systém ${standard.country} — ${standard.name} (${standard.authority}).

━━ KONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Předmět:      ${subject}
Okruh:        ${category}
Ročník:       ${gradeContext(grade, standard)}
Úroveň:       témata — konkrétní výukové celky v rámci okruhu (2 úrovně pod předmětem)

${existingItemsBlock(existingTopics, "Již existující témata v tomto okruhu")}

━━ ÚKOL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navrhni 4–6 NOVÝCH témat, která:
  ✓ doplňují stávající — nepřekrývají se
  ✓ jsou konkrétní a ohraničená (jedno téma = jeden výukový celek, ne celá oblast)
  ✓ jsou přiměřená věku a ročníku dítěte
  ✓ odpovídají očekávaným výstupům ${standard.name}

━━ STANDARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${standard.promptInstructions}

━━ FORMÁT ODPOVĚDI ━━━━━━━━━━━━━━━━━━━━━━
Pro každé téma:
  - název (max 5 slov)
  - popis (1–2 věty, co se dítě naučí)
  - klíčové pojmy (3–5 slov oddělených čárkami)`;
}

// ─── Subject prompt ───────────────────────────────────────────────────────────

export interface BuildSubjectPromptParams {
  grade: number | null;
  /** Names of subjects already present in the curriculum */
  existingSubjects: string[];
  standard: CurriculumStandard;
}

/**
 * Builds a prompt for proposing new curriculum subjects.
 * Used when starting from scratch or expanding the subject list.
 */
export function buildSubjectPrompt({
  grade,
  existingSubjects,
  standard,
}: BuildSubjectPromptParams): string {
  return `\
Jsi expert na vzdělávací systém ${standard.country} — ${standard.name} (${standard.authority}).

━━ KONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ročník:  ${gradeContext(grade, standard)}
Úroveň: předměty — nejvyšší úroveň kurikula

${existingItemsBlock(existingSubjects, "Již existující předměty")}

━━ ÚKOL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navrhni předměty, které:
  ✓ jsou součástí povinného vzdělávání dle ${standard.name}
  ✓ chybí ve stávajícím seznamu
  ✓ jsou vhodné pro daný ročník

━━ STANDARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${standard.promptInstructions}

━━ FORMÁT ODPOVĚDI ━━━━━━━━━━━━━━━━━━━━━━
Pro každý předmět:
  - název (oficiální název dle ${standard.name})
  - stručný popis (1 věta)
  - typický ročník zahájení výuky`;
}
