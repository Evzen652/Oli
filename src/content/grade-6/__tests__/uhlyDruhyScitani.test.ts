import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { UHLY_DRUHY_SCITANI_TOPICS } from "../matematika/uhlyDruhyScitani";

/**
 * Úhly: druhy, sčítání a odčítání — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver nečte parametry generátoru. Všechny úhly vytáhne regulárním výrazem
 * ze znění otázky a převede je na celé MINUTY; operaci určí podle klíčových
 * slov. Generátor počítá po složkách s přenosem a výpůjčkou, solver na celých
 * číslech. Výsledek formátuje vlastní funkcí a porovná s klíčem.
 */
const topic = UHLY_DRUHY_SCITANI_TOPICS[0];
const PRAVY = 5400;
const PRIMY = 10800;

/** Všechny úhly ze znění v minutách, v pořadí výskytu. */
function uhlyZTextu(q: string): number[] {
  const re = /(\d+)°(?:\s(\d+)′)?|(\d+)′/g;
  const out: number[] = [];
  for (const m of q.matchAll(re)) {
    if (m[3] !== undefined) out.push(Number(m[3]));
    else out.push(Number(m[1]) * 60 + Number(m[2] ?? 0));
  }
  return out;
}

function zapis(m: number): string {
  const d = Math.floor(m / 60), r = m % 60;
  if (d === 0) return `${r}′`;
  if (r === 0) return `${d}°`;
  return `${d}° ${r}′`;
}

function druh(m: number): string {
  if (m < PRAVY) return "ostrý";
  if (m === PRAVY) return "pravý";
  if (m < PRIMY) return "tupý";
  return "přímý";
}

type Sablona =
  | "L1-druh" | "L1-prevod" | "L1-soucet"
  | "L2-soucet" | "L2-rozdil" | "L2-pravy" | "L2-primy"
  | "L3-druh" | "L3-treti" | "L3-okolik" | "L3-inverze";

function sablona(q: string): Sablona {
  if (/^Jaký je to úhel/.test(q)) return "L1-druh";
  if (/^(Kolik minut|Zapiš úhel)/.test(q)) return "L1-prevod";
  if (/^Sečti úhly/.test(q)) return "L1-soucet";
  if (/^Vypočítej součet/.test(q)) return "L2-soucet";
  if (/^Vypočítej rozdíl/.test(q)) return "L2-rozdil";
  if (/^Kolik stupňů a minut chybí.*do pravého/.test(q)) return "L2-pravy";
  if (/^Kolik stupňů a minut chybí.*do přímého/.test(q)) return "L2-primy";
  if (/^Úhel α/.test(q)) return "L3-druh";
  if (/^Přímý úhel (je rozdělený|rozdělíme)/.test(q)) return "L3-treti";
  if (/^Pravý úhel zvětšíme/.test(q)) return "L3-okolik";
  if (/^Který úhel/.test(q)) return "L3-inverze";
  throw new Error(`neznámá šablona: ${q}`);
}

function solve(q: string): string {
  const a = uhlyZTextu(q);
  const soucet = a.reduce((x, y) => x + y, 0);
  if (/Jaký je to úhel/.test(q)) return druh(a[0]);
  if (/Jaký úhel vznikne/.test(q)) return druh(a[0] + a[1]);
  if (/Kolik minut/.test(q)) return `${a[0]}′`;
  if (/Zapiš úhel/.test(q)) return zapis(a[0]);
  if (/Sečti|součet/.test(q)) return zapis(a[0] + a[1]);
  if (/musíš přičíst/.test(q)) return zapis(a[1] - a[0]);
  if (/Pravý úhel zvětšíme/.test(q)) return zapis(a[1] - PRAVY - a[0]);
  if (/do pravého/.test(q)) return zapis(PRAVY - a[0]);
  if (/přím/i.test(q)) return zapis(PRIMY - soucet);
  if (/rozdíl|o kolik/i.test(q)) return zapis(a[0] - a[1]);
  throw new Error(`solver nepoznal operaci: ${q}`);
}

