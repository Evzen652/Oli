/**
 * Matematika 6. ročník — Prvočísla a čísla složená, rozklad na součin prvočísel.
 *
 * Stavba podle výpočetního vzoru (`../fyzika/mereniDelky.ts`), helpery jen
 * z `./_shared`. Všechny úrovně jsou select_one (téma nemíchá typy).
 *
 *  • L1 rozpoznání: které číslo je prvočíslo / číslo složené (obor 1–60).
 *    Zadání nese vzor s jiným číslem, aby se otázky lišily a klíč v nich nebyl.
 *  • L2 použití: rozklad čísla na součin prvočísel. Distraktory = chybějící
 *    nebo přebývající opakovaný činitel, složený činitel, záměna prvočísla.
 *  • L3 analýza a inverze: z hotového rozkladu vyčíst dělitele (C) a najít
 *    největší prvočinitel trojmístného čísla (D).
 *
 * Součin se píše „ · “ bez mocnin (exponenty jsou v 6. ročníku nejisté).
 * Nápovědy se skládají tady, ne přes `dveNapovedy()`: její filtr by u L1 a L3
 * z výčtu čísel vypustil právě ta, ze kterých je složený klíč, a tím by
 * ho nepřímo prozradil.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  cis,
  pick,
  shuffle,
  doplnVelkou,
  buildChoiceTask,
  losUlohy,
  ruzneUlohy,
  type Distractor,
} from "./_shared";

// ── Aritmetika ─────────────────────────────────────────────────────────────
function jePrvocislo(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** Rozklad na prvočísla, činitelé vzestupně. */
function rozloz(n: number): number[] {
  const f: number[] = [];
  let m = n;
  for (let d = 2; m > 1; d++) {
    while (m % d === 0) {
      f.push(d);
      m /= d;
    }
  }
  return f;
}

function delitele(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

const soucin = (f: number[]) => f.reduce((a, b) => a * b, 1);
/** „2 · 2 · 3 · 5“ */
const zapis = (f: number[]) => [...f].sort((a, b) => a - b).map(cis).join(" · ");
const kolikrat = (k: number) => ["", "jednou", "dvakrát", "třikrát", "čtyřikrát", "pětkrát"][k] ?? `${cis(k)}krát`;
const nazev: Record<number, string> = { 2: "dvojka", 3: "trojka", 5: "pětka", 7: "sedmička" };
const pocet = (f: number[], p: number) => f.filter((x) => x === p).length;

/** Všechny různé součiny podmnožin (s násobnostmi) rozkladu; klíč = hodnota. */
function podsouciny(f: number[]): Map<number, number[]> {
  const out = new Map<number, number[]>();
  const n = f.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    const sub = f.filter((_, i) => mask & (1 << i));
    const v = soucin(sub);
    if (!out.has(v)) out.set(v, sub);
  }
  return out;
}

/** Hotové dvě nápovědy: malá konkrétní, velká aspoň o pětinu delší. */
function napovedy(t: PracticeTask, h0: string, h1: string): PracticeTask {
  t.hints = [h0, doplnVelkou(h0, h1, STRATEGIE)];
  return t;
}
const STRATEGIE = [
  "Nakonec si výsledek ověř roznásobením nebo dělením.",
  "Než vybereš, zkontroluj, na co přesně se otázka ptá.",
  "Porovnej všechny nabídnuté možnosti, ne jen tu první, která se zdá správná.",
];

// ── L1 — rozpoznání prvočísla a čísla složeného ────────────────────────────
const PRVOCISLA_2M = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];
/** Lichá složená čísla, která „vypadají jako prvočísla“. */
const LICHA_SLOZENA = [15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57];
/** Vzory do zadání A (složená čísla s rozkladem). */
const VZORY_SLOZENA = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57];
const SLOZENA_2M = Array.from({ length: 51 }, (_, i) => i + 10).filter((n) => !jePrvocislo(n));

const vyctiDelitele = (n: number) => delitele(n).map(cis).join(", ");

function genL1(): PracticeTask | null {
  return Math.random() < 0.5 ? genL1Prvocislo() : genL1Slozene();
}

