import { describe, it, expect, beforeEach } from "vitest";
import { createSession, processState } from "@/lib/sessionOrchestrator";
import { ANON_LEVELS_KEY, __resetLevelMemory } from "@/lib/levelStore";
import type { SessionData } from "@/lib/types";

/**
 * Postup úrovní MEZI sezeními, celou cestou přes orchestrátor — tak, jak
 * sezení končí v aplikaci (přechod do END uprostřed CHECK, ne `case "END"`).
 *
 * Proč tenhle test: do 2026-09-30 se výpočet postupu nevolal nikdy (byl jen
 * v `case "END"`, do kterého se nevstoupilo) a anonymním dětem se úroveň
 * ani neukládala. Testy to nechytily, protože volaly `computeNextLevel` přímo.
 */

async function sezeni(spravne: boolean): Promise<SessionData> {
  let s = createSession(3);
  s = (await processState(s)).session;
  s = (await processState(s, "sčítání")).session;
  expect(s.state).toBe("PRACTICE");
  for (let i = 0; i < 80 && s.state !== "END"; i++) {
    const task = s.practiceBatch[s.currentTaskIndex];
    const r = await processState(s, spravne && task ? task.correctAnswer : "úplně špatně 999");
    s = r.session;
  }
  expect(s.state).toBe("END");
  return s;
}

const ulozeno = () => JSON.parse(localStorage.getItem(ANON_LEVELS_KEY) ?? "{}");

beforeEach(() => {
  localStorage.clear();
  __resetLevelMemory();
});

describe("postup úrovní — anonymní dítě, celou cestou přes orchestrátor", () => {
  it("1. dobré sezení: úroveň stejná, série 1; uloží se do localStorage", async () => {
    const s = await sezeni(true);
    expect(s.levelResult).toMatchObject({ direction: "same", newLevel: 1, consecutiveGood: 1 });
    expect(ulozeno()[s.matchedTopic!.id]).toMatchObject({ level: 1, consecutiveGood: 1 });
  });

  it("2 dobrá sezení za sebou → L2, a další sezení OPRAVDU začne na L2", async () => {
    const a = await sezeni(true);
    const b = await sezeni(true);
    expect(b.matchedTopic!.id).toBe(a.matchedTopic!.id);
    expect(b.maxLevel).toBeGreaterThanOrEqual(2);
    expect(b.levelResult).toMatchObject({ direction: "up", newLevel: 2 });

    let c = createSession(3);
    c = (await processState(c)).session;
    c = (await processState(c, "sčítání")).session;
    expect(c.currentLevel).toBe(2);
  });

  it("platí i po „novém načtení stránky“ (paměť pryč, zůstane localStorage)", async () => {
    await sezeni(true);
    await sezeni(true);
    __resetLevelMemory();
    let c = createSession(3);
    c = (await processState(c)).session;
    c = (await processState(c, "sčítání")).session;
    expect(c.currentLevel).toBe(2);
  });

  it("špatné sezení na L2 → zpět na L1", async () => {
    await sezeni(true);
    await sezeni(true);
    const d = await sezeni(false);
    expect(d.levelResult).toMatchObject({ direction: "down", newLevel: 1 });
  });

  it("sezení bez jediné prošlé úlohy úroveň nemění (skóre 0 by ji jinak snížilo)", async () => {
    await sezeni(true);
    await sezeni(true);
    const tema = Object.keys(ulozeno())[0];
    const pred = ulozeno()[tema];
    // Konec hned na začátku: vyprší čas dřív, než dítě odpoví.
    let s = createSession(3);
    s = (await processState(s)).session;
    s = (await processState(s, "sčítání")).session;
    s = (await processState({ ...s, state: "STOP_2", stopReason: "time_expired" })).session;
    expect(s.state).toBe("END");
    expect(s.levelResult).toBeUndefined();
    expect(ulozeno()[tema]).toEqual(pred);
  });
});
