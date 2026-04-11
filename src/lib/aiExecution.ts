import type { AIRequest, AIResponse, PracticeTask } from "./types";
import { filterValidTasks } from "./taskValidator";

/**
 * AI EXECUTION LAYER
 * 
 * - Stateless: receives request, returns response
 * - Has NO control over flow, decisions, STOP, or rules
 * - Generates explanations and questions ONLY within topic boundaries
 * 
 * Tries real AI (ai-tutor edge function) first, falls back to mock.
 */

const AI_TUTOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;
const AI_TIMEOUT_MS = 5000;
const BATCH_SIZE = 5;

/** Map orchestrator request type to prompt phase */
function mapPhase(type: AIRequest["type"]): string {
  switch (type) {
    case "explain": return "explain";
    case "practice": return "practice";
    case "check": return "diagnostic";
    default: return "explain";
  }
}

/** Derive level from error count (simple heuristic) */
function deriveLevel(previousErrors: number): number {
  if (previousErrors === 0) return 2;
  if (previousErrors <= 2) return 1;
  return 1;
}

/** Race a fetch against a timeout. Returns null on timeout. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

/** Try AI tutor edge function with timeout, return null on failure */
async function callAITutor(request: AIRequest, phase?: string): Promise<any | null> {
  try {
    const fetchPromise = fetch(AI_TUTOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        skill_label: request.topic.title,
        practice_type: request.topic.inputType || "text",
        current_level: request.topic.defaultLevel ?? deriveLevel(request.previousErrors),
        phase: phase || mapPhase(request.type),
        child_input: request.childInput || undefined,
        batch_size: BATCH_SIZE,
        grade_min: request.grade ?? request.topic.gradeRange?.[0] ?? 3,
      }),
    });

    const resp = await withTimeout(fetchPromise, AI_TIMEOUT_MS);
    if (!resp) {
      console.warn("[AITutor] Timeout after", AI_TIMEOUT_MS, "ms – falling back to mock");
      return null;
    }

    if (!resp.ok) {
      console.warn("[AITutor] HTTP error:", resp.status);
      return null;
    }

    const data = await resp.json();
    if (data.fallback || data.error) {
      console.warn("[AITutor] Fallback triggered:", data.error);
      return null;
    }

    return data;
  } catch (e) {
    console.warn("[AITutor] Fetch error:", e);
    return null;
  }
}

/** Generate a batch of practice tasks (AI first, mock fallback) */
export async function generatePracticeBatch(request: AIRequest): Promise<PracticeTask[]> {
  const data = await callAITutor(request, "practice_batch");

  if (data?.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
    const mapped: PracticeTask[] = data.tasks.map((t: any) => ({
      question: String(t.question || ""),
      correctAnswer: String(t.correct_answer || ""),
      options: Array.isArray(t.options) && t.options.length > 0 ? t.options : undefined,
      hints: Array.isArray(t.hints) && t.hints.length > 0 ? t.hints : undefined,
      solutionSteps: Array.isArray(t.solution_steps) && t.solution_steps.length > 0 ? t.solution_steps : undefined,
      items: Array.isArray(t.items) && t.items.length > 0 ? t.items : undefined,
      blanks: Array.isArray(t.blanks) && t.blanks.length > 0 ? t.blanks : undefined,
      pairs: Array.isArray(t.pairs) && t.pairs.length > 0 ? t.pairs : undefined,
      categories: Array.isArray(t.categories) && t.categories.length > 0 ? t.categories : undefined,
      correctAnswers: Array.isArray(t.correct_answers) && t.correct_answers.length > 0 ? t.correct_answers : undefined,
    }));
    const valid = filterValidTasks(mapped, request.topic.inputType);
    if (valid.length > 0) return valid;
  }

  // Mock fallback
  return generateMockBatch(request);
}

/** Main entry point for explain: AI first, mock fallback */
export async function generateResponse(request: AIRequest): Promise<AIResponse> {
  const data = await callAITutor(request);
  if (data) {
    return {
      content: data.content || "",
      practiceQuestion: data.practiceQuestion,
      isCorrect: data.isCorrect,
    };
  }
  return generateMockExplain(request);
}

// ── MOCK BATCH – delegates to topic.generator ──

export function generateMockBatch(request: AIRequest, levelOverride?: number): PracticeTask[] {
  const level = levelOverride ?? request.topic.defaultLevel ?? 2;
  const allTasks = request.topic.generator(level);

  const taskCount = request.topic.sessionTaskCount ?? 6;
  return allTasks.slice(0, taskCount);
}

// ── MOCK SINGLE RESPONSE (for EXPLAIN) – exported for deterministic orchestrator use ──

export function generateMockExplain(request: AIRequest): AIResponse {
  const { type, topic, grade, previousErrors } = request;

  const simple = grade <= 5;

  switch (type) {
    case "explain": {
      if (previousErrors >= 2) {
        return {
          content: simple
            ? `Zkusíme to jednodušeji. ${topic.title} znamená: ${topic.goals[0] || "základní pojem"}.`
            : `Zjednodušený výklad: ${topic.title}. ${topic.goals[0] || "Hlavní myšlenka tématu."}`,
        };
      }
      return {
        content: simple
          ? `Podívejme se na ${topic.title}. ${topic.goals[0] || "To je to, co se teď učíme."}`
          : `Téma: ${topic.title}. ${topic.goals.join(". ")}`,
      };
    }
    case "practice":
      return { content: "Zkus odpovědět na tuto otázku:", practiceQuestion: `Otázka k "${topic.title}"?` };
    case "check":
      return { content: "Pojďme zkontrolovat tvou odpověď.", isCorrect: false };
    default:
      return { content: "Neznámý typ požadavku." };
  }
}