import { describe, it, expect } from "vitest";
import { createSession, processState, transition } from "../lib/sessionOrchestrator";
import { getRulesForGrade, evaluateStop } from "../lib/ruleEngine";
import { classifyIntent } from "../lib/preIntent";
import { checkBoundaryViolation } from "../lib/boundaryEnforcement";
import { getAuditLog } from "../lib/logger";
import { matchTopic } from "../lib/contentRegistry";
import type { SessionData, Grade } from "../lib/types";

async function startSession(grade: Grade = 3): Promise<{ session: SessionData; output: string }> {
  const s = createSession(grade);
  return processState(s);
}

async function reachPractice(): Promise<{ session: SessionData; output: string }> {
  let { session } = await startSession();
  return processState(session, "které číslo je větší");
}

describe("RED TEAM AC-P1 – PRE_INTENT bypass attempts", () => {
  it("empty string → nonsense, not topical", () => {
    expect(classifyIntent("", 3)).toBe("nonsense");
  });
  it("whitespace-only → nonsense", () => {
    expect(classifyIntent("   ", 3)).toBe("nonsense");
  });
  it("confusion keyword embedded in topical phrase still triggers confusion", () => {
    expect(classifyIntent("nevím co je porovnávání", 3)).toBe("confusion");
  });
  it("topical keyword for wrong grade → not topical", () => {
    expect(classifyIntent("které číslo je větší", 9)).not.toBe("topical");
  });
  it("mixed nonsense with number → unclear_input", () => {
    expect(classifyIntent("42", 3)).toBe("unclear_input");
  });
  it("very long gibberish → nonsense", () => {
    expect(classifyIntent("asdfghjkl qwertyuiop zxcvbnm lkjhgfdsa poiuytrewq", 3)).toBe("nonsense");
  });
});

describe("RED TEAM AC-P2 – Confusion threshold evasion", () => {
  it("interleaving unclear_input between confusions does NOT reset confusionCount", async () => {
    let { session } = await startSession();

    let result = await processState(session, "nevím");
    session = result.session;
    expect(session.confusionCount).toBe(1);

    result = await processState(session, "42");
    session = result.session;
    expect(session.confusionCount).toBe(1);

    result = await processState(session, "pomoc");
    session = result.session;
    expect(session.confusionCount).toBe(2);
    expect(session.state).toBe("STOP_1");
  });
});

describe("RED TEAM AC-P3 – Nonsense must not escape STOP_2", () => {
  it("random word triggers STOP_2 on first input", async () => {
    let { session } = await startSession();
    const result = await processState(session, "automobil");
    expect(result.session.state).toBe("STOP_2");
    expect(result.session.stopReason).toBe("nonsense_input");
  });

  it("nonsense after unclear_input still triggers STOP_2", async () => {
    let { session } = await startSession();
    let result = await processState(session, "99");
    session = result.session;
    expect(session.state).toBe("INPUT_CAPTURE");
    result = await processState(session, "zmrzlina");
    expect(result.session.state).toBe("STOP_2");
  });
});

describe("RED TEAM AC-P4 – unclear_input flood safety", () => {
  it("100 consecutive unclear_inputs cause no STOP and no counter increment", async () => {
    let { session } = await startSession();
    for (let i = 1; i <= 100; i++) {
      const result = await processState(session, String(i));
      session = result.session;
      expect(session.state).toBe("INPUT_CAPTURE");
      expect(session.confusionCount).toBe(0);
      expect(session.errorCount).toBe(0);
      expect(session.stopReason).toBeNull();
    }
  });
});

describe("RED TEAM AC-S1 – Terminal state isolation", () => {
  it("cannot transition from END to any state", async () => {
    let { session } = await startSession();
    let result = await processState(session, "banán");
    session = result.session;
    result = await processState(session);
    session = result.session;
    expect(session.state).toBe("END");

    expect(() => transition(session, "INIT")).toThrow();
    expect(() => transition(session, "INPUT_CAPTURE")).toThrow();
    expect(() => transition(session, "EXPLAIN")).toThrow();
  });

  it("STOP_2 can ONLY go to END", async () => {
    let { session } = await startSession();
    const result = await processState(session, "banán");
    session = result.session;
    expect(session.state).toBe("STOP_2");

    expect(() => transition(session, "EXPLAIN")).toThrow();
    expect(() => transition(session, "INPUT_CAPTURE")).toThrow();
  });

  it("processState on END always returns END", async () => {
    let { session } = await startSession();
    let result = await processState(session, "banán");
    result = await processState(result.session);

    for (const input of ["nevím", "porovnávání", "42", "banán", ""]) {
      result = await processState(result.session, input);
      expect(result.session.state).toBe("END");
    }
  });
});

