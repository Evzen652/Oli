import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSessionEvalHandler } from "./handler.ts";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";

/**
 * Session Evaluation — AI hodnocení po dokončené session.
 * Wire-up: serve → handler.ts (testovatelné z vitestu).
 *
 * Poskytovatele vybírá `_shared/aiCall.ts` podle nastavených klíčů. Dřív se sem
 * injektoval jen `LOVABLE_API_KEY`, který v projektu nastavený NENÍ — funkce by
 * tedy po nasazení házela chybu při každém dokončeném sezení. Nastavené jsou
 * `GROQ_API_KEY` a `GEMINI_API_KEY`, které router umí.
 */

serve(createSessionEvalHandler({
  hasProvider: hasAnyAiProvider,
  callAi: (messages) =>
    aiCall({
      messages,
      // Krátký text, žádné tool calling — stačí rychlý model.
      model: {
        groq: "llama-3.3-70b-versatile",
        google: "gemini-2.0-flash",
      },
      temperature: 0.7,
      maxTokens: 300,
    }),
}));
