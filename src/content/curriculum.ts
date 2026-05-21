/**
 * Curriculum API — readonly přístup k RVP datasetu.
 *
 * Zdroj pravdy: `data/rvp_data.json` (841 podtémat, verze 1.0.0).
 *
 * Grade-N session použije:
 *   - `getNodesByGradeSubject(4, 'matematika')` pro výběr podtémat svého oboru
 *   - `getNode(id)` pro lookup detailu
 *
 * Vše readonly. Soubor `data/rvp_data.json` se nikdy nemění z aplikace.
 */

import rvpData from "../../data/rvp_data.json";
import type { NodeId, Grade } from "./types";

export type SubjectSlug =
  | "cjl"
  | "matematika"
  | "prvouka"
  | "vlastiveda"
  | "prirodoveda"
  | "dejepis"
  | "vko"
  | "fyzika"
  | "chemie"
  | "prirodopis"
  | "zemepis"
  | "informatika";

/**
 * Plochý uzel kurikula — list ve stromu RVP, "podtéma".
 *
 * Každý uzel má stabilní ID. ID se nikdy nemění po jeho zveřejnění,
 * protože na ně odkazují session, custom_exercises, progress atd.
 */
export interface CurriculumNode {
  id: NodeId;
  grade: Grade;
  subject: SubjectSlug;
  area: string;          // slug oblasti (např. "geometrie-v-rovine-a-v-prostoru")
  topic: string;         // slug tématu
  subtopic: string;      // slug podtématu
  labels: {
    subject: string;     // lidsky čitelný název
    area: string;
    topic: string;
    subtopic: string;
  };
}

interface RvpData {
  metadata: {
    version: string;
    source: string;
    generated: string;
    totalNodes: number;
    gradeRange: [number, number];
    subjects: string[];
    excludedSubjects: string[];
    disclaimers: string[];
  };
  grades: unknown; // strom pro UI; flat lookup stačí
  flatNodes: CurriculumNode[];
}

const data = rvpData as RvpData;

/** Všechny uzly. */
export function getAllNodes(): readonly CurriculumNode[] {
  return data.flatNodes;
}

/** Metadata o datasetu (verze, zdroj, disclaimery). */
export function getCurriculumMetadata() {
  return data.metadata;
}

/** Lookup podle stabilního ID. */
export function getNode(id: NodeId): CurriculumNode | undefined {
  return data.flatNodes.find((n) => n.id === id);
}

/** Všechny uzly daného ročníku. */
export function getNodesByGrade(grade: Grade): CurriculumNode[] {
  return data.flatNodes.filter((n) => n.grade === grade);
}

/** Všechny uzly daného ročníku a předmětu. */
export function getNodesByGradeSubject(
  grade: Grade,
  subject: SubjectSlug,
): CurriculumNode[] {
  return data.flatNodes.filter((n) => n.grade === grade && n.subject === subject);
}

/** Vrací stabilní ID pro podtéma daného ročníku/předmětu podle labelu. Užitečné pro debug a testy. */
export function findNodeByLabel(
  grade: Grade,
  subject: SubjectSlug,
  subtopicLabel: string,
): CurriculumNode | undefined {
  return data.flatNodes.find(
    (n) =>
      n.grade === grade &&
      n.subject === subject &&
      n.labels.subtopic === subtopicLabel,
  );
}
