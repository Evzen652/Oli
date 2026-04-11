import { useEffect, useCallback, useRef } from "react";
import type { SessionData } from "@/lib/types";

const STORAGE_KEY = "sovicka_session_backup";

interface PersistedSession {
  session: SessionData;
  taskResults: ("correct" | "wrong" | "help")[];
  savedAt: number;
}

/** Save session to localStorage (call on every meaningful state change) */
export function persistSession(session: SessionData, taskResults: ("correct" | "wrong" | "help")[]) {
  try {
    const data: PersistedSession = { session, taskResults, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or private browsing — ignore silently
  }
}

/** Clear persisted session (call on END / STOP_2 / reset) */
export function clearPersistedSession() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Restore persisted session if it exists and is < 2 hours old */
export function getPersistedSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: PersistedSession = JSON.parse(raw);
    // Discard if older than 2 hours
    if (Date.now() - data.savedAt > 2 * 60 * 60 * 1000) {
      clearPersistedSession();
      return null;
    }
    // Discard terminal sessions
    if (data.session.state === "END" || data.session.state === "STOP_2") {
      clearPersistedSession();
      return null;
    }
    return data;
  } catch {
    clearPersistedSession();
    return null;
  }
}

/**
 * Hook that auto-persists session state on every change.
 * Returns whether a recovery is available and functions to accept/dismiss it.
 */
export function useSessionPersistence(
  session: SessionData | null,
  taskResults: ("correct" | "wrong" | "help")[],
) {
  // Persist on every session/taskResults change
  useEffect(() => {
    if (session && session.state !== "END" && session.state !== "STOP_2") {
      persistSession(session, taskResults);
    }
  }, [session, taskResults]);
}
