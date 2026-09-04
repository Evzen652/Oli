import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock the semantic gate to return safe fallback (no network calls in tests)
vi.mock("../lib/semanticGate", () => ({
  classifySemanticInput: vi.fn().mockResolvedValue({
    semantic_valid: false,
    semantic_domain: "non-school" as const,
  }),
}));

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
