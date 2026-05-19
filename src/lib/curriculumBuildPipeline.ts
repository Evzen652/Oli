/**
 * Curriculum Build Pipeline — staged workflow pro AI-asistovanou tvorbu kurikula.
 *
 * Proč to existuje:
 *   Předchozí pokusy nechávaly AI navrhovat všechno najednou (subject + categories
 *   + topics + skills v jednom request). Vznikaly orphany, duplikáty, nekonzistence
 *   v parent_slug, a admin nemohl rozumně schvalovat po částech.
 *
 * Princip:
 *   1) AI v jednom volání navrhuje POUZE JEDNU úroveň (např. jen okruhy).
 *   2) AI dostane KOMPLETNÍ rodičovský kontext (subject metadata, grade).
 *   3) AI dostane výpis EXISTUJÍCÍCH sourozenců — explicitně řekne "nepřidávej duplikáty".
 *   4) Validátor odmítá proposaly mimo aktuální stage (orphany, špatný type).
 *   5) Po commitu se accepted items přidají do contextu jako "locked" — další stage je vidí.
 *
 * Stage flow:
 *
 *      ┌─────────────┐   pick/create   ┌──────────────┐   propose 4-8   ┌─────────────┐
 *      │   SUBJECT   │ ───────────────▶│  CATEGORIES  │ ───────────────▶│   TOPICS    │
 *      └─────────────┘                 └──────────────┘                 └─────────────┘
 *                                                                              │
 *                                                  ┌───────────────────────────┘
 *                                                  │ propose 3-6
 *                                                  ▼
 *                                          ┌──────────────┐
 *                                          │    SKILLS    │ ──▶ COMPLETE
 *                                          └──────────────┘
 *
 *   Po dokončení skills pro 1 topic se vrací do TOPICS pro další topic ze stejné category.
 *   Po dokončení topics pro 1 category se vrací do CATEGORIES pro další category.
 */

import { validateProposal, type RawProposal, type ValidationIssue } from "./curriculumProposalValidator";
import { isValidSubjectSlug } from "./subjectSlugMap";

// ─────────────────────────────────────────────────────────
// Typy
// ─────────────────────────────────────────────────────────

export type BuildStage = "subject" | "categories" | "topics" | "skills" | "complete";

export interface LockedSubject {
  name: string;
  slug: string;
  grade_min: number | null;
  grade_max: number | null;
}

export interface LockedItem {
  name: string;
  slug: string;
}

export interface BuildContext {
  stage: BuildStage;
  /** Aktivní ročník (pro grade-relevant AI prompty). null = napříč. */
  grade: number | null;

  /** Vybraný předmět — pevně zamknutý pro celou pipeline. */
  selectedSubject: LockedSubject | null;
  /** Aktivně budovaná category. */
  selectedCategory: LockedItem | null;
  /** Aktivně budované téma. */
  selectedTopic: LockedItem | null;

  /** Sourozenci pod selectedSubject (slugy + jména) — pro AI dedup. */
  existingCategories: LockedItem[];
  /** Sourozenci pod selectedCategory. */
  existingTopics: LockedItem[];
  /** Sourozenci pod selectedTopic — code_skill_id slouží jako unique. */
  existingSkills: { code_skill_id: string; name: string }[];
}

export interface StageValidationResult {
  /** Validační chyby per-proposal. */
  errors: ValidationIssue[];
  /** Kolik proposalů projde. */
  validCount: number;
  /** Kolik proposalů spadne. */
  invalidCount: number;
  /** Zda lze stage commitnout (žádné errors). */
  canCommit: boolean;
}

// ─────────────────────────────────────────────────────────
// Pravidla per stage — co AI smí, co ne
// ─────────────────────────────────────────────────────────

const STAGE_TYPE: Record<BuildStage, "subject" | "category" | "topic" | "skill" | null> = {
  subject:    "subject",
  categories: "category",
  topics:     "topic",
  skills:     "skill",
  complete:   null,
};

/** Co musí být v contextu, aby šlo do dané stage vstoupit. */
export function canEnterStage(ctx: BuildContext, target: BuildStage): { ok: true } | { ok: false; reason: string } {
  switch (target) {
    case "subject":
      return { ok: true };
    case "categories":
      if (!ctx.selectedSubject) return { ok: false, reason: "potřebuješ nejdřív zvolit předmět" };
      return { ok: true };
    case "topics":
      if (!ctx.selectedSubject) return { ok: false, reason: "potřebuješ předmět" };
      if (!ctx.selectedCategory) return { ok: false, reason: "potřebuješ zvolit okruh" };
      return { ok: true };
    case "skills":
      if (!ctx.selectedSubject) return { ok: false, reason: "potřebuješ předmět" };
      if (!ctx.selectedCategory) return { ok: false, reason: "potřebuješ okruh" };
      if (!ctx.selectedTopic) return { ok: false, reason: "potřebuješ zvolit téma" };
      return { ok: true };
    case "complete":
      return { ok: true };
  }
}

