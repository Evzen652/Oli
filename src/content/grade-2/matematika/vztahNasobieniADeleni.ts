import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pad, plural, pluralWithNumber } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu): 9/9/9 úloh, jedna nápověda bez
// zpětné vazby. Teď oddělené úrovně, u každé úlohy dvě vlastní nápovědy,
// vysvětlení a zpětná vazba u každé chybné možnosti.
// L1 rozpoznání vztahu (známé násobení → dělení) · L2 dělení pomocí násobilky
// (holý příklad i rozdělování na stejné díly) · L3 inverze: chybějící činitel,
// chybějící dělitel a dělení po skupinách (kolik řad).
// Rozsah: násobilka 2–5, dělenci do 50.

/** První tři různé kladné kandidáty, které nejsou klíčem. */
function tri(key: number, cands: Array<[number, string]>): [Distractor, Distractor, Distractor] {
  const seen = new Set([key]);
  const out: Distractor[] = [];
  for (const [v, why] of cands) {
    if (v <= 0 || seen.has(v)) continue;
    seen.add(v);
    out.push({ value: String(v), why });
    if (out.length === 3) break;
  }
  if (out.length < 3) throw new Error(`Málo distraktorů pro klíč ${key}`);
  return out as [Distractor, Distractor, Distractor];
}

// ── L1 — ze známého násobení vyčti dělení ─────────────────────────────────

function zNasobeni(q: number, d: number, obracene: boolean): PracticeTask {
  const c = q * d;
  const fakt = obracene ? `${d} × ${q} = ${c}` : `${q} × ${d} = ${c}`;
  const dd = tri(q, [
    [d, `${d} je číslo, kterým dělíš. Výsledek dělení je to druhé číslo z násobení.`],
    [c - d, `To je ${c} − ${d}, tedy odčítání. Dělení se ptá, kolikrát se ${d} vejde do ${c}.`],
    [q + 1, `Zkouška: ${q + 1} × ${d} = ${(q + 1) * d}, ne ${c}.`],
    [q - 1, `Zkouška: ${q - 1} × ${d} = ${(q - 1) * d}, ne ${c}.`],
    [c, `${c} je číslo, které dělíš. Po vydělení vyjde menší číslo.`],
  ]);
  return choice(`Víš, že ${fakt}. Kolik je ${c} ÷ ${d}?`, String(q), dd, {
    hints: [
      `Dělení ${c} ÷ ${d} se ptá: kolikrát se ${d} vejde do ${c}?`,
      `Násobení ${fakt} a dělení ${c} ÷ ${d} používají stejná tři čísla. Dvě z nich už v dělení vidíš — které třetí číslo z násobení zbývá?`,
    ],
    explanation: `Když ${fakt}, pak ${c} ÷ ${d} = ${q}. Dělení je opak násobení: vrací nás k číslu, kterým se násobilo.`,
  });
}

// ── L2 — dělení pomocí násobilky ──────────────────────────────────────────

function deleni(c: number, d: number): PracticeTask {
  const q = c / d;
  const dd = tri(q, [
    [c - d, `Od ${c} jsi ${d} odečetl jen jednou. Dělení se ptá, kolikrát se ${d} do ${c} vejde.`],
    [q + 1, `Zkouška: ${d} × ${q + 1} = ${d * (q + 1)}, to je víc než ${c}.`],
    [q - 1, `Zkouška: ${d} × ${q - 1} = ${d * (q - 1)}, to je méně než ${c}.`],
    [d, `${d} je číslo, kterým dělíš, ne výsledek.`],
    [q + 2, `Zkouška: ${d} × ${q + 2} = ${d * (q + 2)}, to je víc než ${c}.`],
  ]);
  return choice(`Kolik je ${c} ÷ ${d}?`, String(q), dd, {
    hints: [
      `Převeď dělení na násobení: ${d} × ? = ${c}.`,
      `V násobilce čísla ${d} hledej příklad, jehož výsledek je ${c}. Počítej po ${d} od nuly a na prstech si hlídej, kolikrát jsi ${d} přičetl.`,
    ],
    explanation: `${d} × ${q} = ${c}, a proto ${c} ÷ ${d} = ${q}.`,
  });
}

type Rozdel = "bonbony" | "jablka" | "skupiny";

