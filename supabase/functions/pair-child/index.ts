import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Find the child record
    const { data: child, error: childErr } = await supabaseAdmin
      .from("children")
      .select("*")
      .eq("pairing_code", pairing_code.toUpperCase())
      .single();

    if (childErr || !child) {
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
