import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    // Load existing curriculum context from DB
    const { data: subjects } = await supabase
      .from("curriculum_subjects")
      .select("id, name, slug");

    const { data: categories } = await supabase
      .from("curriculum_categories")
      .select("id, name, slug, subject_id, description, fun_fact");

    const { data: topics } = await supabase
      .from("curriculum_topics")
      .select("id, name, slug, category_id, description");

    const { data: skills } = await supabase
      .from("curriculum_skills")
      .select("id, name, code_skill_id, brief_description, grade_min, grade_max, input_type, topic_id, is_active");

    const existingContext = JSON.stringify({
      subjects: subjects?.map(s => ({ id: s.id, name: s.name, slug: s.slug })),
      categories: categories?.map(c => ({ id: c.id, name: c.name, slug: c.slug, subject_id: c.subject_id })),
      topics: topics?.map(t => ({ id: t.id, name: t.name, slug: t.slug, category_id: t.category_id })),
      skills: skills?.map(s => ({ id: s.id, name: s.name, code_skill_id: s.code_skill_id, grade_min: s.grade_min, grade_max: s.grade_max, topic_id: s.topic_id, is_active: s.is_active })),
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

    if (!hasAnyAiProvider()) {
      throw new Error(
        "Žádný AI provider není nakonfigurován. Nastavte GROQ_API_KEY (preferováno) " +
        "nebo LOVABLE_API_KEY v Supabase Edge Functions Secrets."
      );
    }

    const systemPrompt = `Jsi odborný pedagogický asistent pro tvorbu kurikula české základní školy (3.–9. ročník).

**DŮLEŽITÉ: Veškeré odpovědi piš VÝHRADNĚ česky. Nepoužívej žádný jiný jazyk — ani němčinu, angličtinu, španělštinu, portugalštinu ani jiný. Pokud nevíš české slovo, popiš pojem opisem v češtině.**

## Tvůj úkol
Pomáháš administrátorovi vytvářet a spravovat obsah výukové aplikace. Na základě jeho instrukcí navrhuješ strukturu kurikula: předměty, okruhy (categories), témata (topics) a podtémata (skills).

## Technická omezení aplikace

Aplikace je webová a podporuje POUZE tyto typy cvičení (input_type):

| Typ | Popis | Příklad |
|-----|-------|---------|
| \`text\` | Žák napíše krátkou textovou odpověď (slovo, frázi) | "Doplň i/y: vel_ký" → žák napíše "i" |
| \`number\` | Žák zadá číslo | "Kolik je 24 + 17?" → 41 |
| \`fraction\` | Žák zadá zlomek (čitatel/jmenovatel) | "Zkrať zlomek 6/10" → 3/5 |
| \`select_one\` | Výběr 1 správné odpovědi z 2–4 možností | "Jaký tvar má 4 strany?" → čtverec |
| \`comparison\` | Porovnání dvou hodnot (<, =, >) | "3/5 _ 2/5" → > |
| \`drag_order\` | Seřazení položek do správného pořadí | "Seřaď od nejmenšího: 5, 2, 8" |
| \`fill_blank\` | Doplňovačka — věta s prázdnými místy (___) | "Mama koupila vel___ké jablko" → "i" |
| \`multi_select\` | Výběr více správných odpovědí (checkboxy) | "Vyber všechna sudá čísla: 2, 3, 4, 7" → [2, 4] |
| \`match_pairs\` | Přiřazování párů (levý sloupec ↔ pravý) | "Spoj zvíře se skupinou: pes→savci, orel→ptáci" |
| \`categorize\` | Třídění položek do 2–3 kategorií | "Rozřaď: domácí vs. volně žijící zvířata" |

### Co aplikace NEUMÍ (NIKDY nenavrhuj):
- ❌ Kreslení, rýsování, interaktivní geometrii na plátně
- ❌ Měření pravítkem, kružítkem ani jiné práce s fyzickými nástroji
- ❌ Nalepování, skládání papíru, modelování z hmoty
- ❌ Hlasový vstup, diktování, nahrávání zvuku
- ❌ Otevřené esejové odpovědi (AI je nehodnotí)
- ❌ Práci s obrázky (žák nemůže kreslit ani vybírat oblasti obrázku)
- ❌ Interaktivní manipulaci s objekty na obrazovce (pouze klikání na tlačítka)

### Pravidlo:
Každá navrhovaná dovednost MUSÍ být realizovatelná jedním z 10 podporovaných typů vstupu. Pokud téma vyžaduje interaktivitu, kterou aplikace nepodporuje, navrhni alternativní formu. Například:
- Místo "Nakresli čtverec" → "Kolik stran má čtverec?" (select_one)
- Místo "Změř délku úsečky" → "Úsečka měří 5 cm a 3 mm. Kolik je to mm?" (number)
- Místo "Rýsuj pravý úhel" → "Který z úhlů je pravý?" (select_one)
- Místo "Složíš-li papír na půl" → "Má tento tvar osu souměrnosti?" (select_one)
- Místo "Rozřaď zvířata do skupin" → (categorize) s kategoriemi "Savci" a "Ptáci"

## Pravidla
1. Veškerý obsah MUSÍ být v češtině, gramaticky správný a věcně přesný.
2. Obsah musí odpovídat RVP (Rámcový vzdělávací program) pro daný ročník.
3. Nápovědy NESMÍ prozrazovat odpověď — pouze navádějí k řešení.
4. Každé podtéma potřebuje: název, popis, cíle, hranice, klíčová slova, nápovědu (hint, kroky, příklad, častá chyba).
5. Podtémata musí být konzistentní s existujícím obsahem — nesmí duplikovat.
6. \`brief_description\` MUSÍ být formulován z pohledu žáka ve 2. osobě (ty). Popisuje, co se žák naučí nebo procvičí. Správně: "Naučíš se...", "Spočítáš...", "Poznáš...". Špatně: "Vybrat...", "Převést...", "Určit..." (infinitiv/popis úkolu).
6. code_skill_id je identifikátor JS generátoru v kódu (formát: "math-nazev-tematu" nebo "czech-nazev-tematu").
7. U každého podtématu MUSÍ být uveden input_type z podporovaného seznamu výše.
8. Každé podtéma MUSÍ obsahovat **help_visual_examples** — pole textových popisů vizuálních pomůcek pro sekci "Jak to vypadá?". Příklady:
   - Pro zlomky: ["Představ si pizzu rozdělenou na 4 díly. Když sníš 1 díl, sníš 1/4 pizzy. 🍕 ■□□□ = 1/4"]
   - Pro geometrii: ["Čtverec: 4 stejně dlouhé strany, 4 pravé úhly ⬜", "Obdélník: 2 kratší + 2 delší strany 🟦"]
   - Pro porovnávání: ["Číselná osa: ←──3──4──5──6──→  Číslo více vpravo je VĚTŠÍ"]
   - Pro prvouku: ["🐕 Pes = savec (má srst, rodí živá mláďata)", "🦅 Orel = pták (má peří, klade vejce)"]
   Používej emoji, ASCII diagramy a jednoduché vizuální reprezentace. Každý příklad na samostatném řádku.

## Formátování odpovědí
- Vždy začni krátkým odkazem na aktuální kontext (ročník, předmět, téma).
- Používej **tučné písmo** pro klíčové pojmy.
- Používej odrážky a číslované seznamy místo dlouhých odstavců.
- Odpovědi strukturuj přehledně: krátké odstavce, jasné nadpisy (## nebo ###).
- Maximálně 2–3 věty na odstavec.

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

    console.log("Sending AI request, message count:", messages.length + 1, "system prompt length:", systemPrompt.length);

    const response = await aiCall({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: {
        // Curriculum wizard — větší kontext, lepší rozumění strukturám
        groq: "llama-3.3-70b-versatile",
        lovable: "openai/gpt-5-mini",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Příliš mnoho požadavků, zkuste to za chvíli." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Nedostatek kreditů. Dobijte prosím workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Chyba AI služby", details: `Status: ${response.status}` }), {
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
