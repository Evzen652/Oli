import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  startTrial,
  getTrialState,
  getTrialDaysRemaining,
  getTrialCurrentDay,
  isTrialActive,
  isTrialExpired,
  clearTrial,
  restartTrial,
  TRIAL_DAYS,
} from "@/lib/anonTrial";

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe("startTrial — idempotence", () => {
  it("uloží stav při prvním volání", () => {
    startTrial(4);
    const state = getTrialState();
    expect(state).not.toBeNull();
    expect(state?.grade).toBe(4);
    expect(state?.startedAt).toBeTruthy();
  });

  it("nezresetuje při opakovaném volání", () => {
    startTrial(4);
    const first = getTrialState()?.startedAt;
    startTrial(4);
    const second = getTrialState()?.startedAt;
    expect(second).toBe(first);
  });

  it("aktualizuje grade pokud se změnil, ale zachová startedAt", () => {
    startTrial(4);
    const firstStarted = getTrialState()?.startedAt;
    startTrial(5);
    const state = getTrialState();
    expect(state?.grade).toBe(5);
    expect(state?.startedAt).toBe(firstStarted);
  });
});

describe("getTrialDaysRemaining — počítání dnů", () => {
  it("vrací 14 první den (právě spuštěno)", () => {
    startTrial(4);
    expect(getTrialDaysRemaining()).toBe(TRIAL_DAYS);
  });

  it("vrací 0 pokud trial nezačal", () => {
    expect(getTrialDaysRemaining()).toBe(0);
  });

  it("vrací 13 po 1 dni", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T10:00:00Z"));
    startTrial(4);
    vi.setSystemTime(new Date("2026-05-02T10:00:00Z"));
    expect(getTrialDaysRemaining()).toBe(13);
  });

  it("vrací 1 po 13 dnech", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T10:00:00Z"));
    startTrial(4);
    vi.setSystemTime(new Date("2026-05-14T10:00:00Z"));
    expect(getTrialDaysRemaining()).toBe(1);
  });

  it("vrací 0 po 14+ dnech (expired)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T10:00:00Z"));
    startTrial(4);
    vi.setSystemTime(new Date("2026-05-15T10:00:00Z"));
    expect(getTrialDaysRemaining()).toBe(0);
  });
});

describe("getTrialCurrentDay", () => {
  it("vrací 1 první den", () => {
    startTrial(4);
    expect(getTrialCurrentDay()).toBe(1);
  });
  it("vrací 14 poslední den", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T10:00:00Z"));
    startTrial(4);
    vi.setSystemTime(new Date("2026-05-14T10:00:00Z"));
    expect(getTrialCurrentDay()).toBe(14);
  });
});

describe("isTrialActive / isTrialExpired", () => {
  it("active=true, expired=false hned po startu", () => {
    startTrial(4);
    expect(isTrialActive()).toBe(true);
    expect(isTrialExpired()).toBe(false);
  });

  it("active=false, expired=false pokud trial neexistuje", () => {
    expect(isTrialActive()).toBe(false);
    expect(isTrialExpired()).toBe(false);
  });

  it("active=false, expired=true po 15 dnech", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T10:00:00Z"));
    startTrial(4);
    vi.setSystemTime(new Date("2026-05-15T10:00:00Z"));
    expect(isTrialActive()).toBe(false);
    expect(isTrialExpired()).toBe(true);
  });
});

describe("clearTrial", () => {
  it("smaže stav", () => {
    startTrial(4);
    expect(getTrialState()).not.toBeNull();
    clearTrial();
    expect(getTrialState()).toBeNull();
  });
});

describe("restartTrial — dev reset", () => {
  it("obnoví expirovaný trial zpět na 14 dní (den 1)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T10:00:00Z"));
    startTrial(5);
    vi.setSystemTime(new Date("2026-05-20T10:00:00Z")); // dávno po expiraci
    expect(getTrialDaysRemaining()).toBe(0);
    restartTrial();
    expect(getTrialDaysRemaining()).toBe(TRIAL_DAYS);
    expect(getTrialCurrentDay()).toBe(1);
    expect(isTrialActive()).toBe(true);
  });

  it("zachová ročník při resetu", () => {
    startTrial(7);
    restartTrial();
    expect(getTrialState()?.grade).toBe(7);
  });

  it("nastaví předaný ročník (nebo default 4 bez existujícího)", () => {
    restartTrial(); // žádný existující trial
    expect(getTrialState()?.grade).toBe(4);
    restartTrial(8);
    expect(getTrialState()?.grade).toBe(8);
  });

  it("daysAgo posune start do minulosti (test stavu před koncem)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-10T10:00:00Z"));
    restartTrial(4, TRIAL_DAYS - 2); // start před 12 dny → den 13, zbývají 2
    expect(getTrialDaysRemaining()).toBe(2);
    expect(getTrialCurrentDay()).toBe(13);
  });

  it("daysAgo > TRIAL_DAYS → expirováno", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-10T10:00:00Z"));
    restartTrial(4, TRIAL_DAYS + 1);
    expect(isTrialExpired()).toBe(true);
  });
});
