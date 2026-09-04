import type { AIRequest, AIResponse, PracticeTask } from "./types";
import { filterRenderableTasks } from "./taskValidator";

/**
 * DETERMINISTICKÁ EXECUTION VRSTVA
 *
 * - Stateless: dostane request, vrátí response
 * - Nemá žádnou kontrolu nad flow, rozhodováním, STOP ani pravidly
 * - Úlohy pocházejí VÝHRADNĚ z `topic.generator` (čistá funkce, bez sítě a AI)
 *
 * Historicky se tu nejdřív zkoušela edge funkce `ai-tutor` a mock byl až
 * fallback. AI generování obsahu bylo zrušeno (rozhodnutí 2026-08-25), takže
 * zbyla jen deterministická cesta — a „mock" je dnes nešťastné jméno pro
 * jediný a produkční zdroj úloh.
 */
// ── Batch úloh — deleguje na topic.generator ──

export function generateMockBatch(request: AIRequest, levelOverride?: number): PracticeTask[] {
  const level = levelOverride ?? request.topic.defaultLevel ?? 2;
  const allTasks = request.topic.generator(level);

  // Render-safety guard na hlavní (deterministické) runtime cestě: zahoď JEN úlohy,
  // které by PracticeInputRouter vyrenderoval jako null (karta bez vstupu = dítě uvízne).
  // ÚMYSLNĚ ne full validateTaskForInputType — ten řeší i pedagogickou kvalitu (distraktory,
  // i/y, dedup) a false-positivně by zahodil funkční zmrazený obsah (ověřeno: rovnobezky L2,
  // velka-pismena L1 mají validní možnosti, jen „podobné" distraktory → 40→0 / 9→0).
  const renderable = filterRenderableTasks(allTasks, request.topic.inputType);

  const taskCount = request.topic.sessionTaskCount ?? 6;
  return renderable.slice(0, taskCount);
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