import type { PracticeTask, InputType } from "./types";

/**
 * System-wide task format validator.
 * Used in all 3 exercise paths: algorithmic generator, AI edge function, DB custom_exercises.
 */
export function validateTaskForInputType(task: PracticeTask, inputType: InputType): boolean {
  // Universal: must have question and correctAnswer
  if (!task.question?.trim() || !task.correctAnswer?.trim()) return false;

  switch (inputType) {
    case "comparison":
      return ["<", "=", ">"].includes(task.correctAnswer.trim());

    case "select_one": {
      if (!task.options || task.options.length < 2) return false;
      if (!task.options.includes(task.correctAnswer)) return false;
      // i/y spelling: question must have exactly 1 underscore
      const isIY = task.options.some(o => ["i/í", "y/ý", "i", "y"].includes(o.toLowerCase()));
      if (isIY) {
        const underscores = (task.question.match(/_/g) || []).length;
        if (underscores !== 1) return false;
      }
      return true;
    }

    case "fraction": {
      const ca = task.correctAnswer.trim();
      return /^\d+\/\d+$/.test(ca) || /^\d+$/.test(ca);
    }

    case "fill_blank": {
      const blankCount = (task.question.match(/_/g) || []).length;
      if (blankCount === 0) return false;
      // If blanks array provided, must match blank count
      if (task.blanks && task.blanks.length !== blankCount) return false;
      return true;
    }

    case "drag_order":
      return Array.isArray(task.items) && task.items.length >= 2;

    case "match_pairs":
      return Array.isArray(task.pairs) && task.pairs.length >= 2;

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
