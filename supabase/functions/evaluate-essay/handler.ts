/**
 * EVALUATE-ESSAY core handler — extrahovaná logika, testovatelná z vitestu.
 *
 * Bez Deno-specific importů. AI volání + env reader injektované přes deps,
 * takže test nemusí mít Deno runtime ani síťový access.
 *
 * index.ts wire-up: Deno.serve(createHandler({ aiCall, hasAnyAiProvider }))
 */

export interface EvaluateEssayDeps {
  /** AI gateway call — vrací fetch-compatible Response */
  aiCall: (opts: AiCallShape) => Promise<Response>;
  /** Vrací true, pokud je nakonfigurován GROQ nebo LOVABLE klíč */
  hasAnyAiProvider: () => boolean;
}

export interface AiCallShape {
  messages: Array<{ role: string; content: string }>;
  tools?: unknown[];
  toolChoice?: unknown;
  model: { groq: string; lovable: string };
  temperature?: number;
  maxTokens?: number;
}

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
        score: { type: "number", description: "Score 0-100 according to rubric." },
        praise: { type: "string", description: "1-2 věty pochvaly/povzbuzení (česky, dětem srozumitelně)." },
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

export function createEvaluateEssayHandler(deps: EvaluateEssayDeps) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { prompt, essay, grade_min, min_words } = await req.json();

      if (!prompt || !essay) {
        return jsonResp({ error: "Missing required: prompt, essay" }, 400);
      }

      if (!deps.hasAnyAiProvider()) {
        return jsonResp({ error: "AI provider not configured." }, 503);
      }

      const grade = grade_min ?? 5;
      const minWords = min_words ?? 30;

      const essayText = String(essay).slice(0, 4000);
      const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

      // Short-circuit: drasticky pod minimem → neutrácet AI
      if (wordCount < Math.max(5, minWords / 3)) {
        return jsonResp({
          score: 10,
          praise: "Začátek máš, ale text je moc krátký. Zkus napsat víc!",
          suggestions: [`Napiš alespoň ${minWords} slov.`, "Rozveď, co se stalo a kdo tam byl."],
          errors: [],
        });
      }

      const userPrompt = `Cílový ročník: ${grade}. ZŠ (žák ve věku ${grade + 6} let).
Zadání slohu:
"${prompt}"

Text žáka (${wordCount} slov):
---
${essayText}
---

Vyhodnoť podle rubriky a zavolej essay_grade.`;

      const response = await deps.aiCall({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools,
        toolChoice: { type: "function", function: { name: "essay_grade" } },
        model: { groq: "llama-3.3-70b-versatile", lovable: "google/gemini-3-flash-preview" },
        temperature: 0.3,
        maxTokens: 600,
      });

      if (!response.ok) {
        return jsonResp({ error: "AI gateway error" }, 500);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
        return jsonResp({
          score,
          praise: parsed.praise || "Pěkně se ti to povedlo.",
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
          errors: Array.isArray(parsed.errors) ? parsed.errors.slice(0, 5) : [],
        });
      }

      return jsonResp({ error: "No structured grade from AI" }, 500);
    } catch (e) {
      return jsonResp({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
    }
  };
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
