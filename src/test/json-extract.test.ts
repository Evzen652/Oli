import { describe, it, expect } from "vitest";
import { extractJsonFromResponse } from "../../supabase/functions/_shared/jsonExtract";

/**
 * extractJsonFromResponse — JSON salvage helper pro AI responses.
 *
 * AI gateways občas vrátí JSON obalený markdown nebo s leading/trailing textem.
 * Test pokrývá:
 *  - Plain JSON object/array
 *  - JSON v markdown bloku (```json ... ```)
 *  - JSON s leading/trailing textem
 *  - Trailing commas (recovery)
 *  - Control characters (recovery)
 *  - Throws při no JSON v inputu
 */

describe("extractJsonFromResponse — happy path", () => {
  it("plain JSON object", () => {
    const r = extractJsonFromResponse('{"a": 1, "b": "hello"}') as { a: number; b: string };
    expect(r).toEqual({ a: 1, b: "hello" });
  });

  it("plain JSON array", () => {
    const r = extractJsonFromResponse("[1, 2, 3]");
    expect(r).toEqual([1, 2, 3]);
  });

  it("nested JSON", () => {
    const r = extractJsonFromResponse('{"a": {"b": [1, 2]}}');
    expect(r).toEqual({ a: { b: [1, 2] } });
  });

  it("empty object", () => {
    expect(extractJsonFromResponse("{}")).toEqual({});
  });

  it("empty array", () => {
    expect(extractJsonFromResponse("[]")).toEqual([]);
  });
});

describe("extractJsonFromResponse — markdown fence stripping", () => {
  it("```json ... ``` block", () => {
    const r = extractJsonFromResponse('```json\n{"a": 1}\n```') as { a: number };
    expect(r).toEqual({ a: 1 });
  });

  it("```JSON``` (uppercase) → také funguje", () => {
    const r = extractJsonFromResponse('```JSON\n{"x": 5}\n```');
    expect(r).toEqual({ x: 5 });
  });

  it("``` bez language identifier", () => {
    const r = extractJsonFromResponse('```\n{"y": 2}\n```');
    expect(r).toEqual({ y: 2 });
  });

  it("multiple ``` bloky → strip všechny", () => {
    const r = extractJsonFromResponse('```json\n{"a": 1}\n```\n```\nleftover\n```');
    // Strip removed all fences. Najde první { → poslední }
    expect(r).toEqual({ a: 1 });
  });
});

describe("extractJsonFromResponse — leading/trailing text", () => {
  it("leading text → strip", () => {
    const r = extractJsonFromResponse('Tady je výsledek: {"score": 75}') as { score: number };
    expect(r).toEqual({ score: 75 });
  });

  it("trailing text → strip", () => {
    const r = extractJsonFromResponse('{"x": 1} - to je vše');
    expect(r).toEqual({ x: 1 });
  });

  it("oboje leading + trailing", () => {
    const r = extractJsonFromResponse('Result: {"ok": true} done');
    expect(r).toEqual({ ok: true });
  });

  it("velké JSON s newlines + leading text", () => {
    const r = extractJsonFromResponse(
      'Here is the response:\n\n{"name": "test", "data": [1, 2, 3]}'
    );
    expect(r).toEqual({ name: "test", data: [1, 2, 3] });
  });
});

describe("extractJsonFromResponse — array detection priority", () => {
  it("první [ pred prvním { → array parsing", () => {
    const r = extractJsonFromResponse("[1, 2, 3]");
    expect(r).toEqual([1, 2, 3]);
  });

  it("první { pred prvním [ → object parsing", () => {
    const r = extractJsonFromResponse('{"items": [1, 2]}');
    expect(r).toEqual({ items: [1, 2] });
  });
});

describe("extractJsonFromResponse — recovery patterns", () => {
  it("trailing comma v object → recovery", () => {
    const r = extractJsonFromResponse('{"a": 1, "b": 2,}');
    expect(r).toEqual({ a: 1, b: 2 });
  });

  it("trailing comma v array → recovery", () => {
    const r = extractJsonFromResponse("[1, 2, 3,]");
    expect(r).toEqual([1, 2, 3]);
  });

  it("control characters (e.g. \\x01) → strip", () => {
    const json = '{"a": 1}';
    const corrupted = json.slice(0, 5) + "\x01\x02\x03" + json.slice(5);
    expect(() => extractJsonFromResponse(corrupted)).not.toThrow();
  });
});

describe("extractJsonFromResponse — error cases", () => {
  it("prázdný string → throws", () => {
    expect(() => extractJsonFromResponse("")).toThrow(/No JSON/);
  });

  it("string bez { ani [ → throws", () => {
    expect(() => extractJsonFromResponse("just plain text")).toThrow(/No JSON/);
  });

  it("nevalidní JSON i po recovery → throws (parse error)", () => {
    expect(() => extractJsonFromResponse("{not valid: json}")).toThrow();
  });

  it("string začínající { ale bez closing } → throws na druhém parse", () => {
    expect(() => extractJsonFromResponse('{"a":')).toThrow();
  });
});

describe("extractJsonFromResponse — robustness", () => {
  it("velký JSON (100k znaků) → no crash", () => {
    const big = '{"data": "' + "x".repeat(100_000) + '"}';
    const r = extractJsonFromResponse(big) as { data: string };
    expect(r.data.length).toBe(100_000);
  });

  it("hluboce vnořené nested → OK", () => {
    let deep = "";
    for (let i = 0; i < 50; i++) deep = `{"k":${deep || "1"}}`;
    expect(() => extractJsonFromResponse(deep)).not.toThrow();
  });

  it("XSS v hodnotách je preserved (parsing nezpracovává)", () => {
    const r = extractJsonFromResponse('{"html": "<script>alert(1)</script>"}') as { html: string };
    expect(r.html).toBe("<script>alert(1)</script>");
  });
});

describe("extractJsonFromResponse — real AI response patterns", () => {
  it("OpenAI style: 'Here is the JSON: ```json {...} ```'", () => {
    const aiResponse = `Here is the JSON:

\`\`\`json
{
  "score": 75,
  "praise": "Pěkná práce!",
  "suggestions": ["Tip 1", "Tip 2"]
}
\`\`\`

That's all!`;
    const r = extractJsonFromResponse(aiResponse) as Record<string, unknown>;
    expect(r.score).toBe(75);
    expect(r.suggestions).toEqual(["Tip 1", "Tip 2"]);
  });

  it("Lovable Gateway truncated tool_call arguments → recovery", () => {
    // Pretend AI vrátí trailing comma + extra whitespace
    const truncated = '{"results": [{"id": "1", "ok": true,}],}';
    const r = extractJsonFromResponse(truncated) as { results: Array<{ id: string; ok: boolean }> };
    expect(r.results).toHaveLength(1);
    expect(r.results[0].id).toBe("1");
  });
});
