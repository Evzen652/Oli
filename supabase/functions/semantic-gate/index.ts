import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string" || !input.trim()) {
      return new Response(
        JSON.stringify({ semantic_valid: false, semantic_domain: "non-school" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      // On AI failure, default to non-valid (safe fallback)
      return new Response(
        JSON.stringify({ semantic_valid: false, semantic_domain: "non-school" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({
          semantic_valid: Boolean(parsed.semantic_valid),
          semantic_domain: parsed.semantic_domain === "school" ? "school" : "non-school",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback if no tool call returned
    return new Response(
      JSON.stringify({ semantic_valid: false, semantic_domain: "non-school" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("semantic-gate error:", e);
    return new Response(
      JSON.stringify({ semantic_valid: false, semantic_domain: "non-school" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
