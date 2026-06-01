/**
 * Lint test pro grade-5 dětský jazyk.
 * Stejná pravidla jako grade-4, rozšířený slovník pro 5. ročník (10-11 let).
 */

import { describe, it, expect } from "vitest";
import { GRADE_5_TOPICS } from "../index";

// 5. ročník (10-11 let) — zakázaný pedagogický žargon
const FORBIDDEN_GRADE_5_TERMS = [
  /\baritmetick(ý|á|é|ého)\b/i,
  /\bvícecifern(ý|á|é|ého|ým|ými)\b/i,
  /\bjednocifern(ý|á|é|ého|ým)\b/i,
  /\binterpretu(je|jí|ješ)\b/i,
  /\bzaznamenáv(á|ají|áš)\b/i,
  /\baplikuj(e|í|eš)\b/i,
  /\bpřirozen(á|é|ého|ými) čísl/i,
];

const STUDENT_PRONOUN_3RD = /^Žák\s/i;

describe("grade-5 jazykové konvence", () => {
  describe("briefDescription", () => {
    it("má max 12 slov", () => {
      for (const topic of GRADE_5_TOPICS) {
        const wordCount = topic.briefDescription.trim().split(/\s+/).length;
        expect(
          wordCount,
          `${topic.id}: "${topic.briefDescription}" má ${wordCount} slov`,
        ).toBeLessThanOrEqual(12);
      }
    });

    it("není ve 3. osobě (nezačíná 'Žák')", () => {
      for (const topic of GRADE_5_TOPICS) {
        expect(
          topic.briefDescription,
          `${topic.id}: musí být 2. osoba ("Naučíš se", "Poznáš"...)`,
        ).not.toMatch(STUDENT_PRONOUN_3RD);
      }
    });

    it("neobsahuje zakázané formální termíny", () => {
      for (const topic of GRADE_5_TOPICS) {
        for (const pattern of FORBIDDEN_GRADE_5_TERMS) {
          expect(
            topic.briefDescription,
            `${topic.id} obsahuje zakázaný termín (${pattern}): "${topic.briefDescription}"`,
          ).not.toMatch(pattern);
        }
      }
    });

    it("není prázdný", () => {
      for (const topic of GRADE_5_TOPICS) {
        expect(
          topic.briefDescription.trim().length,
          `${topic.id} má prázdný briefDescription`,
        ).toBeGreaterThan(0);
      }
    });
  });

  describe("studentTitle", () => {
    it("má max 4 slova (pokud je vyplněn)", () => {
      for (const topic of GRADE_5_TOPICS) {
        if (!topic.studentTitle) continue;
        const wordCount = topic.studentTitle.trim().split(/\s+/).length;
        expect(
          wordCount,
          `${topic.id}: studentTitle "${topic.studentTitle}" má ${wordCount} slov`,
        ).toBeLessThanOrEqual(4);
      }
    });
  });
});
