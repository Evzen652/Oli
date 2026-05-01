/**
 * SEMANTIC GATE core handler — extrahovaná logika, testovatelná z vitestu.
 *
 * AI klasifikace, zda je vstup žáka smysluplný školní termín. Stateless,
 * fail-closed (na chybě vrací non-school).
 *
 * index.ts wire-up: serve(createSemanticGateHandler({ fetch, getApiKey }))
 */

export interface SemanticGateDeps {
  fetch: typeof globalThis.fetch;
  /** Vrátí LOVABLE_API_KEY z env, nebo undefined pokud chybí */
  getApiKey: () => string | undefined;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FALLBACK = { semantic_valid: false, semantic_domain: "non-school" as const };

export function createSemanticGateHandler(deps: SemanticGateDeps) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { input } = await req.json();
      if (!input || typeof input !== "string" || !input.trim()) {
        return jsonResp(FALLBACK);
      }

      const apiKey = deps.getApiKey();
      if (!apiKey) {
        // Žádný klíč → throw (handler catch ho převede na fallback)
        throw new Error("LOVABLE_API_KEY is not configured");
      }

      const response = await deps.fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content:
                  "You are a classifier that determines whether a student's input is a meaningful school-related term or phrase. You MUST call the classify_input function with your result. Do not generate any text.",
              },
              {
                role: "user",
                content: `Classify this input: "${input.trim()}"`,
              },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "classify_input",
                  description:
                    "Classify whether the input is a meaningful school-related term or phrase.",
                  parameters: {
                    type: "object",
                    properties: {
                      semantic_valid: {
                        type: "boolean",
                        description:
                          "true if the input is a meaningful school subject, topic, or educational concept (e.g. zlomky, rovnice, procenta, dělení, český jazyk, vyjmenovaná slova). false if it is nonsense, random characters, unrelated words (banán, auto), or emoji.",
                      },
                      semantic_domain: {
                        type: "string",
                        enum: ["school", "non-school"],
                        description:
                          "school if the input relates to education/academics, non-school otherwise.",
                      },
                    },
                    required: ["semantic_valid", "semantic_domain"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: {
              type: "function",
              function: { name: "classify_input" },
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          return jsonResp({ error: "Rate limited, please try again later." }, 429);
        }
        if (response.status === 402) {
          return jsonResp({ error: "Payment required." }, 402);
        }
        // Jiný error → fallback (safe)
        return jsonResp(FALLBACK);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        return jsonResp({
          semantic_valid: Boolean(parsed.semantic_valid),
          semantic_domain: parsed.semantic_domain === "school" ? "school" : "non-school",
        });
      }

      // Žádný tool call → fallback
      return jsonResp(FALLBACK);
    } catch {
      // Catch-all → fail-closed (non-school)
      return jsonResp(FALLBACK);
    }
  };
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
