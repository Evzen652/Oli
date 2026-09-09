import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSessionEvalHandler,
  type SessionEvalDeps,
} from "../../supabase/functions/session-evaluation/handler";

/**
 * Edge fn integration: session-evaluation handler.
 *
 * Pokrývá:
 *  - Subject-aware terminology (matematika vs čeština)
 *  - Diktát detection (zvláštní note pro pravopisné jevy)
 *  - Grade scaling (≤3 = max 1-2 short sentences, 4+ = 2-3 sentences)
 *  - Help info (helpUsedCount > 0 = mention, = 0 = praise samostatnost)
 *  - AI errors (429, 402, 500 → propagace)
 *  - Chybějící provider → 503 (odlišené od 500)
 *  - Empty AI content → empty evaluation
 *  - CORS
 *  - Obsahová pravidla promptu (bez emoji, bez procent, tykání)
 *
 * ⚠️ 2026-09-09 se změnilo rozhraní: dřív se injektoval `fetch` + `getApiKey`
 * a handler volal Lovable Gateway natvrdo. Teď se injektuje `callAi`
 * + `hasProvider`, protože výběr poskytovatele dělá `_shared/aiCall.ts`
 * (Groq → Google). Testy proto zkoumají PŘEDANÉ ZPRÁVY, ne tělo fetche.
 */

/** Odpověď poskytovatele — Groq i Google vracejí OpenAI-compatible shape. */
const mkAiResponse = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response);

const mkRequest = (body: unknown, method = "POST"): Request =>
  new Request("http://localhost/session-evaluation", {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

const validResponse = {
  choices: [{ message: { content: "Pěkně se ti dařilo!" } }],
};

const mkDeps = (over: Partial<SessionEvalDeps> = {}): SessionEvalDeps => ({
  hasProvider: () => true,
  callAi: mkAiResponse(validResponse),
  ...over,
});

/** Zprávy předané do AI: [0] = system, [1] = user. */
const zpravy = (callAi: SessionEvalDeps["callAi"]) =>
  (callAi as ReturnType<typeof vi.fn>).mock.calls[0][0] as Array<{
    role: string;
    content: string;
  }>;

const zakladniPozadavek = {
  topicTitle: "T",
  totalTasks: 6,
  correctCount: 5,
  wrongCount: 1,
  grade: 4,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("session-evaluation — subject-aware terminology", () => {
  it("subject=matematika → 'matematiky' + 'příkladů'", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, topicTitle: "Násobilka", subject: "matematika" }),
    );
    expect(zpravy(callAi)[0].content).toContain("matematiky");
  });

  it("subject=čeština → 'českého jazyka' + 'úloh'", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, topicTitle: "Slovní druhy", subject: "čeština" }),
    );
    expect(zpravy(callAi)[0].content).toContain("českého jazyka");
    expect(zpravy(callAi)[1].content).toContain("úloh");
  });

  it("default subject (chybí v request) → matematika", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(mkRequest(zakladniPozadavek));
    expect(zpravy(callAi)[0].content).toContain("matematiky");
  });
});

describe("session-evaluation — diktát detection", () => {
  it("topic obsahuje 'diktát' → diktatNote v system promptu", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, topicTitle: "Diktát č.5", subject: "čeština" }),
    );
    expect(zpravy(callAi)[0].content).toContain("Doplňovací diktát");
    expect(zpravy(callAi)[0].content).toContain("vyjmenovaná slova");
  });

  it("topic 'DIKTÁT' uppercase → matchuje case insensitive", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, topicTitle: "DIKTÁT NA Y/I" }),
    );
    expect(zpravy(callAi)[0].content).toContain("Doplňovací diktát");
  });

  it("topic bez 'diktát' → žádný diktatNote", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, topicTitle: "Násobilka" }),
    );
    expect(zpravy(callAi)[0].content).not.toContain("Doplňovací diktát");
  });
});

describe("session-evaluation — grade scaling", () => {
  it("grade ≤ 3 → '1-2 velmi krátké věty'", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, grade: 3 }),
    );
    expect(zpravy(callAi)[0].content).toMatch(/1-2 velmi krátké věty/);
  });

  it("grade 4+ → '2-3 věty'", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, grade: 5 }),
    );
    expect(zpravy(callAi)[0].content).toMatch(/2-3 věty/);
  });
});

describe("session-evaluation — helpUsed handling", () => {
  it("helpUsedCount > 0 → 'otevřel nápovědu' v userPrompt", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, correctCount: 4, wrongCount: 0, helpUsedCount: 2 }),
    );
    expect(zpravy(callAi)[1].content).toContain("nápovědu");
  });

  it("helpUsedCount = 0 → 'samostatně' praise", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, correctCount: 6, wrongCount: 0, helpUsedCount: 0 }),
    );
    expect(zpravy(callAi)[1].content).toContain("samostatně");
  });

  it("helpUsedCount default = 0 (chybí v request)", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, correctCount: 6, wrongCount: 0 }),
    );
    expect(zpravy(callAi)[1].content).toContain("samostatně");
  });
});

