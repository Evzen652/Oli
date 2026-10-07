/**
 * Serverová kopie anonymního pokroku — dorazí zápis opravdu do `anon-progress`?
 *
 * Proč: `markTaskCompleted` zrcadlí splněný úkol na server (fire-and-forget)
 * a zásady soukromí s tou kopií počítají (44 dní). Do 7. 10. 2026 to nic
 * neověřovalo — kdyby zrcadlení vypadlo, localStorage by fungoval dál
 * a nikdo by si ničeho nevšiml (předání to vedlo jako otevřený bod).
 *
 * Měří se klientská strana: že po splnění úkolu odejde právě jedno volání
 * `record` se správným tématem, ročníkem, ořezaným skóre a tokenem. Ostrý
 * server se nevolá — zápis by založil řádky v produkční databázi.
 *
 * Ověřeno obráceně: po zakomentování `serverRecordTask(...)`
 * v `markTaskCompleted` padají oba testy, které zápis čekají.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const invoke = vi.fn(async () => ({ data: { ok: true }, error: null }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...a: unknown[]) => invoke(...(a as [])) } },
}));

import { getTodayProgress, markTaskCompleted } from "@/lib/anonProgress";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("anonymní pokrok → serverová kopie", () => {
  beforeEach(() => {
    localStorage.clear();
    invoke.mockClear();
  });

  it("splněný úkol odešle `record` s tématem, ročníkem, skóre a tokenem", () => {
    const den = getTodayProgress(3);
    const topicId = den.tasks[0].topicId;
    markTaskCompleted(topicId, 0.5);

    expect(invoke).toHaveBeenCalledTimes(1);
    const [fn, opts] = invoke.mock.calls[0] as unknown as [string, { body: Record<string, unknown> }];
    expect(fn).toBe("anon-progress");
    expect(opts.body).toMatchObject({ action: "record", topicId, grade: 3, score: 0.5 });
    expect(String(opts.body.token)).toMatch(UUID_RE);
    // token je tentýž, který leží v localStorage (podle něj se pokrok adoptuje)
    expect(opts.body.token).toBe(localStorage.getItem("oli_anon_token"));
  });

  it("skóre mimo 0..1 se ořízne dřív, než odejde na server", () => {
    const den = getTodayProgress(2);
    markTaskCompleted(den.tasks[0].topicId, 7);
    const [, opts] = invoke.mock.calls[0] as unknown as [string, { body: Record<string, unknown> }];
    expect(opts.body.score).toBe(1);
  });

  it("téma, které dnes mezi úkoly není, nic neodešle", () => {
    getTodayProgress(3);
    markTaskCompleted("neexistujici-tema", 1);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("výpadek serveru neshodí zápis do localStorage", async () => {
    invoke.mockImplementationOnce(async () => { throw new Error("Failed to fetch"); });
    const den = getTodayProgress(3);
    expect(() => markTaskCompleted(den.tasks[0].topicId, 1)).not.toThrow();
    await Promise.resolve();
    const ulozeno = JSON.parse(localStorage.getItem("oli_anon_progress")!);
    expect(ulozeno.tasks[0].completed).toBe(true);
  });
});
