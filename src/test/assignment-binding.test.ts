import { describe, it, expect } from "vitest";
import {
  buildAssignmentWindows,
  isAssignedSession,
  localDayKey,
  pickCompletingSessionId,
  toAssignmentWindow,
} from "@/lib/assignmentBinding";

/**
 * Vazba sezení ↔ úkol od rodiče.
 *
 * Zamyká dvě chování, která před opravou mátla rodiče a která se páruje
 * pouhým `skill_id` nedala odlišit:
 *
 *  1. **Skóre splněného úkolu je zmrazené.** Pozdější procvičování téhož
 *     tématu ho nesmí přepsat.
 *  2. **Zadání úkolu nepřepisuje historii.** Sezení, která proběhla dřív, než
 *     rodič téma zadal, zůstávají samostatným procvičováním.
 */

/** Lokální ISO čas — testy počítají v místní zóně, stejně jako aplikace. */
const at = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min, 0, 0).toISOString();

const assignment = (over: Partial<Parameters<typeof toAssignmentWindow>[0]> = {}) => ({
  skill_id: "math-multiply",
  assigned_date: "2026-09-01",
  status: "pending" as string | null,
  created_at: at(2026, 9, 1, 8),
  updated_at: at(2026, 9, 1, 8),
  ...over,
});

describe("localDayKey — den v místní zóně", () => {
  it("procvičování po půlnoci patří do nového dne, ne do včerejška", () => {
    // `toISOString().slice(0,10)` by v ČR (UTC+2) vrátilo předchozí den.
    expect(localDayKey(at(2026, 9, 2, 0, 30))).toBe("2026-09-02");
  });

  it("nevalidní a chybějící vstup vrací null, ne NaN-datum", () => {
    expect(localDayKey("není datum")).toBeNull();
    expect(localDayKey(null)).toBeNull();
  });
});

describe("okno úkolu", () => {
  it("nesplněný úkol má otevřený konec", () => {
    expect(toAssignmentWindow(assignment()).completedAtMs).toBeNull();
  });

  it("splněný úkol se uzavře časem z updated_at", () => {
    const w = toAssignmentWindow(assignment({ status: "completed", updated_at: at(2026, 9, 3, 17) }));
    expect(w.completedAtMs).toBe(Date.parse(at(2026, 9, 3, 17)));
  });

  it("přeskočený úkol se uzavírá stejně jako splněný", () => {
    const w = toAssignmentWindow(assignment({ status: "skipped", updated_at: at(2026, 9, 3, 17) }));
    expect(w.completedAtMs).not.toBeNull();
  });

  it("historický řádek bez updated_at degraduje na created_at, ne na 'navždy otevřeno'", () => {
    const w = toAssignmentWindow(assignment({ status: "completed", updated_at: null }));
    expect(w.completedAtMs).toBe(Date.parse(at(2026, 9, 1, 8)));
  });
});

describe("isAssignedSession — co je samostatné procvičování", () => {
  const windows = buildAssignmentWindows([
    assignment({ status: "completed", updated_at: at(2026, 9, 3, 17) }),
  ]);

  it("sezení PŘED zadáním zůstává samostatné (dřív ho zadání zpětně smazalo)", () => {
    expect(isAssignedSession("math-multiply", at(2026, 8, 20), windows)).toBe(false);
  });

  it("sezení v den zadání už patří k úkolu", () => {
    expect(isAssignedSession("math-multiply", at(2026, 9, 1, 9), windows)).toBe(true);
  });

  it("sezení mezi zadáním a splněním patří k úkolu", () => {
    expect(isAssignedSession("math-multiply", at(2026, 9, 2), windows)).toBe(true);
  });

  it("sezení PO splnění je zase samostatné procvičování", () => {
    expect(isAssignedSession("math-multiply", at(2026, 9, 10), windows)).toBe(false);
  });

  it("jiné téma se nikdy nepovažuje za zadané", () => {
    expect(isAssignedSession("cz-vyjmenovana-slova-b", at(2026, 9, 2), windows)).toBe(false);
  });

  it("dosud nesplněný úkol nemá horní mez", () => {
    const open = buildAssignmentWindows([assignment()]);
    expect(isAssignedSession("math-multiply", at(2026, 12, 24), open)).toBe(true);
  });

  it("opakované zadání téhož tématu tvoří dvě nezávislá okna", () => {
    const twice = buildAssignmentWindows([
      assignment({ status: "completed", updated_at: at(2026, 9, 3, 17) }),
      assignment({ assigned_date: "2026-10-01", status: "completed", created_at: at(2026, 10, 1, 8), updated_at: at(2026, 10, 2, 17) }),
    ]);
    expect(isAssignedSession("math-multiply", at(2026, 9, 20), twice)).toBe(false); // mezi okny
    expect(isAssignedSession("math-multiply", at(2026, 10, 1, 15), twice)).toBe(true);
  });
});

describe("pickCompletingSessionId — zmrazené skóre úkolu", () => {
  const window = toAssignmentWindow(
    assignment({ status: "completed", updated_at: at(2026, 9, 3, 17) }),
  );

  const logs = [
    // Řazení sestupně, jak je vrací dotaz v `AssignmentList`.
    { session_id: "s-pozdeji", created_at: at(2026, 9, 20) },   // opakování PO splnění
    { session_id: "s-splnilo", created_at: at(2026, 9, 3, 16, 58) },
    { session_id: "s-splnilo", created_at: at(2026, 9, 3, 16, 55) },
    { session_id: "s-drive", created_at: at(2026, 8, 20) },     // před zadáním
  ];

  it("vybere sezení, které úkol splnilo — ne to poslední na tématu", () => {
    // Tohle je jádro původního bugu: dřív se vzalo `s-pozdeji` a dítě si tím
    // zpětně přepsalo známku u dávno hotového úkolu.
    expect(pickCompletingSessionId(logs, window)).toBe("s-splnilo");
  });

  it("ignoruje sezení z doby před zadáním úkolu", () => {
    expect(pickCompletingSessionId([logs[3]], window)).toBeNull();
  });

  it("bez jediného sezení v okně nevrátí cizí sezení, ale null", () => {
    expect(pickCompletingSessionId([logs[0]], window)).toBeNull();
  });

  it("tolerance kryje logy, které dorazily těsně po zápisu splnění", () => {
    // `session_logs` se ukládají fire-and-forget, takže poslední řádek může
    // přijít o kousek později než update úkolu.
    const late = [{ session_id: "s-splnilo", created_at: at(2026, 9, 3, 17, 1) }];
    expect(pickCompletingSessionId(late, window)).toBe("s-splnilo");
  });

  it("dlouho po splnění už tolerance neplatí", () => {
    const tooLate = [{ session_id: "s-pozdeji", created_at: at(2026, 9, 3, 17, 30) }];
    expect(pickCompletingSessionId(tooLate, window)).toBeNull();
  });
});
