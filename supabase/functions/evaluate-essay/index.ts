import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";
import { createEvaluateEssayHandler } from "./handler.ts";

/**
 * EVALUATE-ESSAY — AI hodnocení slohu (Fáze 11).
 * Wire-up: Deno serve → handler.ts (testovatelné z vitestu).
 *
 * Vstup: { prompt, essay, grade_min?, min_words? }
 * Výstup: { score: 0-100, praise, suggestions: string[], errors?: string[] }
 */

serve(createEvaluateEssayHandler({ aiCall, hasAnyAiProvider }));
