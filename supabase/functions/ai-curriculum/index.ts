import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// AI provider URLs
const GEMINI_URL  = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GROQ_URL    = "https://api.groq.com/openai/v1/chat/completions";
const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Models per provider
const GEMINI_MODEL  = "gemini-2.0-flash-lite";
const GROQ_MODEL    = "llama-3.3-70b-versatile";
const LOVABLE_MODEL = "google/gemini-3-flash-preview";

function getGeminiKey(): string | undefined {
  return Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_KEY");
}

type AICallResult = { response: Response; provider: string };

async function tryProvider(
  url: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  providerName: string,
): Promise<AICallResult> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });
  return { response: res, provider: providerName };
}

/**
 * 3-úrovňový AI fallback chain:
 *   Gemini  → Groq  → Lovable Gateway
 * Pokud první selže (4xx/5xx), zkusíme další. Vrátíme úspěšnou odpověď
 * nebo posledně neúspěšnou (s provider info).
 */
async function callAI(messages: Array<{ role: string; content: string }>): Promise<AICallResult> {
  const geminiKey  = getGeminiKey();
  const groqKey    = Deno.env.get("GROQ_API_KEY");
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  if (!geminiKey && !groqKey && !lovableKey) {
    throw new Error("Žádný AI provider není nakonfigurován (GEMINI_API_KEY, GROQ_API_KEY nebo LOVABLE_API_KEY).");
  }

  const chain: Array<{ name: string; url: string; key: string; model: string }> = [];
  if (geminiKey)  chain.push({ name: "Gemini",  url: GEMINI_URL,  key: geminiKey,  model: GEMINI_MODEL  });
  if (groqKey)    chain.push({ name: "Groq",    url: GROQ_URL,    key: groqKey,    model: GROQ_MODEL    });
  if (lovableKey) chain.push({ name: "Lovable", url: LOVABLE_URL, key: lovableKey, model: LOVABLE_MODEL });

  let lastResult: AICallResult | null = null;
  for (let i = 0; i < chain.length; i++) {
    const p = chain[i];
    const result = await tryProvider(p.url, p.key, p.model, messages, p.name);
    if (result.response.ok) {
      if (i > 0) console.log(`[ai-curriculum] ${p.name} succeeded after ${i} failed providers`);
      return result;
    }
    const errText = await result.response.clone().text();
    console.warn(`[ai-curriculum] ${p.name} ${result.response.status}: ${errText.slice(0, 200)}`);
    lastResult = result;
  }

  // Všechny selhaly — vrátíme poslední neúspěšný result
  return lastResult!;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Healthcheck — vrací které klíče jsou nastaveny
  const url = new URL(req.url);
  if (url.searchParams.get("healthcheck") === "1") {
    return new Response(JSON.stringify({
      gemini_api_key:  !!Deno.env.get("GEMINI_API_KEY"),
      google_ai_key:   !!Deno.env.get("GOOGLE_AI_KEY"),
      groq_api_key:    !!Deno.env.get("GROQ_API_KEY"),
      lovable_api_key: !!Deno.env.get("LOVABLE_API_KEY"),
      providers_chain: [
        getGeminiKey()                       ? "Gemini"  : null,
        Deno.env.get("GROQ_API_KEY")         ? "Groq"    : null,
        Deno.env.get("LOVABLE_API_KEY")      ? "Lovable" : null,
      ].filter(Boolean),
      keyPrefix: (Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_KEY"))?.slice(0, 8) ?? "not set",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, grade, subject, category, topic, skillId, skillDetail, scope } = await req.json();

    /**
     * SCOPE-BASED CONTEXT (token-efficient):
     *
     * Posíláme AI POUZE ten výřez DB, který je relevantní pro daný request:
     *   - scope="subjects"   → jen seznam subjects (jména, slugs) pro dedup
     *   - scope="categories" → categories pod selectedSubject
     *   - scope="topics"     → topics pod selectedCategory
     *   - scope="skills"     → code_skill_ids pod selectedTopic
     *   - scope nezadán → minimal (jen subject jména, žádné categories/topics)
     *
     * Důsledek: prompt size klesne z ~1000 tokenů na ~50-200 i s 100+ předměty.
     * Bezpečnostní limit: nikdy nepřekročit MAX_CONTEXT_ITEMS položek.
     */
    const MAX_CONTEXT_ITEMS = 200;
    let existingContext = "{}";

    if (scope === "subjects" || !scope) {
      const { data: subjects } = await supabase
        .from("curriculum_subjects")
        .select("name, slug")
        .limit(MAX_CONTEXT_ITEMS);
      existingContext = JSON.stringify({ subjects: subjects ?? [] });
    } else if (scope === "categories" && subject) {
      // Najdi subject_id podle jména a vrať jeho categories
      const { data: subjRow } = await supabase
        .from("curriculum_subjects")
        .select("id")
        .ilike("name", subject)
        .maybeSingle();
      if (subjRow?.id) {
        const { data: cats } = await supabase
          .from("curriculum_categories")
          .select("name, slug")
          .eq("subject_id", subjRow.id)
          .limit(MAX_CONTEXT_ITEMS);
        existingContext = JSON.stringify({ categories_under_subject: cats ?? [] });
      }
    } else if (scope === "topics" && category) {
      const { data: catRow } = await supabase
        .from("curriculum_categories")
        .select("id")
        .ilike("name", category)
        .maybeSingle();
      if (catRow?.id) {
        const { data: tops } = await supabase
          .from("curriculum_topics")
          .select("name, slug")
          .eq("category_id", catRow.id)
          .limit(MAX_CONTEXT_ITEMS);
        existingContext = JSON.stringify({ topics_under_category: tops ?? [] });
      }
    } else if (scope === "skills" && topic) {
      const { data: topRow } = await supabase
        .from("curriculum_topics")
        .select("id")
        .ilike("name", topic)
        .maybeSingle();
      if (topRow?.id) {
        const { data: skills } = await supabase
          .from("curriculum_skills")
          .select("name, code_skill_id")
          .eq("topic_id", topRow.id)
          .limit(MAX_CONTEXT_ITEMS);
        existingContext = JSON.stringify({ skills_under_topic: skills ?? [] });
      }
    }

    console.log(`[ai-curriculum] scope=${scope ?? "default"}, context bytes=${existingContext.length}`);

    // Build detailed context block
    let detailContext = "";
    if (grade) detailContext += `- **Ročník:** ${grade}\n`;
    if (subject) detailContext += `- **Předmět:** ${subject}\n`;
    if (category) detailContext += `- **Okruh:** ${category}\n`;
    if (topic) detailContext += `- **Téma:** ${topic}\n`;
    if (skillDetail) {
      detailContext += `- **Podtéma:** ${skillDetail.name}\n`;
      if (skillDetail.brief_description) detailContext += `  - Popis: ${skillDetail.brief_description}\n`;
      if (skillDetail.goals?.length) detailContext += `  - Cíle: ${skillDetail.goals.join("; ")}\n`;
      if (skillDetail.boundaries?.length) detailContext += `  - Hranice: ${skillDetail.boundaries.join("; ")}\n`;
      if (skillDetail.keywords?.length) detailContext += `  - Klíčová slova: ${skillDetail.keywords.join(", ")}\n`;
      if (skillDetail.help_hint) detailContext += `  - Nápověda: ${skillDetail.help_hint}\n`;
      if (skillDetail.help_common_mistake) detailContext += `  - Častá chyba: ${skillDetail.help_common_mistake}\n`;
      if (skillDetail.grade_min != null && skillDetail.grade_max != null) detailContext += `  - Rozsah ročníků: ${skillDetail.grade_min}–${skillDetail.grade_max}\n`;
      if (skillDetail.session_task_count) detailContext += `  - Počet úloh: ${skillDetail.session_task_count}\n`;
      if (skillDetail.input_type) detailContext += `  - Typ vstupu: ${skillDetail.input_type}\n`;
      if (skillDetail.code_skill_id) detailContext += `  - Kód generátoru: ${skillDetail.code_skill_id}\n`;
    } else if (skillId) {
      detailContext += `- **Podtéma ID:** ${skillId}\n`;
    }

    if (!getGeminiKey() && !Deno.env.get("GROQ_API_KEY")) {
      throw new Error("Žádný AI provider není nakonfigurován (GEMINI_API_KEY nebo GROQ_API_KEY).");
    }

    const systemPrompt = `Jsi pedagogický asistent pro české kurikulum (RVP ZV, 3.-9. ročník). Píšeš česky.

User prompt obsahuje konkrétní JSON příklad — drž se ho přesně.
Pokud admin žádá konzultaci (ne návrh), odpověz textem bez JSON bloku.

## Existující obsah (pro dedup, nepřidávej duplikáty)
${existingContext}

## Pravidlo pro konsolidaci (sloučení)
Když administrátor chce sloučit více podtémat do menšího počtu, MUSÍŠ:
1. Navrhnout nová podtémata s akcí "create" nebo "update"
2. Pro KAŽDÉ staré podtéma, které se nahrazuje, přidat položku s akcí "delete" obsahující alespoň { "name": "...", "code_skill_id": "..." }
Tím zajistíš, že staré záznamy nezůstanou v databázi.

${detailContext ? `\n## Aktuální kontext\n${detailContext}` : ""}`;

    console.log("[ai-curriculum] Sending request, messages:", messages.length + 1, "system prompt length:", systemPrompt.length);

    const { response, provider } = await callAI([
      { role: "system", content: systemPrompt },
      ...messages,
    ]);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ai-curriculum] ${provider} ${response.status}: ${errText.slice(0, 300)}`);
      // Extrahuj čitelnou zprávu — formát se liší mezi Gemini a Groq
      let aiMsg = errText.slice(0, 400);
      try {
        const parsed = JSON.parse(errText);
        // Groq: { error: { message: "..." } }
        // Gemini: [{ error: { message: "..." } }]
        aiMsg = parsed?.error?.message
          ?? parsed?.[0]?.error?.message
          ?? aiMsg;
        aiMsg = aiMsg.slice(0, 300);
      } catch { /* raw text */ }
      return new Response(JSON.stringify({ error: `${provider} ${response.status}: ${aiMsg}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "Žádná odpověď od AI.";

    return new Response(JSON.stringify({ reply: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-curriculum error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
