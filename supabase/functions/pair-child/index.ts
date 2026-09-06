import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Omezení pokusů o uhodnutí párovacího kódu.
 *
 * Prostor kódů je 32^6 ≈ 1,07 miliardy a kód platí 48 hodin. Špatný pokus
 * nedopadne na žádný řádek `children`, takže ho nejde počítat u dítěte —
 * jediné místo, kde jde útok zachytit, je volající.
 *
 * Deset pokusů za čtvrt hodiny je pro dítě, které opisuje kód z papíru,
 * pohodlně nad rámec překlepů; pro hrubou sílu je to zeď.
 */
const MAX_POKUSU = 10;
const OKNO_MS = 15 * 60 * 1000;
const ZAMEK_MS = 60 * 60 * 1000;

/** Adresa volajícího podle hlaviček, které před funkci staví Supabase. */
function adresaVolajiciho(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "neznama";
}

/**
 * Hash adresy — ukládáme ho místo adresy samotné. K počítání pokusů stačí
 * a u aplikace pro děti nechceme držet víc, než je nutné.
 *
 * Sůl z prostředí brání tomu, aby šlo hashe zpětně zkoušet proti seznamu
 * adres (IPv4 jich má jen ~4 miliardy, což je bez soli projitelné).
 */
async function hashAdresy(ip: string): Promise<string> {
  const sul = Deno.env.get("PAIRING_HASH_SALT");
  if (!sul) {
    console.warn(
      "pair-child: PAIRING_HASH_SALT není nastavená — hashe IP jsou zpětně zkusitelné. " +
        "Nastav ji v Supabase Edge Functions Secrets.",
    );
  }
  const data = new TextEncoder().encode(`${sul ?? ""}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pairing_code } = await req.json();
    if (!pairing_code || typeof pairing_code !== "string" || pairing_code.length !== 6) {
      return new Response(JSON.stringify({ error: "Neplatný párovací kód." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ── Omezení pokusů ────────────────────────────────────────────────────
    const ipHash = await hashAdresy(adresaVolajiciho(req));
    const ted = Date.now();

    const { data: limit } = await supabaseAdmin
      .from("pairing_attempts")
      .select("attempts, window_started_at, locked_until")
      .eq("ip_hash", ipHash)
      .maybeSingle();

    if (limit?.locked_until && new Date(limit.locked_until).getTime() > ted) {
      return new Response(
        JSON.stringify({
          error: "Příliš mnoho pokusů. Zkus to prosím za hodinu, nebo požádej rodiče o nový kód.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /** Zaznamená neúspěšný pokus. Chybu spolkne — limit nesmí shodit párování. */
    const zapisNeuspech = async (): Promise<void> => {
      const oknoBezi =
        limit && ted - new Date(limit.window_started_at).getTime() < OKNO_MS;
      const pokusy = (oknoBezi ? limit!.attempts : 0) + 1;
      try {
        await supabaseAdmin.from("pairing_attempts").upsert({
          ip_hash: ipHash,
          attempts: pokusy >= MAX_POKUSU ? 0 : pokusy,
          window_started_at: oknoBezi
            ? limit!.window_started_at
            : new Date(ted).toISOString(),
          locked_until:
            pokusy >= MAX_POKUSU ? new Date(ted + ZAMEK_MS).toISOString() : null,
        });
      } catch (e) {
        console.error("pair-child: zápis limitu selhal:", e);
      }
    };

    // Find the child record
    const { data: child, error: childErr } = await supabaseAdmin
      .from("children")
      .select("*")
      .eq("pairing_code", pairing_code.toUpperCase())
      .single();

    if (childErr || !child) {
      // Jediný stav, který se počítá jako hádání. „Použitý" a „vypršelý" kód
      // znamenají, že volající kód SKUTEČNĚ měl — započítat je by zamykalo
      // děti, které to jen zkoušejí podruhé.
      await zapisNeuspech();
      return new Response(JSON.stringify({ error: "Kód nebyl nalezen." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (child.is_paired) {
      return new Response(JSON.stringify({ error: "Tento kód už byl použit." }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (new Date(child.pairing_code_expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Kód vypršel. Požádej rodiče o nový." }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Kód seděl → počítadlo pro tuhle adresu zahoď. Bez toho by se dítě, které
    // se předtím párkrát překleplo, mohlo zamknout při dalším spárování.
    try {
      await supabaseAdmin.from("pairing_attempts").delete().eq("ip_hash", ipHash);
    } catch (e) {
      console.error("pair-child: úklid limitu selhal:", e);
    }

    // Create child user account
    const childEmail = `child_${pairing_code.toLowerCase()}@app.internal`;
    const childPassword = crypto.randomUUID();

    const { data: newUser, error: signUpErr } = await supabaseAdmin.auth.admin.createUser({
      email: childEmail,
      password: childPassword,
      email_confirm: true,
      user_metadata: { role: "child", child_name: child.child_name },
    });

    if (signUpErr || !newUser.user) {
      console.error("Failed to create child user:", signUpErr);
      return new Response(JSON.stringify({ error: "Nepodařilo se vytvořit účet." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const childUserId = newUser.user.id;

    // Assign child role
    await supabaseAdmin.from("user_roles").insert({ user_id: childUserId, role: "child" });

    // Link child to parent
    await supabaseAdmin
      .from("children")
      .update({ child_user_id: childUserId, is_paired: true })
      .eq("id", child.id);

    // Sign in as the child to get a session token
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: childEmail,
    });

    // Use signInWithPassword instead for a proper session
    const { data: sessionData, error: sessionErr } = await supabaseAdmin.auth.signInWithPassword({
      email: childEmail,
      password: childPassword,
    });

    if (sessionErr || !sessionData.session) {
      return new Response(JSON.stringify({ error: "Účet vytvořen, ale přihlášení selhalo." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        session: sessionData.session,
        child_id: child.id,
        child_name: child.child_name,
        grade: child.grade,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("pair-child error:", err);
    return new Response(JSON.stringify({ error: "Interní chyba serveru." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
