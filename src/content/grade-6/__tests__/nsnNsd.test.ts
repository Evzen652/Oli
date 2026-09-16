import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { NSN_NSD_6 } from "../matematika/nsnNsd";

/**
 * NSN a NSD — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver nečte parametry generátoru: čísla vytáhne regulárním výrazem ze
 * znění otázky a veličinu (n / D / inverze) určí podle klíčových slov.
 * Počítá jinou cestou než generátor (ten používá rozklad): D Eukleidovým
 * algoritmem, n jako a·b / D.
 */
const topic = NSN_NSD_6[0];

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** Čísla ze zadání (mezera v tisících se respektuje, pořadové „4.“ se čte jako 4). */
function cislaZTextu(q: string): number[] {
  return (q.match(/\d{1,3}(?: \d{3})*/g) ?? []).map((z) => Number(z.replace(/ /g, "")));
}

function hodnota(o: string): number {
  const m = o.match(/\d{1,3}(?: \d{3})*/);
  if (!m) throw new Error(`možnost bez čísla: ${o}`);
  return Number(m[0].replace(/ /g, ""));
}

type Druh = "D" | "n" | "inv";

function druh(q: string): Druh {
  if (/druhé číslo/.test(q)) return "inv";
  if (/dělitel|co nejvíce stejných|největší délku/.test(q)) return "D";
  if (/násobek|nejdříve|nejmenší možn/.test(q)) return "n";
  throw new Error(`solver nepoznal veličinu: ${q}`);
}

function solve(q: string): number {
  const d = druh(q);
  if (d === "inv") {
    const n = Number(q.match(/násobek\D*?(\d{1,3}(?: \d{3})*)/)![1].replace(/ /g, ""));
    const D = Number(q.match(/dělitel\D*?(\d{1,3}(?: \d{3})*)/)![1].replace(/ /g, ""));
    const a = Number(q.match(/Jedno z (?:čísel|nich) je (\d{1,3}(?: \d{3})*)/)![1].replace(/ /g, ""));
    const b = (n * D) / a;
    expect(Number.isInteger(b), q).toBe(true);
    expect(gcd(a, b), `inverze nesedí (D): ${q}`).toBe(D);
    expect(lcm(a, b), `inverze nesedí (n): ${q}`).toBe(n);
    return b;
  }
  const c = cislaZTextu(q);
  expect(c.length, `čekám 2–3 čísla: ${q}`).toBeGreaterThanOrEqual(2);
  expect(c.length, `čekám 2–3 čísla: ${q}`).toBeLessThanOrEqual(3);
  return d === "D" ? c.reduce(gcd) : c.reduce(lcm);
}

function vzorky(level: number, min = 300): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < min) out.push(...topic.generator(level));
  return out;
}

function exponentyVyssi(x: number): boolean {
  for (let p = 2; p * p <= x; p++) if (x % (p * p) === 0) return true;
  return false;
}

