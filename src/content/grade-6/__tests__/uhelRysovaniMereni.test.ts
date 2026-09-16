import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { UHEL_RYSOVANI_MERENI } from "../matematika/uhelRysovaniMereni";

/**
 * Úhel — rýsování a měření — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver nečte parametry generátoru: úhly vytáhne regulárním výrazem ze
 * znění otázky (čísla se značkou °), šablonu pozná podle klíčových slov
 * a klíč spočítá jinou cestou:
 *  • stupnice = simulace úhloměru jako pole rysek (vnější x ↔ vnitřní 180 − x),
 *  • vrcholový úhel = „vedlejší k vedlejšímu“,
 *  • inverzní úlohy L3 = hrubá síla přes x = 1…179,
 *  • dvě odměření = průběžný součet.
 */
const topic = UHEL_RYSOVANI_MERENI[0];

const stupne = (s: string): number[] => (s.match(/\d+(?=°)/g) ?? []).map(Number);
const hodnota = (o: string): number => {
  const m = o.match(/^(\d+)°$/);
  if (!m) throw new Error(`možnost není úhel: ${o}`);
  return Number(m[1]);
};
const vedlejsi = (x: number): number => 180 - x;

interface Ryska { vnejsi: number; vnitrni: number }
/** Úhloměr: ryska i je na vnější stupnici i, na vnitřní 180 − i. */
const UHLOMER: Ryska[] = Array.from({ length: 181 }, (_, i) => ({ vnejsi: i, vnitrni: 180 - i }));

const SLOVA_KRAT: Record<string, number> = {
  dvakrát: 2, třikrát: 3, pětkrát: 5, osmkrát: 8, jedenáctkrát: 11,
};

type Druh =
  | "stupnice" | "druh" | "rys-stred" | "rys-natoc"
  | "vedlejsi" | "vrcholovy" | "nasobek" | "polovina" | "rysky"
  | "rozdil" | "pomer" | "soucet" | "pres" | "dve" | "zpet";

function druh(q: string): Druh {
  if (/Součet/.test(q)) return "soucet";
  if (/větší než přímý/.test(q)) return "pres";
  if (/odměříš.*dál/.test(q)) return "dve";
  if (/odměříš \d+° zpět/.test(q)) return "zpet";
  if (/o \d+° větší než druhý/.test(q)) return "rozdil";
  if (/krát větší než druhý/.test(q)) return "pomer";
  if (/vnější|vnitřní/.test(q)) return "stupnice";
  if (/je (ostrý|tupý)\./.test(q)) return "druh";
  if (/Kam přiložíš střed/.test(q)) return "rys-stred";
  if (/natočíš/.test(q)) return "rys-natoc";
  if (/ryskou \d+° a rameno \w+ ryskou \d+°/.test(q)) return "rysky";
  if (/(dvakrát|třikrát) větší/.test(q)) return "nasobek";
  if (/polovin/.test(q)) return "polovina";
  if (/vrcholový/.test(q)) return "vrcholovy";
  if (/vedlejší/.test(q)) return "vedlejsi";
  throw new Error(`solver nepoznal šablonu: ${q}`);
}

