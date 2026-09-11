import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";
import { pad } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (audit 3. ročníku): L2 obsahovala všechny převody,
// takže L3 nepřinesla skoro nic nového (5 unikátních úloh z 30). Teď oddělené
// úrovně: L1 na menší jednotku (kg → g, l → dl, h → min) · L2 zpět na větší
// jednotku a l ↔ cl · L3 minuty ↔ sekundy a dny ↔ hodiny.

type Conv = { z: string; na: string; k: number; spatne: number; kolikZ?: (n: number) => string };
const KG_G: Conv = { z: "kg", na: "g", k: 1000, spatne: 100 };
const L_DL: Conv = { z: "l", na: "dl", k: 10, spatne: 100 };
const L_CL: Conv = { z: "l", na: "cl", k: 100, spatne: 10 };
const H_MIN: Conv = { z: "h", na: "min", k: 60, spatne: 100 };
const MIN_S: Conv = { z: "min", na: "s", k: 60, spatne: 100 };
const DEN_H: Conv = { z: "den", na: "h", k: 24, spatne: 12, kolikZ: (n) => pad(n, "DEN") };

const vz = (c: Conv, n: number) => (c.kolikZ ? c.kolikZ(n) : `${n} ${c.z}`);
const N = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** větší jednotky → menší (násobíme). */
function naMensi(c: Conv, n: number): PracticeTask {
  const x = n * c.k;
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${x + c.k} ${c.na}`, why: `To by odpovídalo ${vz(c, n + 1)}.` },
    { value: `${n} ${c.na}`, why: "Číslo zůstalo stejné — na menší jednotku musí vyjít větší číslo." },
    { value: `${n * c.spatne} ${c.na}`, why: `Špatný převodní vztah: 1 ${c.z} = ${c.k} ${c.na}.` },
  ];
  return choice(`${vz(c, n)} = ? ${c.na}`, `${x} ${c.na}`, d, {
    hints: [
      `Kolik ${c.na} odpovídá jednotce ${c.z}? A ty máš ${vz(c, n)}.`,
      `Na menší jednotku převádíš násobením, takže vyjde větší číslo než ${n}.`,
    ],
    explanation: `1 ${c.z} = ${c.k} ${c.na}, takže ${vz(c, n)} = ${n} × ${c.k} = ${x} ${c.na}.`,
  });
}

/** menší jednotky → větší (dělíme). */
function naVetsi(c: Conv, n: number): PracticeTask {
  const x = n * c.k;
  const vedle = n > 1 ? n - 1 : n + 2;
  const d: [Distractor, Distractor, Distractor] = [
    { value: vz(c, n + 1), why: `To by bylo ${(n + 1) * c.k} ${c.na}.` },
    { value: vz(c, vedle), why: `To by bylo ${vedle * c.k} ${c.na}.` },
    { value: vz(c, x), why: "Číslo zůstalo stejné — na větší jednotku musí vyjít menší číslo." },
  ];
  const otazka = c.kolikZ ? `Kolik dní je ${x} ${c.na}?` : `${x} ${c.na} = ? ${c.z}`;
  return choice(otazka, vz(c, n), d, {
    hints: [
      `Kolik ${c.na} odpovídá jednotce ${c.z}? Kolikrát se to vejde do ${x} ${c.na}?`,
      `Na větší jednotku převádíš dělením, takže vyjde menší číslo než ${x}.`,
    ],
    explanation: `1 ${c.z} = ${c.k} ${c.na}, takže ${x} ${c.na} = ${x} ÷ ${c.k} = ${vz(c, n)}.`,
  });
}

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? [KG_G, L_DL, H_MIN].flatMap((c) => N.map((n) => naMensi(c, n)))
    : level === 2
      ? [...[KG_G, L_DL, H_MIN].flatMap((c) => N.map((n) => naVetsi(c, n))), ...N.map((n) => naMensi(L_CL, n)), ...N.map((n) => naVetsi(L_CL, n))]
      : [MIN_S, DEN_H].flatMap((c) => N.flatMap((n) => [naMensi(c, n), naVetsi(c, n)]));
  return shuffle(tasks).slice(0, 40);
}

export const PREVODYJEDNOTEKHMOTNOSTIOBJEMCAS: TopicMetadata[] = [
  {
    id: "g3-mat-prevody-hmotnost-objem-cas",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-prevody-jednotek-hmotnosti-objemu-casu",
    title: "Převody jednotek hmotnosti, objemu, času",
    studentTitle: "Převody vah a času",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Převedeš kilogramy, litry a hodiny na menší jednotky.",
    keywords: ["kg", "g", "litr", "dl", "hodina", "minuta", "převody", "hmotnost", "objem", "čas"],
    goals: [
      "Znát: 1 kg = 1000 g, 1 l = 10 dl, 1 h = 60 min, 1 min = 60 s.",
      "Převádět jednotky hmotnosti, objemu a času.",
      "Použít převody v praktických situacích.",
    ],
    boundaries: ["Celá čísla, bez desetinných.", "Nezahrnuje složené časové výrazy (h + min)."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka: 1 kg = 1000 g | 1 l = 10 dl = 100 cl | 1 h = 60 min | 1 min = 60 s | 1 den = 24 h.",
      steps: [
        "Na menší jednotku → násobíme.",
        "Na větší jednotku → dělíme.",
        "Čas: hodiny × 60 = minuty, minuty × 60 = sekundy.",
      ],
      commonMistake: "1 l = 10 dl (ne 100 dl) — pozor na záměnu s centilitry (1 l = 100 cl).",
      example: "3 kg = ? g: 1 kg = 1000 g → 3 × 1000 = 3000 g.",
    },
  },
];