describe("RED TEAM AC-S2 – Boundary violation attacks", () => {
  it("number > 100 in PRACTICE triggers STOP_2", async () => {
    let { session } = await reachPractice();
    expect(session.state).toBe("PRACTICE");

    const result = await processState(session, "150");
    expect(result.session.state).toBe("STOP_2");
    expect(result.session.stopReason).toBe("boundary_violation");
  });

  it("forbidden keyword 'sčítání' in PRACTICE triggers STOP_2", async () => {
    let { session } = await reachPractice();
    const result = await processState(session, "sčítání 5 a 3");
    expect(result.session.state).toBe("STOP_2");
    expect(result.session.stopReason).toBe("boundary_violation");
  });

  it("negative number representation triggers boundary violation", () => {
    const topic = matchTopic("které číslo je větší", 3)!;
    expect(checkBoundaryViolation("záporné číslo", topic)).toBe(true);
  });

  it("number 0 is within range (edge case)", () => {
    const topic = matchTopic("které číslo je větší", 3)!;
    expect(checkBoundaryViolation("0", topic)).toBe(false);
  });

  it("boundary violation in CHECK also triggers STOP_2", async () => {
    let { session } = await reachPractice();
    let result = await processState(session, "38");
    session = result.session;
    if (session.state === "EXPLAIN") {
      result = await processState(session);
      session = result.session;
    }
    if (session.state === "PRACTICE") {
      result = await processState(session, "999");
      session = result.session;
      expect(session.state).toBe("STOP_2");
      expect(session.stopReason).toBe("boundary_violation");
    }
  });
});

describe("RED TEAM AC-S3 – Error threshold enforcement (batch completion)", () => {
  it("errors do not trigger early stop — only time expiry does", () => {
    const session = createSession(3);
    session.state = "CHECK";
    session.matchedTopic = matchTopic("které číslo je větší", 3);

    expect(evaluateStop(session)).toBeNull();

    session.errorCount = 2;
    expect(evaluateStop(session)).toBeNull();

    session.errorCount = 3;
    expect(evaluateStop(session)).toBeNull();

    // Only time expiry triggers STOP_2
    session.elapsedSeconds = session.rules.maxDurationSeconds + 1;
    expect(evaluateStop(session)).toBe("STOP_2");
  });
});

describe("RED TEAM AC-S4 – Time limit in every state", () => {
  it("time expiry during PRACTICE triggers STOP_2", async () => {
    let { session } = await reachPractice();
    session.startTime = Date.now() - 999999 * 1000;

    const result = await processState(session);
    expect(["STOP_2", "END"]).toContain(result.session.state);
  });

  it("evaluateStop returns STOP_2 when time expired regardless of errorCount", () => {
    const session = createSession(3);
    session.elapsedSeconds = session.rules.maxDurationSeconds + 1;
    session.errorCount = 0;
    expect(evaluateStop(session)).toBe("STOP_2");
  });
});

describe("RED TEAM AC-G1 – Modality completeness", () => {
  it("every valid grade produces a defined modality", () => {
    for (const g of [3, 4, 5, 6, 7, 8, 9] as Grade[]) {
      const rules = getRulesForGrade(g);
      expect(["voice", "text", "mixed"]).toContain(rules.modality);
    }
  });

  it("modality propagates from rules to audit log", async () => {
    const logBefore = getAuditLog().length;
    const s = createSession(3);
    await processState(s);
    const logAfter = getAuditLog();
    const newEntries = logAfter.slice(logBefore);
    expect(newEntries.length).toBeGreaterThan(0);
    expect(newEntries[0].modality).toBe("voice");
  });
});

describe("RED TEAM AC-D1 – Infinite loop prevention", () => {
  it("errors do not create unbounded cycle — batch completes normally", () => {
    const session = createSession(3);
    session.state = "CHECK";
    session.matchedTopic = matchTopic("které číslo je větší", 3);
    session.errorCount = 2;
    expect(evaluateStop(session)).toBeNull(); // No early stop
    session.errorCount = 6;
    expect(evaluateStop(session)).toBeNull(); // Still no stop — batch must complete
  });

  it("full flow terminates within bounded iterations", async () => {
    let { session } = await startSession();
    let iterations = 0;
    const MAX = 50;

    let result = await processState(session, "které číslo je větší");
    session = result.session;

    while (session.state !== "END" && iterations < MAX) {
      iterations++;
      if (session.state === "PRACTICE") {
        result = await processState(session, "špatná odpověď 38");
      } else if (session.state === "STOP_2") {
        result = await processState(session);
      } else {
        result = await processState(session);
      }
      session = result.session;
    }

    expect(iterations).toBeLessThan(MAX);
    expect(session.state).toBe("END");
  });
});

describe("RED TEAM AC-A1 – Audit log content isolation", () => {
  it("audit log entries contain ONLY allowed fields", async () => {
    const logBefore = getAuditLog().length;
    let { session } = await startSession();
    await processState(session, "které číslo je větší");

    const newEntries = getAuditLog().slice(logBefore);
    const allowedKeys = new Set(["timestamp", "sessionId", "topicId", "sessionState", "stopReason", "durationSeconds", "modality", "boundaryViolation"]);

    for (const entry of newEntries) {
      for (const key of Object.keys(entry)) {
        expect(allowedKeys.has(key)).toBe(true);
      }
    }
  });

  it("no audit entry contains child input text", async () => {
    const logBefore = getAuditLog().length;
    let { session } = await startSession();
    await processState(session, "které číslo je větší");

    const serialized = JSON.stringify(getAuditLog().slice(logBefore));
    expect(serialized).not.toContain("které číslo je větší");
    expect(serialized).not.toContain("childInput");
  });
});
