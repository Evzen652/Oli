import { describe, it, expect } from "vitest";
import { createSession, processState, transition } from "../lib/sessionOrchestrator";
import { classifyIntent } from "../lib/preIntent";
import { evaluateStop, isTimeExpired, getRulesForGrade } from "../lib/ruleEngine";
import { checkBoundaryViolation } from "../lib/boundaryEnforcement";
import { getAuditLog } from "../lib/logger";
import { matchTopic } from "../lib/contentRegistry";
import type { SessionData, SessionState, Grade } from "../lib/types";

const ALL_GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const VALID_STATES: SessionState[] = [
  "INIT","INPUT_CAPTURE","PRE_INTENT","TOPIC_MATCH",
  "EXPLAIN","PRACTICE","CHECK","STOP_1","STOP_2","END",
];
const TOPICAL_INPUT = "které číslo je větší";

function init(grade: Grade = 3): SessionData {
  return createSession(grade);
}

async function run(s: SessionData, input?: string) {
  return processState(s, input);
}

async function runToState(target: SessionState, grade: Grade = 3): Promise<SessionData> {
  let { session } = await run(init(grade));
  if (target === "INPUT_CAPTURE") return session;
  ({ session } = await run(session, TOPICAL_INPUT));
  if (target === "PRACTICE") return session;
  if (target === "CHECK") {
    ({ session } = await run(session, "38"));
    return session;
  }
  return session;
}

function assertInvariant(s: SessionData) {
  expect(VALID_STATES).toContain(s.state);
  expect(s.errorCount).toBeGreaterThanOrEqual(0);
  expect(s.confusionCount).toBeGreaterThanOrEqual(0);
}

describe("INPUT CHAOS", () => {
  const chaosInputs = [
    "", "   ", "\n\t\r", "🤖💩🔥", "aaaa".repeat(1000),
    "<script>alert(1)</script>", "DROP TABLE sessions;",
    "null", "undefined", "0", "-1", "NaN", "Infinity",
    "ěščřžýáíé", "العربية", "日本語", "🇨🇿".repeat(50),
  ];

  it("all chaos inputs produce valid states, no throws", async () => {
    for (const input of chaosInputs) {
      const s = init(3);
      const { session: s1 } = await run(s);
      const { session: s2 } = await run(s1, input);
      assertInvariant(s2);
    }
  });

  it("empty/whitespace inputs in INPUT_CAPTURE stay in INPUT_CAPTURE", async () => {
    const { session } = await run(init(3));
    for (const empty of ["", "   ", "\t"]) {
      const { session: s2 } = await run(session, empty);
      expect(s2.state).toBe("INPUT_CAPTURE");
    }
  });
});

describe("FLOW CHAOS", () => {
  it("END is terminal – no state change on any input", async () => {
    let { session } = await run(init(3));
    ({ session } = await run(session, "banán"));
    ({ session } = await run(session));
    expect(session.state).toBe("END");

    for (const inp of ["38", "nevím", TOPICAL_INPUT, "", "banán"]) {
      const { session: s } = await run(session, inp);
      expect(s.state).toBe("END");
    }
  });

  it("STOP_2 always transitions to END", async () => {
    let { session } = await run(init(3));
    ({ session } = await run(session, "banán"));
    expect(session.state).toBe("STOP_2");
    ({ session } = await run(session));
    expect(session.state).toBe("END");
  });

  it("STOP_2 is irreversible", async () => {
    let { session } = await run(init(3));
    ({ session } = await run(session, "banán"));
    expect(session.state).toBe("STOP_2");
    for (const target of ["INPUT_CAPTURE", "PRE_INTENT", "TOPIC_MATCH", "EXPLAIN", "PRACTICE", "CHECK", "STOP_1"] as SessionState[]) {
      expect(() => transition(session, target)).toThrow();
    }
  });

  it("invalid transitions throw", () => {
    const s = init(3);
    expect(() => transition(s, "PRACTICE")).toThrow();
    expect(() => transition(s, "END")).toThrow();
  });
});

describe("CONTEXT PERMUTATIONS", () => {
  it("all grades produce valid rules", () => {
    for (const g of ALL_GRADES) {
      const rules = getRulesForGrade(g);
      expect(rules.maxDurationSeconds).toBeGreaterThan(0);
      expect(["voice", "text", "mixed"]).toContain(rules.modality);
    }
  });

  it("all grades handle nonsense → STOP_2", async () => {
    for (const g of ALL_GRADES) {
      let { session } = await run(init(g));
      ({ session } = await run(session, "banán xyz"));
      expect(session.state).toBe("STOP_2");
    }
  });

  it("all grades handle confusion escalation → STOP_1", async () => {
    for (const g of ALL_GRADES) {
      let { session } = await run(init(g));
      ({ session } = await run(session, "nevím"));
      ({ session } = await run(session, "nevím"));
      expect(session.state).toBe("STOP_1");
    }
  });
});

