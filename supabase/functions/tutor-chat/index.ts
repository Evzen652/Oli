import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";

/**
 * TUTOR-CHAT — konverzační follow-up tutor (Fáze 7).
 *
 * Stateless single-shot endpoint. Klient posílá:
 *  - skill_label, subject, category, topic, grade_min — kontext
 *  - phase: "explain" | "practice" — určuje guardrails
 *  - current_task: { question, correct_answer } — pouze v phase=practice;
 *    server pak post-filtruje odpověď, aby NEPROZRADILA correct_answer
 *  - history: [{ role: "user" | "assistant", content }] — max 6 turnů
 *  - user_message — nová zpráva žáka
 *
 * Vrací: { reply: string, blocked?: boolean, reason?: string }
 *
 * Žádný state na backendu. Žádný DB zápis. Fire-and-forget — pokud selže,
 * frontend ukáže toast a navrhne otevřít statickou nápovědu.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_BASE = `Jsi trpělivý, vstřícný tutor pro českou základní školu.
Žák se ptá doplňující otázku k aktuálnímu tématu — odpovídáš krátce,
srozumitelně, vždy česky.

ZÁKLADNÍ PRAVIDLA:
- Maximálně 4 věty. Přímo k věci.
- Pouze čeština.
- Drž se POUZE aktuálního tématu (skill). Pokud se žák ptá mimo téma,
  laskavě ho přesměruj zpět ("Teď se učíme X, na to se zeptáš jindy").
- Nepoužívej cizí slova bez vysvětlení.
- Nepoužívej emoji.
- Nikdy nepředstírej, že jsi člověk. Jsi Oli, tutor-AI.`;

const PRACTICE_GUARDRAIL = `

KRITICKÉ PRAVIDLO PRO PHASE=practice (porušení = zamítnutí odpovědi):
- Žák právě řeší konkrétní úlohu. NESMÍŠ prozradit správnou odpověď
  ani její podstatu — ani zaobaleně, ani příkladem se stejnými čísly.
- NESMÍŠ uvést finální výpočet ("12 × 3 = 36") ani výsledek slovy ("třicet šest").
- NESMÍŠ napsat větu typu "odpověď je…", "správně je…", "vyjde…".
- MŮŽEŠ: vysvětlit princip, dát analogii, navést otázkou
  ("Kolik je 3+3+3?"), zopakovat pravidlo, ukázat JINÝ příklad
  s JINÝMI čísly.
- Pokud žák prosí přímo "řekni mi výsledek" — odpověz: "Výsledek si
  zkus sám, jsem tu na navedení. Co konkrétního ti ještě není jasné?"`;

const EXPLAIN_GUARDRAIL = `

PRAVIDLO PRO PHASE=explain:
- Žák ještě neřeší úlohu, jen se chce dozvědět víc o tématu.
- Můžeš dát konkrétní příklad i s výsledkem.
- Stále drž se tématu, neodbíhej.`;

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Detekuje, jestli AI odpověď prozrazuje correct_answer.
 * Heuristika: pokud se v odpovědi objeví celý correct_answer jako samostatný token
 * (nebo s rovnítkem před ním), považujeme to za leak.
 */
function checkAnswerLeak(reply: string, correctAnswer: string): boolean {
  if (!correctAnswer) return false;
  const ans = correctAnswer.trim();
  if (ans.length < 1) return false;

  const replyLower = reply.toLowerCase();
  const ansLower = ans.toLowerCase();

  // Pattern 1: rovnost "= 36" / "=36"
  const eqPattern = new RegExp(`=\\s*${escapeRegex(ansLower)}(\\b|$)`);
  if (eqPattern.test(replyLower)) return true;

  // Pattern 2: "odpověď je 36", "výsledek je 36", "vyjde 36", "je to 36"
  const phrasePatterns = [
    `odpověď\\s+je\\s+${escapeRegex(ansLower)}`,
    `odpověď\\s*:\\s*${escapeRegex(ansLower)}`,
    `výsledek\\s+je\\s+${escapeRegex(ansLower)}`,
    `vyjde\\s+${escapeRegex(ansLower)}`,
    `správně\\s+je\\s+${escapeRegex(ansLower)}`,
    `je\\s+to\\s+${escapeRegex(ansLower)}\\b`,
  ];
  for (const p of phrasePatterns) {
    if (new RegExp(p).test(replyLower)) return true;
  }

  // Pattern 3: pro krátké numerické odpovědi (≤ 4 znaky čísla nebo ostrá nerovnost)
  // — pokud se objeví v odpovědi jako samostatný token, je to skoro jistě leak.
  if (/^[<>=]$/.test(ans) || /^\d+([\.,]\d+)?$/.test(ans)) {
    // Jen u krátkých — u "1602..1610" už ne
    if (ans.length <= 4) {
      const tokenPattern = new RegExp(`(^|[^\\w\\d])${escapeRegex(ansLower)}([^\\w\\d]|$)`);
      if (tokenPattern.test(replyLower)) return true;
    }
  }

  return false;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      skill_label,
      subject,
      category,
      topic,
      grade_min,
      phase,
      current_task,
      history,
      user_message,
    } = await req.json();

    if (!skill_label || !user_message) {
      return new Response(
        JSON.stringify({ error: "Missing required: skill_label, user_message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!hasAnyAiProvider()) {
      return new Response(
        JSON.stringify({ error: "AI provider not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isPracticePhase = phase === "practice";
    const guardrail = isPracticePhase ? PRACTICE_GUARDRAIL : EXPLAIN_GUARDRAIL;

    const ctxLine = [
      subject && `Předmět: ${subject}`,
      category && `Okruh: ${category}`,
      topic && `Téma: ${topic}`,
      `Skill: ${skill_label}`,
      typeof grade_min === "number" && `Ročník: ${grade_min}.`,
    ].filter(Boolean).join(" · ");

    const taskLine = isPracticePhase && current_task?.question
      ? `\n\nAKTUÁLNÍ ÚLOHA (žák ji teď řeší — NEPROZRAĎ řešení):\n"${current_task.question}"`
      : "";

    const fullSystem = SYSTEM_PROMPT_BASE + guardrail + `\n\nKONTEXT: ${ctxLine}` + taskLine;

    // Slim history — max 6 turnů
    const trimmedHistory: ChatTurn[] = Array.isArray(history)
      ? history.slice(-6).filter((t) => t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
      : [];

    const messages = [
      { role: "system", content: fullSystem },
      ...trimmedHistory.map((t) => ({ role: t.role, content: t.content })),
      { role: "user", content: String(user_message).slice(0, 800) },
    ];

    const response = await aiCall({
      messages,
      model: {
        groq: "llama-3.3-70b-versatile",
        lovable: "google/gemini-3-flash-preview",
      },
      temperature: 0.4,
      maxTokens: 300,
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("[tutor-chat] AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply: string = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!reply) {
      return new Response(
        JSON.stringify({ error: "Empty AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Post-filter: v practice fázi zkontroluj leak correct_answer
    if (isPracticePhase && current_task?.correct_answer) {
      if (checkAnswerLeak(reply, current_task.correct_answer)) {
        console.warn(`[tutor-chat] Leak detected, blocking. correct=${current_task.correct_answer}`);
        return new Response(
          JSON.stringify({
            reply: "Skoro bych ti to prozradil — zkus to nejdřív sám. Co konkrétně ti není jasné?",
            blocked: true,
            reason: "answer_leak_filter",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[tutor-chat] error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