function genL1Prvocislo(): PracticeTask | null {
  const klic = pick(PRVOCISLA_2M);
  // vzor nesmí mít klíč mezi činiteli (jinak by klíč stál v zadání)
  const vzor = pick(VZORY_SLOZENA.filter((v) => !rozloz(v).includes(klic)));
  const s1 = Math.random() < 0.6;
  const slozena = shuffle(LICHA_SLOZENA.filter((n) => n !== vzor)).slice(0, s1 ? 2 : 3);
  const moznosti = s1 ? [1, ...slozena] : slozena;
  const distraktory: Distractor[] = shuffle(moznosti).map((d) =>
    d === 1
      ? {
          value: "1",
          why: "Číslo 1 má jediného dělitele, a to 1. Prvočíslo musí mít právě dva dělitele, proto 1 prvočíslo není.",
        }
      : {
          value: cis(d),
          why: `Liché číslo ještě nemusí být prvočíslo: ${cis(d)} = ${zapis(rozloz(d))}, takže má dělitele ${vyctiDelitele(d)}.`,
        },
  );
  const question = `Číslo ${cis(vzor)} není prvočíslo, protože ${cis(vzor)} = ${zapis(rozloz(vzor))}. Které z těchto čísel je prvočíslo?`;
  const t = buildChoiceTask(question, cis(klic), distraktory, {
    hints: ["-"], // přepíše napovedy()
    solutionSteps: [
      `Prvočíslo má právě dva dělitele: 1 a samo sebe.`,
      ...moznosti.map((d) =>
        d === 1
          ? `Číslo 1 má jediného dělitele, není prvočíslo ani číslo složené.`
          : `${cis(d)} = ${zapis(rozloz(d))}, dělitelé: ${vyctiDelitele(d)} → číslo složené.`,
      ),
      `${cis(klic)} nejde beze zbytku vydělit 2, 3, 5 ani 7, dělitelé jsou jen 1 a ${cis(klic)} → prvočíslo.`,
    ],
    explanation:
      `Prvočíslo je číslo, které má právě dva dělitele, 1 a samo sebe. ` +
      `Číslo ${cis(klic)} má jen dělitele 1 a ${cis(klic)}, proto je to prvočíslo. ` +
      `Ostatní lichá čísla v nabídce jdou rozložit na menší činitele, takže jsou složená.` +
      (s1 ? ` Číslo 1 má jen jednoho dělitele, proto není prvočíslo ani číslo složené.` : ""),
  });
  if (!t) return null;
  return napovedy(
    t,
    `Zkus každé nabízené číslo dělit 2, 3, 5 a 7. Stejně jako ve vzoru s číslem ${cis(vzor)}: jde-li dělit beze zbytku, má číslo dalšího dělitele.`,
    `Prvočíslo má právě dva dělitele, 1 a samo sebe. Číslo, které se dá dělit ještě něčím dalším, je složené. A u čísla 1 si vzpomeň, kolik má vlastně dělitelů.`,
  );
}

function genL1Slozene(): PracticeTask | null {
  const klic = pick(SLOZENA_2M);
  const vzor = pick(PRVOCISLA_2M);
  const male = shuffle([1, 2]).slice(0, Math.random() < 0.5 ? 1 : 2);
  const velka = shuffle(PRVOCISLA_2M.filter((p) => p !== vzor)).slice(0, 3 - male.length);
  const moznosti = [...male, ...velka];
  const distraktory: Distractor[] = shuffle(moznosti).map((d) => {
    if (d === 1)
      return {
        value: "1",
        why: "Číslo 1 není prvočíslo, a přesto není ani složené. Číslo složené má víc než dva dělitele, kdežto 1 má jediného.",
      };
    if (d === 2)
      return {
        value: "2",
        why: "Sudé číslo nemusí být složené. Číslo 2 má jen dělitele 1 a 2, je to jediné sudé prvočíslo.",
      };
    return {
      value: cis(d),
      why: `${cis(d)} nejde beze zbytku vydělit 2, 3, 5 ani 7. Má jen dělitele 1 a ${cis(d)}, je to prvočíslo.`,
    };
  });
  const question = `Číslo ${cis(vzor)} je prvočíslo, protože ho dělí jen 1 a ${cis(vzor)}. Které z těchto čísel je číslo složené?`;
  const t = buildChoiceTask(question, cis(klic), distraktory, {
    hints: ["-"], // přepíše napovedy()
    solutionSteps: [
      `Číslo složené má víc než dva dělitele.`,
      `${cis(klic)} = ${zapis(rozloz(klic))}, dělitelé: ${vyctiDelitele(klic)} → číslo složené.`,
      ...moznosti.map((d) =>
        d === 1
          ? `Číslo 1 má jediného dělitele, není prvočíslo ani číslo složené.`
          : `${cis(d)} má jen dělitele 1 a ${cis(d)} → prvočíslo.`,
      ),
    ],
    explanation:
      `Číslo složené má víc než dva dělitele. ` +
      `Číslo ${cis(klic)} se dá zapsat jako ${zapis(rozloz(klic))}, jeho dělitelé jsou ${vyctiDelitele(klic)}, proto je složené. ` +
      `Ostatní nabídnutá čísla mají nejvýš dva dělitele.` +
      (male.includes(1) ? ` Číslo 1 má jen jednoho, proto není prvočíslo ani číslo složené.` : ""),
  });
  if (!t) return null;
  return napovedy(
    t,
    `Zkus každé nabízené číslo dělit 2, 3, 5 a 7. Na rozdíl od vzoru s číslem ${cis(vzor)} hledáš číslo, které má ještě dalšího dělitele.`,
    `Číslo složené má víc než dva dělitele. Sudé číslo větší než dva je vždy složené, ale pozor na samotnou dvojku. A u čísla 1 si vzpomeň, kolik má vlastně dělitelů.`,
  );
}

