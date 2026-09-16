/**
 * Matematika 6. ročník — Nejmenší společný násobek a největší společný dělitel.
 *
 * Stavba podle výpočetního vzoru `../fyzika/mereniDelky.ts`, helpery jen
 * z `./_shared.ts`. Téma emituje výhradně select_one se čtyřmi číselnými
 * možnostmi.
 *
 *  • L1 — jedna dvojice čísel 4–30, šablony začínají „Urči…“; stačí výpis
 *    násobků / dělitelů. Zpětná vazba mluví jazykem seznamů, ne rozkladu.
 *  • L2 — větší čísla (24–180) nebo trojice do 60, šablony „Pomocí rozkladu…“
 *    a „Jaký je … trojice čísel“; výpis je nepraktický, vyplatí se rozklad.
 *  • L3 — slovní úlohy: žák nejdřív pozná, jestli jde o n, nebo o D
 *    (pravidelné děje, nejmenší délka, nejvíce balíčků, největší míra),
 *    plus inverzní úloha (dopočet druhého čísla zkouškou kandidátů;
 *    vztah a·b = n·D jen jako rozšiřující zkratka).
 *
 * Každý distraktor je výsledek konkrétní chyby spočítaný z týchž čísel:
 * záměna n ↔ D, prostý součin, prvočíslo vzaté víckrát/méněkrát, vynechané
 * prvočíslo, „menší číslo je vždy dělitel“, počet kusů místo počtu balíčků.
 *
 * Mocniny zavádí RVP až v 8. ročníku, proto se rozklad píše rozepsaně
 * (2 · 2 · 3) a místo „mocniny“ se říká „tolikrát, kolikrát…“.
 *
 * Nápovědy se skládají tady, ne přes `dveNapovedy` ze `_shared`: ta filtruje
 * čísla ze zadání podřetězcem klíče a vynechávala zadaná čísla (u n(5, 11) = 55
 * vypsala jen „11“). U NSN/NSD se zadané číslo s klíčem nikdy neshoduje.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { form, plural } from "@/lib/czechGrammar";
import { cis, rnd, pick, shuffle, doplnVelkou, buildChoiceTask, type Distractor } from "./_shared";

// ── Aritmetika přes rozklad ─────────────────────────────────────────────────
type Rozklad = Map<number, number>;

function rozloz(n: number): Rozklad {
  const r: Rozklad = new Map();
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      r.set(p, (r.get(p) ?? 0) + 1);
      x /= p;
    }
  }
  if (x > 1) r.set(x, (r.get(x) ?? 0) + 1);
  return r;
}

function soucin(r: Rozklad): number {
  let s = 1;
  for (const [p, e] of r) s *= p ** e;
  return s;
}

const gcd = (a: number, b: number): number => {
  while (b) [a, b] = [b, a % b];
  return a;
};

/** Rozklad rozepsaný bez mocnin: 2 · 2 · 3. */
function zapis(r: Rozklad): string {
  const cinitele = [...r.entries()]
    .filter(([, e]) => e > 0)
    .sort((a, b) => a[0] - b[0])
    .flatMap(([p, e]) => Array<number>(e).fill(p));
  return cinitele.length ? cinitele.map(cis).join(" · ") : "1";
}

function vsechnaPrvocisla(rs: Rozklad[]): number[] {
  return [...new Set(rs.flatMap((r) => [...r.keys()]))].sort((a, b) => a - b);
}

/** D = společná prvočísla, každé tolikrát, kolikrát je v rozkladech nejméně. */
function rozkladD(rs: Rozklad[]): Rozklad {
  const out: Rozklad = new Map();
  for (const p of vsechnaPrvocisla(rs)) {
    const e = Math.min(...rs.map((r) => r.get(p) ?? 0));
    if (e > 0) out.set(p, e);
  }
  return out;
}

/** n = všechna prvočísla, každé tolikrát, kolikrát je v některém rozkladu nejvíc. */
function rozkladN(rs: Rozklad[]): Rozklad {
  const out: Rozklad = new Map();
  for (const p of vsechnaPrvocisla(rs)) out.set(p, Math.max(...rs.map((r) => r.get(p) ?? 0)));
  return out;
}

/** Chyba u D: společné prvočíslo vzaté tolikrát, kolikrát je v rozkladech NEJVÍC. */
function dChybaMocnina(rs: Rozklad[]): number {
  const out: Rozklad = new Map();
  for (const [p] of rozkladD(rs)) out.set(p, Math.max(...rs.map((r) => r.get(p) ?? 0)));
  return soucin(out);
}

/** Chyba u n: společné prvočíslo vzaté jen NEJMÉNĚkrát (nespolečná zůstanou). */
function nChybaMocnina(rs: Rozklad[]): number {
  const out: Rozklad = new Map();
  for (const p of vsechnaPrvocisla(rs)) {
    const exps = rs.map((r) => r.get(p) ?? 0);
    const spolecne = exps.every((e) => e > 0);
    out.set(p, spolecne ? Math.min(...exps) : Math.max(...exps));
  }
  return soucin(out);
}

/** Prvočísla, která nemají všechna zadaná čísla. */
function nespolecna(rs: Rozklad[]): number[] {
  return vsechnaPrvocisla(rs).filter((p) => rs.some((r) => !r.has(p)));
}

const seznam = (xs: number[]): string =>
  xs.length === 1
    ? cis(xs[0])
    : `${xs.slice(0, -1).map(cis).join(", ")} a ${cis(xs[xs.length - 1])}`;

// ── Výpočet a chybový model ────────────────────────────────────────────────
interface Vypocet {
  cisla: number[];
  rs: Rozklad[];
  D: number;
  n: number;
}

