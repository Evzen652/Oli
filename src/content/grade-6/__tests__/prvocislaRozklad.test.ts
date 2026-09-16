import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { PRVOCISLA_ROZKLAD } from "../matematika/prvocislaRozklad";

/**
 * Prvočísla a rozklad na součin prvočísel. NEZÁVISLÝ SOLVER: parsuje čísla
 * ze ZNĚNÍ otázky (ne z parametrů generátoru) a počítá jinou cestou než
 * generátor — prvočíselnost i rozklad přes Eratosthenovo síto s tabulkou
 * nejmenšího prvočinitele (generátor používá zkusmé dělení).
 */
const topic = PRVOCISLA_ROZKLAD[0];

// ── Nezávislý solver ───────────────────────────────────────────────────────
const LIMIT = 5000;
const spf: number[] = Array(LIMIT + 1).fill(0); // nejmenší prvočinitel
for (let i = 2; i <= LIMIT; i++) {
  if (spf[i] === 0) for (let j = i; j <= LIMIT; j += i) if (spf[j] === 0) spf[j] = i;
}
const jePrvo = (n: number) => n >= 2 && spf[n] === n;
const jeSlozene = (n: number) => n >= 4 && spf[n] !== n;
function faktory(n: number): number[] {
  const out: number[] = [];
  while (n > 1) {
    out.push(spf[n]);
    n /= spf[n];
  }
  return out;
}
/** „1 470“ → 1470 */
const num = (s: string) => Number(s.replace(/[\s ]/g, ""));
const cinitele = (s: string) => s.split("·").map((x) => num(x));
const soucin = (a: number[]) => a.reduce((x, y) => x * y, 1);
const neklesajici = (a: number[]) => a.every((x, i) => i === 0 || a[i - 1] <= x);
/** Samostatný výskyt čísla v textu (ne jako část většího čísla). */
const obsahujeCislo = (text: string, n: string) =>
  new RegExp(`(^|[^\\d])${n.replace(/\s/g, "\\s")}(?![\\d]|\\s\\d{3})`).test(text);

const all = (level: number) => topic.generator(level);

describe("Prvočísla a rozklad — metadata", () => {
  it("matematika g6, select_one, RVP id", () => {
    expect(topic.id).toBe("g6-mat-prvocisla-rozklad-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.rvpNodeId).toBe(
      "g6-matematika-cislo-a-promenna-delitelnost-prirozenych-cisel-prvocisla-a-cisla-slozena-rozklad-na-soucin-prvocisel",
    );
    expect(topic.category).toBe("Číslo a proměnná");
    expect(topic.topic).toBe("Dělitelnost přirozených čísel");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Prvočísla a rozklad — obecné kontroly L%i", (level) => {
  const tasks = all(level);

  it("≥12 unikátních otázek", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, klíč mezi nimi, feedback u každého distraktoru", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("dvě různé nápovědy, žádná neobsahuje klíč; klíč není v otázce", () => {
    for (const t of tasks) {
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(obsahujeCislo(h, t.correctAnswer) || h.includes(t.correctAnswer), `leak: ${h}`).toBe(false);
      }
      expect(obsahujeCislo(t.question, t.correctAnswer), `giveaway: ${t.question}`).toBe(false);
    }
  });

  it("vysvětlení a aspoň dva kroky řešení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    let nejdelsi = 0;
    for (const t of tasks) {
      const sorted = [...t.options!].sort((a, b) => b.length - a.length);
      if (sorted[0] === t.correctAnswer && sorted[0].length >= 1.25 * sorted[1].length) nejdelsi++;
    }
    expect(nejdelsi / tasks.length).toBeLessThan(0.35);
  });
});

describe("Solver L1 — prvočíslo / číslo složené", () => {
  it("právě jedna možnost má hledanou vlastnost a je to klíč", () => {
    for (const t of all(1)) {
      const posledniVeta = t.question.split(/(?<=\.)\s+/).pop()!;
      const hledaPrvo = /je prvočíslo\?$/.test(posledniVeta);
      const hledaSlozene = /je číslo složené\?$/.test(posledniVeta);
      expect(hledaPrvo !== hledaSlozene, t.question).toBe(true);
      const test = hledaPrvo ? jePrvo : jeSlozene;
      const vyhovi = t.options!.filter((o) => test(num(o)));
      expect(vyhovi, t.question).toEqual([t.correctAnswer]);
      // 1 nevyhovuje ani jedné šabloně
      expect(jePrvo(1) || jeSlozene(1)).toBe(false);
      for (const o of t.options!) expect(num(o)).toBeLessThanOrEqual(60);
    }
  });

  it("obě šablony jsou zastoupené", () => {
    const qs = all(1).map((t) => t.question);
    expect(qs.some((q) => /je prvočíslo\?$/.test(q))).toBe(true);
    expect(qs.some((q) => /je číslo složené\?$/.test(q))).toBe(true);
  });
});

