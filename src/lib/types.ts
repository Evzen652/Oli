// ===== SESSION STATE MACHINE =====
export type SessionState =
  | "INIT"
  | "INPUT_CAPTURE"
  | "PRE_INTENT"
  | "TOPIC_MATCH"
  | "EXPLAIN"
  | "PRACTICE"
  | "CHECK"
  | "STOP_1"
  | "STOP_2"
  | "END";

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Modality = "voice" | "text" | "mixed";

export type InputType =
  | "comparison"
  | "fraction"
  | "number"
  | "numeric_range"   // Číslo s tolerancí — fyzika, chemie, geografie
  | "select_one"
  | "drag_order"
  | "text"
  | "short_answer"    // Krátká volná odpověď s fuzzy match — humanitní předměty
  | "fill_blank"
  | "match_pairs"
  | "multi_select"
  | "categorize"
  | "table_fill"      // Doplnit prázdné buňky tabulky
  | "sequence_step"   // Seřadit kroky postupu (chemie, biologie, dějepis)
  | "image_select"      // Vyber 1 ze 4 obrázků (zeměpis, biologie)
  | "diagram_label"     // Popis bodů na obrázku (anatomie, mapa)
  | "chemical_balance"  // Vyrovnat chemickou rovnici (chemie 8.-9.)
  | "timeline"          // Seřadit historické události (dějepis)
  | "formula_builder";  // Sestavit vzorec z dílů (matematika, fyzika, chemie)

// ===== HELP DATA =====
export interface FractionBarData {
  fraction: string;       // e.g. "3/5"
  numerator: number;
  denominator: number;
}

export interface HelpVisualExample {
  label: string;
  illustration?: string;          // fallback ASCII
  fractionBars?: FractionBarData[]; // colored visual bars
  conclusion?: string;            // e.g. "3/5 > 2/5"
}

export interface HelpData {
  hint: string;
  steps: string[];
  commonMistake: string;
  example: string;
  visualExamples?: HelpVisualExample[];
}

// ===== CONTENT REGISTRY =====
/**
 * Content generation strategy for a skill.
 * Musí odpovídat supabase/migrations/20260417120000_content_infrastructure.sql
 * a src/lib/content/taxonomy.ts.
 */
export type ContentType = "algorithmic" | "factual" | "conceptual" | "mixed";

export interface TopicMetadata {
  id: string;
  title: string;
  subject: string; // e.g. "matematika", "čeština"
  category: string; // grouping within subject, e.g. "Zlomky"
  topic: string; // grouping within category, e.g. "Porovnávání zlomků"
  briefDescription: string; // 1-2 sentence description of the subtopic/skill
  topicDescription?: string; // general description for the topic group (used when multiple subtopics exist)
  keywords: string[]; // for matching child input
  goals: string[]; // learning objectives
  boundaries: string[]; // what NOT to cover
  gradeRange: [Grade, Grade]; // min-max grade applicability
  practiceType?: "result_only" | "step_based"; // default: result_only
  defaultLevel?: number; // default difficulty level (1-3)
  sessionTaskCount?: number; // how many tasks per session (default 6)
  inputType: InputType; // determines UI component
  generator: (level: number) => PracticeTask[]; // pure function, no network
  helpTemplate: HelpData; // static help data

  // ─── Governance metadata (default: algorithmic + no prerequisites) ───
  /** Jak se obsah generuje a validuje. Default: algorithmic (zpětná kompatibilita). */
  contentType?: ContentType;
  /** Seznam code_skill_id, které musí žák umět PŘED touto dovedností (vertikální kontinuita). */
  prerequisites?: string[];
  /** RVP kód (např. "M-5-1-03") pro reporting pokrytí kurikula. */
  rvpReference?: string;
}