function spocitej(cisla: number[]): Vypocet {
  const rs = cisla.map(rozloz);
  return { cisla, rs, D: soucin(rozkladD(rs)), n: soucin(rozkladN(rs)) };
}

type Chyba = "zamena" | "soucin" | "mocnina" | "vynechany" | "extrem" | "pridany";
/** „vypis“ = L1 (seznamy dělitelů/násobků), „rozklad“ = L2 a L3. */
type Styl = "vypis" | "rozklad";

/**
 * Každé číslo x ≠ D, které je násobkem D, není společným dělitelem — některé
 * zadané číslo tedy beze zbytku nedělí. Vrací právě to číslo.
 */
function nedeleno(x: number, cisla: number[]): number {
  return cisla.find((c) => c % x !== 0) ?? cisla[0];
}

/**
 * Každé číslo x ≠ n, které dělí n, není společným násobkem — některým zadaným
 * číslem nejde vydělit beze zbytku. Vrací právě to číslo.
 */
function nedelitelem(x: number, cisla: number[]): number {
  return cisla.find((c) => x % c !== 0) ?? cisla[0];
}

/** Distraktory pro úlohu na D v daném pořadí chyb. `u` = jednotka/formát. */
function distraktoryD(v: Vypocet, poradi: Chyba[], u: (x: number) => string, styl: Styl): Distractor[] {
  const { cisla, rs, D, n } = v;
  const min = Math.min(...cisla);
  const obe = cisla.length === 2 ? "obě čísla" : "všechna tři čísla";
  const nedeli = (x: number): string => `${cis(nedeleno(x, cisla))} : ${cis(x)} nevyjde beze zbytku`;
  const out: Distractor[] = [];
  for (const ch of poradi) {
    if (ch === "zamena") {
      out.push({
        value: u(n),
        why: `To je nejmenší společný násobek čísel ${seznam(cisla)}. Ptáme se na opak: na největší číslo, kterým jdou všechna zadaná čísla vydělit beze zbytku.`,
      });
    } else if (ch === "extrem" && min !== D) {
      out.push({
        value: u(min),
        why: cisla.length === 2
          ? `Menší číslo není vždy dělitelem většího: ${cis(Math.max(...cisla))} : ${cis(min)} nevyjde beze zbytku.`
          : `Nejmenší ze zadaných čísel nedělí beze zbytku všechna ostatní, takže společným dělitelem není.`,
      });
    } else if (ch === "mocnina") {
      const x = dChybaMocnina(rs);
      if (x !== D) {
        out.push({
          value: u(x),
          why: styl === "vypis"
            ? `Číslo ${cis(x)} není dělitelem všech zadaných čísel: ${nedeli(x)}. Hledej jen mezi čísly, která jsou v obou seznamech dělitelů.`
            : `U dělitele ber každé společné prvočíslo jen tolikrát, kolikrát je v rozkladech nejméně. Vzal jsi ho víckrát, a proto ${nedeli(x)}.`,
        });
      }
    } else if (ch === "vynechany") {
      const p = Math.min(...rozkladD(rs).keys());
      if (Number.isFinite(p)) {
        const x = D / p;
        out.push({
          value: u(x),
          why: styl === "rozklad"
            ? `Tohle je společný dělitel, ale ne největší. Zkontroluj v rozkladech, jestli některé společné prvočíslo nemají ${obe} víckrát, nebo jestli nemají společné ještě další.`
            : x === 1
              ? `Číslo 1 dělí každé číslo, ale největším společným dělitelem není. Podívej se do obou seznamů dělitelů — je v nich společné číslo větší než 1?`
              : `Číslo ${cis(x)} dělí ${obe} beze zbytku, ale není největší. V obou seznamech dělitelů je ještě větší společné číslo.`,
        });
      }
    } else if (ch === "pridany") {
      const q = nespolecna(rs)[0];
      if (q !== undefined) {
        const x = D * q;
        out.push({
          value: u(x),
          why: styl === "vypis"
            ? `Číslo ${cis(x)} není dělitelem všech zadaných čísel: ${nedeli(x)}. Hledej jen mezi čísly, která jsou v obou seznamech dělitelů.`
            : `Přidal jsi prvočíslo ${cis(q)}, které nemají všechna zadaná čísla, a proto ${nedeli(x)}. Do dělitele patří jen společná prvočísla.`,
        });
      }
    }
  }
  return out;
}

