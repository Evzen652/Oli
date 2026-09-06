import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Trvalé smazání rodičovského účtu i všech dat jeho dětí.
 *
 * Google Play i Apple vyžadují mazání účtu přímo v aplikaci u každé služby,
 * která umí účet založit. Bez téhle funkce se aplikace do obchodů nedostane.
 *
 * ── Bezpečnost ──────────────────────────────────────────────────────────────
 * Kdo se maže, se bere VÝHRADNĚ z JWT. Tělo požadavku nesmí obsahovat žádné id
 * — jinak by kdokoli se svým přihlášením smazal cizí účet. Tělo nese jen
 * potvrzovací slovo, aby omylem odeslaný požadavek neprošel.
 *
 * ── Pořadí ──────────────────────────────────────────────────────────────────
 * Mažeme od závislostí ke kořeni. Na cizí klíče se nespoléháme: `schema.sql`
 * je u tabulky `children` prokazatelně zastaralý (viz CLAUDE.md) a tichý
 * `ON DELETE` by tu byl neověřený předpoklad. Radši explicitní pořadí, které
 * si přečteš.
 *
 * ── Co se NEmaže ────────────────────────────────────────────────────────────
 * `anon_progress` a `anon_trial` visí na náhodném tokenu z prohlížeče, ne na
 * účtu — nemáme podle čeho je k účtu přiřadit. Mažou se samy podle lhůty
 * v zásadách soukromí (`LHUTA_ANON`).
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Chybí přihlášení." }, 401);
    }

    // Potvrzení musí dorazit v těle. Chrání proti požadavku odeslanému omylem
    // (překliknutí, dvojité odeslání, cizí skript) — bez něj se nic nesmaže.
    let body: { confirm?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "Chybí potvrzení." }, 400);
    }
    if (body.confirm !== "SMAZAT") {
      return json({ error: "Chybí potvrzení." }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await admin.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData.user) {
      return json({ error: "Neplatné přihlášení." }, 401);
    }
    const uid = userData.user.id;

    // ── 1. Zjisti děti ────────────────────────────────────────────────────
    const { data: deti, error: detiErr } = await admin
      .from("children")
      .select("id, child_user_id")
      .eq("parent_user_id", uid);

    if (detiErr) {
      console.error("delete-account: čtení dětí selhalo:", detiErr);
      return json({ error: "Účet se nepodařilo smazat." }, 500);
    }

    const childIds = (deti ?? []).map((d) => d.id);
    const childUserIds = (deti ?? [])
      .map((d) => d.child_user_id)
      .filter((v): v is string => typeof v === "string" && v.length > 0);

    /** Všechna auth id, pod kterými mohl kdokoli z rodiny cvičit. */
    const authIds = [uid, ...childUserIds];

    const smazano: Record<string, number> = {};
    const chyby: string[] = [];

    /**
     * Smaže řádky a zapíše výsledek. Chybu NEVYHAZUJE: když jedna tabulka
     * selže, chceme dokončit zbytek a smazat aspoň účet — nedomazaný účet,
     * ke kterému se uživatel nedostane, je horší než domazané sirotčí řádky.
     * Neúspěchy se vrátí volajícímu i do logu, aby šly dohledat.
     */
    const smaz = async (
      tabulka: string,
      sloupec: string,
      hodnoty: string[],
    ): Promise<void> => {
      if (hodnoty.length === 0) return;
      const { error, count } = await admin
        .from(tabulka)
        .delete({ count: "exact" })
        .in(sloupec, hodnoty);
      if (error) {
        console.error(`delete-account: ${tabulka}.${sloupec} selhalo:`, error);
        chyby.push(`${tabulka}.${sloupec}`);
        return;
      }
      smazano[`${tabulka}.${sloupec}`] = count ?? 0;
    };

    // ── 2. Data navázaná na děti ──────────────────────────────────────────
    await smaz("parent_assignments", "child_id", childIds);
    await smaz("parent_invitations", "child_id", childIds);
    await smaz("session_logs", "child_id", childIds);
    await smaz("skill_profiles", "child_id", childIds);
    await smaz("student_misconceptions", "child_id", childIds);

    // ── 3. Data navázaná na auth účty (rodič i spárované děti) ────────────
    // `student_skill_level.student_id` je auth id toho, kdo cvičil.
    await smaz("student_skill_level", "student_id", authIds);
    await smaz("session_logs", "user_id", authIds);
    await smaz("skill_profiles", "user_id", authIds);
    await smaz("student_misconceptions", "user_id", authIds);
    await smaz("report_settings", "user_id", authIds);
    await smaz("subscriptions", "user_id", authIds);
    await smaz("usage_tracking", "user_id", authIds);
    await smaz("user_roles", "user_id", authIds);

    // ── 4. Kořenové řádky ─────────────────────────────────────────────────
    await smaz("parent_assignments", "parent_user_id", [uid]);
    await smaz("children", "parent_user_id", [uid]);
    await smaz("profiles", "id", authIds);

    // ── 5. Auth účty ──────────────────────────────────────────────────────
    // Děti napřed: kdyby selhal rodič, nezůstane dítě s přístupem k datům,
    // která už neexistují.
    for (const childUserId of childUserIds) {
      const { error } = await admin.auth.admin.deleteUser(childUserId);
      if (error) {
        console.error("delete-account: smazání dětského účtu selhalo:", error);
        chyby.push(`auth:${childUserId}`);
      }
    }

    const { error: authErr } = await admin.auth.admin.deleteUser(uid);
    if (authErr) {
      console.error("delete-account: smazání účtu rodiče selhalo:", authErr);
      // Tohle je jediná chyba, která znamená neúspěch celé operace: uživatel
      // by se pořád mohl přihlásit, jen do prázdna. Musí se to dozvědět.
      return json(
        {
          error:
            "Data byla smazána, ale samotný účet se zrušit nepodařilo. " +
            "Napište nám, prosím — dokončíme to ručně.",
          smazano,
          chyby,
        },
        500,
      );
    }

    return json({ ok: true, smazano, chyby }, 200);
  } catch (err) {
    console.error("delete-account: neočekávaná chyba:", err);
    return json({ error: "Účet se nepodařilo smazat." }, 500);
  }
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
