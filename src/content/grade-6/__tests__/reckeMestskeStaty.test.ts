import { describe, it, expect } from "vitest";
import { RECKE_MESTSKE_STATY } from "../dejepis/reckeMestskeStaty";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Athény a Sparta — faktický categorize vzor 2. stupně.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): klasifikátor kotevních slov psaný zvlášť,
 * NEimportuje banku generátoru. Pravidlo: když karta matchuje kotvu OBA, patří
 * k oběma státům (OBA má přednost). Jinak musí matchovat právě jednu z kotev
 * ATHÉNY / SPARTA. 0 nebo 2+ shod = nejednoznačná karta = selhání.
 */
const topic = RECKE_MESTSKE_STATY[0];

type Stat = "A" | "S" | "O";
const KOTVY: Record<Stat, RegExp> = {
  A: /shromáždění|střep|akropol|parthenón|periklés|kleisthen|solón|loďstvo|válečných lodích|divadl|hledišti|tragédi|filozof|oba rodiče|(?<!\p{L})(vy)?los|přístav|attik|mramor|lyru|učitel|dlouh[ou]u? a krásnou řečí|dlouhou řečí|odměnu|vyhnat hlasováním|stejný hlas/iu,
  S: /král|rada starších|v radě|gerús|(?<!\p{L})efor|heilót|nevolník|sedm|od rodičů|peloponés|lakón|lakonick|jediným slovem|zbytečná slova|želez|stravování|společného stolu|perioik|okolních vesnic|dívky|dcera|nesvobodní lidé patřící|novorozen|ukradl|zeď|štít|dva vládci|doživot/iu,
  O: /řeck|dia\.|olympijsk|žen.*nehlasuj|nesvobodní lidé bez|persk|samostatný stát|cizinec|bránit město|delf/iu,
};

function solve(card: string): Stat {
  if (KOTVY.O.test(card)) return "O";
  const hits = (["A", "S"] as Stat[]).filter((s) => KOTVY[s].test(card));
  expect(hits, `karta "${card}" matchuje ${hits.length} kotev: ${hits}`).toHaveLength(1);
  return hits[0];
}

const BIN_STAT: Record<string, Stat> = {
  "Athény": "A", "Sparta": "S", "Jen Athény": "A", "Jen Sparta": "S", "Oba státy": "O",
};
const cards = (t: PracticeTask) => t.categories!.flatMap((c) => c.items);

describe("Athény a Sparta — metadata", () => {
  it("dějepis g6, categorize, Starověk / Antika - Řecko znak po znaku", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řecko");
    expect(topic.rvpNodeId).toBe("g6-dejepis-starovek-antika-recko-recke-mestske-staty-atheny-demokracie-sparta");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Athény a Sparta — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, deterministicky", () => {
    expect(new Set(tasks.map(klicUlohy)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator(level).map(klicUlohy)).toEqual(tasks.map(klicUlohy));
  });

  it("struktura přihrádek: L1/L2 dvě, L3 tři a každá neprázdná", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      const names = t.categories!.map((c) => c.name).sort();
      if (level < 3) expect(names).toEqual(["Athény", "Sparta"]);
      else expect(names).toEqual(["Jen Athény", "Jen Sparta", "Oba státy"]);
      for (const c of t.categories!) expect(c.items.length, c.name).toBeGreaterThanOrEqual(1);
      expect(new Set(cards(t)).size).toBe(cards(t).length);
      expect(t.explanation).toBeTruthy();
    }
  });

  it("NEZÁVISLÝ SOLVER: každá karta padne do své přihrádky", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          expect(solve(item), `"${item}" je v "${c.name}"`).toBe(BIN_STAT[c.name]);
        }
      }
    }
  });

  it("nápovědy: 2, různé, unikátní, bez textu karty a bez názvu státu; karta není v zadání", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      expect(t.hints).toHaveLength(2);
      const [a, b] = t.hints!;
      expect(a).not.toBe(b);
      expect(h0.has(a), `opakovaná malá nápověda: ${a}`).toBe(false);
      expect(h1.has(b), `opakovaná velká nápověda: ${b}`).toBe(false);
      h0.add(a);
      h1.add(b);
      for (const h of t.hints!) {
        expect(/Athén|Spart|Oba státy/.test(h), `nápověda jmenuje stát: ${h}`).toBe(false);
        for (const card of cards(t)) expect(h.includes(card), `nápověda obsahuje kartu: ${card}`).toBe(false);
      }
      for (const card of cards(t)) expect(t.question.includes(card)).toBe(false);
    }
  });

  it("čeština: žádné rodové lomítko", () => {
    for (const t of tasks) {
      for (const s of [t.question, t.explanation ?? "", ...t.hints!, ...cards(t)]) {
        expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
      }
    }
  });
});

describe("Athény a Sparta — gradace", () => {
  it("L1 ∩ L3 texty otázek i karet jsou disjunktní, L1 ∩ L2 karty také", () => {
    const [t1, t2, t3] = [1, 2, 3].map((l) => topic.generator(l));
    const q1 = new Set(t1.map((t) => t.question));
    expect(t3.filter((t) => q1.has(t.question))).toHaveLength(0);
    expect(t2.filter((t) => q1.has(t.question))).toHaveLength(0);
    const c1 = new Set(t1.flatMap(cards));
    expect(t3.flatMap(cards).filter((c) => c1.has(c))).toHaveLength(0);
    expect(t2.flatMap(cards).filter((c) => c1.has(c))).toHaveLength(0);
  });

  it("L3 obsahuje kartu bořící miskoncepci demokracie = vláda všech", () => {
    const oba = topic.generator(3).flatMap((t) => t.categories!.find((c) => c.name === "Oba státy")!.items);
    expect(oba.some((c) => /ženy ani nesvobodní/i.test(c))).toBe(true);
  });
});