/** Distraktory pro úlohu na n v daném pořadí chyb. */
function distraktoryN(v: Vypocet, poradi: Chyba[], u: (x: number) => string, styl: Styl): Distractor[] {
  const { cisla, rs, D, n } = v;
  const max = Math.max(...cisla);
  const prod = cisla.reduce((a, b) => a * b, 1);
  const nevyjde = (x: number): string => `${cis(x)} : ${cis(nedelitelem(x, cisla))} nevyjde beze zbytku`;
  const pokracuj = (x: number): string =>
    `Číslo ${cis(x)} není společný násobek: ${nevyjde(x)}. Pokračuj ve výpisu násobků, dokud nenajdeš první společný.`;
  const out: Distractor[] = [];
  for (const ch of poradi) {
    if (ch === "zamena") {
      out.push({
        value: u(D),
        why: `To je největší společný dělitel čísel ${seznam(cisla)}. Ptáme se na opak: na nejmenší číslo, které je dělitelné všemi zadanými čísly.`,
      });
    } else if (ch === "soucin" && prod !== n) {
      out.push({
        value: u(prod),
        why: styl === "vypis"
          ? `Čísla jsi jen vynásobil. Součin je sice společný násobek, ale ne nejmenší — ve výpisu násobků narazíš na společný násobek dřív.`
          : `Čísla jsi jen vynásobil. Součin je sice společný násobek, ale ne nejmenší: prvočíslo, které mají zadaná čísla společné, jsi tak započítal víckrát, než je potřeba.`,
      });
    } else if (ch === "mocnina") {
      const x = nChybaMocnina(rs);
      if (x !== n) {
        out.push({
          value: u(x),
          why: styl === "vypis"
            ? pokracuj(x)
            : `U násobku ber každé prvočíslo tolikrát, kolikrát je v některém rozkladu nejvíc. Společné prvočíslo jsi vzal méněkrát, a proto ${nevyjde(x)}.`,
        });
      }
    } else if (ch === "vynechany") {
      const rN = rozkladN(rs);
      const ps = [...new Set([...nespolecna(rs), ...rN.keys()])];
      for (const p of ps) {
        // prvočíslo vynechané ÚPLNĚ — hodnota ho opravdu neobsahuje
        const x = n / p ** (rN.get(p) ?? 1);
        let why: string;
        if (cisla.includes(x)) {
          const c = nedelitelem(x, cisla);
          why = `Číslo ${cis(x)} je jen jedno ze zadaných čísel. Není dělitelné číslem ${cis(c)} (${cis(x)} : ${cis(c)} nevyjde beze zbytku), takže společným násobkem není.`;
        } else if (styl === "vypis") {
          why = pokracuj(x);
        } else {
          why = `Vynechal jsi prvočíslo ${cis(p)}, a proto ${nevyjde(x)}. Násobek musí obsahovat všechna prvočísla ze všech rozkladů.`;
        }
        out.push({ value: u(x), why });
      }
    } else if (ch === "extrem" && max !== n) {
      out.push({
        value: u(max),
        why: `Největší ze zadaných čísel není dělitelné všemi ostatními (${cis(max)} : ${cis(nedelitelem(max, cisla))} nevyjde beze zbytku), takže společným násobkem není.`,
      });
    }
  }
  return out;
}

function krokyRozkladD(v: Vypocet): string[] {
  const zn = v.cisla.map(cis).join(", ");
  return [
    ...v.cisla.map((c, i) => `${cis(c)} = ${zapis(v.rs[i])}`),
    `Společná prvočísla, každé tolikrát, kolikrát je v rozkladech nejméně: ${zapis(rozkladD(v.rs))}`,
    `D(${zn}) = ${cis(v.D)}`,
  ];
}

function krokyRozkladN(v: Vypocet): string[] {
  const zn = v.cisla.map(cis).join(", ");
  return [
    ...v.cisla.map((c, i) => `${cis(c)} = ${zapis(v.rs[i])}`),
    `Všechna prvočísla, každé tolikrát, kolikrát je v některém rozkladu nejvíc: ${zapis(rozkladN(v.rs))}`,
    `n(${zn}) = ${cis(v.n)}`,
  ];
}

const holeCislo = (x: number): string => cis(x);

// ── Sestavení úlohy a sezení ───────────────────────────────────────────────
const STRATEGIE = [
  "Nakonec si výsledek ověř zkouškou: dělí se opravdu beze zbytku?",
  "Porovnej výsledek s odhadem: dává takové číslo smysl?",
  "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.",
];

interface Kus {
  t: PracticeTask;
  /** Čísla, ze kterých je úloha postavená — podle nich se hlídá opakování. */
  cisla: number[];
}

/**
 * select_one úloha + dvě nápovědy. Malá nápověda vypíše VŠECHNA čísla ze
 * zadání (klíč mezi nimi nikdy není — hlídá test).
 */
function uloha(
  question: string,
  correct: string,
  dis: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
  zadana: number[],
  cisla: number[] = zadana,
): Kus | null {
  const t = buildChoiceTask(question, correct, dis, parts);
  if (!t) return null;
  const [prvni, ...zbytek] = parts.hints;
  const h0 = `${prvni} Čísla ze zadání: ${zadana.map(cis).join(", ")}.`;
  t.hints = [h0, doplnVelkou(h0, zbytek.join(" ") || prvni, STRATEGIE)];
  return { t, cisla };
}

/** Nekonečný zdroj prvků: zamíchá, projde všechny, zamíchá znovu. */
function cyklus<T>(xs: T[]): () => T {
  let poradi = shuffle(xs);
  let i = 0;
  return () => {
    if (i === poradi.length) {
      poradi = shuffle(xs);
      i = 0;
    }
    return poradi[i++];
  };
}

/**
 * Sezení: sloty se střídají dokola (vyvážení typů úloh v prvních šesti) a
 * stejná čísla se nepustí dvakrát — ani v jiném kontextu.
 */
function sestav(sloty: (() => Kus | null)[], kolik = 24, pokusu = 1200): PracticeTask[] {
  const out: PracticeTask[] = [];
  const pouzite = new Set<string>();
  for (let i = 0; i < pokusu && out.length < kolik; i++) {
    const k = sloty[out.length % sloty.length]();
    if (!k) continue;
    const klic = [...k.cisla].sort((x, y) => x - y).join(",");
    if (pouzite.has(klic)) continue;
    pouzite.add(klic);
    out.push(k.t);
  }
  return out;
}