/** Klíč jako text (úhel „40°“ nebo postup rýsování). */
function solve(q: string): string {
  const d = druh(q);
  const s = stupne(q);
  switch (d) {
    case "stupnice": {
      const vn = Number(q.match(/vnější(?: stupnice)? (\d+)°/)![1]);
      const vi = Number(q.match(/vnitřní(?: stupnice)? (\d+)°/)![1]);
      const nula = q.match(/na nule (vnější|vnitřní) stupnice/)![1] === "vnější" ? "vnejsi" : "vnitrni";
      const r2 = UHLOMER.find((r) => r.vnejsi === vn && r.vnitrni === vi);
      expect(r2, `rysky nesedí: ${q}`).toBeTruthy();
      const r1 = UHLOMER.find((r) => r[nula] === 0)!;
      return `${Math.abs(r2![nula] - r1[nula])}°`;
    }
    case "druh": {
      const [x, y] = s;
      const ostry = /je ostrý\./.test(q);
      const k = [x, y].find((v) => (ostry ? v > 0 && v < 90 : v > 90 && v < 180));
      return `${k}°`;
    }
    case "rys-stred": {
      const name = q.match(/úhel ([A-Z]{3})/)![1];
      return `do vrcholu ${name[1]}`;
    }
    case "rys-natoc": {
      const name = q.match(/úhel ([A-Z]{3})/)![1];
      return `rameno ${name[1]}${name[0]} na rysku 0`;
    }
    case "vedlejsi":
      return `${vedlejsi(s[0])}°`;
    case "vrcholovy": {
      const beta = vedlejsi(s[0]);
      return `${vedlejsi(vedlejsi(beta))}°`;
    }
    case "nasobek": {
      const k = /dvakrát/.test(q) ? 2 : 3;
      let sum = 0;
      for (let i = 0; i < k; i++) sum += s[0];
      return `${sum}°`;
    }
    case "polovina": {
      for (let x = 1; x < 180; x++) if (x + x === s[0]) return `${x}°`;
      throw new Error(q);
    }
    case "rysky": {
      const m = q.match(/ryskou (\d+)° a rameno \w+ ryskou (\d+)°/)!;
      return `${Math.abs(Number(m[2]) - Number(m[1]))}°`;
    }
    case "rozdil": {
      const dd = s[0];
      for (let x = 1; x < 180; x++) if (x - vedlejsi(x) === dd) return `${x}°`;
      throw new Error(q);
    }
    case "pomer": {
      const k = SLOVA_KRAT[q.match(/(\S+krát) větší/)![1]];
      for (let x = 1; x < 180; x++) if (x === k * vedlejsi(x)) return `${x}°`;
      throw new Error(q);
    }
    case "soucet": {
      for (let x = 1; x < 180; x++) if (2 * x === s[0]) return `${vedlejsi(x)}°`;
      throw new Error(q);
    }
    case "pres": {
      const m = Number(q.match(/naměříš\D*?(\d+)°/)![1]);
      return `${360 - m}°`;
    }
    case "dve": {
      let sum = 0;
      for (const x of s) sum += x;
      return `${180 - sum}°`;
    }
    case "zpet": {
      // průběžná poloha ramene: +a (od ramene), pak −b (zpět)
      const [a, b] = s;
      const poloha = [0, a, a - b];
      return `${vedlejsi(Math.abs(poloha[2] - poloha[0]))}°`;
    }
  }
}

function vzorky(level: number, min = 400): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < min) out.push(...topic.generator(level));
  return out;
}

const TEXTOVE: Druh[] = ["rys-stred", "rys-natoc"];

