import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const url = new URL(req.url);
    const childId = url.searchParams.get("child_id");
    let childName: string | null = null;

    if (childId) {
      const { data: child, error: childError } = await supabase
        .from("children")
        .select("id, child_name, parent_user_id")
        .eq("id", childId)
        .single();

      if (childError || !child) {
        return new Response(JSON.stringify({ error: "Child not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (child.parent_user_id !== userId) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      childName = child.child_name;
    }

    let logsQuery = supabase.from("session_logs").select("*");

    if (childId) {
      logsQuery = logsQuery.eq("child_id", childId);
    } else {
      logsQuery = logsQuery.eq("user_id", userId);
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    logsQuery = logsQuery.gte("created_at", weekAgo).order("created_at", { ascending: false });

    const { data: logs } = await logsQuery;

    // Aggregate skills directly from session_logs for the week
    const skillMap = new Map<string, { attempts: number; correct: number; withHelp: number; wrong: number }>();
    for (const log of logs || []) {
      const entry = skillMap.get(log.skill_id) || { attempts: 0, correct: 0, withHelp: 0, wrong: 0 };
      entry.attempts++;
      if (log.correct && !log.help_used) entry.correct++;
      else if (log.correct && log.help_used) entry.withHelp++;
      else if (!log.correct) entry.wrong++;
      skillMap.set(log.skill_id, entry);
    }

    // Resolve skill IDs to Czech names from curriculum_skills
    const skillIds = Array.from(skillMap.keys());
    const skillNameMap = new Map<string, string>();
    if (skillIds.length > 0) {
      const { data: skillRows } = await supabase
        .from("curriculum_skills")
        .select("code_skill_id, name")
        .in("code_skill_id", skillIds);
      for (const row of skillRows || []) {
        skillNameMap.set(row.code_skill_id, row.name);
      }
    }

    const skillSummaries = Array.from(skillMap.entries()).map(([skill, s]) => ({
      skill,
      skillName: skillNameMap.get(skill) ?? skill,
      mastery: s.attempts > 0 ? s.correct / s.attempts : 0,
      attempts: s.attempts,
      correct: s.correct,
      error_streak: 0,
      weak_patterns: [],
    }));

    const totalSessions = new Set((logs || []).map((l) => l.session_id)).size;
    const totalAttempts = (logs || []).length;
    const totalCorrect = (logs || []).filter((l) => l.correct && !l.help_used).length;
    const totalWithHelp = (logs || []).filter((l) => l.correct && l.help_used).length;
    const totalWrong = (logs || []).filter((l) => !l.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    const errorTypes: Record<string, number> = {};
    for (const log of logs || []) {
      if (log.error_type) {
        errorTypes[log.error_type] = (errorTypes[log.error_type] || 0) + 1;
      }
    }

    if (!logs?.length) {
      return new Response(
        JSON.stringify({
          report: {
            summary: "Tento týden zatím žádné procvičování neproběhlo. Zkuste s dítětem začít krátkou session!",
            skills: [],
            stats: { sessions: 0, attempts: 0, accuracy: 0, withHelp: 0, wrong: 0 },
            recommendations: "Doporučujeme začít s krátkým 5minutovým procvičováním každý den.",
            childName,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({
          report: {
            summary: `Tento týden: ${totalSessions} sezení, ${totalAttempts} úloh, úspěšnost ${accuracy}%.`,
            skills: skillSummaries,
            stats: { sessions: totalSessions, attempts: totalAttempts, accuracy, withHelp: totalWithHelp, wrong: totalWrong },
            errors: errorTypes,
            recommendations: "Data jsou dostupná, ale AI narace není k dispozici.",
            childName,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiPrompt = `Vytvoř stručný a srozumitelný týdenní report pro rodiče o procvičování jejich dítěte${childName ? ` (${childName})` : ""}.

DATA:
- Počet sezení: ${totalSessions}
- Celkem úloh: ${totalAttempts}
- Správně samostatně: ${totalCorrect}
- Správně s nápovědou: ${totalWithHelp}
- Špatně: ${totalWrong}
- Úspěšnost (samostatně): ${accuracy}%
- Dovednosti (používej vždy pole "skillName" jako český název, NIKDY nezobrazuj technické ID z pole "skill"): ${JSON.stringify(skillSummaries.map(s => ({ název: s.skillName, mastery: s.mastery, úlohy: s.attempts, správně: s.correct })))}
- Nejčastější chyby: ${JSON.stringify(errorTypes)}

PRAVIDLA:
- Piš česky, srozumitelně pro běžného rodiče (žádné technické termíny!)
- Buď pozitivní, ale upřímný
- Používej konkrétní čísla
- DŮLEŽITÉ: Vždy používej české názvy dovedností (např. "Části lidského těla", "Párové souhlásky"), nikdy technické kódy!
- U dovedností uveď slovní hodnocení: "Výborně zvládá" (mastery >= 0.85), "Potřebuje procvičit" (>= 0.5), "Začíná se učit" (< 0.5)

FORMÁT:
1. summary: 2-3 věty celkového shrnutí (jak se dítěti daří, co dělalo)
2. strengths: Co dítě zvládá dobře (konkrétně)
3. to_practice: Co ještě potřebuje procvičit (konkrétně)
4. recommendations: 2-3 konkrétní tipy pro rodiče co dělat doma (ne obecné fráze)
5. skill_verdicts: Ke každému skill_id slovní hodnocení (1-3 slova)

Zavolej funkci weekly_report s výsledkem.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Jsi laskavý asistent pro rodičovské reporty. Píšeš srozumitelně, konkrétně a pozitivně. Žádné technické termíny." },
          { role: "user", content: aiPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "weekly_report",
              description: "Return structured weekly report for parents.",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "2-3 sentence overview for parents." },
                  strengths: { type: "string", description: "What the child does well, specific." },
                  to_practice: { type: "string", description: "What needs more practice, specific." },
                  recommendations: { type: "string", description: "2-3 concrete tips for parents." },
                  skill_verdicts: {
                    type: "object",
                    description: "Map of skill_id to short verbal verdict (e.g. 'Výborně zvládá').",
                    additionalProperties: { type: "string" },
                  },
                },
                required: ["summary", "strengths", "to_practice", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "weekly_report" } },
      }),
    });

    if (!aiResponse.ok) {
      return new Response(
        JSON.stringify({
          report: {
            summary: `Tento týden: ${totalSessions} sezení, ${totalAttempts} úloh, úspěšnost ${accuracy}%.`,
            skills: skillSummaries,
            stats: { sessions: totalSessions, attempts: totalAttempts, accuracy, withHelp: totalWithHelp, wrong: totalWrong },
            errors: errorTypes,
            recommendations: "AI report není momentálně dostupný.",
            childName,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let narrative = { summary: "", strengths: "", to_practice: "", recommendations: "", skill_verdicts: {} as Record<string, string> };

    if (toolCall?.function?.arguments) {
      narrative = JSON.parse(toolCall.function.arguments);
    }

    // Merge AI verdicts into skill summaries
    const enrichedSkills = skillSummaries.map(s => ({
      ...s,
      verdict: narrative.skill_verdicts?.[s.skill] ?? undefined,
    }));

    return new Response(
      JSON.stringify({
        report: {
          summary: narrative.summary,
          strengths: narrative.strengths,
          to_practice: narrative.to_practice,
          recommendations: narrative.recommendations,
          skills: enrichedSkills,
          stats: { sessions: totalSessions, attempts: totalAttempts, accuracy, withHelp: totalWithHelp, wrong: totalWrong },
          errors: errorTypes,
          childName,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("weekly-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
