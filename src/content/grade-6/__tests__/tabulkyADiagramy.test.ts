import { describe, it, expect } from "vitest";
import { TABULKY_A_DIAGRAMY } from "../matematika/tabulkyADiagramy";
import type { PracticeTask } from "@/lib/types";

/**
 * Tabulky a diagramy — NEZÁVISLÝ SOLVER.
 *
 * Solver nepoužívá nic z generátoru: tabulku PARSUJE ze znění otázky (řádky
 * se znakem „|“, česká čárka a mezera v tisících), šablonu pozná podle
 * klíčových slov a sloupce najde vlastním slovníkem tvarů (ve středu → St).
 * Počítá v celých setinách jako integer; chybějící hodnotu ověří dosazením
 * zpět (součet doplněné tabulky = počet · průměr).
 */
const topic = TABULKY_A_DIAGRAMY[0];

// ── Parsování ──────────────────────────────────────────────────────────────
/** „1 245,6“ → 124560 (setiny), „?“ → null. */
function setiny(s: string): number | null {
  const t = s.replace(/\s/g, "");
  if (t === "?") return null;
  expect(t, `nečitelné číslo „${s}“`).toMatch(/^\d+(,\d{1,2})?$/);
  const [w, f = ""] = t.split(",");
  return Number(w) * 100 + Number(f.padEnd(2, "0"));
}
const CISLO = /\d{1,3}(?: \d{3})*(?:,\d+)?/g;
const posledniCislo = (s: string): string | null => {
  const m = s.match(CISLO);
  return m ? m[m.length - 1] : null;
};
const mist = (c: string): number => (c.includes(",") ? c.split(",")[1].length : 0);

interface Tab {
  header: string[];
  rows: { label: string; vals: (number | null)[] }[];
  ask: string;
  tableText: string;
}

function parse(question: string): Tab {
  const lines = question.split("\n");
  const tabLines = lines.filter((l) => l.includes("|"));
  expect(tabLines.length, `tabulka chybí: ${question}`).toBeGreaterThanOrEqual(2);
  const cells = (l: string) => {
    const i = l.indexOf(": ");
    return { label: l.slice(0, i), cells: l.slice(i + 2).replace(/\.$/, "").split("|").map((c) => c.trim()) };
  };
  const header = cells(tabLines[0]).cells;
  const rows = tabLines.slice(1).map((l) => {
    const c = cells(l);
    expect(c.cells.length, question).toBe(header.length);
    return { label: c.label, vals: c.cells.map(setiny) };
  });
  const last = lines.lastIndexOf(tabLines[tabLines.length - 1]);
  return { header, rows, ask: lines.slice(last + 1).join(" "), tableText: tabLines.join("\n") };
}

/** Vlastní slovník tvarů záhlaví (solver nezná generátorová data). */
const TVARY: Record<string, string[]> = {
  Po: ["pondělí"], Út: ["úterý"], St: ["středu", "středa", "středy"], Čt: ["čtvrtek"],
  Pá: ["pátek"], So: ["sobotu", "sobota"], Ne: ["neděli", "neděle"],
  leden: ["lednu"], únor: ["únoru"], březen: ["březnu"], duben: ["dubnu"], květen: ["květnu"],
  červen: ["červnu"], červenec: ["červenci"], srpen: ["srpnu"], říjen: ["říjnu"],
  listopad: ["listopadu"], prosinec: ["prosinci"],
  rozhledna: ["rozhlednu"], jeskyně: ["jeskyni"], hrách: ["hrachu"], řeřicha: ["řeřichy"], bob: ["bobu"],
};
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const slovo = (w: string) => new RegExp(`(?<![\\p{L}])${esc(w)}(?![\\p{L}])`, "u");

