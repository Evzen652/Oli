import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { POCETNI_OPERACE_DESETINNA_KOMPLEXNE } from "../matematika/pocetniOperaceDesetinnaKomplexne";

/**
 * Početní operace s desetinnými čísly — NEZÁVISLÝ SOLVER.
 *
 * Solver čte jen text otázky. Výrazy vyhodnotí vlastním shunting-yard
 * algoritmem v přesných zlomcích (BigInt), slovní úlohy podle klíčového slova
 * jinou cestou než generátor (součet položek, zkouška, cena za jednotku
 * každého balení zvlášť). Parametry generátoru nepoužívá.
 */
const topic = POCETNI_OPERACE_DESETINNA_KOMPLEXNE[0];

// ── Přesná racionální aritmetika ──────────────────────────────────────────
type Q = { n: bigint; d: bigint };
const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));
function q(n: bigint, d = 1n): Q {
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}
const add = (a: Q, b: Q) => q(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Q, b: Q) => q(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
const div = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);
const eq = (a: Q, b: Q) => a.n === b.n && a.d === b.d;
const abs = (a: Q) => q(a.n < 0n ? -a.n : a.n, a.d);
const pos = (a: Q) => a.n > 0n;

/** „1 234,56“ → přesný zlomek. */
function parseCislo(s: string): Q {
  const t = s.replace(/\s/g, "");
  const [cele, des = ""] = t.split(",");
  return q(BigInt(cele + des), 10n ** BigInt(des.length));
}
const CISLO_RE = /\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
const cislaZTextu = (t: string) => (t.match(CISLO_RE) ?? []).map(parseCislo);
/** Možnost → [hodnota, jednotka]. */
function parseMoznost(o: string): [Q, string] {
  const m = o.match(/^([\d ]+(?:,\d+)?)\s*(Kč|m|l)?$/);
  if (!m) throw new Error(`nečitelná možnost: ${o}`);
  return [parseCislo(m[1]), m[2] ?? ""];
}

// ── Výrazy: tokenizace + shunting-yard ────────────────────────────────────
type Tok = { t: "num"; v: Q } | { t: "op"; v: string } | { t: "(" } | { t: ")" };
function tokenize(expr: string): Tok[] {
  const out: Tok[] = [];
  const re = /\s*(\d+(?:,\d+)?|[+−·:()])/gy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < expr.length && (m = re.exec(expr))) {
    const x = m[1];
    if (/\d/.test(x)) out.push({ t: "num", v: parseCislo(x) });
    else if (x === "(") out.push({ t: "(" });
    else if (x === ")") out.push({ t: ")" });
    else out.push({ t: "op", v: x });
  }
  return out;
}
const PREC: Record<string, number> = { "+": 1, "−": 1, "·": 2, ":": 2 };
function aplikuj(op: string, a: Q, b: Q): Q {
  if (op === "+") return add(a, b);
  if (op === "−") return sub(a, b);
  if (op === "·") return mul(a, b);
  return div(a, b);
}
function evalPrednost(toks: Tok[]): Q {
  const vals: Q[] = [];
  const ops: string[] = [];
  const redukuj = () => {
    const op = ops.pop()!;
    const b = vals.pop()!, a = vals.pop()!;
    vals.push(aplikuj(op, a, b));
  };
  for (const tk of toks) {
    if (tk.t === "num") vals.push(tk.v);
    else if (tk.t === "(") ops.push("(");
    else if (tk.t === ")") {
      while (ops[ops.length - 1] !== "(") redukuj();
      ops.pop();
    } else {
      while (ops.length && ops[ops.length - 1] !== "(" && PREC[ops[ops.length - 1]] >= PREC[tk.v]) redukuj();
      ops.push(tk.v);
    }
  }
  while (ops.length) redukuj();
  return vals[0];
}
/** Chyba „zleva doprava“: bez závorek čistě zleva, se závorkami jako by nebyly. */
function evalChybne(toks: Tok[]): Q {
  const bez = toks.filter((t) => t.t !== "(" && t.t !== ")");
  if (bez.length !== toks.length) return evalPrednost(bez);
  let acc = (bez[0] as { v: Q }).v;
  for (let i = 1; i < bez.length; i += 2) acc = aplikuj((bez[i] as { v: string }).v, acc, (bez[i + 1] as { v: Q }).v);
  return acc;
}