// ─────────────────────────────────────────────────────────
// Stage prompt builder — generuje AI prompt s rodičovským
// kontextem + výpisem existujících sourozenců
// ─────────────────────────────────────────────────────────

export interface BuildPromptResult {
  /** Hlavní prompt pro AI (system + user kombinovaně). */
  prompt: string;
  /** Co AI nesmí udělat — striktní instrukce. */
  forbidden: string[];
  /** Očekávaný počet proposalů (rozsah). */
  expectedCount: [min: number, max: number];
}

export function buildStagePrompt(ctx: BuildContext): BuildPromptResult {
  switch (ctx.stage) {
    case "categories":
      return buildCategoriesPrompt(ctx);
    case "topics":
      return buildTopicsPrompt(ctx);
    case "skills":
      return buildSkillsPrompt(ctx);
    case "subject":
      return buildSubjectPrompt(ctx);
    case "complete":
      return {
        prompt: "Pipeline je hotová — žádný další AI prompt.",
        forbidden: [],
        expectedCount: [0, 0],
      };
  }
}

function gradeLine(grade: number | null): string {
  return grade != null
    ? `**Ročník:** ${grade}. třída ZŠ (RVP ZV)`
    : `**Ročník:** napříč (admin neuvedl konkrétní)`;
}

function listSiblings(items: { name: string; slug?: string; code_skill_id?: string }[], emptyMsg: string): string {
  if (items.length === 0) return emptyMsg;
  return items.map((i) => `  • ${i.name}${i.slug ? ` (slug: ${i.slug})` : ""}${i.code_skill_id ? ` (id: ${i.code_skill_id})` : ""}`).join("\n");
}

function buildSubjectPrompt(ctx: BuildContext): BuildPromptResult {
  return {
    prompt: `Navrhni nový předmět dle RVP ZV.

${gradeLine(ctx.grade)}

Vrať JEDEN proposal type "subject":
\`\`\`json
{
  "proposals": [
    {
      "type": "subject", "action": "create",
      "data": { "name": "Biologie", "slug": "biologie", "grade_min": 6, "grade_max": 9 }
    }
  ],
  "explanation": "..."
}
\`\`\``,
    forbidden: [
      "NEPŘIDÁVEJ category, topic ani skill v této odpovědi",
      "slug MUSÍ být lowercase ASCII bez diakritiky (např. 'cesky-jazyk', ne 'Český jazyk')",
      "grade_min ≤ grade_max v rozsahu 1-9",
    ],
    expectedCount: [1, 1],
  };
}

function buildCategoriesPrompt(ctx: BuildContext): BuildPromptResult {
  const s = ctx.selectedSubject!;
  return {
    prompt: `Navrhni okruhy (kategorie) pro již existující předmět.

**Předmět:** ${s.name} (slug: ${s.slug})
${gradeLine(ctx.grade)}

**Již existující okruhy v tomto předmětu — NEPŘIDÁVEJ duplikáty:**
${listSiblings(ctx.existingCategories, "  (zatím žádné)")}

Navrhni 4–8 NOVÝCH okruhů, které doplňují stávající. Pro každý:
  - kratký název (2–5 slov)
  - lowercase ASCII slug
  - subject_slug = "${s.slug}" (povinné odkazování)

\`\`\`json
{
  "proposals": [
    {
      "type": "category", "action": "create",
      "data": {
        "name": "Organismy",
        "slug": "organismy",
        "subject_slug": "${s.slug}",
        "description": "Stavba a funkce živých organismů",
        "sort_order": 1
      }
    }
  ],
  "explanation": "..."
}
\`\`\``,
    forbidden: [
      "NEPŘIDÁVEJ topic ani skill — jen category",
      `subject_slug MUSÍ být přesně "${s.slug}"`,
      "Slug NESMÍ být v existujících okruzích výše",
      "Slug = lowercase ASCII s pomlčkami (organismy, ne Organismy)",
    ],
    expectedCount: [4, 8],
  };
}