/** Indexy sloupců zmíněných v textu, v pořadí výskytu. */
function zminene(header: string[], text: string): number[] {
  const nalez: { i: number; pos: number }[] = [];
  header.forEach((h, i) => {
    const tvary = [...(h.length > 2 ? [h] : []), ...(TVARY[h] ?? [])];
    let best = -1;
    for (const t of tvary) {
      const m = slovo(t).exec(text);
      if (m && (best < 0 || m.index < best)) best = m.index;
    }
    if (best >= 0) nalez.push({ i, pos: best });
  });
  return nalez.sort((a, b) => a.pos - b.pos).map((x) => x.i);
}
const sloupecMoznosti = (header: string[], o: string): number =>
  header.findIndex((h) => h === o || (TVARY[h] ?? []).includes(o));

type Reseni =
  | { kind: "num"; v: number; mezi: number[] }
  | { kind: "col"; i: number }
  | { kind: "group"; label: string; v: number };

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const plne = (r: { vals: (number | null)[] }) => r.vals as number[];

function solve(question: string): Reseni {
  const { header, rows, ask } = parse(question);
  const r0 = rows[0];
  if (ask.startsWith("Přečti z tabulky")) {
    const c = zminene(header, ask);
    expect(c.length, ask).toBe(1);
    return { kind: "num", v: plne(r0)[c[0]], mezi: [] };
  }
  if (ask.startsWith("Najdi v tabulce")) {
    const v = plne(r0);
    if (/nejvíce|nejvyšší/.test(ask)) {
      const mx = Math.max(...v);
      expect(v.filter((x) => x === mx).length, `maximum není jednoznačné: ${question}`).toBe(1);
      return { kind: "col", i: v.indexOf(mx) };
    }
    if (/nejméně|nejnižší/.test(ask)) {
      const mn = Math.min(...v);
      expect(v.filter((x) => x === mn).length, `minimum není jednoznačné: ${question}`).toBe(1);
      return { kind: "col", i: v.indexOf(mn) };
    }
    expect(ask, question).toMatch(/než \d/);
    const N = setiny(posledniCislo(ask)!)!;
    return { kind: "num", v: v.filter((x) => x > N).length * 100, mezi: [] };
  }
  if (ask.startsWith("Vypočítej z tabulky")) {
    if (/celkem za všechny/.test(ask)) {
      const r = rows.length === 1 ? r0 : rows.find((x) => slovo(x.label).test(ask))!;
      expect(r, ask).toBeDefined();
      const s = sum(plne(r));
      return { kind: "num", v: s, mezi: [] };
    }
    if (/ až /.test(ask)) {
      const [a, b] = zminene(header, ask);
      expect(b, ask).toBeGreaterThan(a);
      return { kind: "num", v: sum(plne(r0).slice(a, b + 1)), mezi: [] };
    }
    if (/o kolik/.test(ask)) {
      const [a, b] = zminene(header, ask);
      const v = plne(r0);
      expect(v[a], ask).toBeGreaterThan(v[b]);
      return { kind: "num", v: v[a] - v[b], mezi: [] };
    }
    if (/z obou/.test(ask)) {
      const c = zminene(header, ask);
      expect(c.length, ask).toBe(1);
      return { kind: "num", v: sum(rows.map((r) => plne(r)[c[0]])), mezi: [] };
    }
    if (/ nebo /.test(ask)) {
      const GEN: Record<string, string> = { chlapci: "chlapců", dívky: "dívek" };
      const r = rows.find((x) => slovo(GEN[x.label] ?? x.label).test(ask))!;
      expect(r, ask).toBeDefined();
      const c = zminene(header, ask);
      expect(c.length, ask).toBe(2);
      return { kind: "num", v: plne(r)[c[0]] + plne(r)[c[1]], mezi: [] };
    }
  }
  if (/^(Urči|Zjisti)|Zjisti, jaké číslo/.test(ask)) {
    const chybi = r0.vals.findIndex((x) => x === null);
    if (chybi >= 0) {
      const X = setiny(ask.match(CISLO)![0])!;
      const n = r0.vals.length;
      const zname = sum(r0.vals.filter((x): x is number => x !== null));
      const v = n * X - zname;
      // dosazení zpět: průměr doplněné tabulky = zadaný průměr
      expect((zname + v) % n, question).toBe(0);
      expect((zname + v) / n, question).toBe(X);
      return { kind: "num", v, mezi: [n * X, zname] };
    }
    if (/o kolik se liš/.test(ask)) {
      const v = plne(r0);
      const mx = Math.max(...v), mn = Math.min(...v);
      expect(v.filter((x) => x === mx).length, question).toBe(1);
      expect(v.filter((x) => x === mn).length, question).toBe(1);
      return { kind: "num", v: mx - mn, mezi: [] };
    }
    if (/průměr/.test(ask) && rows.length === 2) {
      const n = header.length;
      const [s0, s1] = rows.map((r) => sum(plne(r)));
      expect(s0 % n, question).toBe(0);
      expect(s1 % n, question).toBe(0);
      expect(s0, question).not.toBe(s1);
      const w = s0 > s1 ? 0 : 1;
      return { kind: "group", label: rows[w].label, v: Math.abs(s0 - s1) / n };
    }
    if (/průměr/.test(ask)) {
      const v = plne(r0);
      const s = sum(v);
      expect(s % v.length, `průměr nevychází na setiny: ${question}`).toBe(0);
      return { kind: "num", v: s / v.length, mezi: [s] };
    }
  }
  throw new Error(`neznámá šablona: ${question}`);
}

