import { describe, it, expect } from "vitest";
import { dropTruncatedTailSession } from "@/lib/sessionLogPaging";
import { startOfLocalDayIso } from "@/lib/assignmentBinding";

/**
 * Useknuté sezení na hraně limitu.
 *
 * Obrazovky skládají sezení z pevného počtu ŘÁDKŮ, takže nejstarší sezení
 * v plné dávce přijde rozseknuté vejpůl — a zobrazí se s podhodnoceným počtem
 * úloh i známkou, aniž by to šlo poznat.
 */

const rows = (spec: [string, number][]) =>
  spec.flatMap(([sid, n]) => Array.from({ length: n }, () => ({ session_id: sid })));

describe("dropTruncatedTailSession", () => {
  it("nedosaženo limitu → nic se nezahazuje", () => {
    const data = rows([["a", 3], ["b", 3]]); // 6 řádků, limit 10
    expect(dropTruncatedTailSession(data, 10)).toHaveLength(6);
  });

  it("limit vyčerpán → nejstarší (poslední) sezení jde pryč", () => {
    // Sestupné řazení podle času: „b" je nejstarší a mohlo být useknuté.
    const data = rows([["a", 4], ["b", 2]]); // přesně 6 = limit
    const kept = dropTruncatedTailSession(data, 6);
    expect(kept).toHaveLength(4);
    expect(kept.every(r => r.session_id === "a")).toBe(true);
  });

  it("zahodí celé sezení, ne jen jeho konec", () => {
    const data = rows([["a", 2], ["b", 1], ["c", 3]]);
    const kept = dropTruncatedTailSession(data, 6);
    expect(kept.map(r => r.session_id)).toEqual(["a", "a", "b"]);
  });

  it("dávka z jediného sezení delšího než limit → prázdno, ne špatná čísla", () => {
    const data = rows([["a", 5]]);
    expect(dropTruncatedTailSession(data, 5)).toEqual([]);
  });

  it("prázdný vstup projde beze změny", () => {
    expect(dropTruncatedTailSession([], 200)).toEqual([]);
  });
});

describe("startOfLocalDayIso", () => {
  it("vrací MÍSTNÍ půlnoc, ne UTC", () => {
    // V ČR (UTC+1/+2) je místní půlnoc dřív než UTC půlnoc téhož dne. Naivní
    // `${den}T00:00:00Z` by usekl logy z brzkých ranních hodin, které do okna
    // úkolu patří — a u úkolu procvičeného pozdě večer by zmizelo skóre.
    const iso = startOfLocalDayIso("2026-09-01");
    expect(iso).not.toBeNull();
    const d = new Date(iso!);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(8);
    expect(d.getDate()).toBe(1);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });

  it("nesmyslný vstup vrací null, ne Invalid Date", () => {
    expect(startOfLocalDayIso("není datum")).toBeNull();
    expect(startOfLocalDayIso("")).toBeNull();
  });
});
