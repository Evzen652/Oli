/**
 * anon-progress — serverové úložiště anonymního pokroku (Fáze 3, Možnost B).
 *
 * Klient drží náhodný anon_token (uuid) v localStorage a přes tuto funkci
 * ukládá/čte pokrok a stav trialu. Funkce běží se service-role klíčem a
 * obchází RLS — tabulky `anon_progress` / `anon_trial` nemají veřejné policy,
 * takže přímý klientský přístup je zakázán (token = tajemství, žádný leak).
 *
 * POST body: { action, token, grade?, topicId?, score? }
 *   action = "start-trial" | "get-trial" | "record" | "get"
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, token, grade, topicId, score } = await req.json();

    if (!token || typeof token !== "string" || !UUID_RE.test(token)) {
      return json({ error: "Neplatný token" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    switch (action) {
      case "start-trial": {
        // Idempotentní — pokud trial pro token existuje, neresetuj started_at.
        const { error } = await supabase
          .from("anon_trial")
          .upsert(
            { anon_token: token, grade: grade ?? null },
            { onConflict: "anon_token", ignoreDuplicates: true },
          );
        if (error) throw error;
        return json({ ok: true });
      }

      case "get-trial": {
        const { data, error } = await supabase
          .from("anon_trial")
          .select("grade, started_at")
          .eq("anon_token", token)
          .maybeSingle();
        if (error) throw error;
        return json({ ok: true, trial: data ?? null });
      }

      case "record": {
        if (!topicId || typeof topicId !== "string") {
          return json({ error: "Chybí topicId" }, 400);
        }
        const { error } = await supabase
          .from("anon_progress")
          .upsert(
            {
              anon_token: token,
              grade: grade ?? null,
              topic_id: topicId,
              completed: true,
              score: typeof score === "number" ? score : null,
            },
            { onConflict: "anon_token,topic_id" },
          );
        if (error) throw error;
        return json({ ok: true });
      }

      case "get": {
        const { data, error } = await supabase
          .from("anon_progress")
          .select("topic_id, completed, score, grade, created_at")
          .eq("anon_token", token);
        if (error) throw error;
        return json({ ok: true, progress: data ?? [] });
      }

      default:
        return json({ error: "Neznámá akce" }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
