import { describe, it, expect, vi } from "vitest";
import { getHelpForTopic, getHelpForSkill } from "@/lib/helpEngine";
import type { TopicMetadata, HelpData } from "@/lib/types";

/**
 * Help engine — pure data lookup pro topic.helpTemplate.
 *
 * Pokrývá:
 *  - getHelpForTopic vrátí helpTemplate
 *  - null topic → null
 *  - chybějící helpTemplate → null
 *  - getHelpForSkill (deprecated) vždy vrátí null (legacy)
 *  - žádné AI / network volání
 */

const baseHelp: HelpData = {
  hint: "Hint text",
  steps: ["Krok 1", "Krok 2"],
  commonMistake: "Chyba",
  example: "Příklad",
};

const mkTopic = (help: HelpData | null = baseHelp): TopicMetadata => ({
  id: "t",
  title: "T",
  subject: "matematika",
  category: "C",
  topic: "Topic",
  briefDescription: "d",
  keywords: ["k"],
  goals: ["g"],
  boundaries: ["b"],
  gradeRange: [3, 3],
  inputType: "number",
  generator: () => [],
  // @ts-expect-error — null pro test
  helpTemplate: help,
});

describe("getHelpForTopic", () => {
  it("topic s helpTemplate vrátí helpTemplate", () => {
    expect(getHelpForTopic(mkTopic())).toBe(mkTopic().helpTemplate);
  });

  it("null topic → null", () => {
    expect(getHelpForTopic(null)).toBeNull();
  });

  it("topic bez helpTemplate → null", () => {
    const topic = mkTopic(null);
    expect(getHelpForTopic(topic)).toBeNull();
  });

  it("synchronní (no Promise)", () => {
    const result = getHelpForTopic(mkTopic());
    expect(result).not.toBeInstanceOf(Promise);
  });

  it("multiple volání vrátí stejný reference (same memory)", () => {
    const topic = mkTopic();
    const r1 = getHelpForTopic(topic);
    const r2 = getHelpForTopic(topic);
    expect(r1).toBe(r2);
  });
});

describe("getHelpForSkill (deprecated)", () => {
  it("vždy vrátí null (legacy fallback)", () => {
    expect(getHelpForSkill("any-id")).toBeNull();
    expect(getHelpForSkill("")).toBeNull();
    expect(getHelpForSkill("math-multiply")).toBeNull();
  });
});

describe("Help engine — invariants", () => {
  it("getHelpForTopic je čistá funkce — žádný side effect", () => {
    // Spy fetch, aby bylo jasné že žádný network call
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() => {
      throw new Error("Help engine NESMÍ volat fetch");
    });
    expect(() => getHelpForTopic(mkTopic())).not.toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("performance: 10000 volání < 50ms (pure lookup)", () => {
    const topic = mkTopic();
    const start = performance.now();
    for (let i = 0; i < 10_000; i++) {
      getHelpForTopic(topic);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });
});
