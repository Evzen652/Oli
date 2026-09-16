import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { TROJUHELNIKY_UHLY_VYSKA_TEZNICE_6 } from "../matematika/trojuhelnikyUhlyVyskaTeznice";

/**
 * Trojúhelníky — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver nečte parametry generátoru: úhly a délky vytáhne regulárním výrazem
 * ze ZNĚNÍ otázky, šablonu pozná podle klíčových slov a klíč spočítá vlastní
 * cestou (vlastní formátování úhlu, vlastní klasifikace, vlastní vyhodnocení
 * výroků). Generátor klíč nikdy nedodává.
 */
const topic = TROJUHELNIKY_UHLY_VYSKA_TEZNICE_6[0];
const PLNY = 10800;

// ── parsování ──────────────────────────────────────────────────────────────
function uhlyZTextu(s: string): number[] {
  return [...s.matchAll(/(\d+)°(?:\s(\d+)′)?/g)].map((m) => Number(m[1]) * 60 + Number(m[2] ?? 0));
}
function delkyZTextu(s: string): number[] {
  return [...s.matchAll(/(\d+(?:,\d+)?) cm/g)].map((m) => Number(m[1].replace(",", ".")));
}
function fmt(min: number): string {
  const deg = (min - (min % 60)) / 60;
  const m = min % 60;
  return m ? `${deg}° ${m}′` : `${deg}°`;
}
function jedenUhel(o: string): number {
  const u = uhlyZTextu(o);
  expect(u, `možnost není jeden úhel: ${o}`).toHaveLength(1);
  return u[0];
}

const KRAT: Record<string, number> = {
  dvakrát: 2, třikrát: 3, čtyřikrát: 4, šestkrát: 6, sedmkrát: 7, osmkrát: 8, desetkrát: 10,
};

type Sablona = "L1u" | "L1s" | "L1p" | "L2obecny" | "L2pravy" | "L2vrchol" | "L2zakladna" | "L3popis" | "L3dilky" | "L3vyrok" | "L3vysky";

function sablona(q: string): Sablona {
  if (q.startsWith("Trojúhelník má úhly")) return "L1u";
  if (q.startsWith("Trojúhelník má mít strany")) return "L1s";
  if (q.startsWith("Jak se nazývá")) return "L1p";
  if (q.startsWith("Rozhodni, jak se nazývá")) return "L3popis";
  if (q.startsWith("Rozhodni, kde leží průsečík")) return "L3vysky";
  if (q.startsWith("Kolik stupňů má")) return "L3dilky";
  if (q.startsWith("Který výrok")) return "L3vyrok";
  if (/pravoúhl/.test(q)) return "L2pravy";
  if (/rovnoramenn/.test(q)) return /při základně\?$/.test(q) ? "L2vrchol" : "L2zakladna";
  if (uhlyZTextu(q).length === 2) return "L2obecny";
  throw new Error(`solver nepoznal šablonu: ${q}`);
}

function druhU(uhly: number[]): string {
  let max = 0;
  for (const u of uhly) if (u > max) max = u;
  if (max < 5400) return "ostroúhlý";
  if (max === 5400) return "pravoúhlý";
  return "tupoúhlý";
}
function druhS(xs: number[]): string {
  const s = [...xs].sort((a, b) => a - b);
  const shod = (s[0] === s[1] ? 1 : 0) + (s[1] === s[2] ? 1 : 0);
  return shod === 2 ? "rovnostranný" : shod === 1 ? "rovnoramenný" : "různostranný";
}

function pojem(q: string): string {
  const vrchol = /vrchol/.test(q);
  if (/středy/.test(q)) return "střední příčka";
  if (!vrchol && (/stejně daleko/.test(q) || (/kolm/.test(q) && /střed/.test(q)))) return "osa strany";
  if (vrchol && /kolm|pravý úhel|vzdálenost/.test(q)) return "výška";
  if (vrchol && /střed/.test(q)) return "těžnice";
  throw new Error(`solver nepoznal pojem: ${q}`);
}

/** Je výrok o zbylých dvou úhlech pravdivý, když jeden úhel měří g? */
function vyrokPlati(o: string, g: number): boolean {
  const zbytek = PLNY - g;
  if (/mají dohromady/.test(o)) return jedenUhel(o) === zbytek;
  if (/jsou oba ostré/.test(o)) return zbytek <= 5400 * 2 && g >= 5400; // oba < 90° právě když g ≥ 90°
  if (/jeden pravý a jeden ostrý/.test(o)) return zbytek > 5400;
  if (/jeden tupý a jeden ostrý/.test(o)) return zbytek > 5400;
  if (/oba pravé/.test(o)) return zbytek === 10800;
  throw new Error(`neznámý výrok: ${o}`);
}

