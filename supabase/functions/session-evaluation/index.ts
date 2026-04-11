import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topicTitle, totalTasks, correctCount, wrongCount, helpUsedCount = 0, grade, subject = "matematika" } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const pct = totalTasks > 0 ? Math.round((correctCount / totalTasks) * 100) : 0;

    // Subject-aware terminology
    const subjectLabel = subject === "čeština" ? "českého jazyka" : "matematiky";
    const taskWord = subject === "čeština" ? "úloh" : "příkladů";

    // Detect if topic is diktat (covers multiple rule types)
    const isDiktat = topicTitle.toLowerCase().includes("diktát");
    const diktatNote = isDiktat
      ? " Doplňovací diktát zahrnuje různé pravopisné jevy najednou — vyjmenovaná slova, párové souhlásky, tvrdé a měkké souhlásky i velká písmena. V hodnocení se vyjádři obecně k pravopisu a doplňování, nezmiňuj jen jeden typ pravidla."
      : "";

    const isYoung = grade <= 3;
    const lengthInstruction = isYoung
      ? "Hodnocení má mít nejvýše 1-2 velmi krátké věty. Používej jednoduchá slova a krátké věty bez souvětí. Piš tak, aby to snadno přečetlo dítě ve 3. třídě."
      : "Hodnocení má mít 2-3 věty.";

    const systemPrompt = `Jsi laskavý učitel na české základní škole. Píšeš krátké slovní hodnocení pro žáka ${grade}. ročníku po procvičování ${subjectLabel}. ${lengthInstruction} Buď povzbudivý, konkrétní a věcný. Nepoužívej emotikony. Mluv přímo k žákovi (tykej). Nikdy nezmiňuj procenta. Pokud žák používal nápovědu, jemně ho povzbuď k tomu, aby to příště zkusil sám. Používej terminologii odpovídající předmětu — u češtiny mluv o doplňování, pravopisu, psaní; u matematiky o počítání, řešení příkladů.${diktatNote}`;

    const helpInfo = helpUsedCount > 0
      ? ` U ${helpUsedCount} ${taskWord} si otevřel nápovědu (postup řešení) a odpověděl s její pomocí.`
      : ` Žádnou nápovědu nepoužil — všechny ${taskWord} řešil samostatně.`;

    const userPrompt = `Žák procvičoval téma "${topicTitle}" (předmět: ${subject}). Vyřešil ${totalTasks} ${taskWord}: ${correctCount} správně bez pomoci, ${helpUsedCount} správně s nápovědou a ${wrongCount} špatně.${helpInfo} Napiš krátké slovní hodnocení.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const evaluation = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ evaluation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("session-evaluation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