/** Setiny → český zápis (vlastní formátovač, ne cis()). */
function zapis(h: number): string {
  const w = Math.floor(h / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const f = String(h % 100).padStart(2, "0").replace(/0+$/, "");
  return f ? `${w},${f}` : w;
}
const zapis2 = (h: number): string => `${Math.floor(h / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${String(h % 100).padStart(2, "0")}`;
const obsahuje = (text: string, c: string) => new RegExp(`(?<![\\d,])${esc(c)}(?!\\d|,\\d|\\.[A-Z])`).test(text);

function vzorky(level: number, n = 240): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < n) out.push(...topic.generator(level));
  return out;
}

describe("Tabulky a diagramy — metadata", () => {
  it("matematika g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-mat-tabulky-a-diagramy-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Závislosti, vztahy a práce s daty");
    expect(topic.topic).toBe("Práce s daty");
    expect(topic.studentTitle).toBe("Tabulky a data");
    expect(topic.rvpNodeId).toBe("g6-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-sber-a-trideni-dat-tabulky-diagramy");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Tabulky a diagramy — L%i", (level) => {
  const tasks = vzorky(level);

  it("klíč = nezávislý solver, právě jedna správná možnost ze čtyř", () => {
    for (const t of tasks) {
      const o = t.options!;
      expect(o.length, t.question).toBe(4);
      expect(new Set(o).size, t.question).toBe(4);
      expect(o).toContain(t.correctAnswer);
      const r = solve(t.question);
      const { header } = parse(t.question);
      if (r.kind === "col") {
        expect(sloupecMoznosti(header, t.correctAnswer), `${t.question} → ${t.correctAnswer}`).toBe(r.i);
        expect(o.filter((x) => sloupecMoznosti(header, x) === r.i).length, t.question).toBe(1);
        for (const x of o) expect(sloupecMoznosti(header, x), `možnost mimo záhlaví: ${x}`).toBeGreaterThanOrEqual(0);
      } else if (r.kind === "group") {
        const hodnota = (x: string) => ({ g: x.split(" o ")[0], v: setiny(posledniCislo(x)!) });
        const k = hodnota(t.correctAnswer);
        expect(k, `${t.question} → ${t.correctAnswer}`).toEqual({ g: r.label, v: r.v });
        expect(o.filter((x) => { const h = hodnota(x); return h.g === r.label && h.v === r.v; }).length).toBe(1);
        const labels = parse(t.question).rows.map((x) => x.label);
        for (const x of o) expect(labels, x).toContain(hodnota(x).g);
      } else {
        expect(setiny(posledniCislo(t.correctAnswer)!), `${t.question} → ${t.correctAnswer}`).toBe(r.v);
        expect(o.filter((x) => setiny(posledniCislo(x)!) === r.v).length, t.question).toBe(1);
      }
    }
  });

  it("výsledky: nejvýš 2 desetinná místa, nic záporného, jednotka všude stejná", () => {
    for (const t of tasks) {
      const cisla = t.options!.map(posledniCislo);
      if (cisla.every((c) => c === null)) continue; // možnosti = položky záhlaví
      expect(cisla.every((c) => c !== null), t.question).toBe(true);
      for (const o of t.options!) {
        expect(o, t.question).not.toMatch(/[−-]\s?\d/);
        expect(mist(posledniCislo(o)!), o).toBeLessThanOrEqual(2);
      }
      const jednotky = t.options!.map((o) => o.slice(o.lastIndexOf(posledniCislo(o)!) + posledniCislo(o)!.length));
      expect(new Set(jednotky).size, `${t.question}\n${t.options}`).toBe(1);
    }
  });

  it("každá otázka má tabulku; optionFeedback u všech distraktorů; rada s čárkou jen u desetinné tabulky", () => {
    for (const t of tasks) {
      expect(t.question, t.question).toContain("|");
      const { tableText } = parse(t.question);
      for (const d of t.options!.filter((x) => x !== t.correctAnswer)) {
        const fb = t.optionFeedback?.[d];
        expect(fb, `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
        if (/čárka byla pod čárkou/.test(fb!)) {
          expect(tableText.split("\n").slice(1).join(" "), `rada o čárce bez desetinného čísla: ${t.question}`).toMatch(/\d,\d/);
        }
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("nápovědy: dvě, různé, bez klíče a bez mezisoučtu; vysvětlení i postup", () => {
    for (const t of tasks) {
      const h = t.hints ?? [];
      expect(h.length, t.question).toBe(2);
      expect(h[0]).not.toBe(h[1]);
      const r = solve(t.question);
      const zakazane: string[] = [];
      if (r.kind === "num") {
        zakazane.push(zapis(r.v), ...r.mezi.map(zapis), ...r.mezi.map(zapis2));
      }
      for (const x of h) {
        expect(x.includes(t.correctAnswer), `leak v nápovědě: ${t.question}`).toBe(false);
        for (const z of zakazane) expect(obsahuje(x, z), `nápověda obsahuje ${z}: ${t.question}\n${x}`).toBe(false);
        expect(x, t.question).not.toMatch(/Čísla ze zadání/);
      }
      const { ask } = parse(t.question);
      const jadroKlice = posledniCislo(t.correctAnswer);
      if (jadroKlice) expect(obsahuje(ask, jadroKlice), `klíč ve znění otázky: ${t.question}`).toBe(false);
      else expect(ask.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("≥ 12 různých úloh v jednom běhu", () => {
    expect(new Set(topic.generator(level).map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("klíč není systematicky výrazně nejdelší možnost", () => {
    let klic = 0;
    for (const t of tasks) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0].length >= 1.25 * s[1].length && s[0] === t.correctAnswer) klic++;
    }
    expect(klic / tasks.length).toBeLessThan(0.35);
  });

  if (level >= 2) {
    it("klíč není systematicky největší ani nejmenší možnost", () => {
      let nejvetsi = 0, nejmensi = 0, ciselne = 0;
      for (const t of tasks) {
        if (!t.options!.every((o) => posledniCislo(o))) continue;
        ciselne++;
        const k = setiny(posledniCislo(t.correctAnswer)!)!;
        const jine = t.options!.filter((o) => o !== t.correctAnswer).map((o) => setiny(posledniCislo(o)!)!);
        if (jine.every((x) => k > x)) nejvetsi++;
        if (jine.every((x) => k < x)) nejmensi++;
      }
      expect(ciselne).toBeGreaterThan(0);
      expect(nejvetsi / ciselne).toBeLessThan(0.6);
      expect(nejmensi / ciselne).toBeLessThan(0.6);
    });
  }

  if (level === 3) {
    it("L3: stejný počet desetinných míst ve všech možnostech, klíč nekončí jako jediný 0 nebo 5", () => {
      for (const t of tasks) {
        const mista = t.options!.map((o) => mist(posledniCislo(o)!));
        expect(new Set(mista).size, `${t.question}\n${t.options}`).toBe(1);
        const k05 = /[05]$/.test(posledniCislo(t.correctAnswer)!);
        const jine05 = t.options!.filter((o) => o !== t.correctAnswer).some((o) => /[05]$/.test(posledniCislo(o)!));
        expect(k05 && !jine05, `klíč jediný končí 0/5: ${t.options}`).toBe(false);
      }
    });
  }
});

describe("Tabulky a diagramy — gradace", () => {
  const ask = (t: PracticeTask) => parse(t.question).ask;

  it("L1 a L3 mají disjunktní zadání i slovesa; L2 začíná „Vypočítej z tabulky“", () => {
    const l1 = vzorky(1);
    const l2 = vzorky(2);
    const l3 = vzorky(3);
    const q1 = new Set(l1.map((t) => t.question));
    expect(l3.filter((t) => q1.has(t.question))).toEqual([]);
    expect(l1.every((t) => /^(Přečti z tabulky|Najdi v tabulce)/.test(ask(t)))).toBe(true);
    expect(l2.every((t) => /^Vypočítej z tabulky/.test(ask(t)))).toBe(true);
    expect(l3.every((t) => /^(Urči|Zjisti)|Zjisti, jaké číslo/.test(ask(t)))).toBe(true);
    expect([...l2, ...l3].some((t) => /Přečti|Najdi/.test(ask(t)))).toBe(false);
  });

  it("L1 jen přirozená čísla do 100 a jeden řádek s 5–6 sloupci", () => {
    for (const t of vzorky(1)) {
      const { header, rows } = parse(t.question);
      expect(rows.length).toBe(1);
      expect(header.length).toBeGreaterThanOrEqual(5);
      expect(header.length).toBeLessThanOrEqual(6);
      for (const v of plne(rows[0])) {
        expect(v % 100, t.question).toBe(0);
        expect(v, t.question).toBeLessThanOrEqual(10000);
      }
    }
  });

  it("šablony se střídají rovnoměrně a kontexty jsou aspoň čtyři na úroveň", () => {
    const sablona = (t: PracticeTask): string => {
      const a = ask(t);
      const { rows } = parse(t.question);
      if (a.startsWith("Přečti")) return "hodnota";
      if (/nejvíce|nejvyšší|nejméně|nejnižší/.test(a) && a.startsWith("Najdi")) return "extrem";
      if (a.startsWith("Najdi")) return "prah";
      if (/ až /.test(a)) return "rozsah";
      if (/celkem za všechny/.test(a)) return "celkem";
      if (/o kolik/.test(a) && a.startsWith("Vypočítej")) return "rozdil";
      if (/ nebo |z obou/.test(a)) return "trideni";
      if (rows[0].vals.includes(null)) return "inverze";
      if (/liš/.test(a)) return "rozpeti";
      if (rows.length === 2) return "skupiny";
      return "prumer";
    };
    for (const [level, pocet] of [[1, 3], [2, 4], [3, 4]] as const) {
      const ulohy = topic.generator(level);
      const hist = new Map<string, number>();
      for (const t of ulohy) hist.set(sablona(t), (hist.get(sablona(t)) ?? 0) + 1);
      expect(hist.size, `L${level}: ${[...hist]}`).toBe(pocet);
      for (const c of hist.values()) expect(c, `L${level}: ${[...hist]}`).toBeGreaterThanOrEqual(Math.floor(ulohy.length / pocet) - 2);
      const kontexty = new Set(vzorky(level, 120).map((t) => t.question.split("\n")[0]));
      expect(kontexty.size, `L${level}`).toBeGreaterThanOrEqual(4);
    }
  });
});
