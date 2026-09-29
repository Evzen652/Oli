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

describe("TaskVisual — vykreslení", () => {
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
