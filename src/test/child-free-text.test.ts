/**
 * Volný text dítěte nesmí odejít k jazykovému modelu.
 *
 * Zásady soukromí slibují rodičům, že model „nedostane jméno dítěte ani
 * text jeho odpovědí". Do 7. 10. 2026 v orchestrátoru ležela cesta, která
 * nesrozumitelný vstup dítěte posílala edge funkci `semantic-gate` (Groq).
 * Z dětského UI byla nedosažitelná — ale stačilo, aby se stav
 * `INPUT_CAPTURE` zase otevřel, a slib by tiše přestal platit.
 *
 * Dvě měřítka: konstrukční (nikde v `src/` se na `semantic-gate` nesahá)
 * a chování (nesrozumitelný vstup projde orchestrátorem bez jediného
 * síťového volání).
 *
 * Ověřeno obráceně: s vráceným `classifySemanticInput` v orchestrátoru
 * padají obě měřítka.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { createSession, processState } from "@/lib/sessionOrchestrator";

const SRC = resolve(__dirname, "..");

function soubory(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === "test" || n === "__tests__" ? [] : soubory(p);
    return /\.(ts|tsx)$/.test(n) ? [p] : [];
  });
}

describe("volný text dítěte nejde k jazykovému modelu", () => {
  afterEach(() => vi.restoreAllMocks());

  it("v aplikaci nic nevolá semantic-gate", () => {
    const nalezy = soubory(SRC).filter((p) =>
      /semantic-gate|classifySemanticInput/.test(readFileSync(p, "utf-8")),
    );
    expect(nalezy.map((p) => p.slice(SRC.length + 1))).toEqual([]);
  });

  it("nesrozumitelný vstup projde orchestrátorem bez síťového volání", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ semantic_valid: true }), { status: 200 }),
    );
    const s0 = createSession(3);
    const { session: s1 } = await processState(s0); // INIT → INPUT_CAPTURE
    expect(s1.state).toBe("INPUT_CAPTURE");
    await processState(s1, "qwrtz xkcd plmbr");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