describe("Solver L2 — rozklad", () => {
  it("klíč = vlastní faktorizace; každý distraktor selže aspoň v jedné kontrole", () => {
    for (const t of all(2)) {
      const m = t.question.match(/rozklad čísla ([\d\s]+?) na součin prvočísel/);
      expect(m, t.question).toBeTruthy();
      const N = num(m![1]);
      expect(N).toBeGreaterThanOrEqual(24);
      expect(N).toBeLessThanOrEqual(360);

      const k = cinitele(t.correctAnswer);
      expect(k.every(jePrvo), t.correctAnswer).toBe(true);
      expect(neklesajici(k)).toBe(true);
      expect(soucin(k)).toBe(N);
      expect(k.length).toBeGreaterThanOrEqual(3);
      expect(k.length).toBeLessThanOrEqual(5);
      expect(t.correctAnswer).toBe(faktory(N).join(" · "));

      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        const c = cinitele(d);
        const ok = c.every(jePrvo) && neklesajici(c) && soucin(c) === N;
        expect(ok, `distraktor "${d}" je platný rozklad ${N}`).toBe(false);
      }
    }
  });
});

describe("Solver L3 — práce s rozkladem", () => {
  const tasks = all(3);

  it("obě šablony (dělitel, největší prvočinitel) jsou zastoupené", () => {
    expect(tasks.some((t) => /Kterým z nabízených čísel/.test(t.question))).toBe(true);
    expect(tasks.some((t) => /největší prvočinitel/.test(t.question))).toBe(true);
  });

  it("C: právě jedna možnost dělí M, a je to klíč", () => {
    for (const t of tasks.filter((x) => /Kterým z nabízených čísel/.test(x.question))) {
      const m = t.question.match(/prvočísel ([\d ·]+)\./);
      expect(m, t.question).toBeTruthy();
      const f = cinitele(m![1]);
      expect(f.every(jePrvo)).toBe(true);
      const M = soucin(f);
      const deli = t.options!.filter((o) => M % num(o) === 0);
      expect(deli, t.question).toEqual([t.correctAnswer]);
      for (const o of t.options!) expect(num(o)).not.toBe(M);
      // klíč v otázce jako samostatné číslo není
      expect(f.map(String)).not.toContain(t.correctAnswer);
    }
  });

  it("D: klíč = největší prvočinitel podle vlastní faktorizace", () => {
    for (const t of tasks.filter((x) => /největší prvočinitel/.test(x.question))) {
      const m = t.question.match(/prvočinitel čísla ([\d\s]+?),/);
      expect(m, t.question).toBeTruthy();
      const N = num(m![1]);
      expect(N).toBeGreaterThanOrEqual(100);
      expect(N).toBeLessThanOrEqual(999);
      const f = faktory(N);
      const max = Math.max(...f);
      expect(num(t.correctAnswer)).toBe(max);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        const v = num(d);
        // distraktor není prvočinitel větší než klíč a není to klíč
        expect(f.includes(v) && v >= max, `${d} u ${N}`).toBe(false);
        // a opravdu je chybou: není prvočíslo, nebo N nedělí, nebo je menší prvočinitel
        expect(!jePrvo(v) || N % v !== 0 || v < max, `${d} u ${N}`).toBe(true);
      }
      // nejde řešit vylučováním: v nabídce jsou aspoň dvě velká prvočísla
      // a aspoň jedno z nich N nedělí
      const velka = t.options!.map(num).filter((v) => jePrvo(v) && v >= 11);
      expect(velka.length, t.question).toBeGreaterThanOrEqual(2);
      expect(velka.some((v) => N % v !== 0), t.question).toBe(true);
    }
  });
});

describe("Prvočísla a rozklad — gradace", () => {
  it("otázky L1, L2 a L3 jsou disjunktní a šablony se nesdílejí", () => {
    const q = (l: number) => new Set(all(l).map((t: PracticeTask) => t.question));
    const [l1, l2, l3] = [q(1), q(2), q(3)];
    for (const x of l1) {
      expect(l2.has(x)).toBe(false);
      expect(l3.has(x)).toBe(false);
    }
    for (const x of l2) expect(l3.has(x)).toBe(false);
    for (const x of l3) expect(/je prvočíslo\?|je číslo složené\?|Jak vypadá rozklad/.test(x)).toBe(false);
  });
});
