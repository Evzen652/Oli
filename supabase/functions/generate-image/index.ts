// generate-image — vyrobí obrázek pro vizuální cvičení (image_select, diagram_label).
//
// Poskytovatel: Gemini (`GEMINI_API_KEY`), nativní výstup obrázku.
// Lovable Gateway i OpenAI odstraněny 2026-09-10 — Lovable se v projektu
// nepoužívá nikde a `OPENAI_API_KEY` nastavený není.
//
// Obrázek se ukládá do bucketu `exercise-assets` a do DB jde odkaz na něj.
// Dřív se ukládala URL od OpenAI, která po pár hodinách expiruje — knihovna
// assetů tak postupně odkazovala do prázdna.
//
// Vstup:
//   { prompt: string, skill_id?: string, tags?: string[], alt_text?: string }
//
// `size` odsud zmizel spolu s DALL-E: Gemini rozměr v tomhle volání nepřijímá,
// takže parametr by se tiše ignoroval. Nikdo ho ostatně neposílal.
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
    const { prompt, skill_id, tags, alt_text } = body ?? {};
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'prompt'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Generování přes Gemini ───────────────────────────────────────
    // Lovable Gateway i OpenAI odstraněny 2026-09-10. Gemini má nativní výstup
    // obrázku a `GEMINI_API_KEY` je v projektu nastavený, na rozdíl od
    // `OPENAI_API_KEY`.
    //
    // ⚠️ Vedlejší oprava, ne jen výměna poskytovatele: OpenAI vracelo URL na
    // svůj vlastní obrázek a ta se ukládala do `exercise_assets.url`. Takové
    // odkazy ale po pár hodinách expirují, takže knihovna assetů postupně
    // odkazovala do prázdna. Gemini vrací base64, který si rovnou uložíme do
    // vlastního storage — odkaz pak platí trvale.
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          error:
            "Generování obrázků není nakonfigurováno. Nastavte GEMINI_API_KEY v Supabase Edge Functions Secrets.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `Gemini error ${aiResp.status}: ${errText.slice(0, 300)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResp.json();
    const parts = aiData.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData,
    );
    const base64: string | undefined = imagePart?.inlineData?.data;

    if (!base64) {
      return new Response(
        JSON.stringify({ error: "Gemini nevrátil obrázek." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Bucket založíme, pokud ještě není — stejně jako `generate-prvouka-images`.
    const { error: bucketErr } = await supabase.storage.createBucket("exercise-assets", {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });
    if (bucketErr && !bucketErr.message.includes("already exists")) {
      console.warn("[generate-image] bucket create warning:", bucketErr.message);
    }

    // Uložení do vlastního storage — viz poznámka o expiraci výš.
    const contentType: string = imagePart.inlineData.mimeType ?? "image/png";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const nazevSouboru = `${crypto.randomUUID()}.png`;
    const { error: uploadErr } = await supabase.storage
      .from("exercise-assets")
      .upload(nazevSouboru, bytes, { contentType, upsert: false });

    if (uploadErr) {
      console.error("[generate-image] upload failed:", uploadErr);
      return new Response(
        JSON.stringify({ error: `Uložení obrázku selhalo: ${uploadErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: urlData } = supabase.storage
      .from("exercise-assets")
      .getPublicUrl(nazevSouboru);
    const imageUrl = urlData.publicUrl;
    const providerUsed = "gemini-2.0-flash";

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
