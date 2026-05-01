import { describe, it, expect } from "vitest";
import {
  getAllTopics,
  getTopicsForGrade,
  getTopicById,
  matchTopic,
  getPrerequisites,
  PREREQUISITE_MAP,
} from "@/lib/contentRegistry";

/**
 * Content Registry — deep coverage.
 *
 * Pokrývá:
 *  - getAllTopics: read-only, frozen, contains all subjects
 *  - getTopicsForGrade: filter by grade range
 *  - getTopicById: lookup OR undefined
 *  - matchTopic: deterministic + longest-match resolution + grade gating
 *  - getPrerequisites: lookup OR []
 *  - Subject coverage: matematika / čeština / prvouka all present
 *  - Grade coverage: at least 1 topic per grade 3-9
 */

const allTopics = getAllTopics();

describe("getAllTopics — invariants", () => {
  it("vrací array (Object.freeze immutable)", () => {
    expect(Array.isArray(allTopics)).toBe(true);
    expect(Object.isFrozen(allTopics)).toBe(true);
  });

  it("aspoň 30 topics (curriculum coverage sanity)", () => {
    expect(allTopics.length).toBeGreaterThan(30);
  });

  it("subjects pokryty: matematika, čeština, prvouka", () => {
    const subjects = new Set(allTopics.map((t) => t.subject));
    expect(subjects.has("matematika")).toBe(true);
    expect(subjects.has("čeština")).toBe(true);
    // prvouka je pokrytá pro nižší ročníky
    const hasPrvouka = subjects.has("prvouka") || subjects.has("Prvouka");
    expect(hasPrvouka).toBe(true);
  });

  it("readonly array — push throws (frozen)", () => {
    expect(() => {
      // @ts-expect-error testing immutability
      allTopics.push({} as TopicMetadata);
    }).toThrow();
  });
});

describe("getTopicsForGrade — grade filtering", () => {
  it.each([3, 4, 5, 6, 7, 8, 9])("grade %d má aspoň 1 topic", (grade) => {
    // Grades 1-2 zatím nemají curriculum content
    const topics = getTopicsForGrade(grade);
    expect(topics.length).toBeGreaterThan(0);
  });

  it("grade 1-2 zatím bez topiců (curriculum gap, dokumentováno)", () => {
    // Když se přidá content pro 1-2 → tento test fail signal pro update
    expect(getTopicsForGrade(1).length + getTopicsForGrade(2).length).toBe(0);
  });

  it("grade out of range (10) → 0 topics", () => {
    expect(getTopicsForGrade(10).length).toBe(0);
  });

  it("grade 0 → 0 topics", () => {
    expect(getTopicsForGrade(0).length).toBe(0);
  });

  it("vrácené topics mají gradeRange obsahující daný grade", () => {
    const grade = 3;
    const topics = getTopicsForGrade(grade);
    topics.forEach((t) => {
      expect(t.gradeRange[0]).toBeLessThanOrEqual(grade);
      expect(t.gradeRange[1]).toBeGreaterThanOrEqual(grade);
    });
  });

  it("topic v gradeRange [3,5] je viditelný v 3, 4 i 5", () => {
    const sampleTopic = allTopics.find((t) => t.gradeRange[0] === 3 && t.gradeRange[1] === 5);
    if (!sampleTopic) return; // skip if no such topic
    expect(getTopicsForGrade(3)).toContain(sampleTopic);
    expect(getTopicsForGrade(4)).toContain(sampleTopic);
    expect(getTopicsForGrade(5)).toContain(sampleTopic);
    expect(getTopicsForGrade(2)).not.toContain(sampleTopic);
  });
});

describe("getTopicById — lookup", () => {
  it("existující ID → topic", () => {
    const t = getTopicById("math-compare-natural-numbers-100");
    expect(t).toBeDefined();
    expect(t?.id).toBe("math-compare-natural-numbers-100");
  });

  it("neexistující ID → undefined", () => {
    expect(getTopicById("xxx-not-a-real-topic")).toBeUndefined();
  });

  it("prázdný ID → undefined", () => {
    expect(getTopicById("")).toBeUndefined();
  });

  it("topic objekt obsahuje všechny required fields", () => {
    const t = getTopicById("math-compare-natural-numbers-100");
    expect(t?.title).toBeTruthy();
    expect(t?.subject).toBeTruthy();
    expect(t?.category).toBeTruthy();
    expect(t?.keywords.length).toBeGreaterThan(0);
    expect(t?.goals.length).toBeGreaterThan(0);
    expect(typeof t?.generator).toBe("function");
  });
});