function buildTopicsPrompt(ctx: BuildContext): BuildPromptResult {
  const s = ctx.selectedSubject!;
  const c = ctx.selectedCategory!;
  return {
    prompt: `Navrhni témata pro již existující okruh.

**Předmět:** ${s.name} (slug: ${s.slug})
**Okruh:** ${c.name} (slug: ${c.slug})
${gradeLine(ctx.grade)}

**Již existující témata v tomto okruhu — NEPŘIDÁVEJ duplikáty:**
${listSiblings(ctx.existingTopics, "  (zatím žádná)")}

Navrhni 3–6 NOVÝCH témat. Pro každé:
  - název (max 5 slov)
  - lowercase ASCII slug
  - category_slug = "${c.slug}" (povinné)

\`\`\`json
{
  "proposals": [
    {
      "type": "topic", "action": "create",
      "data": {
        "name": "Savci",
        "slug": "savci",
        "category_slug": "${c.slug}",
        "description": "Stavba a chování savců",
        "sort_order": 1
      }
    }
  ],
  "explanation": "..."
}
\`\`\``,
    forbidden: [
      "NEPŘIDÁVEJ category ani skill — jen topic",
      `category_slug MUSÍ být přesně "${c.slug}"`,
      "Slug NESMÍ být v existujících tématech výše",
    ],
    expectedCount: [3, 6],
  };
}

function buildSkillsPrompt(ctx: BuildContext): BuildPromptResult {
  const s = ctx.selectedSubject!;
  const c = ctx.selectedCategory!;
  const t = ctx.selectedTopic!;
  return {
    prompt: `Navrhni podtémata (skills) pro již existující téma.

**Předmět:** ${s.name} (${s.slug})
**Okruh:** ${c.name} (${c.slug})
**Téma:** ${t.name} (slug: ${t.slug})
${gradeLine(ctx.grade)}

**Již existující podtémata v tomto tématu — NEPŘIDÁVEJ duplikáty:**
${listSiblings(ctx.existingSkills, "  (zatím žádná)")}

Navrhni 3–6 NOVÝCH podtémat. Pro každé:
  - name (název pro UI)
  - code_skill_id (formát: "<subject>-<keyword>", lowercase, např. "biology-mammals")
  - topic_slug = "${t.slug}" (povinné)
  - grade_min a grade_max v rozsahu 1-9 (POVINNÉ pro filtrování)
  - input_type — JEDNA z: text, number, fraction, select_one, comparison, drag_order, fill_blank, multi_select, match_pairs, categorize
  - brief_description (2. osoba, "Naučíš se...", "Spočítáš...")
  - goals (pole, 2-4 cíle)
  - help_visual_examples (pole, emoji/ASCII)

\`\`\`json
{
  "proposals": [
    {
      "type": "skill", "action": "create",
      "data": {
        "name": "Poznáváš savce",
        "code_skill_id": "biology-mammals-recognize",
        "topic_slug": "${t.slug}",
        "input_type": "select_one",
        "grade_min": 7,
        "grade_max": 7,
        "brief_description": "Naučíš se poznat základní druhy savců.",
        "goals": ["Rozliš savce od plazů", "Pojmenuj 5 druhů savců"],
        "boundaries": [],
        "keywords": ["savec", "živočich"],
        "help_hint": "Savci mají srst a kojí mláďata.",
        "help_visual_examples": ["🐺 vlk → savec", "🦎 ještěrka → NE savec"]
      }
    }
  ],
  "explanation": "..."
}
\`\`\``,
    forbidden: [
      "NEPŘIDÁVEJ category ani topic — jen skill",
      `topic_slug MUSÍ být přesně "${t.slug}"`,
      "code_skill_id MUSÍ být unikátní (nesmí být v existujících podtémech výše)",
      "input_type musí být JEN jedna z 10 povolených hodnot",
      "grade_min a grade_max MUSÍ být nastaveny",
    ],
    expectedCount: [3, 6],
  };
}

// ─────────────────────────────────────────────────────────
// Stage validator — kontroluje proposaly proti pravidlům stage
// ─────────────────────────────────────────────────────────

/**
 * Validuje AI proposaly proti pravidlům aktuální stage.
 * Vrátí výsledek a sebraná chybová hlášení.
 */
