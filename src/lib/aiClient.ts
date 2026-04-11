/**
 * AI Client — calls Groq API (Llama 3.3 70B) directly from client.
 * For production, move to edge function to protect API key.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function getApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY ?? "";
}

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callAi(
  messages: AiMessage[],
  options?: { maxTokens?: number; temperature?: number; timeoutMs?: number }
): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 8000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens: options?.maxTokens ?? 300,
        temperature: options?.temperature ?? 0.7,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check if AI is available (API key configured)
 */
export function isAiAvailable(): boolean {
  return !!getApiKey();
}
