/**
 * TUTOR-CHAT core handler (Fáze 7) — testovatelný z vitestu.
 *
 * Bez Deno-specific importů. Stateless single-shot endpoint.
 * Anti-leak filter žije v _shared/tutorAntiLeak.ts (sdílené, testované).
 */

import { checkAnswerLeak } from "../_shared/tutorAntiLeak.ts";

export interface TutorChatDeps {
  aiCall: (opts: AiCallShape) => Promise<Response>;
  hasAnyAiProvider: () => boolean;
}

export interface AiCallShape {
  messages: Array<{ role: string; content: string }>;
  tools?: unknown[];
  toolChoice?: unknown;
  model: { groq: string; lovable: string };
  temperature?: number;
  maxTokens?: number;
}

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

export function createTutorChatHandler(deps: TutorChatDeps) {
  return async (req: Request): Promise<Response> => {
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
        return jsonResp({ error: "Missing required: skill_label, user_message" }, 400);
      }

      if (!deps.hasAnyAiProvider()) {
        return jsonResp({ error: "AI provider not configured." }, 503);
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

      const trimmedHistory: ChatTurn[] = Array.isArray(history)
        ? history.slice(-6).filter((t: unknown) => {
            const turn = t as ChatTurn | null;
            return turn !== null && (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string";
          })
        : [];

      const messages = [
        { role: "system", content: fullSystem },
        ...trimmedHistory.map((t) => ({ role: t.role, content: t.content })),
        { role: "user", content: String(user_message).slice(0, 800) },
      ];

      const response = await deps.aiCall({
        messages,
        model: { groq: "llama-3.3-70b-versatile", lovable: "google/gemini-3-flash-preview" },
        temperature: 0.4,
        maxTokens: 300,
      });

      if (!response.ok) {
        return jsonResp({ error: "AI gateway error" }, 500);
      }

      const data = await response.json();
      const reply: string = data.choices?.[0]?.message?.content?.trim() ?? "";

      if (!reply) {
        return jsonResp({ error: "Empty AI response" }, 500);
      }

      // Post-filter: anti-leak v practice fázi
      if (isPracticePhase && current_task?.correct_answer) {
        if (checkAnswerLeak(reply, current_task.correct_answer)) {
          return jsonResp({
            reply: "Skoro bych ti to prozradil — zkus to nejdřív sám. Co konkrétně ti není jasné?",
            blocked: true,
            reason: "answer_leak_filter",
          });
        }
      }

      return jsonResp({ reply });
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
