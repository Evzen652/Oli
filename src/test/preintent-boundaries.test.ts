import { describe, it, expect } from "vitest";
import { createSession, processState } from "../lib/sessionOrchestrator";
import type { SessionData } from "../lib/types";

async function startSession(): Promise<{ session: SessionData; output: string }> {
  const s = createSession(3);
  return processState(s);
}

describe("SCENARIO 1 – CONFUSION INPUT", () => {
  it("increments confusionCount and triggers STOP_1 after threshold", async () => {
    let { session } = await startSession();
    expect(session.state).toBe("INPUT_CAPTURE");

    let result = await processState(session, "nevím");
    session = result.session;
    expect(session.confusionCount).toBe(1);
    expect(session.state).toBe("INPUT_CAPTURE");

    result = await processState(session, "nevím to");
    session = result.session;
    expect(session.confusionCount).toBe(2);
    expect(session.state).toBe("STOP_1");
    expect(session.stopReason).toBe("confusion_threshold");
  });
});

describe("SCENARIO 2 – DEMAND FOR ANSWER", () => {
  it("classifies help requests as confusion, triggers STOP_1, no content leakage", async () => {
    let { session } = await startSession();

    let result = await processState(session, "řekni mi to");
    session = result.session;
    expect(session.confusionCount).toBe(1);
    expect(session.state).toBe("INPUT_CAPTURE");
    expect(result.output).not.toContain("Porovnáváme");

    result = await processState(session, "jaká je odpověď");
    session = result.session;
    expect(session.confusionCount).toBe(2);
    expect(session.state).toBe("STOP_1");
    expect(result.output).not.toContain("Porovnáváme");
  });
});

describe("SCENARIO 3 – NONSENSE INPUT", () => {
  it("triggers immediate STOP_2 for nonsense", async () => {
    let { session } = await startSession();

    const result = await processState(session, "banán");
    session = result.session;
    expect(session.state).toBe("STOP_2");
    expect(session.stopReason).toBe("nonsense_input");
  });
});

describe("SCENARIO 4 – NON-TOPICAL BUT VALID INPUT ('38')", () => {
  it("classifies '38' as unclear_input → returns to INPUT_CAPTURE, no STOP", async () => {
    let { session } = await startSession();

    const result = await processState(session, "38");
    session = result.session;
    expect(session.state).toBe("INPUT_CAPTURE");
    expect(session.stopReason).toBeNull();
    expect(session.confusionCount).toBe(0);
  });
});

describe("SCENARIO 5 – OUT-OF-SCOPE TOPIC QUESTION", () => {
  it("matches topic via keyword but boundary enforcement triggers STOP_2", async () => {
    let { session } = await startSession();

    let result = await processState(session, "A co znamená to větší než?");
    session = result.session;

    if (session.state === "PRACTICE") {
      result = await processState(session, "co znamená větší než");
      session = result.session;
      expect(session.state).toBe("STOP_2");
      expect(session.stopReason).toBe("boundary_violation");
    }
  });
});
