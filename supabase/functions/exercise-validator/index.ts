import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Jsi seniorní pedagogický validátor a didaktický specialista pro základní školu (3.–9. třída). Tvým úkolem je kontrolovat kvalitu cvičení v rámci adaptivní výukové aplikace.

KONTEXT:
Aplikace je strukturovaná podle ročníků. Každé cvičení obsahuje:
- zadání úlohy (question)
- správnou odpověď (correct_answer)
- malou nápovědu (hints[0]) — jemně nasměruje, neprozradí řešení
- velkou nápovědu (hints[1]) — výrazně pomůže, postup/rozklad, stále neprozradí výsledek
- vysvětlení výsledku (solution_steps) — zobrazené po odpovědi žáka, krokové, unikátní, vysvětluje PROČ

KONTROLNÍ KRITÉRIA:

1) LOGIKA A SPRÁVNOST
- Zkontroluj, zda zadání dává smysl a není dvojznačné
- Ověř, že správná odpověď je skutečně správná
- Ověř, že neexistují další možné správné odpovědi (pokud to není explicitně uvedeno)

2) PŘIMĚŘENOST ROČNÍKU
- Jazyk zadání musí odpovídat věku žáka daného ročníku
- Obtížnost musí odpovídat danému ročníku
- Nepoužívej pojmy, které žák v daném ročníku ještě nemůže znát

3) MALÁ NÁPOVĚDA (hints[0])
- Musí žáka jemně nasměrovat, NE prozradit řešení
- Má být krátká, jednoduchá a motivující
- Musí být UNIKÁTNÍ pro daný příklad (odkazovat na konkrétní čísla/slova z otázky)
- Pokud je příliš obecná nebo naopak prozrazuje výsledek, uprav ji

4) VELKÁ NÁPOVĚDA (hints[1])
- Musí výrazně pomoci k vyřešení, ale stále neříct výsledek přímo
- Měla by obsahovat postup nebo rozklad problému pro KONKRÉTNÍ příklad
- Musí logicky navazovat na malou nápovědu
- Musí být UNIKÁTNÍ pro daný příklad

5) VYSVĚTLENÍ VÝSLEDKU (solution_steps)
- Musí být jasné, krokové a srozumitelné
- Musí vysvětlit PROČ je výsledek správně, ne jen CO je správně
- Musí být UNIKÁTNÍ pro daný příklad (žádné generické fráze)
- Jazyk musí odpovídat věku žáka

6) DIDAKTICKÁ KVALITA
- Cvičení musí rozvíjet konkrétní dovednost
- Nesmí být zbytečně matoucí
- Má podporovat pochopení, ne jen mechanické počítání

PRAVIDLA:
- Buď přísný, nekompromisní a konkrétní
- Nepoužívej obecné fráze
- Pokud je něco špatně, vždy to přepiš do správné podoby
- Pokud je vše v pořádku, potvrď kvalitu stručně
- Jazyk výstupu: čeština`;

function extractJsonFromResponse(response: string): unknown {
  let cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.search(/[\{\[]/);
  const isArray = jsonStart !== -1 && cleaned[jsonStart] === "[";
  const jsonEnd = cleaned.lastIndexOf(isArray ? "]" : "}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON object found in response");
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    cleaned = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, "");
    return JSON.parse(cleaned);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin role
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Use service role client to verify the user's JWT
    const adminClient = createClient(supabaseUrl, supabaseKey);
    
    let userId: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await adminClient.auth.getUser(token);
      userId = user?.id ?? null;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized — please log in" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { grade, skillId, skillName, exercises } = await req.json();

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return new Response(JSON.stringify({ error: "No exercises provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build user prompt with exercises
    const exerciseList = exercises.map((ex: any, i: number) => {
      return `--- Cvičení ${i + 1} (ID: ${ex.id}) ---
Otázka: ${ex.question}
Správná odpověď: ${ex.correct_answer}
Malá nápověda: ${(ex.hints && ex.hints[0]) || "CHYBÍ"}
Velká nápověda: ${(ex.hints && ex.hints[1]) || "CHYBÍ"}
Vysvětlení (solution_steps): ${JSON.stringify(ex.solution_steps || [])}
Možnosti: ${JSON.stringify(ex.options || [])}`;
    }).join("\n\n");

    const userPrompt = `Ročník: ${grade}. třída
Dovednost: ${skillName} (ID: ${skillId})

Zkontroluj následující cvičení podle všech 6 kritérií:

${exerciseList}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_validation_results",
              description: "Submit validation results for exercises",
              parameters: {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        exercise_id: { type: "string", description: "UUID of the exercise" },
                        status: { type: "string", enum: ["OK", "POTŘEBA_ÚPRAV"] },
                        problems: {
                          type: "array",
                          items: { type: "string" },
                          description: "List of specific problems found",
                        },
                        fixes: {
                          type: "object",
                          properties: {
                            question: { type: "string", description: "Corrected question (only if changed)" },
                            correct_answer: { type: "string", description: "Corrected answer (only if changed)" },
                            hints: {
                              type: "array",
                              items: { type: "string" },
                              description: "Array of exactly 2: [malá nápověda, velká nápověda]",
                            },
                            solution_steps: {
                              type: "array",
                              items: { type: "string" },
                              description: "Corrected step-by-step explanation",
                            },
                          },
                          additionalProperties: false,
                        },
                        note: { type: "string", description: "Pedagogické zdůvodnění změn" },
                      },
                      required: ["exercise_id", "status", "problems", "note"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["results"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_validation_results" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI validation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      // Fallback: try to parse from message content
      const content = aiResult.choices?.[0]?.message?.content;
      if (content) {
        try {
          const fallback = extractJsonFromResponse(content);
          return new Response(JSON.stringify(fallback), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (_) {
          // fall through to error
        }
      }
      return new Response(JSON.stringify({ error: "AI returned no structured result" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (_) {
      // AI returned truncated JSON — try to salvage
      parsed = extractJsonFromResponse(toolCall.function.arguments);
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("exercise-validator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