/** Vrátí klíč spočítaný jen ze znění otázky (a u výroků z textu možností). */
function solve(t: PracticeTask): string {
  const q = t.question;
  const u = uhlyZTextu(q);
  switch (sablona(q)) {
    case "L1u": {
      expect(u.reduce((a, b) => a + b, 0), q).toBe(PLNY);
      return druhU(u);
    }
    case "L1s": {
      const s = delkyZTextu(q).sort((a, b) => a - b);
      expect(s, q).toHaveLength(3);
      if (s[0] + s[1] <= s[2]) return "nelze sestrojit";
      return druhS(s);
    }
    case "L1p":
      return pojem(q);
    case "L2obecny":
      return fmt(PLNY - u[0] - u[1]);
    case "L2pravy":
      expect(u, q).toHaveLength(1);
      return fmt(5400 - u[0]);
    case "L2vrchol":
      expect(u, q).toHaveLength(1);
      return fmt((PLNY - u[0]) / 2);
    case "L2zakladna":
      expect(u, q).toHaveLength(1);
      return fmt(PLNY - u[0] - u[0]);
    case "L3popis": {
      const vse = [u[0], u[1], PLNY - u[0] - u[1]];
      return `${druhU(vse)} ${druhS(vse)}`;
    }
    case "L3dilky": {
      const slovo = q.match(/je (\S+krát) větší/)![1];
      const k = KRAT[slovo];
      expect(k, q).toBeTruthy();
      let z: number, v: number;
      if (/jestliže úhel při hlavním vrcholu je/.test(q)) {
        z = PLNY / (k + 2);
        v = k * z;
      } else {
        v = PLNY / (2 * k + 1);
        z = k * v;
      }
      expect(Number.isInteger(z) && Number.isInteger(v), q).toBe(true);
      expect(z + z + v, q).toBe(PLNY);
      return fmt(/^Kolik stupňů má úhel při základně/.test(q) ? z : v);
    }
    case "L3vyrok": {
      const g = u[0];
      const prav = t.options!.filter((o) => vyrokPlati(o, g));
      expect(prav, q).toHaveLength(1);
      return prav[0];
    }
    case "L3vysky": {
      const druh = druhU([u[0], u[1], PLNY - u[0] - u[1]]);
      return druh === "ostroúhlý" ? "uvnitř trojúhelníku" : druh === "pravoúhlý" ? "ve vrcholu pravého úhlu" : "vně trojúhelníku";
    }
  }
}

const NUMERICKE: Sablona[] = ["L2obecny", "L2pravy", "L2vrchol", "L2zakladna", "L3dilky"];

function vzorky(level: number, min = 300): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < min) out.push(...topic.generator(level));
  return out;
}

