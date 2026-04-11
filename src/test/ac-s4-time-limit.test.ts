import { describe, it, expect } from "vitest";
import { createSession, transition, processState } from "../lib/sessionOrchestrator";
import { getAuditLog } from "../lib/logger";
import type { SessionData } from "../lib/types";

async function startSession(): Promise<{ session: SessionData; output: string }> {
  const s = createSession(3);
  return processState(s);
}

describe("AC-S4 – TIME LIMIT → TERMINAL STATE", () => {
  it("triggers STOP_2 → END when elapsedSeconds >= maxDurationSeconds during EXPLAIN", async () => {
    let { session } = await startSession();

    let result = await processState(session, "které číslo je větší");
    session = result.session;
    expect(session.state).toBe("PRACTICE");

    session.startTime = Date.now() - (session.rules.maxDurationSeconds + 1) * 1000;

    result = await processState(session, "62");
    session = result.session;

    const terminalStates = ["STOP_2", "END"];
    expect(terminalStates).toContain(session.state);
  });

  it("time-expired session has correct audit log entry", async () => {
    let { session } = await startSession();

    let result = await processState(session, "které číslo je větší");
    session = result.session;

    session.startTime = Date.now() - (session.rules.maxDurationSeconds + 10) * 1000;

    result = await processState(session);
    session = result.session;

    const log = getAuditLog();
    const sessionLogs = log.filter((e) => e.sessionId === session.id);
    const terminalLog = sessionLogs[sessionLogs.length - 1];

    expect(["STOP_2", "END"]).toContain(terminalLog.sessionState);
  });

  it("different grades have different maxDurationSeconds", () => {
    const s3 = createSession(3);
    const s7 = createSession(7);
    const s9 = createSession(9);

    expect(s3.rules.maxDurationSeconds).toBe(600);
    expect(s7.rules.maxDurationSeconds).toBe(1200);
    expect(s9.rules.maxDurationSeconds).toBe(1500);
  });
});
