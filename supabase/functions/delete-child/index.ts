import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Trvalé smazání JEDNOHO dítěte rodičem — i s jeho účtem a všemi daty.
 *
 * Proč vznikla (2026-10-07): rodičovský přehled mazal dítě přímo z klienta
 * (`children.delete()`), a dialog přitom slibuje „Všechna data budou
 * nenávratně ztracena". Nebyla: kaskáda z `children` smaže jen řádky
 * navázané přes `child_id`. Zůstával **účet dítěte v auth** (s jménem dítěte
 * v `user_metadata`, viz `pair-child`), jeho úrovně v `student_skill_level`
 * (klíč je auth id, ne `children.id`) a řádky pod jeho `user_id`. Účet
 * v auth z klienta smazat nejde — proto serverová funkce.
 *
 * ── Bezpečnost ──────────────────────────────────────────────────────────────
 * Rodič se bere VÝHRADNĚ z JWT. `childId` v těle je jen „které z mých dětí" —
 * funkce ho smaže, jen když `children.parent_user_id` = rodič z JWT. Cizí
 * nebo neexistující dítě dostane stejnou odpověď 403, aby se nedalo
 * zkoušet, které id existuje. Záměrně ne 404: tu vrací Supabase, když
 * funkce není nasazená, a klient podle ní pozná, že má mazat postaru
 * (`funkceNedostupna` v `src/lib/edgeFunctionError.ts`). Potvrzovací slovo jako
 * u `delete-account`.
 *
 * ── Pořadí ──────────────────────────────────────────────────────────────────
 * Stejný přístup jako `delete-account`: explicitně od závislostí ke kořeni,
 * na `ON DELETE` se nespoléháme. Seznam tabulek je záměrně shodný s tím,
 * co `delete-account` maže pro jedno dítě — hlídá to
 * `src/test/delete-child.test.ts`.
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

    let body: { childId?: unknown; confirm?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "Chybí potvrzení." }, 400);
    }
    if (body.confirm !== "SMAZAT") {
      return json({ error: "Chybí potvrzení." }, 400);
    }
    const childId = typeof body.childId === "string" ? body.childId : "";
    if (!UUID_RE.test(childId)) {
      return json({ error: "Dítě nenalezeno." }, 403);
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

    // ── 1. Ověř, že dítě patří tomuhle rodiči ─────────────────────────────
    const { data: dite, error: diteErr } = await admin
      .from("children")
      .select("id, child_user_id")
      .eq("id", childId)
      .eq("parent_user_id", uid)
      .maybeSingle();

    if (diteErr) {
      console.error("delete-child: čtení dítěte selhalo:", diteErr);
      return json({ error: "Dítě se nepodařilo smazat." }, 500);
    }
    if (!dite) {
      return json({ error: "Dítě nenalezeno." }, 403);
    }

    const childUserId =
      typeof dite.child_user_id === "string" && dite.child_user_id.length > 0
        ? dite.child_user_id
        : null;
    // Rodič sám se mezi auth id dítěte NIKDY nedostane — jinak by se mu
    // smazaly jeho vlastní řádky pod `user_id`.
    const authIds = childUserId && childUserId !== uid ? [childUserId] : [];

    const smazano: Record<string, number> = {};
    const chyby: string[] = [];

    /** Viz `delete-account`: chybu nevyhazuje, dokončí zbytek a nahlásí ji. */
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
        console.error(`delete-child: ${tabulka}.${sloupec} selhalo:`, error);
        chyby.push(`${tabulka}.${sloupec}`);
        return;
      }
      smazano[`${tabulka}.${sloupec}`] = count ?? 0;
    };

    // ── 2. Data navázaná na dítě ──────────────────────────────────────────
    await smaz("parent_assignments", "child_id", [childId]);
    // `parent_invitations.child_id` odkazuje na auth id dítěte (migrace
    // 20260524180000), ne na `children.id` — maž podle obojího.
    await smaz("parent_invitations", "child_id", [childId, ...authIds]);
    await smaz("session_logs", "child_id", [childId]);
    await smaz("skill_profiles", "child_id", [childId]);
    await smaz("student_misconceptions", "child_id", [childId]);

    // ── 3. Data navázaná na účet dítěte ───────────────────────────────────
    await smaz("student_skill_level", "student_id", authIds);
    await smaz("session_logs", "user_id", authIds);
    await smaz("skill_profiles", "user_id", authIds);
    await smaz("student_misconceptions", "user_id", authIds);
    await smaz("report_settings", "user_id", authIds);
    await smaz("subscriptions", "user_id", authIds);
    await smaz("usage_tracking", "user_id", authIds);
    await smaz("user_roles", "user_id", authIds);
    await smaz("profiles", "id", authIds);

    // ── 4. Kořenový řádek ─────────────────────────────────────────────────
    const { error: rowErr } = await admin
      .from("children")
      .delete()
      .eq("id", childId)
      .eq("parent_user_id", uid);
    if (rowErr) {
      console.error("delete-child: smazání řádku dítěte selhalo:", rowErr);
      return json({ error: "Dítě se nepodařilo smazat.", smazano, chyby }, 500);
    }

    // ── 5. Účet dítěte ────────────────────────────────────────────────────
    for (const id of authIds) {
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) {
        console.error("delete-child: smazání dětského účtu selhalo:", error);
        return json(
          {
            error:
              "Dítě zmizelo z přehledu, ale jeho přihlašovací účet se zrušit " +
              "nepodařilo. Napište nám, prosím — dokončíme to ručně.",
            smazano,
            chyby,
          },
          500,
        );
      }
    }

    return json({ ok: true, smazano, chyby }, 200);
  } catch (err) {
    console.error("delete-child: neočekávaná chyba:", err);
    return json({ error: "Dítě se nepodařilo smazat." }, 500);
  }
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
