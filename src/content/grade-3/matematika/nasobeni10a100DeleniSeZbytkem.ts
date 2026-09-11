import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku): L3 generovala totéž co L2
// (12 unikátních úloh z 25) a nápovědy byly jednořádkové. Teď oddělené úrovně:
// L1 násobení deseti · L2 násobení stem a dvojciferné číslo krát deset ·
// L3 dělení se zbytkem (dělitel 2–5).

function krat(n: number, m: 10 | 100): PracticeTask {
  const x = n * m;
  const d: [Distractor, Distractor, Distractor] = m === 10
    ? [
      { value: String(x + 10), why: `To je ${n + 1} × 10.` },
      { value: String(n + 10), why: "Deset jsi přičetl, ne násobil." },
      { value: String(n * 100), why: "Přidal jsi dvě nuly — to je násobení stem." },
    ]
    : [
      { value: String(n * 10), why: "Přidal jsi jen jednu nulu — to je násobení deseti." },
      { value: String(n * 1000), why: "Přidal jsi tři nuly." },
      { value: String(x + 100), why: `To je ${n + 1} × 100.` },
    ];
  return choice(`${n} × ${m} = ?`, String(x), d, {
    hints: [
      `Kolik nul přibude za číslo ${n}, když ho násobíš ${m === 10 ? "deseti" : "stem"}?`,
      m === 10
        ? `Při násobení deseti se každá číslice čísla ${n} posune o jedno místo doleva — jednotky se stanou desítkami.`
        : `Při násobení stem se každá číslice čísla ${n} posune o dvě místa doleva — jednotky se stanou stovkami.`,
    ],
    explanation: `${n} × ${m} = ${x} — za číslo ${n} připíšeme ${m === 10 ? "jednu nulu" : "dvě nuly"}.`,
  });
}

const NASOBILKA: Record<number, string> = { 2: "dvou", 3: "tří", 4: "čtyř", 5: "pěti" };

function zbytek(d: number, p: number, z: number): PracticeTask {
  const delenec = d * p + z;
  const moznosti: [Distractor, Distractor, Distractor] = [
    { value: `${p + 1} zbytek ${z}`, why: `${d} × ${p + 1} = ${d * (p + 1)}, to je víc než ${delenec}.` },
    { value: `${p - 1} zbytek ${z + d}`, why: `Zbytek musí být menší než ${d} — vešel by se tam ještě jeden násobek.` },
    { value: `${p} zbytek ${(z + 1) % d}`, why: `Zkontroluj odčítání: ${delenec} − ${d * p} = ${z}.` },
  ];
  return choice(`${delenec} ÷ ${d} = ? (může být zbytek)`, `${p} zbytek ${z}`, moznosti, {
    hints: [
      `Která čísla z násobilky ${NASOBILKA[d]} jsou blízko ${delenec}?`,
      `Najdi největší násobek dělitele, který není větší než ${delenec}. Kolikrát se dělitel vešel, to je podíl; co zbyde do ${delenec}, patří za slovo zbytek.`,
    ],
    explanation: `${d} × ${p} = ${d * p}, ${delenec} − ${d * p} = ${z}. Výsledek: ${p} zbytek ${z}. Zkouška: ${d} × ${p} + ${z} = ${delenec}.`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(Array.from({ length: 19 }, (_, i) => krat(i + 1, 10)));
  if (level === 2) {
    return shuffle([
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => krat(n, 100)),
      ...[21, 25, 34, 40, 45, 56, 67, 78, 89, 99].map((n) => krat(n, 10)),
    ]);
  }
  const vse: PracticeTask[] = [];
  for (const d of [2, 3, 4, 5]) for (let p = 2; p <= 9; p++) for (let z = 0; z < d; z++) vse.push(zbytek(d, p, z));
  return shuffle(vse).slice(0, 40);
}

export const NASOBENI10A100DELENISEZBYTKEM: TopicMetadata[] = [
  {
    id: "g3-mat-nasobeni-10-100-zbytkem",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobeni-10-100-deleni-se-zbytkem-uvod",
    title: "Násobení 10, 100; dělení se zbytkem (úvod)",
    studentTitle: "×10, ×100 a zbytek",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Naučíš se násobit 10 a 100 a dělit se zbytkem.",
    keywords: ["násobení 10", "násobení 100", "dělení se zbytkem", "zbytek", "podíl"],
    goals: [
      "Násobit číslo 10 a 100.",
      "Porozumět dělení se zbytkem.",
      "Ověřit výsledek: dělitel × podíl + zbytek = dělenec.",
    ],
    boundaries: ["Malá čísla (do 100 × 10).", "Úvod dělení se zbytkem — delitele 2–5."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Násobení 10: přidej nulu (3 × 10 = 30). Dělení se zbytkem: najdi největší násobek, který se vejde.",
      steps: [
        "× 10: číslo + nula na konci (7 × 10 = 70).",
        "× 100: číslo + dvě nuly (7 × 100 = 700).",
        "Dělení se zbytkem: najdi, kolikrát se dělitel vejde do dělenec.",
        "Zbytek = dělenec − (dělitel × podíl).",
        "Zkouška: dělitel × podíl + zbytek = dělenec.",
      ],
      commonMistake: "17 ÷ 5: 5×3=15, zbytek 17−15=2 → výsledek 3 zbytek 2 (ne 3 zbytek 7).",
      example: "23 ÷ 4: 4×5=20, zbytek 23−20=3 → výsledek 5 zbytek 3.",
    },
  },
];
