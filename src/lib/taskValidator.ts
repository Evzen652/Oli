import type { PracticeTask, InputType } from "./types";

/**
 * True pokud `needle` je v `haystack` obsažen jako celá slova (na hranicích slov).
 * Hranice = začátek/konec řetězce nebo ne-písmenný znak.
 * → "přímá řeč" NENÍ uvnitř "nepřímá řeč" (přímá je uvnitř slova nepřímá),
 *   ale "kočka" JE uvnitř "kočka domácí" (skutečná ambiguita).
 */
function containsAsPhrase(haystack: string, needle: string): boolean {
  const isLetter = (ch: string | undefined) => !!ch && /\p{L}/u.test(ch);
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    const before = haystack[idx - 1];
    const after = haystack[idx + needle.length];
    if (!isLetter(before) && !isLetter(after)) return true;
    idx = haystack.indexOf(needle, idx + 1);
  }
  return false;
}

/**
 * System-wide task format validator.
 * Used in all 3 exercise paths: algorithmic generator, AI edge function, DB custom_exercises.
 */
export function validateTaskForInputType(task: PracticeTask, inputType: InputType): boolean {
  // Universal: must have question and correctAnswer
  if (!task.question?.trim() || !task.correctAnswer?.trim()) return false;

  // Structural overrides: task type is determined by data shape, not topic inputType.
  // PracticeInputRouter renders these by field presence, so validate them by the
  // shape's own rules (NOT skip validation) — přesměruj na správný inputType.
  if (task.pairs && task.pairs.length > 0) inputType = "match_pairs";
  else if (task.correctAnswers && task.correctAnswers.length > 0) inputType = "multi_select";
  else if (task.categories && task.categories.length > 0) inputType = "categorize";

  switch (inputType) {
    case "comparison":
      return ["<", "=", ">"].includes(task.correctAnswer.trim());

    case "select_one": {
      if (!task.options || task.options.length < 2) return false;
      if (task.options.length > 6) return false;
      if (!task.options.includes(task.correctAnswer)) return false;
      // i/y spelling: question must have exactly 1 underscore.
      // Skutečné i/y cvičení nabízí OBĚ varianty (i + y) — samotné "I" může být
      // legitimní odpověď jinde (písmenné řady: "A, C, E, G, ?" → "I").
      const lowerOpts = task.options.map(o => o.toLowerCase());
      const isIY =
        lowerOpts.some(o => ["i/í", "i", "í"].includes(o)) &&
        lowerOpts.some(o => ["y/ý", "y", "ý"].includes(o));
      if (isIY) {
        const underscores = (task.question.match(/_/g) || []).length;
        if (underscores !== 1) return false;
      }
      // Distractor nesmí být celá fráze obsažená v correctAnswer a naopak (jen slova > 3 znaky).
      // Numerické/jednotkové odpovědi vyjmuty — "8 cm" vs "8 cm²" či "5 °C" vs "−5 °C"
      // jsou legitimní distraktory. Shoda na hranicích slov (containsAsPhrase), ne substring —
      // "přímá řeč" vs "nepřímá řeč", "umělecký" vs "neumělecký" jsou legitimní.
      if (task.correctAnswer.length > 3 && !/\d/.test(task.correctAnswer)) {
        const correct = task.correctAnswer.trim().toLowerCase();
        const wrongOpts = task.options.filter(o => o !== task.correctAnswer);
        for (const opt of wrongOpts) {
          const o = opt.trim().toLowerCase();
          if (o.length > 3 && !/\d/.test(o) && (containsAsPhrase(correct, o) || containsAsPhrase(o, correct))) return false;
        }
      }
      return true;
    }

    case "fraction": {
      const ca = task.correctAnswer.trim();
      return /^\d+\/\d+$/.test(ca) || /^\d+$/.test(ca);
    }

    case "fill_blank": {
      // Souvislá řada podtržítek ("___") = JEDEN blank — stejně to renderují
      // obě UI komponenty (FillBlankInput splituje na "___", student input na /_+/).
      const blankCount = (task.question.match(/_+/g) || []).length;
      if (blankCount === 0) return false;
      // If blanks array provided, must match blank count
      if (task.blanks && task.blanks.length !== blankCount) return false;
      return true;
    }

    case "drag_order":
      return Array.isArray(task.items) && task.items.length >= 2;

    case "match_pairs": {
      if (!Array.isArray(task.pairs) || task.pairs.length < 3) return false;
      if (task.pairs.length > 8) return false;
      const lefts = task.pairs.map(p => p.left.trim().toLowerCase());
      const rights = task.pairs.map(p => p.right.trim().toLowerCase());
      if (new Set(lefts).size !== lefts.length) return false;
      if (new Set(rights).size !== rights.length) return false;
      return true;
    }

    case "multi_select":
      return Array.isArray(task.correctAnswers) && task.correctAnswers.length >= 1;

    case "categorize":
      return Array.isArray(task.categories) && task.categories.length >= 2;

    case "number":
      return /^-?\d+([.,]\d+)?$/.test(task.correctAnswer.trim());

    case "text":
      return true; // any non-empty string is valid

    default:
      return true;
  }
}

/** Filter a batch, keeping only valid tasks for the given inputType */
export function filterValidTasks(tasks: PracticeTask[], inputType: InputType): PracticeTask[] {
  const valid = tasks.filter(t => validateTaskForInputType(t, inputType));
  if (valid.length < tasks.length) {
    console.warn(`[taskValidator] Filtered out ${tasks.length - valid.length} invalid tasks for inputType="${inputType}"`);
  }
  return valid;
}
