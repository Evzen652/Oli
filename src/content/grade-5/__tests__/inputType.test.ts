/**
 * Technické testy pro grade-5: inputType konzistence.
 * Každý topic musí mít generátor produkující tasks konzistentní s inputType.
 */

import { describe, it, expect } from "vitest";
import { GRADE_5_TOPICS } from "../index";

describe("grade-5 inputType konzistence", () => {
  it("každý topic má validní inputType", () => {
    const VALID_TYPES = [
      "select_one", "fill_blank", "true_false", "drag_order",
      "match_pairs", "multi_select", "text", "short_answer",
    ];
    for (const topic of GRADE_5_TOPICS) {
      expect(
        VALID_TYPES,
        `${topic.id}: neznámý inputType "${topic.inputType}"`,
      ).toContain(topic.inputType);
    }
  });

  it("select_one generator vrací tasks s options (level 1)", () => {
    for (const topic of GRADE_5_TOPICS) {
      if (topic.inputType !== "select_one") continue;
      const tasks = topic.generator(1);
      expect(tasks.length, `${topic.id}: generator vrátil 0 tasks`).toBeGreaterThan(0);
      for (const task of tasks.slice(0, 5)) {
        expect(task.options, `${topic.id}: task nemá options pro select_one`).toBeDefined();
        expect(task.options!.length, `${topic.id}: task má méně než 2 options`).toBeGreaterThanOrEqual(2);
        expect(
          task.options,
          `${topic.id}: correctAnswer "${task.correctAnswer}" není v options`,
        ).toContain(task.correctAnswer);
      }
    }
  });

  it("fill_blank generator vrací tasks s blanks (level 1)", () => {
    for (const topic of GRADE_5_TOPICS) {
      if (topic.inputType !== "fill_blank") continue;
      const tasks = topic.generator(1);
      expect(tasks.length, `${topic.id}: generator vrátil 0 tasks`).toBeGreaterThan(0);
      for (const task of tasks.slice(0, 5)) {
        const hasBlanks = task.blanks && task.blanks.length > 0;
        const hasUnderscore = task.question.includes("___");
        expect(
          hasBlanks || hasUnderscore,
          `${topic.id}: fill_blank task nemá blanks[] ani "___" v otázce`,
        ).toBe(true);
      }
    }
  });

  it("match_pairs generator vrací tasks s pairs (level 1)", () => {
    for (const topic of GRADE_5_TOPICS) {
      if (topic.inputType !== "match_pairs") continue;
      const tasks = topic.generator(1);
      expect(tasks.length, `${topic.id}: generator vrátil 0 tasks`).toBeGreaterThan(0);
      for (const task of tasks.slice(0, 5)) {
        expect(task.pairs, `${topic.id}: match_pairs task nemá pairs[]`).toBeDefined();
        expect(task.pairs!.length, `${topic.id}: match_pairs task má méně než 2 páry`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("drag_order generator vrací tasks s items (level 1)", () => {
    for (const topic of GRADE_5_TOPICS) {
      if (topic.inputType !== "drag_order") continue;
      const tasks = topic.generator(1);
      expect(tasks.length, `${topic.id}: generator vrátil 0 tasks`).toBeGreaterThan(0);
      for (const task of tasks.slice(0, 5)) {
        expect(task.items, `${topic.id}: drag_order task nemá items[]`).toBeDefined();
        expect(task.items!.length, `${topic.id}: drag_order task má méně než 2 items`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("každý topic má vyplněný helpTemplate", () => {
    for (const topic of GRADE_5_TOPICS) {
      expect(topic.helpTemplate.hint.trim().length, `${topic.id}: prázdný helpTemplate.hint`).toBeGreaterThan(0);
      expect(Array.isArray(topic.helpTemplate.steps), `${topic.id}: helpTemplate.steps není pole`).toBe(true);
    }
  });

  it("každý topic má vyplněný rvpNodeId", () => {
    for (const topic of GRADE_5_TOPICS) {
      expect(
        topic.rvpNodeId,
        `${topic.id}: chybí rvpNodeId`,
      ).toBeTruthy();
    }
  });
});
