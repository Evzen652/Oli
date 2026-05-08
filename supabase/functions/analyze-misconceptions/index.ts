// analyze-misconceptions — AI analyzuje session_logs žáka a detekuje vzorce chyb.
//
// Vstup:
//   { child_id?: string, user_id?: string, days?: number }
//   alespoň jeden z child_id/user_id; days = období analýzy (default 30)
//
// Postup:
//   1) Fetch session_logs s !correct (chyby) za posledních N dní
//   2) Group by skill_id
//   3) Pro každý skill s ≥ 3 chybami → zavolej AI s detail úloh + chyb
//   4) AI vrátí: pattern_label, description, suggestion, confidence
//   5) Upsert do student_misconceptions (active)
//   6) Pro skilly kde žák měl ≥ 5 úspěchů v řadě → resolve existing misconceptions
//
// Výstup:
//   { detected: number, resolved: number, skills_analyzed: number }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SessionLog {
  skill_id: string;
  correct: boolean;
  help_used: boolean;
  error_type: string | null;
  created_at: string;
  // Joined custom_exercises pro kontext (volitelně)
  question?: string;
  user_answer?: string;
}

const detectionTool = {
  type: "function",
  function: {
    name: "report_misconception",
    description:
      "Vrátí strukturovaný popis vzorce chyb žáka v daném skillu. Pokud nelze rozpoznat smysluplný vzorec, vrať confidence < 0.4.",
    parameters: {
      type: "object",
      properties: {
        pattern_label: {
          type: "string",
          description: "Krátký label vzoru (max 60 znaků). Např. 'Záměna sčítání a násobení u zlomků se stejným jmenovatelem'.",
        },
        description: {
          type: "string",
          description: "Detailní popis pro rodiče. 1-2 věty, vysvětlující co žák dělá špatně.",
        },
        suggestion: {
          type: "string",
          description: "Doporučení co s tím (1-2 věty). Např. 'Zopakovat základní pravidla a procvičit 5 jednoduchých příkladů.'",
        },
        confidence: {
          type: "number",
          description: "Jistota detekce 0-1. Pod 0.4 = nelze říct, 0.4-0.7 = pravděpodobné, 0.7+ = vysoké.",
        },
      },
      required: ["pattern_label", "description", "suggestion", "confidence"],
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    if (!hasAnyAiProvider()) {
      return new Response(
        JSON.stringify({ error: "AI provider not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Zjisti totožnost volajícího z JWT
    const token = authHeader.replace("Bearer ", "");
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: { user: callerUser }, error: userErr } = await authClient.auth.getUser(token);
    if (userErr || !callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerUserId = callerUser.id;

    const body = await req.json();
    const { child_id, user_id, days = 30 } = body ?? {};
    if (!child_id && !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing child_id or user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // IDOR guard: ověř vlastnictví dítěte před přístupem k datům
    if (child_id) {
      const { data: childRow } = await supabase
        .from("children")
        .select("parent_user_id, child_user_id")
        .eq("id", child_id)
        .maybeSingle();

      const isParent = childRow?.parent_user_id === callerUserId;
      const isChild = childRow?.child_user_id === callerUserId;

      if (!isParent && !isChild) {
        // Zkontroluj, zda je admin
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", callerUserId)
          .eq("role", "admin")
          .maybeSingle();
        if (!roleRow) {
          return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } else if (user_id && user_id !== callerUserId) {
      // user_id mode: smí přistupovat pouze k vlastním datům (nebo admin)
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", callerUserId)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Fetch logs
    let query = supabase
      .from("session_logs")
      .select("skill_id, correct, help_used, error_type, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    if (child_id) query = query.eq("child_id", child_id);
    else query = query.eq("user_id", user_id);

    const { data: logs, error: logsErr } = await query;
    if (logsErr) {
      console.error("[analyze-misconceptions] fetch logs error:", logsErr);
      return new Response(
        JSON.stringify({ error: logsErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const allLogs = (logs ?? []) as SessionLog[];

    // Group by skill, spočítej chyby a streaks
    const bySkill = new Map<string, SessionLog[]>();
    for (const log of allLogs) {
      if (!log.skill_id) continue;
      if (!bySkill.has(log.skill_id)) bySkill.set(log.skill_id, []);
      bySkill.get(log.skill_id)!.push(log);
    }

    let detected = 0;
    let resolved = 0;
    let skillsAnalyzed = 0;

    for (const [skillId, skillLogs] of bySkill.entries()) {
      const wrong = skillLogs.filter((l) => !l.correct);
      if (wrong.length < 3) continue; // nedost dat
      skillsAnalyzed++;

      // Sestavit context pro AI
      const errorTypes = wrong.map((l) => l.error_type).filter(Boolean);
      const correctRate = (skillLogs.length - wrong.length) / skillLogs.length;
      const userPrompt = `
Skill: ${skillId}
Celkem pokusů: ${skillLogs.length}
Chyb: ${wrong.length} (úspěšnost ${Math.round(correctRate * 100)} %)
Typy chyb (error_type pole): ${JSON.stringify(errorTypes)}

Detekuj, zda je v chybách rozpoznatelný systematický vzor.
Pokud ne, vrať confidence < 0.4.
`.trim();

      try {
        const resp = await aiCall({
          messages: [
            {
              role: "system",
              content:
                "Jsi pedagogický analytik. Z chyb žáka rozpoznáš systematický nepředpokládaný vzor (misconception). Buď konkrétní a stručný. Pokud chyby vypadají náhodně, vrať nízké confidence.",
            },
            { role: "user", content: userPrompt },
          ],
          tools: [detectionTool],
          toolChoice: { type: "function", function: { name: "report_misconception" } },
          model: {
            groq: "llama-3.3-70b-versatile",
            lovable: "openai/gpt-5-mini",
          },
        });

        if (!resp.ok) {
          console.warn(`[analyze-misconceptions] AI error for ${skillId}: ${resp.status}`);
          continue;
        }
        const data = await resp.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall?.function?.arguments) continue;
        const parsed = JSON.parse(toolCall.function.arguments);

        if (typeof parsed.confidence !== "number" || parsed.confidence < 0.4) {
          continue; // AI si není jistá → neukládat
        }

        // Upsert: pokud existuje active misconception pro stejné dítě+skill, aktualizuj
        const targetCol = child_id ? "child_id" : "user_id";
        const targetVal = child_id ?? user_id;
        const { data: existing } = await supabase
          .from("student_misconceptions")
          .select("id, evidence_count")
          .eq(targetCol, targetVal)
          .eq("skill_id", skillId)
          .eq("status", "active")
          .maybeSingle();

        if (existing) {
          await supabase
            .from("student_misconceptions")
            .update({
              pattern_label: parsed.pattern_label,
              description: parsed.description,
              suggestion: parsed.suggestion,
              confidence: parsed.confidence,
              evidence_count: existing.evidence_count + wrong.length,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("student_misconceptions").insert({
            [targetCol]: targetVal,
            skill_id: skillId,
            pattern_label: parsed.pattern_label,
            description: parsed.description,
            suggestion: parsed.suggestion,
            confidence: parsed.confidence,
            evidence_count: wrong.length,
            status: "active",
          });
        }
        detected++;
      } catch (e) {
        console.warn(`[analyze-misconceptions] Error for ${skillId}:`, e);
      }
    }

    // Resolve: skilly, kde má žák poslední 5 pokusů 100% úspěšnost → resolve active misconceptions
    for (const [skillId, skillLogs] of bySkill.entries()) {
      const recent = skillLogs.slice(0, 5);
      if (recent.length < 5) continue;
      const allCorrect = recent.every((l) => l.correct);
      if (!allCorrect) continue;
      const targetCol = child_id ? "child_id" : "user_id";
      const targetVal = child_id ?? user_id;
      const { data: toResolve } = await supabase
        .from("student_misconceptions")
        .select("id")
        .eq(targetCol, targetVal)
        .eq("skill_id", skillId)
        .eq("status", "active");
      if (toResolve && toResolve.length > 0) {
        await supabase
          .from("student_misconceptions")
          .update({ status: "resolved", resolved_at: new Date().toISOString() })
          .in("id", toResolve.map((r) => r.id));
        resolved += toResolve.length;
      }
    }

    return new Response(
      JSON.stringify({ detected, resolved, skills_analyzed: skillsAnalyzed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[analyze-misconceptions] error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