describe("NSN a NSD — metadata", () => {
  it("matematika g6, select_one, RVP zařazení", () => {
    expect(topic.id).toBe("g6-mat-nsn-nsd-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.category).toBe("Číslo a proměnná");
    expect(topic.topic).toBe("Dělitelnost přirozených čísel");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("NSN a NSD — level %i", (level) => {
  const tasks = vzorky(level);

  it("(1)(2) klíč = solver, 4 různé možnosti, právě jedna správná", () => {
    for (const t of tasks) {
      const s = solve(t.question);
      expect(hodnota(t.correctAnswer), t.question).toBe(s);
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => hodnota(o) === s), t.question).toHaveLength(1);
      expect(t.options, t.question).toContain(t.correctAnswer);
    }
  });

  it("(3) distraktory ≠ klíč, klíč není v zadání, každý distraktor má feedback", () => {
    for (const t of tasks) {
      const k = hodnota(t.correctAnswer);
      expect(cislaZTextu(t.question), t.question).not.toContain(k);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(hodnota(d), t.question).not.toBe(k);
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("(4) ≥ 12 různých úloh v jednom běhu generátoru", () => {
    const qs = new Set(topic.generator(level).map((t) => t.question));
    expect(qs.size).toBeGreaterThanOrEqual(12);
  });

  it("(6) nápovědy neprozrazují klíč a jsou dvě různé", () => {
    for (const t of tasks) {
      const k = hodnota(t.correctAnswer);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(cislaZTextu(h), `hint leak: ${h}`).not.toContain(k);
    }
  });

  it("(7) jen select_one s možnostmi, s postupem a vysvětlením", () => {
    for (const t of tasks) {
      expect(Array.isArray(t.options), t.question).toBe(true);
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length ?? 0, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("(8) čísla nad 999 mají mezeru v tisících", () => {
    for (const t of tasks) {
      for (const s of [t.question, ...t.options!, ...(t.solutionSteps ?? []), t.explanation ?? ""]) {
        expect(s, s).not.toMatch(/\d{4,}/);
      }
    }
  });
});

describe("NSN a NSD — opravy z ověření", () => {
  const vse = [1, 2, 3].map((l) => ({ l, tasks: vzorky(l) }));

  it("malá nápověda vypíše VŠECHNA čísla ze zadání", () => {
    for (const { tasks } of vse) {
      for (const t of tasks) {
        const m = t.hints![0].match(/Čísla ze zadání: (.*)\.$/);
        expect(m, t.hints![0]).toBeTruthy();
        const vHintu = cislaZTextu(m![1]).sort((a, b) => a - b);
        const vZadani = [...new Set(cislaZTextu(t.question))].sort((a, b) => a - b);
        expect(vHintu, t.question).toEqual(vZadani);
      }
    }
  });

  it("žádné mocniny (RVP 8. ročník) v textech pro žáka", () => {
    for (const { tasks } of vse) {
      for (const t of tasks) {
        const texty = [...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
        for (const s of texty) expect(s, s).not.toMatch(/mocnin|[²³⁴⁵⁶⁷⁸]/);
      }
    }
    for (const s of [...topic.helpTemplate!.steps, topic.helpTemplate!.example]) expect(s).not.toMatch(/mocnin|[²³⁴⁵⁶⁷⁸]/);
  });

  it("L1 zpětná vazba nemluví o rozkladu", () => {
    for (const t of vse[0].tasks) {
      for (const f of Object.values(t.optionFeedback ?? {})) expect(f, f).not.toMatch(/rozklad|prvočin|prvočísl/);
    }
  });

  it("„Vynechal jsi prvočíslo p“ jen když p v distraktoru opravdu chybí", () => {
    for (const { tasks } of vse) {
      for (const t of tasks) {
        for (const [o, f] of Object.entries(t.optionFeedback ?? {})) {
          const m = f.match(/Vynechal jsi prvočíslo (\d+)/);
          if (m) expect(hodnota(o) % Number(m[1]), `${o}: ${f}`).not.toBe(0);
        }
      }
    }
  });

  it("zkouška v inverzi mluví pravdu", () => {
    for (const t of vse[2].tasks.filter((x) => druh(x.question) === "inv")) {
      for (const [o, f] of Object.entries(t.optionFeedback ?? {})) {
        const m = f.match(/(dělitel|násobek) čísel (\d+) a (\d+) je (\d+)/);
        expect(m, f).toBeTruthy();
        const [x, y, r] = [Number(m![2]), Number(m![3]), Number(m![4])];
        expect(y, o).toBe(hodnota(o));
        expect(m![1] === "dělitel" ? gcd(x, y) : lcm(x, y), f).toBe(r);
      }
    }
  });

  it("v jednom sezení se neopakuje stejná dvojice čísel; L1 střídá D a n", () => {
    for (const l of [1, 2, 3]) {
      for (let i = 0; i < 20; i++) {
        const tasks = topic.generator(l);
        const klice = tasks.map((t) => {
          const c = druh(t.question) === "inv" ? [cislaZTextu(t.question)[2], hodnota(t.correctAnswer)] : cislaZTextu(t.question);
          return [...c].sort((a, b) => a - b).join(",");
        });
        expect(new Set(klice).size, klice.join(" | ")).toBe(klice.length);
        if (l === 1) {
          const prvni6 = tasks.slice(0, 6).map((t) => druh(t.question));
          expect(prvni6.filter((d) => d === "D")).toHaveLength(3);
        }
      }
    }
  });

  it("L3 balíčky a míry mají větší číslo aspoň 30", () => {
    for (const t of vse[2].tasks.filter((x) => druh(x.question) === "D")) {
      expect(Math.max(...cislaZTextu(t.question)), t.question).toBeGreaterThanOrEqual(30);
    }
  });
});

describe("NSN a NSD — gradace", () => {
  it("(5) L1 začíná „Urči“, L3 je slovní úloha bez „Urči“ a „rozklad“, množiny disjunktní", () => {
    const l1 = vzorky(1).map((t) => t.question);
    const l3 = vzorky(3).map((t) => t.question);
    expect(l1.every((q) => q.startsWith("Urči"))).toBe(true);
    expect(l3.every((q) => !/Urči|rozklad/i.test(q))).toBe(true);
    expect(l1.filter((q) => l3.includes(q))).toHaveLength(0);
  });

  it("L1 čísla 4–30, L2 potřebuje rozklad (n > 100 nebo vyšší mocnina)", () => {
    for (const t of vzorky(1)) {
      for (const c of cislaZTextu(t.question)) {
        expect(c).toBeGreaterThanOrEqual(4);
        expect(c).toBeLessThanOrEqual(30);
      }
    }
    for (const t of vzorky(2)) {
      expect(/^(Pomocí rozkladu|Jaký je .* trojice čísel)/.test(t.question), t.question).toBe(true);
      const c = cislaZTextu(t.question);
      const n = c.reduce(lcm);
      expect(n > 100 || c.some(exponentyVyssi), t.question).toBe(true);
    }
  });

  it("L3 obsahuje úlohy na n, na D i inverzi", () => {
    const druhy = new Set(vzorky(3).map((t) => druh(t.question)));
    expect([...druhy].sort()).toEqual(["D", "inv", "n"]);
  });
});
