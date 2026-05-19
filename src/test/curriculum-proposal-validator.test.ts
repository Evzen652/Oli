import { describe, it, expect } from "vitest";
import {
  validateProposal,
  validateProposalBatch,
  type RawProposal,
} from "@/lib/curriculumProposalValidator";

/**
 * AI Proposal validator testy.
 *
 * Tyto testy chrání DB před vadnými AI návrhy.
 * Pokud AI vrátí proposal, který projde validátorem, je SAFE ho aplikovat.
 */

const goodSubject: RawProposal = {
  type: "subject", action: "create",
  data: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 },
};
const goodCategory: RawProposal = {
  type: "category", action: "create",
  data: { name: "Organismy", slug: "organismy", subject_slug: "biologie" },
};
const goodTopic: RawProposal = {
  type: "topic", action: "create",
  data: { name: "Savci", slug: "savci", category_slug: "organismy" },
};
const goodSkill: RawProposal = {
  type: "skill", action: "create",
  data: {
    name: "Poznáš savce", code_skill_id: "biology-mammals", topic_slug: "savci",
    input_type: "select_one", grade_min: 7, grade_max: 7,
    goals: ["Rozliš savce od plazů"],
    help_visual_examples: ["🐺 vlk → savec"],
  },
};

describe("validateProposal — happy paths", () => {
  it("validní subject", () => {
    const r = validateProposal(goodSubject);
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
  });
  it("validní category", () => {
    const r = validateProposal(goodCategory);
    expect(r.valid).toBe(true);
  });
  it("validní topic", () => {
    const r = validateProposal(goodTopic);
    expect(r.valid).toBe(true);
  });
  it("validní skill", () => {
    const r = validateProposal(goodSkill);
    expect(r.valid).toBe(true);
  });
});

describe("validateProposal — root invariants", () => {
  it("null proposal → invalid", () => {
    const r = validateProposal(null as any);
    expect(r.valid).toBe(false);
  });
  it("neznámý type → invalid", () => {
    const r = validateProposal({ type: "xxx" as any, action: "create", data: {} });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.path === "type")).toBe(true);
  });
  it("neznámá action → invalid", () => {
    const r = validateProposal({ type: "subject", action: "explode" as any, data: { name: "x", slug: "x" } });
    expect(r.errors.some((e) => e.path === "action")).toBe(true);
  });
  it("chybějící data → invalid", () => {
    const r = validateProposal({ type: "subject", action: "create" } as any);
    expect(r.valid).toBe(false);
  });
});

