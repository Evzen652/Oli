import { describe, it, expect } from "vitest";
import { NASOBENI_A_DELENI_DESETINNYCH_CISEL } from "../matematika/nasobeniADeleniDesetinnychCisel";
import type { PracticeTask } from "@/lib/types";

/**
 * Násobení a dělení desetinných čísel — NEZÁVISLÝ SOLVER.
 *
 * Solver nepoužívá nic z generátoru: čísla PARSUJE ze znění otázky (česká
 * čárka → zlomek), operaci určí podle šablony a klíčových slov a počítá
 * v celočíselné aritmetice přes zlomky (BigInt). Porovnává se hodnota,
 * ne řetězec, takže se test obejde bez chyb plovoucí čárky.
 */
const topic = NASOBENI_A_DELENI_DESETINNYCH_CISEL[0];

// ── Zlomková aritmetika ────────────────────────────────────────────────────
type Q = { p: bigint; q: bigint };
const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));
const norm = (p: bigint, q: bigint): Q => {
  const g = gcd(p, q) || 1n;
  return { p: p / g, q: q / g };
};
const mul = (a: Q, b: Q): Q => norm(a.p * b.p, a.q * b.q);
const div = (a: Q, b: Q): Q => norm(a.p * b.q, a.q * b.p);
const eq = (a: Q, b: Q): boolean => a.p * b.q === b.p * a.q;
const gt = (a: Q, b: Q): boolean => a.p * b.q > b.p * a.q;

/** „1 050,25“ → 105025/100. */
function parse(s: string): Q {
  const t = s.replace(/\s/g, "");
  const [w, f = ""] = t.split(",");
  return norm(BigInt(w + f), 10n ** BigInt(f.length));
}
const CISLO = /\d{1,3}(?: \d{3})*(?:,\d+)?/g;
const cisla = (s: string): Q[] => (s.match(CISLO) ?? []).map(parse);

/** Má hodnota nejvýš 2 desetinná místa (jmenovatel dělí 100)? */
const cista = (x: Q): boolean => 100n % x.q === 0n;

/** Hodnota výrazu „A · B“ nebo „A : B“. */
function vyraz(s: string): Q {
  const m = s.match(/^(.+?) ([·:]) (.+)$/);
  if (!m) throw new Error(`nečitelný výraz: ${s}`);
  const a = parse(m[1]), b = parse(m[3]);
  return m[2] === "·" ? mul(a, b) : div(a, b);
}

type Reseni =
  | { kind: "value"; value: Q }
  | { kind: "places"; count: number }
  | { kind: "equivalent"; value: Q }
  | { kind: "compare"; bound: Q; bigger: boolean };

function solve(question: string): Reseni {
  let m: RegExpMatchArray | null;
  if ((m = question.match(/^Kolik desetinných míst má součin (.+) · (.+)\?$/))) {
    // Druhá cesta: skutečně vynásobí a spočítá místa zapsaného výsledku.
    const v = mul(parse(m[1]), parse(m[2]));
    // nejmenší k, pro které je v · 10^k celé číslo
    let count = 0;
    while ((v.p * 10n ** BigInt(count)) % v.q !== 0n) {
      count++;
      expect(count, `nekonečný desetinný rozvoj: ${question}`).toBeLessThan(10);
    }
    return { kind: "places", count };
  }
  if ((m = question.match(/^Kolik je (.+ [·:] .+)\?$/))) return { kind: "value", value: vyraz(m[1]) };
  if ((m = question.match(/^Vypočítej (součin|podíl) (.+ [·:] .+)\.$/))) {
    expect(m[2].includes(m[1] === "součin" ? "·" : ":"), question).toBe(true);
    return { kind: "value", value: vyraz(m[2]) };
  }
  if ((m = question.match(/^Kolik vyjde \((.+)\) ([·:]) (.+)\?$/))) {
    const vnitrek = vyraz(m[1]);
    const c = parse(m[3]);
    return { kind: "value", value: m[2] === "·" ? mul(vnitrek, c) : div(vnitrek, c) };
  }
  if ((m = question.match(/místo otazníku[^:]*: (.+) : (.+) = (.+) : (.+)\.$/))) {
    // „A : B = ? : D“ → ? = (A : B) · D;  „A : B = C : ?“ → ? = C : (A : B)
    const podilVlevo = div(parse(m[1]), parse(m[2]));
    if (m[3] === "?") return { kind: "value", value: mul(podilVlevo, parse(m[4])) };
    expect(m[4], question).toBe("?");
    return { kind: "value", value: div(parse(m[3]), podilVlevo) };
  }
  if ((m = question.match(/výsledek (větší|menší) než (\d+)\?/))) {
    return { kind: "compare", bound: parse(m[2]), bigger: m[1] === "větší" };
  }
  const n = cisla(question);
  if (/Kolik stojí 1 kg\?/.test(question)) {
    // „X kg … za Y Kč“ → cena 1 kg = Y : X
    return { kind: "value", value: div(n[1], n[0]) };
  }
  if (/Kilogram stojí/.test(question)) {
    // „X kg … Kilogram stojí Y Kč“ → X · Y
    return { kind: "value", value: mul(n[0], n[1]) };
  }
  if (/na kusy po/.test(question)) {
    // „měří L m … na kusy po K m“ → L : K
    return { kind: "value", value: div(n[0], n[1]) };
  }
  throw new Error(`neznámá šablona: ${question}`);
}

/** Hodnota možnosti (číslo, případně s „Kč“). */
const hodnotaMoznosti = (o: string): Q => parse(o.replace(/\s*Kč$/, ""));
const mista = (o: string): number => Number(o.match(/^\d+/)![0]);