export function validateStageOutput(
  ctx: BuildContext,
  proposals: RawProposal[],
): StageValidationResult {
  const expectedType = STAGE_TYPE[ctx.stage];
  if (!expectedType) {
    return {
      errors: [{ path: "stage", message: "Pipeline je v complete stavu, nelze validovat", severity: "error" }],
      validCount: 0,
      invalidCount: 0,
      canCommit: false,
    };
  }

  const errors: ValidationIssue[] = [];
  let validCount = 0;
  let invalidCount = 0;

  // Vstupní guard: žádný proposal mimo stage type
  proposals.forEach((p, i) => {
    if (p.type !== expectedType) {
      errors.push({
        path: `[${i}].type`,
        message: `proposal type="${p.type}" je mimo stage "${ctx.stage}" (povoleno jen "${expectedType}")`,
        severity: "error",
      });
    }
  });

  // Per-proposal validace (slugy, grade ranges, …)
  proposals.forEach((p, i) => {
    if (p.type !== expectedType) return;
    const result = validateProposal(p);
    if (result.valid) {
      validCount++;
    } else {
      invalidCount++;
      result.errors.forEach((e) => errors.push({ ...e, path: `[${i}].${e.path}` }));
    }
  });

  // Parent reference checks
  proposals.forEach((p, i) => {
    if (ctx.stage === "categories" && p.type === "category") {
      const expectedSubjectSlug = ctx.selectedSubject?.slug;
      if (p.data.subject_slug !== expectedSubjectSlug) {
        errors.push({
          path: `[${i}].data.subject_slug`,
          message: `očekáván "${expectedSubjectSlug}", dostal "${p.data.subject_slug}"`,
          severity: "error",
        });
      }
    }
    if (ctx.stage === "topics" && p.type === "topic") {
      const expectedCategorySlug = ctx.selectedCategory?.slug;
      if (p.data.category_slug !== expectedCategorySlug) {
        errors.push({
          path: `[${i}].data.category_slug`,
          message: `očekáván "${expectedCategorySlug}", dostal "${p.data.category_slug}"`,
          severity: "error",
        });
      }
    }
    if (ctx.stage === "skills" && p.type === "skill") {
      const expectedTopicSlug = ctx.selectedTopic?.slug;
      if (p.data.topic_slug !== expectedTopicSlug) {
        errors.push({
          path: `[${i}].data.topic_slug`,
          message: `očekáván "${expectedTopicSlug}", dostal "${p.data.topic_slug}"`,
          severity: "error",
        });
      }
    }
  });

  // Duplicate check proti existujícím sourozencům
  proposals.forEach((p, i) => {
    if (ctx.stage === "categories" && p.type === "category") {
      const slug = p.data.slug as string;
      if (slug && ctx.existingCategories.some((c) => c.slug === slug)) {
        errors.push({
          path: `[${i}].data.slug`,
          message: `slug "${slug}" už v okruzích existuje — duplikát`,
          severity: "error",
        });
      }
    }
    if (ctx.stage === "topics" && p.type === "topic") {
      const slug = p.data.slug as string;
      if (slug && ctx.existingTopics.some((t) => t.slug === slug)) {
        errors.push({
          path: `[${i}].data.slug`,
          message: `slug "${slug}" už v tématech existuje — duplikát`,
          severity: "error",
        });
      }
    }
    if (ctx.stage === "skills" && p.type === "skill") {
      const cid = p.data.code_skill_id as string;
      if (cid && ctx.existingSkills.some((s) => s.code_skill_id === cid)) {
        errors.push({
          path: `[${i}].data.code_skill_id`,
          message: `code_skill_id "${cid}" už existuje — duplikát`,
          severity: "error",
        });
      }
    }
  });

  // Inter-batch duplicity (AI navrhne 2× stejný slug v jedné dávce)
  const seenSlugs = new Set<string>();
  const seenCodeIds = new Set<string>();
  proposals.forEach((p, i) => {
    const slug = p.data.slug as string | undefined;
    if (slug) {
      if (seenSlugs.has(slug)) {
        errors.push({
          path: `[${i}].data.slug`,
          message: `slug "${slug}" se opakuje v této dávce`,
          severity: "error",
        });
      }
      seenSlugs.add(slug);
    }
    const cid = p.data.code_skill_id as string | undefined;
    if (cid) {
      if (seenCodeIds.has(cid)) {
        errors.push({
          path: `[${i}].data.code_skill_id`,
          message: `code_skill_id "${cid}" se opakuje v této dávce`,
          severity: "error",
        });
      }
      seenCodeIds.add(cid);
    }
  });

  return {
    errors,
    validCount,
    invalidCount: invalidCount + (proposals.length - validCount - invalidCount),
    canCommit: errors.length === 0 && validCount > 0,
  };
}

// ─────────────────────────────────────────────────────────
// State transitions — jak postupovat po commitu
// ─────────────────────────────────────────────────────────

/**
 * Posune pipeline do další stage poté, co aktuální stage byla commitnuta.
 * Vrací novou ctx s zaktualizovanými locked items.
 */
