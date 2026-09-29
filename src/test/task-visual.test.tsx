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

const ZAP = "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose";
const DES = "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani";
/** „−11" → −11, „3,14" → 3.14 (typografické mínus, desetinná čárka). */
const num = (s: string) => Number(s.replace("−", "-").replace(",", "."));
type Osa = { kind: string; from: number; to: number; step: number; labeled: number[]; unknown?: number; range?: [number, number] };
const byId = (prefix: string) => getAllTopics().find((t) => t.id.startsWith(prefix))!.id;

describe("záporná čísla (5. r.) — osa sedí se zněním", () => {
  const id = () => byId(ZAP.slice(0, 70));
  it("otazník = klíč; úsek „mezi“ = čísla ze zadání, klíč uvnitř, ostatní možnosti mimo", () => {
    let s = 0, u = 0;
    for (const t of [...tasks(id(), 1), ...tasks(id(), 2)]) {
      const v = t.visual as Osa | undefined;
      if (!v) continue;
      expect(v.kind).toBe("number_line");
      if (v.unknown !== undefined) {
        s++;
        expect(num(t.correctAnswer), t.question).toBe(v.unknown);
        expect(v.labeled).not.toContain(v.unknown);
      } else {
        u++;
        const m = t.question.match(/mezi (−?\d+) a (−?\d+)/)!;
        expect(v.range).toEqual([num(m[1]), num(m[2])]);
        const [a, b] = v.range!;
        for (const o of t.options ?? []) {
          const x = num(o);
          expect(x > a && x < b, `${t.question} → ${o}`).toBe(o === t.correctAnswer);
        }
      }
      expect(v.to - v.from).toBeLessThanOrEqual(20 * v.step);
    }
    expect(s).toBeGreaterThan(20);
    expect(u).toBeGreaterThan(5);
  });

  it("„n dílů vlevo od nuly“: vypsaná jen nula, otazník n dílů vlevo", () => {
    for (const t of tasks(id(), 1)) {
      const m = t.question.match(/(\d+) díl\S* vlevo od nuly/);
      if (!m) continue;
      expect(t.visual).toMatchObject({ labeled: [0], unknown: -Number(m[1]) });
    }
  });

  it("L3 obrázek nemá", () => {
    for (const t of tasks(id(), 3)) expect(t.visual, t.question).toBeUndefined();
  });
});

describe("desetinná čísla (5. r.) — přiblížená osa u „mezi“", () => {
  const id = () => byId(DES.slice(0, 70));
  it("osa od c,a do c,a+1 po setinách; klíč uvnitř úseku, ostatní možnosti mimo", () => {
    let s = 0;
    for (const t of tasks(id(), 3)) {
      const m = t.question.match(/mezi (\d+,\d) a (\d+,\d)\?/);
      if (!m) { expect(t.visual, t.question).toBeUndefined(); continue; }
      s++;
      const v = t.visual as Osa;
      expect(v.from).toBeCloseTo(num(m[1]));
      expect(v.to).toBeCloseTo(num(m[2]));
      expect(v.step).toBe(0.01);
      expect(v.unknown).toBeUndefined();
      for (const o of t.options ?? []) {
        const x = num(o);
        expect(x > v.from + 1e-9 && x < v.to - 1e-9, `${t.question} → ${o}`).toBe(o === t.correctAnswer);
      }
    }
    expect(s).toBeGreaterThan(10);
  });

  it("L1 a L2 obrázek nemají", () => {
    for (const t of [...tasks(id(), 1), ...tasks(id(), 2)]) expect(t.visual, t.question).toBeUndefined();
  });
});

type Sit = {
  kind: string; cols: number; rows: number; fills?: number[][]; numbered?: boolean;
  points?: { x: number; y: number; label?: string }[];
  axes?: { dir: string; at: number }[]; center?: { x: number; y: number };
};

describe("čtvercová síť — obsah obrazce (5. r., L1)", () => {
  const id = () => byId("g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce");
  it("vybarvený obdélník = řádky × čtverečky ze znění; úlohy v cm síť nemají", () => {
    let s = 0;
    for (const t of [...tasks(id(), 1), ...tasks(id(), 2), ...tasks(id(), 3)]) {
      const m = t.question.match(/ve čtvercové síti má (\d+) řád\S* a v každém řádku (\d+) čtvereč/);
      if (!m) { expect(t.visual, t.question).toBeUndefined(); continue; }
      s++;
      const v = t.visual as Sit;
      expect(v.fills).toEqual([[1, 1, +m[2], +m[1]]]);
      expect(v.cols).toBe(+m[2] + 2);
      expect(v.rows).toBe(+m[1] + 2);
    }
    expect(s).toBeGreaterThan(20);
  });
});