// ── L1: dvojice 4–30, výpis násobků / dělitelů ─────────────────────────────
const POOL_L1: [number, number][] = [];
for (let a = 4; a < 30; a++) {
  for (let b = a + 1; b <= 30; b++) {
    if (b % a !== 0) POOL_L1.push([a, b]);
  }
}
const POOL_L1_D = POOL_L1.filter(([a, b]) => spocitej([a, b]).D > 1);
// výpis násobků má zůstat krátký: větší číslo stačí vynásobit nejvýš šestkrát
const POOL_L1_N = POOL_L1.filter(([a, b]) => {
  const { n } = spocitej([a, b]);
  return n / b <= 6 && n <= 120;
});

function delitele(x: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= x; d++) if (x % d === 0) out.push(d);
  return out;
}

function genL1(co: "D" | "n"): Kus | null {
  if (co === "D") {
    const [a, b] = pick(POOL_L1_D);
    const v = spocitej([a, b]);
    const spol = delitele(a).filter((d) => b % d === 0);
    return uloha(
      `Urči největší společný dělitel čísel ${cis(a)} a ${cis(b)}.`,
      cis(v.D),
      distraktoryD(v, ["zamena", "vynechany", "extrem", "mocnina", "pridany"], holeCislo, "vypis"),
      {
        hints: [
          "Vypiš všechny dělitele obou čísel a vyber největší společný.",
          "Dělitele hledej po dvojicích: zkoušej dělit postupně od jedničky nahoru a zapisuj dělitele i podíl. Pak podtrhni ty, které se objeví v obou seznamech.",
        ],
        solutionSteps: [
          `Dělitelé čísla ${cis(a)}: ${delitele(a).map(cis).join(", ")}`,
          `Dělitelé čísla ${cis(b)}: ${delitele(b).map(cis).join(", ")}`,
          `Společní dělitelé: ${spol.map(cis).join(", ")} → největší je ${cis(v.D)}`,
        ],
        explanation: `Největší společný dělitel je největší číslo, kterým jdou ${cis(a)} i ${cis(b)} vydělit beze zbytku. V obou seznamech dělitelů je největší společné číslo ${cis(v.D)}, proto D(${cis(a)}, ${cis(b)}) = ${cis(v.D)}.`,
      },
      [a, b],
    );
  }
  const [a, b] = pick(POOL_L1_N);
  const v = spocitej([a, b]);
  const nb: number[] = [];
  for (let k = b; k <= v.n; k += b) nb.push(k);
  const nedelitelne = nb.slice(0, -1);
  return uloha(
    `Urči nejmenší společný násobek čísel ${cis(a)} a ${cis(b)}.`,
    cis(v.n),
    distraktoryN(v, ["zamena", "soucin", "extrem", "vynechany", "mocnina"], holeCislo, "vypis"),
    {
      hints: [
        "Vypiš několik prvních násobků obou čísel a hledej první společný.",
        "Začni násobky většího čísla a u každého zkontroluj, jestli jde vydělit beze zbytku i menším číslem. První takový je hledaný násobek.",
      ],
      solutionSteps: [
        `Násobky čísla ${cis(b)}: ${nb.map(cis).join(", ")}`,
        nedelitelne.length
          ? `Číslem ${cis(a)} nejde beze zbytku vydělit ${nedelitelne.map(cis).join(", ")}.`
          : `Už první násobek jde vydělit číslem ${cis(a)}.`,
        `První násobek čísla ${cis(b)}, který je zároveň násobkem čísla ${cis(a)}: ${cis(v.n)} (${cis(v.n)} : ${cis(a)} = ${cis(v.n / a)})`,
      ],
      explanation: `Nejmenší společný násobek je nejmenší číslo, které jde vydělit beze zbytku číslem ${cis(a)} i ${cis(b)}. Mezi násobky čísla ${cis(b)} je ${cis(v.n)} první, které jde vydělit i číslem ${cis(a)}, proto n(${cis(a)}, ${cis(b)}) = ${cis(v.n)}.`,
    },
    [a, b],
  );
}

// ── L2: rozklad na prvočinitele, větší čísla nebo trojice ──────────────────
function maVyssiMocninu(v: Vypocet): boolean {
  return v.rs.some((r) => [...r.values()].some((e) => e >= 2));
}

function vhodneL2(v: Vypocet, co: "D" | "n"): boolean {
  const { cisla, D, n } = v;
  if (D < 2 || cisla.includes(D) || cisla.includes(n)) return false;
  if (cisla.some((x, i) => cisla.some((y, j) => i !== j && y % x === 0))) return false;
  if (!(n > 100 || maVyssiMocninu(v))) return false;
  if (co === "n" && n > 2000) return false;
  if (co === "D" && D < 4) return false;
  return true;
}

function losDvojiceL2(co: "D" | "n"): Vypocet | null {
  for (let i = 0; i < 100; i++) {
    const a = rnd(24, 180), b = rnd(24, 180);
    if (a === b) continue;
    const v = spocitej([Math.min(a, b), Math.max(a, b)]);
    if (vhodneL2(v, co)) return v;
  }
  return null;
}

function losTrojiceL2(co: "D" | "n"): Vypocet | null {
  for (let i = 0; i < 200; i++) {
    const c = [rnd(6, 60), rnd(6, 60), rnd(6, 60)].sort((x, y) => x - y);
    if (new Set(c).size < 3) continue;
    const v = spocitej(c);
    if (!vhodneL2(v, co)) continue;
    if (co === "n" && v.n > 600) continue;
    return v;
  }
  return null;
}

const HINTS_L2 = (troj: boolean): string[] => [
  troj ? "Rozlož všechna tři čísla na součin prvočísel." : "Rozlož obě čísla na součin prvočísel.",
  "U dělitele ber jen společná prvočísla, každé tolikrát, kolikrát je v rozkladech nejméně. U násobku ber všechna prvočísla, každé tolikrát, kolikrát je v některém rozkladu nejvíc. Nakonec vybraná prvočísla vynásob.",
];

