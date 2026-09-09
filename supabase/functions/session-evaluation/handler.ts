/**
 * SESSION-EVALUATION core handler — testovatelný extract.
 *
 * AI generuje slovní hodnocení po session (žák ho vidí v SessionEndSummary).
 *
 * ── Proč se injektuje celé volání, ne klíč ──────────────────────────────────
 * Dřív se sem injektoval `getApiKey()` a handler volal natvrdo Lovable Gateway.
 * Jenže v projektu je nastavený `GROQ_API_KEY` a `GEMINI_API_KEY`, kdežto
 * `LOVABLE_API_KEY` **ne** — funkce by tedy po nasazení házela 500 při každém
 * dokončeném sezení. (Ověřeno 2026-09-09 přes `supabase secrets list`.)
 *
 * Výběr poskytovatele umí `_shared/aiCall.ts`, ale ten čte klíče přímo z Deno
 * env, což by čistotu handleru rozbilo. Proto se injektuje `callAi` — v provozu
 * ho `index.ts` napojí na `aiCall`, v testu se dá podstrčit.
 */

export interface SessionEvalDeps {
  /** Provede AI volání. V provozu `aiCall` z `_shared/aiCall.ts`. */
  callAi: (messages: Array<{ role: string; content: string }>) => Promise<Response>;
  /** Je nakonfigurovaný aspoň jeden poskytovatel? */
  hasProvider: () => boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export function createSessionEvalHandler(deps: SessionEvalDeps) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const {
        topicTitle,
        totalTasks,
        correctCount,
        wrongCount,
        helpUsedCount = 0,
        grade,
        subject = "matematika",
      } = await req.json();

      // Bez poskytovatele nemá smysl nic stavět. Vrací se 503, ne 500:
      // není to chyba běhu, je to chybějící konfigurace — a klient na to má
      // vlastní lokální hlášku, takže dítě zůstane bez povšimnutí.
      if (!deps.hasProvider()) {
        return jsonResp({ error: "Žádný AI poskytovatel není nakonfigurován." }, 503);
      }

      // Subject-aware terminology
      const subjectLabel = subject === "čeština" ? "českého jazyka" : "matematiky";
      const taskWord = subject === "čeština" ? "úloh" : "příkladů";

      // Detect if topic is diktat
      const isDiktat = String(topicTitle ?? "").toLowerCase().includes("diktát");
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

      const response = await deps.callAi([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      if (!response.ok) {
        if (response.status === 429) return jsonResp({ error: "Rate limit exceeded" }, 429);
        if (response.status === 402) return jsonResp({ error: "Payment required" }, 402);
        return jsonResp({ error: "AI gateway error" }, 500);
      }

      const data = await response.json();
      const evaluation = data.choices?.[0]?.message?.content || "";
      return jsonResp({ evaluation });
    } catch (e) {
      return jsonResp({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
    }
  };
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