describe("čtvercová síť — souměrnost (5. r., L3): osa a bod A, ne obraz", () => {
  const id = () => byId("g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova");
  it("bod A a osa sedí se zněním; síť mají jen úlohy „Kde leží jeho obraz?“", () => {
    let s = 0;
    for (const t of tasks(id(), 3)) {
      const m = t.question.match(/je (svislá|vodorovná) osa souměrnosti\. Bod A leží (\d+) čtvereč\S* (vlevo od osy|nad osou) a (\d+) čtvereč/);
      if (!m) { expect(t.visual, t.question).toBeUndefined(); continue; }
      s++;
      const v = t.visual as Sit, a = +m[2], b = +m[4];
      if (m[1] === "svislá") {
        expect(v.axes).toEqual([{ dir: "vertical", at: 7 }]);
        expect(v.points).toEqual([{ x: 7 - a, y: b, label: "A" }]);
      } else {
        expect(v.axes).toEqual([{ dir: "horizontal", at: 7 }]);
        expect(v.points).toEqual([{ x: b, y: 7 + a, label: "A" }]);
      }
    }
    expect(s).toBeGreaterThan(10);
  });
});

describe("čtvercová síť — osová a středová souměrnost (6. r.)", () => {
  const id = () => byId("g6-mat-osova-stredova-soumernost-6");
  const bodyZeZneni = (q: string) => [...q.matchAll(/\[(\d+); (\d+)\]/g)].map((m) => `${m[1]};${m[2]}`);
  it("body, osy a střed jsou přesně ty ze zadání; klíč na obrázku není", () => {
    let s = 0;
    for (const t of [...tasks(id(), 2), ...tasks(id(), 3)]) {
      const v = t.visual as Sit | undefined;
      if (!v) continue;
      s++;
      expect(v).toMatchObject({ kind: "grid", cols: 12, rows: 12, numbered: true });
      const zadani = bodyZeZneni(t.question);
      const S = t.question.match(/S \[(\d+); (\d+)\]/);
      for (const p of v.points ?? []) expect(zadani, t.question).toContain(`${p.x};${p.y}`);
      expect(v.center ? `${v.center.x};${v.center.y}` : undefined).toBe(S ? `${S[1]};${S[2]}` : undefined);
      const osy = [...t.question.matchAll(/prochází (sloupcem|řádkem) (\d+)/g)]
        .map((m) => ({ dir: m[1] === "sloupcem" ? "vertical" : "horizontal", at: +m[2] }));
      expect(v.axes ?? [], t.question).toEqual(osy);
      const klic = t.correctAnswer.match(/^\[(\d+); (\d+)\]$/);
      if (klic) {
        const k = `${klic[1]};${klic[2]}`;
        expect((v.points ?? []).map((p) => `${p.x};${p.y}`), t.question).not.toContain(k);
        if (v.center) expect(`${v.center.x};${v.center.y}`).not.toBe(k);
      }
    }
    expect(s).toBeGreaterThan(40);
  });

  it("úlohy se souřadnicemi v síti obrázek mají, L1 a vzdálenosti v cm ne", () => {
    for (const t of [...tasks(id(), 1), ...tasks(id(), 2), ...tasks(id(), 3)]) {
      expect(!!t.visual, t.question).toBe(/\[\d+; \d+\]/.test(t.question));
    }
  });
});

describe("TaskVisual — vykreslení", () => {
  it("síť: počátek vlevo dole, body na průsečících, očíslované čáry", () => {
    const { container } = render(<TaskVisual visual={{ kind: "grid", cols: 4, rows: 3, numbered: true, points: [{ x: 1, y: 2, label: "A" }], axes: [{ dir: "vertical", at: 2 }] }} />);
    const texty = [...container.querySelectorAll("text")].map((e) => e.textContent);
    expect(texty).toEqual(["0", "1", "2", "3", "4", "0", "1", "2", "3", "A"]);
    const bod = container.querySelector("circle")!;
    // x: levý okraj 36 + 1 políčko; y: horní okraj 16 + (3 − 2) políčka
    expect([bod.getAttribute("cx"), bod.getAttribute("cy")]).toEqual([String(36 + 32), String(16 + 32)]);
  });

  it("síť s bodem mimo nesmyslná → nevykreslí se", () => {
    const { container } = render(<TaskVisual visual={{ kind: "grid", cols: 4, rows: 3, points: [{ x: 5, y: 1 }] }} />);
    expect(container.innerHTML).toBe("");
  });

  it("osa se zápornými a desetinnými čísly: typografické mínus a čárka", () => {
    const a = render(<TaskVisual visual={{ kind: "number_line", from: -12, to: 1, step: 1, labeled: [0, -10], unknown: -11 }} />);
    expect([...a.container.querySelectorAll("text")].map((e) => e.textContent).sort()).toEqual(["0", "?", "−10"].sort());
    const b = render(<TaskVisual visual={{ kind: "number_line", from: 3.1, to: 3.2, step: 0.01, labeled: [3.1, 3.2], range: [3.1, 3.2] }} />);
    expect([...b.container.querySelectorAll("text")].map((e) => e.textContent)).toEqual(["3,1", "3,2"]);
    expect(b.container.querySelectorAll("g > line")).toHaveLength(11);
  });

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