function genL2(co: "D" | "n"): Kus | null {
  const troj = Math.random() < 0.4;
  const v = troj ? losTrojiceL2(co) : losDvojiceL2(co);
  if (!v) return null;
  const zn = seznam(v.cisla);
  if (co === "D") {
    const question = troj
      ? `Jaký je největší společný dělitel trojice čísel ${zn}?`
      : `Pomocí rozkladu na prvočinitele najdi největší společný dělitel čísel ${zn}.`;
    return uloha(
      question,
      cis(v.D),
      distraktoryD(v, ["zamena", "mocnina", "vynechany", "pridany", "extrem"], holeCislo, "rozklad"),
      {
        hints: HINTS_L2(troj),
        solutionSteps: krokyRozkladD(v),
        explanation: `Dělitel všech čísel smí obsahovat jen prvočísla, která mají všechna čísla, a každé nejvýš tolikrát, kolikrát je v rozkladech nejméně. Proto D = ${zapis(rozkladD(v.rs))} = ${cis(v.D)}.`,
      },
      v.cisla,
    );
  }
  const question = troj
    ? `Jaký je nejmenší společný násobek trojice čísel ${zn}?`
    : `Pomocí rozkladu na prvočinitele najdi nejmenší společný násobek čísel ${zn}.`;
  return uloha(
    question,
    cis(v.n),
    distraktoryN(v, ["zamena", "mocnina", "vynechany", "soucin", "extrem"], holeCislo, "rozklad"),
    {
      hints: HINTS_L2(troj),
      solutionSteps: krokyRozkladN(v),
      explanation: `Násobek všech čísel musí obsahovat každé prvočíslo z rozkladů, a to tolikrát, kolikrát je v některém rozkladu nejvíc; víc už není potřeba. Proto n = ${zapis(rozkladN(v.rs))} = ${cis(v.n)}.`,
    },
    v.cisla,
  );
}

// ── L3: slovní úlohy (poznej n, nebo D) + inverze ──────────────────────────
const H3_START =
  "Rozhodni, co se v úloze děje: rozděluješ něco beze zbytku na stejné části (hledáš dělitele), nebo čekáš, až se něco znovu sejde či vyrovná (hledáš násobek)?";
const H3_N =
  "Hledané číslo musí jít vydělit oběma zadanými čísly — je to společný násobek. Rozlož čísla na prvočinitele a vezmi každé prvočíslo tolikrát, kolikrát je v některém rozkladu nejvíc.";
const H3_D =
  "Hledané číslo musí dělit obě zadaná čísla beze zbytku — je to společný dělitel. Rozlož čísla na prvočinitele a vezmi jen společná prvočísla, každé tolikrát, kolikrát je v rozkladech nejméně.";

/** Dvojice z nabídky, které nejsou jedna násobkem druhé a mají společného dělitele. */
function dvojiceZ(nabidka: number[]): [number, number] {
  for (;;) {
    const a = pick(nabidka), b = pick(nabidka);
    if (a >= b || b % a === 0) continue;
    if (spocitej([a, b]).D < 2) continue;
    return [a, b];
  }
}

/** a = D·p, b = D·q, p a q nesoudělná, různá, p ≥ pMin; b v ⟨bMin, max⟩. */
function dvojiceSD(dMin: number, dMax: number, max: number, bMin = 0, pMin = 2): [number, number, number] {
  for (;;) {
    const D = rnd(dMin, dMax), p = rnd(pMin, 9), q = rnd(2, 9);
    if (p >= q || spocitej([p, q]).D !== 1) continue;
    if (D * q > max || D * q < bMin) continue;
    return [D * p, D * q, D];
  }
}

interface KontextN {
  text: (a: number, b: number) => string;
  /** Úvod vysvětlení vázaný na kontext; končí „…násobkem a i b.“ */
  proc: (a: number, b: number) => string;
  jednotka: (x: number) => string;
  hodnoty: number[];
}

