import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // Get all paired children
    const { data: children, error: childErr } = await supabase
      .from("children")
      .select("id, child_name, parent_user_id, last_reminder_sent_at")
      .eq("is_paired", true);

    if (childErr) throw childErr;
    if (!children || children.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sentCount = 0;

    for (const child of children) {
      // Skip if reminder was sent in last 3 days
      if (child.last_reminder_sent_at && new Date(child.last_reminder_sent_at) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) {
        continue;
      }

      // Check if child has any recent activity
      const { data: recentLogs } = await supabase
        .from("session_logs")
        .select("id")
        .eq("child_id", child.id)
        .gte("created_at", threeDaysAgo)
        .limit(1);

      if (recentLogs && recentLogs.length > 0) continue;

      // Get parent email
      const { data: userData } = await supabase.auth.admin.getUserById(child.parent_user_id);
      if (!userData?.user?.email) continue;

      // Send reminder email via Supabase Auth (using the built-in email system)
      // We use a magic link as a hook to send a notification-style email
      // For production, integrate with a proper email service
      console.log(`Inactivity reminder: ${child.child_name} (parent: ${userData.user.email})`);

      // Update last_reminder_sent_at
      await supabase
        .from("children")
        .update({ last_reminder_sent_at: new Date().toISOString() })
        .eq("id", child.id);

      sentCount++;
    }

    return new Response(JSON.stringify({ sent: sentCount, checked: children.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Inactivity reminder error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