describe("Trojúhelníky — metadata", () => {
  it("matematika g6, select_one, RVP zařazení", () => {
    expect(topic.id).toBe("g6-mat-trojuhelniky-uhly-vyska-teznice-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.category).toBe("Geometrie v rovině a v prostoru");
    expect(topic.topic).toBe("Trojúhelníky");
    expect(topic.inputType).toBe("select_one");
    expect(topic.studentTitle).toBe("Trojúhelníky: úhly, výška a těžnice");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Trojúhelníky — level %i", (level) => {
  const tasks = vzorky(level);

  it("solver = klíč, klíč v nabídce, 4 různé možnosti, ostatní solver odmítne", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(t.correctAnswer, t.question).toBe(s);
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      const sab = sablona(t.question);
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        if (NUMERICKE.includes(sab)) expect(jedenUhel(o), `${o}: ${t.question}`).not.toBe(jedenUhel(s));
        else if (sab === "L3vyrok") expect(vyrokPlati(o, uhlyZTextu(t.question)[0]), o).toBe(false);
        else expect(o, t.question).not.toBe(s);
      }
    }
  });

  it("každý distraktor má feedback, klíč ne", () => {
    for (const t of tasks) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[o], `chybí feedback „${o}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("≥ 12 různých úloh v jednom běhu generátoru", () => {
    for (let i = 0; i < 10; i++) {
      const qs = new Set(topic.generator(level).map((t) => t.question));
      expect(qs.size).toBeGreaterThanOrEqual(12);
    }
  });

  it("klíč není v zadání ani v nápovědách; dvě různé nápovědy", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(h.includes(t.correctAnswer), `hint leak: ${h}`).toBe(false);
      if (NUMERICKE.includes(sablona(t.question))) {
        const k = jedenUhel(t.correctAnswer);
        for (const h of t.hints!) expect(uhlyZTextu(h), `hint leak (úhel): ${h}`).not.toContain(k);
        expect(uhlyZTextu(t.question), t.question).not.toContain(k);
      }
    }
  });

  it("bez mocnin a zlomků; postup a vysvětlení", () => {
    for (const t of tasks) {
      const texty = [t.question, ...t.options!, ...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/[²³/]/);
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length ?? 0, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("úhly v rozsahu, možnosti stejného tvaru", () => {
    for (const t of tasks) {
      for (const x of uhlyZTextu(t.question)) {
        expect(x, t.question).toBeGreaterThan(0);
        expect(x, t.question).toBeLessThan(PLNY);
      }
      // v postupu je nenormalizovaný mezikrok (115° 75′) záměrně, v nabídce ne
      for (const s of [t.question, ...t.options!]) {
        for (const m of s.matchAll(/(\d+)′/g)) expect(Number(m[1]), s).toBeLessThan(60);
      }
      if (NUMERICKE.includes(sablona(t.question))) {
        expect(jedenUhel(t.correctAnswer)).toBeLessThan(PLNY);
        for (const o of t.options!) {
          expect(o, t.question).toMatch(/^\d+°(?: \d+′)?$/);
          expect(jedenUhel(o), o).toBeLessThan(2 * PLNY);
        }
      }
    }
  });

  it("šablony rovnoměrně (žádná nad 40 %), klíč není systematicky nejdelší", () => {
    const pocty = new Map<Sablona, number>();
    let nejdelsi = 0;
    for (const t of tasks) {
      const s = sablona(t.question);
      pocty.set(s, (pocty.get(s) ?? 0) + 1);
      const delka = t.correctAnswer.length;
      if (t.options!.every((o) => o === t.correctAnswer || o.length < delka)) nejdelsi++;
    }
    const ocekavano = level === 1 ? 3 : 4;
    expect(pocty.size).toBe(ocekavano);
    for (const [s, n] of pocty) expect(n / tasks.length, s).toBeLessThanOrEqual(0.4);
    expect(nejdelsi / tasks.length).toBeLessThan(0.4);
  });
});

describe("Trojúhelníky — gradace a chybový model", () => {
  const l1 = vzorky(1);
  const l2 = vzorky(2);
  const l3 = vzorky(3);
  const uvod = (q: string) => q.split(/[\s,]+/).slice(0, 2).join(" ");

  it("L1 a L3 mají disjunktní úvodní slova i texty; L1 úvody jen v L1", () => {
    const u1 = new Set(l1.map((t) => uvod(t.question)));
    const u3 = new Set(l3.map((t) => uvod(t.question)));
    for (const x of u1) expect(u3.has(x), x).toBe(false);
    const q1 = new Set(l1.map((t) => t.question));
    for (const t of l3) expect(q1.has(t.question)).toBe(false);
    const L1_UVODY = /^(Trojúhelník má|Jak se nazývá)/;
    for (const t of l1) expect(t.question, t.question).toMatch(L1_UVODY);
    for (const t of [...l2, ...l3]) expect(t.question, t.question).not.toMatch(L1_UVODY);
  });

  it("L2 má ≥ 4 kontexty", () => {
    const kontext = (q: string) =>
      /trojúhelníku ABC|trojúhelníku ABC/.test(q) ? "abc"
        : /střechy/.test(q) ? "strecha"
          : /Záhon/.test(q) ? "zahon"
            : /regálu/.test(q) ? "regal"
              : /Šátek/.test(q) ? "satek" : "?";
    const k = new Set(l2.map((t) => kontext(t.question)));
    expect(k.has("?")).toBe(false);
    expect(k.size).toBeGreaterThanOrEqual(4);
  });

  it("L3 (a) a (d) mají víc různých klíčů", () => {
    const popis = new Set(l3.filter((t) => sablona(t.question) === "L3popis").map((t) => t.correctAnswer));
    const vysky = new Set(l3.filter((t) => sablona(t.question) === "L3vysky").map((t) => t.correctAnswer));
    expect(popis.size).toBeGreaterThanOrEqual(5);
    expect(vysky.size).toBe(3);
  });

  it("L1 zpětná vazba nepoužívá pojem průsečík výšek", () => {
    for (const t of l1) {
      for (const f of Object.values(t.optionFeedback ?? {})) expect(f, f).not.toMatch(/průsečík/);
    }
  });

  it("feedback o minutách jen u úloh s přenosem, půjčkou nebo polovinou stupně", () => {
    for (const t of l2) {
      const u = uhlyZTextu(t.question);
      const sab = sablona(t.question);
      const maMinuty = u.some((x) => x % 60 !== 0);
      const polovina = sab === "L2vrchol" && ((PLNY - u[0]) / 2) % 60 !== 0;
      const prenos = u.reduce((a, x) => a + (x % 60), 0) * (sab === "L2zakladna" ? 2 : 1) >= 60;
      for (const f of Object.values(t.optionFeedback ?? {})) {
        if (/setinami|ne 50′/.test(f)) expect(maMinuty || polovina, `${t.question} → ${f}`).toBe(true);
        if (/1° má jen 60′, takže/.test(f)) expect(prenos, `${t.question} → ${f}`).toBe(true);
      }
    }
  });

  it("distraktor „minuty po stovkách“ se objevuje (u L2 aspoň občas)", () => {
    const n = l2.filter((t) => Object.values(t.optionFeedback ?? {}).some((f) => /setinami|ne 50′/.test(f))).length;
    expect(n).toBeGreaterThan(0);
  });

  it("L1 strany: rovnostranný nikdy není klíčem vedle rovnoramenného", () => {
    for (const t of l1.filter((x) => sablona(x.question) === "L1s")) {
      expect(t.correctAnswer).not.toBe("rovnostranný");
    }
  });
});
