import { describe, it, expect } from "vitest";
import {
  isSubjectVisibleForGrade,
  filterSubjectsByGrade,
  type SubjectGradeRange,
} from "@/lib/curriculumSubjectFilter";
import { validateProposal, validateProposalBatch, type RawProposal } from "@/lib/curriculumProposalValidator";
import { canonicalSubjectName } from "@/lib/subjectSlugMap";

/**
 * Scale tests — systém musí fungovat při 10 000+ topicích/skillech.
 *
 * Cíl: zachytit O(n²) regrese dříve než se dostanou do produkce.
 * Tresholdy jsou volné (CI servery jsou pomalejší), ale chytí degradaci řádu.
 */

// ─────────────────────────────────────────────────────────
// Fabrika testovacích dat
// ─────────────────────────────────────────────────────────

function makeSubjects(count: number): Array<{ id: string; name: string; slug: string; grade_min: number | null; grade_max: number | null }> {
  return Array.from({ length: count }, (_, i) => ({
    id: `s-${i}`,
    name: `predmet-${i}`,
    slug: `predmet-${i}`,
    grade_min: (i % 9) + 1,
    grade_max: Math.min(((i % 9) + 1) + (i % 4), 9),
  }));
}

function makeTopics(skillCount: number) {
  return Array.from({ length: skillCount }, (_, i) => ({
    id: `skill-${i}`,
    title: `Skill ${i}`,
    subject: `predmet-${i % 100}`,        // 100 různých předmětů
    category: `cat-${i % 500}`,           // 500 různých kategorií
    topic: `topic-${i % 2000}`,           // 2000 různých témat
    gradeRange: [((i % 9) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, 9 as 9] as [number, number],
  }));
}

function makeProposals(count: number): RawProposal[] {
  return Array.from({ length: count }, (_, i) => ({
    type: "skill",
    action: "create",
    data: {
      name: `Skill ${i}`,
      code_skill_id: `gen-skill-${i}`,
      topic_slug: `topic-${i % 2000}`,
      input_type: "number",
      grade_min: (i % 9) + 1,
      grade_max: Math.min(((i % 9) + 1) + 1, 9),
      goals: ["G1"],
      help_visual_examples: ["🔢"],
    },
  }));
}

// ─────────────────────────────────────────────────────────
// Tresholdy (s rezervou pro pomalé CI)
// ─────────────────────────────────────────────────────────

const T_FILTER_10K = 100;      // isSubjectVisibleForGrade × 10k
const T_TREE_BUILD_10K = 500;  // sidebar tree z 10k topics
const T_VALIDATE_10K = 2000;   // validateProposalBatch × 10k
const T_CANONICAL_50K = 100;   // 50k name lookups
const T_FILTER_SUBJECTS_10K = 300; // filterSubjectsByGrade across 10k subjects

// ─────────────────────────────────────────────────────────
// 1. Filter scale
// ─────────────────────────────────────────────────────────

describe("Scale — isSubjectVisibleForGrade", () => {
  it("10 000 volání < 100 ms (single ms-level call)", () => {
    const subject: SubjectGradeRange = { grade_min: 6, grade_max: 9 };
    const start = performance.now();
    let visibleCount = 0;
    for (let i = 0; i < 10_000; i++) {
      const grade = (i % 9) + 1;
      if (isSubjectVisibleForGrade(subject, grade, false)) visibleCount++;
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(T_FILTER_10K);
    expect(visibleCount).toBeGreaterThan(0);
  });

  it("filterSubjectsByGrade na 10 000 předmětech < 300 ms", () => {
    const subjects = makeSubjects(10_000);
    const subjectsWithContent = new Set(["predmet-0", "predmet-1", "predmet-2"]);
    const start = performance.now();
    const visible = filterSubjectsByGrade(subjects, 5, subjectsWithContent);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(T_FILTER_SUBJECTS_10K);
    // Sanity: něco musí být viditelné
    expect(visible.length).toBeGreaterThan(0);
    expect(visible.length).toBeLessThan(subjects.length);
  });

  it("filterSubjectsByGrade je deterministický (idempotent)", () => {
    const subjects = makeSubjects(1_000);
    const set = new Set(["predmet-5"]);
    const a = filterSubjectsByGrade(subjects, 5, set).map((s) => s.id);
    const b = filterSubjectsByGrade(subjects, 5, set).map((s) => s.id);
    expect(a).toEqual(b);
  });
});

// ─────────────────────────────────────────────────────────
// 2. Tree building (sidebar)
// ─────────────────────────────────────────────────────────

describe("Scale — sidebar tree build", () => {
  it("10 000 skills → tree struktura < 500 ms", () => {
    const topics = makeTopics(10_000);
    const start = performance.now();

    const byS: Record<string, Record<string, Record<string, typeof topics>>> = {};
    for (const t of topics) {
      if (!byS[t.subject]) byS[t.subject] = {};
      if (!byS[t.subject][t.category]) byS[t.subject][t.category] = {};
      if (!byS[t.subject][t.category][t.topic]) byS[t.subject][t.category][t.topic] = [];
      byS[t.subject][t.category][t.topic].push(t as any);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(T_TREE_BUILD_10K);

    // Sanity: strom má hierarchii
    expect(Object.keys(byS).length).toBe(100);                      // 100 předmětů
    expect(Object.keys(byS["predmet-0"]).length).toBeGreaterThan(0);
  });

  it("Hluboký strom: 10k skills × 100 lookupů přes subject = O(1)", () => {
    const topics = makeTopics(10_000);
    const fromTopics = new Set(topics.map((t) => t.subject.toLowerCase()));

    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      // Simuluje, co dělá `subjects` useMemo
      const dbSubjects = makeSubjects(100);
      dbSubjects.filter((s) => fromTopics.has(s.name.toLowerCase()));
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });
});

// ─────────────────────────────────────────────────────────
// 3. Validator scale
// ─────────────────────────────────────────────────────────

describe("Scale — validateProposalBatch", () => {
  it("10 000 proposalů < 2 sekundy", () => {
    const proposals = makeProposals(10_000);
    const start = performance.now();
    const result = validateProposalBatch(proposals);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(T_VALIDATE_10K);
    // Sanity: všechny synthetické proposaly projdou validací
    const errors = result.perProposal.flatMap((p) => p.errors);
    expect(errors).toEqual([]);
  });

  it("Mixovaná dávka 5k subject + 5k skill < 2 sekundy", () => {
    const proposals: RawProposal[] = [
      ...Array.from({ length: 5_000 }, (_, i) => ({
        type: "subject" as const, action: "create" as const,
        data: { name: `Pr ${i}`, slug: `pr-${i}`, grade_min: 1, grade_max: 9 },
      })),
      ...makeProposals(5_000),
    ];
    const start = performance.now();
    const result = validateProposalBatch(proposals);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(T_VALIDATE_10K);
    expect(result.perProposal).toHaveLength(10_000);
  });

  it("Validátor zachytí 1 vadný proposal mezi 10k validních", () => {
    const proposals = makeProposals(10_000);
    // 5000-tý je vadný
    proposals[5000] = {
      type: "skill", action: "create",
      data: { name: "", code_skill_id: "BAD", topic_slug: "t", input_type: "neexistuje", grade_min: 99 },
    };
    const result = validateProposalBatch(proposals);
    const invalidCount = result.perProposal.filter((p) => !p.valid).length;
    expect(invalidCount).toBe(1);
    expect(result.perProposal[5000].valid).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// 4. Name canonicalization scale
// ─────────────────────────────────────────────────────────

describe("Scale — canonicalSubjectName", () => {
  it("50 000 lookupů < 100 ms (musí být O(1) hash lookup)", () => {
    const slugs = ["matematika", "cestina", "dejepis", "zemeris", "biologie", "unknown-x"];
    const start = performance.now();
    let result = "";
    for (let i = 0; i < 50_000; i++) {
      result = canonicalSubjectName(slugs[i % slugs.length]);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(T_CANONICAL_50K);
    expect(result.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────
// 5. End-to-end: 10k topics + filtering + validation
// ─────────────────────────────────────────────────────────

describe("Scale — E2E pipeline (10k topics → filter → tree → validate)", () => {
  it("kompletní pipeline pro 10k topics + 100 subjects < 3 sekundy", () => {
    const subjects = makeSubjects(100);
    const topics = makeTopics(10_000);
    const proposals = makeProposals(1_000);  // 1k proposals (typická AI dávka je < 100)

    const start = performance.now();

    // 1. Build content set
    const subjectsWithContent = new Set(topics.map((t) => t.subject.toLowerCase()));

    // 2. Filter subjects by grade (každý ročník)
    for (let g = 1; g <= 9; g++) {
      filterSubjectsByGrade(subjects, g, subjectsWithContent);
    }

    // 3. Build tree
    const byS: Record<string, Record<string, Record<string, unknown[]>>> = {};
    for (const t of topics) {
      byS[t.subject] ??= {};
      byS[t.subject][t.category] ??= {};
      byS[t.subject][t.category][t.topic] ??= [];
      byS[t.subject][t.category][t.topic].push(t);
    }

    // 4. Validate proposals
    validateProposalBatch(proposals);

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });
});

// ─────────────────────────────────────────────────────────
// 6. Memory sanity — žádné memory leaky v hot loopech
// ─────────────────────────────────────────────────────────

describe("Scale — memory sanity", () => {
  it("100× filterSubjectsByGrade nezpůsobí exponenciální alokaci", () => {
    const subjects = makeSubjects(1_000);
    const set = new Set(["predmet-5"]);

    // Warm-up + první měření
    filterSubjectsByGrade(subjects, 5, set);
    const t1 = performance.now();
    for (let i = 0; i < 100; i++) filterSubjectsByGrade(subjects, (i % 9) + 1, set);
    const elapsed = performance.now() - t1;

    // 100 volání nad 1000 předmětech musí být lineární — max 200 ms
    expect(elapsed).toBeLessThan(200);
  });
});