const KONTEXTY_N: KontextN[] = [
  {
    text: (a, b) =>
      `Modrý autobus odjíždí ze zastávky ${plural(a, "každou", "každé", "každých")} ${cis(a)} ${form(a, "MINUTA")}, červený ${plural(b, "každou", "každé", "každých")} ${cis(b)} ${form(b, "MINUTA")}. Právě teď odjely oba současně. Za kolik minut nejdříve odjedou zase spolu?`,
    proc: (a, b) =>
      `Modrý autobus odjíždí po ${cis(a)}, ${cis(2 * a)}, ${cis(3 * a)}… minutách, červený po násobcích čísla ${cis(b)}. Oba odjedou zase spolu za počet minut, který je násobkem ${cis(a)} i ${cis(b)}.`,
    jednotka: (x) => `${cis(x)} min`,
    hodnoty: [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 30],
  },
  {
    text: (a, b) =>
      `Jeden maják blikne ${plural(a, "každou", "každé", "každých")} ${cis(a)} ${form(a, "SEKUNDA")}, druhý ${plural(b, "každou", "každé", "každých")} ${cis(b)} ${form(b, "SEKUNDA")}. Právě teď bliknuly oba najednou. Za kolik sekund nejdříve bliknou zase spolu?`,
    proc: (a, b) =>
      `První maják bliká po násobcích čísla ${cis(a)}, druhý po násobcích čísla ${cis(b)}. Oba bliknou zase spolu za počet sekund, který je násobkem ${cis(a)} i ${cis(b)}.`,
    jednotka: (x) => `${cis(x)} s`,
    hodnoty: [4, 6, 8, 9, 10, 12, 14, 15, 18],
  },
  {
    text: (a, b) =>
      `Tereza chodí na cvičení každý ${cis(a)}. den, Marek každý ${cis(b)}. den. Dnes se na cvičení potkali. Za kolik dní se tam nejdříve potkají zase spolu?`,
    proc: (a, b) =>
      `Tereza přijde za ${cis(a)}, ${cis(2 * a)}, ${cis(3 * a)}… dní, Marek za násobek čísla ${cis(b)}. Potkají se zase za počet dní, který je násobkem ${cis(a)} i ${cis(b)}.`,
    jednotka: (x) => `${cis(x)} ${form(x, "DEN")}`,
    hodnoty: [4, 6, 8, 9, 10, 12, 14, 15],
  },
  {
    text: (a, b) =>
      `Z tyčí dlouhých ${cis(a)} cm a z tyčí dlouhých ${cis(b)} cm má Ondra sestavit dvě stejně dlouhé řady: jednu jen z kratších tyčí, druhou jen z delších. Jaká je nejmenší možná délka řady?`,
    proc: (a, b) =>
      `Řada z kratších tyčí má délku, která je násobkem ${cis(a)} cm, řada z delších násobkem ${cis(b)} cm. Stejně dlouhé budou, když je jejich délka násobkem ${cis(a)} i ${cis(b)}.`,
    jednotka: (x) => `${cis(x)} cm`,
    hodnoty: [12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45],
  },
  {
    text: (a, b) =>
      `Kateřina skládá dva stejně dlouhé pruhy z dlaždic. V prvním pruhu jsou jen dlaždice široké ${cis(a)} cm, ve druhém jen dlaždice široké ${cis(b)} cm. Jaká je nejmenší možná délka pruhů?`,
    proc: (a, b) =>
      `První pruh má délku, která je násobkem ${cis(a)} cm, druhý násobkem ${cis(b)} cm. Stejně dlouhé budou, když je jejich délka násobkem ${cis(a)} i ${cis(b)}.`,
    jednotka: (x) => `${cis(x)} cm`,
    hodnoty: [10, 12, 15, 16, 18, 20, 24, 30],
  },
  {
    text: (a, b) =>
      `Jirka staví dvě stejně vysoké věže: jednu z kostek vysokých ${cis(a)} mm, druhou z kostek vysokých ${cis(b)} mm. Jaká je nejmenší možná výška věží?`,
    proc: (a, b) =>
      `Věž z nižších kostek má výšku, která je násobkem ${cis(a)} mm, věž z vyšších kostek násobkem ${cis(b)} mm. Stejně vysoké budou, když je jejich výška násobkem ${cis(a)} i ${cis(b)}.`,
    jednotka: (x) => `${cis(x)} mm`,
    hodnoty: [12, 15, 18, 20, 24, 30, 36],
  },
];

function genL3N(k: KontextN): Kus | null {
  const [a, b] = dvojiceZ(k.hodnoty);
  const v = spocitej([a, b]);
  return uloha(
    k.text(a, b),
    k.jednotka(v.n),
    distraktoryN(v, ["zamena", "soucin", "vynechany", "mocnina", "extrem"], k.jednotka, "rozklad"),
    {
      hints: [H3_START, H3_N],
      solutionSteps: [
        `Hledané číslo musí být násobkem ${cis(a)} i ${cis(b)} a má být co nejmenší → nejmenší společný násobek.`,
        ...krokyRozkladN(v),
      ],
      explanation: `${k.proc(a, b)} Nejmenší takové číslo je n(${cis(a)}, ${cis(b)}) = ${zapis(rozkladN(v.rs))} = ${cis(v.n)}, odpověď je tedy ${k.jednotka(v.n)}.`,
    },
    [a, b],
  );
}

interface KontextBalicky {
  text: (a: number, b: number) => string;
  kusy: string; // gen. pl. první položky („rohlíků“)
  obal: string; // „v jednom balíčku“
  pocet: string; // „počet balíčků“
}

const KONTEXTY_BALICKY: KontextBalicky[] = [
  {
    text: (a, b) =>
      `Pekařka Jana má ${cis(a)} ${plural(a, "rohlík", "rohlíky", "rohlíků")} a ${cis(b)} ${plural(b, "koblihu", "koblihy", "koblih")}. Chce je rozdělit do co nejvíce stejných balíčků se stejným obsahem tak, aby nic nezbylo. Kolik balíčků připraví?`,
    kusy: "rohlíků",
    obal: "v jednom balíčku",
    pocet: "počet balíčků",
  },
  {
    text: (a, b) =>
      `Květinářka má ${cis(a)} ${plural(a, "růži", "růže", "růží")} a ${cis(b)} ${plural(b, "tulipán", "tulipány", "tulipánů")}. Chce z nich uvázat co nejvíce stejných kytic tak, aby žádná květina nezbyla. Kolik kytic uváže?`,
    kusy: "růží",
    obal: "v jedné kytici",
    pocet: "počet kytic",
  },
  {
    text: (a, b) =>
      `Na výlet jede ${cis(a)} ${plural(a, "chlapec", "chlapci", "chlapců")} a ${cis(b)} ${plural(b, "dívka", "dívky", "dívek")}. Učitelé je chtějí rozdělit do co nejvíce stejných skupin, v každé se stejným počtem chlapců i dívek. Kolik skupin vytvoří?`,
    kusy: "chlapců",
    obal: "v jedné skupině",
    pocet: "počet skupin",
  },
  {
    text: (a, b) =>
      `Petr má ${cis(a)} ${plural(a, "červenou pastelku", "červené pastelky", "červených pastelek")} a ${cis(b)} ${plural(b, "modrou pastelku", "modré pastelky", "modrých pastelek")}. Chce je rozdělit do co nejvíce stejných sad tak, aby žádná pastelka nezbyla. Kolik sad sestaví?`,
    kusy: "červených pastelek",
    obal: "v jedné sadě",
    pocet: "počet sad",
  },
];

