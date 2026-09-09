import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Admin gate — vyžaduje platný JWT s rolí admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await supabase
      .from("user_roles").select("role")
      .eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lovable Gateway odstraněn 2026-09-09 (nepoužívá se nikde v projektu).
    // Nativní generování obrázků přes Gemini — stejný postup jako
    // `tryGeminiDirect` v `generate-prvouka-images`.
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    // Check if logo already exists
    const { data: existing } = await supabase.storage
      .from("app-assets")
      .list("", { search: "oli-logo.png" });

    if (existing && existing.length > 0) {
      const { data: urlData } = supabase.storage
        .from("app-assets")
        .getPublicUrl("oli-logo.png");

      return new Response(
        JSON.stringify({ url: urlData.publicUrl, status: "exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate logo using Gemini (native image output)
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text:
                "Create a cute, flat-style colorful logo illustration featuring a friendly cartoon owl mascot next to the text 'Oli' in bold rounded letters. The owl should be small, cheerful, with big eyes. Child-friendly, clean design, white background, suitable as a small navigation logo. The text 'Oli' must be clearly readable with a soft 'i'. Use warm, vibrant colors like orange, teal and yellow. Ultra high resolution.",
            }],
          }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Gemini error:", aiResponse.status, errText);
      throw new Error(`Gemini error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    // Gemini vrací obrázek jako inlineData v částech odpovědi, ne jako data URL.
    const parts = aiData.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData,
    );
    const base64 = imagePart?.inlineData?.data;

    if (!base64) {
      throw new Error("No image returned from AI");
    }

    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("app-assets")
      .upload("oli-logo.png", bytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("app-assets")
      .getPublicUrl("oli-logo.png");

    return new Response(
      JSON.stringify({ url: urlData.publicUrl, status: "generated" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-logo error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