function rozdelovani(kind: Rozdel, c: number, d: number): PracticeTask {
  const q = c / d;
  let question: string;
  let rozdavej: string;
  let pocet: string;
  if (kind === "bonbony") {
    question = `Rozděl ${pluralWithNumber(c, "bonbon", "bonbony", "bonbonů")} stejně mezi ${pad(d, "DÍTĚ")}. Kolik bonbonů dostane každé dítě?`;
    rozdavej = "Rozdávej v duchu dětem bonbony po jednom, dokud nezbude žádný.";
    pocet = "počet dětí";
  } else if (kind === "jablka") {
    question = `Rozděl ${pad(c, "JABLKO")} stejně do ${d} košíků. Kolik jablek bude v každém?`;
    rozdavej = "Dávej jablka do košíků po jednom, dokud nezbude žádné.";
    pocet = "počet košíků";
  } else {
    question = `${pad(c, "DÍTĚ")} se rozdělí do ${d} stejných skupin. Kolik dětí bude v každé?`;
    rozdavej = "Posílej děti do skupin po jednom, dokud nebudou rozdělené všechny.";
    pocet = "počet skupin";
  }
  const dd = tri(q, [
    [c - d, `Od ${c} jsi odečetl ${d}. Rozdělování na stejné díly je ale dělení ${c} ÷ ${d}.`],
    [q + 1, `Zkouška: ${d} × ${q + 1} = ${d * (q + 1)}, ale rozdělovat máš jen ${c}.`],
    [q - 1, `Zkouška: ${d} × ${q - 1} = ${d * (q - 1)}, to je méně než ${c} — něco by zbylo.`],
    [d, `${d} je ${pocet}, ne kolik připadne na jeden díl.`],
  ]);
  return choice(question, String(q), dd, {
    hints: [
      `Rozdělování na stejné díly je dělení: ${c} ÷ ${d}.`,
      `${rozdavej} Rychleji to jde násobilkou: které číslo krát ${d} dá ${c}?`,
    ],
    explanation: `${c} ÷ ${d} = ${q}, protože ${d} × ${q} = ${c}.`,
  });
}

// ── L3 — chybějící činitel, chybějící dělitel, dělení po skupinách ────────

function chybiCinitel(t: number, c: number): PracticeTask {
  const n = c / t;
  const dd = tri(n, [
    [n - 1, `Zkouška: ${t} × ${n - 1} = ${t * (n - 1)}, to je málo.`],
    [n + 1, `Zkouška: ${t} × ${n + 1} = ${t * (n + 1)}, to je moc.`],
    [c - t, `To je ${c} − ${t}. Hledáš ale, kolikrát se ${t} vejde do ${c}.`],
    [n + 2, `Zkouška: ${t} × ${n + 2} = ${t * (n + 2)}, to je moc.`],
  ]);
  return choice(`${t} × ? = ${c}`, String(n), dd, {
    hints: [
      `Kolikrát musíš vzít ${t}, aby vyšlo ${c}?`,
      `Chybějící činitel najdeš dělením: vyděl ${c} číslem ${t}. Pomůže násobilka ${t}: přičítej ${t} od nuly, dokud nedojdeš k ${c}, a počítej kroky.`,
    ],
    explanation: `${t} × ${n} = ${c}, a proto na místo otazníku patří ${n}. Chybějící činitel je ${c} ÷ ${t}.`,
  });
}

function chybiDelitel(c: number, q: number): PracticeTask {
  const d = c / q;
  const dd = tri(d, [
    [c - q, `To je ${c} − ${q}, tedy odčítání. Hledáš číslo, kterým se ${c} dělí.`],
    [d - 1, `Zkouška: ${d - 1} × ${q} = ${(d - 1) * q}, ne ${c}.`],
    [d + 1, `Zkouška: ${d + 1} × ${q} = ${(d + 1) * q}, ne ${c}.`],
    [d + 2, `Zkouška: ${d + 2} × ${q} = ${(d + 2) * q}, ne ${c}.`],
  ]);
  return choice(`${c} ÷ ? = ${q}`, String(d), dd, {
    hints: [
      `Kolika musíš vydělit ${c}, aby vyšlo ${q}?`,
      `Dělení obrať na násobení: ? × ${q} = ${c}. Hledej číslo, které vynásobené číslem ${q} dá ${c}; zkoušej je postupně od nejmenšího.`,
    ],
    explanation: `${d} × ${q} = ${c}, a proto ${c} ÷ ${d} = ${q}. Na místo otazníku patří ${d}.`,
  });
}