function genL3Balicky(k: KontextBalicky): Kus | null {
  // D ≥ 4, p ≥ 3, větší číslo ≥ 30: L3 nesmí být číselně lehčí než L1
  const [a, b, D] = dvojiceSD(4, 12, 96, 30, 3);
  const v = spocitej([a, b]);
  const dis: Distractor[] = [
    distraktoryD(v, ["zamena"], holeCislo, "rozklad")[0],
    {
      value: cis(a / D),
      why: `To je počet ${k.kusy} ${k.obal}, ne ${k.pocet}. Otázka se ptá, kolik takových stejných částí vznikne.`,
    },
    ...distraktoryD(v, ["vynechany", "extrem", "pridany"], holeCislo, "rozklad"),
  ];
  return uloha(
    k.text(a, b),
    cis(v.D),
    dis,
    {
      hints: [H3_START, H3_D],
      solutionSteps: [
        `Počet částí musí dělit ${cis(a)} i ${cis(b)} beze zbytku a má být co největší → největší společný dělitel.`,
        ...krokyRozkladD(v),
        `Kontrola: ${cis(a)} : ${cis(D)} = ${cis(a / D)}, ${cis(b)} : ${cis(D)} = ${cis(b / D)}`,
      ],
      explanation: `Aby nic nezbylo, musí počet stejných částí dělit obě čísla beze zbytku; co nejvíce částí znamená největší takový dělitel: D(${cis(a)}, ${cis(b)}) = ${cis(D)}. Po rozdělení vyjde na každou část ${cis(a)} : ${cis(D)} = ${cis(a / D)} z první skupiny a ${cis(b)} : ${cis(D)} = ${cis(b / D)} z druhé.`,
    },
    [a, b],
  );
}

interface KontextMira {
  text: (a: number, b: number) => string;
  j: string;
  max: number;
}

const KONTEXTY_MIRA: KontextMira[] = [
  {
    text: (a, b) =>
      `Obdélníková zahrada měří ${cis(a)} m a ${cis(b)} m. Celou ji mají bez mezer pokrýt stejné čtvercové záhony. Jakou největší délku strany mohou záhony mít?`,
    j: "m",
    max: 120,
  },
  {
    text: (a, b) =>
      `Máma má dvě stuhy, dlouhé ${cis(a)} cm a ${cis(b)} cm. Chce je beze zbytku rozstříhat na kousky, které budou všechny stejně dlouhé. Jakou největší délku může mít jeden kousek?`,
    j: "cm",
    max: 200,
  },
  {
    text: (a, b) =>
      `Podlaha chodby má rozměry ${cis(a)} dm a ${cis(b)} dm. Pokryje se stejnými čtvercovými dlaždicemi, které se nebudou řezat. Jakou největší délku strany může dlaždice mít?`,
    j: "dm",
    max: 150,
  },
];

function genL3Mira(k: KontextMira): Kus | null {
  const [a, b, D] = dvojiceSD(3, 12, k.max, 30);
  const v = spocitej([a, b]);
  const u = (x: number) => `${cis(x)} ${k.j}`;
  return uloha(
    k.text(a, b),
    u(D),
    distraktoryD(v, ["zamena", "vynechany", "extrem", "mocnina", "pridany"], u, "rozklad"),
    {
      hints: [H3_START, H3_D],
      solutionSteps: [
        `Délka musí dělit ${cis(a)} i ${cis(b)} beze zbytku a má být co největší → největší společný dělitel.`,
        ...krokyRozkladD(v),
      ],
      explanation: `Aby se nic neřezalo ani nezbylo, musí se hledaná délka vejít beze zbytku do ${cis(a)} ${k.j} i do ${cis(b)} ${k.j}. Největší taková je D(${cis(a)}, ${cis(b)}) = ${cis(D)} ${k.j}.`,
    },
    [a, b],
  );
}