describe("session-evaluation — AI errors", () => {
  it("AI 429 → 429 status + 'Rate limit'", async () => {
    const res = await createSessionEvalHandler(mkDeps({ callAi: mkAiResponse({}, 429) }))(
      mkRequest(zakladniPozadavek),
    );
    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/Rate limit/);
  });

  it("AI 402 → 402 status + Payment", async () => {
    const res = await createSessionEvalHandler(mkDeps({ callAi: mkAiResponse({}, 402) }))(
      mkRequest(zakladniPozadavek),
    );
    expect(res.status).toBe(402);
    expect((await res.json()).error).toMatch(/Payment/);
  });

  it("AI 500 → 500 status + 'AI gateway error'", async () => {
    const res = await createSessionEvalHandler(mkDeps({ callAi: mkAiResponse({}, 500) }))(
      mkRequest(zakladniPozadavek),
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/AI gateway/);
  });

  it("AI throws → 500 generic", async () => {
    const callAi = vi.fn().mockRejectedValue(new Error("net"));
    const res = await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest(zakladniPozadavek),
    );
    expect(res.status).toBe(500);
  });
});

describe("session-evaluation — provider availability", () => {
  it("bez poskytovatele → 503 a AI se vůbec nevolá", async () => {
    const callAi = vi.fn();
    const res = await createSessionEvalHandler(
      mkDeps({ hasProvider: () => false, callAi }),
    )(mkRequest(zakladniPozadavek));

    expect(res.status).toBe(503);
    expect(callAi).not.toHaveBeenCalled();
  });

  it("503 je odlišené od 500 — chybí konfigurace, ne běh", async () => {
    // Kdyby obojí vracelo 500, nešlo by v logu poznat nenastavený klíč od
    // skutečné poruchy poskytovatele. Přesně tahle záměna zůstala nepovšimnutá,
    // dokud se nezjistilo, že LOVABLE_API_KEY vůbec není nastavený.
    const bezProvidera = await createSessionEvalHandler(
      mkDeps({ hasProvider: () => false }),
    )(mkRequest(zakladniPozadavek));
    const rozbitaAi = await createSessionEvalHandler(
      mkDeps({ callAi: mkAiResponse({}, 500) }),
    )(mkRequest(zakladniPozadavek));

    expect(bezProvidera.status).toBe(503);
    expect(rozbitaAi.status).toBe(500);
  });
});

describe("session-evaluation — happy path", () => {
  it("AI vrátí content → evaluation field v response", async () => {
    const callAi = mkAiResponse({
      choices: [{ message: { content: "Skvělá práce v matematice!" } }],
    });
    const res = await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest({ ...zakladniPozadavek, topicTitle: "Násobilka", correctCount: 6, wrongCount: 0 }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).evaluation).toBe("Skvělá práce v matematice!");
  });

  it("AI vrátí prázdný content → empty evaluation", async () => {
    const callAi = mkAiResponse({ choices: [{ message: { content: "" } }] });
    const res = await createSessionEvalHandler(mkDeps({ callAi }))(
      mkRequest(zakladniPozadavek),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).evaluation).toBe("");
  });

  it("malformed JSON request → 500", async () => {
    const res = await createSessionEvalHandler(mkDeps())(
      new Request("http://localhost/", {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(res.status).toBe(500);
  });
});

describe("session-evaluation — CORS", () => {
  it("OPTIONS → 200 s CORS headers", async () => {
    const callAi = vi.fn();
    const res = await createSessionEvalHandler(mkDeps({ callAi }))(
      new Request("http://localhost/", { method: "OPTIONS" }),
    );
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(callAi).not.toHaveBeenCalled();
  });

  it("POST response má CORS headers", async () => {
    const res = await createSessionEvalHandler(mkDeps())(mkRequest(zakladniPozadavek));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("session-evaluation — content rules (anti-emoji, no percent)", () => {
  it("system prompt zakazuje emotikony", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(mkRequest(zakladniPozadavek));
    expect(zpravy(callAi)[0].content).toContain("Nepoužívej emotikony");
  });

  it("system prompt zakazuje procenta", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(mkRequest(zakladniPozadavek));
    expect(zpravy(callAi)[0].content).toContain("Nikdy nezmiňuj procenta");
  });

  it("system prompt přikazuje tykání", async () => {
    const callAi = mkAiResponse(validResponse);
    await createSessionEvalHandler(mkDeps({ callAi }))(mkRequest(zakladniPozadavek));
    expect(zpravy(callAi)[0].content).toContain("tykej");
  });
});