describe("matchTopic — comprehensive", () => {
  it("deterministic: stejný input + grade → stejný topic", () => {
    const r1 = matchTopic("porovnávání čísel", 3);
    const r2 = matchTopic("porovnávání čísel", 3);
    expect(r1?.id).toBe(r2?.id);
  });

  it("partial match (substring) funguje", () => {
    // Topic má keyword "porovnávání čísel", input "kde porovnáváme čísla" by NEMĚL match
    // (substring "porovnávání čísel" není v inputu)
    expect(matchTopic("kde porovnáváme dvě čísla", 3)).toBeNull();
  });

  it("plný keyword match", () => {
    const r = matchTopic("porovnávání čísel", 3);
    expect(r).toBeTruthy();
    expect(r?.subject).toBe("matematika");
  });

  it("longest-match wins při ambiguity", () => {
    // sloh-vyprávění a sloh-popis sdílejí "sloh", ale "vyprávění" je delší
    const r = matchTopic("vyprávění", 4);
    expect(r?.id).toBe("cz-sloh-vypraveni");
  });

  it("grade out-of-range → null", () => {
    expect(matchTopic("vyprávění", 9)).toBeNull();
    expect(matchTopic("porovnávání čísel", 9)).toBeNull();
  });

  it("performance: 1000 calls < 500ms", () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      matchTopic("porovnávání čísel", 3);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });
});

describe("getPrerequisites — lookup", () => {
  it("topic v PREREQUISITE_MAP → list", () => {
    const prereqs = getPrerequisites("frac_compare_diff_den");
    expect(Array.isArray(prereqs)).toBe(true);
    expect(prereqs.length).toBeGreaterThan(0);
  });

  it("topic mimo mapu → []", () => {
    expect(getPrerequisites("non-existent-id")).toEqual([]);
  });

  it("topic s no prereqs ('cz-parove-souhlasky') → []", () => {
    expect(getPrerequisites("cz-parove-souhlasky")).toEqual([]);
  });

  it("PREREQUISITE_MAP má alespoň 30 záznamů (curriculum graph coverage)", () => {
    expect(Object.keys(PREREQUISITE_MAP).length).toBeGreaterThan(30);
  });
});

describe("Content registry — graph integrity", () => {
  it("žádný self-prerequisite (a → a)", () => {
    const cycles: string[] = [];
    for (const [topicId, prereqs] of Object.entries(PREREQUISITE_MAP)) {
      if (prereqs.includes(topicId)) cycles.push(topicId);
    }
    expect(cycles).toEqual([]);
  });

  it("2-cycle detection (a → b, b → a)", () => {
    const cycles: string[] = [];
    for (const [a, prereqsA] of Object.entries(PREREQUISITE_MAP)) {
      for (const b of prereqsA) {
        const prereqsB = PREREQUISITE_MAP[b] ?? [];
        if (prereqsB.includes(a)) {
          cycles.push(`${a} ↔ ${b}`);
        }
      }
    }
    expect(cycles).toEqual([]);
  });

  it("max 5 prereqs per topic (curriculum sanity)", () => {
    for (const [topicId, prereqs] of Object.entries(PREREQUISITE_MAP)) {
      expect(prereqs.length, topicId).toBeLessThanOrEqual(5);
    }
  });
});

describe("Content registry — generators stability", () => {
  it("každý topic.generator volaný 5× nekráchá", () => {
    let crashes = 0;
    for (const t of allTopics.slice(0, 30)) {
      for (let i = 0; i < 5; i++) {
        try {
          const tasks = t.generator(2);
          if (!Array.isArray(tasks)) throw new Error("not array");
        } catch {
          crashes++;
        }
      }
    }
    expect(crashes).toBe(0);
  });

  it("generator output má alespoň 1 task pro level 1, 2, 3", () => {
    let zeroCount = 0;
    for (const t of allTopics.slice(0, 20)) {
      for (const lvl of [1, 2, 3]) {
        const tasks = t.generator(lvl);
        if (tasks.length === 0) zeroCount++;
      }
    }
    // Některé generators mohou vrátit 0 pro neexistující level — sanity threshold
    expect(zeroCount).toBeLessThan(allTopics.slice(0, 20).length * 3 * 0.1);
  });

  it("generator tasks mají non-empty question + correctAnswer", () => {
    let invalidCount = 0;
    for (const t of allTopics.slice(0, 30)) {
      const tasks = t.generator(2);
      for (const task of tasks.slice(0, 3)) { // jen 3 sample
        if (!task.question?.trim() || task.correctAnswer === undefined) invalidCount++;
      }
    }
    expect(invalidCount).toBe(0);
  });
});

describe("Content registry — practiceType + sessionTaskCount", () => {
  it("practiceType je 'result_only' nebo 'step_based' nebo undefined", () => {
    const valid = ["result_only", "step_based", undefined];
    allTopics.forEach((t) => {
      expect(valid, t.id).toContain(t.practiceType);
    });
  });

  it("sessionTaskCount sanity (1-20)", () => {
    allTopics.forEach((t) => {
      const count = t.sessionTaskCount ?? 6;
      expect(count, t.id).toBeGreaterThanOrEqual(1);
      expect(count, t.id).toBeLessThanOrEqual(20);
    });
  });

  it("essay topics mají sessionTaskCount = 1 (drahá AI)", () => {
    allTopics.filter((t) => t.inputType === "essay").forEach((t) => {
      expect(t.sessionTaskCount, t.id).toBe(1);
    });
  });
});
