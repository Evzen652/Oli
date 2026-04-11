import { describe, it, expect } from "vitest";
import { createSession, processState } from "../lib/sessionOrchestrator";
import { getRulesForGrade } from "../lib/ruleEngine";
import { getAuditLog } from "../lib/logger";
import type { Grade } from "../lib/types";

describe("AC-G1 – MODALITY ENFORCEMENT", () => {
  it("grade 3 → voice modality in session rules", () => {
    const rules = getRulesForGrade(3);
    expect(rules.modality).toBe("voice");
  });

  it("grade 4 → mixed modality in session rules", () => {
    const rules = getRulesForGrade(4);
    expect(rules.modality).toBe("mixed");
  });

  it("grade 5+ → text modality in session rules", () => {
    for (const g of [5, 6, 7, 8, 9] as Grade[]) {
      const rules = getRulesForGrade(g);
      expect(rules.modality).toBe("text");
    }
  });

  it("modality is observable in audit log and matches grade rule", async () => {
    const s3 = createSession(3);
    const r3 = await processState(s3);

    const s5 = createSession(5);
    const r5 = await processState(s5);

    const s4 = createSession(4);
    const r4 = await processState(s4);

    const log = getAuditLog();

    const log3 = log.filter((e) => e.sessionId === r3.session.id);
    const log4 = log.filter((e) => e.sessionId === r4.session.id);
    const log5 = log.filter((e) => e.sessionId === r5.session.id);

    expect(log3.length).toBeGreaterThan(0);
    expect(log4.length).toBeGreaterThan(0);
    expect(log5.length).toBeGreaterThan(0);

    expect(log3[0].modality).toBe("voice");
    expect(log4[0].modality).toBe("mixed");
    expect(log5[0].modality).toBe("text");
  });

  it("modality difference is not cosmetic – distinct grades produce distinct session configs", () => {
    const s3 = createSession(3);
    const s9 = createSession(9);

    expect(s3.rules.modality).not.toBe(s9.rules.modality);
    expect(s3.rules.modality).toBe("voice");
    expect(s9.rules.modality).toBe("text");
    expect(s3.rules.maxDurationSeconds).not.toBe(s9.rules.maxDurationSeconds);
  });
});