// ===== PRACTICE BATCH =====
export interface PracticeTask {
  question: string;
  correctAnswer: string;
  options?: string[]; // for select_one / true_false
  items?: string[]; // for drag_order (correct order)
  solutionSteps?: string[]; // specific step-by-step solution for this task
  hints?: string[];          // progressive hints (guide without revealing answer)
  blanks?: string[];         // for fill_blank (correct answers for each blank)
  pairs?: { left: string; right: string }[]; // for match_pairs
  categories?: { name: string; items: string[] }[]; // for categorize
  correctAnswers?: string[]; // for multi_select
  /** for image_select — pole 4 obrázků s URL a alt textem */
  imageOptions?: { url: string; alt: string; id: string }[];
  /** for diagram_label — pozadí + body k popisu */
  diagram?: {
    imageUrl: string;
    imageAlt: string;
    /** Body s relativní pozicí (0-1) v rámci obrázku */
    points: { x: number; y: number; id: string }[];
    /** Pool labelů které žák přiřazuje (random shuffled) */
    labelPool: string[];
  };
  /**
   * for chemical_balance — žák doplňuje koeficienty rovnice.
   * tokens: prokládaný array — sudé indexy = vzorce/operátory ("H2O", "+", "="),
   * liché indexy nebo isCoefficient flag = pole pro doplnění koeficientu.
   */
  chemEquation?: {
    /** Tokens v pořadí. Označené jako koeficient = žák doplňuje. */
    tokens: { value: string; isCoefficient: boolean }[];
  };
  /** for timeline — pool událostí v náhodném pořadí (žák seřadí) */
  timelineEvents?: { id: string; label: string }[];
  /** for formula_builder — pool dílů, žák sestaví ve správném pořadí */
  formulaPool?: { id: string; token: string }[];
}

// ===== RULE ENGINE =====
export interface SessionRules {
  maxDurationSeconds: number;
  modality: Modality;
  maxErrorRepetitions: number;
}

// ===== SESSION =====
export interface SessionData {
  id: string;
  state: SessionState;
  grade: Grade;
  startTime: number;
  elapsedSeconds: number;
  matchedTopic: TopicMetadata | null;
  childInput: string;
  errorCount: number;
  confusionCount: number;
  stopReason: string | null;
  rules: SessionRules;
  practiceBatch: PracticeTask[];
  currentTaskIndex: number;
  errorStreak: number;
  successStreak: number;
  usedQuestions: string[]; // deduplication: already used question strings
  helpUsedCount: number; // count of tasks where help was opened before answering
  helpUsedOnCurrent: boolean; // whether help was opened for the current task
  currentLevel: number; // adaptive difficulty level (1-3)
  adaptiveHelpOffered: boolean; // adaptive engine suggested offering help
  /**
   * Pre-fetched active misconception confidence (0-1) pro matchedTopic.skill.
   * Naplňuje se při TOPIC_MATCH transition (jednou per topic, ne per task),
   * aby orchestrator mohl synchronně předat do adaptive engine bez DB volání
   * v realtime loop.
   */
  misconceptionConfidence?: number;
}

// ===== AI EXECUTION (mock) =====
export interface AIRequest {
  type: "explain" | "practice" | "check";
  topic: TopicMetadata;
  grade: Grade;
  childInput: string;
  previousErrors: number;
}

export interface AIResponse {
  content: string;
  practiceQuestion?: string;
  isCorrect?: boolean;
}

// ===== LOGGING =====
export interface AuditLogEntry {
  timestamp: number;
  sessionId: string;
  topicId: string | null;
  sessionState: SessionState;
  stopReason: string | null;
  durationSeconds: number;
  modality: Modality;
  boundaryViolation: boolean;
}

// ===== HELPERS =====
/** Full display title: "Porovnávání zlomků s různým jmenovatelem" instead of just "S různým jmenovatelem" */
export function getFullTopicTitle(topic: TopicMetadata): string {
  if (topic.topic === topic.title) return topic.title;
  // Lowercase first char of subtitle when appending
  const sub = topic.title.charAt(0).toLowerCase() + topic.title.slice(1);
  return `${topic.topic} – ${sub}`;
}
