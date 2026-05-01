import { describe, it, expect, vi, beforeEach } from "vitest";
import { logSession, getAuditLog } from "@/lib/logger";
import { generateMockExplain, generateMockBatch } from "@/lib/aiExecution";
import { createSession } from "@/lib/sessionOrchestrator";
import type { SessionData, TopicMetadata, AIRequest } from "@/lib/types";

/**
 * Logger + AI execution mock paths.
 *
 * Logger:
 *  - logSession zapíše do auditLog
 *  - getAuditLog vrací frozen kopii (immutable)
 *  - Audit log neobsahuje conversation content (pouze metadata)
 *
 * AI execution mocks (deterministic fallback bez network):
 *  - generateMockExplain: per-type response (explain/practice/check)
 *  - generateMockBatch: deleguje na topic.generator
 *  - sessionTaskCount cap (default 6)
 *  - levelOverride respektován
 */

// Suppress console.log spam from logger
beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

const mkTopic = (overrides: Partial<TopicMetadata> = {}): TopicMetadata => ({
  id: "test-topic",
  title: "Test Topic",
  subject: "matematika",
  category: "C",
  topic: "T",
  briefDescription: "d",
  keywords: ["k"],
  goals: ["První goal", "Druhý goal"],
  boundaries: ["b"],
  gradeRange: [3, 3],
  inputType: "number",
  generator: (level: number) =>
    Array.from({ length: 10 }, (_, i) => ({
      question: `Q${i} L${level}`,
      correctAnswer: String(i),
    })),
  helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
  ...overrides,
});

const mkSession = (overrides: Partial<SessionData> = {}): SessionData => ({
  ...createSession(3),
  ...overrides,
});

// ─────────────────────────────────────────────────────────
// LOGGER
// ─────────────────────────────────────────────────────────

describe("logSession — audit entry struktura", () => {
  it("zapíše entry s timestamp + sessionId + state", () => {
    const before = getAuditLog().length;
    const s = mkSession();
    logSession(s);
    const after = getAuditLog();
    expect(after.length).toBe(before + 1);
    const last = after[after.length - 1];
    expect(last.sessionId).toBe(s.id);
    expect(last.sessionState).toBe(s.state);
    expect(typeof last.timestamp).toBe("number");
    expect(last.timestamp).toBeGreaterThan(0);
  });

  it("topic ID tracked when matchedTopic existuje", () => {
    const topic = mkTopic({ id: "math-x" });
    const s = mkSession({ matchedTopic: topic });
    logSession(s);
    const last = getAuditLog().slice(-1)[0];
    expect(last.topicId).toBe("math-x");
  });

  it("topicId je null pokud no matchedTopic", () => {
    logSession(mkSession({ matchedTopic: null }));
    const last = getAuditLog().slice(-1)[0];
    expect(last.topicId).toBeNull();
  });

  it("boundaryViolation flag = true pokud stopReason === 'boundary_violation'", () => {
    logSession(mkSession({ stopReason: "boundary_violation" }));
    const last = getAuditLog().slice(-1)[0];
    expect(last.boundaryViolation).toBe(true);
  });

  it("boundaryViolation false pro jiné stopReasons", () => {
    logSession(mkSession({ stopReason: "time_expired" }));
    const last = getAuditLog().slice(-1)[0];
    expect(last.boundaryViolation).toBe(false);
  });

  it("entry NEOBSAHUJE childInput / práva (privacy)", () => {
    const s = mkSession({ childInput: "tohle by se nemělo logovat" });
    logSession(s);
    const last = getAuditLog().slice(-1)[0];
    // AuditLogEntry nemá childInput field
    expect(JSON.stringify(last)).not.toContain("tohle by se nemělo");
    expect(last).not.toHaveProperty("childInput");
    expect(last).not.toHaveProperty("practiceBatch");
  });

  it("modality propaguje z session.rules", () => {
    const s = mkSession();
    logSession(s);
    const last = getAuditLog().slice(-1)[0];
    expect(["voice", "text", "mixed"]).toContain(last.modality);
  });

  it("durationSeconds propaguje z session.elapsedSeconds", () => {
    logSession(mkSession({ elapsedSeconds: 123 }));
    const last = getAuditLog().slice(-1)[0];
    expect(last.durationSeconds).toBe(123);
  });
});