describe("Úhel — metadata", () => {
  it("matematika g6, select_one, RVP zařazení", () => {
    expect(topic.id).toBe("g6-mat-uhel-rysovani-mereni-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.category).toBe("Geometrie v rovině a v prostoru");
    expect(topic.topic).toBe("Úhel");
    expect(topic.inputType).toBe("select_one");
    expect(topic.studentTitle).toBe("Měříme a rýsujeme úhly");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Úhel — level %i", (level) => {
  const tasks = vzorky(level);

  it("klíč = solver, je mezi možnostmi právě jednou, 4 různé možnosti", () => {
    for (const t of tasks) {
      const k = solve(t.question);
      expect(t.correctAnswer, t.question).toBe(k);
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === k), t.question).toHaveLength(1);
      if (!TEXTOVE.includes(druh(t.question))) {
        for (const o of t.options!) expect(o, t.question).toMatch(/^\d+°$/);
        expect(t.options!.filter((o) => hodnota(o) === hodnota(k)), t.question).toHaveLength(1);
      }
    }
  });

  it("úloha s α = 90° nevzniká", () => {
    for (const t of tasks) {
      expect(stupne(t.question), t.question).not.toContain(90);
    }
  });

  it("klíč nestojí v zadání (mimo L1 čtení stupnice, kde jsou obě čísla úmyslně)", () => {
    for (const t of tasks) {
      const d = druh(t.question);
      if (d === "stupnice" || d === "druh" || TEXTOVE.includes(d)) continue;
      expect(stupne(t.question), t.question).not.toContain(hodnota(t.correctAnswer));
    }
  });

  it("každý distraktor má feedback; 90 − α jen pro α < 90", () => {
    for (const t of tasks) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        const f = t.optionFeedback?.[o];
        expect(f, `chybí feedback „${o}“: ${t.question}`).toBeTruthy();
        if (/doplněk do pravého úhlu/.test(f!)) {
          const alfa = stupne(t.question)[0];
          expect(alfa, t.question).toBeLessThan(90);
          expect(hodnota(o), t.question).toBe(90 - alfa);
        }
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

  it("šablony se střídají rovnoměrně v prvních osmi úlohách", () => {
    for (let i = 0; i < 10; i++) {
      const prvni = topic.generator(level).slice(0, 8).map((t) => {
        const d = druh(t.question);
        if (d === "stupnice") return /nule vnější/.test(t.question) ? "stupnice-vnejsi" : "stupnice-vnitrni";
        return d.startsWith("rys-") ? "rys" : d === "polovina" ? "nasobek" : d;
      });
      const pocty = new Map<string, number>();
      for (const g of prvni) pocty.set(g, (pocty.get(g) ?? 0) + 1);
      expect(Math.max(...pocty.values()), prvni.join(",")).toBeLessThanOrEqual(3);
    }
  });

  it("klíč není ve většině úloh největší ani nejmenší možnost", () => {
    const ciselne = tasks.filter((t) => !TEXTOVE.includes(druh(t.question)));
    const max = ciselne.filter((t) => hodnota(t.correctAnswer) === Math.max(...t.options!.map(hodnota))).length;
    const min = ciselne.filter((t) => hodnota(t.correctAnswer) === Math.min(...t.options!.map(hodnota))).length;
    expect(max / ciselne.length).toBeLessThan(0.5);
    if (level === 3) expect(min / ciselne.length).toBeLessThan(0.5);
  });

  it("nápovědy: dvě různé, neobsahují klíč", () => {
    for (const t of tasks) {
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${h}`).toBe(false);
        if (!TEXTOVE.includes(druh(t.question))) {
          expect(stupne(h), h).not.toContain(hodnota(t.correctAnswer));
        }
      }
    }
  });

  it("postup a vysvětlení existují; čísla bez desetinné tečky", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length ?? 0, t.question).toBeGreaterThanOrEqual(2);
      for (const s of [t.question, ...t.options!, ...(t.solutionSteps ?? []), t.explanation ?? "", ...t.hints!]) {
        expect(s, s).not.toMatch(/\d\.\d/);
        expect(s, s).not.toMatch(/NaN|undefined|Infinity/);
        expect(s, s).not.toMatch(/[²³]/);
      }
    }
  });
});

describe("Úhel — gradace a slovník", () => {
  it("L3 má všechny možnosti násobky 5", () => {
    for (const t of vzorky(3)) {
      for (const o of t.options!) expect(hodnota(o) % 5, t.question).toBe(0);
    }
  });

  it("L1 a L3 mají disjunktní znění; L3 nepoužívá vnější/vnitřní ani „kam přiložíš“", () => {
    const l1 = new Set(vzorky(1).map((t) => t.question));
    const l3 = vzorky(3).map((t) => t.question);
    expect(l3.filter((q) => l1.has(q))).toHaveLength(0);
    for (const q of l3) expect(q, q).not.toMatch(/vnější|vnitřní|Kam přiložíš/);
  });

  it("L1 nepoužívá pojmy vedlejší ani vrcholový", () => {
    for (const t of vzorky(1)) {
      const texty = [t.question, ...t.options!, ...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/vedlejší|vrcholov/);
    }
  });

  it("každá úroveň obsahuje všechny své šablony", () => {
    const ocek: Record<number, Druh[][]> = {
      1: [["stupnice"], ["druh"], ["rys-stred", "rys-natoc"]],
      2: [["vedlejsi"], ["vrcholovy"], ["nasobek", "polovina"], ["rysky"]],
      3: [["rozdil"], ["pomer"], ["soucet"], ["pres"], ["dve"], ["zpet"]],
    };
    for (const l of [1, 2, 3]) {
      const druhy = new Set(vzorky(l).map((t) => druh(t.question)));
      for (const skupina of ocek[l]) {
        for (const d of skupina) expect(druhy.has(d), `L${l} chybí ${d}`).toBe(true);
      }
    }
  });

  it("L3: v jednom sezení se šablona neopakuje", () => {
    const n = topic.sessionTaskCount ?? 6;
    for (let i = 0; i < 20; i++) {
      const druhy = topic.generator(3).slice(0, n).map((t) => druh(t.question));
      expect(new Set(druhy).size, druhy.join(",")).toBe(n);
    }
  });

  it("žádná nápověda nevypisuje „Čísla ze zadání“; L1 bez „sousední popsané rysky“", () => {
    for (const l of [1, 2, 3]) {
      for (const t of vzorky(l, 100)) {
        for (const h of t.hints!) expect(h, h).not.toMatch(/Čísla ze zadání/);
        for (const f of Object.values(t.optionFeedback ?? {})) expect(f, f).not.toMatch(/popsan/);
        expect(t.question, t.question).not.toMatch(/:\S/);
      }
    }
  });

  it("L1 čtení stupnice: nula na vnější i vnitřní stupnici", () => {
    const qs = vzorky(1).filter((t) => druh(t.question) === "stupnice").map((t) => t.question);
    expect(qs.some((q) => /nule vnější/.test(q))).toBe(true);
    expect(qs.some((q) => /nule vnitřní/.test(q))).toBe(true);
  });
});
