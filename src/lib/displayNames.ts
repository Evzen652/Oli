/**
 * Resolver dětských variant RVP jmen + popisků.
 *
 * RVP fields v `TopicMetadata` (subject, category, topic, title) zůstávají
 * neměnné — slouží pro mapování na standard, DB, audit, parent reporty.
 *
 * Student-facing UI volá funkce z tohoto souboru, aby zobrazil dětské varianty
 * podle ročníku. Per-grade slovník je v `src/content/grade-N/displayNames.ts`.
 *
 * Pokud dětská varianta neexistuje, fallback je RVP název — UI se nikdy nerozbije.
 */

import type { Grade, TopicMetadata } from "./types";
import { getFullTopicTitle } from "./types";

// ─── Per-grade datová struktura (export pro typování v grade-N/displayNames.ts) ───

export interface DisplayEntry {
  /** Krátký dětský název (2-4 slova) — co dítě vidí jako titulek karty. */
  name: string;
  /** 1 věta dětsky, 2. osoba, max ~15 slov — popis na kartě (volitelné). */
  description?: string;
}

export interface DisplayMap {
  /** RVP okruh → dětský záznam. Klíč = `TopicMetadata.category`. */
  categories: Record<string, DisplayEntry>;
  /** RVP téma → dětský záznam. Klíč = `TopicMetadata.topic`. */
  topics: Record<string, DisplayEntry>;
}

// ─── Imports per-grade slovníků ────────────────────────────────────────────

import { DISPLAY_NAMES as G2 } from "@/content/grade-2/displayNames";
import { DISPLAY_NAMES as G3 } from "@/content/grade-3/displayNames";
import { DISPLAY_NAMES as G4 } from "@/content/grade-4/displayNames";
import { DISPLAY_NAMES as G5 } from "@/content/grade-5/displayNames";

// Per-grade lookup. Přidáním nového ročníku: importuj + zapiš do mapy.
const BY_GRADE: Partial<Record<Grade, DisplayMap>> = {
  2: G2,
  3: G3,
  4: G4,
  5: G5,
};

// ─── Interní helper — najde entry napříč ročníky pokud `grade` chybí ──────

function lookupEntry(
  kind: "categories" | "topics",
  key: string,
  grade?: Grade | null,
): DisplayEntry | null {
  if (grade != null) {
    return BY_GRADE[grade]?.[kind][key] ?? null;
  }
  for (const map of Object.values(BY_GRADE)) {
    if (map?.[kind][key]) return map[kind][key];
  }
  return null;
}

// ─── PUBLIC API ────────────────────────────────────────────────────────────

/**
 * Vrátí dětský název okruhu (kategorie).
 * Fallback: RVP název (UI se nikdy nerozbije).
 */
export function getDisplayCategory(category: string, grade?: Grade | null): string {
  return lookupEntry("categories", category, grade)?.name ?? category;
}

/**
 * Vrátí dětský popis okruhu (1 věta, 2. osoba). Null pokud popis chybí.
 */
export function getDisplayCategoryDescription(category: string, grade?: Grade | null): string | null {
  return lookupEntry("categories", category, grade)?.description ?? null;
}

/**
 * Vrátí dětský název tématu.
 * Fallback: RVP název.
 */
export function getDisplayTopic(topic: string, grade?: Grade | null): string {
  return lookupEntry("topics", topic, grade)?.name ?? topic;
}

/**
 * Vrátí dětský popis tématu (1 věta, 2. osoba). Null pokud popis chybí.
 */
export function getDisplayTopicDescription(topic: string, grade?: Grade | null): string | null {
  return lookupEntry("topics", topic, grade)?.description ?? null;
}

/**
 * Vrátí dětský název podtématu.
 * Bere `studentTitle` z `TopicMetadata`, fallback na `title` (RVP).
 */
export function getDisplayTitle(t: Pick<TopicMetadata, "title" | "studentTitle">): string {
  return t.studentTitle ?? t.title;
}

/**
 * Odvodí grade z `TopicMetadata` — bere první ročník z `gradeRange`.
 */
export function inferGradeForDisplay(t: Pick<TopicMetadata, "gradeRange">): Grade {
  return t.gradeRange[0];
}

/**
 * Celý název tématu tak, jak ho má vidět DÍTĚ.
 *
 * `getFullTopicTitle` z `types.ts` skládá název z RVP taxonomie a vyleze
 * z něj „Číselný obor 0–1 000 000 – zaokrouhlování čísel". To je katalogový
 * záznam, ne něco, u čeho by dítě cítilo, k čemu mu to je. Každé téma má
 * `studentTitle` (ověřeno: 229 z 229), takže sáhnout po něm je vždycky
 * možné — jen se to na některých obrazovkách nedělalo.
 *
 * `isStudentView === false` (rodič, admin) naopak RVP název chce: hledá
 * podle něj v osnovách.
 */
export function getChildTopicTitle(
  topic: Pick<TopicMetadata, "topic" | "title"> & { displayName?: string; studentTitle?: string },
  grade: number | null,
  isStudentView = true,
): string {
  if (!isStudentView) return getFullTopicTitle(topic as TopicMetadata);
  if (topic.studentTitle) return topic.studentTitle;
  const displayGroup = getDisplayTopic(topic.topic ?? "", (grade ?? 4) as Grade);
  const displaySub = topic.displayName ?? topic.title ?? "";
  if (!displaySub || topic.topic === topic.title) return displayGroup;
  const sub = displaySub.charAt(0).toLowerCase() + displaySub.slice(1);
  return `${displayGroup} – ${sub}`;
}