describe("getAuditLog — immutability", () => {
  it("vrací frozen array (push throws)", () => {
    const log = getAuditLog();
    expect(Object.isFrozen(log)).toBe(true);
    expect(() => {
      // @ts-expect-error testing immutability
      log.push({});
    }).toThrow();
  });

  it("multiple volání vrací consistent snapshot", () => {
    const before = getAuditLog().length;
    const a = getAuditLog();
    const b = getAuditLog();
    expect(a.length).toBe(b.length);
    expect(a.length).toBe(before);
  });
});

// ─────────────────────────────────────────────────────────
// generateMockExplain
// ─────────────────────────────────────────────────────────

describe("generateMockExplain — per-type responses", () => {
  const baseRequest: AIRequest = {
    type: "explain",
    topic: mkTopic(),
    grade: 3,
    childInput: "test",
    previousErrors: 0,
  };

  it("type=explain → content obsahuje topic title", () => {
    const r = generateMockExplain(baseRequest);
    expect(r.content).toContain("Test Topic");
  });

  it("type=explain s previousErrors >= 2 → simplified version", () => {
    const r = generateMockExplain({ ...baseRequest, previousErrors: 2 });
    expect(r.content).toMatch(/jednodušeji|zjednodušen/i);
  });

  it("grade <= 5 → simple language", () => {
    const r = generateMockExplain({ ...baseRequest, grade: 5 });
    expect(r.content).toMatch(/Podívejme se|Zkusíme/);
  });

  it("grade > 5 → detailed language with all goals", () => {
    const r = generateMockExplain({ ...baseRequest, grade: 9 });
    // High grade → joins goals with ". "
    expect(r.content).toContain("První goal");
    expect(r.content).toContain("Druhý goal");
  });

  it("type=practice → practiceQuestion populated", () => {
    const r = generateMockExplain({ ...baseRequest, type: "practice" });
    expect(r.practiceQuestion).toBeTruthy();
    expect(r.content).toContain("Zkus");
  });

  it("type=check → isCorrect populated", () => {
    const r = generateMockExplain({ ...baseRequest, type: "check" });
    expect(typeof r.isCorrect).toBe("boolean");
  });

  it("default fallback content pro unknown type", () => {
    // Cast pro test edge case
    const r = generateMockExplain({ ...baseRequest, type: "unknown" as unknown as AIRequest["type"] });
    expect(r.content).toContain("Neznámý");
  });
});

// ─────────────────────────────────────────────────────────
// generateMockBatch
// ─────────────────────────────────────────────────────────

describe("generateMockBatch — task generation + cap", () => {
  const baseRequest: AIRequest = {
    type: "practice",
    topic: mkTopic(),
    grade: 3,
    childInput: "",
    previousErrors: 0,
  };

  it("vrací array tasků z topic.generator", () => {
    const tasks = generateMockBatch(baseRequest);
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("default cap = 6 (sessionTaskCount default)", () => {
    // Generator vrací 10, default cap je 6
    const tasks = generateMockBatch(baseRequest);
    expect(tasks.length).toBe(6);
  });

  it("topic.sessionTaskCount override", () => {
    const topic = mkTopic({ sessionTaskCount: 3 });
    const tasks = generateMockBatch({ ...baseRequest, topic });
    expect(tasks.length).toBe(3);
  });

  it("topic.sessionTaskCount=1 (essay) → jen 1 task", () => {
    const topic = mkTopic({ sessionTaskCount: 1, inputType: "essay" });
    const tasks = generateMockBatch({ ...baseRequest, topic });
    expect(tasks.length).toBe(1);
  });

  it("levelOverride předán do topic.generator", () => {
    const topic = mkTopic();
    const tasksL1 = generateMockBatch({ ...baseRequest, topic }, 1);
    const tasksL3 = generateMockBatch({ ...baseRequest, topic }, 3);
    // Generator obsahuje level v question textu — verify různé pro L1 vs L3
    expect(tasksL1[0].question).toContain("L1");
    expect(tasksL3[0].question).toContain("L3");
  });

  it("bez levelOverride: default = topic.defaultLevel || 2", () => {
    const topic = mkTopic({ defaultLevel: 3 });
    const tasks = generateMockBatch({ ...baseRequest, topic });
    expect(tasks[0].question).toContain("L3");
  });

  it("topic bez defaultLevel → level=2", () => {
    const topic = mkTopic();
    delete (topic as Partial<TopicMetadata>).defaultLevel;
    const tasks = generateMockBatch({ ...baseRequest, topic });
    expect(tasks[0].question).toContain("L2");
  });
});
