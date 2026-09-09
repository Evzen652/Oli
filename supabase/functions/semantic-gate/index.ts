import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSemanticGateHandler } from "./handler.ts";

/**
 * Semantic Gate — AI klasifikace zda je vstup žáka smysluplný školní termín.
 * Wire-up: Deno serve → handler.ts (testovatelné z vitestu).
 */

serve(createSemanticGateHandler({
  fetch: globalThis.fetch,
  // Lovable Gateway odstraněn 2026-09-09 (nepoužívá se nikde v projektu).
  getApiKey: () => Deno.env.get("GROQ_API_KEY") ?? undefined,
}));
