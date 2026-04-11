import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock the semantic gate to return safe fallback (no network calls in tests)
vi.mock("../lib/semanticGate", () => ({
  classifySemanticInput: vi.fn().mockResolvedValue({
    semantic_valid: false,
    semantic_domain: "non-school" as const,
  }),
}));

// Mock aiExecution to use synchronous mock (no network calls in tests)
vi.mock("../lib/aiExecution", async (importOriginal) => {
  const original = await importOriginal() as Record<string, unknown>;
  // The module now exports an async generateResponse; wrap the mock to be async too
  return {
    ...original,
    generateResponse: vi.fn().mockImplementation(async (request: any) => {
      const { type, topic, grade, previousErrors } = request;
      
      if (topic.id === "math-compare-natural-numbers-100" && grade === 3) {
        switch (type) {
          case "explain":
            return { content: "Porovnáváme dvě čísla.\nVětší číslo je to, které má víc.\nPodíváme se na obě čísla a řekneme, které je větší." };
          case "practice":
            return { content: "Které číslo je větší?", practiceQuestion: "38 nebo 62" };
          case "check":
            if (previousErrors === 0) return { content: "Ne.\nPodíváme se na to znovu.", isCorrect: false };
            return { content: "Ano.\n62 je větší než 38.", isCorrect: true };
          default:
            return { content: "Neznámý typ požadavku." };
        }
      }

      const simple = grade <= 5;
      switch (type) {
        case "explain":
          if (previousErrors >= 2) {
            return { content: simple ? `Zkusíme to jednodušeji. ${topic.title} znamená: ${topic.goals[0] || "základní pojem"}.` : `Zjednodušený výklad: ${topic.title}. ${topic.goals[0] || "Hlavní myšlenka tématu."}` };
          }
          return { content: simple ? `Podívejme se na ${topic.title}. ${topic.goals[0] || "To je to, co se teď učíme."}` : `Téma: ${topic.title}. ${topic.goals.join(". ")}` };
        case "practice":
          return { content: "Zkus odpovědět na tuto otázku:", practiceQuestion: simple ? `Jednoduchá otázka k tématu "${topic.title}"?` : `Otázka k ověření porozumění tématu "${topic.title}"?` };
        case "check":
          return { content: "Pojďme zkontrolovat tvou odpověď.", isCorrect: false };
        default:
          return { content: "Neznámý typ požadavku." };
      }
    }),
  };
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
