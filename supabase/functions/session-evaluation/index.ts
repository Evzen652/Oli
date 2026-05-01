import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSessionEvalHandler } from "./handler.ts";

/**
 * Session Evaluation — AI hodnocení po dokončené session.
 * Wire-up: serve → handler.ts (testovatelné z vitestu).
 */

serve(createSessionEvalHandler({
  fetch: globalThis.fetch,
  getApiKey: () => Deno.env.get("LOVABLE_API_KEY") ?? undefined,
}));