// ── Slovní úlohy ──────────────────────────────────────────────────────────
interface Reseni { klic: Q; chyby: Q[]; mezi: Q[]; zkouska?: (x: Q) => boolean }
function resSlovni(text: string): Reseni {
  const c = cislaZTextu(text);
  if (/vrátili\?/.test(text)) {
    const [B, m, u, pol] = c;
    // útrata po položkách, pak odečet od bankovky
    let utrata = q(0n);
    for (const polozka of [mul(m, u), pol]) utrata = add(utrata, polozka);
    return { klic: sub(B, utrata), chyby: [utrata, sub(B, mul(m, u))], mezi: [utrata] };
  }
  if (/dopravné/.test(text)) {
    const [n, T, D, E] = c;
    return {
      klic: div(sub(sub(T, D), E), n),
      chyby: [], mezi: [sub(sub(T, D), E)],
      zkouska: (x) => eq(add(add(mul(x, n), D), E), T),
    };
  }
  if (/levnější/.test(text)) {
    const [m1, p1, m2, p2] = c;
    const u1 = div(p1, m1), u2 = div(p2, m2);
    return { klic: sub(u1, u2), chyby: [], mezi: [abs(sub(p1, p2)), u1, u2] };
  }
  if (/jeden díl\?|jedné lahvi\?/.test(text)) {
    const [L, k, s, n] = c;
    const odebrano = mul(k, s);
    return {
      klic: div(sub(L, odebrano), n),
      chyby: [], mezi: [sub(L, odebrano)],
      zkouska: (x) => eq(add(mul(x, n), odebrano), L),
    };
  }
  if (/celkem\?/.test(text)) {
    const [n, p, pol] = c;
    let suma = q(0n);
    for (let i = 0n; i < n.n; i++) suma = add(suma, p);
    return { klic: add(suma, pol), chyby: [], mezi: [suma, add(p, pol)] };
  }
  throw new Error(`neznámý typ slovní úlohy: ${text}`);
}

function vyres(t: PracticeTask): { klic: Q; mezi: Q[]; zkouska?: (x: Q) => boolean; vyraz: boolean } {
  if (t.question.startsWith("Vypočítej výraz")) {
    const expr = t.question.slice(t.question.indexOf(":") + 1);
    const toks = tokenize(expr);
    return { klic: evalPrednost(toks), mezi: [evalChybne(toks)], vyraz: true };
  }
  const r = resSlovni(t.question);
  return { klic: r.klic, mezi: r.mezi, zkouska: r.zkouska, vyraz: false };
}

/** Počet desetinných míst zlomku (Infinity = nekonečný rozvoj nebo víc než 6). */
const desMist = (x: Q) => {
  for (let k = 0; k <= 6; k++) if ((10n ** BigInt(k)) % x.d === 0n) return k;
  return Infinity;
};
const cisloKlice = (s: string) => s.replace(/\s*(Kč|m|l)$/, "");
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const obsahuje = (text: string, num: string) => new RegExp(`(?<![\\d,])${esc(num)}(?!\\d|,\\d)`).test(text);

describe("Početní operace s desetinnými čísly — metadata", () => {
  it("je matematika 6. ročníku se select_one a přesným RVP zápisem", () => {
    expect(topic.subject).toBe("matematika");
    expect(topic.id).toBe("g6-mat-pocetni-operace-desetinna-komplexne-6");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.rvpNodeId).toBe("g6-matematika-cislo-a-promenna-desetinna-cisla-pocetni-operace-s-desetinnymi-cisly-komplexne");
    expect(topic.category).toBe("Číslo a proměnná");
    expect(topic.topic).toBe("Desetinná čísla");
    expect(topic.studentTitle).toBe("Počítáme s desetinnými čísly");
  });
});

const POOLS: Record<number, PracticeTask[]> = {
  1: topic.generator(1),
  2: topic.generator(2),
  3: topic.generator(3),
};

