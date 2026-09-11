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
  const d = prvni3([
    { value: String(t * (n + 1)), why: `To je ${t} × ${n + 1}.` },
    { value: String(t + n), why: "Čísla jsi sečetl, ne vynásobil." },
    { value: String(t * (n - 1)), why: `To je ${t} × ${n - 1}.` },
    { value: String(t * (n + 2)), why: `To je ${t} × ${n + 2}.` },
    { value: String(x + 1), why: `Výsledek musí být v násobilce čísla ${t}.` },
  ], String(x));
  return choice(`${t} × ${n} = ?`, String(x), d, {
    hints: [
      `Řekni si řadu násobků čísla ${t} a zastav se u ${n}. čísla v řadě.`,
      `${t} × ${n} je totéž jako ${n} × ${t} — vyber si pořadí, které znáš lépe.`,
    ],
    explanation: `${t} × ${n} = ${x}.`,
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
  return choice(`${x} ÷ ${t} = ?`, String(n), d, {
    hints: [
      `Hledáš chybějící číslo v násobilce: dělitel × ? = ${x}.`,
      `Dělení je opak násobení — projdi násobilku dělitele, dokud nenarazíš na ${x}.`,
    ],
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
