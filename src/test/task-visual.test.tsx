import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getAllTopics } from "@/lib/contentRegistry";
import { TaskVisual } from "@/components/TaskVisual";
import type { PracticeTask } from "@/lib/types";

/**
 * Proužek zlomku u úloh 4. ročníku. Kontrola čte čísla ZE ZNĚNÍ úlohy
 * (nezávisle na generátoru) a porovná je s obrázkem — obrázek, který
 * nesedí se zadáním, je horší než žádný.
 */
const topic = (id: string) => getAllTopics().find((t) => t.id === id)!;
const tasks = (id: string, level: number): PracticeTask[] =>
  Array.from({ length: 5 }, () => topic(id).generator(level)).flat();

const CAST = "g4-mat-zlomek-cast-celku-4";
const SCIT = "g4-mat-zlomky-scitani-odcitani-stejny-jmenovatel-4";

describe("proužek sedí se zněním úlohy", () => {
  it("zlomek jako část celku, L1: díly a vybarvené díly ze znění", () => {
    for (const t of tasks(CAST, 1)) {
      const m = t.question.match(/rozdělený na (\d+) .*vybarvila (\d+)/)!;
      expect(m, t.question).toBeTruthy();
      expect(t.visual).toEqual({ kind: "fraction_bar", parts: +m[1], groups: [+m[2]] });
    }
  });

  it("zlomek jako část celku, L2: snědená část ze zlomku ve znění; porovnání obrázek nemá", () => {
    for (const t of tasks(CAST, 2)) {
      if (t.question.startsWith("Porovnej")) { expect(t.visual).toBeUndefined(); continue; }
      const m = t.question.match(/Snědli jsme (\d+)\/(\d+)/)!;
      expect(m, t.question).toBeTruthy();
      expect(t.visual).toEqual({ kind: "fraction_bar", parts: +m[2], groups: [+m[1]] });
    }
  });

  it("sčítání, L1 a slovní úloha na L2: dvě skupiny = dva sčítance; odčítání obrázek nemá", () => {
    for (const t of [...tasks(SCIT, 1), ...tasks(SCIT, 2)]) {
      const m = t.question.match(/(\d+)\/(\d+) (?:\+|pizzy a Bára) (\d+)\/(\d+)/);
      if (!m) { expect(t.visual, t.question).toBeUndefined(); continue; }
      expect(+m[2]).toBe(+m[4]);
      expect(t.visual).toEqual({ kind: "fraction_bar", parts: +m[2], groups: [+m[1], +m[3]] });
    }
  });

  it("L3 obrázek nemá (dítě se od opory odpoutá)", () => {
    for (const t of [...tasks(CAST, 3), ...tasks(SCIT, 3)]) expect(t.visual, t.question).toBeUndefined();
  });
});

const DELKA = "g2-mat-mereni-delky";
const OSA = "g2-mat-ciselna-osa-100";

describe("pravítko sedí se zněním úlohy", () => {
  it("L1 a L2 „na pravítku od … do …“: úsečka ze znění, pravítko ji přesahuje; ostatní bez obrázku", () => {
    let s = 0;
    for (const t of [...tasks(DELKA, 1), ...tasks(DELKA, 2)]) {
      const m = t.question.match(/na pravítku (?:sahá od|začíná u) (\d+) (?:do|a končí u) (\d+)/);
      if (!m) { expect(t.visual, t.question).toBeUndefined(); continue; }
      s++;
      expect(t.visual).toMatchObject({ kind: "ruler", from: +m[1], to: +m[2] });
      const v = t.visual as { length: number };
      expect(v.length).toBeGreaterThan(+m[2]);
    }
    expect(s).toBeGreaterThan(20);
  });

  it("L3 obrázek nemá", () => {
    for (const t of tasks(DELKA, 3)) expect(t.visual, t.question).toBeUndefined();
  });
});

