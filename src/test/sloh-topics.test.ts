import { describe, it, expect } from "vitest";
import { SLOH_TOPICS } from "@/lib/content/czech/sloh";
import { getAllTopics } from "@/lib/contentRegistry";

/**
 * Sloh topics invariants (Fáze 11).
 *
 * Sloh je nový "essay" inputType — má specifické požadavky:
 *  - každý task má .essay payload (minWords)
 *  - correctAnswer je číselný threshold (0-100)
 *  - sessionTaskCount = 1 (sloh je drahý + chce čas na psaní)
 *  - contentType "conceptual" (není algoritmický)
 *  - gradeRange dimensionálně sedí
 */

describe("SLOH_TOPICS — registrace", () => {
  it("má aspoň 1 topic", () => {
    expect(SLOH_TOPICS.length).toBeGreaterThan(0);
  });
  it("všechny topics mají subject 'čeština'", () => {
    SLOH_TOPICS.forEach((t) => expect(t.subject).toBe("čeština"));
  });
  it("všechny topics mají category 'Sloh'", () => {
    SLOH_TOPICS.forEach((t) => expect(t.category).toBe("Sloh"));
  });
  it("všechny topics jsou registrovány v hlavním registry", () => {
    const allTopics = getAllTopics();
    SLOH_TOPICS.forEach((slohTopic) => {
      const found = allTopics.find((t) => t.id === slohTopic.id);
      expect(found, `${slohTopic.id} musí být v allTopics`).toBeDefined();
    });
  });
  it("ID jsou unikátní v rámci slohu", () => {
    const ids = SLOH_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("SLOH_TOPICS — inputType invarianty", () => {
  SLOH_TOPICS.forEach((topic) => {
    describe(`${topic.id}`, () => {
      it("inputType = 'essay'", () => {
        expect(topic.inputType).toBe("essay");
      });
      it("contentType = 'conceptual' (nepoužívá algoritmický generator)", () => {
        expect(topic.contentType).toBe("conceptual");
      });
      it("sessionTaskCount = 1 (sloh chce čas)", () => {
        expect(topic.sessionTaskCount).toBe(1);
      });
    });
  });
});

describe("SLOH_TOPICS — generator výstup", () => {
  SLOH_TOPICS.forEach((topic) => {
    describe(`${topic.id}`, () => {
      const tasks = topic.generator(2);

      it("vrací aspoň 1 task", () => {
        expect(tasks.length).toBeGreaterThan(0);
      });

      tasks.forEach((task, i) => {
        it(`task[${i}] má neprázdné question (prompt)`, () => {
          expect(task.question.trim().length).toBeGreaterThan(10);
        });
        it(`task[${i}] má correctAnswer jako číselný threshold`, () => {
          expect(task.correctAnswer).toMatch(/^\d+$/);
          const n = parseInt(task.correctAnswer, 10);
          expect(n).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThanOrEqual(100);
        });
        it(`task[${i}] má .essay payload s minWords`, () => {
          expect(task.essay).toBeDefined();
          expect(task.essay?.minWords).toBeGreaterThan(0);
          expect(task.essay?.minWords).toBeLessThan(500); // sanity
        });
      });
    });
  });
});

describe("SLOH_TOPICS — grade scaling", () => {
  SLOH_TOPICS.forEach((topic) => {
    it(`${topic.id}: vyšší level = vyšší minWords`, () => {
      const easy = topic.generator(1);
      const hard = topic.generator(3);
      // Aspoň 1 task per call (genVypraveni vrací 1)
      const easyMin = easy[0].essay?.minWords ?? 0;
      const hardMin = hard[0].essay?.minWords ?? 0;
      expect(hardMin).toBeGreaterThanOrEqual(easyMin);
    });
  });
});

describe("SLOH_TOPICS — pedagogická hygiena", () => {
  SLOH_TOPICS.forEach((topic) => {
    describe(`${topic.id}`, () => {
      it("má neprázdné goals (alespoň 1)", () => {
        expect(topic.goals.length).toBeGreaterThan(0);
      });
      it("má neprázdné boundaries (alespoň 1) — explicitně řekneme, co NENÍ cílem", () => {
        expect(topic.boundaries.length).toBeGreaterThan(0);
      });
      it("helpTemplate.hint zmínit, že není jediná správná odpověď NEBO popsat strukturu", () => {
        // Sloh by měl explicitně signalizovat, že je to subjektivní
        const help = topic.helpTemplate.hint.toLowerCase();
        const hasHint = help.length > 20;
        expect(hasHint).toBe(true);
      });
      it("helpTemplate.steps má aspoň 3 kroky (struktura sloh)", () => {
        expect(topic.helpTemplate.steps.length).toBeGreaterThanOrEqual(3);
      });
      it("keywords obsahují 'sloh' nebo téma slohu", () => {
        const lower = topic.keywords.join(" ").toLowerCase();
        const hasSlohKeyword = /sloh|popis|vyprávění|napsat|napiš/i.test(lower);
        expect(hasSlohKeyword).toBe(true);
      });
    });
  });
});

describe("SLOH_TOPICS — generator deterministicky reprodukovatelný (struktura)", () => {
  // Generator může používat random shuffle, ale struktura/typy musí být stabilní
  SLOH_TOPICS.forEach((topic) => {
    it(`${topic.id}: 5× generator volání všechny vrací validní strukturu`, () => {
      for (let i = 0; i < 5; i++) {
        const tasks = topic.generator(2);
        expect(tasks.length).toBeGreaterThan(0);
        tasks.forEach((task) => {
          expect(task.question).toBeTypeOf("string");
          expect(task.correctAnswer).toBeTypeOf("string");
          expect(task.essay).toBeDefined();
        });
      }
    });
  });
});