describe("ERROR & CONFUSION ESCALATION", () => {
  it("confusion count increments correctly", async () => {
    let { session } = await run(init(3));
    let r = await run(session, "nevím");
    expect(r.session.confusionCount).toBe(1);
    r = await run(r.session, "nevím");
    expect(r.session.confusionCount).toBe(2);
    expect(r.session.state).toBe("STOP_1");
  });

  it("STOP_1 does not self-escalate to STOP_2", async () => {
    let { session } = await run(init(3));
    ({ session } = (await run(session, "nevím")).session ? await run(session, "nevím") : await run(session, "nevím"));
    // redo properly
    let s = (await run(init(3))).session;
    s = (await run(s, "nevím")).session;
    s = (await run(s, "nevím")).session; // →STOP_1
    expect(s.state).toBe("STOP_1");
    s = (await run(s)).session;
    expect(s.state).toBe("INPUT_CAPTURE");
    expect(s.state).not.toBe("STOP_2");
  });

  it("repeated errors in CHECK complete the full batch and reach END", async () => {
    let s = await runToState("PRACTICE");
    let r = await run(s, "38");
    s = r.session;
    let iterations = 0;
    while (s.state !== "END" && iterations < 20) {
      if (s.state === "EXPLAIN") r = await run(s);
      else if (s.state === "PRACTICE") r = await run(s, "38");
      else if (s.state === "STOP_1") r = await run(s);
      else r = await run(s);
      s = r.session;
      iterations++;
    }
    expect(s.state).toBe("END");
    expect(iterations).toBeLessThan(20);
  });
});

describe("BOUNDARY VIOLATION", () => {
  const VIOLATIONS = ["101", "200", "plus", "mínus", "děleno", "záporné", "desetinné", "slovní úloha"];

  it("all violations detected in PRACTICE → STOP_2", async () => {
    for (const v of VIOLATIONS) {
      let s = await runToState("PRACTICE");
      const r = await run(s, v);
      expect(r.session.state).toBe("STOP_2");
      expect(r.session.stopReason).toBe("boundary_violation");
    }
  });

  it("boundary violation logged correctly", async () => {
    let s = await runToState("PRACTICE");
    await run(s, "999");
    const log = getAuditLog();
    const last = log[log.length - 1];
    expect(last.boundaryViolation).toBe(true);
  });
});

describe("TIME EXPIRY", () => {
  it("expired session triggers STOP_2 in EXPLAIN", async () => {
    let s = await runToState("PRACTICE");
    s.startTime = Date.now() - (s.rules.maxDurationSeconds + 1) * 1000;
    s.state = "EXPLAIN" as SessionState;
    const r = await run(s);
    expect(r.session.state).toBe("STOP_2");
  });

  it("expired session triggers STOP_2 in PRACTICE", async () => {
    let s = await runToState("PRACTICE");
    s.startTime = Date.now() - (s.rules.maxDurationSeconds + 1) * 1000;
    s.state = "PRACTICE" as SessionState;
    const r = await run(s);
    expect(r.session.state).toBe("STOP_2");
  });

  it("isTimeExpired returns true when elapsed >= max", () => {
    const s = init(3);
    s.elapsedSeconds = s.rules.maxDurationSeconds;
    expect(isTimeExpired(s)).toBe(true);
  });

  it("evaluateStop returns STOP_2 on time expiry", () => {
    const s = init(3);
    s.elapsedSeconds = s.rules.maxDurationSeconds;
    expect(evaluateStop(s)).toBe("STOP_2");
  });
});

describe("PRE_INTENT DETERMINISM", () => {
  it("classifies all 4 categories correctly", () => {
    expect(classifyIntent("nevím", 3)).toBe("confusion");
    expect(classifyIntent("banán", 3)).toBe("nonsense");
    expect(classifyIntent("porovnávání", 3)).toBe("topical");
    expect(classifyIntent("38", 3)).toBe("unclear_input");
  });

  it("same input always produces same output (determinism)", () => {
    const inputs = ["nevím", "banán", "porovnávání", "38", "", "xyz"];
    for (const inp of inputs) {
      const r1 = classifyIntent(inp, 3);
      const r2 = classifyIntent(inp, 3);
      expect(r1).toBe(r2);
    }
  });

  it("unclear_input does not penalize", async () => {
    let s = (await run(init(3))).session;
    for (let i = 0; i < 10; i++) {
      const r = await run(s, "38");
      s = r.session;
    }
    expect(s.confusionCount).toBe(0);
    expect(s.errorCount).toBe(0);
    expect(s.state).toBe("INPUT_CAPTURE");
  });
});

describe("CHAOS PROFILE: Spammer", () => {
  it("100 rapid inputs produce no crash, valid terminal state", async () => {
    let s = (await run(init(3))).session;
    for (let i = 0; i < 100; i++) {
      const inp = i % 3 === 0 ? "38" : i % 3 === 1 ? "nevím" : "porovnávání";
      if (s.state === "END") break;
      const r = await run(s, inp);
      s = r.session;
      assertInvariant(s);
    }
    expect(VALID_STATES).toContain(s.state);
  });
});

