import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku): úrovně se překrývaly (L1 násobilky
// 2–5, L2 2–7, L3 2–10), takže L2 přinesla málo nových úloh (poměr 0,59).
// Teď oddělené úrovně:
// L1 násobení 2–5 · L2 dělení 2–5 a násobení 6–7 · L3 násobení 8–10
// a dělení 6–10.

function prvni3(kandidati: Distractor[], spravne: string): [Distractor, Distractor, Distractor] {
  const videno = new Set([spravne]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    if (Number(k.value) <= 0 || videno.has(k.value)) continue;
    videno.add(k.value);
    out.push(k);
    if (out.length === 3) break;
  }
  return out as [Distractor, Distractor, Distractor];
}

function nasob(t: number, n: number): PracticeTask {
  const x = t * n;
  // Distraktory jen z malé násobilky (dřív se u n = 10 objevilo „7 × 11").
  const d = prvni3([
    ...(n < 10 ? [{ value: String(t * (n + 1)), why: `To je ${t} × ${n + 1}, tedy o ${t} víc, než má vyjít.` }] : []),
    { value: String(t + n), why: `Čísla ${t} a ${n} jsi sečetl, ale máš je vynásobit.` },
    { value: String(t * (n - 1)), why: `To je ${t} × ${n - 1}, tedy o ${t} méně, než má vyjít.` },
    ...(n < 9 ? [{ value: String(t * (n + 2)), why: `To je ${t} × ${n + 2} — přičetl jsi číslo ${t} o dvakrát víc, než máš.` }] : []),
    { value: String(x + 1), why: `${x + 1} v řadě násobků čísla ${t} vůbec není — výsledek musí být jejím členem.` },
  ], String(x));
  // Vysvětlení říká PROČ: malé n rozepíše jako součet, větší n rozloží přes pětinásobek.
  const explanation = n <= 5
    ? `${t} × ${n} znamená sečíst ${n}krát číslo ${t}: ${Array.from({ length: n }, () => t).join(" + ")} = ${x}.`
    : `${t} × 5 = ${5 * t} a ${t} × ${n - 5} = ${t * (n - 5)}. Dohromady ${5 * t} + ${t * (n - 5)} = ${x}, proto ${t} × ${n} = ${x}.`;
  return choice(`${t} × ${n} = ?`, String(x), d, {
    hints: [
      `Řekni si řadu násobků čísla ${t} a zastav se u ${n}. čísla v řadě.`,
      `${t} × ${n} je totéž jako ${n} × ${t}. Vyber si pořadí, které znáš lépe, a přičítej postupně po ${t}, dokud nesečteš ${n} stejných čísel.`,
    ],
    explanation,
  });
}

function del(t: number, n: number): PracticeTask {
  const x = t * n;
  const d = prvni3([
    { value: String(n + 1), why: `Zkouška: ${t} × ${n + 1} = ${t * (n + 1)}, ne ${x}.` },
    { value: String(n - 1), why: `Zkouška: ${t} × ${n - 1} = ${t * (n - 1)}, ne ${x}.` },
    { value: String(t), why: "To je dělitel, ne výsledek." },
    { value: String(n + 2), why: `Zkouška: ${t} × ${n + 2} = ${t * (n + 2)}, ne ${x}.` },
    { value: String(n + 3), why: `Zkouška: ${t} × ${n + 3} = ${t * (n + 3)}, ne ${x}.` },
  ], String(n));
  // Nápovědy nesou dělitele i dělence, takže jsou pro každý příklad jiné
  // (dřív se „dělitel × ? = 24" opakovalo u 24 ÷ 3, 24 ÷ 4, 24 ÷ 6 i 24 ÷ 8).
  // U t = n (16 ÷ 4) by dělitel v nápovědě byl zároveň výsledkem — tam se
  // ptáme na číslo vynásobené samo sebou.
  const hints: [string, string] = t === n
    ? [
      `Které číslo vynásobené samo sebou dá ${x}?`,
      `Dělení je opak násobení. Zkoušej v malé násobilce násobit čísla sama sebou, dokud ti nevyjde přesně ${x}.`,
    ]
    : [
      `Jakým číslem musíš vynásobit ${t}, abys dostal ${x}? Hledáš ${t} × ? = ${x}.`,
      `Dělení je opak násobení. Říkej násobky čísla ${t} a na prstech počítej, kolikátý v řadě je ${x} — tolikrát se ${t} vejde do ${x}.`,
    ];
  return choice(`${x} ÷ ${t} = ?`, String(n), d, {
    hints,
    explanation: `${x} ÷ ${t} = ${n}, protože ${t} × ${n} = ${x}.`,
  });
}

const NN = [2, 3, 4, 5, 6, 7, 8, 9, 10];

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? [2, 3, 4, 5].flatMap((t) => NN.map((n) => nasob(t, n)))
    : level === 2
      ? [...[2, 3, 4, 5].flatMap((t) => NN.map((n) => del(t, n))), ...[6, 7].flatMap((t) => NN.map((n) => nasob(t, n)))]
      : [...[8, 9, 10].flatMap((t) => NN.map((n) => nasob(t, n))), ...[6, 7, 8, 9, 10].flatMap((t) => NN.map((n) => del(t, n)))];
  return shuffle(tasks).slice(0, 40);
}

export const NASOBENIADELENIMALANASOBILKA: TopicMetadata[] = [
  {
    id: "g3-mat-nasobeni-deleni-mala-nasobilka",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobeni-a-deleni-v-oboru-male-nasobilky",
    title: "Násobení a dělení v oboru malé násobilky",
    studentTitle: "Násobení a dělení",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Procvičíš násobení a dělení v malé násobilce (do 10 × 10).",
    keywords: ["násobení", "dělení", "násobilka", "malá násobilka", "součin", "podíl"],
    goals: [
      "Zvládnout násobení v oboru malé násobilky.",
      "Zvládnout dělení jako opačnou operaci k násobení.",
      "Propojit násobení a dělení: 3 × 4 = 12 → 12 ÷ 3 = 4.",
    ],
    boundaries: ["Pouze malá násobilka (1–10).", "Bez zbytku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Násobení a dělení jsou opačné operace: 4 × 3 = 12 → 12 ÷ 4 = 3 a 12 ÷ 3 = 4.",
      steps: [
        "Pro násobení: vybav si příslušnou násobilku.",
        "Pro dělení: přemysli, čím se dělí — hledáš chybějící číslo v násobilce.",
        "Zkouška: výsledek × dělitel musí dát dělenec.",
      ],
      commonMistake: "Záměna pořadí při dělení: 12 ÷ 4 ≠ 4 ÷ 12.",
      example: "24 ÷ 6 = ?: hledám 6 × ? = 24. Násobilka 6: 6×4=24. Výsledek: 4.",
    },
  },
];