// ── L2 — rozklad na součin prvočísel ───────────────────────────────────────
/** 3–5 prvočinitelů z {2, 3, 5, 7}, aspoň jeden se opakuje. */
const POOL_L2 = [
  24, 28, 36, 40, 45, 48, 50, 54, 60, 63, 72, 75, 84, 90, 98, 100, 108, 120,
  126, 140, 150, 168, 175, 180, 196, 225, 245, 252, 270, 294, 300, 315, 350,
];

function genL2(): PracticeTask | null {
  const N = pick(POOL_L2);
  const f = rozloz(N);
  const klic = zapis(f);
  const opakovane = [...new Set(f)].filter((p) => pocet(f, p) >= 2);

  // E1 — opakovaný činitel zapsán jen jednou
  const p1 = pick(opakovane);
  const bez = [...f];
  bez.splice(bez.indexOf(p1), 1);
  const e1: Distractor = {
    value: zapis(bez),
    why: `${zapis(bez)} = ${cis(soucin(bez))}, ne ${cis(N)}. Jedna ${nazev[p1]} chybí: ${cis(N)} jde dělit ${cis(p1)} ${kolikrat(pocet(f, p1))} za sebou.`,
  };
  // E1b — opakovaný činitel zapsán jednou navíc
  const p2 = pick(opakovane);
  const navic = [...f, p2];
  const e1b: Distractor = {
    value: zapis(navic),
    why: `${zapis(navic)} = ${cis(soucin(navic))}, ne ${cis(N)}. Jedna ${nazev[p2]} je navíc: ${cis(N)} jde dělit ${cis(p2)} jen ${kolikrat(pocet(f, p2))} za sebou.`,
  };
  // E2 — rozklad skončil u složeného činitele
  const i = Math.floor(Math.random() * (f.length - 1));
  const a = f[i], b = f[i + 1];
  const slozeny = [...f.slice(0, i), a * b, ...f.slice(i + 2)];
  const e2: Distractor = {
    value: zapis(slozeny),
    why: `Součin sice dává ${cis(N)}, ale ${cis(a * b)} není prvočíslo (${cis(a * b)} = ${cis(a)} · ${cis(b)}). Rozklad ještě nekončí.`,
  };
  // E3 — záměna prvočísla za jiné
  const j = Math.floor(Math.random() * f.length);
  const q = pick([2, 3, 5, 7].filter((x) => x !== f[j]));
  const zamena = f.map((x, k) => (k === j ? q : x));
  const e3: Distractor = {
    value: zapis(zamena),
    why: `${zapis(zamena)} = ${cis(soucin(zamena))}, ne ${cis(N)}. Místo činitele ${cis(f[j])} je tu ${cis(q)}, a součin proto nesedí.`,
  };

  const kroky: string[] = [];
  let m = N;
  for (const p of f) {
    if (m === p) {
      kroky.push(`${cis(p)} je prvočíslo, dělení končí.`);
      break;
    }
    kroky.push(`${cis(m)} : ${cis(p)} = ${cis(m / p)}`);
    m /= p;
  }
  kroky.push(`Zkouška: ${klic} = ${cis(N)}`);

  const t = buildChoiceTask(
    `Jak vypadá rozklad čísla ${cis(N)} na součin prvočísel?`,
    klic,
    shuffle([e1, e1b, e2, e3]),
    {
      hints: ["-"], // přepíše napovedy()
      solutionSteps: kroky,
      explanation:
        `Číslo se dělí nejmenším prvočíslem, kterým to jde beze zbytku, a mezivýsledek se dělí dál, dokud nezbude prvočíslo. ` +
        `Každé dělení dá jednoho činitele, proto ${cis(N)} = ${klic}. ` +
        `Všichni činitelé jsou prvočísla a jejich součin je opravdu ${cis(N)}.`,
    },
  );
  if (!t) return null;
  return napovedy(
    t,
    `Číslo ${cis(N)} děl nejmenším prvočíslem, kterým to jde beze zbytku. Mezivýsledek děl dál.`,
    `Pokračuj, dokud nezůstane prvočíslo, a každé dělení si zapiš jako jednoho činitele. Nakonec činitele roznásob a porovnej se zadáním. Zkontroluj taky, že žádný činitel není složené číslo.`,
  );
}

