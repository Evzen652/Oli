import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEvaluateEssayHandler, type EvaluateEssayDeps } from "../../supabase/functions/evaluate-essay/handler";

/**
 * Edge fn integration testy: evaluate-essay (Fáze 11).
 *
 * Testujeme handler izolovaně s injektovaným aiCall + hasAnyAiProvider.
 * Žádný Deno runtime, žádný síťový access.
 *
 * Pokrývá:
 *  - Validation: chybí prompt/essay → 400
 *  - AI provider missing → 503
 *  - Short-text short-circuit (no AI call → ušetří kvótu)
 *  - AI gateway error → 500 s sanitized body
 *  - Tool call response parsing + sanity clamp (skóre 0-100)
 *  - Suggestion/errors slicing (max 3 / max 5)
 *  - Default values (grade_min=5, min_words=30)
 *  - CORS preflight (OPTIONS)
 */

const mkAiCall = (responseBody: unknown, ok = true, status = 200) => {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(responseBody), {
      status: ok ? status : status,
      statusText: ok ? "OK" : "Error",
    }) as Response
  );
};

const goodGradeResponse = {
  choices: [{
    message: {
      tool_calls: [{
        function: {
          arguments: JSON.stringify({
            score: 75,
            praise: "Pěkný text.",
            suggestions: ["Přidej úvod.", "Zkus pestřejší slovník."],
            errors: ["malý překlep"],
          }),
        },
      }],
    },
  }],
};

const okDeps = (overrides: Partial<EvaluateEssayDeps> = {}): EvaluateEssayDeps => ({
  aiCall: mkAiCall(goodGradeResponse),
  hasAnyAiProvider: () => true,
  ...overrides,
});

const mkRequest = (body: unknown, method = "POST"): Request => {
  return new Request("http://localhost/evaluate-essay", {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("evaluate-essay handler — input validation", () => {
  it("missing prompt → 400", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const res = await handler(mkRequest({ essay: "Tady je text" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Missing required.*prompt/);
  });

  it("missing essay → 400", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const res = await handler(mkRequest({ prompt: "Napiš o víkendu" }));
    expect(res.status).toBe(400);
  });

  it("missing both → 400", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const res = await handler(mkRequest({}));
    expect(res.status).toBe(400);
  });

  it("malformed JSON → 500", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const req = new Request("http://localhost/", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(500);
  });
});

describe("evaluate-essay handler — provider availability", () => {
  it("hasAnyAiProvider=false → 503", async () => {
    const handler = createEvaluateEssayHandler(okDeps({ hasAnyAiProvider: () => false }));
    const res = await handler(mkRequest({ prompt: "P", essay: "Text dlouhý dost slov tady aspoň pět." }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/AI provider/);
  });
});

describe("evaluate-essay handler — short-text short-circuit (cost saving)", () => {
  it("text pod minWords/3 → vrátí preset bez AI volání", async () => {
    const aiCall = mkAiCall(goodGradeResponse);
    const handler = createEvaluateEssayHandler({ aiCall, hasAnyAiProvider: () => true });
    const res = await handler(mkRequest({
      prompt: "Napiš",
      essay: "jedno", // 1 word, min 30 → 30/3=10 threshold
      min_words: 30,
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.score).toBe(10);
    expect(body.praise).toMatch(/krátký/i);
    expect(aiCall).not.toHaveBeenCalled(); // KEY assertion
  });

  it("text NAD short-circuit threshold → AI volání proběhne", async () => {
    const aiCall = mkAiCall(goodGradeResponse);
    const handler = createEvaluateEssayHandler({ aiCall, hasAnyAiProvider: () => true });
    const longText = "jedno dva tři čtyři pět šest sedm osm devět deset jedenáct dvanáct";
    const res = await handler(mkRequest({
      prompt: "Napiš",
      essay: longText,
      min_words: 30,
    }));
    expect(res.status).toBe(200);
    expect(aiCall).toHaveBeenCalledTimes(1);
  });

  it("short-circuit hard floor: i s min_words=3 vyžaduje aspoň 5 slov", () => {
    // Math.max(5, 3/3) = max(5, 1) = 5 → potřeba aspoň 5 slov
    const handler = createEvaluateEssayHandler(okDeps());
    return handler(mkRequest({ prompt: "P", essay: "jedno dva", min_words: 3 }))
      .then(async (res) => {
        const body = await res.json();
        expect(body.score).toBe(10); // short-circuit
      });
  });
});

describe("evaluate-essay handler — happy path & sanity", () => {
  it("AI vrátí plný tool_call → 200 se score, praise, suggestions", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const res = await handler(mkRequest({
      prompt: "Napiš o víkendu.",
      essay: "Dnes byl pěkný den. Jeli jsme s rodinou na výlet do hor a viděli jsme krásnou přírodu okolo. Bylo tam plno barev a já jsem se hezky bavil.",
      grade_min: 4,
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.score).toBe(75);
    expect(body.praise).toBe("Pěkný text.");
    expect(body.suggestions).toEqual(["Přidej úvod.", "Zkus pestřejší slovník."]);
    expect(body.errors).toEqual(["malý překlep"]);
  });

  it("score je clamped na [0, 100] (sanity guard proti AI hallucination)", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({ score: 150, praise: "x", suggestions: [] }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.score).toBe(100);
  });

  it("score záporný → clamped na 0", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({ score: -50, praise: "x", suggestions: [] }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.score).toBe(0);
  });

  it("score=NaN → fallback na 0", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({ score: "abc", praise: "x", suggestions: [] }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.score).toBe(0);
  });

  it("suggestions slice na max 3 (anti spam)", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({
            score: 80, praise: "x",
            suggestions: ["a", "b", "c", "d", "e"],
          }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.suggestions).toHaveLength(3);
  });

  it("errors slice na max 5", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({
            score: 80, praise: "x", suggestions: [],
            errors: ["a", "b", "c", "d", "e", "f", "g"],
          }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.errors).toHaveLength(5);
  });

  it("missing praise → fallback string", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({ score: 80, suggestions: [] }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.praise).toBeTruthy();
  });

  it("non-array suggestions → empty array", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({
        choices: [{
          message: { tool_calls: [{ function: { arguments: JSON.stringify({ score: 80, praise: "x", suggestions: "not array" }) } }] },
        }],
      }),
    }));
    const body = await (await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }))).json();
    expect(body.suggestions).toEqual([]);
  });
});

