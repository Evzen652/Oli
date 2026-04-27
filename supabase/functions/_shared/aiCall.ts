/**
 * Sdílený AI provider router pro edge funkce.
 *
 * Volby:
 *  • GROQ_API_KEY (preferred)  — direct Groq (Llama 3.3 70B), nezávislé,
 *                                rychlé, dobré tool calling.
 *  • LOVABLE_API_KEY (fallback) — Lovable AI Gateway (Gemini / GPT).
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
 *     model: { groq: "llama-3.3-70b-versatile", lovable: "google/gemini-3-flash-preview" }
 *   });
 *
 * Response je OpenAI-compatible (Groq i Lovable Gateway vrací stejný shape),
 * takže parsing kódu zůstává beze změny.
 */

export interface AiModelMap {
  /** Groq model ID — např. "llama-3.3-70b-versatile" */
  groq: string;
  /** Lovable Gateway model ID — např. "google/gemini-3-flash-preview" */
  lovable: string;
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
  provider: "groq" | "lovable";
  model: string;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

/**
 * Vyhodnotí, který provider se použije, BEZ volání AI.
 * Užitečné pro logování / debugging.
 */
export function getActiveProvider(preferGroq = true): AiProviderInfo | null {
  const groqKey = Deno.env.get("GROQ_API_KEY");
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  if (preferGroq && groqKey) return { provider: "groq", model: "" };
  if (lovableKey) return { provider: "lovable", model: "" };
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
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  // Volba providera
  let useGroq = false;
  if (preferGroq && groqKey) useGroq = true;
  else if (lovableKey) useGroq = false;
  else if (groqKey) useGroq = true;
  else throw new Error(
    "Žádný AI provider není nakonfigurován. Nastavte GROQ_API_KEY (preferováno) " +
    "nebo LOVABLE_API_KEY v Supabase Edge Functions Secrets."
  );

  const url = useGroq ? GROQ_URL : LOVABLE_URL;
  const apiKey = useGroq ? groqKey! : lovableKey!;
  const modelId = useGroq ? model.groq : model.lovable;

  console.log(`[aiCall] Provider: ${useGroq ? "Groq" : "Lovable"}, model: ${modelId}`);

  const body: Record<string, unknown> = {
    model: modelId,
    messages,
  };
  if (tools) body.tools = tools;
  if (toolChoice) body.tool_choice = toolChoice;
  if (typeof temperature === "number") body.temperature = temperature;
  if (typeof maxTokens === "number") body.max_tokens = maxTokens;

  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/** Vrátí true, pokud je nakonfigurován alespoň jeden provider. */
export function hasAnyAiProvider(): boolean {
  return !!(Deno.env.get("GROQ_API_KEY") || Deno.env.get("LOVABLE_API_KEY"));
}
