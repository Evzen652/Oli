/**
 * Sdílený AI provider router pro edge funkce.
 *
 * Volby:
 *  • GOOGLE_AI_KEY / GEMINI_API_KEY (preferred) — přímé Google AI.
 *  • LOVABLE_API_KEY (fallback)                  — Lovable AI Gateway (Gemini / GPT).
 *
 * Groq byl odstraněn (2026-08-26) — pro tyhle úkoly nedostatečná kvalita.
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
 *     model: { google: "gemini-2.0-flash", lovable: "google/gemini-3-flash-preview" }
 *   });
 *
 * Response je OpenAI-compatible (oba providery vrací stejný shape),
 * takže parsing kódu zůstává beze změny.
 */

export interface AiModelMap {
  /** Lovable Gateway model ID — např. "google/gemini-3-flash-preview" */
  lovable: string;
  /** Google AI model ID — např. "gemini-2.0-flash" */
  google?: string;
}

export interface AiCallOptions {
  messages: Array<{ role: string; content: string }>;
  tools?: unknown[];
  toolChoice?: unknown;
  model: AiModelMap;
  temperature?: number;
  maxTokens?: number;
}

export interface AiProviderInfo {
  provider: "google" | "lovable";
  model: string;
}

const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const GOOGLE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

/** Přečte Google AI klíč — podporuje obě varianty názvu secretu */
function getGoogleKey(): string | undefined {
  return Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_KEY");
}

/**
 * Vyhodnotí, který provider se použije, BEZ volání AI.
 * Užitečné pro logování / debugging.
 */
export function getActiveProvider(): AiProviderInfo | null {
  if (getGoogleKey()) return { provider: "google", model: "" };
  if (Deno.env.get("LOVABLE_API_KEY")) return { provider: "lovable", model: "" };
  return null;
}

/**
 * Provede AI request přes preferovaný provider.
 *
 * Vrací native fetch Response — caller si parsuje JSON sám.
 */
export async function aiCall(opts: AiCallOptions): Promise<Response> {
  const { messages, tools, toolChoice, model, temperature, maxTokens } = opts;

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
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

  // Priorita: Google AI (pokud je klíč a model) → Lovable Gateway (i jako fallback při chybě Google)
  if (googleKey && model.google) {
    console.log(`[aiCall] Provider: Google AI, model: ${model.google}`);
    const res = await doFetch(GOOGLE_URL, googleKey, model.google);
    if (res.ok) return res;
    const errBody = await res.clone().text();
    console.error(`[aiCall] Google returned ${res.status}: ${errBody.slice(0, 200)}`);
    if (lovableKey) {
      console.log(`[aiCall] Google failed (${res.status}), falling back to Lovable`);
      return await doFetch(LOVABLE_URL, lovableKey, model.lovable);
    }
    return res;
  }

  if (lovableKey) {
    console.log(`[aiCall] Provider: Lovable, model: ${model.lovable}`);
    return await doFetch(LOVABLE_URL, lovableKey, model.lovable);
  }

  throw new Error(
    "Žádný AI provider není nakonfigurován. Nastavte GOOGLE_AI_KEY nebo LOVABLE_API_KEY v Supabase Edge Functions Secrets."
  );
}

/** Vrátí true, pokud je nakonfigurován alespoň jeden provider. */
export function hasAnyAiProvider(): boolean {
  return !!(getGoogleKey() || Deno.env.get("LOVABLE_API_KEY"));
}
