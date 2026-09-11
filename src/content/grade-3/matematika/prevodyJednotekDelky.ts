import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku): úrovně byly překrývající se výřezy
// tabulky převodů, takže L2 a L3 přinesly málo nových úloh (poměr 0,40 a 0,48).
// Teď oddělené úrovně:
// L1 na menší jednotku po desítkách (cm → mm, dm → cm, m → dm) ·
// L2 zpět na větší jednotku po desítkách a m → cm · L3 km ↔ m a cm → m.

type Conv = { z: string; na: string; k: number };
const CM_MM: Conv = { z: "cm", na: "mm", k: 10 };
const DM_CM: Conv = { z: "dm", na: "cm", k: 10 };
const M_DM: Conv = { z: "m", na: "dm", k: 10 };
const M_CM: Conv = { z: "m", na: "cm", k: 100 };
const KM_M: Conv = { z: "km", na: "m", k: 1000 };

const N = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** n větších jednotek → menší jednotky (násobíme). */
function naMensi(c: Conv, n: number): PracticeTask {
  const x = n * c.k;
  const jinyVztah = c.k === 10 ? 100 : 10;
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${x + c.k} ${c.na}`, why: `To by odpovídalo ${n + 1} ${c.z}.` },
    { value: `${n} ${c.na}`, why: "Číslo zůstalo stejné — na menší jednotku musí vyjít větší číslo." },
    { value: `${n * jinyVztah} ${c.na}`, why: `Špatný převodní vztah: 1 ${c.z} = ${c.k} ${c.na}.` },
  ];
  return choice(`${n} ${c.z} = ? ${c.na}`, `${x} ${c.na}`, d, {
    hints: [
      `Kolik ${c.na} odpovídá jednotce ${c.z}? A ty máš ${n} ${c.z}.`,
      `Na menší jednotku převádíš násobením, takže vyjde větší číslo než ${n}.`,
    ],
    explanation: `1 ${c.z} = ${c.k} ${c.na}, takže ${n} ${c.z} = ${n} × ${c.k} = ${x} ${c.na}.`,
  });
}

/** menší jednotky → větší jednotky (dělíme). */
function naVetsi(c: Conv, n: number): PracticeTask {
  const x = n * c.k;
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${n + 1} ${c.z}`, why: `To by bylo ${(n + 1) * c.k} ${c.na}.` },
    { value: `${n > 1 ? n - 1 : n + 2} ${c.z}`, why: `To by bylo ${(n > 1 ? n - 1 : n + 2) * c.k} ${c.na}.` },
    { value: `${x} ${c.z}`, why: "Číslo zůstalo stejné — na větší jednotku musí vyjít menší číslo." },
  ];
  return choice(`${x} ${c.na} = ? ${c.z}`, `${n} ${c.z}`, d, {
    hints: [
      `Kolik ${c.na} odpovídá jednotce ${c.z}? Kolikrát se to vejde do ${x} ${c.na}?`,
      `Na větší jednotku převádíš dělením, takže vyjde menší číslo než ${x}.`,
    ],
    explanation: `1 ${c.z} = ${c.k} ${c.na}, takže ${x} ${c.na} = ${x} ÷ ${c.k} = ${n} ${c.z}.`,
  });
}

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? [CM_MM, DM_CM, M_DM].flatMap((c) => N.map((n) => naMensi(c, n)))
    : level === 2
      ? [...[CM_MM, DM_CM, M_DM].flatMap((c) => N.map((n) => naVetsi(c, n))), ...N.map((n) => naMensi(M_CM, n))]
      : [...N.map((n) => naMensi(KM_M, n)), ...N.map((n) => naVetsi(KM_M, n)), ...N.map((n) => naVetsi(M_CM, n))];
  return shuffle(tasks);
}

export const PREVODYJEDNOTEKDELKY: TopicMetadata[] = [
  {
    id: "g3-mat-prevody-delky",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-prevody-jednotek-delky-mm-cm-dm-m-km",
    title: "Převody jednotek délky (mm, cm, dm, m, km)",
    studentTitle: "Převody délky",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Převedeš milimetry, centimetry, decimetry, metry a kilometry.",
    keywords: ["mm", "cm", "dm", "m", "km", "převody", "délka", "jednotky délky"],
    goals: [
      "Znát vztahy: 1 cm = 10 mm, 1 dm = 10 cm, 1 m = 100 cm, 1 km = 1000 m.",
      "Převádět jednotky délky na větší i menší.",
      "Použít převody v praktických úlohách.",
    ],
    boundaries: ["Celá čísla, bez desetinných.", "Nezahrnuje sčítání různých jednotek."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka: 1 cm = 10 mm | 1 dm = 10 cm | 1 m = 100 cm = 10 dm | 1 km = 1000 m.",
      steps: [
        "Zapamatuj si: × 10 pro každý menší řád délky.",
        "Na větší jednotku → dělíme.",
        "Na menší jednotku → násobíme.",
      ],
      commonMistake: "1 m ≠ 10 cm — 1 m = 100 cm (ne 10, to je dm).",
      example: "3 m = ? cm: 1 m = 100 cm → 3 × 100 = 300 cm.",
    },
  },
];
