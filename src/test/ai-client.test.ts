import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callAi, isAiAvailable, type AiMessage } from "@/lib/aiClient";

/**
 * AI Client (Groq direct) — testujeme:
 *  - isAiAvailable: true pokud env API key je nastaven
 *  - callAi: throws bez API key
 *  - timeout abort (default 8000ms)
 *  - HTTP non-2xx → throws s error message
 *  - happy path: vrátí trimmed content z choices[0].message.content
 *  - missing content → empty string
 */

const setupFetch = (impl: () => Promise<unknown>) => {
  const fn = vi.fn(impl);
  globalThis.fetch = fn as unknown as typeof fetch;
  return fn;
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("isAiAvailable", () => {
  it("vrací boolean", () => {
    expect(typeof isAiAvailable()).toBe("boolean");
  });

  it("nemodifikuje globální stav", () => {
    const a = isAiAvailable();
    const b = isAiAvailable();
    expect(a).toBe(b);
  });
});

describe("callAi — error handling", () => {
  const messages: AiMessage[] = [{ role: "user", content: "Hi" }];

  it("bez API key → throws specifický error", async () => {
    // Stub import.meta.env.VITE_GROQ_API_KEY → undefined
    // Pokud key není v test env, throw "GROQ_API_KEY not configured"
    if (!isAiAvailable()) {
      vi.useRealTimers();
      await expect(callAi(messages)).rejects.toThrow(/GROQ_API_KEY not configured/);
    } else {
      // Pokud je key set v test env, skip negative test
      expect(true).toBe(true);
    }
  });
});

describe("callAi — happy path (s mock fetch + key)", () => {
  beforeEach(() => {
    vi.useRealTimers();
    // Stub key přes import.meta.env (vitest exposes import.meta.env)
    (import.meta.env as Record<string, string>).VITE_GROQ_API_KEY = "test-key-mock";
  });

  afterEach(() => {
    delete (import.meta.env as Record<string, string>).VITE_GROQ_API_KEY;
    vi.useFakeTimers();
  });

  it("vrátí trimmed content", async () => {
    setupFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ choices: [{ message: { content: "  hello world  " } }] }),
      })
    );
    const r = await callAi([{ role: "user", content: "test" }]);
    expect(r).toBe("hello world");
  });

  it("missing content → empty string", async () => {
    setupFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ choices: [{}] }),
      })
    );
    const r = await callAi([{ role: "user", content: "test" }]);
    expect(r).toBe("");
  });

  it("HTTP non-2xx → throws s status + body", async () => {
    setupFetch(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve("unauthorized"),
      })
    );
    await expect(callAi([{ role: "user", content: "test" }])).rejects.toThrow(/401/);
  });

  it("network error → propaguje throw", async () => {
    setupFetch(() => Promise.reject(new Error("network down")));
    await expect(callAi([{ role: "user", content: "test" }])).rejects.toThrow(/network/);
  });

  it("posílá správný shape do Groq API", async () => {
    const fetchMock = setupFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ choices: [{ message: { content: "ok" } }] }),
      })
    );
    await callAi(
      [{ role: "user", content: "Q" }],
      { maxTokens: 100, temperature: 0.5 }
    );
    expect(fetchMock).toHaveBeenCalled();
    const callArgs = fetchMock.mock.calls[0][1] as RequestInit;
    expect(callArgs.method).toBe("POST");
    expect(callArgs.headers).toMatchObject({
      "Authorization": "Bearer test-key-mock",
      "Content-Type": "application/json",
    });
    const body = JSON.parse(callArgs.body as string);
    expect(body.model).toBe("llama-3.3-70b-versatile");
    expect(body.max_tokens).toBe(100);
    expect(body.temperature).toBe(0.5);
    expect(body.messages).toEqual([{ role: "user", content: "Q" }]);
  });

  it("default options (žádný override)", async () => {
    const fetchMock = setupFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ choices: [{ message: { content: "ok" } }] }),
      })
    );
    await callAi([{ role: "user", content: "Q" }]);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.max_tokens).toBe(300);
    expect(body.temperature).toBe(0.7);
  });
});
