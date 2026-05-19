import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function getGeminiKey(): string | undefined {
  return Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_KEY");
}

type AICallResult = { response: Response; provider: string };

async function callAI(messages: Array<{ role: string; content: string }>): Promise<AICallResult> {
  const geminiKey = getGeminiKey();
  const groqKey = Deno.env.get("GROQ_API_KEY");

  // Zkus Gemini jako primární
  if (geminiKey) {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${geminiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: GEMINI_MODEL, messages }),
    });
    if (res.ok) return { response: res, provider: "Gemini" };
    const errText = await res.text();
    console.warn(`[ai-curriculum] Gemini ${res.status}, falling back to Groq. Body: ${errText.slice(0, 200)}`);
    // Fallback na Groq při jakékoli chybě
    if (groqKey) {
      console.log("[ai-curriculum] Using Groq fallback");
      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: GROQ_MODEL, messages }),
      });
      return { response: groqRes, provider: "Groq" };
    }
    // Vrátíme Gemini chybu pokud není Groq
    return { response: new Response(errText, { status: res.status, headers: { "Content-Type": "application/json" } }), provider: "Gemini" };
  }

  // Jen Groq
  if (groqKey) {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: GROQ_MODEL, messages }),
    });
    return { response: groqRes, provider: "Groq" };
  }

  throw new Error("Žádný AI provider není nakonfigurován (GEMINI_API_KEY nebo GROQ_API_KEY).");
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
      gemini_api_key: !!Deno.env.get("GEMINI_API_KEY"),
      google_ai_key: !!Deno.env.get("GOOGLE_AI_KEY"),
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

    const { messages, grade, subject, category, topic, skillId, skillDetail } = await req.json();

    // Load existing curriculum context from DB (minimální — jen names/slugs, bez skills)
    const { data: subjects } = await supabase
      .from("curriculum_subjects")
      .select("id, name, slug");

    const { data: categories } = await supabase
      .from("curriculum_categories")
      .select("id, name, slug, subject_id");

    const { data: topics } = await supabase
      .from("curriculum_topics")
      .select("id, name, slug, category_id");

    // Skills vynecháme — stovky řádků zbytečně plní kontext
    const existingContext = JSON.stringify({
      subjects: subjects?.map(s => ({ id: s.id, name: s.name, slug: s.slug })),
      categories: categories?.map(c => ({ id: c.id, name: c.name, slug: c.slug, subject_id: c.subject_id })),
      topics: topics?.map(t => ({ id: t.id, name: t.name, slug: t.slug, category_id: t.category_id })),
    });

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

    const systemPrompt = `Jsi odborný pedagogický asistent pro tvorbu kurikula české základní školy (3.–9. ročník).

**DŮLEŽITÉ: Veškeré odpovědi piš VÝHRADNĚ česky. Nepoužívej žádný jiný jazyk.**

## Úkol
Pomáháš administrátorovi budovat kurikulum české ZŠ (3.–9. ročník): předměty, okruhy, témata, podtémata (skills).

## Podporované typy vstupu pro skills (input_type)
text, number, fraction, select_one, comparison, drag_order, fill_blank, multi_select, match_pairs, categorize.
Každý skill MUSÍ mít jeden z těchto input_type.

## Pravidla
1. Vše česky, gramaticky správně, dle RVP pro daný ročník.
2. **ÚPLNOST:** Pro předmět navrhni 4–8 okruhů, pro okruh 4–8 témat, pro téma 3–6 podtémat. Nikdy 1–2 položky pokud o to admin výslovně nežádá.
3. Podtémata nesmí duplikovat existující obsah.
4. \`brief_description\` z pohledu žáka ve 2. osobě: "Naučíš se...", "Spočítáš...", "Poznáš...".
5. \`code_skill_id\` formát: "math-nazev" nebo "czech-nazev".
6. Každý skill musí mít \`help_visual_examples\` — pole stručných textových popisů s emoji/ASCII diagramy.

## Existující obsah v databázi
${existingContext}

## Formát návrhu
Když navrhuješ nový obsah, VŽDY odpověz ve strukturovaném JSON formátu uvnitř bloku \`\`\`json ... \`\`\`.
Struktura:
{
  "proposals": [
    {
      "type": "subject" | "category" | "topic" | "skill",
      "action": "create" | "update" | "delete",
      "data": {
        // Pro subject: { name, slug }
        // Pro category: { name, slug, subject_slug, description, fun_fact, sort_order }
        // Pro topic: { name, slug, category_slug, description, sort_order }
        // Pro skill: { name, code_skill_id, brief_description, grade_min, grade_max, input_type, goals: [], boundaries: [], keywords: [], help_hint, help_example, help_common_mistake, help_steps: [], help_visual_examples: [], topic_slug, sort_order }
      }
    }
  ],
  "explanation": "Stručné vysvětlení co a proč navrhuješ"
}

Pokud administrátor žádá jen o konzultaci nebo otázku (ne o generování obsahu), odpověz normálně textem bez JSON bloku.

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
