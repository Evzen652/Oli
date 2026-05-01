import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTutorChatHandler, type TutorChatDeps } from "../../supabase/functions/tutor-chat/handler";

/**
 * Edge fn integration testy: tutor-chat (Fáze 7).
 *
 * Pokrývá:
 *  - Validation: chybí skill_label / user_message → 400
 *  - AI provider missing → 503
 *  - Phase guardrails: practice vs explain (system prompt obsahuje různé pravidlo)
 *  - History trimming (max 6 turnů + filter nevalidních turnů)
 *  - user_message length cap (800 chars)
 *  - Anti-leak filter integration: AI vrátí leak → blocked + reply substituted
 *  - AI gateway errors / empty reply → 500
 *  - CORS / OPTIONS
 */

const mkAiReply = (content: string) => ({
  choices: [{ message: { content } }],
});

const mkAiCall = (responseBody: unknown, status = 200) => {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(responseBody), { status })
  );
};

const okDeps = (overrides: Partial<TutorChatDeps> = {}): TutorChatDeps => ({
  aiCall: mkAiCall(mkAiReply("Pomohu ti. Vysvětlím princip, ale neprozradím odpověď.")),
  hasAnyAiProvider: () => true,
  ...overrides,
});

const mkRequest = (body: unknown, method = "POST"): Request =>
  new Request("http://localhost/tutor-chat", {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("tutor-chat handler — validation", () => {
  it("missing skill_label → 400", async () => {
    const handler = createTutorChatHandler(okDeps());
    const res = await handler(mkRequest({ user_message: "Co je to?" }));
    expect(res.status).toBe(400);
  });

  it("missing user_message → 400", async () => {
    const handler = createTutorChatHandler(okDeps());
    const res = await handler(mkRequest({ skill_label: "Násobilka" }));
    expect(res.status).toBe(400);
  });

  it("malformed JSON → 500", async () => {
    const handler = createTutorChatHandler(okDeps());
    const req = new Request("http://localhost/", {
      method: "POST", body: "not json", headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(500);
  });
});

describe("tutor-chat handler — AI provider availability", () => {
  it("hasAnyAiProvider=false → 503", async () => {
    const handler = createTutorChatHandler(okDeps({ hasAnyAiProvider: () => false }));
    const res = await handler(mkRequest({ skill_label: "X", user_message: "?" }));
    expect(res.status).toBe(503);
  });
});

describe("tutor-chat handler — phase guardrails", () => {
  it("phase=practice → system prompt obsahuje PRACTICE_GUARDRAIL", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      skill_label: "Násobilka", phase: "practice", user_message: "Vysvětli násobilku.",
      current_task: { question: "12×3?", correct_answer: "36" },
    }));
    const sysMsg = aiCall.mock.calls[0][0].messages[0].content;
    expect(sysMsg).toMatch(/PHASE=practice/);
    expect(sysMsg).toMatch(/NEPROZRAĎ/);
    expect(sysMsg).toMatch(/AKTUÁLNÍ ÚLOHA/);
  });

  it("phase=explain → system prompt obsahuje EXPLAIN_GUARDRAIL, žádný taskLine", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      skill_label: "Násobilka", phase: "explain", user_message: "Vysvětli násobilku.",
    }));
    const sysMsg = aiCall.mock.calls[0][0].messages[0].content;
    expect(sysMsg).toMatch(/PHASE=explain/);
    expect(sysMsg).not.toMatch(/AKTUÁLNÍ ÚLOHA/);
  });

  it("phase=explain s current_task přes IGNORE → taskLine nezahrnut", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      skill_label: "X", phase: "explain", user_message: "?",
      current_task: { question: "Q?", correct_answer: "A" },
    }));
    const sysMsg = aiCall.mock.calls[0][0].messages[0].content;
    expect(sysMsg).not.toMatch(/AKTUÁLNÍ ÚLOHA/);
  });

  it("kontextová řádka obsahuje subject, category, topic, skill", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      skill_label: "Slovní druhy", subject: "čeština", category: "Mluvnice",
      topic: "Slovní druhy", grade_min: 3, phase: "practice", user_message: "?",
    }));
    const sysMsg = aiCall.mock.calls[0][0].messages[0].content;
    expect(sysMsg).toMatch(/Předmět: čeština/);
    expect(sysMsg).toMatch(/Okruh: Mluvnice/);
    expect(sysMsg).toMatch(/Skill: Slovní druhy/);
    expect(sysMsg).toMatch(/Ročník: 3/);
  });
});

describe("tutor-chat handler — history processing", () => {
  it("history se ořízne na max 6 turnů (slim posture)", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    const longHistory = Array.from({ length: 10 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `turn ${i}`,
    }));
    await handler(mkRequest({
      skill_label: "X", phase: "practice", user_message: "now",
      history: longHistory,
    }));
    const messages = aiCall.mock.calls[0][0].messages;
    // [system, ...history(6), user_message] = 8 messages total
    expect(messages.length).toBe(8);
    // First history message should be turn 4 (last 6)
    expect(messages[1].content).toBe("turn 4");
  });

  it("nevalidní history items se filtrují (žádné role / non-string content)", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      skill_label: "X", phase: "practice", user_message: "now",
      history: [
        { role: "user", content: "valid" },
        { role: "system", content: "not allowed" }, // wrong role
        { role: "user", content: 123 }, // non-string content
        null,
        { role: "assistant", content: "ok" },
      ],
    }));
    const messages = aiCall.mock.calls[0][0].messages;
    // [system, valid, ok, user_message] = 4
    expect(messages.length).toBe(4);
  });

  it("history není array → ignored", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      skill_label: "X", phase: "practice", user_message: "now",
      history: "not an array",
    }));
    const messages = aiCall.mock.calls[0][0].messages;
    expect(messages.length).toBe(2); // system + user_message only
  });
});

