import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Přenos anonymních úrovní do účtu dítěte při spárování.
 * Supabase je nahrazený záznamníkem: test hlídá, CO by se zapsalo.
 */
const db = vi.hoisted(() => ({
  existing: [] as { topic_id: string; level: number }[],
  upserts: [] as unknown[],
  selectFilters: [] as unknown[],
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: string) => ({
          in: (c2: string, vals: string[]) => {
            db.selectFilters.push({ table, [col]: val, [c2]: vals });
            return Promise.resolve({ data: db.existing, error: null });
          },
        }),
      }),
      upsert: (rows: unknown[], opts: unknown) => {
        db.upserts.push({ table, rows, opts });
        return Promise.resolve({ error: null });
      },
    }),
    auth: { getSession: () => Promise.resolve({ data: { session: null } }) },
  },
}));

import { migrateAnonLevels, clearAnonData, hasAnonProgressToMigrate } from "@/lib/anonMigration";
import { ANON_LEVELS_KEY, anonHigherLevelCount } from "@/lib/levelStore";

const uloz = (x: Record<string, unknown>) => localStorage.setItem(ANON_LEVELS_KEY, JSON.stringify(x));
const L = (level: number, consecutiveGood = 0) => ({ level, consecutiveGood, consecutiveBad: 0, lastScore: 1 });

beforeEach(() => {
  localStorage.clear();
  db.existing = [];
  db.upserts = [];
  db.selectFilters = [];
});

describe("migrateAnonLevels", () => {
  it("zapíše anonymní úrovně pod ID dítěte (student_id), všechna témata", async () => {
    uloz({ "g3-a": L(2), "g3-b": L(1, 1) });
    const r = await migrateAnonLevels("dite-uid");
    expect(r).toEqual({ ok: true, migrated: 2 });
    const { table, rows, opts } = db.upserts[0] as { table: string; rows: { student_id: string; topic_id: string; level: number; consecutive_good: number }[]; opts: unknown };
    expect(table).toBe("student_skill_level");
    expect(opts).toEqual({ onConflict: "student_id,topic_id" });
    expect(rows.map((x) => [x.student_id, x.topic_id, x.level, x.consecutive_good])).toEqual([
      ["dite-uid", "g3-a", 2, 0],
      ["dite-uid", "g3-b", 1, 1],
    ]);
  });

  it("nikdy nesníží úroveň, kterou dítě v účtu už má", async () => {
    uloz({ "g3-a": L(2), "g3-b": L(3) });
    db.existing = [{ topic_id: "g3-a", level: 3 }, { topic_id: "g3-b", level: 1 }];
    const r = await migrateAnonLevels("dite-uid");
    expect(r.migrated).toBe(1);
    const rows = (db.upserts[0] as { rows: { topic_id: string; level: number }[] }).rows;
    expect(rows).toEqual([expect.objectContaining({ topic_id: "g3-b", level: 3 })]);
  });

  it("bez anonymních úrovní nesahá do databáze", async () => {
    expect(await migrateAnonLevels("dite-uid")).toEqual({ ok: true, migrated: 0 });
    expect(db.selectFilters).toHaveLength(0);
    expect(db.upserts).toHaveLength(0);
  });

  it("poškozená data v úložišti přeskočí", async () => {
    uloz({ "g3-a": { level: 7 }, "g3-b": "nesmysl", "g3-c": L(2) });
    const r = await migrateAnonLevels("dite-uid");
    expect(r.migrated).toBe(1);
  });
});

describe("kdy nabídnout přenos a co smazat", () => {
  it("téma na vyšší úrovni stačí k nabídce, i bez splněného denního úkolu", () => {
    expect(hasAnonProgressToMigrate()).toBe(false);
    uloz({ "g3-a": L(1, 1) });
    expect(hasAnonProgressToMigrate()).toBe(false);
    uloz({ "g3-a": L(2) });
    expect(anonHigherLevelCount()).toBe(1);
    expect(hasAnonProgressToMigrate()).toBe(true);
  });

  it("rodičovská registrace (keepLevels) úrovně nechá pro pozdější spárování dítěte", () => {
    uloz({ "g3-a": L(2) });
    clearAnonData({ keepLevels: true });
    expect(localStorage.getItem(ANON_LEVELS_KEY)).not.toBeNull();
    clearAnonData();
    expect(localStorage.getItem(ANON_LEVELS_KEY)).toBeNull();
  });
});