describe("číselná osa sedí se zněním úlohy a neprozradí odpověď", () => {
  it("otazník = klíč, klíč není vypsaný, vypsaná čísla stojí v zadání", () => {
    let s = 0;
    for (const t of [...tasks(OSA, 1), ...tasks(OSA, 2)]) {
      if (!t.visual) continue;
      s++;
      const v = t.visual as { kind: string; from: number; to: number; step: number; labeled: number[]; unknown: number };
      expect(v.kind).toBe("number_line");
      expect(String(v.unknown), t.question).toBe(t.correctAnswer);
      expect(v.labeled).not.toContain(v.unknown);
      const vZadani = (t.question.match(/\d+/g) ?? []).map(Number);
      for (const n of v.labeled) expect(vZadani, t.question).toContain(n);
      expect((v.unknown - v.from) % v.step).toBe(0);
      expect(v.from).toBeGreaterThanOrEqual(0);
      expect(v.to).toBeLessThanOrEqual(100);
    }
    expect(s).toBeGreaterThan(40);
  });

  it("obrázek mají „hned za/před“, „mezi“ a řady; desítky kolem čísla ho nemají (osa by je vypsala)", () => {
    for (const t of [...tasks(OSA, 1), ...tasks(OSA, 2)]) {
      const ma = /hned (za|před)|leží na číselné ose mezi|Co chybí na ose/.test(t.question);
      expect(!!t.visual, t.question).toBe(ma);
    }
  });

  it("L3 obrázek nemá", () => {
    for (const t of tasks(OSA, 3)) expect(t.visual, t.question).toBeUndefined();
  });
});

describe("TaskVisual — vykreslení", () => {
  it("pravítko: čísla 0…délka, žádná délka úsečky v textu", () => {
    const { container } = render(<TaskVisual visual={{ kind: "ruler", from: 3, to: 7, length: 10 }} />);
    const cisla = [...container.querySelectorAll("text")].map((e) => e.textContent);
    expect(cisla).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    expect(container.textContent).not.toMatch(/cm|mm/);
  });

  it("osa: vypíše jen `labeled`, na hledaném místě otazník", () => {
    const { container } = render(<TaskVisual visual={{ kind: "number_line", from: 66, to: 71, step: 1, labeled: [68], unknown: 69, highlight: 68 }} />);
    const texty = [...container.querySelectorAll("text")].map((e) => e.textContent);
    expect(texty.sort()).toEqual(["68", "?"]);
    expect(container.querySelectorAll("line").length).toBe(1 + 6);
  });

  it("osa, která by vypsala hledané číslo, se nevykreslí", () => {
    const { container } = render(<TaskVisual visual={{ kind: "number_line", from: 0, to: 4, step: 1, labeled: [2], unknown: 2 }} />);
    expect(container.innerHTML).toBe("");
  });

  it("nakreslí tolik dílů, kolik má celek, a zabarví jen skupiny", () => {
    const { container } = render(<TaskVisual visual={{ kind: "fraction_bar", parts: 8, groups: [3, 2] }} />);
    const dily = container.querySelectorAll('[role="img"] > div');
    expect(dily).toHaveLength(8);
    expect([...dily].filter((d) => d.className.includes("bg-primary"))).toHaveLength(3);
    expect([...dily].filter((d) => d.className.includes("bg-sky-500"))).toHaveLength(2);
  });

  it("neobsahuje zlomek ani „x z y“ — úloha se na něj často ptá", () => {
    const { container } = render(<TaskVisual visual={{ kind: "fraction_bar", parts: 4, groups: [1] }} />);
    expect(container.textContent).toBe("");
    expect(container.innerHTML).not.toMatch(/1\/4|1 z 4/);
  });

  it("nesmyslná data nevykreslí (víc zabarvených dílů než celek)", () => {
    const { container } = render(<TaskVisual visual={{ kind: "fraction_bar", parts: 3, groups: [2, 2] }} />);
    expect(container.innerHTML).toBe("");
  });
});