describe("evaluate-essay handler — AI gateway errors", () => {
  it("AI vrátí non-2xx → 500", async () => {
    const handler = createEvaluateEssayHandler({
      aiCall: vi.fn().mockResolvedValue(new Response("server error", { status: 502 })),
      hasAnyAiProvider: () => true,
    });
    const res = await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/AI gateway/);
  });

  it("AI bez tool_calls → 500", async () => {
    const handler = createEvaluateEssayHandler(okDeps({
      aiCall: mkAiCall({ choices: [{ message: { content: "no tool call" } }] }),
    }));
    const res = await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }));
    expect(res.status).toBe(500);
  });

  it("AI throws (network down) → 500", async () => {
    const handler = createEvaluateEssayHandler({
      aiCall: vi.fn().mockRejectedValue(new Error("network failure")),
      hasAnyAiProvider: () => true,
    });
    const res = await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }));
    expect(res.status).toBe(500);
  });
});

describe("evaluate-essay handler — CORS / OPTIONS preflight", () => {
  it("OPTIONS request → 200 s CORS headers", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const req = new Request("http://localhost/", { method: "OPTIONS" });
    const res = await handler(req);
    // OPTIONS odpovídá s 200 / no body / CORS headers
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Headers")).toMatch(/authorization/);
  });

  it("všechny non-error responses mají CORS Access-Control-Allow-Origin", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const res = await handler(mkRequest({
      prompt: "P", essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo.",
    }));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("evaluate-essay handler — text length cap (DOS guard)", () => {
  it("essay > 4000 znaků → truncated, ne crash", async () => {
    const handler = createEvaluateEssayHandler(okDeps());
    const giant = "slovo ".repeat(5000); // >> 4000 chars
    const res = await handler(mkRequest({ prompt: "P", essay: giant }));
    // Should still return 200 (essayText truncated to 4000)
    expect(res.status).toBe(200);
  });
});

describe("evaluate-essay handler — defaults", () => {
  it("bez grade_min → default 5", async () => {
    const aiCall = mkAiCall(goodGradeResponse);
    const handler = createEvaluateEssayHandler({ aiCall, hasAnyAiProvider: () => true });
    await handler(mkRequest({
      prompt: "P",
      essay: "Slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo slovo dvanáct.",
    }));
    const callArgs = aiCall.mock.calls[0][0];
    const userMsg = callArgs.messages[1].content;
    expect(userMsg).toMatch(/Cílový ročník: 5/);
  });

  it("bez min_words → default 30", async () => {
    const aiCall = mkAiCall(goodGradeResponse);
    const handler = createEvaluateEssayHandler({ aiCall, hasAnyAiProvider: () => true });
    // Send 8 words — pod default minimum 30, ale nad 5/3=10... 8 < 10 → short-circuit
    await handler(mkRequest({ prompt: "P", essay: "jedno dva tři čtyři pět šest sedm osm" }));
    // 8 < Math.max(5, 30/3) = 10 → short-circuit (žádný AI call)
    expect(aiCall).not.toHaveBeenCalled();
  });
});
