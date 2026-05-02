import { describe, it, expect } from "vitest";
import { dbSkillToTopicMetadata, hasCodeGenerator, type DbSkillRow } from "@/hooks/useDbCurriculum";
import { getTopicById } from "@/lib/contentRegistry";
import type { TopicMetadata } from "@/lib/types";

/**
 * useDbCurriculum pure utility — testy bez supabase.
 *
 * Pokrývá:
 *  - dbSkillToTopicMetadata: DB row → TopicMetadata
 *  - SLUG_TO_SUBJECT mapping (cestina → "čeština", prirodoveda → "přírodověda")
 *  - CATEGORY_NAME_MAP normalizace (ASCII → diakritika)
 *  - hasCodeGenerator: true pro registry, false pro DB-only stub, false při crash
 */

const baseDbRow: DbSkillRow = {
  id: "uuid-1",
  code_skill_id: "test-skill",
  name: "Test Skill",
  brief_description: "Brief desc",
  input_type: "number",
  grade_min: 3,
  grade_max: 5,
  goals: ["Goal 1", "Goal 2"],
  boundaries: ["Boundary 1"],
  keywords: ["kw1", "kw2"],
  help_hint: "Tip",
  help_example: "Example",
  help_common_mistake: "Mistake",
  help_steps: ["Step 1", "Step 2"],
  help_visual_examples: [],
  default_level: 2,
  session_task_count: 8,
  sort_order: 1,
  is_active: true,
  topic_name: "Topic X",
  topic_slug: "topic-x",
  category_name: "Cisla a operace",
  category_slug: "cisla-a-operace",
  subject_name: "matematika",
  subject_slug: "matematika",
};

describe("dbSkillToTopicMetadata — basic mapping", () => {
  it("DB row → TopicMetadata se zachováním všech polí", () => {
    const t = dbSkillToTopicMetadata(baseDbRow);
    expect(t.id).toBe("test-skill");
    expect(t.title).toBe("Test Skill");
    expect(t.briefDescription).toBe("Brief desc");
    expect(t.gradeRange).toEqual([3, 5]);
    expect(t.inputType).toBe("number");
    expect(t.defaultLevel).toBe(2);
    expect(t.sessionTaskCount).toBe(8);
    expect(t.keywords).toEqual(["kw1", "kw2"]);
    expect(t.goals).toEqual(["Goal 1", "Goal 2"]);
    expect(t.boundaries).toEqual(["Boundary 1"]);
  });

  it("helpTemplate je vyplněn z DB polí", () => {
    const t = dbSkillToTopicMetadata(baseDbRow);
    expect(t.helpTemplate.hint).toBe("Tip");
    expect(t.helpTemplate.example).toBe("Example");
    expect(t.helpTemplate.commonMistake).toBe("Mistake");
    expect(t.helpTemplate.steps).toEqual(["Step 1", "Step 2"]);
  });

  it("DB-only flag je nastaven", () => {
    const t = dbSkillToTopicMetadata(baseDbRow) as TopicMetadata & { _dbOnly?: boolean };
    expect(t._dbOnly).toBe(true);
  });

  it("generator vrátí prázdné [] (DB-only no-op)", () => {
    const t = dbSkillToTopicMetadata(baseDbRow);
    expect(t.generator(1)).toEqual([]);
    expect(t.generator(3)).toEqual([]);
  });
});

describe("dbSkillToTopicMetadata — subject slug mapping", () => {
  it.each([
    ["matematika", "matematika"],
    ["cestina", "čeština"],
    ["prvouka", "prvouka"],
    ["prirodoveda", "přírodověda"],
    ["vlastiveda", "vlastivěda"],
  ])("subject_slug '%s' → subject '%s'", (slug, expected) => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, subject_slug: slug });
    expect(t.subject).toBe(expected);
  });

  it("neznámý subject_slug → vrátí slug as-is (fallback)", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, subject_slug: "unknownSubject" });
    expect(t.subject).toBe("unknownSubject");
  });
});

describe("dbSkillToTopicMetadata — category name normalizace", () => {
  it.each([
    ["Cisla a operace", "Čísla a operace"],
    ["Vyjmenovana slova", "Vyjmenovaná slova"],
    ["Diktat", "Diktát"],
    ["Priroda kolem nas", "Příroda kolem nás"],
    ["Clovek a jeho telo", "Člověk a jeho tělo"],
    ["Lide a spolecnost", "Lidé a společnost"],
    ["Orientace v prostoru a case", "Orientace v prostoru a čase"],
  ])("category '%s' → normalized '%s'", (input, expected) => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, category_name: input });
    expect(t.category).toBe(expected);
  });

  it("neznámá category → vrátí as-is", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, category_name: "Custom Category" });
    expect(t.category).toBe("Custom Category");
  });
});

describe("dbSkillToTopicMetadata — null/empty fields", () => {
  it("brief_description=null → empty string", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, brief_description: null });
    expect(t.briefDescription).toBe("");
  });

  it("help_hint=null → empty string", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, help_hint: null });
    expect(t.helpTemplate.hint).toBe("");
  });

  it("non-array keywords → []", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, keywords: null as unknown as string[] });
    expect(t.keywords).toEqual([]);
  });

  it("non-array goals → []", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, goals: null as unknown as string[] });
    expect(t.goals).toEqual([]);
  });

  it("non-array help_steps → []", () => {
    const t = dbSkillToTopicMetadata({ ...baseDbRow, help_steps: null as unknown as string[] });
    expect(t.helpTemplate.steps).toEqual([]);
  });
});

describe("hasCodeGenerator", () => {
  it("DB-only topic (s _dbOnly flag) → false", () => {
    const t = dbSkillToTopicMetadata(baseDbRow);
    expect(hasCodeGenerator(t)).toBe(false);
  });

  it("registry topic s reálným generator → true", () => {
    const t = getTopicById("math-compare-natural-numbers-100");
    expect(t).toBeDefined();
    if (t) expect(hasCodeGenerator(t)).toBe(true);
  });

  it("topic s prázdným generator → false", () => {
    const fakeTopic: TopicMetadata = {
      id: "fake",
      title: "Fake",
      subject: "x",
      category: "y",
      topic: "z",
      briefDescription: "",
      keywords: [],
      goals: [],
      boundaries: [],
      gradeRange: [3, 3],
      inputType: "number",
      generator: () => [],
      helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
    };
    expect(hasCodeGenerator(fakeTopic)).toBe(false);
  });

  it("topic s throwing generator → false (no crash)", () => {
    const crashTopic: TopicMetadata = {
      id: "crash",
      title: "C",
      subject: "x",
      category: "y",
      topic: "z",
      briefDescription: "",
      keywords: [],
      goals: [],
      boundaries: [],
      gradeRange: [3, 3],
      inputType: "number",
      generator: () => { throw new Error("bug"); },
      helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
    };
    expect(hasCodeGenerator(crashTopic)).toBe(false);
  });
});
