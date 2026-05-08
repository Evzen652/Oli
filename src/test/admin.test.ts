import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

/**
 * Admin testy — pokrývá:
 *  - useAdminCurriculum: fetch hierarchie (subjects → categories → topics)
 *  - runOfflineAudit: čistý audit cvičení bez sítě
 *  - useParentName: fetch názvu z curriculum tabulky
 */

// ─────────────────────────────────────────────────────────
// Supabase mock
// ─────────────────────────────────────────────────────────

const supabaseMock = {
  auth: { getUser: vi.fn() },
  from: vi.fn(),
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: supabaseMock,
}));

/** Postaví Supabase query chain vracející daná data. */
function mkChain(returnValue: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {};
  ["select", "eq", "order", "in", "single", "maybeSingle"].forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain);
  });
  // then() pro Promise.all i await
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(returnValue).then(resolve);
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────
// useAdminCurriculum
// ─────────────────────────────────────────────────────────

describe("useAdminCurriculum — happy path", () => {
  const SUBJECTS = [{ id: "s1", name: "Matematika", slug: "matematika", sort_order: 1 }];
  const CATEGORIES_RAW = [
    { id: "c1", name: "Čísla", slug: "cisla", subject_id: "s1", sort_order: 1,
      description: null, fun_fact: null, curriculum_subjects: { name: "Matematika" } },
  ];
  const TOPICS_RAW = [
    { id: "t1", name: "Sčítání", slug: "scitani", category_id: "c1", sort_order: 1,
      description: null,
      curriculum_categories: { name: "Čísla", curriculum_subjects: { name: "Matematika" } } },
  ];

  beforeEach(() => {
    // Tři po sobě jdoucí volání from() vrátí příslušná data
    supabaseMock.from
      .mockReturnValueOnce(mkChain({ data: SUBJECTS }))
      .mockReturnValueOnce(mkChain({ data: CATEGORIES_RAW }))
      .mockReturnValueOnce(mkChain({ data: TOPICS_RAW }));
  });

  it("vrátí subjects, categories a topics po načtení", async () => {
    const { useAdminCurriculum } = await import("@/hooks/useAdminCurriculum");
    const { result } = renderHook(() => useAdminCurriculum());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.subjects).toHaveLength(1);
    expect(result.current.subjects[0].name).toBe("Matematika");

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0].subject_name).toBe("Matematika");

    expect(result.current.topics).toHaveLength(1);
    expect(result.current.topics[0].category_name).toBe("Čísla");
    expect(result.current.topics[0].subject_name).toBe("Matematika");
  });

  it("loading začíná jako true a po resolve je false", async () => {
    const { useAdminCurriculum } = await import("@/hooks/useAdminCurriculum");
    const { result } = renderHook(() => useAdminCurriculum());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe("useAdminCurriculum — prázdná DB", () => {
  beforeEach(() => {
    supabaseMock.from
      .mockReturnValueOnce(mkChain({ data: [] }))
      .mockReturnValueOnce(mkChain({ data: [] }))
      .mockReturnValueOnce(mkChain({ data: [] }));
  });

  it("vrátí prázdné pole při žádných datech", async () => {
    const { useAdminCurriculum } = await import("@/hooks/useAdminCurriculum");
    const { result } = renderHook(() => useAdminCurriculum());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.subjects).toEqual([]);
    expect(result.current.categories).toEqual([]);
    expect(result.current.topics).toEqual([]);
  });
});

describe("useAdminCurriculum — DB error", () => {
  beforeEach(() => {
    supabaseMock.from.mockImplementation(() => {
      throw new Error("connection refused");
    });
  });

  it("při chybě loading=false a data zůstanou prázdná", async () => {
    const { useAdminCurriculum } = await import("@/hooks/useAdminCurriculum");
    const { result } = renderHook(() => useAdminCurriculum());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.subjects).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────
// runOfflineAudit
// ─────────────────────────────────────────────────────────

import type { TopicMetadata } from "@/lib/types";
import { runOfflineAudit } from "@/lib/contentAudit";

/** Pomocník: vytvoří minimální validní topic. */
function makeTopic(overrides: Partial<TopicMetadata> = {}): TopicMetadata {
  return {
    id: "test-topic",
    title: "Test téma",
    subject: "matematika",
    category: "Čísla",
    gradeRange: [1, 3],
    inputType: "number",
    generator: (_level) => [
      { question: "Kolik je 2+2?", correctAnswer: "4", hints: [] },
    ],
    helpTemplate: {
      title: "Jak sčítat",
      visualExamples: [],
    },
    keywords: ["sčítání"],
    ...overrides,
  } as unknown as TopicMetadata;
}

describe("runOfflineAudit — čistý topic", () => {
  it("topic bez chyb → 0 issues, passingPct=100", () => {
    const report = runOfflineAudit([makeTopic()]);
    expect(report.issues).toHaveLength(0);
    expect(report.passingPct).toBe(100);
    expect(report.totalTopicsChecked).toBe(1);
  });

  it("více čistých topics → okCount = totalTasksChecked", () => {
    const topics = [makeTopic({ id: "t1" }), makeTopic({ id: "t2" })];
    const report = runOfflineAudit(topics);
    expect(report.okCount).toBe(report.totalTasksChecked);
    expect(report.issues).toHaveLength(0);
  });
});

describe("runOfflineAudit — format chyby", () => {
  it("topic s prázdnou otázkou → issue kategorie 'format'", () => {
    const topic = makeTopic({
      generator: () => [{ question: "", correctAnswer: "4", hints: [] }],
    });
    const report = runOfflineAudit([topic]);
    const formatIssues = report.issues.filter((i) => i.category === "format");
    expect(formatIssues.length).toBeGreaterThan(0);
  });

  it("topic bez correctAnswer → issue kategorie 'format'", () => {
    const topic = makeTopic({
      generator: () => [{ question: "Kolik je 2+2?", correctAnswer: null as any, hints: [] }],
    });
    const report = runOfflineAudit([topic]);
    const formatIssues = report.issues.filter((i) => i.category === "format");
    expect(formatIssues.length).toBeGreaterThan(0);
  });

  it("generátor, který crashne → topic se zaznamená jako chyba, nepřeruší ostatní", () => {
    const badTopic = makeTopic({
      id: "bad",
      generator: () => { throw new Error("boom"); },
    });
    const goodTopic = makeTopic({ id: "good" });
    const report = runOfflineAudit([badTopic, goodTopic]);
    // bad topic má format issue (crash), good projde
    expect(report.issues.some((i) => i.topicId === "bad")).toBe(true);
    expect(report.totalTopicsChecked).toBe(1); // jen good se počítá
  });
});

describe("runOfflineAudit — filtrace", () => {
  const mathTopic = makeTopic({ id: "math", subject: "matematika", gradeRange: [1, 3] });
  const czTopic = makeTopic({ id: "cz", subject: "čeština", gradeRange: [1, 3] });
  const highTopic = makeTopic({ id: "high", subject: "matematika", gradeRange: [7, 9] });

  it("subjectFilter omezí audit jen na daný předmět", () => {
    const report = runOfflineAudit([mathTopic, czTopic], { subjectFilter: ["matematika"] });
    expect(report.totalTopicsChecked).toBe(1);
  });

  it("gradeFilter omezí audit na ročník v rozsahu", () => {
    const report = runOfflineAudit([mathTopic, highTopic], { gradeFilter: 2 });
    expect(report.totalTopicsChecked).toBe(1);
  });

  it("prázdný subjectFilter → projdou všechny", () => {
    const report = runOfflineAudit([mathTopic, czTopic], { subjectFilter: [] });
    expect(report.totalTopicsChecked).toBe(2);
  });
});

describe("runOfflineAudit — maxSamplesPerTopic", () => {
  it("omezí počet testovaných úloh na maxSamplesPerTopic", () => {
    const topic = makeTopic({
      generator: () => Array.from({ length: 20 }, (_, i) => ({
        question: `Otázka ${i}`,
        correctAnswer: "4",
        hints: [],
      })),
    });
    const report = runOfflineAudit([topic], { maxSamplesPerTopic: 3 });
    expect(report.totalTasksChecked).toBeLessThanOrEqual(3);
  });
});

describe("runOfflineAudit — byCategory histogram", () => {
  it("byCategory obsahuje všechny 4 kategorie", () => {
    const report = runOfflineAudit([makeTopic()]);
    expect(Object.keys(report.byCategory)).toEqual(
      expect.arrayContaining(["format", "self_validation", "hint_leak", "boundary"]),
    );
  });

  it("byTopic mapuje topicId → počet issues", () => {
    const topic = makeTopic({
      generator: () => [{ question: "", correctAnswer: "4", hints: [] }],
    });
    const report = runOfflineAudit([topic]);
    expect(report.byTopic["test-topic"]).toBeGreaterThan(0);
  });
});

describe("runOfflineAudit — prázdný seznam", () => {
  it("prázdný vstup → 0 checked, passingPct=0", () => {
    const report = runOfflineAudit([]);
    expect(report.totalTopicsChecked).toBe(0);
    expect(report.totalTasksChecked).toBe(0);
    expect(report.passingPct).toBe(0);
    expect(report.issues).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────
// useParentName (AdminLayout)
// ─────────────────────────────────────────────────────────

describe("useParentName", () => {
  it("id=undefined → vrátí null, nezavolá supabase", async () => {
    const { useParentName } = await import("@/components/AdminLayout");
    const { result } = renderHook(() => useParentName("curriculum_subjects", undefined));
    await waitFor(() => expect(result.current).toBeNull());
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("s platným id → vrátí name z DB", async () => {
    const chain = mkChain({ data: { name: "Matematika" } });
    supabaseMock.from.mockReturnValue(chain);

    const { useParentName } = await import("@/components/AdminLayout");
    const { result } = renderHook(() =>
      useParentName("curriculum_subjects", "s1"),
    );
    await waitFor(() => expect(result.current).toBe("Matematika"));
  });

  it("DB vrátí null → name zůstane null", async () => {
    const chain = mkChain({ data: null });
    supabaseMock.from.mockReturnValue(chain);

    const { useParentName } = await import("@/components/AdminLayout");
    const { result } = renderHook(() =>
      useParentName("curriculum_subjects", "neexistuje"),
    );
    // Čekáme krátce — name se nemá změnit
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current).toBeNull();
  });
});
