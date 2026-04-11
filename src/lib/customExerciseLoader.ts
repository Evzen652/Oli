import { supabase } from "@/integrations/supabase/client";
import type { PracticeTask, InputType } from "./types";
import { filterValidTasks } from "./taskValidator";

/**
 * Load exercises from custom_exercises table for a given skill.
 * Returns PracticeTask[] compatible with SessionView.
 * Validates format against inputType when provided.
 */
export async function loadCustomExercises(
  skillId: string,
  options?: { source?: "simple" | "advanced" | "expert"; inputType?: InputType }
): Promise<PracticeTask[]> {
  let query = (supabase as any)
    .from("custom_exercises")
    .select("*")
    .eq("skill_id", skillId)
    .eq("is_active", true);

  if (options?.source) {
    query = query.eq("source", options.source);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) return [];

  // Shuffle the exercises
  const shuffled = [...data].sort(() => Math.random() - 0.5);

  const tasks: PracticeTask[] = shuffled.map((ex: any) => ({
    question: ex.question,
    correctAnswer: ex.correct_answer,
    options: Array.isArray(ex.options) && ex.options.length > 0 ? ex.options : undefined,
    hints: Array.isArray(ex.hints) && ex.hints.length > 0 ? ex.hints : undefined,
    solutionSteps: Array.isArray(ex.solution_steps) && ex.solution_steps.length > 0 ? ex.solution_steps : undefined,
  }));

  // Validate if inputType is known
  if (options?.inputType) {
    return filterValidTasks(tasks, options.inputType);
  }
  return tasks;
}

/**
 * Check if custom exercises exist for a skill.
 */
export async function hasCustomExercises(skillId: string): Promise<boolean> {
  const { count, error } = await (supabase as any)
    .from("custom_exercises")
    .select("id", { count: "exact", head: true })
    .eq("skill_id", skillId)
    .eq("is_active", true);

  return !error && (count ?? 0) > 0;
}