describe("tutor-chat handler — user_message length cap", () => {
  it("user_message > 800 chars → trimmed (anti DOS)", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    const giant = "X".repeat(2000);
    await handler(mkRequest({ skill_label: "S", phase: "practice", user_message: giant }));
    const userMsg = aiCall.mock.calls[0][0].messages.at(-1).content;
    expect(userMsg.length).toBe(800);
  });
});

describe("tutor-chat handler — anti-leak filter integration", () => {
  it("AI vrátí leak → blocked, reply substituted", async () => {
    // AI ignoruje guardrail a prozradí odpověď
    const aiCall = mkAiCall(mkAiReply("Vyjde 36."));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    const res = await handler(mkRequest({
      skill_label: "Násobilka", phase: "practice", user_message: "?",
      current_task: { question: "12×3?", correct_answer: "36" },
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.blocked).toBe(true);
    expect(body.reason).toBe("answer_leak_filter");
    expect(body.reply).toMatch(/Skoro/i);
    expect(body.reply).not.toMatch(/36/);
  });

  it("AI vrátí čistou navádějící odpověď → projde", async () => {
    const aiCall = mkAiCall(mkAiReply("Zkus si rozložit číslo. Pak postupuj po krocích."));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    const res = await handler(mkRequest({
      skill_label: "Násobilka", phase: "practice", user_message: "?",
      current_task: { question: "12×3?", correct_answer: "36" },
    }));
    const body = await res.json();
    expect(body.blocked).toBeUndefined();
    expect(body.reply).toBe("Zkus si rozložit číslo. Pak postupuj po krocích.");
  });

  it("phase=explain → anti-leak filter SE NEPOUŽIJE (žák se učí)", async () => {
    const aiCall = mkAiCall(mkAiReply("Násobilka 6×6 = 36, je to opakované sčítání."));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    const res = await handler(mkRequest({
      skill_label: "X", phase: "explain", user_message: "?",
      current_task: { question: "?", correct_answer: "36" },
    }));
    const body = await res.json();
    expect(body.blocked).toBeUndefined();
    expect(body.reply).toMatch(/36/);
  });

  it("phase=practice bez current_task.correct_answer → filter neaktivní", async () => {
    const aiCall = mkAiCall(mkAiReply("Tady je 36."));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    const res = await handler(mkRequest({
      skill_label: "X", phase: "practice", user_message: "?",
      current_task: { question: "?" }, // no correct_answer
    }));
    const body = await res.json();
    expect(body.blocked).toBeUndefined();
  });
});

describe("tutor-chat handler — AI gateway errors", () => {
  it("AI non-2xx → 500", async () => {
    const handler = createTutorChatHandler({
      aiCall: vi.fn().mockResolvedValue(new Response("err", { status: 503 })),
      hasAnyAiProvider: () => true,
    });
    const res = await handler(mkRequest({ skill_label: "X", phase: "practice", user_message: "?" }));
    expect(res.status).toBe(500);
  });

  it("AI vrátí prázdný content → 500", async () => {
    const handler = createTutorChatHandler(okDeps({
      aiCall: mkAiCall({ choices: [{ message: { content: "" } }] }),
    }));
    const res = await handler(mkRequest({ skill_label: "X", phase: "practice", user_message: "?" }));
    expect(res.status).toBe(500);
  });

  it("AI vrátí jen whitespace → 500 (trim)", async () => {
    const handler = createTutorChatHandler(okDeps({
      aiCall: mkAiCall({ choices: [{ message: { content: "   " } }] }),
    }));
    const res = await handler(mkRequest({ skill_label: "X", phase: "practice", user_message: "?" }));
    expect(res.status).toBe(500);
  });

  it("aiCall throws → 500", async () => {
    const handler = createTutorChatHandler({
      aiCall: vi.fn().mockRejectedValue(new Error("network down")),
      hasAnyAiProvider: () => true,
    });
    const res = await handler(mkRequest({ skill_label: "X", phase: "practice", user_message: "?" }));
    expect(res.status).toBe(500);
  });
});

describe("tutor-chat handler — CORS", () => {
  it("OPTIONS → 200 s Access-Control-Allow-Origin", async () => {
    const handler = createTutorChatHandler(okDeps());
    const res = await handler(new Request("http://localhost/", { method: "OPTIONS" }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("všechny responses obsahují CORS headers", async () => {
    const handler = createTutorChatHandler(okDeps());
    const res = await handler(mkRequest({ skill_label: "X", phase: "practice", user_message: "?" }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("tutor-chat handler — temperature & maxTokens", () => {
  it("AI volání používá temperature=0.4 a maxTokens=300 (deterministic + cost cap)", async () => {
    const aiCall = mkAiCall(mkAiReply("OK"));
    const handler = createTutorChatHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({ skill_label: "X", phase: "practice", user_message: "?" }));
    const callArgs = aiCall.mock.calls[0][0];
    expect(callArgs.temperature).toBe(0.4);
    expect(callArgs.maxTokens).toBe(300);
  });
});
