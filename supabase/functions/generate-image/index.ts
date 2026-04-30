// generate-image — vyrobí obrázek pro vizuální cvičení (image_select, diagram_label).
//
// Provider routing:
//   1) GROQ — nemá image generation, skip
//   2) LOVABLE_API_KEY — Lovable Gateway (DALL-E 3 / OpenAI image)
//   3) OPENAI_API_KEY — fallback přímý OpenAI
//
// Vstup:
//   { prompt: string, skill_id?: string, tags?: string[], size?: "1024x1024" }
//
// Výstup:
//   { url: string, asset_id: string, alt_text: string }
//
// Akce: zapíše záznam do exercise_assets (status='pending') a vrátí URL.
// Admin musí v UI schválit, aby žáci uviděli.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    // Admin check — jen admin může generovat obrázky (drahé)
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData } = await supabase.auth.getClaims(token);
    const userId = claimsData?.claims?.sub as string | undefined;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { prompt, skill_id, tags, size = "1024x1024", alt_text } = body ?? {};
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Provider routing ─────────────────────────────────────────────
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    let imageUrl: string | null = null;
    let providerUsed = "";

    if (lovableKey) {
      // Lovable Gateway proxy na OpenAI image
      const r = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/dall-e-3",
          prompt,
          n: 1,
          size,
          response_format: "url",
        }),
      });
      if (r.ok) {
        const data = await r.json();
        imageUrl = data.data?.[0]?.url ?? null;
        providerUsed = "lovable_dalle3";
      } else {
        const errText = await r.text().catch(() => "");
        console.warn(`[generate-image] Lovable error ${r.status}: ${errText}`);
      }
    }

    if (!imageUrl && openaiKey) {
      // Fallback: přímý OpenAI
      const r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size,
          response_format: "url",
        }),
      });
      if (r.ok) {
        const data = await r.json();
        imageUrl = data.data?.[0]?.url ?? null;
        providerUsed = "openai_dalle3";
      } else {
        const errText = await r.text().catch(() => "");
        return new Response(
          JSON.stringify({ error: `OpenAI error ${r.status}: ${errText}` }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (!imageUrl) {
      return new Response(
        JSON.stringify({
          error:
            "Žádný provider pro generování obrázků není nakonfigurován. Nastavte LOVABLE_API_KEY (preferováno) nebo OPENAI_API_KEY v Supabase Edge Functions Secrets.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Zápis do exercise_assets
    const { data: asset, error: insertErr } = await supabase
      .from("exercise_assets")
      .insert({
        url: imageUrl,
        alt_text: alt_text || prompt.slice(0, 100),
        generation_prompt: prompt,
        tags: tags ?? [],
        skill_id: skill_id ?? null,
        source: "ai_generated",
        status: "pending",
        created_by: userId,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.warn("[generate-image] DB insert failed:", insertErr);
      // I tak vrátíme URL, asset prostě nezapíšeme do knihovny
    }

    return new Response(
      JSON.stringify({
        url: imageUrl,
        asset_id: asset?.id ?? null,
        alt_text: alt_text || prompt.slice(0, 100),
        provider: providerUsed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[generate-image] error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
