import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { PISEMNE_SCITANI_ODCITANI } from "@/content/grade-4/matematika/pisemneScitaniAOdcitaniVicecifernychCisel";
import { PISEMNE_NASOBENI } from "@/content/grade-4/matematika/pisemneNasobeniJednoADvoucifernymCinitelem";
import { numericToleranceValidator, resolveTaskValidation, validateAnswer } from "@/lib/validators";
import { getTargetedFeedback } from "@/components/CheckFeedbackCard";
import { validateTaskForInputType } from "@/lib/taskValidator";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

/**
 * ZÁPIS ČÍSLA V MATEMATICE (2026-09-30).
 *
 * Šestnáct témat 2.–5. ročníku nedává výsledek na výběr — dítě ho píše.
 * Test hlídá čtyři věci, na kterých to stojí:
 *   1. validátor uzná jen správné číslo (relativní tolerance 0,1 % dřív
 *      uznala „4 318" místo „4 320");
 *   2. úloha nesmí nést `options`, jinak `PracticeInputRouter` ukáže
 *      tlačítka i u `inputType: "number"`;
 *   3. klíč musí projít `validateTaskForInputType` — jinak ho offline audit
 *      i `filterValidTasks` zahodí a dítě dostane prázdné sezení;
 *   4. diagnostika typických chyb zůstává a najde se podle toho, CO DÍTĚ
 *      NAPSALO (včetně „40.5" proti klíči „40,5").
 * U písemného počítání navíc klíč přepočítává nezávislý řešič ze znění úlohy.
 */

const CISELNA = getAllTopics().filter((t) => t.inputType === "number");

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
    expect(numericToleranceValidator.validate("40.5", "40,5").correct).toBe(true);
    expect(numericToleranceValidator.validate("0.3334", "0.333").correct).toBe(true);
    expect(numericToleranceValidator.validate("0,4", "0,333").correct).toBe(false);
  });

  it("nečíslo pozná jako nečíslo", () => {
    expect(numericToleranceValidator.validate("nevím", "12").errorType).toBe("not_a_number");
  });
});

describe("getTargetedFeedback u napsaného čísla", () => {
  const task = {
    question: "Průměr?",
    correctAnswer: "38,5",
    optionFeedback: { "40,5": "Sečetl jsi jen tři hodnoty.", "40": "Zapomněl jsi na půlku." },
  } as unknown as PracticeTask;

  it("najde vysvětlení i při jiném oddělovači nebo mezeře", () => {
    expect(getTargetedFeedback(task, "40,5")).toBe("Sečetl jsi jen tři hodnoty.");
    expect(getTargetedFeedback(task, "40.5")).toBe("Sečetl jsi jen tři hodnoty.");
    expect(getTargetedFeedback(task, " 40,5 ")).toBe("Sečetl jsi jen tři hodnoty.");
  });

  it("nerozdělí desetinné číslo podle čárky na dvě části", () => {
    expect(getTargetedFeedback(task, "40,7")).toBeNull();
  });

  it("nevymyslí si vysvětlení tam, kde chyba popsaná není", () => {
    expect(getTargetedFeedback(task, "12")).toBeNull();
  });
});

/** Projde odpověď celou cestou, kterou jde v sezení (resolve → validate). */
function zkontroluj(topic: TopicMetadata, task: PracticeTask, odpoved: string): boolean {
  const { expected, validatorId } = resolveTaskValidation(task);
  return validateAnswer(odpoved, expected, { validatorId, inputType: topic.inputType }).correct;
}

describe("Témata na zápis čísla", () => {
  it("je jich šestnáct a všechna jsou z matematiky", () => {
    // Přibude-li další, číslo se zvýší vědomě — a tichý návrat k výběru se pozná.
    expect(CISELNA.map((t) => t.id).sort()).toHaveLength(16);
    for (const t of CISELNA) expect(t.subject, t.id).toBe("matematika");
  });

  describe.each(CISELNA.map((t) => [t.id, t] as const))("%s", (_id, topic) => {
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

      it("klíč projde offline auditem pro typ number", () => {
        for (const t of tasks) {
          expect(t.correctAnswer, t.question).toMatch(/^-?\d+([.,]\d+)?$/);
          expect(validateTaskForInputType(t, "number"), t.question).toBe(true);
        }
      });

      it("nápovědy a vysvětlení zůstaly kompletní", () => {
        for (const t of tasks) {
          expect(t.hints?.length, t.question).toBe(2);
          expect(t.hints![0]).not.toBe(t.hints![1]);
          expect(
            Boolean(t.explanation) || Boolean(t.solutionSteps?.length),
            t.question,
          ).toBe(true);
        }
      });

      it("správný zápis projde — i s mezerou mezi řády, jak ho dítě vidí v zadání", () => {
        for (const t of tasks) {
          expect(zkontroluj(topic, t, t.correctAnswer), t.question).toBe(true);
          const sMezerou = Number(t.correctAnswer.replace(",", ".")).toLocaleString("cs-CZ");
          expect(zkontroluj(topic, t, sMezerou), `${t.question} → ${sMezerou}`).toBe(true);
        }
      });

      it("číslo o jedničku vedle je špatně", () => {
        for (const t of tasks) {
          const k = Number(t.correctAnswer.replace(",", "."));
          for (const chyba of [k - 1, k + 1, k + 2, k - 10]) {
            if (chyba <= 0) continue;
            const zapis = String(chyba).replace(".", ",");
            expect(zkontroluj(topic, t, zapis), `${t.question} → ${zapis}`).toBe(false);
          }
        }
      });

      it("typická chyba se vysvětlí tomu, kdo ji napsal", () => {
        for (const t of tasks) {
          const chyby = Object.keys(t.optionFeedback ?? {});
          expect(chyby.length, t.question).toBeGreaterThanOrEqual(3);
          for (const chyba of chyby) {
            expect(chyba, t.question).toMatch(/^-?\d+([.,]\d+)?$/);
            expect(chyba, t.question).not.toBe(t.correctAnswer);
            expect(zkontroluj(topic, t, chyba), `${t.question} → ${chyba}`).toBe(false);
            expect(getTargetedFeedback(t, chyba), `${t.question} → ${chyba}`).toBeTruthy();
          }
        }
      });
    });
  });
});

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

describe.each([
  ["g4-mat-pisemne-scitani-odcitani-4", PISEMNE_SCITANI_ODCITANI[0]] as const,
  ["g4-mat-pisemne-nasobeni-4", PISEMNE_NASOBENI[0]] as const,
])("Nezávislý řešič — %s", (_id, topic) => {
  it.each([1, 2, 3])("L%i souhlasí s klíčem (20 běhů)", (level) => {
    for (let r = 0; r < 20; r++) {
      for (const t of topic.generator(level)) {
        const vysledek = reseni(t.question);
        expect(vysledek, `nepřečtené zadání: ${t.question}`).not.toBeNull();
        expect(String(vysledek), t.question).toBe(t.correctAnswer);
      }
    }
  });
});
