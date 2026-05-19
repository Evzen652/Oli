import { describe, it, expect } from "vitest";
import {
  emptyBuildContext,
  buildStagePrompt,
  validateStageOutput,
  advanceAfterCommit,
  selectCategoryAndDescend,
  selectTopicAndDescend,
  ascend,
  canEnterStage,
  isPipelineHealthy,
  type BuildContext,
} from "@/lib/curriculumBuildPipeline";
import type { RawProposal } from "@/lib/curriculumProposalValidator";

/**
 * Curriculum Build Pipeline — testy.
 *
 * Cíl: garantovat, že staged workflow funguje SPRÁVNĚ, end-to-end:
 *   1. Subject → 2. Categories → 3. Topics (per category) → 4. Skills (per topic)
 *
 * Pokud testy projdou, AI návrhy nikdy nezpůsobí orphany, duplikáty
 * ani nekonzistentní parent vazby.
 */

// ─────────────────────────────────────────────────────────
// Stage 1: Subject
// ─────────────────────────────────────────────────────────

describe("Pipeline — subject stage", () => {
  it("prázdný kontext začíná ve stage 'subject'", () => {
    const ctx = emptyBuildContext();
    expect(ctx.stage).toBe("subject");
    expect(ctx.selectedSubject).toBeNull();
  });

  it("subject prompt obsahuje grade context", () => {
    const ctx = emptyBuildContext(6);
    const { prompt, forbidden, expectedCount } = buildStagePrompt(ctx);
    expect(prompt).toContain("Ročník");
    expect(prompt).toContain("6");
    expect(expectedCount).toEqual([1, 1]);
    expect(forbidden.join(" ")).toContain("NEPŘIDÁVEJ category");
  });

  it("po commitu subject přejde do categories s locked subject", () => {
    const ctx = emptyBuildContext(7);
    const proposal: RawProposal = {
      type: "subject", action: "create",
      data: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
    };
    const next = advanceAfterCommit(ctx, [proposal]);
    expect(next.stage).toBe("categories");
    expect(next.selectedSubject).toEqual({
      name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9,
    });
  });

  it("subject stage odmítá category proposal", () => {
    const ctx = emptyBuildContext();
    const bad: RawProposal = {
      type: "category", action: "create",
      data: { name: "X", slug: "x", subject_slug: "y" },
    };
    const result = validateStageOutput(ctx, [bad]);
    expect(result.canCommit).toBe(false);
    expect(result.errors.some((e) => e.message.includes("mimo stage"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// Stage 2: Categories
// ─────────────────────────────────────────────────────────

describe("Pipeline — categories stage", () => {
  function ctxWithSubject(): BuildContext {
    return {
      ...emptyBuildContext(7),
      stage: "categories",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
    };
  }

  it("categories prompt obsahuje subject context a požadavek na subject_slug", () => {
    const ctx = ctxWithSubject();
    const { prompt, forbidden, expectedCount } = buildStagePrompt(ctx);
    expect(prompt).toContain("Biologie");
    expect(prompt).toContain("biologie");
    expect(expectedCount).toEqual([4, 8]);
    expect(forbidden.join(" ")).toContain("subject_slug");
  });

  it("4 validní categories projdou", () => {
    const ctx = ctxWithSubject();
    const proposals: RawProposal[] = ["organismy", "ekologie", "evoluce", "anatomie"].map((slug) => ({
      type: "category", action: "create",
      data: { name: slug, slug, subject_slug: "biologie" },
    }));
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(true);
    expect(result.validCount).toBe(4);
  });

  it("category s chybným subject_slug → error", () => {
    const ctx = ctxWithSubject();
    const proposals: RawProposal[] = [{
      type: "category", action: "create",
      data: { name: "X", slug: "x", subject_slug: "fyzika" }, // špatný parent!
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
    expect(result.errors.some((e) => e.message.includes("fyzika"))).toBe(true);
  });

  it("duplikát se existující kategorií → error", () => {
    const ctx: BuildContext = {
      ...ctxWithSubject(),
      existingCategories: [{ name: "Organismy", slug: "organismy" }],
    };
    const proposals: RawProposal[] = [{
      type: "category", action: "create",
      data: { name: "Organismy", slug: "organismy", subject_slug: "biologie" },
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
    expect(result.errors.some((e) => e.message.includes("duplikát"))).toBe(true);
  });

  it("duplikát v rámci stejné AI dávky → error", () => {
    const ctx = ctxWithSubject();
    const proposals: RawProposal[] = [
      { type: "category", action: "create", data: { name: "A", slug: "ekologie", subject_slug: "biologie" } },
      { type: "category", action: "create", data: { name: "B", slug: "ekologie", subject_slug: "biologie" } },
    ];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
    expect(result.errors.some((e) => e.message.includes("opakuje"))).toBe(true);
  });

  it("po commitu se categories přidají do existingCategories", () => {
    const ctx = ctxWithSubject();
    const proposals: RawProposal[] = [
      { type: "category", action: "create", data: { name: "Organismy", slug: "organismy", subject_slug: "biologie" } },
      { type: "category", action: "create", data: { name: "Ekologie", slug: "ekologie", subject_slug: "biologie" } },
    ];
    const next = advanceAfterCommit(ctx, proposals);
    expect(next.existingCategories).toHaveLength(2);
    expect(next.existingCategories.map((c) => c.slug)).toEqual(["organismy", "ekologie"]);
    expect(next.stage).toBe("categories"); // zůstáváme v categories pro další iteraci
  });
});

// ─────────────────────────────────────────────────────────
// Stage 3: Topics (po výběru category)
// ─────────────────────────────────────────────────────────

describe("Pipeline — topics stage", () => {
  function ctxWithCategory(): BuildContext {
    return {
      ...emptyBuildContext(7),
      stage: "topics",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
      selectedCategory: { name: "Organismy", slug: "organismy" },
    };
  }

  it("selectCategoryAndDescend posune z categories do topics", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(7),
      stage: "categories",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
    };
    const next = selectCategoryAndDescend(ctx, { name: "Organismy", slug: "organismy" });
    expect(next.stage).toBe("topics");
    expect(next.selectedCategory?.slug).toBe("organismy");
    expect(next.existingTopics).toEqual([]);
  });

  it("topics prompt obsahuje category_slug constraint", () => {
    const ctx = ctxWithCategory();
    const { prompt, forbidden } = buildStagePrompt(ctx);
    expect(prompt).toContain("organismy");
    expect(forbidden.join(" ")).toContain("category_slug");
  });

  it("topic s chybným category_slug → error", () => {
    const ctx = ctxWithCategory();
    const proposals: RawProposal[] = [{
      type: "topic", action: "create",
      data: { name: "Savci", slug: "savci", category_slug: "ekologie" }, // špatný parent
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
  });

  it("topic z jiného stage type (skill) → error", () => {
    const ctx = ctxWithCategory();
    const proposals: RawProposal[] = [{
      type: "skill", action: "create",
      data: { name: "X", code_skill_id: "x", topic_slug: "x", input_type: "number", grade_min: 1, grade_max: 1 },
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
  });

  it("kompletní batch validních topics projde", () => {
    const ctx = ctxWithCategory();
    const proposals: RawProposal[] = ["savci", "plazi", "ptaci"].map((slug) => ({
      type: "topic", action: "create",
      data: { name: slug, slug, category_slug: "organismy" },
    }));
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(true);
    expect(result.validCount).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────
// Stage 4: Skills (po výběru topic)
// ─────────────────────────────────────────────────────────

describe("Pipeline — skills stage", () => {
  function ctxWithTopic(): BuildContext {
    return {
      ...emptyBuildContext(7),
      stage: "skills",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
      selectedCategory: { name: "Organismy", slug: "organismy" },
      selectedTopic: { name: "Savci", slug: "savci" },
    };
  }

  it("skills prompt vyjmenuje povolené input_type", () => {
    const ctx = ctxWithTopic();
    const { prompt, forbidden } = buildStagePrompt(ctx);
    expect(prompt).toContain("select_one");
    expect(prompt).toContain("match_pairs");
    expect(forbidden.join(" ")).toContain("input_type");
  });

  it("skill s chybným topic_slug → error", () => {
    const ctx = ctxWithTopic();
    const proposals: RawProposal[] = [{
      type: "skill", action: "create",
      data: {
        name: "X", code_skill_id: "bio-x", topic_slug: "plazi",
        input_type: "number", grade_min: 7, grade_max: 7,
      },
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
    expect(result.errors.some((e) => e.message.includes("plazi"))).toBe(true);
  });

  it("skill bez grade_min/grade_max → error", () => {
    const ctx = ctxWithTopic();
    const proposals: RawProposal[] = [{
      type: "skill", action: "create",
      data: { name: "X", code_skill_id: "bio-x", topic_slug: "savci", input_type: "number" },
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
  });

  it("duplikát code_skill_id → error", () => {
    const ctx: BuildContext = {
      ...ctxWithTopic(),
      existingSkills: [{ code_skill_id: "biology-mammals", name: "X" }],
    };
    const proposals: RawProposal[] = [{
      type: "skill", action: "create",
      data: {
        name: "Y", code_skill_id: "biology-mammals", topic_slug: "savci",
        input_type: "select_one", grade_min: 7, grade_max: 7,
      },
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
    expect(result.errors.some((e) => e.message.includes("biology-mammals"))).toBe(true);
  });

  it("validní skill projde", () => {
    const ctx = ctxWithTopic();
    const proposals: RawProposal[] = [{
      type: "skill", action: "create",
      data: {
        name: "Pozn. savce", code_skill_id: "biology-mammals", topic_slug: "savci",
        input_type: "select_one", grade_min: 7, grade_max: 7,
        goals: ["x"], help_visual_examples: ["🐺"],
      },
    }];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// Navigace: ascend / descend
// ─────────────────────────────────────────────────────────

describe("Pipeline — navigation", () => {
  it("canEnterStage zabrání skoku do topics bez subject", () => {
    const ctx = emptyBuildContext();
    expect(canEnterStage(ctx, "topics").ok).toBe(false);
    expect(canEnterStage(ctx, "skills").ok).toBe(false);
  });

  it("canEnterStage zabrání skills bez topic", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      selectedSubject: { name: "B", slug: "b", grade_min: 1, grade_max: 9 },
      selectedCategory: { name: "C", slug: "c" },
    };
    expect(canEnterStage(ctx, "skills").ok).toBe(false);
  });

  it("ascend ze skills → topics zachová subject + category, vyčistí topic + skills", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      stage: "skills",
      selectedSubject: { name: "B", slug: "b", grade_min: 1, grade_max: 9 },
      selectedCategory: { name: "C", slug: "c" },
      selectedTopic: { name: "T", slug: "t" },
      existingSkills: [{ code_skill_id: "x", name: "x" }],
    };
    const up = ascend(ctx);
    expect(up.stage).toBe("topics");
    expect(up.selectedSubject?.slug).toBe("b");
    expect(up.selectedCategory?.slug).toBe("c");
    expect(up.selectedTopic).toBeNull();
    expect(up.existingSkills).toEqual([]);
  });

  it("ascend z categories → subject vyčistí všechno", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      stage: "categories",
      selectedSubject: { name: "B", slug: "b", grade_min: 1, grade_max: 9 },
      existingCategories: [{ name: "C", slug: "c" }],
    };
    const up = ascend(ctx);
    expect(up.stage).toBe("subject");
    expect(up.selectedSubject).toBeNull();
    expect(up.existingCategories).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────
// E2E happy path: kompletní průchod od subject po skills
// ─────────────────────────────────────────────────────────

describe("Pipeline — E2E happy path", () => {
  it("subject → 4 categories → 3 topics → 3 skills (vše projde)", () => {
    let ctx = emptyBuildContext(7);

    // STAGE 1: subject
    expect(ctx.stage).toBe("subject");
    let proposals: RawProposal[] = [
      { type: "subject", action: "create",
        data: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 } },
    ];
    let r = validateStageOutput(ctx, proposals);
    expect(r.canCommit).toBe(true);
    ctx = advanceAfterCommit(ctx, proposals);
    expect(ctx.stage).toBe("categories");

    // STAGE 2: categories
    proposals = ["organismy", "ekologie", "evoluce", "anatomie"].map((slug) => ({
      type: "category", action: "create",
      data: { name: slug, slug, subject_slug: "biologie" },
    }));
    r = validateStageOutput(ctx, proposals);
    expect(r.canCommit).toBe(true);
    ctx = advanceAfterCommit(ctx, proposals);
    expect(ctx.existingCategories).toHaveLength(4);

    // Admin vybírá category "organismy" → posun do topics
    ctx = selectCategoryAndDescend(ctx, ctx.existingCategories[0]);
    expect(ctx.stage).toBe("topics");
    expect(ctx.selectedCategory?.slug).toBe("organismy");

    // STAGE 3: topics
    proposals = ["savci", "plazi", "ptaci"].map((slug) => ({
      type: "topic", action: "create",
      data: { name: slug, slug, category_slug: "organismy" },
    }));
    r = validateStageOutput(ctx, proposals);
    expect(r.canCommit).toBe(true);
    ctx = advanceAfterCommit(ctx, proposals);
    expect(ctx.existingTopics).toHaveLength(3);

    // Admin vybírá topic "savci" → posun do skills
    ctx = selectTopicAndDescend(ctx, ctx.existingTopics[0]);
    expect(ctx.stage).toBe("skills");
    expect(ctx.selectedTopic?.slug).toBe("savci");

    // STAGE 4: skills
    proposals = [
      { type: "skill", action: "create", data: {
        name: "Poznej savce", code_skill_id: "biology-mammals-recognize", topic_slug: "savci",
        input_type: "select_one", grade_min: 7, grade_max: 7,
        goals: ["G"], help_visual_examples: ["🐺"],
      } },
      { type: "skill", action: "create", data: {
        name: "Strava savců", code_skill_id: "biology-mammals-diet", topic_slug: "savci",
        input_type: "match_pairs", grade_min: 7, grade_max: 8,
        goals: ["G"], help_visual_examples: ["🌿"],
      } },
      { type: "skill", action: "create", data: {
        name: "Rozmnožování savců", code_skill_id: "biology-mammals-reproduction", topic_slug: "savci",
        input_type: "fill_blank", grade_min: 8, grade_max: 8,
        goals: ["G"], help_visual_examples: ["🐣"],
      } },
    ];
    r = validateStageOutput(ctx, proposals);
    expect(r.canCommit).toBe(true);
    ctx = advanceAfterCommit(ctx, proposals);
    expect(ctx.existingSkills).toHaveLength(3);

    // Health check po dokončení
    expect(isPipelineHealthy(ctx).healthy).toBe(true);
  });

  it("ascend zpět do topics zachová subject + category, ale vyčistí skills", () => {
    let ctx = emptyBuildContext(7);
    ctx = advanceAfterCommit(ctx, [{
      type: "subject", action: "create",
      data: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
    }]);
    ctx = selectCategoryAndDescend(ctx, { name: "Organismy", slug: "organismy" });
    ctx = selectTopicAndDescend(ctx, { name: "Savci", slug: "savci" });
    ctx = advanceAfterCommit(ctx, [{
      type: "skill", action: "create", data: {
        name: "X", code_skill_id: "biology-x", topic_slug: "savci",
        input_type: "number", grade_min: 7, grade_max: 7,
      },
    }]);
    expect(ctx.existingSkills).toHaveLength(1);

    ctx = ascend(ctx);
    expect(ctx.stage).toBe("topics");
    expect(ctx.selectedSubject?.slug).toBe("biologie");   // zachováno
    expect(ctx.selectedCategory?.slug).toBe("organismy"); // zachováno
    expect(ctx.selectedTopic).toBeNull();                 // vyčištěno
    expect(ctx.existingSkills).toEqual([]);               // vyčištěno
  });
});

// ─────────────────────────────────────────────────────────
// Mixed errors: AI ignoruje pravidla — pipeline to chytí
// ─────────────────────────────────────────────────────────

describe("Pipeline — adversarial AI scenarios", () => {
  it("AI ignoruje stage a navrhne mix subject+category+skill → vše odmítnuto kromě toho jednoho v stage", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      stage: "categories",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
    };
    const proposals: RawProposal[] = [
      { type: "subject", action: "create", data: { name: "X", slug: "x" } },
      { type: "category", action: "create", data: { name: "OK", slug: "ok", subject_slug: "biologie" } },
      { type: "topic", action: "create", data: { name: "Y", slug: "y", category_slug: "z" } },
      { type: "skill", action: "create", data: {
        name: "Z", code_skill_id: "z", topic_slug: "z",
        input_type: "number", grade_min: 1, grade_max: 1,
      } },
    ];
    const result = validateStageOutput(ctx, proposals);
    // canCommit = false protože 3 ze 4 jsou mimo stage
    expect(result.canCommit).toBe(false);
    expect(result.errors.filter((e) => e.message.includes("mimo stage"))).toHaveLength(3);
  });

  it("AI vrátí kompletní validní category batch, ale jeden má slug existující v DB → vše odmítnuto", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      stage: "categories",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
      existingCategories: [{ name: "Organismy", slug: "organismy" }], // already exists
    };
    const proposals: RawProposal[] = [
      { type: "category", action: "create", data: { name: "Ekologie", slug: "ekologie", subject_slug: "biologie" } },
      { type: "category", action: "create", data: { name: "Organismy", slug: "organismy", subject_slug: "biologie" } },
    ];
    const result = validateStageOutput(ctx, proposals);
    expect(result.canCommit).toBe(false);
    // Atomicita: 1 vadný proposal blokuje celý commit
    expect(result.errors.some((e) => e.message.includes("organismy"))).toBe(true);
  });

  it("Pipeline health-check detekuje vnitřně inkonzistentní stav", () => {
    const broken: BuildContext = {
      ...emptyBuildContext(),
      stage: "skills",
      selectedSubject: { name: "B", slug: "b", grade_min: 1, grade_max: 9 },
      // selectedCategory a selectedTopic null = nekonzistentní pro stage skills
    };
    const health = isPipelineHealthy(broken);
    expect(health.healthy).toBe(false);
    expect(health.issues.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────
// Sourozenecká dedup awareness
// ─────────────────────────────────────────────────────────

describe("Pipeline — sibling dedup awareness", () => {
  it("AI prompt obsahuje výpis existujících sourozenců", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      stage: "categories",
      selectedSubject: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
      existingCategories: [
        { name: "Organismy", slug: "organismy" },
        { name: "Ekologie", slug: "ekologie" },
      ],
    };
    const { prompt } = buildStagePrompt(ctx);
    expect(prompt).toContain("Organismy");
    expect(prompt).toContain("organismy");
    expect(prompt).toContain("Ekologie");
    expect(prompt.toLowerCase()).toContain("nepřidávej duplikáty");
  });

  it("Existing skills se ukazují s code_skill_id", () => {
    const ctx: BuildContext = {
      ...emptyBuildContext(),
      stage: "skills",
      selectedSubject: { name: "B", slug: "b", grade_min: 1, grade_max: 9 },
      selectedCategory: { name: "C", slug: "c" },
      selectedTopic: { name: "T", slug: "t" },
      existingSkills: [
        { code_skill_id: "biology-mammals-1", name: "Savec 1" },
        { code_skill_id: "biology-mammals-2", name: "Savec 2" },
      ],
    };
    const { prompt } = buildStagePrompt(ctx);
    expect(prompt).toContain("biology-mammals-1");
    expect(prompt).toContain("biology-mammals-2");
  });
});
