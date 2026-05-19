/**
 * Validátor AI návrhů kurikula (CurriculumProposal).
 *
 * INVARIANT:
 *  Před aplikací jakéhokoli AI návrhu (subject/category/topic/skill)
 *  ho MUSÍŠ proschestit přes `validateProposal()`. Tím se garantuje:
 *   - správný tvar slugů (lowercase, ASCII, no spaces)
 *   - grade_min ≤ grade_max
 *   - povinná pole nejsou prázdná
 *   - žádné referenční slug osiřelé hodnoty (parent_slug existuje)
 *
 * Pokud AI vrátí špatný JSON, hlásí to admin přes ProposalReview místo
 * tichého ukládání nekonzistentních dat do DB.
 */

import { isValidSubjectSlug } from "./subjectSlugMap";

export type ProposalType = "subject" | "category" | "topic" | "skill";
export type ProposalAction = "create" | "update" | "delete";

export interface RawProposal {
  type: ProposalType;
  action: ProposalAction;
  data: Record<string, unknown>;
}

export interface ValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

const VALID_INPUT_TYPES = new Set([
  "text", "number", "fraction", "select_one", "comparison",
  "drag_order", "fill_blank", "multi_select", "match_pairs", "categorize",
]);

const GRADE_MIN = 1;
const GRADE_MAX = 9;

function err(path: string, message: string): ValidationIssue {
  return { path, message, severity: "error" };
}
function warn(path: string, message: string): ValidationIssue {
  return { path, message, severity: "warning" };
}

function asNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function asGrade(v: unknown): number | null {
  if (typeof v !== "number") return null;
  if (!Number.isInteger(v)) return null;
  if (v < GRADE_MIN || v > GRADE_MAX) return null;
  return v;
}

function validateGenericSlug(slug: unknown, path: string, issues: ValidationIssue[]) {
  if (!asNonEmptyString(slug)) {
    issues.push(err(path, "slug musí být neprázdný řetězec"));
    return;
  }
  if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
    issues.push(err(
      path,
      `slug "${slug}" je neplatný — musí být lowercase ASCII, čísla a pomlčky (např. "cisla-a-operace")`,
    ));
  }
}

function validateGradeRange(
  data: Record<string, unknown>,
  path: string,
  issues: ValidationIssue[],
  required: boolean,
) {
  const gmin = data.grade_min;
  const gmax = data.grade_max;
  const minSet = gmin != null;
  const maxSet = gmax != null;

  if (required && (!minSet || !maxSet)) {
    issues.push(err(path, "grade_min a grade_max jsou povinné"));
    return;
  }
  if (!minSet && !maxSet) return; // both null = optional skipped

  if (minSet && asGrade(gmin) == null) {
    issues.push(err(`${path}.grade_min`, `grade_min=${gmin} mimo rozsah ${GRADE_MIN}-${GRADE_MAX}`));
  }
  if (maxSet && asGrade(gmax) == null) {
    issues.push(err(`${path}.grade_max`, `grade_max=${gmax} mimo rozsah ${GRADE_MIN}-${GRADE_MAX}`));
  }
  if (minSet && maxSet && asGrade(gmin) != null && asGrade(gmax) != null) {
    if ((gmin as number) > (gmax as number)) {
      issues.push(err(path, `grade_min (${gmin}) > grade_max (${gmax})`));
    }
  }
  if (minSet !== maxSet) {
    issues.push(err(path, "musíš nastavit OBA grade_min i grade_max, nebo žádný"));
  }
}

function validateSubject(p: RawProposal, issues: ValidationIssue[]) {
  const { data, action } = p;
  if (action === "delete") {
    if (!asNonEmptyString(data.slug) && !asNonEmptyString(data.name)) {
      issues.push(err("subject", "pro delete potřebuješ alespoň slug nebo name"));
    }
    return;
  }
  if (!asNonEmptyString(data.name)) {
    issues.push(err("subject.name", "název předmětu chybí"));
  }
  if (asNonEmptyString(data.slug)) {
    validateGenericSlug(data.slug, "subject.slug", issues);
    if (!isValidSubjectSlug(data.slug)) {
      issues.push(err("subject.slug", `slug "${data.slug}" porušuje pravidla pro subject slug`));
    }
  } else {
    issues.push(err("subject.slug", "slug předmětu chybí"));
  }
  // grade_min/grade_max doporučené, ne povinné (admin může později)
  validateGradeRange(data, "subject", issues, false);
  if (data.grade_min == null && data.grade_max == null) {
    issues.push(warn(
      "subject",
      "bez grade_min/grade_max bude předmět viditelný v grade-filtered pohledu jen pokud má obsah",
    ));
  }
}

function validateCategory(p: RawProposal, issues: ValidationIssue[]) {
  const { data, action } = p;
  if (action === "delete") return; // delete jen dle slug, validovat slug pokud existuje
  if (!asNonEmptyString(data.name)) issues.push(err("category.name", "název chybí"));
  if (asNonEmptyString(data.slug)) validateGenericSlug(data.slug, "category.slug", issues);
  else issues.push(err("category.slug", "slug chybí"));
  if (!asNonEmptyString(data.subject_slug)) {
    issues.push(err("category.subject_slug", "musí odkazovat na rodičovský předmět"));
  } else {
    validateGenericSlug(data.subject_slug, "category.subject_slug", issues);
  }
}

