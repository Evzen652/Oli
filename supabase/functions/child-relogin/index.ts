import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { verifyPin, isValidPinFormat } from "../_shared/pin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

// Dítě se vrací do svého účtu po odhlášení: zařízení si pamatuje child_user_id
// (localStorage), dítě zadá jen PIN. Po ověření server sám vydá session — heslo
// účtu zůstává silné a náhodné (přehashujeme ho a hned se přihlásíme).
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { child_user_id, pin } = await req.json();
    if (!child_user_id || typeof child_user_id !== "string") {
      return json({ error: "Chybí identifikátor dítěte." }, 400);
    }
    if (!isValidPinFormat(pin)) {
      return json({ error: "PIN musí být 4 číslice." }, 400);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: child, error: childErr } = await supabaseAdmin
      .from("children")
      .select("id, child_name, grade, pin_hash, pin_failed_attempts, pin_locked_until")
      .eq("child_user_id", child_user_id)
      .single();

    if (childErr || !child) {
      return json({ error: "Účet nebyl nalezen. Přihlas se kódem od rodiče." }, 404);
    }

    if (child.pin_locked_until && new Date(child.pin_locked_until) > new Date()) {
      return json({ error: "Moc pokusů. Zkus to za chvíli, nebo se přihlas kódem." }, 429);
    }

    if (!child.pin_hash) {
      return json({ error: "PIN zatím není nastavený. Požádej rodiče, ať ti ho nastaví." }, 400);
    }

    const ok = await verifyPin(pin, child.pin_hash);

    if (!ok) {
      const attempts = (child.pin_failed_attempts ?? 0) + 1;
      const locked = attempts >= MAX_ATTEMPTS;
      await supabaseAdmin
        .from("children")
        .update({
          pin_failed_attempts: locked ? 0 : attempts,
          pin_locked_until: locked
            ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString()
            : null,
        })
        .eq("id", child.id);

      if (locked) {
        return json({ error: "Moc pokusů. Zkus to za chvíli, nebo se přihlas kódem." }, 429);
      }
      const left = MAX_ATTEMPTS - attempts;
      return json({ error: `Špatný PIN. Zbývá ${left} ${left === 1 ? "pokus" : left <= 4 ? "pokusy" : "pokusů"}.` }, 401);
    }

    // PIN sedí → reset počítadla a vydání session.
    await supabaseAdmin
      .from("children")
      .update({ pin_failed_attempts: 0, pin_locked_until: null })
      .eq("id", child.id);

    // Zjisti e-mail účtu dítěte a přehashuj heslo na nové náhodné.
    const { data: userRes, error: getUserErr } = await supabaseAdmin.auth.admin.getUserById(child_user_id);
    if (getUserErr || !userRes.user?.email) {
      console.error("child-relogin getUserById error:", getUserErr);
      return json({ error: "Účet se nepodařilo najít." }, 500);
    }
    const email = userRes.user.email;
    const newPassword = crypto.randomUUID();

    const { error: updPwErr } = await supabaseAdmin.auth.admin.updateUserById(child_user_id, {
      password: newPassword,
    });
    if (updPwErr) {
      console.error("child-relogin updateUserById error:", updPwErr);
      return json({ error: "Přihlášení selhalo." }, 500);
    }

    const { data: sessionData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: newPassword,
    });
    if (signInErr || !sessionData.session) {
      console.error("child-relogin signIn error:", signInErr);
      return json({ error: "Přihlášení selhalo." }, 500);
    }

    return json(
      { session: sessionData.session, child_name: child.child_name, grade: child.grade },
      200,
    );
  } catch (err) {
    console.error("child-relogin error:", err);
    return json({ error: "Interní chyba serveru." }, 500);
  }
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