function genL3Inverze(): Kus | null {
  const [a, b, D] = dvojiceSD(2, 8, 80);
  const n = spocitej([a, b]).n;
  const question = pick([
    `Nejmenší společný násobek dvou čísel je ${cis(n)} a jejich největší společný dělitel je ${cis(D)}. Jedno z čísel je ${cis(a)}. Které je druhé číslo?`,
    `Dvě přirozená čísla mají nejmenší společný násobek ${cis(n)} a největší společný dělitel ${cis(D)}. Jedno z nich je ${cis(a)}. Které je druhé číslo?`,
  ]);
  const zkouska = (x: number): string => {
    const g = gcd(a, x);
    const l = (a / g) * x;
    return g !== D
      ? `Zkouška nesedí: největší společný dělitel čísel ${cis(a)} a ${cis(x)} je ${cis(g)}, ne ${cis(D)}.`
      : `Zkouška nesedí: nejmenší společný násobek čísel ${cis(a)} a ${cis(x)} je ${cis(l)}, ne ${cis(n)}.`;
  };
  const kandidati: [number, string][] = [
    [n / a, `Předpokládal jsi, že nejmenší společný násobek je součin obou čísel, a vydělil jsi ho známým číslem. To platí jen pro čísla, která nemají společného dělitele většího než 1.`],
    [n / D, `Vydělil jsi násobek dělitelem, ale známé číslo ${cis(a)} jsi do výpočtu nezapojil.`],
    [a * D, `Vynásobil jsi známé číslo dělitelem.`],
    [n, `Druhé číslo nemusí být rovnou nejmenší společný násobek.`],
    [n - a, `Odečítání tu nepomůže.`],
  ];
  const dis: Distractor[] = kandidati
    .filter(([x]) => x > 0 && x !== a && x !== b)
    .map(([x, proc]) => ({ value: cis(x), why: `${proc} ${zkouska(x)}` }));
  const moznosti: number[] = [];
  for (let x = D; x <= n; x += D) if (n % x === 0 && x !== a) moznosti.push(x);
  return uloha(
    question,
    cis(b),
    dis,
    {
      hints: [
        "Druhé číslo musí být násobkem největšího společného dělitele a zároveň dělitelem nejmenšího společného násobku.",
        "Vypiš násobky dělitele, které beze zbytku dělí nejmenší společný násobek. U každého zkontroluj, jestli se známým číslem dává přesně zadaný dělitel i násobek — vyhovuje jen jedno.",
      ],
      solutionSteps: [
        `Druhé číslo je násobkem čísla ${cis(D)} a dělí číslo ${cis(n)}: v úvahu připadají ${seznam(moznosti)}.`,
        `Zkouška pro ${cis(b)}: D(${cis(a)}, ${cis(b)}) = ${cis(D)}, n(${cis(a)}, ${cis(b)}) = ${cis(n)} — sedí. Ostatní čísla dají jiný dělitel nebo násobek.`,
        `Rozšiřující zkratka pro dvě čísla: a · b = n · D, tedy b = ${cis(n)} · ${cis(D)} : ${cis(a)} = ${cis(b)}.`,
      ],
      explanation: `Druhé číslo musí být násobkem ${cis(D)} (jinak by ${cis(D)} nebyl společný dělitel) a musí dělit ${cis(n)} (jinak by ${cis(n)} nebyl společný násobek). Z takových čísel projde zkouškou jen ${cis(b)}. Rozšiřující učivo: pro dvě čísla platí a · b = n · D, takže rychleji ${cis(n)} · ${cis(D)} : ${cis(a)} = ${cis(b)}.`,
    },
    [n, D, a],
    [a, b],
  );
}

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  if (level === 1) return sestav(shuffle([() => genL1("D"), () => genL1("n")]));
  if (level === 2) return sestav(shuffle([() => genL2("D"), () => genL2("n")]));
  const kN = cyklus(KONTEXTY_N);
  const kB = cyklus(KONTEXTY_BALICKY);
  const kM = cyklus(KONTEXTY_MIRA);
  const typy: Record<"B" | "M" | "I", () => Kus | null> = {
    B: () => genL3Balicky(kB()),
    M: () => genL3Mira(kM()),
    I: genL3Inverze,
  };
  const naN = () => genL3N(kN());
  // n-úlohy ve dvou slotech z pěti, nikdy dvě hned po sobě
  const [x, y, z] = shuffle<"B" | "M" | "I">(["B", "M", "I"]);
  return sestav([naN, typy[x], naN, typy[y], typy[z]]);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const NSN_NSD_6: TopicMetadata[] = [
  {
    id: "g6-mat-nsn-nsd-6",
    rvpNodeId: "g6-matematika-cislo-a-promenna-delitelnost-prirozenych-cisel-nejmensi-spolecny-nasobek-nejvetsi-spolecny-delitel",
    displayName: "Společný násobek a dělitel",
    title: "Nejmenší společný násobek, největší společný dělitel",
    studentTitle: "Společný násobek a dělitel",
    subject: "matematika",
    category: "Číslo a proměnná",
    topic: "Dělitelnost přirozených čísel",
    briefDescription: "Najdi nejmenší společný násobek a největší společný dělitel čísel",
    keywords: [
      "nejmenší společný násobek", "největší společný dělitel", "nsn", "NSD",
      "dělitelnost", "rozklad na prvočinitele", "prvočísla", "násobek", "dělitel",
    ],
    goals: [
      "Určit nejmenší společný násobek a největší společný dělitel dvou nebo tří čísel.",
      "Použít rozklad na prvočinitele, když je výpis násobků nepraktický.",
      "Ve slovní úloze poznat, zda se hledá společný násobek, nebo společný dělitel.",
    ],
    boundaries: [
      "Jen přirozená čísla do 200, trojice do 60.",
      "Bez zlomků a společného jmenovatele (7. ročník).",
      "Bez mocnin (8. ročník) — rozklad se píše rozepsaně: 2 · 2 · 3.",
      "Vztah a · b = n · D jen jako rozšiřující zkratka v postupu.",
      "Žák vybírá ze čtyř možností, nepíše vlastní odpověď.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Společný dělitel se vejde do všech čísel beze zbytku, společný násobek je číslo, do kterého se všechna čísla vejdou.",
      steps: [
        "Rozlož všechna čísla na součin prvočísel.",
        "Pro dělitel vezmi jen společná prvočísla, každé tolikrát, kolikrát je v rozkladech nejméně, a vynásob je.",
        "Pro násobek vezmi všechna prvočísla, každé tolikrát, kolikrát je v některém rozkladu nejvíc, a vynásob je.",
      ],
      commonMistake: "Záměna násobku a dělitele, nebo násobek spočítaný jako prostý součin čísel.",
      example: "12 = 2 · 2 · 3, 18 = 2 · 3 · 3. D(12, 18) = 2 · 3 = 6, n(12, 18) = 2 · 2 · 3 · 3 = 36.",
    },
  },
];
