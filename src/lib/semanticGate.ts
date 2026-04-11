/**
 * SEMANTIC GATE — Client-side helper
 *
 * Calls the semantic-gate edge function to classify user input.
 * Returns a structured result. On failure, defaults to { semantic_valid: false, semantic_domain: "non-school" }.
 *
 * This module is STATELESS and READ-ONLY — it never modifies session state.
 */

export interface SemanticGateResult {
  semantic_valid: boolean;
  semantic_domain: "school" | "non-school";
}

const SEMANTIC_GATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/semantic-gate`;

export async function classifySemanticInput(input: string): Promise<SemanticGateResult> {
  const fallback: SemanticGateResult = { semantic_valid: false, semantic_domain: "non-school" };

  if (!input.trim()) return fallback;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(SEMANTIC_GATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ input: input.trim() }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      console.warn("[SemanticGate] HTTP error:", resp.status);
      return fallback;
    }

    const data = await resp.json();
    return {
      semantic_valid: Boolean(data.semantic_valid),
      semantic_domain: data.semantic_domain === "school" ? "school" : "non-school",
    };
  } catch (e) {
    console.warn("[SemanticGate] Fetch error:", e);
    return fallback;
  }
}
