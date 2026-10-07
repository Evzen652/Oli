import type { AuditLogEntry, SessionData } from "./types";

/**
 * AUDIT LOGGER
 * 
 * Logs ONLY: topic_id, session_state, STOP_reason, duration, modality.
 * MUST NOT log conversation content.
 */

const auditLog: AuditLogEntry[] = [];

export function logSession(session: SessionData): void {
  const entry: AuditLogEntry = {
    timestamp: Date.now(),
    sessionId: session.id,
    topicId: session.matchedTopic?.id ?? null,
    sessionState: session.state,
    stopReason: session.stopReason,
    durationSeconds: session.elapsedSeconds,
    modality: session.rules.modality,
    boundaryViolation: session.stopReason === "boundary_violation",
  };
  auditLog.push(entry);
  // Do konzole jen při vývoji. Dřív se logoval každý přechod sezení všude:
  // v produkci do konzole prohlížeče dítěte a v testech ~19 MB výpisu
  // (celá sada vypsala 19 MB, teď ~0,2 MB). Na chybu vitestu „Timeout
  // calling onTaskUpdate“ to vliv nemělo — ověřeno, objevila se i potom.
  // Záznam pro `getAuditLog()` zůstává beze změny.
  if (import.meta.env.DEV && import.meta.env.MODE !== "test") {
    console.log("[AUDIT]", entry);
  }
}

export function getAuditLog(): readonly AuditLogEntry[] {
  return Object.freeze([...auditLog]);
}
