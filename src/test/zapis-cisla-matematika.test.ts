import { describe, it, expect } from "vitest";
import { PISEMNE_SCITANI_ODCITANI } from "@/content/grade-4/matematika/pisemneScitaniAOdcitaniVicecifernychCisel";
import { PISEMNE_NASOBENI } from "@/content/grade-4/matematika/pisemneNasobeniJednoADvoucifernymCinitelem";
import { numericToleranceValidator, resolveTaskValidation, validateAnswer } from "@/lib/validators";
import { getTargetedFeedback } from "@/components/CheckFeedbackCard";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

/**
 * ZÁPIS ČÍSLA V MATEMATICE (2026-09-30).
 *
 * Písemné sčítání/odčítání a písemné násobení ve 4. ročníku se nevybírají
 * ze čtyř možností — dítě výsledek píše. Test hlídá tři věci, na kterých
 * to stojí:
 *   1. validátor uzná jen správné číslo (relativní tolerance 0,1 % dřív
 *      uznala „4 318" místo „4 320");
 *   2. úloha nesmí nést `options`, jinak `PracticeInputRouter` ukáže
 *      tlačítka i u `inputType: "number"`;
 *   3. diagnostika typických chyb zůstává — `optionFeedback` se najde
 *      podle toho, CO DÍTĚ NAPSALO.
 * Klíč navíc ověřuje nezávislý řešič, který čte čísla ze znění úlohy.
 */

const TEMATA: TopicMetadata[] = [PISEMNE_SCITANI_ODCITANI[0], PISEMNE_NASOBENI[0]];

describe("numericToleranceValidator — uzná jen správné číslo", () => {
  it("nepřijme výsledek blízko klíče (regrese: relativní tolerance 0,1 %)", () => {
    expect(numericToleranceValidator.validate("4318", "4320").correct).toBe(false);
    expect(numericToleranceValidator.validate("43180", "43200").correct).toBe(false);
    expect(numericToleranceValidator.validate("847230", "847231").correct).toBe(false);
  });

  it("přijme správné číslo i s mezerou mezi řády", () => {
    expect(numericToleranceValidator.validate("4320", "4320").correct).toBe(true);
    expect(numericToleranceValidator.validate("4 320", "4320").correct).toBe(true);
    expect(numericToleranceValidator.validate("4 320", "4320").correct).toBe(true);
  });

  it("desetinná čárka i tečka; absolutní tolerance 0,001 zůstává", () => {
    expect(numericToleranceValidator.validate("3,14", "3.14").correct).toBe(true);
    expect(numericToleranceValidator.validate("0.3334", "0.333").correct).toBe(true);
    expect(numericToleranceValidator.validate("0,4", "0,333").correct).toBe(false);
  });

  it("nečíslo pozná jako nečíslo", () => {
    expect(numericToleranceValidator.validate("nevím", "12").errorType).toBe("not_a_number");
  });
});

/** Projde odpověď celou cestou, kterou jde v sezení (resolve → validate). */
function zkontroluj(topic: TopicMetadata, task: PracticeTask, odpoved: string): boolean {
  const { expected, validatorId } = resolveTaskValidation(task);
  return validateAnswer(odpoved, expected, { validatorId, inputType: topic.inputType }).correct;
}

/** Nezávislý řešič: čte čísla ze ZNĚNÍ úlohy, klíč z generátoru nebere. */
function reseni(question: string): number | null {
  const m = question.match(/^([\d  ]+?)\s*([+−×])\s*([\d  ]+?)\s*=\s*\?$/u);
  if (!m) return null;
  const n = (s: string) => Number(s.replace(/[\s ]/g, ""));
  const a = n(m[1]);
  const b = n(m[3]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return m[2] === "+" ? a + b : m[2] === "−" ? a - b : a * b;
}

describe.each(TEMATA.map((t) => [t.id, t] as const))("Zápis čísla — %s", (_id, topic) => {
  it("téma je na zápis čísla, ne na výběr", () => {
    expect(topic.inputType).toBe("number");
  });

  describe.each([1, 2, 3])("L%i", (level) => {
    const tasks = topic.generator(level);

    it("úloha nenese options (jinak by router ukázal tlačítka)", () => {
      expect(tasks.length).toBeGreaterThanOrEqual(12);
      for (const t of tasks) {
        expect(t.options, t.question).toBeUndefined();
        expect(t.items, t.question).toBeUndefined();
        expect(t.blanks, t.question).toBeUndefined();
      }
    });

    it("klíč je čisté celé číslo — jinak ho offline audit zahodí", () => {
      for (const t of tasks) expect(t.correctAnswer, t.question).toMatch(/^\d+$/);
    });

    it("nápovědy a postup zůstaly kompletní", () => {
      for (const t of tasks) {
        expect(t.hints, t.question).toHaveLength(2);
        expect(t.hints![0]).not.toBe(t.hints![1]);
        expect(t.solutionSteps?.length, t.question).toBeGreaterThan(0);
      }
    });

    it("správný zápis projde — i s mezerou mezi řády, jak ho dítě vidí v zadání", () => {
      for (const t of tasks) {
        expect(zkontroluj(topic, t, t.correctAnswer), t.question).toBe(true);
        const sMezerou = Number(t.correctAnswer).toLocaleString("cs-CZ");
        expect(zkontroluj(topic, t, sMezerou), `${t.question} → ${sMezerou}`).toBe(true);
      }
    });

    it("číslo o jedničku vedle je špatně", () => {
      for (const t of tasks) {
        const k = Number(t.correctAnswer);
        for (const chyba of [k - 1, k + 1, k + 2, k - 10]) {
          if (chyba <= 0) continue;
          expect(zkontroluj(topic, t, String(chyba)), `${t.question} → ${chyba}`).toBe(false);
        }
      }
    });

    it("typická chyba se vysvětlí tomu, kdo ji napsal", () => {
      for (const t of tasks) {
        const chyby = Object.keys(t.optionFeedback ?? {});
        expect(chyby.length, t.question).toBeGreaterThanOrEqual(3);
        for (const chyba of chyby) {
          expect(chyba, t.question).toMatch(/^\d+$/);
          expect(chyba, t.question).not.toBe(t.correctAnswer);
          expect(zkontroluj(topic, t, chyba), `${t.question} → ${chyba}`).toBe(false);
          expect(getTargetedFeedback(t, chyba), `${t.question} → ${chyba}`).toBeTruthy();
        }
      }
    });

    it("NEZÁVISLÝ ŘEŠIČ souhlasí s klíčem (20 běhů)", () => {
      for (let r = 0; r < 20; r++) {
        for (const t of topic.generator(level)) {
          const vysledek = reseni(t.question);
          expect(vysledek, `nepřečtené zadání: ${t.question}`).not.toBeNull();
          expect(String(vysledek), t.question).toBe(t.correctAnswer);
        }
      }
    });
  });
});