// ── L3 — práce s hotovým rozkladem ─────────────────────────────────────────
/** C: hotové rozklady (vzestupně). */
const POOL_L3_ROZKLADY: number[][] = [
  [2, 2, 3, 5, 7], [2, 2, 3, 3, 5], [2, 3, 3, 5, 7], [2, 2, 2, 3, 5],
  [2, 2, 3, 7], [2, 3, 5, 5], [2, 2, 5, 7], [2, 3, 3, 7],
  [3, 3, 5, 7], [2, 2, 2, 3, 7], [2, 5, 5, 7], [2, 2, 3, 3, 7],
  [2, 3, 7, 7], [2, 2, 3, 5, 5], [3, 5, 5, 7], [2, 2, 2, 5, 7],
  [2, 3, 3, 3, 5], [2, 2, 5, 5],
];

const dvojmistne = (v: number) => v >= 10 && v <= 99;

function genL3(): PracticeTask | null {
  return Math.random() < 0.5 ? genL3Delitel() : genL3NejvetsiPrvocinitel();
}

function genL3Delitel(): PracticeTask | null {
  const f = pick(POOL_L3_ROZKLADY);
  const M = soucin(f);
  const vsechny = podsouciny(f);
  const klice = [...vsechny.entries()].filter(([v, sub]) => sub.length >= 2 && dvojmistne(v) && v !== M);
  const [klic, klicF] = pick(klice);

  // Chyba „činitel víckrát, než v rozkladu je“: p^(k+1) krát součin zbytku.
  const prvocisla = [...new Set(f)];
  const prekroceni: Distractor[] = [];
  for (const p of prvocisla) {
    const k = pocet(f, p);
    const zbytek = f.filter((x) => x !== p);
    const nasobky = [1, ...podsouciny(zbytek).keys()];
    for (const s of nasobky) {
      const d = p ** (k + 1) * s;
      if (!dvojmistne(d) || M % d === 0) continue;
      prekroceni.push({
        value: cis(d),
        why: `${cis(d)} = ${zapis(rozloz(d))}, ale ${nazev[p]} je v rozkladu jen ${kolikrat(k)}. Každého činitele smíš použít nejvýš tolikrát, kolikrát v rozkladu je.`,
      });
    }
  }
  // Chyba „prvočinitel, který v rozkladu není“.
  const chybejici: Distractor[] = [];
  for (const r of [2, 3, 5, 7, 11, 13].filter((x) => !f.includes(x))) {
    for (const s of podsouciny(f).keys()) {
      const d = r * s;
      if (!dvojmistne(d) || M % d === 0) continue;
      chybejici.push({
        value: cis(d),
        why: `${cis(d)} = ${zapis(rozloz(d))}, ale prvočíslo ${cis(r)} v rozkladu vůbec není. Dělitel smí mít jen činitele z rozkladu.`,
      });
    }
  }
  if (prekroceni.length < 2 || chybejici.length < 1) return null;
  const [o1, o2] = shuffle(prekroceni);
  const [m1, m2] = shuffle(chybejici);
  const poradi = Math.random() < 0.5 ? [o1, m1, o2, m2] : [m1, o1, m2, o2];

  const fs = zapis(f);
  const t = buildChoiceTask(
    `Nějaké číslo má rozklad na součin prvočísel ${fs}. Kterým z nabízených čísel je dělitelné?`,
    cis(klic),
    poradi.filter((d): d is Distractor => !!d),
    {
      hints: ["-"], // přepíše napovedy()
      solutionSteps: [
        `Číslo z rozkladu: ${fs} = ${cis(M)}.`,
        `${cis(klic)} = ${zapis(klicF)}. Každý z těchto činitelů je v rozkladu ${fs} aspoň tolikrát, kolikrát je v rozkladu čísla ${cis(klic)}.`,
        `Zkouška: ${cis(M)} : ${cis(klic)} = ${cis(M / klic)}, beze zbytku.`,
      ],
      explanation:
        `Číslo je dělitelné jiným číslem právě tehdy, když se prvočinitelé dělitele (i s počtem opakování) dají najít v jeho rozkladu. ` +
        `${cis(klic)} = ${zapis(klicF)} a všechny tyto činitele rozklad ${fs} obsahuje, proto ${cis(M)} : ${cis(klic)} = ${cis(M / klic)}. ` +
        `Ostatní možnosti potřebují některé prvočíslo víckrát, než v rozkladu je, nebo prvočíslo, které v něm vůbec není.`,
    },
  );
  if (!t) return null;
  return napovedy(
    t,
    `Každou nabízenou možnost rozlož na prvočísla a porovnej s rozkladem ${fs}.`,
    `Dělitel musí jít složit jen z činitelů, které v rozkladu jsou, a každý smíš použít nejvýš tolikrát, kolikrát tam je. Když některé prvočíslo v rozkladu chybí nebo ho potřebuješ víckrát, dělitelem to není.`,
  );
}