function rady(c: number, g: number): PracticeTask {
  const n = c / g;
  const zidli = plural(g, "židli", "židlích", "židlích");
  const dd = tri(n, [
    [n - 1, `Zkouška: ${n - 1} × ${g} = ${(n - 1) * g}, židle by ještě zbyly.`],
    [n + 1, `Zkouška: ${n + 1} × ${g} = ${(n + 1) * g}, tolik židlí nemáš.`],
    [c - g, `Od ${c} jsi odečetl jednu řadu. Ptáme se, kolik řad postavíš ze všech židlí.`],
    [g, `${g} je počet židlí v jedné řadě, ne počet řad.`],
  ]);
  return choice(`Máš ${pluralWithNumber(c, "židli", "židle", "židlí")}. Kolik řad po ${g} ${zidli} postavíš?`, String(n), dd, {
    hints: [
      `Kolikrát se ${g} vejde do ${c}?`,
      `Počet řad zjistíš dělením ${c} ÷ ${g}. V násobilce ${g} najdi příklad, který dá ${c}: ${g} × ? = ${c}.`,
    ],
    explanation: `${c} ÷ ${g} = ${n}, protože ${n} × ${g} = ${c}. Dělením po skupinách zjistíš, kolik skupin (řad) se dá postavit.`,
  });
}

// ── Banky úrovní (disjunktní dvojice čísel, dělenci do 50) ───────────────

const L1: [number, number][] = [
  [4, 5], [3, 4], [6, 2], [7, 3], [8, 5], [9, 2], [5, 4], [6, 3], [8, 4], [7, 5], [4, 3], [9, 5], [3, 2], [10, 3],
];
const L2_DELENI: [number, number][] = [[16, 2], [27, 3], [24, 4], [30, 5], [14, 2], [15, 3], [36, 4], [25, 5], [50, 5]];
const L2_ROZDEL: [Rozdel, number, number][] = [
  ["bonbony", 10, 2], ["bonbony", 24, 3], ["jablka", 16, 4], ["jablka", 9, 3], ["skupiny", 28, 4], ["skupiny", 15, 5],
];
const L3_CINITEL: [number, number][] = [[3, 24], [4, 36], [5, 35], [2, 18], [5, 40]];
const L3_DELITEL: [number, number][] = [[24, 6], [30, 6], [18, 9], [27, 9], [32, 8], [45, 9]];
const L3_RADY: [number, number][] = [[35, 5], [24, 4], [18, 3], [16, 2]];

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? L1.map(([q, d], i) => zNasobeni(q, d, i % 2 === 1))
    : level === 2
      ? [...L2_DELENI.map(([c, d]) => deleni(c, d)), ...L2_ROZDEL.map(([k, c, d]) => rozdelovani(k, c, d))]
      : [
        ...L3_CINITEL.map(([t, c]) => chybiCinitel(t, c)),
        ...L3_DELITEL.map(([c, q]) => chybiDelitel(c, q)),
        ...L3_RADY.map(([c, g]) => rady(c, g)),
      ];
  return shuffle(tasks);
}

export const VZTAHNASOBENIADELENI: TopicMetadata[] = [
  {
    id: "g2-mat-vztah-nasobeni-deleni",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-vztah-nasobeni-a-deleni",
    title: "Vztah násobení a dělení",
    studentTitle: "Krát a děleno",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Pochopíš, jak násobení a dělení spolu souvisí.",
    keywords: ["dělení", "násobení", "vztah", "dělení s násobilkou"],
    goals: [
      "Pochopit dělení jako opak násobení.",
      "Řešit příklady dělení pomocí násobilky 2–5.",
      "Najít chybějící faktor v násobení.",
    ],
    boundaries: ["Dělenci do 50.", "Pouze tabulky 2–5."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Dělení je opak násobení — použij násobilku.",
      steps: [
        "Přečti příklad: 12 ÷ 3 = ?",
        "Ptáš se: 3 × ? = 12",
        "Z násobilky: 3 × 4 = 12, takže odpověď je 4.",
      ],
      commonMistake: "Záměna dělence a dělitele — dávej pozor na pořadí.",
      example: "20 ÷ 5 = ? → 5 × 4 = 20 → odpověď je 4.",
    },
  },
];
