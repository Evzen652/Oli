/**
 * Sdílené kontrakty mezi grade-N moduly a zbytkem aplikace.
 *
 * ZMRAZENO. Edituje pouze architekt session.
 * Grade-N session typy IMPORTUJE, NIKDY NEMĚNÍ.
 *
 * Pokud grade-N session potřebuje změnu, zapíše požadavek do
 * docs/PENDING_CHANGES.md.
 */

import type { AcademicSubjectValue, ContentTypeValue, QualityTierValue } from "@/lib/content/taxonomy";

/**
 * Stabilní ID uzlu kurikula — nikdy se nemění po vytvoření.
 *
 * Formát: `g{ročník}-{předmět}-{okruh}-{téma}-{podtéma}`
 *
 * Příklad: `g4-matematika-cislo-a-promenna-desetinna-cisla-scitani`
 *
 * Všechny části jsou kebab-case slugy bez diakritiky.
 */
export type NodeId = string;

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Obtížnost cvičení.
 * 1 = lehké (úvod do tématu)
 * 2 = střední (standardní procvičování)
 * 3 = těžké (rozšíření, výzva)
 */
export type Difficulty = 1 | 2 | 3;

/**
 * Typ cvičení z hlediska UI — jak se renderuje a jak se ověřuje odpověď.
 */
export type ExerciseType =
  | "multiple_choice"
  | "text_input"
  | "fill_blank"
  | "matching"
  | "ordering"
  | "true_false"
  | "multi_select";

/**
 * Cvičení pro konkrétní podtéma.
 *
 * Vzniká buď z generátoru (algoritmický), z DB cache (custom_exercises),
 * nebo z faktů (factual). Grade-N session typicky vytváří generátory.
 */
export interface Exercise {
  /** Stabilní ID — pokud z generátoru, deterministicky odvozené ze seedu. */
  id: string;

  /** FK na curriculum uzel (podtéma). */
  nodeId: NodeId;

  /** Ročník — duplikováno pro rychlý lookup bez parse NodeId. */
  grade: Grade;

  /** Předmět — duplikováno pro rychlý lookup. */
  subject: AcademicSubjectValue;

  /** Jak se renderuje v UI. */
  type: ExerciseType;

  /** Otázka v markdown. */
  question: string;

  /** Správná odpověď — formát závisí na `type`. */
  answer: string | string[];

  /** Pro multiple_choice: všechny možnosti (včetně správné). */
  options?: string[];

  /** Volitelné nápovědy, postupně zpřístupňované. */
  hints?: string[];

  /** Vysvětlení správné odpovědi (post-hoc audit). */
  explanation?: string;

  difficulty: Difficulty;

  /** Jak obsah vznikl — kdo nese odpovědnost za správnost. */
  contentType: ContentTypeValue;

  /** Úroveň ověření — kdy smí žák vidět. */
  qualityTier: QualityTierValue;
}

/**
 * Pure-function generátor cvičení pro jeden podtéma.
 *
 * Musí být deterministický pro daný seed → stejný seed = stejné cvičení.
 * Zakázáno: network, DB, AI volání, Math.random() bez seedu.
 */
export type ExerciseGenerator = (params: {
  seed: number;
  difficulty: Difficulty;
}) => Exercise;

/**
 * Metadata podtématu vlastněného grade-N modulem.
 *
 * Grade-N session exportuje pole `TopicMetadata[]` ze svého `index.ts`.
 */
export interface TopicMetadata {
  nodeId: NodeId;
  grade: Grade;
  subject: AcademicSubjectValue;
  title: string;
  description?: string;
  contentType: ContentTypeValue;
  /** Generátor pro algorithmic/mixed obsah. */
  generator?: ExerciseGenerator;
  /** Předpokládaný čas na cvičení v sekundách (UX odhad). */
  estimatedSeconds?: number;
}