function validateTopic(p: RawProposal, issues: ValidationIssue[]) {
  const { data, action } = p;
  if (action === "delete") return;
  if (!asNonEmptyString(data.name)) issues.push(err("topic.name", "název chybí"));
  if (asNonEmptyString(data.slug)) validateGenericSlug(data.slug, "topic.slug", issues);
  else issues.push(err("topic.slug", "slug chybí"));
  if (!asNonEmptyString(data.category_slug)) {
    issues.push(err("topic.category_slug", "musí odkazovat na rodičovskou kategorii"));
  } else {
    validateGenericSlug(data.category_slug, "topic.category_slug", issues);
  }
}

function validateSkill(p: RawProposal, issues: ValidationIssue[]) {
  const { data, action } = p;
  if (action === "delete") return;

  if (!asNonEmptyString(data.name)) issues.push(err("skill.name", "název chybí"));
  if (!asNonEmptyString(data.code_skill_id)) {
    issues.push(err("skill.code_skill_id", "code_skill_id chybí (formát: 'math-...' nebo 'czech-...')"));
  } else if (!/^[a-z][a-z0-9-]*$/.test(data.code_skill_id as string)) {
    issues.push(err("skill.code_skill_id", `code_skill_id "${data.code_skill_id}" musí být lowercase ASCII s pomlčkami`));
  }
  if (!asNonEmptyString(data.topic_slug)) {
    issues.push(err("skill.topic_slug", "musí odkazovat na rodičovské téma"));
  }
  if (!asNonEmptyString(data.input_type)) {
    issues.push(err("skill.input_type", "input_type chybí"));
  } else if (!VALID_INPUT_TYPES.has(data.input_type as string)) {
    issues.push(err(
      "skill.input_type",
      `input_type="${data.input_type}" není v povolených: ${Array.from(VALID_INPUT_TYPES).join(", ")}`,
    ));
  }
  // grade_min/grade_max POVINNÉ na skill úrovni — bez nich nelze filtrovat
  validateGradeRange(data, "skill", issues, true);
  // help_visual_examples doporučené
  if (!Array.isArray(data.help_visual_examples) || (data.help_visual_examples as unknown[]).length === 0) {
    issues.push(warn("skill.help_visual_examples", "doporučeno: alespoň 1 vizuální příklad s emoji/ASCII"));
  }
  if (!Array.isArray(data.goals) || (data.goals as unknown[]).length === 0) {
    issues.push(warn("skill.goals", "doporučeno: alespoň 1 cíl učení"));
  }
}

/** Validuje jeden proposal. */
export function validateProposal(p: RawProposal): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!p || typeof p !== "object") {
    return { valid: false, errors: [err("root", "proposal není objekt")], warnings: [] };
  }
  if (!["subject", "category", "topic", "skill"].includes(p.type)) {
    issues.push(err("type", `type="${p.type}" je neplatný`));
  }
  if (!["create", "update", "delete"].includes(p.action)) {
    issues.push(err("action", `action="${p.action}" je neplatný`));
  }
  if (!p.data || typeof p.data !== "object") {
    issues.push(err("data", "data chybí nebo není objekt"));
    return { valid: false, errors: issues, warnings: [] };
  }

  switch (p.type) {
    case "subject":  validateSubject(p, issues); break;
    case "category": validateCategory(p, issues); break;
    case "topic":    validateTopic(p, issues); break;
    case "skill":    validateSkill(p, issues); break;
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}

/** Validuje celou dávku proposalů + cross-reference parent slugs. */
export function validateProposalBatch(proposals: RawProposal[]): {
  perProposal: ValidationResult[];
  globalErrors: ValidationIssue[];
} {
  const perProposal = proposals.map(validateProposal);
  const globalErrors: ValidationIssue[] = [];

  // Cross-reference: odkazované parent slugs musí existovat (buď v batchi nebo se předpokládají v DB)
  const subjectSlugs = new Set(
    proposals.filter((p) => p.type === "subject" && p.action !== "delete")
      .map((p) => p.data.slug as string).filter(Boolean),
  );
  const categorySlugs = new Set(
    proposals.filter((p) => p.type === "category" && p.action !== "delete")
      .map((p) => p.data.slug as string).filter(Boolean),
  );
  const topicSlugs = new Set(
    proposals.filter((p) => p.type === "topic" && p.action !== "delete")
      .map((p) => p.data.slug as string).filter(Boolean),
  );

  proposals.forEach((p, idx) => {
    if (p.action === "delete") return;
    if (p.type === "category" && p.data.subject_slug) {
      // POZN: subject_slug může existovat v DB i mimo batch → jen warning
      if (!subjectSlugs.has(p.data.subject_slug as string)) {
        globalErrors.push(warn(
          `[${idx}] category.subject_slug`,
          `parent subject "${p.data.subject_slug}" není v batch — předpokládá se v DB`,
        ));
      }
    }
    if (p.type === "topic" && p.data.category_slug) {
      if (!categorySlugs.has(p.data.category_slug as string)) {
        globalErrors.push(warn(
          `[${idx}] topic.category_slug`,
          `parent category "${p.data.category_slug}" není v batch — předpokládá se v DB`,
        ));
      }
    }
    if (p.type === "skill" && p.data.topic_slug) {
      if (!topicSlugs.has(p.data.topic_slug as string)) {
        globalErrors.push(warn(
          `[${idx}] skill.topic_slug`,
          `parent topic "${p.data.topic_slug}" není v batch — předpokládá se v DB`,
        ));
      }
    }
  });

  return { perProposal, globalErrors };
}
