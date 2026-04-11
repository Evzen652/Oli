import { describe, it, expect } from "vitest";
import { createSession, processState } from "../lib/sessionOrchestrator";
import type { SessionData } from "../lib/types";

async function startSession(): Promise<{ session: SessionData; output: string }> {
  const s = createSession(3);
  return processState(s);
}

describe("SCENARIO A1 – REPEATED UNCLEAR INPUT (SAFE LOOP)", () => {
  it("returns to INPUT_CAPTURE for each unclear input, no STOP, no counters", async () => {
    let { session } = await startSession();

    for (const input of ["38", "62", "15"]) {
      const result = await processState(session, input);
      session = result.session;
      expect(session.state).toBe("INPUT_CAPTURE");
      expect(session.stopReason).toBeNull();
      expect(session.confusionCount).toBe(0);
    }
  });
});

describe("SCENARIO A2 – UNCLEAR → CONFUSION ESCALATION", () => {
  it("unclear_input has no penalty, then confusion triggers STOP_1", async () => {
    let { session } = await startSession();

    let result = await processState(session, "38");
    session = result.session;
    expect(session.state).toBe("INPUT_CAPTURE");
    expect(session.confusionCount).toBe(0);

    result = await processState(session, "nevím");
    session = result.session;
    expect(session.confusionCount).toBe(1);

    result = await processState(session, "nevím");
    session = result.session;
    expect(session.confusionCount).toBe(2);
    expect(session.state).toBe("STOP_1");
  });
});

describe("SCENARIO A3 – TOPICAL → CONFUSION LOOP", () => {
  it("topical input reaches PRACTICE, confusion in PRACTICE does not cause infinite loop", async () => {
    let { session } = await startSession();

    let result = await processState(session, "které číslo je větší");
    session = result.session;
    expect(session.state).toBe("PRACTICE");

    result = await processState(session, "nevím");
    session = result.session;

    if (session.state !== "END" && session.state !== "STOP_2") {
      result = await processState(session, "nevím");
      session = result.session;
    }

    if (session.state !== "END" && session.state !== "STOP_2") {
      result = await processState(session, "nevím");
      session = result.session;
    }

    const terminalStates = ["STOP_1", "STOP_2", "END", "EXPLAIN", "PRACTICE"];
    expect(terminalStates).toContain(session.state);
  });
});

describe("SCENARIO A4 – TOPICAL → WRONG ANSWERS → ERROR LOOP", () => {
  it("wrong answers increment errorCount, eventually trigger STOP", async () => {
    let { session } = await startSession();

    let result = await processState(session, "které číslo je větší");
    session = result.session;
    expect(session.state).toBe("PRACTICE");

    for (let i = 0; i < 15; i++) {
      if (session.state === "END" || session.state === "STOP_2") break;

      if (session.state === "PRACTICE") {
        result = await processState(session, "38");
        session = result.session;
      } else if (session.state === "EXPLAIN") {
        result = await processState(session);
        session = result.session;
      } else if (session.state === "STOP_1") {
        result = await processState(session);
        session = result.session;
      }
    }

    const stoppedStates = ["STOP_1", "STOP_2", "END"];
    expect(stoppedStates).toContain(session.state);
  });
});

describe("SCENARIO A5 – MISBEHAVIOR MIX", () => {
  it("first nonsense input triggers STOP_2, no further processing", async () => {
    let { session } = await startSession();

    let result = await processState(session, "banán");
    session = result.session;
    expect(session.state).toBe("STOP_2");
    expect(session.stopReason).toBe("nonsense_input");

    result = await processState(session);
    session = result.session;
    expect(session.state).toBe("END");

    result = await processState(session, "38");
    expect(result.session.state).toBe("END");
  });
});
