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
  // In production, send to backend. For now, console only.
  console.log("[AUDIT]", entry);
}

export function getAuditLog(): readonly AuditLogEntry[] {
  return Object.freeze([...auditLog]);
}
