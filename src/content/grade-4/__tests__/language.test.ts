/**
 * Lint test pro grade-4 dětský jazyk.
 *
 * Hard pravidla:
 *  - briefDescription max 12 slov, 1 věta
 *  - briefDescription nesmí obsahovat 3. osobu ("Žák...")
 *  - briefDescription nesmí obsahovat zakázané formální termíny (4. ročník)
 *  - studentTitle (pokud je) max 4 slova
 *
 * Volné konvence dokumentované v `grade-4/README.md` — tone-of-voice.
 */

import { describe, it, expect } from "vitest";
import { GRADE_4_TOPICS } from "../index";

// 4. ročník (9-10 let) — slova která dítě v tomto věku ještě nezná dobře,
// nebo pedagogický žargon dospělých. Lepší použít konkrétní obraty.
const FORBIDDEN_GRADE_4_TERMS = [
  /\baritmetick(ý|á|é|ého)\b/i,           // → "průměr"
  /\bvícecifern(ý|á|é|ého|ým|ymi)\b/i,    // → "větší číslo"
  /\bjednocifern(ý|á|é|ého|ým)\b/i,        // → použij konkrétní čísla
  /\bdvoucifern(ý|á|é|ého|ým)\b/i,
  /\bdesetitisíc(e|i|ů)\b/i,                // → "velká čísla"
  /\binterpretu(je|jí|ješ)\b/i,             // → "přečteš", "pochopíš"
  /\bzaznamenáv(á|ají|áš)\b/i,
  /\baplikuj(e|í|eš)\b/i,                   // → "použiješ"
  /\bpřirozen(á|é|ého|ými) čísl/i,         // → "čísla"
];

const STUDENT_PRONOUN_3RD = /^Žák\s/i; // 1. slovo "Žák"

describe("grade-4 jazykové konvence", () => {
  describe("briefDescription", () => {
    it("má max 12 slov", () => {
      for (const topic of GRADE_4_TOPICS) {
        const wordCount = topic.briefDescription.trim().split(/\s+/).length;
        expect(wordCount, `${topic.id}: "${topic.briefDescription}" má ${wordCount} slov`).toBeLessThanOrEqual(12);
      }
    });

    it("není ve 3. osobě (nezačíná 'Žák')", () => {
      for (const topic of GRADE_4_TOPICS) {
        expect(topic.briefDescription, `${topic.id}: musí být 2. osoba ("Naučíš se", "Spočítáš"...)`)
          .not.toMatch(STUDENT_PRONOUN_3RD);
      }
    });

    it("neobsahuje zakázané formální termíny", () => {
      for (const topic of GRADE_4_TOPICS) {
        for (const pattern of FORBIDDEN_GRADE_4_TERMS) {
          expect(
            topic.briefDescription,
            `${topic.id} obsahuje zakázaný termín pro 4.tř (${pattern}): "${topic.briefDescription}"`,
          ).not.toMatch(pattern);
        }
      }
    });

    it("není prázdný", () => {
      for (const topic of GRADE_4_TOPICS) {
        expect(topic.briefDescription.trim().length, `${topic.id} má prázdný briefDescription`).toBeGreaterThan(0);
      }
    });
  });

  describe("studentTitle", () => {
    it("má max 4 slova (pokud je vyplněn)", () => {
      for (const topic of GRADE_4_TOPICS) {
        if (!topic.studentTitle) continue;
        const wordCount = topic.studentTitle.trim().split(/\s+/).length;
        expect(wordCount, `${topic.id}: studentTitle "${topic.studentTitle}" má ${wordCount} slov`)
          .toBeLessThanOrEqual(4);
      }
    });
  });
});