/** Minuty možnosti (bez tisícové mezery), nebo null, když má jen stupně / je to slovo. */
function minutyMoznosti(o: string): number | null {
  const m = o.replace(/ (?=\d{3})/g, "").match(/^(\d+)° (\d+)′$/);
  return m ? Number(m[2]) : null;
}

function vzorky(level: number, min = 300): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < min) out.push(...topic.generator(level));
  return out;
}

describe("Úhly — metadata", () => {
  it("matematika g6, select_one, RVP zařazení", () => {
    expect(topic.id).toBe("g6-mat-uhly-druhy-scitani-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.category).toBe("Geometrie v rovině a v prostoru");
    expect(topic.topic).toBe("Úhel");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Úhly — level %i", (level) => {
  const tasks = vzorky(level);

  it("solver: klíč = nezávislý výpočet ze znění", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(solve(t.question));
  });

  it("(1) ≥ 12 unikátních otázek v jednom běhu", () => {
    const qs = new Set(topic.generator(level).map((t) => t.question));
    expect(qs.size).toBeGreaterThanOrEqual(12);
  });

  it("(2)(3) 4 různé možnosti, klíč právě jednou, žádný distraktor = solver", () => {
    for (const t of tasks) {
      const s = solve(t.question);
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      expect(t.options!.filter((o) => o === s), t.question).toHaveLength(1);
    }
  });

  it("(4) minuty 0–59; nepřevedené minuty jen na L1/L2", () => {
    for (const t of tasks) {
      for (const o of t.options!) {
        const m = minutyMoznosti(o);
        if (m === null) continue;
        if (o === t.correctAnswer || level === 3) expect(m, `${o}: ${t.question}`).toBeLessThanOrEqual(59);
        else expect(m, `${o}: ${t.question}`).toBeLessThan(100);
      }
    }
  });

  it("(5)(6) klíč není ve znění ani v nápovědách; nápovědy dvě různé", () => {
    for (const t of tasks) {
      const k = t.correctAnswer;
      const bezCislice = new RegExp(`(?<!\\d)${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      expect(bezCislice.test(t.question), t.question).toBe(false);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(h.includes(k), `hint leak „${k}“: ${h}`).toBe(false);
    }
  });

  it("(9) optionFeedback pro každý distraktor, postup a vysvětlení", () => {
    for (const t of tasks) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[o], `chybí feedback „${o}“: ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length ?? 0, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("(10) každá šablona v 60 vzorcích aspoň z 20 %", () => {
    const sablony = new Map<Sablona, number>();
    const vz = vzorky(level, 60).slice(0, 60);
    for (const t of vz) sablony.set(sablona(t.question), (sablony.get(sablona(t.question)) ?? 0) + 1);
    const pocet = level === 1 ? 3 : 4;
    expect(sablony.size, [...sablony.keys()].join(",")).toBe(pocet);
    for (const [s, n] of sablony) {
      expect(s.startsWith(`L${level}`), s).toBe(true);
      expect(n, s).toBeGreaterThanOrEqual(12);
    }
  });

  it("výsledky kladné a nejvýš 180°, zadané úhly nejvýš 180°", () => {
    for (const t of tasks) {
      for (const x of uhlyZTextu(t.question)) expect(x, t.question).toBeLessThanOrEqual(PRIMY);
      const k = t.correctAnswer;
      if (/[°′]/.test(k)) {
        const [v] = uhlyZTextu(k.replace(/ (?=\d{3})/g, ""));
        expect(v, t.question).toBeGreaterThan(0);
        expect(v, t.question).toBeLessThanOrEqual(PRIMY);
      }
    }
  });
});

describe("Úhly — gradace a chybový model", () => {
  it("(7) otázky L1 a L3 jsou disjunktní", () => {
    const l1 = new Set(vzorky(1).map((t) => t.question));
    const l3 = vzorky(3).map((t) => t.question);
    expect(l3.filter((q) => l1.has(q))).toHaveLength(0);
  });

  it("L2 vždy převádí přes 60 (přenos nebo výpůjčka)", () => {
    for (const t of vzorky(2)) {
      const a = uhlyZTextu(t.question);
      const s = sablona(t.question);
      if (s === "L2-soucet") expect((a[0] % 60) + (a[1] % 60), t.question).toBeGreaterThan(60);
      else if (s === "L2-rozdil") expect(a[0] % 60, t.question).toBeLessThan(a[1] % 60);
      else expect(a[0] % 60, t.question).toBeGreaterThan(0);
    }
  });

  it("L1 součet je bez převodu minut", () => {
    for (const t of vzorky(1).filter((x) => sablona(x.question) === "L1-soucet")) {
      const a = uhlyZTextu(t.question);
      expect((a[0] % 60) + (a[1] % 60), t.question).toBeLessThan(60);
    }
  });

  it("(8) L3 druh součtu: do ±2° od hranice, převod minut nutný, chyba 60↔100 mění druh", () => {
    const l3 = vzorky(3, 600).filter((t) => sablona(t.question) === "L3-druh");
    expect(l3.length).toBeGreaterThan(50);
    const klice = new Set<string>();
    for (const t of l3) {
      const [a, b] = uhlyZTextu(t.question);
      const s = a + b;
      klice.add(t.correctAnswer);
      expect(Math.min(Math.abs(s - PRAVY), Math.abs(s - PRIMY)), t.question).toBeLessThanOrEqual(120);
      const M = (a % 60) + (b % 60);
      expect(M, t.question).toBeGreaterThanOrEqual(60);
      // bez převodu žák vidí jen součet stupňů a „něco navíc“
      const D = Math.floor(a / 60) + Math.floor(b / 60);
      const spatne = druh(D * 60 + 1);
      if (s >= PRAVY) {
        expect(spatne, t.question).not.toBe(t.correctAnswer);
        expect(t.optionFeedback?.[spatne], t.question).toMatch(/Pozor na převod/);
      }
      // věta o převodu jen u distraktoru, který chybu opravdu představuje
      for (const [o, f] of Object.entries(t.optionFeedback ?? {})) {
        if (/Pozor na převod/.test(f)) expect(o, t.question).toBe(spatne);
      }
    }
    expect([...klice].sort()).toEqual(["ostrý", "pravý", "přímý", "tupý"]);
  });

  it("L1 druh: pokrývá hranice 90° a 180° i všechny čtyři druhy", () => {
    const l1 = vzorky(1, 600).filter((t) => sablona(t.question) === "L1-druh");
    const velikosti = new Set(l1.map((t) => uhlyZTextu(t.question)[0]));
    expect(velikosti.has(PRAVY)).toBe(true);
    expect(velikosti.has(PRIMY)).toBe(true);
    expect(new Set(l1.map((t) => t.correctAnswer)).size).toBe(4);
  });

  it("feedback o setinách jen u možnosti, která vznikla počítáním po 100", () => {
    for (const level of [1, 2, 3]) {
      for (const t of vzorky(level)) {
        const a = uhlyZTextu(t.question);
        for (const [o, f] of Object.entries(t.optionFeedback ?? {})) {
          if (!/setiny/.test(f)) continue;
          const s = sablona(t.question);
          if (s === "L1-prevod" && /Kolik minut/.test(t.question)) {
            expect(Number(o.replace(/[ ′]/g, "")), t.question).toBe((a[0] / 60) * 100);
          } else if (s === "L2-soucet") {
            // přenos po 100: minuty = součet minut − 100
            expect(minutyMoznosti(o) ?? 0, t.question).toBe((a[0] % 60) + (a[1] % 60) - 100);
          }
        }
      }
    }
  });

  it("text pro žáka nemá inline „číslo + minut/stupňů“ se špatným tvarem", () => {
    for (const level of [1, 2, 3]) {
      for (const t of vzorky(level)) {
        const texty = [t.question, ...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
        for (const s of texty) {
          expect(s, s).not.toMatch(/(?<![\d ])[234] (minut|stupňů)\b/);
          expect(s, s).not.toMatch(/\b1 (minut|minuty|stupňů)\b/);
          expect(s, s).not.toMatch(/\d{4,}/);
        }
      }
    }
  });
});
