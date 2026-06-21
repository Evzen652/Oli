/**
 * anon-progress — serverové úložiště anonymního pokroku (Fáze 3, Možnost B).
 *
 * Klient drží náhodný anon_token (uuid) v localStorage a přes tuto funkci
 * ukládá/čte pokrok a stav trialu. Funkce běží se service-role klíčem a
 * obchází RLS — tabulky `anon_progress` / `anon_trial` nemají veřejné policy,
 * takže přímý klientský přístup je zakázán (token = tajemství, žádný leak).
 *
 * POST body: { action, token, grade?, topicId?, score? }
 *   action = "start-trial" | "get-trial" | "record" | "get" | "adopt"
 *
 * "adopt" (vyžaduje přihlášeného rodiče): přesune serverový anon pokrok
 *   (dle token NEBO inviteId) na jeho dítě (childId) → reálné session_logs.
 *   body: { action:"adopt", childId, token? , inviteId? }
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
    const body = await req.json();
    const { action, token, grade, topicId, score, childId, inviteId } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // "adopt" má vlastní ověření (přihlášený rodič) a token může přijít přes invite.
    if (action === "adopt") {
      // Ověř volajícího rodiče z JWT v Authorization hlavičce.
      const authHeader = req.headers.get("Authorization") ?? "";
      const jwt = authHeader.replace(/^Bearer\s+/i, "");
      const { data: userData } = await supabase.auth.getUser(jwt);
      const user = userData?.user;
      if (!user) return json({ error: "Nepřihlášený" }, 401);

      if (!childId || typeof childId !== "string") {
        return json({ error: "Chybí childId" }, 400);
      }
      // Rodič musí dané dítě vlastnit.
      const { data: child } = await supabase
        .from("children")
        .select("id, grade")
        .eq("id", childId)
        .eq("parent_user_id", user.id)
        .maybeSingle();
      if (!child) return json({ error: "Dítě nepatří tomuto účtu" }, 403);

      // Token přímo, nebo dohledat z pozvánky.
      let adoptToken: string | null =
        typeof token === "string" && UUID_RE.test(token) ? token : null;
      if (!adoptToken && typeof inviteId === "string") {
        const { data: inv } = await supabase
          .from("parent_invitations")
          .select("anon_token")
          .eq("id", inviteId)
          .maybeSingle();
        adoptToken = inv?.anon_token ?? null;
      }
      if (!adoptToken || !UUID_RE.test(adoptToken)) {
        return json({ error: "Žádný anon_token k adopci" }, 400);
      }

      const { data: rows } = await supabase
        .from("anon_progress")
        .select("topic_id, score, grade")
        .eq("anon_token", adoptToken);

      if (!rows || rows.length === 0) {
        return json({ ok: true, adopted: 0 });
      }

      const sessionId = crypto.randomUUID();
      const logs = rows.map((r: { topic_id: string; score: number | null; grade: number | null }) => ({
        session_id: sessionId,
        user_id: user.id,
        child_id: childId,
        skill_id: r.topic_id,
        correct: (r.score ?? 0) >= 0.5,
        help_used: false,
        level: 1,
      }));
      const { error: insErr } = await supabase.from("session_logs").insert(logs);
      if (insErr) return json({ error: insErr.message }, 500);

      // Doplň ročník dítěte, pokud chybí.
      const anonGrade = rows.find((r: { grade: number | null }) => r.grade)?.grade ?? null;
      if (anonGrade && (!child.grade || child.grade === 0)) {
        await supabase.from("children").update({ grade: anonGrade }).eq("id", childId);
      }

      // Spotřebuj serverová anon data + označ pozvánku jako accepted.
      await supabase.from("anon_progress").delete().eq("anon_token", adoptToken);
      await supabase.from("anon_trial").delete().eq("anon_token", adoptToken);
      if (typeof inviteId === "string") {
        await supabase
          .from("parent_invitations")
          .update({ status: "accepted", accepted_at: new Date().toISOString() })
          .eq("id", inviteId);
      }

      return json({ ok: true, adopted: logs.length });
    }

    // Úklid expirovaných anon dat (TTL = 14 dní trial + 30 dní = 44 dní).
    // Maže jen staré řádky → bezpečné volat kdykoli (idempotentní).
    if (action === "cleanup") {
      const cutoff = new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString();
      const p = await supabase.from("anon_progress").delete().lt("created_at", cutoff).select("id");
      const t = await supabase.from("anon_trial").delete().lt("started_at", cutoff).select("anon_token");
      return json({ ok: true, deletedProgress: p.data?.length ?? 0, deletedTrial: t.data?.length ?? 0 });
    }

    // Ostatní akce — pracují čistě s tokenem.
    if (!token || typeof token !== "string" || !UUID_RE.test(token)) {
      return json({ error: "Neplatný token" }, 400);
    }

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