describe.each([1, 2, 3])("Úroveň %i — nezávislý solver", (level) => {
  const tasks = POOLS[level];

  it("≥ 12 různých úloh", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("šablona odpovídá úrovni", () => {
    for (const t of tasks) {
      if (level === 1) expect(t.question).toMatch(/^Vypočítej výraz bez závorek: /);
      if (level === 2) expect(t.question).toMatch(/^(Vypočítej výraz se závorkami: |Vypočítej výraz se třemi operacemi: |Slovní úloha: )/);
      if (level === 3) expect(t.question).toMatch(/^Slovní úloha o více krocích: /);
    }
  });

  it("klíč = solver, 4 různé možnosti, klíč právě jednou, kladný, ≤ 2 des. místa, stejná jednotka", () => {
    for (const t of tasks) {
      const r = vyres(t);
      const [klic, jednotka] = parseMoznost(t.correctAnswer);
      expect(eq(klic, r.klic), `${t.question} → solver ${r.klic.n}/${r.klic.d}, klíč ${t.correctAnswer}`).toBe(true);
      expect(pos(klic), t.question).toBe(true);
      expect(desMist(klic), t.question).toBeLessThanOrEqual(2);
      expect(t.options).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      const hodnoty = t.options!.map(parseMoznost);
      for (const [hodnota, j] of hodnoty) {
        expect(j, `jednotka: ${t.question}`).toBe(jednotka);
        expect(pos(hodnota), `nekladná možnost: ${t.question}`).toBe(true);
      }
      // právě jedna možnost je správná (u zkoušky i přes zkoušku)
      expect(hodnoty.filter(([x]) => eq(x, r.klic))).toHaveLength(1);
      if (r.zkouska) expect(hodnoty.filter(([x]) => r.zkouska!(x)), t.question).toHaveLength(1);
    }
  });

  it("aspoň jeden distraktor = chyba zleva doprava / mezivýsledek (přepočítáno solverem)", () => {
    for (const t of tasks) {
      const r = vyres(t);
      const distr = t.options!.filter((o) => o !== t.correctAnswer).map((o) => parseMoznost(o)[0]);
      expect(distr.some((d) => r.mezi.some((m) => eq(d, m))), t.question).toBe(true);
    }
  });

  it("chybový model: feedback pro každý distraktor, ne pro klíč", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("klíč není v otázce ani v nápovědách; nápovědy jsou dvě a různé", () => {
    for (const t of tasks) {
      const k = cisloKlice(t.correctAnswer);
      expect(obsahuje(t.question, k), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const hint of t.hints!) {
        expect(obsahuje(hint, k), `hint leak: ${hint}`).toBe(false);
        expect(hint.includes(t.correctAnswer), `hint leak (podřetězec): ${hint}`).toBe(false);
      }
      expect(t.explanation).toBeTruthy();
      expect(t.solutionSteps!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("nápovědy se liší mezi úlohami (jsou konkrétní)", () => {
    const h0 = new Set(tasks.map((t) => t.hints![0]));
    const h1 = new Set(tasks.map((t) => t.hints![1]));
    expect(h0.size).toBeGreaterThanOrEqual(Math.min(12, tasks.length));
    expect(h1.size).toBeGreaterThanOrEqual(Math.min(12, tasks.length));
  });

  it("žádné rodové lomítko ani nevyplněná šablona", () => {
    for (const t of tasks) {
      const vse = [t.question, ...t.hints!, t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})].join(" ");
      expect(vse).not.toMatch(/\/a\b|\(a\)|undefined|NaN|\$\{/);
    }
  });
});

describe("Gradace", () => {
  it("L1 a L3 mají disjunktní zadání, L3 má aspoň 3 čísla ze zadání a 3 kroky", () => {
    const l1 = new Set(POOLS[1].map((t) => t.question));
    for (const t of POOLS[3]) {
      expect(l1.has(t.question)).toBe(false);
      expect(cislaZTextu(t.question).length).toBeGreaterThanOrEqual(3);
      expect(t.solutionSteps!.length).toBe(3);
    }
  });

  it("každá úloha má aspoň dvě operace", () => {
    for (const t of [...POOLS[1], ...POOLS[2]].filter((x) => x.question.startsWith("Vypočítej"))) {
      const ops = tokenize(t.question.slice(t.question.indexOf(":") + 1)).filter((x) => x.t === "op");
      expect(ops.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });
});