function vzorky(level: number, n = 200): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < n) out.push(...topic.generator(level));
  return out;
}

describe("Násobení a dělení desetinných čísel — metadata", () => {
  it("matematika g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-mat-nasobeni-a-deleni-desetinnych-cisel-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Číslo a proměnná");
    expect(topic.topic).toBe("Desetinná čísla");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Násobení a dělení desetinných čísel — L%i", (level) => {
  const tasks = vzorky(level);

  it("klíč = nezávislý solver, právě jedna správná možnost ze čtyř", () => {
    for (const t of tasks) {
      const o = t.options!;
      expect(o.length, t.question).toBe(4);
      expect(new Set(o).size, t.question).toBe(4);
      expect(o).toContain(t.correctAnswer);
      const r = solve(t.question);
      if (r.kind === "value") {
        expect(eq(hodnotaMoznosti(t.correctAnswer), r.value), `${t.question} → ${t.correctAnswer}`).toBe(true);
        expect(cista(r.value), `klíč má víc než 2 desetinná místa nebo periodu: ${t.question}`).toBe(true);
        expect(o.filter((x) => eq(hodnotaMoznosti(x), r.value)).length, t.question).toBe(1);
      } else if (r.kind === "places") {
        expect(mista(t.correctAnswer), t.question).toBe(r.count);
        expect(o.filter((x) => mista(x) === r.count).length, t.question).toBe(1);
      } else if (r.kind === "equivalent") {
        const shodne = o.filter((x) => eq(vyraz(x), r.value));
        expect(shodne, t.question).toEqual([t.correctAnswer]);
        // dělitel klíče je přirozené číslo
        expect(t.correctAnswer.split(" : ")[1], t.question).toMatch(/^\d+$/);
        expect(cista(r.value), t.question).toBe(true);
      } else {
        const splnuje = o.filter((x) => (r.bigger ? gt(vyraz(x), r.bound) : gt(r.bound, vyraz(x))));
        expect(splnuje, t.question).toEqual([t.correctAnswer]);
        for (const x of o) expect(cista(vyraz(x)), `perioda v ${x}`).toBe(true);
      }
    }
  });

  it("dělení v zadání vychází beze zbytku na nejvýš 2 desetinná místa", () => {
    for (const t of tasks) {
      for (const n of cisla(t.question)) expect(cista(n), t.question).toBe(true);
    }
  });

  it("každý distraktor má optionFeedback, klíč ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("jednotka je ve všech možnostech stejná", () => {
    for (const t of tasks) {
      const kc = t.options!.map((x) => x.endsWith(" Kč"));
      expect(new Set(kc).size, t.question).toBe(1);
      const mistaTvar = t.options!.map((x) => /míst/.test(x));
      expect(new Set(mistaTvar).size, t.question).toBe(1);
    }
  });

  it("nápovědy: dvě, různé, bez klíče; klíč není v zadání; je vysvětlení i postup", () => {
    const klicVTextu = (text: string, klic: string) =>
      klic.length >= 3
        ? text.includes(klic)
        : new RegExp(`(?<![\\d,])${klic}(?![\\d]|,\\d)`).test(text);
    for (const t of tasks) {
      const h = t.hints ?? [];
      expect(h.length, t.question).toBe(2);
      expect(h[0]).not.toBe(h[1]);
      // výčet „0,9, 3,25“ plete desetinnou čárku s oddělovačem seznamu
      for (const x of h) expect(x, t.question).not.toMatch(/Čísla ze zadání/);
      for (const x of h) expect(klicVTextu(x, t.correctAnswer), `leak v nápovědě: ${t.question}`).toBe(false);
      expect(klicVTextu(t.question, t.correctAnswer), `klíč v zadání: ${t.question}`).toBe(false);
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
});

describe("Násobení a dělení desetinných čísel — gradace", () => {
  it("L1 a L3 mají disjunktní zadání, L2 začíná „Vypočítej“", () => {
    const l1 = new Set(vzorky(1).map((t) => t.question));
    const l2 = vzorky(2).map((t) => t.question);
    const l3 = new Set(vzorky(3).map((t) => t.question));
    expect([...l3].filter((q) => l1.has(q))).toEqual([]);
    expect([...l1].every((q) => /^Kolik (je|desetinných míst)/.test(q))).toBe(true);
    expect(l2.every((q) => /^Vypočítej (součin|podíl)/.test(q))).toBe(true);
    expect([...l3].some((q) => /^Vypočítej|^Kolik je /.test(q))).toBe(false);
  });

  it("L1 nemá desetinného dělitele, L2 ano", () => {
    for (const t of vzorky(1)) {
      const m = t.question.match(/ : (.+)\?$/);
      if (m) expect(m[1], t.question).toMatch(/^\d$/);
    }
    expect(vzorky(2).some((t) => / : \d+,\d+\.$/.test(t.question))).toBe(true);
  });

  it("L3 pokrývá všechny šablony (slovní úloha, ekvivalence, odhad, dva kroky)", () => {
    const l3 = vzorky(3, 400).map((t) => t.question);
    expect(l3.some((q) => /Kolik stojí 1 kg|Kilogram stojí/.test(q))).toBe(true);
    expect(l3.some((q) => /na kusy po/.test(q))).toBe(true);
    expect(l3.some((q) => /místo otazníku.*= \? :/.test(q))).toBe(true);
    expect(l3.some((q) => /místo otazníku.*: \?\.$/.test(q))).toBe(true);
    expect(l3.some((q) => /větší než|menší než/.test(q))).toBe(true);
    expect(l3.some((q) => /^Kolik vyjde \(/.test(q))).toBe(true);
  });
});