describe("validateProposal — subject", () => {
  it("chybějící name → error", () => {
    const r = validateProposal({ ...goodSubject, data: { ...goodSubject.data, name: "" } });
    expect(r.errors.some((e) => e.path === "subject.name")).toBe(true);
  });
  it("chybějící slug → error", () => {
    const r = validateProposal({ ...goodSubject, data: { name: "X" } });
    expect(r.errors.some((e) => e.path === "subject.slug")).toBe(true);
  });
  it("slug s diakritikou → error", () => {
    const r = validateProposal({ ...goodSubject, data: { name: "X", slug: "čeština" } });
    expect(r.valid).toBe(false);
  });
  it("slug s velkým písmenem → error", () => {
    const r = validateProposal({ ...goodSubject, data: { name: "X", slug: "Biologie" } });
    expect(r.valid).toBe(false);
  });
  it("slug s mezerou → error", () => {
    const r = validateProposal({ ...goodSubject, data: { name: "X", slug: "cesky jazyk" } });
    expect(r.valid).toBe(false);
  });
  it("bez grade_min/grade_max → valid (jen warning)", () => {
    const r = validateProposal({ type: "subject", action: "create",
      data: { name: "X", slug: "x" } });
    expect(r.valid).toBe(true);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("grade_min > grade_max → error", () => {
    const r = validateProposal({ ...goodSubject,
      data: { ...goodSubject.data, grade_min: 9, grade_max: 3 } });
    expect(r.valid).toBe(false);
  });
  it("grade mimo rozsah 1-9 → error", () => {
    const r = validateProposal({ ...goodSubject,
      data: { ...goodSubject.data, grade_min: 0, grade_max: 9 } });
    expect(r.valid).toBe(false);
  });
  it("grade_min=null + grade_max=8 (jen jeden set) → error", () => {
    const r = validateProposal({ ...goodSubject,
      data: { name: "X", slug: "x", grade_max: 8 } });
    expect(r.valid).toBe(false);
  });
  it("delete vyžaduje slug nebo name", () => {
    expect(validateProposal({ type: "subject", action: "delete", data: {} }).valid).toBe(false);
    expect(validateProposal({ type: "subject", action: "delete", data: { slug: "x" } }).valid).toBe(true);
  });
});

describe("validateProposal — category / topic", () => {
  it("category bez subject_slug → error", () => {
    const r = validateProposal({ type: "category", action: "create",
      data: { name: "X", slug: "x" } });
    expect(r.errors.some((e) => e.path === "category.subject_slug")).toBe(true);
  });
  it("topic bez category_slug → error", () => {
    const r = validateProposal({ type: "topic", action: "create",
      data: { name: "X", slug: "x" } });
    expect(r.errors.some((e) => e.path === "topic.category_slug")).toBe(true);
  });
});

describe("validateProposal — skill", () => {
  it("skill MUSÍ mít grade_min a grade_max", () => {
    const r = validateProposal({ ...goodSkill, data: { ...goodSkill.data, grade_min: undefined, grade_max: undefined } });
    expect(r.valid).toBe(false);
  });
  it("neplatný input_type → error", () => {
    const r = validateProposal({ ...goodSkill, data: { ...goodSkill.data, input_type: "neexistujici" } });
    expect(r.valid).toBe(false);
  });
  it("validní input_type — všechny povolené hodnoty", () => {
    const types = ["text", "number", "fraction", "select_one", "comparison",
      "drag_order", "fill_blank", "multi_select", "match_pairs", "categorize"];
    for (const t of types) {
      const r = validateProposal({ ...goodSkill, data: { ...goodSkill.data, input_type: t } });
      expect(r.valid, `input_type ${t} should be valid`).toBe(true);
    }
  });
  it("chybějící code_skill_id → error", () => {
    const r = validateProposal({ ...goodSkill, data: { ...goodSkill.data, code_skill_id: "" } });
    expect(r.valid).toBe(false);
  });
  it("code_skill_id s velkými písmeny → error", () => {
    const r = validateProposal({ ...goodSkill, data: { ...goodSkill.data, code_skill_id: "BiologyMammals" } });
    expect(r.valid).toBe(false);
  });
  it("chybějící help_visual_examples → warning, ne error", () => {
    const r = validateProposal({ ...goodSkill, data: { ...goodSkill.data, help_visual_examples: [] } });
    expect(r.valid).toBe(true);
    expect(r.warnings.some((w) => w.path === "skill.help_visual_examples")).toBe(true);
  });
});

describe("validateProposalBatch — cross-reference", () => {
  it("kompletní batch s parent ↔ child vazbami", () => {
    const r = validateProposalBatch([goodSubject, goodCategory, goodTopic, goodSkill]);
    const errors = r.perProposal.flatMap((p) => p.errors);
    expect(errors).toEqual([]);
  });
  it("category odkazující na neexistující subject → warning (mohlo by být v DB)", () => {
    const r = validateProposalBatch([
      { type: "category", action: "create",
        data: { name: "X", slug: "x", subject_slug: "neexistujici" } },
    ]);
    expect(r.globalErrors.some((e) => e.message.includes("neexistujici"))).toBe(true);
  });
  it("topic odkazující na category v batchi → žádný topic warning", () => {
    const r = validateProposalBatch([goodCategory, goodTopic]);
    // category v batchi může mít warning o chybějícím subject — to je OK
    // důležité: topic NEMÁ warning, protože category je v batchi
    const topicWarnings = r.globalErrors.filter((e) => e.path.includes("topic"));
    expect(topicWarnings).toEqual([]);
  });

  it("kompletní batch subject+category+topic → žádné cross-ref warnings", () => {
    const r = validateProposalBatch([goodSubject, goodCategory, goodTopic]);
    expect(r.globalErrors).toEqual([]);
  });
});

describe("Reálné AI scénáře — sanity test", () => {
  it("typický AI output: subject + 4 categories + 16 topics", () => {
    const proposals: RawProposal[] = [
      { type: "subject", action: "create",
        data: { name: "Biologie", slug: "biologie", grade_min: 6, grade_max: 9 } },
      ...Array.from({ length: 4 }, (_, i) => ({
        type: "category" as const, action: "create" as const,
        data: { name: `Cat ${i}`, slug: `cat-${i}`, subject_slug: "biologie" },
      })),
      ...Array.from({ length: 16 }, (_, i) => ({
        type: "topic" as const, action: "create" as const,
        data: { name: `T${i}`, slug: `t-${i}`, category_slug: `cat-${i % 4}` },
      })),
    ];
    const r = validateProposalBatch(proposals);
    const errs = r.perProposal.flatMap((p) => p.errors);
    expect(errs).toEqual([]);
  });

  it("vadný AI output: prázdná jména, špatný input_type", () => {
    const proposals: RawProposal[] = [
      { type: "subject", action: "create", data: { name: "", slug: "x" } },
      { type: "skill", action: "create", data: {
        name: "x", code_skill_id: "x", topic_slug: "t",
        input_type: "TEXTAREA", grade_min: 5, grade_max: 5,
      } },
    ];
    const r = validateProposalBatch(proposals);
    expect(r.perProposal[0].valid).toBe(false);
    expect(r.perProposal[1].valid).toBe(false);
  });
});
