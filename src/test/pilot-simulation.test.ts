import { describe, it, expect } from "vitest";
import { createSession, processState } from "../lib/sessionOrchestrator";
import { getAuditLog } from "../lib/logger";
import type { SessionData, Grade } from "../lib/types";

const GRADE: Grade = 3;
const TOPICAL_INPUT = "které číslo je větší";

interface SessionResult {
  profile: string;
  sessionIndex: number;
  finalState: string;
  stopReason: string | null;
  errorCount: number;
  confusionCount: number;
  elapsedSeconds: number;
  stateSequence: string[];
  boundaryViolation: boolean;
}

async function runSession(
  inputs: (string | null)[],
  profile: string,
  sessionIndex: number,
  timeOverride?: number,
): Promise<SessionResult> {
  const s = createSession(GRADE);
  let { session, output } = await processState(s);
  const stateSequence: string[] = [session.state];

  if (timeOverride) {
    session.startTime = Date.now() - timeOverride * 1000;
  }

  for (const input of inputs) {
    if (session.state === "END" || session.state === "STOP_2") {
      if (session.state === "STOP_2") {
        const r = await processState(session);
        session = r.session;
        stateSequence.push(session.state);
      }
      break;
    }

    const r = input !== null
      ? await processState(session, input)
      : await processState(session);
    session = r.session;
    stateSequence.push(session.state);

    if (session.state === "STOP_1") {
      if (session.matchedTopic) {
        const r2 = await processState(session);
        session = r2.session;
        stateSequence.push(session.state);
      } else {
        break;
      }
    }
  }

  if (session.state === "STOP_2") {
    const r = await processState(session);
    session = r.session;
    stateSequence.push(session.state);
  }

  return {
    profile, sessionIndex,
    finalState: session.state,
    stopReason: session.stopReason,
    errorCount: session.errorCount,
    confusionCount: session.confusionCount,
    elapsedSeconds: session.elapsedSeconds,
    stateSequence,
    boundaryViolation: session.stopReason === "boundary_violation",
  };
}

async function p1Session(index: number) {
  if (index % 3 === 0) return runSession([TOPICAL_INPUT, null, "38", null, "62"], "P1", index);
  if (index % 3 === 1) return runSession([TOPICAL_INPUT, null, "38", null, null, "38", null, null, "38"], "P1", index);
  return runSession([TOPICAL_INPUT, null, "38", null, null, "38", null, null, "nevím"], "P1", index);
}

async function p2Session(index: number) {
  return runSession([TOPICAL_INPUT, null, "38", null, null, "38", null, null, "38", null, null, "38"], "P2", index);
}

async function p3Session(index: number) {
  const patterns: (string | null)[][] = [
    ["42", "banán"], ["nevím", "pomoc"],
    ["99", TOPICAL_INPUT, null, "999"], ["nevím", "55", "nechápu"],
    ["xyz abc def"],
    [TOPICAL_INPUT, null, "38", null, null, "38", null, null, "38"],
    ["nevím", TOPICAL_INPUT, null, "38", null, "62"],
    ["10", "20", "30", "kočka"], ["pomoz mi", "77", "zzzzz"],
    [TOPICAL_INPUT, null, "sčítání"],
  ];
  return runSession(patterns[index % patterns.length], "P3", index);
}

async function p4Session(index: number) {
  if (index < 3) return runSession([TOPICAL_INPUT, null, "nevím"], "P4", index);
  if (index < 7) return runSession(["nevím", "nevím"], "P4", index);
  return runSession(["nevím", "pomoc"], "P4", index);
}

async function p5Session(index: number) {
  if (index % 3 === 0) return runSession([TOPICAL_INPUT, null, "38"], "P5", index, 590);
  if (index % 3 === 1) return runSession([TOPICAL_INPUT, null, "38", null, "62"], "P5", index);
  return runSession([TOPICAL_INPUT, null, "38", null, null, "38"], "P5", index, 550);
}

describe("PILOT SIMULATION – 55 sessions across 5 profiles", () => {
  const allResults: SessionResult[] = [];

  it("P1 – Tipovač (11 sessions)", async () => {
    for (let i = 0; i < 11; i++) allResults.push(await p1Session(i));
    expect(allResults.filter((r) => r.profile === "P1").length).toBe(11);
  });

  it("P2 – Zamrzlý (11 sessions)", async () => {
    for (let i = 0; i < 11; i++) allResults.push(await p2Session(i));
    expect(allResults.filter((r) => r.profile === "P2").length).toBe(11);
  });

  it("P3 – Chaotik (11 sessions)", async () => {
    for (let i = 0; i < 11; i++) allResults.push(await p3Session(i));
    expect(allResults.filter((r) => r.profile === "P3").length).toBe(11);
  });

  it("P4 – Tichý rezignér (11 sessions)", async () => {
    for (let i = 0; i < 11; i++) allResults.push(await p4Session(i));
    const stop1Count = allResults.filter((r) => r.profile === "P4" && r.stopReason === "confusion_threshold").length;
    expect(stop1Count).toBeGreaterThan(0);
  });

  it("P5 – Snaživec s limitem (11 sessions)", async () => {
    for (let i = 0; i < 11; i++) allResults.push(await p5Session(i));
    expect(allResults.filter((r) => r.profile === "P5").length).toBe(11);
  });

  it("PILOT REPORT – aggregate analysis", () => {
    expect(allResults.length).toBe(55);
    const stuckSessions = allResults.filter(
      (r) => !["END", "STOP_1", "STOP_2", "EXPLAIN", "PRACTICE", "CHECK", "INPUT_CAPTURE"].includes(r.finalState),
    );
    expect(stuckSessions.length).toBe(0);

    const knownReasons = new Set([null, "confusion_threshold", "nonsense_input", "no_topic_match", "boundary_violation", "stop_triggered", "max_errors"]);
    const unknownReasons = allResults.filter((r) => !knownReasons.has(r.stopReason));
    expect(unknownReasons.length).toBe(0);
  });
});
