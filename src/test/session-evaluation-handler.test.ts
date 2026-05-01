import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSessionEvalHandler, type SessionEvalDeps } from "../../supabase/functions/session-evaluation/handler";

/**
 * Edge fn integration: session-evaluation handler.
 *
 * Pokrývá:
 *  - Subject-aware terminology (matematika vs čeština)
 *  - Diktát detection (zvláštní note pro pravopisné jevy)
 *  - Grade scaling (≤3 = max 1-2 short sentences, 4+ = 2-3 sentences)
 *  - Help info (helpUsedCount > 0 = mention, = 0 = praise samostatnost)
 *  - AI errors (429, 402, 500 → propagace)
 *  - Missing API key → 500
 *  - Empty AI content → empty evaluation
 *  - CORS
 */

const mkAiCall = (responseBody: unknown, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(responseBody),
    text: () => Promise.resolve(JSON.stringify(responseBody)),
  });
};

const mkRequest = (body: unknown, method = "POST"): Request =>
  new Request("http://localhost/session-evaluation", {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

const validResponse = {
  choices: [{ message: { content: "Pěkně se ti dařilo!" } }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("session-evaluation — subject-aware terminology", () => {
  it("subject=matematika → 'matematiky' + 'příkladů'", async () => {
    const fetchMock = mkAiCall(validResponse);
    const deps: SessionEvalDeps = { fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" };
    const handler = createSessionEvalHandler(deps);
    await handler(mkRequest({
      topicTitle: "Násobilka",
      totalTasks: 6,
      correctCount: 5,
      wrongCount: 1,
      grade: 4,
      subject: "matematika",
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const sysPrompt = callBody.messages[0].content;
    expect(sysPrompt).toContain("matematiky");
  });

  it("subject=čeština → 'českého jazyka' + 'úloh'", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "Slovní druhy",
      totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
      subject: "čeština",
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).toContain("českého jazyka");
    expect(callBody.messages[1].content).toContain("úloh");
  });

  it("default subject (chybí v request) → matematika", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).toContain("matematiky");
  });
});

describe("session-evaluation — diktát detection", () => {
  it("topic obsahuje 'diktát' → diktatNote v system promptu", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "Diktát č.5",
      totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
      subject: "čeština",
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).toContain("Doplňovací diktát");
    expect(callBody.messages[0].content).toContain("vyjmenovaná slova");
  });

  it("topic 'DIKTÁT' uppercase → matchuje case insensitive", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "DIKTÁT NA Y/I",
      totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).toContain("Doplňovací diktát");
  });

  it("topic bez 'diktát' → žádný diktatNote", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "Násobilka",
      totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).not.toContain("Doplňovací diktát");
  });
});

describe("session-evaluation — grade scaling", () => {
  it("grade ≤ 3 → '1-2 velmi krátké věty'", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 3,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).toMatch(/1-2 velmi krátké věty/);
  });

  it("grade 4+ → '2-3 věty'", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 5,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[0].content).toMatch(/2-3 věty/);
  });
});

describe("session-evaluation — helpUsed handling", () => {
  it("helpUsedCount > 0 → 'otevřel nápovědu' v userPrompt", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 4, wrongCount: 0,
      helpUsedCount: 2, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[1].content).toContain("nápovědu");
  });

  it("helpUsedCount = 0 → 'samostatně' praise", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 6, wrongCount: 0,
      helpUsedCount: 0, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[1].content).toContain("samostatně");
  });

  it("helpUsedCount default = 0 (chybí v request)", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 6, wrongCount: 0, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[1].content).toContain("samostatně");
  });
});

describe("session-evaluation — AI errors", () => {
  it("AI 429 → 429 status + 'Rate limit'", async () => {
    const fetchMock = mkAiCall({}, 429);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toMatch(/Rate limit/);
  });

  it("AI 402 → 402 status + Payment", async () => {
    const fetchMock = mkAiCall({}, 402);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.error).toMatch(/Payment/);
  });

  it("AI 500 → 500 status + 'AI gateway error'", async () => {
    const fetchMock = mkAiCall({}, 500);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/AI gateway/);
  });

  it("AI throws → 500 generic", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("net"));
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.status).toBe(500);
  });
});

describe("session-evaluation — provider availability", () => {
  it("getApiKey vrací undefined → 500 (catch-all error)", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => undefined,
    });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("session-evaluation — happy path", () => {
  it("AI vrátí content → evaluation field v response", async () => {
    const fetchMock = mkAiCall({
      choices: [{ message: { content: "Skvělá práce v matematice!" } }],
    });
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "Násobilka", totalTasks: 6, correctCount: 6, wrongCount: 0, grade: 4,
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.evaluation).toBe("Skvělá práce v matematice!");
  });

  it("AI vrátí prázdný content → empty evaluation", async () => {
    const fetchMock = mkAiCall({ choices: [{ message: { content: "" } }] });
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.evaluation).toBe("");
  });

  it("malformed JSON request → 500", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const req = new Request("http://localhost/", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(500);
  });
});

describe("session-evaluation — request shape", () => {
  it("uses gemini-3-flash-preview model", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.model).toBe("google/gemini-3-flash-preview");
  });

  it("API key v Authorization header (ne v body)", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "secret-xyz",
    });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const callOpts = fetchMock.mock.calls[0][1] as RequestInit;
    expect((callOpts.headers as Record<string, string>).Authorization).toBe("Bearer secret-xyz");
    expect(callOpts.body).not.toContain("secret-xyz");
  });
});

describe("session-evaluation — CORS", () => {
  it("OPTIONS → 200 s CORS headers", async () => {
    const handler = createSessionEvalHandler({
      fetch: vi.fn() as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(new Request("http://localhost/", { method: "OPTIONS" }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("POST response má CORS headers", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("session-evaluation — content rules (anti-emoji, no percent)", () => {
  it("system prompt zakazuje emotikony", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const sys = JSON.parse(fetchMock.mock.calls[0][1].body as string).messages[0].content;
    expect(sys).toMatch(/[Nn]epoužívej emotikony/);
  });

  it("system prompt zakazuje procenta", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const sys = JSON.parse(fetchMock.mock.calls[0][1].body as string).messages[0].content;
    expect(sys).toMatch(/[Nn]ikdy nezmiňuj procenta/);
  });

  it("system prompt přikazuje tykání", async () => {
    const fetchMock = mkAiCall(validResponse);
    const handler = createSessionEvalHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    await handler(mkRequest({
      topicTitle: "T", totalTasks: 6, correctCount: 5, wrongCount: 1, grade: 4,
    }));
    const sys = JSON.parse(fetchMock.mock.calls[0][1].body as string).messages[0].content;
    expect(sys).toMatch(/tykej/);
  });
});
