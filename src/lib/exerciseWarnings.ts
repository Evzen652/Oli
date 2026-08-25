/**
 * Neblokující obsahová varování pro admin editor cvičení.
 *
 * Replikuje pedagogické detektory z `contentAudit.ts` (giveaway v otázce,
 * giveaway délkou možnosti) a znovupoužívá `checkHintLeakage`, ale ve formě
 * čisté funkce nad tvarem formuláře — aby admin dostal zpětnou vazbu ještě
 * PŘED uložením do `custom_exercises`, ne až v offline auditu.
 *
 * Záměrně jen VARUJE (neblokuje uložení): detektory mají známé false-positives
 * (viz CLAUDE.md / paměť „reference_content_audit_gotchas"), takže poslední
 * slovo má admin.
 */
import { checkHintLeakage } from "../../supabase/functions/_shared/hintLeakage";

export type ExerciseWarningCategory =
  | "hint_leak"
  | "giveaway_question"
  | "giveaway_option";

export interface ExerciseWarning {
  category: ExerciseWarningCategory;
  message: string;
}

export interface ExerciseWarningInput {
  /** FormInputType z dialogu (select_one, true_false, fill_blank, …) */
  inputType: string;
  question: string;
  /** U multi_select spojené čárkou, u match_pairs "match" */
  correctAnswer: string;
  /** Zobrazené možnosti (select_one / true_false / multi_select) */
  options?: string[];
  hints?: string[];
}

// Typy, u kterých nemá „odpověď ve znění otázky" smysl (odpověď není volný text
// vyhledatelný v zadání) — shodné se `skipType` v contentAudit.ts:400.
const GIVEAWAY_QUESTION_SKIP = new Set([
  "comparison",
  "drag_order",
  "match_pairs",
  "fill_blank",
  "true_false",
]);

/** Čisté číslo, případně s běžnou jednotkou → jádro je číslo, ne giveaway. */
const PURE_NUMERIC = /^\d+([.,]\d+)?(\s*(cm|m|kg|l|°C|km|mm))?$/;

/**
 * Detekuje neblokující obsahová varování. Vrací prázdné pole, když je vše ok.
 */
export function detectExerciseWarnings(input: ExerciseWarningInput): ExerciseWarning[] {
  const warnings: ExerciseWarning[] = [];
  const question = (input.question ?? "").trim();
  const correct = (input.correctAnswer ?? "").trim();
  const options = (input.options ?? []).filter((o) => o && o.trim());

  // 1) Hint leak — znovupoužij sdílený detektor.
  if (input.hints && input.hints.some((h) => h && h.trim())) {
    const leak = checkHintLeakage({
      question,
      correct_answer: correct,
      hints: input.hints.filter((h) => h && h.trim()),
    });
    if (!leak.ok) {
      warnings.push({
        category: "hint_leak",
        message: leak.reason ?? "Nápověda může prozrazovat odpověď.",
      });
    }
  }

  // 2) Giveaway v otázce — správná odpověď se doslova vyskytuje v zadání
  //    (contentAudit.ts:404-418).
  if (
    !GIVEAWAY_QUESTION_SKIP.has(input.inputType) &&
    correct.length >= 3 &&
    !PURE_NUMERIC.test(correct) &&
    question
  ) {
    const escaped = correct.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    if (re.test(question)) {
      warnings.push({
        category: "giveaway_question",
        message: `Správná odpověď „${truncate(correct, 40)}" se doslova objevuje ve znění otázky (giveaway).`,
      });
    }
  }

  // 3) Giveaway délkou/meta-textem možnosti (contentAudit.ts:368-388).
  //    Přeskoč true_false (Pravda/Nepravda mají pevný tvar).
  if (input.inputType !== "true_false" && options.length > 0 && correct) {
    const distractors = options.filter(
      (o) => o.trim().toLowerCase() !== correct.toLowerCase(),
    );
    if (distractors.length > 0) {
      const maxDistractorLen = Math.max(...distractors.map((d) => d.trim().length));
      const marker = /nepatří|patří|správně|→/i.test(correct);
      const tooLong = correct.length > 15 && correct.length >= 2 * maxDistractorLen;
      if (marker) {
        warnings.push({
          category: "giveaway_option",
          message: "Správná možnost obsahuje prozrazující meta-slovo (patří / správně / →).",
        });
      } else if (tooLong) {
        warnings.push({
          category: "giveaway_option",
          message: "Správná možnost je nápadně delší než distraktory — dítě ji pozná délkou.",
        });
      }
    }
  }

  return warnings;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
