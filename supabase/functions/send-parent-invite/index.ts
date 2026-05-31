/**
 * send-parent-invite — odešle pozvánku rodičům e-mailem přes Resend.
 *
 * POST body:
 *   { email: string, childName?: string, anonGrade?: number, childId?: string }
 *
 * Postup:
 *  1. Uloží záznam do parent_invitations (vrátí invite ID)
 *  2. Pošle email přes Resend API s odkazem na registraci
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = "https://oli-edu.com";
// Po ověření domény v Resendu přepnout na: "Oli <noreply@oli-edu.com>"
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "Oli <noreply@oli-edu.com>";

function buildEmailHtml(inviteUrl: string, childName?: string, grade?: number): string {
  const gradeText = grade ? ` (${grade}. třída)` : "";
  const childText = childName ? `${childName}${gradeText}` : `vaše dítě${gradeText}`;

  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pozvánka do Oli</title>
</head>
<body style="margin:0;padding:0;background:#F5F3FF;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7C3AED,#A855F7);padding:32px 40px;text-align:center;">
              <img src="${APP_URL}/owl-logo.png" alt="Oli" width="48" height="48"
                   style="border-radius:12px;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                Oli vás zve!
              </h1>
              <p style="margin:8px 0 0;color:#E9D5FF;font-size:15px;">
                Vzdělávací aplikace pro ZŠ
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:17px;line-height:1.6;">
                Ahoj! 👋
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
                <strong>${childText}</strong> vás zve do aplikace Oli, kde
                procvičuje látku ze školy. Zaregistrujte se a budete moct
                sledovat pokrok, zadávat úkoly a připravovat ho na písemky.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${inviteUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#A855F7);
                              color:#ffffff;text-decoration:none;font-size:17px;font-weight:700;
                              padding:16px 40px;border-radius:50px;
                              box-shadow:0 4px 14px rgba(124,58,237,0.35);">
                      Vytvořit účet zdarma →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Benefits -->
              <table cellpadding="0" cellspacing="0" width="100%"
                     style="background:#F5F3FF;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
                <tr><td style="padding:6px 0;">
                  <span style="color:#7C3AED;font-size:18px;">📊</span>
                  <span style="color:#4B5563;font-size:14px;margin-left:10px;">Sledujte pokrok v reálném čase</span>
                </td></tr>
                <tr><td style="padding:6px 0;">
                  <span style="color:#7C3AED;font-size:18px;">📝</span>
                  <span style="color:#4B5563;font-size:14px;margin-left:10px;">Zadávejte úkoly z konkrétních témat</span>
                </td></tr>
                <tr><td style="padding:6px 0;">
                  <span style="color:#7C3AED;font-size:18px;">🎯</span>
                  <span style="color:#4B5563;font-size:14px;margin-left:10px;">Připravujte dítě na písemky</span>
                </td></tr>
                <tr><td style="padding:6px 0;">
                  <span style="color:#7C3AED;font-size:18px;">✨</span>
                  <span style="color:#4B5563;font-size:14px;margin-left:10px;">14 dní zdarma, bez platební karty</span>
                </td></tr>
              </table>

              <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.5;">
                Pokud vám tuto zprávu někdo poslal omylem, jednoduše ji ignorujte.
                Váš email nebyl nikam přihlášen.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
              <p style="margin:0;color:#9CA3AF;font-size:12px;">
                © 2026 Oli — vzdělávání pro ZŠ &nbsp;·&nbsp;
                <a href="${APP_URL}" style="color:#7C3AED;text-decoration:none;">oli-edu.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, childName, anonGrade, childId } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Neplatný email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Uložit pozvánku do DB
    const { data: invite, error: insertErr } = await supabase
      .from("parent_invitations")
      .insert({
        email: email.trim().toLowerCase(),
        child_id: childId ?? null,
        child_name: childName ?? null,
        anon_grade: anonGrade ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr) throw new Error(`DB insert: ${insertErr.message}`);

    const inviteUrl = `${APP_URL}/auth?mode=register&invite=${invite.id}`;

    // 2. Odeslat email přes Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      // Resend není nakonfigurován — vrátíme jen URL (dev mode)
      console.warn("RESEND_API_KEY není nastaven — email nebyl odeslán");
      return new Response(
        JSON.stringify({ ok: true, inviteUrl, emailSent: false, reason: "no-resend-key" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email.trim().toLowerCase()],
        subject: childName
          ? `${childName} vás zve do Oli`
          : "Vaše dítě vás zve do Oli",
        html: buildEmailHtml(inviteUrl, childName, anonGrade),
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      throw new Error(`Resend error ${emailRes.status}: ${errBody}`);
    }

    return new Response(
      JSON.stringify({ ok: true, inviteUrl, emailSent: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (err) {
    console.error("send-parent-invite error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
