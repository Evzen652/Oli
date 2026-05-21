/**
 * Resolver dětských variant RVP jmen.
 *
 * RVP fields v `TopicMetadata` (subject, category, topic, title) zůstávají
 * neměnné — slouží pro mapování na standard, DB, audit, parent reporty.
 *
 * Student-facing UI volá funkce z tohoto souboru, aby zobrazil dětské varianty
 * podle ročníku. Per-grade slovník je v `src/content/grade-N/displayNames.ts`.
 *
 * Pokud dětská varianta neexistuje, fallback je RVP název — UI se nikdy nerozbije.
 */

import { DISPLAY_NAMES as G4 } from "@/content/grade-4/displayNames";
import type { Grade, TopicMetadata } from "./types";

interface DisplayMap {
  categories: Record<string, string>;
  topics: Record<string, string>;
}

// Per-grade lookup. Přidáním nového ročníku: importovat + zapsat do mapy.
const BY_GRADE: Partial<Record<Grade, DisplayMap>> = {
  4: G4,
};

/**
 * Vrátí dětský název okruhu (kategorie).
 * Pokud je `grade` zadané, hledá v jeho slovníku.
 * Pokud `null`/`undefined`, hledá napříč všemi ročníky (vrátí první nález).
 * Fallback: RVP název (UI se nikdy nerozbije).
 */
export function getDisplayCategory(category: string, grade?: Grade | null): string {
  if (grade != null) {
    return BY_GRADE[grade]?.categories[category] ?? category;
  }
  for (const map of Object.values(BY_GRADE)) {
    if (map?.categories[category]) return map.categories[category];
  }
  return category;
}

/**
 * Vrátí dětský název tématu.
 * Pokud je `grade` zadané, hledá v jeho slovníku.
 * Pokud `null`/`undefined`, hledá napříč všemi ročníky.
 * Fallback: RVP název.
 */
export function getDisplayTopic(topic: string, grade?: Grade | null): string {
  if (grade != null) {
    return BY_GRADE[grade]?.topics[topic] ?? topic;
  }
  for (const map of Object.values(BY_GRADE)) {
    if (map?.topics[topic]) return map.topics[topic];
  }
  return topic;
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
 * Pomocná funkce pro místa kde nemáme explicitní grade kontext.
 */
export function inferGradeForDisplay(t: Pick<TopicMetadata, "gradeRange">): Grade {
  return t.gradeRange[0];
}
