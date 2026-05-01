import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";
import { createTutorChatHandler } from "./handler.ts";

/**
 * TUTOR-CHAT — konverzační follow-up tutor (Fáze 7).
 * Wire-up: Deno serve → handler.ts (testovatelné z vitestu).
 *
 * Anti-leak filter v _shared/tutorAntiLeak.ts.
 */

serve(createTutorChatHandler({ aiCall, hasAnyAiProvider }));
