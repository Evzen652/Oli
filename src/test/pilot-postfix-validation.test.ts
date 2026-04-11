import { describe, it, expect } from "vitest";
import { createSession, processState } from "../lib/sessionOrchestrator";
import type { SessionData, Grade } from "../lib/types";

const GRADE: Grade = 3;
const TOPICAL_INPUT = "které číslo je větší";

interface SessionResult {
  profile: string;
  index: number;
  finalState: string;
  stopReason: string | null;
  confusionCount: number;
  errorCount: number;
  stateSequence: string[];
  runtimeError: string | null;
}

async function runSession(inputs: (string | null)[], profile: string, index: number): Promise<SessionResult> {
  const stateSequence: string[] = [];

  try {
    const s = createSession(GRADE);
    let { session } = await processState(s);
    stateSequence.push(session.state);

    for (const input of inputs) {
      if (session.state === "END") break;
      if (session.state === "STOP_2") {
        const r = await processState(session);
        session = r.session;
        stateSequence.push(session.state);
        break;
      }
      const r = input !== null ? await processState(session, input) : await processState(session);
      session = r.session;
      stateSequence.push(session.state);
    }

    if (session.state === "STOP_2") {
      const r = await processState(session);
      session = r.session;
      stateSequence.push(session.state);
    }

    return {
      profile, index,
      finalState: session.state,
      stopReason: session.stopReason,
      confusionCount: session.confusionCount,
      errorCount: session.errorCount,
      stateSequence,
      runtimeError: null,
    };
  } catch (e: any) {
    return {
      profile, index,
      finalState: "CRASH",
      stopReason: null,
      confusionCount: -1,
      errorCount: -1,
      stateSequence,
      runtimeError: e.message,
    };
  }
}

function p3Session(i: number): Promise<SessionResult> {
  const patterns: (string | null)[][] = [
    ["42", "banán"],
    ["nevím", "pomoc"],
    ["99", TOPICAL_INPUT, null, "999"],
    ["nevím", "55", "nechápu"],
    ["xyz abc def"],
    [TOPICAL_INPUT, null, "38", null, null, "38", null, null, "38"],
    ["nevím", TOPICAL_INPUT, null, "38", null, "62"],
    ["10", "20", "30", "kočka"],
    ["pomoz mi", "77", "zzzzz"],
    [TOPICAL_INPUT, null, "sčítání"],
    ["nerozumím", "nevím"],
    ["nevím", "nevím co psát"],
  ];
  return runSession(patterns[i % patterns.length], "P3", i);
}

function p4Session(i: number): Promise<SessionResult> {
  const patterns: (string | null)[][] = [
    [TOPICAL_INPUT, null, "nevím"],
    ["nevím", "nevím"],
    ["nevím", "pomoc"],
    ["nechápu", "nevím"],
    ["pomoz mi", "poraď mi"],
    ["nevím co napsat", "nevím"],
    [TOPICAL_INPUT, null, "38", null, null, "nevím"],
    ["nevím", "nevím to"],
    ["nerozumím", "nechápu"],
    ["nevím co psát", "pomoc"],
    ["nevím", "pomoz mi"],
    ["nevím co napsat", "nevím co psát"],
  ];
  return runSession(patterns[i % patterns.length], "P4", i);
}

describe("POST-FIX VALIDATION – P3 + P4 (STOP_1 crash fix)", () => {
  const results: SessionResult[] = [];

  it("P3 – Chaotik (12 sessions, no crash)", async () => {
    for (let i = 0; i < 12; i++) {
      results.push(await p3Session(i));
    }
    const p3 = results.filter((r) => r.profile === "P3");
    const crashes = p3.filter((r) => r.runtimeError !== null);
    expect(crashes.length).toBe(0);
  });

  it("P4 – Tichý rezignér (12 sessions, no crash)", async () => {
    for (let i = 0; i < 12; i++) {
      results.push(await p4Session(i));
    }
    const p4 = results.filter((r) => r.profile === "P4");
    const crashes = p4.filter((r) => r.runtimeError !== null);
    expect(crashes.length).toBe(0);
  });

  it("VALIDATION REPORT", () => {
    expect(results.length).toBe(24);
    const crashes = results.filter((r) => r.runtimeError !== null);
    const confusionThreshold = results.filter((r) => r.stopReason === "confusion_threshold");
    expect(crashes.length).toBe(0);
    expect(confusionThreshold.length).toBeGreaterThan(0);
  });
});
