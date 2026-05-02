import { describe, it, expect, beforeEach } from "vitest";
import { persistSession, clearPersistedSession, getPersistedSession } from "@/hooks/useSessionPersistence";
import { createSession } from "@/lib/sessionOrchestrator";
import type { SessionData } from "@/lib/types";

/**
 * Session persistence — localStorage backup pro recovery po refresh.
 *
 * Klíčový pro UX: dítě omylem refresh page → vrátí se zpět tam, kde bylo.
 * Pravidla:
 *  - Persist na každou meaningful change
 *  - Discard po 2 hodinách (stale)
 *  - Discard pokud session je v terminal state (END / STOP_2)
 *  - Tichý fail při quota exceeded / private mode
 */

beforeEach(() => {
  localStorage.clear();
});

describe("persistSession", () => {
  it("uloží session + taskResults + savedAt timestamp", () => {
    const s = createSession(3);
    persistSession(s, ["correct", "wrong"]);

    const raw = localStorage.getItem("sovicka_session_backup");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.session.id).toBe(s.id);
    expect(parsed.taskResults).toEqual(["correct", "wrong"]);
    expect(typeof parsed.savedAt).toBe("number");
  });

  it("přepíše předchozí persist", () => {
    const s1 = createSession(3);
    persistSession(s1, []);
    const s2 = createSession(5);
    persistSession(s2, ["correct"]);

    const persisted = getPersistedSession();
    expect(persisted?.session.id).toBe(s2.id);
    expect(persisted?.taskResults).toEqual(["correct"]);
  });

  it("tichý fail při setItem error (private mode)", () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error("QuotaExceeded"); };
    expect(() => persistSession(createSession(3), [])).not.toThrow();
    Storage.prototype.setItem = orig;
  });
});

describe("clearPersistedSession", () => {
  it("odstraní persist", () => {
    persistSession(createSession(3), []);
    expect(localStorage.getItem("sovicka_session_backup")).toBeTruthy();
    clearPersistedSession();
    expect(localStorage.getItem("sovicka_session_backup")).toBeNull();
  });

  it("clear bez persistu → no-op", () => {
    expect(() => clearPersistedSession()).not.toThrow();
  });
});

describe("getPersistedSession — recovery rules", () => {
  it("vrátí persisted session s validními daty", () => {
    const s = createSession(3);
    persistSession(s, ["correct"]);
    const restored = getPersistedSession();
    expect(restored).not.toBeNull();
    expect(restored?.session.id).toBe(s.id);
  });

  it("vrátí null pokud není nic persistované", () => {
    expect(getPersistedSession()).toBeNull();
  });

  it("vrátí null + clear pokud session > 2 hodiny stará", () => {
    const s = createSession(3);
    const oldData = {
      session: s,
      taskResults: [],
      savedAt: Date.now() - 3 * 60 * 60 * 1000, // 3 hodiny zpět
    };
    localStorage.setItem("sovicka_session_backup", JSON.stringify(oldData));
    expect(getPersistedSession()).toBeNull();
    expect(localStorage.getItem("sovicka_session_backup")).toBeNull(); // clear
  });

  it("session přesně 2 hodiny stará → vrátí (boundary inclusive)", () => {
    const s = createSession(3);
    const data = {
      session: s,
      taskResults: [],
      savedAt: Date.now() - (2 * 60 * 60 * 1000 - 1000), // těsně pod 2h
    };
    localStorage.setItem("sovicka_session_backup", JSON.stringify(data));
    expect(getPersistedSession()).not.toBeNull();
  });

  it("vrátí null + clear pokud session je v END state", () => {
    const s = { ...createSession(3), state: "END" as const };
    persistSession(s, []);
    expect(getPersistedSession()).toBeNull();
    expect(localStorage.getItem("sovicka_session_backup")).toBeNull();
  });

  it("vrátí null + clear pokud session je v STOP_2 state", () => {
    const s = { ...createSession(3), state: "STOP_2" as const };
    persistSession(s, []);
    expect(getPersistedSession()).toBeNull();
  });

  it("vrátí null + clear pokud localStorage obsahuje nevalidní JSON", () => {
    localStorage.setItem("sovicka_session_backup", "{not json}");
    expect(getPersistedSession()).toBeNull();
    expect(localStorage.getItem("sovicka_session_backup")).toBeNull();
  });

  it("vrátí null + clear pro prázdný string", () => {
    localStorage.setItem("sovicka_session_backup", "");
    expect(getPersistedSession()).toBeNull();
  });
});

describe("Session persistence — round-trip celé session", () => {
  it("session se zachováním všech polí (id, state, grade, batch, errors)", () => {
    const original: SessionData = {
      ...createSession(5),
      state: "PRACTICE",
      childInput: "test input",
      errorCount: 2,
      currentTaskIndex: 3,
      practiceBatch: [
        { question: "Q1", correctAnswer: "A1" },
        { question: "Q2", correctAnswer: "A2" },
      ],
      usedQuestions: ["Q1"],
      currentLevel: 2,
    };
    persistSession(original, ["correct", "wrong", "correct"]);
    const restored = getPersistedSession();
    expect(restored?.session).toEqual(original);
    expect(restored?.taskResults).toEqual(["correct", "wrong", "correct"]);
  });
});