export function advanceAfterCommit(
  ctx: BuildContext,
  commitedProposals: RawProposal[],
): BuildContext {
  switch (ctx.stage) {
    case "subject": {
      // Po commitu subject přejdeme do categories
      const subj = commitedProposals[0];
      if (!subj || subj.type !== "subject") return ctx;
      return {
        ...ctx,
        stage: "categories",
        selectedSubject: {
          name: subj.data.name as string,
          slug: subj.data.slug as string,
          grade_min: (subj.data.grade_min ?? null) as number | null,
          grade_max: (subj.data.grade_max ?? null) as number | null,
        },
        existingCategories: [],
        existingTopics: [],
        existingSkills: [],
      };
    }
    case "categories": {
      // Categories commitnuté — zůstaneme v categories pro další iteraci,
      // nebo admin přejde do topics tím, že vybere category.
      // Tady jen aktualizujeme existingCategories.
      const newCats = commitedProposals
        .filter((p) => p.type === "category")
        .map((p) => ({ name: p.data.name as string, slug: p.data.slug as string }));
      return {
        ...ctx,
        existingCategories: [...ctx.existingCategories, ...newCats],
      };
    }
    case "topics": {
      const newTopics = commitedProposals
        .filter((p) => p.type === "topic")
        .map((p) => ({ name: p.data.name as string, slug: p.data.slug as string }));
      return {
        ...ctx,
        existingTopics: [...ctx.existingTopics, ...newTopics],
      };
    }
    case "skills": {
      const newSkills = commitedProposals
        .filter((p) => p.type === "skill")
        .map((p) => ({
          name: p.data.name as string,
          code_skill_id: p.data.code_skill_id as string,
        }));
      return {
        ...ctx,
        existingSkills: [...ctx.existingSkills, ...newSkills],
      };
    }
    case "complete":
      return ctx;
  }
}

/**
 * Manuální výběr category — posun do stage "topics".
 */
export function selectCategoryAndDescend(ctx: BuildContext, category: LockedItem): BuildContext {
  if (!ctx.selectedSubject) {
    throw new Error("Nelze sestoupit do topics bez vybraného subject");
  }
  return {
    ...ctx,
    stage: "topics",
    selectedCategory: category,
    selectedTopic: null,
    existingTopics: [],
    existingSkills: [],
  };
}

/**
 * Manuální výběr topic — posun do stage "skills".
 */
export function selectTopicAndDescend(ctx: BuildContext, topic: LockedItem): BuildContext {
  if (!ctx.selectedCategory) {
    throw new Error("Nelze sestoupit do skills bez vybrané category");
  }
  return {
    ...ctx,
    stage: "skills",
    selectedTopic: topic,
    existingSkills: [],
  };
}

/**
 * Krok nahoru — z topics zpět do categories (nebo z skills do topics).
 */
export function ascend(ctx: BuildContext): BuildContext {
  switch (ctx.stage) {
    case "skills":
      return { ...ctx, stage: "topics", selectedTopic: null, existingSkills: [] };
    case "topics":
      return { ...ctx, stage: "categories", selectedCategory: null, selectedTopic: null, existingTopics: [], existingSkills: [] };
    case "categories":
      return { ...ctx, stage: "subject", selectedSubject: null, selectedCategory: null, selectedTopic: null, existingCategories: [], existingTopics: [], existingSkills: [] };
    default:
      return ctx;
  }
}

/**
 * Pojmenovaná factory pro výchozí (prázdný) kontext.
 */
export function emptyBuildContext(grade: number | null = null): BuildContext {
  return {
    stage: "subject",
    grade,
    selectedSubject: null,
    selectedCategory: null,
    selectedTopic: null,
    existingCategories: [],
    existingTopics: [],
    existingSkills: [],
  };
}

// ─────────────────────────────────────────────────────────
// Health-check: validuje "rozumnost" celé pipeliny
// ─────────────────────────────────────────────────────────

export function isPipelineHealthy(ctx: BuildContext): { healthy: boolean; issues: string[] } {
  const issues: string[] = [];
  if (ctx.stage === "categories" || ctx.stage === "topics" || ctx.stage === "skills") {
    if (!ctx.selectedSubject) issues.push("stage > subject ale selectedSubject je null");
    if (ctx.selectedSubject && !isValidSubjectSlug(ctx.selectedSubject.slug)) {
      issues.push(`selectedSubject.slug "${ctx.selectedSubject.slug}" je neplatný`);
    }
  }
  if (ctx.stage === "topics" || ctx.stage === "skills") {
    if (!ctx.selectedCategory) issues.push("stage ≥ topics ale selectedCategory je null");
  }
  if (ctx.stage === "skills") {
    if (!ctx.selectedTopic) issues.push("stage = skills ale selectedTopic je null");
  }
  return { healthy: issues.length === 0, issues };
}