/** D: malý složený součin · velké prvočíslo. */
const MALE_SOUCINY = [4, 6, 8, 9, 10, 12, 14, 15, 18, 20, 21];
const VELKA_PRVOCISLA = Array.from({ length: 85 }, (_, i) => i + 13).filter(jePrvocislo);
const POOL_L3_D: { N: number; s: number; P: number }[] = MALE_SOUCINY.flatMap((s) =>
  VELKA_PRVOCISLA.filter((P) => P > Math.max(...rozloz(s)))
    .map((P) => ({ N: s * P, s, P }))
    .filter(({ N, P }) => N >= 100 && N <= 999 && !String(N).includes(String(P))),
);
/** Kandidáti na „cizí“ prvočíslo v nabídce D (nedělí N). */
const VELKA_PRVOCISLA_Q = Array.from({ length: 130 }, (_, i) => i + 11).filter(jePrvocislo);

function genL3NejvetsiPrvocinitel(): PracticeTask | null {
  const { N, s, P } = pick(POOL_L3_D);
  const f = rozloz(N);
  const nejmensi = f[0];
  const velkyDelitel = N / nejmensi;
  const dvaNejmensi = f[0] * f[1];
  // Velká prvočísla, která N nedělí: nejbližší ke klíči, aby o klíči
  // rozhodovala dělitelnost, ne to, jestli je číslo prvočíslo.
  const blizka = VELKA_PRVOCISLA_Q.filter((q) => q !== P && N % q !== 0)
    .sort((a, b) => Math.abs(a - P) - Math.abs(b - P))
    .slice(0, 4);
  const [q1, q2] = shuffle(blizka);
  const cizi = (q: number): Distractor => ({
    value: cis(q),
    why: `${cis(q)} je sice prvočíslo, ale číslo ${cis(N)} jím beze zbytku dělit nejde (${cis(N)} : ${cis(q)} = ${cis(Math.floor(N / q))}, zbytek ${cis(N % q)}). Prvočinitel musí číslo dělit.`,
  });
  const maly: Distractor = pick([
    {
      value: cis(nejmensi),
      why: `${cis(nejmensi)} je prvočinitel čísla ${cis(N)}, ale ten nejmenší. Otázka se ptá na největší.`,
    },
    {
      value: cis(dvaNejmensi),
      why: `${cis(dvaNejmensi)} = ${cis(f[0])} · ${cis(f[1])} dělí ${cis(N)}, ale není to prvočíslo, takže prvočinitel to být nemůže.`,
    },
    {
      value: cis(s),
      why: `${cis(s)} = ${zapis(rozloz(s))} dělí ${cis(N)}, ale není to prvočíslo, takže prvočinitel to být nemůže.`,
    },
  ]);
  const distraktory: Distractor[] = [
    {
      value: cis(velkyDelitel),
      why: `${cis(velkyDelitel)} je největší dělitel čísla ${cis(N)} menší než ${cis(N)} samo, ale není to prvočíslo: ${cis(velkyDelitel)} = ${zapis(rozloz(velkyDelitel))}.`,
    },
    cizi(q1),
    // čtvrtá možnost: druhé cizí prvočíslo, nebo typická chyba s malým číslem
    Math.random() < 0.5 ? cizi(q2) : maly,
  ];

  const kroky: string[] = [];
  let m = N;
  for (const p of f) {
    if (m === p) {
      kroky.push(`${cis(p)} už nejde dělit žádným menším prvočíslem, je to prvočíslo.`);
      break;
    }
    kroky.push(`${cis(m)} : ${cis(p)} = ${cis(m / p)}`);
    m /= p;
  }
  kroky.push(`Rozklad: ${cis(N)} = ${zapis(f)}, největší činitel je ${cis(P)}.`);

  const t = buildChoiceTask(
    `Jaký je největší prvočinitel čísla ${cis(N)}, tedy největší prvočíslo v jeho rozkladu?`,
    cis(P),
    distraktory,
    {
      hints: ["-"], // přepíše napovedy()
      solutionSteps: kroky,
      explanation:
        `Nejdřív je potřeba číslo rozložit: ${cis(N)} = ${zapis(f)}. ` +
        `Prvočinitelé jsou jen prvočísla z rozkladu, největší z nich je ${cis(P)}. ` +
        `Větší dělitelé čísla ${cis(N)} existují, ale jsou to čísla složená, takže prvočiniteli nejsou. ` +
        `A prvočíslo, kterým ${cis(N)} beze zbytku dělit nejde, prvočinitelem také není.`,
    },
  );
  if (!t) return null;
  return napovedy(
    t,
    `Rozlož ${cis(N)}: děl ho nejmenším prvočíslem, kterým to jde, a mezivýsledek děl dál.`,
    `Až zbude číslo, které už nejde dělit 2, 3, 5 ani 7, zkoušej další prvočísla v pořadí. Když žádné menší prvočíslo nejde, zbylo prvočíslo. Pak vyber největší prvočíslo z celého rozkladu, ne největšího dělitele. Nestačí, že nabízené číslo je prvočíslo, musí zadané číslo dělit beze zbytku.`,
  );
}

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const PRVOCISLA_ROZKLAD: TopicMetadata[] = [
  {
    id: "g6-mat-prvocisla-rozklad-6",
    rvpNodeId:
      "g6-matematika-cislo-a-promenna-delitelnost-prirozenych-cisel-prvocisla-a-cisla-slozena-rozklad-na-soucin-prvocisel",
    displayName: "Prvočísla a rozklad čísla",
    title: "Prvočísla a čísla složená, rozklad na součin prvočísel",
    studentTitle: "Prvočísla a rozklad čísla",
    subject: "matematika",
    category: "Číslo a proměnná",
    topic: "Dělitelnost přirozených čísel",
    briefDescription: "Poznáš prvočíslo a rozložíš číslo na součin prvočísel.",
    keywords: [
      "prvočíslo", "číslo složené", "rozklad na prvočísla", "prvočinitel",
      "součin prvočísel", "dělitel", "dělitelnost", "činitel",
    ],
    goals: [
      "Rozlišit prvočíslo a číslo složené a vědět, proč 1 není ani jedno.",
      "Rozložit přirozené číslo na součin prvočísel postupným dělením.",
      "Z hotového rozkladu určit dělitele čísla; u trojmístného čísla najít jeho největší prvočinitel.",
    ],
    boundaries: [
      "Rozklad se zapisuje součinem bez mocnin.",
      "Rozkládaná čísla nejvýš trojmístná.",
      "Nezahrnuje společného dělitele ani společný násobek (samostatné téma).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-mat-nsn-nsd-6"],
    generator: gen,
    helpTemplate: {
      hint: "Prvočíslo má právě dva dělitele, 1 a samo sebe. Číslo složené má dělitelů víc. Rozklad najdeš postupným dělením nejmenším prvočíslem.",
      steps: [
        "Zkus číslo dělit nejmenším prvočíslem, kterým to jde beze zbytku.",
        "Mezivýsledek děl dál, dokud nezbude prvočíslo.",
        "Činitele zapiš vzestupně a roznásobením ověř, že dávají zadané číslo.",
      ],
      commonMistake: "Opakovaný činitel zapsaný jen jednou nebo rozklad ukončený u složeného čísla (například 4 místo 2 · 2).",
      example: "66 : 2 = 33, 33 : 3 = 11. Rozklad: 66 = 2 · 3 · 11.",
    },
  },
];
