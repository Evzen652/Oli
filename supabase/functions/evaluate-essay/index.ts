import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";

/**
 * EVALUATE-ESSAY — AI hodnocení slohu / krátkého vyprávěcího textu (Fáze 11).
 *
 * Vstup: { prompt, essay, grade_min?, min_words? }
 * Výstup: { score: 0-100, praise, suggestions: string[], errors?: string[] }
 *
 * Stateless. Žádný DB zápis (orchestrator si výsledek uloží do session_log).
 * Druhý průchod (peer-review) se nedělá — sloh je inherentně subjektivní,
 * jeden AI dává konzistentnější skóre než dva.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Jsi učitel českého jazyka na základní škole.
Hodnotíš krátké slohové práce dětí přiměřeně k jejich věku.

ZÁKLADNÍ PRAVIDLA:
- Buď laskavý a povzbuzující — text píše DÍTĚ, ne dospělý.
- VŽDY najdi něco pozitivního (i u slabšího textu).
- Skóre 0-100:
  • 90-100: výjimečně pěkný text pro daný ročník
  • 70-89:  solidní práce, splnil zadání
  • 60-69:  prošel — text v pořádku, jen drobné nedostatky
  • 40-59:  nedotažený nebo s více chybami
  • 0-39:   text neodpovídá zadání nebo je velmi krátký
- Buď přísnější u staršího ročníku, mírnější u mladšího.
- Hodnocení je ČISTĚ slohové: stavba, slovní zásoba, dodržení tématu, čtivost.
  Pravopisné chyby zmiň v "errors", ale výrazně neženou skóre dolů (čte
  to dítě, ne korektor — diktát se hodnotí jinde).
- Odpovídej POUZE česky, jen přes tool call.`;

const tools = [{
  type: "function",
  function: {
    name: "essay_grade",
    description: "Return structured grade for a child's essay.",
    parameters: {
      type: "object",
      properties: {
        score: {
          type: "number",
          description: "Score 0-100 according to rubric.",
        },
        praise: {
          type: "string",
          description: "1-2 věty pochvaly/povzbuzení (česky, dětem srozumitelně).",
        },
        suggestions: {
          type: "array",
          items: { type: "string" },
          description: "1-3 konkrétní tipy ke zlepšení (česky, kratší věty).",
        },
        errors: {
          type: "array",
          items: { type: "string" },
          description: "Volitelné: drobné pravopisné/slovosledné chyby k opravě (max 5, krátce). Prázdné pole pokud žádné.",
        },
      },
      required: ["score", "praise", "suggestions"],
      additionalProperties: false,
    },
  },
}];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, essay, grade_min, min_words } = await req.json();

    if (!prompt || !essay) {
      return new Response(
        JSON.stringify({ error: "Missing required: prompt, essay" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!hasAnyAiProvider()) {
      return new Response(
        JSON.stringify({ error: "AI provider not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const grade = grade_min ?? 5;
    const minWords = min_words ?? 30;

    // Slovní limit + sanity check
    const essayText = String(essay).slice(0, 4000);
    const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

    // Pokud je text drasticky pod minimem, neutrácet AI volání
    if (wordCount < Math.max(5, minWords / 3)) {
      return new Response(
        JSON.stringify({
          score: 10,
          praise: "Začátek máš, ale text je moc krátký. Zkus napsat víc!",
          suggestions: [`Napiš alespoň ${minWords} slov.`, "Rozveď, co se stalo a kdo tam byl."],
          errors: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = `Cílový ročník: ${grade}. ZŠ (žák ve věku ${grade + 6} let).
Zadání slohu:
"${prompt}"

Text žáka (${wordCount} slov):
---
${essayText}
---

Vyhodnoť podle rubriky a zavolej essay_grade.`;

    const response = await aiCall({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      tools,
      toolChoice: { type: "function", function: { name: "essay_grade" } },
      model: {
        groq: "llama-3.3-70b-versatile",
        lovable: "google/gemini-3-flash-preview",
      },
      temperature: 0.3,
      maxTokens: 600,
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("[evaluate-essay] AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      // Sanity clamp
      const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
      return new Response(
        JSON.stringify({
          score,
          praise: parsed.praise || "Pěkně se ti to povedlo.",
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
          errors: Array.isArray(parsed.errors) ? parsed.errors.slice(0, 5) : [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "No structured grade from AI" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[evaluate-essay] error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
