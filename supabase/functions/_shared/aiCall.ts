/**
 * Sdílený AI provider router pro edge funkce.
 *
 * Volby:
 *  • GROQ_API_KEY   — Groq (Llama 3.3 70B), rychlé, dobré tool calling.
 *  • GEMINI_API_KEY — Google AI (varianta názvu: GOOGLE_AI_KEY).
 *
 * ⚠️ **Lovable AI Gateway se nepoužívá** (rozhodnutí 2026-09-09). Dřív tu byl
 * jako fallback, ale `LOVABLE_API_KEY` v projektu ani nastavený nebyl, takže
 * ta větev znamenala jen tichý bod selhání. Nevracej ji — hlídá to
 * `src/test/legal-recipients.test.ts`, protože příjemci dat jsou uvedení
 * v zásadách ochrany osobních údajů a musí sedět se skutečností.
 *
 * Klíče se čtou Z DENO ENVIRONMENT (Supabase secrets) — NIKDY ne z klienta.
 *
 * Použití:
 *   import { aiCall } from "../_shared/aiCall.ts";
 *
 *   const response = await aiCall({
 *     messages: [...],
 *     tools: [...],
 *     toolChoice: { type: "function", function: { name: "..." } },
 *     model: { groq: "llama-3.3-70b-versatile", google: "gemini-2.0-flash" }
 *   });
 *
 * Response je OpenAI-compatible (Groq i Google OpenAI endpoint vrací stejný
 * shape), takže parsing kódu zůstává beze změny.
 */

export interface AiModelMap {
  /** Groq model ID — např. "llama-3.3-70b-versatile" */
  groq: string;
  /** Google AI model ID — např. "gemini-2.0-flash" */
  google?: string;
}

export interface AiCallOptions {
  messages: Array<{ role: string; content: string }>;
  tools?: unknown[];
  toolChoice?: unknown;
  model: AiModelMap;
  /** Volitelně override; default true */
  preferGroq?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface AiProviderInfo {
  provider: "groq" | "google";
  model: string;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GOOGLE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

/** Přečte Google AI klíč — podporuje obě varianty názvu secretu */
function getGoogleKey(): string | undefined {
  return Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_KEY");
}

/**
 * Vyhodnotí, který provider se použije, BEZ volání AI.
 * Užitečné pro logování / debugging.
 */
export function getActiveProvider(preferGroq = true): AiProviderInfo | null {
  const groqKey = Deno.env.get("GROQ_API_KEY");
  const googleKey = getGoogleKey();

  if (preferGroq && groqKey) return { provider: "groq", model: "" };
  if (googleKey) return { provider: "google", model: "" };
  if (groqKey) return { provider: "groq", model: "" };
  return null;
}

/**
 * Provede AI request přes preferovaný provider.
 *
 * Vrací native fetch Response — caller si parsuje JSON sám.
 */
export async function aiCall(opts: AiCallOptions): Promise<Response> {
  const { messages, tools, toolChoice, model, preferGroq = true, temperature, maxTokens } = opts;

  const groqKey = Deno.env.get("GROQ_API_KEY");
  const googleKey = getGoogleKey();

  const buildBody = (modelId: string): Record<string, unknown> => {
    const body: Record<string, unknown> = { model: modelId, messages };
    if (tools) body.tools = tools;
    if (toolChoice) body.tool_choice = toolChoice;
    if (typeof temperature === "number") body.temperature = temperature;
    if (typeof maxTokens === "number") body.max_tokens = maxTokens;
    return body;
  };

  const doFetch = (url: string, apiKey: string, modelId: string) =>
    fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(modelId)),
    });

  // Priorita: Groq (preferGroq) → Google → Groq jako poslední možnost.
  if (preferGroq && groqKey) {
    console.log(`[aiCall] Provider: Groq, model: ${model.groq}`);
    const res = await doFetch(GROQ_URL, groqKey, model.groq);
    if ((res.status === 429 || res.status >= 500) && googleKey && model.google) {
      console.log(`[aiCall] Groq returned ${res.status}, falling back to Google`);
      return await doFetch(GOOGLE_URL, googleKey, model.google);
    }
    return res;
  }

  if (googleKey && model.google) {
    console.log(`[aiCall] Provider: Google AI, model: ${model.google}`);
    const res = await doFetch(GOOGLE_URL, googleKey, model.google);
    if ((res.status === 429 || res.status >= 500) && groqKey) {
      console.log(`[aiCall] Google returned ${res.status}, falling back to Groq`);
      return await doFetch(GROQ_URL, groqKey, model.groq);
    }
    return res;
  }

  if (groqKey) {
    console.log(`[aiCall] Provider: Groq (last resort), model: ${model.groq}`);
    return await doFetch(GROQ_URL, groqKey, model.groq);
  }

  throw new Error(
    "Žádný AI provider není nakonfigurován. Nastavte GROQ_API_KEY nebo GEMINI_API_KEY v Supabase Edge Functions Secrets."
  );
}

/** Vrátí true, pokud je nakonfigurován alespoň jeden provider. */
export function hasAnyAiProvider(): boolean {
  return !!(getGoogleKey() || Deno.env.get("GROQ_API_KEY"));
}
