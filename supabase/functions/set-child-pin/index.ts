import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { hashPin, isValidPinFormat } from "../_shared/pin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rodič nastaví/změní/smaže PIN svého dítěte.
// Autorizace: JWT rodiče v Authorization headeru → ověříme vlastnictví dítěte.
// Hashování probíhá serverově; klient nikdy neposílá ani neukládá hash.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Chybí přihlášení." }, 401);
    }

    const { child_id, pin } = await req.json();
    if (!child_id || typeof child_id !== "string") {
      return json({ error: "Chybí identifikátor dítěte." }, 400);
    }
    // pin === null → smazání PINu; jinak musí být 4 číslice.
    const clearing = pin === null;
    if (!clearing && !isValidPinFormat(pin)) {
      return json({ error: "PIN musí být 4 číslice." }, 400);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Ověř, kdo volá (rodič), z JWT.
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData.user) {
      return json({ error: "Neplatné přihlášení." }, 401);
    }
    const parentId = userData.user.id;

    // Ověř vlastnictví dítěte.
    const { data: child, error: childErr } = await supabaseAdmin
      .from("children")
      .select("id, parent_user_id")
      .eq("id", child_id)
      .single();

    if (childErr || !child) {
      return json({ error: "Dítě nebylo nalezeno." }, 404);
    }
    if (child.parent_user_id !== parentId) {
      return json({ error: "K tomuto dítěti nemáte oprávnění." }, 403);
    }

    const pin_hash = clearing ? null : await hashPin(pin);

    const { error: updErr } = await supabaseAdmin
      .from("children")
      .update({ pin_hash, pin_failed_attempts: 0, pin_locked_until: null })
      .eq("id", child_id);

    if (updErr) {
      console.error("set-child-pin update error:", updErr);
      return json({ error: "PIN se nepodařilo uložit." }, 500);
    }

    return json({ ok: true, pin_set: !clearing }, 200);
  } catch (err) {
    console.error("set-child-pin error:", err);
    return json({ error: "Interní chyba serveru." }, 500);
  }
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