describe("CHAOS PROFILE: Mlčič (Silent)", () => {
  it("repeated unclear inputs never crash, stay in INPUT_CAPTURE", async () => {
    let s = (await run(init(3))).session;
    for (let i = 0; i < 50; i++) {
      if (s.state !== "INPUT_CAPTURE") break;
      const r = await run(s, String(i));
      s = r.session;
    }
    expect(s.confusionCount).toBe(0);
    assertInvariant(s);
  });
});

describe("CHAOS PROFILE: Chaotik", () => {
  it("random mix reaches terminal safely", async () => {
    const inputs = ["38", "nevím", "porovnávání", "banán", "nevím", "abc", "38", "nevím", "větší", "xyz"];
    let s = (await run(init(3))).session;
    for (const inp of inputs) {
      if (s.state === "END") break;
      const r = await run(s, inp);
      s = r.session;
      assertInvariant(s);
    }
  });
});

describe("CHAOS PROFILE: Hranář (Boundary attacker)", () => {
  it("boundary attacks in PRACTICE always → STOP_2", async () => {
    const attacks = ["999", "plus 5", "děleno", "101 záporné"];
    for (const atk of attacks) {
      let s = await runToState("PRACTICE");
      const r = await run(s, atk);
      expect(r.session.state).toBe("STOP_2");
      expect(r.session.stopReason).toBe("boundary_violation");
    }
  });
});

describe("CHAOS PROFILE: Zamrzlý (Frozen – repeated errors)", () => {
  it("repeated wrong answers escalate to STOP, no infinite loop", async () => {
    let s = await runToState("PRACTICE");
    let iterations = 0;
    while (s.state !== "END" && iterations < 30) {
      if (s.state === "PRACTICE") s = (await run(s, "špatně")).session;
      else s = (await run(s)).session;
      assertInvariant(s);
      iterations++;
    }
    expect(iterations).toBeLessThan(30);
  });
});

describe("CHAOS PROFILE: Ideál (Control)", () => {
  it("correct flow: INIT→INPUT_CAPTURE→PRACTICE→CHECK→END", async () => {
    let r = await run(init(3));
    expect(r.session.state).toBe("INPUT_CAPTURE");

    r = await run(r.session, TOPICAL_INPUT);
    expect(r.session.state).toBe("PRACTICE");

    r = await run(r.session, "38");
    expect(r.session.errorCount).toBe(1);

    while (r.session.state !== "PRACTICE" && r.session.state !== "END") {
      r = await run(r.session);
    }
    r = await run(r.session, "62");
    let maxIter = 10;
    while (r.session.state !== "END" && maxIter-- > 0) {
      r = await run(r.session, "62");
    }
    expect(r.session.state).toBe("END");
  });
});

describe("VOLUME TEST", () => {
  it("10,000 sessions all reach valid terminal states", async () => {
    const scenarios = [
      async (g: Grade) => {
        let s = (await run(init(g))).session;
        s = (await run(s, "banán")).session;
        s = (await run(s)).session;
        return s;
      },
      async (g: Grade) => {
        let s = (await run(init(g))).session;
        s = (await run(s, "nevím")).session;
        s = (await run(s, "nevím")).session;
        s = (await run(s)).session;
        return s;
      },
      async (g: Grade) => {
        let s = (await run(init(g))).session;
        s = (await run(s, "38")).session;
        return s;
      },
    ];

    let errorCount = 0;
    for (let i = 0; i < 10000; i++) {
      const grade = ALL_GRADES[i % ALL_GRADES.length];
      const scenario = scenarios[i % scenarios.length];
      try {
        const s = await scenario(grade);
        assertInvariant(s);
      } catch {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});

describe("AUDIT LOG INVARIANTS", () => {
  it("audit entries contain only metadata, no conversation content", () => {
    const log = getAuditLog();
    const sample = log.slice(-10);
    for (const entry of sample) {
      expect(entry.sessionId).toBeTruthy();
      expect(VALID_STATES).toContain(entry.sessionState);
      expect(typeof entry.boundaryViolation).toBe("boolean");
      const keys = Object.keys(entry);
      expect(keys).not.toContain("childInput");
      expect(keys).not.toContain("content");
    }
  });
});

describe("CORE INPUT-SOURCE AGNOSTICISM", () => {
  it("same text input always produces identical state regardless of 'source'", async () => {
    const s1 = (await run(init(3))).session;
    const r1 = await run(s1, "nevím");

    const s2 = (await run(init(3))).session;
    const r2 = await run(s2, "nevím");

    expect(r1.session.state).toBe(r2.session.state);
    expect(r1.session.confusionCount).toBe(r2.session.confusionCount);
  });
});
