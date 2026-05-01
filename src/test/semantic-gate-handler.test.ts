import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSemanticGateHandler, type SemanticGateDeps } from "../../supabase/functions/semantic-gate/handler";

/**
 * Edge fn integration: semantic-gate handler.
 *
 * Pokrývá:
 *  - Validation: prázdný / non-string input → fallback (no AI call)
 *  - Missing API key → fallback (catch-all path)
 *  - AI 429 → 429 status + error
 *  - AI 402 → 402 status
 *  - AI 5xx → fallback (safe, ne propagovat error)
 *  - AI tool_call s structured response → mapping
 *  - AI bez tool_call → fallback
 *  - Sanity: semantic_domain coerce na "school" | "non-school"
 *  - CORS preflight (OPTIONS)
 *  - Malformed JSON request → fallback
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
  new Request("http://localhost/semantic-gate", {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

const validToolCall = {
  choices: [{
    message: {
      tool_calls: [{
        function: {
          arguments: JSON.stringify({ semantic_valid: true, semantic_domain: "school" }),
        },
      }],
    },
  }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("semantic-gate — input validation (no AI call)", () => {
  it("prázdný input → fallback bez AI call", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const deps: SemanticGateDeps = { fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" };
    const handler = createSemanticGateHandler(deps);
    const res = await handler(mkRequest({ input: "" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(body.semantic_domain).toBe("non-school");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("whitespace-only → fallback bez AI", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({ input: "   " }));
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("non-string input → fallback", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({ input: 42 }));
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("missing input field → fallback", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const res = await handler(mkRequest({}));
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("malformed JSON request → fallback (catch-all)", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({ fetch: fetchMock as unknown as typeof fetch, getApiKey: () => "key" });
    const req = new Request("http://localhost/", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
  });
});

describe("semantic-gate — API key missing", () => {
  it("getApiKey vrací undefined → fallback (catch-all)", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => undefined,
    });
    const res = await handler(mkRequest({ input: "zlomky" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(body.semantic_domain).toBe("non-school");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("semantic-gate — happy path s AI", () => {
  it("AI tool_call school+valid → mapping na response", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "test-key",
    });
    const res = await handler(mkRequest({ input: "zlomky" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.semantic_valid).toBe(true);
    expect(body.semantic_domain).toBe("school");
  });

  it("AI tool_call s 'non-school' → mapping zachová", async () => {
    const fetchMock = mkAiCall({
      choices: [{
        message: {
          tool_calls: [{
            function: {
              arguments: JSON.stringify({ semantic_valid: false, semantic_domain: "non-school" }),
            },
          }],
        },
      }],
    });
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "banán" }));
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(body.semantic_domain).toBe("non-school");
  });

  it("AI vrátí semantic_domain s neznámou hodnotou → coerce na 'non-school'", async () => {
    const fetchMock = mkAiCall({
      choices: [{
        message: {
          tool_calls: [{
            function: {
              arguments: JSON.stringify({ semantic_valid: true, semantic_domain: "garbage-value" }),
            },
          }],
        },
      }],
    });
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    const body = await res.json();
    expect(body.semantic_domain).toBe("non-school");
  });

  it("AI bez tool_calls → fallback", async () => {
    const fetchMock = mkAiCall({ choices: [{ message: { content: "no tool" } }] });
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
    expect(body.semantic_domain).toBe("non-school");
  });

  it("AI vrátí truthy non-boolean semantic_valid → coerce na true", async () => {
    const fetchMock = mkAiCall({
      choices: [{
        message: {
          tool_calls: [{
            function: {
              arguments: JSON.stringify({ semantic_valid: "yes", semantic_domain: "school" }),
            },
          }],
        },
      }],
    });
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    const body = await res.json();
    expect(body.semantic_valid).toBe(true);
  });
});

describe("semantic-gate — AI gateway errors", () => {
  it("AI 429 → 429 status + error message", async () => {
    const fetchMock = mkAiCall({}, 429);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toMatch(/Rate limited/i);
  });

  it("AI 402 → 402 status + payment required", async () => {
    const fetchMock = mkAiCall({}, 402);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.error).toMatch(/Payment/i);
  });

  it("AI 500 → fallback (safe, ne propagovat error)", async () => {
    const fetchMock = mkAiCall({}, 500);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
  });

  it("AI throws → fallback (catch-all)", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "test" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.semantic_valid).toBe(false);
  });
});

describe("semantic-gate — CORS", () => {
  it("OPTIONS → 200 s CORS headers", async () => {
    const handler = createSemanticGateHandler({
      fetch: vi.fn() as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(new Request("http://localhost/", { method: "OPTIONS" }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Headers")).toMatch(/authorization/i);
  });

  it("non-OPTIONS responses obsahují CORS", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    const res = await handler(mkRequest({ input: "" }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("semantic-gate — security: input se trim'í, vkládá se do prompt", () => {
  it("input.trim() je předaný do AI prompt", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    await handler(mkRequest({ input: "  zlomky  " }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.messages[1].content).toContain("zlomky");
    expect(callBody.messages[1].content).not.toContain("  zlomky  "); // trimmed
  });

  it("AI request používá google/gemini-2.5-flash-lite (nejlevnější model)", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "key",
    });
    await handler(mkRequest({ input: "test" }));
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(callBody.model).toBe("google/gemini-2.5-flash-lite");
  });

  it("API key je v Authorization header, ne v query/body", async () => {
    const fetchMock = mkAiCall(validToolCall);
    const handler = createSemanticGateHandler({
      fetch: fetchMock as unknown as typeof fetch,
      getApiKey: () => "secret-key-xyz",
    });
    await handler(mkRequest({ input: "test" }));
    const callOpts = fetchMock.mock.calls[0][1] as RequestInit;
    expect((callOpts.headers as Record<string, string>).Authorization).toBe("Bearer secret-key-xyz");
    expect(callOpts.body).not.toContain("secret-key-xyz");
  });
});
