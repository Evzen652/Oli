import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import type { PracticeTask, HelpData } from "@/lib/types";

describe("Generator validation – all topics × levels 1-3", () => {
  const topics = getAllTopics();

  topics.forEach((topic) => {
    describe(`${topic.id} (${topic.subject}/${topic.category})`, () => {
      [1, 2, 3].forEach((level) => {
        it(`level ${level}: returns valid PracticeTask[]`, () => {
          let batch: PracticeTask[];
          expect(() => {
            batch = topic.generator(level);
          }).not.toThrow();

          batch = topic.generator(level);
          expect(Array.isArray(batch)).toBe(true);
          expect(batch.length).toBeGreaterThan(0);

          batch.forEach((task, i) => {
            expect(task.question, `task[${i}].question empty`).toBeTruthy();
            expect(task.correctAnswer, `task[${i}].correctAnswer empty`).toBeTruthy();
            expect(typeof task.question).toBe("string");
            expect(typeof task.correctAnswer).toBe("string");
            expect(task.question.trim().length).toBeGreaterThan(0);
            expect(task.correctAnswer.trim().length).toBeGreaterThan(0);

            // If select_one, options must exist and correctAnswer must be in options
            if (topic.inputType === "select_one") {
              expect(task.options, `task[${i}] missing options for select_one`).toBeDefined();
              expect(task.options!.length).toBeGreaterThanOrEqual(2);
              expect(task.options, `task[${i}] correctAnswer "${task.correctAnswer}" not in options`).toContain(task.correctAnswer);
            }

            // If drag_order, items must exist
            if (topic.inputType === "drag_order") {
              expect(task.items, `task[${i}] missing items for drag_order`).toBeDefined();
              expect(task.items!.length).toBeGreaterThanOrEqual(2);
            }

            // comparison → correctAnswer must be <, =, or >
            if (topic.inputType === "comparison") {
              expect(["<", "=", ">"], `task[${i}] correctAnswer "${task.correctAnswer}" invalid for comparison`).toContain(task.correctAnswer);
            }

            // fraction → correctAnswer should contain / or be a whole number
            if (topic.inputType === "fraction") {
              const isFracOrWhole = task.correctAnswer.includes("/") || /^\d+$/.test(task.correctAnswer.trim());
              expect(isFracOrWhole, `task[${i}] correctAnswer "${task.correctAnswer}" invalid for fraction`).toBe(true);
            }
          });
        });
      });

      it("helpTemplate has all required fields", () => {
        const h: HelpData = topic.helpTemplate;
        expect(h.hint).toBeTruthy();
        expect(Array.isArray(h.steps)).toBe(true);
        expect(h.steps.length).toBeGreaterThan(0);
        expect(h.commonMistake).toBeTruthy();
        expect(h.example).toBeTruthy();
      });
    });
  });
});
