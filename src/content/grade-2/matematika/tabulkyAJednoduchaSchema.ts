import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, form } from "@/lib/czechGrammar";
import { buildUniqueOptions, shuffleOptions } from "@/lib/content/uniqueOptions";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Systémové dluhy Balík 1C (2026-07-10): parametrizace z rozsahu čísel místo
 * pevného seznamu 24 vět (CONTENT_AUTHORING.md 5.3). `_level` byl dřív úplně
 * ignorován (žádná gradace). Teď disjunktní podle dovednosti:
 *
 *   L1 — součet dvou hodnot z tabulky, čísla do 20.
 *   L2 — chybějící hodnota (dáno celkem + 1 část, dopočítej druhou), čísla do 50.
 *   L3 — tabulka se 3 řádky (součet tří hodnot) NEBO porovnání "o kolik víc"
 *        (dvoukrokové: najdi rozdíl), čísla do 100.
 */

function makeOptions(correct: number): string[] {
  const distractors = [
    String(correct + 1),
    String(Math.max(0, correct - 1)),
    String(correct + 10),
  ];
  const fallbacks = [
    String(Math.max(0, correct - 10)),
    String(correct + 2),
    String(Math.max(0, correct - 2)),
    String(correct + 5),
  ];
  const { options } = buildUniqueOptions(String(correct), distractors, fallbacks, 4);
  return shuffleOptions(options);
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// ── L1 — součet dvou hodnot ──────────────────────────────────────────────────

const L1_CONTEXTS: { label1: string; label2: string; noun: string }[] = [
  { label1: "V pondělí bylo", label2: "v úterý", noun: "JABLKO" },
  { label1: "Ve třídě bylo", label2: "ve vedlejší třídě bylo", noun: "ŽÁK" },
  { label1: "Na parkovišti stálo", label2: "přijelo ještě", noun: "AUTO" },
  { label1: "V krabici bylo", label2: "přidali jsme ještě", noun: "KOSTKA" },
  { label1: "V pytlíku bylo", label2: "dokoupili jsme ještě", noun: "KULIČKA" },
];

function makeL1Task(): PracticeTask {
  const ctx = L1_CONTEXTS[randInt(0, L1_CONTEXTS.length - 1)];
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const correct = a + b;
  const question = `${ctx.label1} ${pad(a, ctx.noun)}, ${ctx.label2} ${pad(b, ctx.noun)}. Kolik ${form(5, ctx.noun)} bylo celkem?`;
  return {
    question,
    correctAnswer: String(correct),
    options: makeOptions(correct),
    hints: [`Přidej ${a} a ${b} dohromady. Kolik je ${a} + ${b}?`],
    solutionSteps: [`${a} + ${b} = ${correct}.`],
  };
}

// ── L2 — chybějící hodnota (celkem − část = druhá část) ─────────────────────

interface L2Category {
  totalNoun: string;
  part1: string;
  part2: string;
}

const L2_CATEGORIES: L2Category[] = [
  { totalNoun: "KULIČKA", part1: "Modrých", part2: "červených" },
  { totalNoun: "ŽÁK", part1: "Kluků", part2: "dívek" },
  { totalNoun: "AUTO", part1: "Osobních", part2: "nákladních" },
  { totalNoun: "KRABICE", part1: "Velkých", part2: "malých" },
];

function makeL2Task(): PracticeTask {
  const cat = L2_CATEGORIES[randInt(0, L2_CATEGORIES.length - 1)];
  const total = randInt(20, 50);
  const part = randInt(5, total - 5);
  const correct = total - part;
  const question = `Celkem je ${pad(total, cat.totalNoun)}. ${cat.part1} je ${part}. Kolik je ${cat.part2}?`;
  return {
    question,
    correctAnswer: String(correct),
    options: makeOptions(correct),
    hints: [`Celkem ${total}, ${cat.part1.toLowerCase()} ${part}. Odečti: ${total} − ${part} = ?`],
    solutionSteps: [`${total} − ${part} = ${correct}.`],
  };
}

// ── L3 — tabulka o 3 řádcích (součet) NEBO rozdíl ("o kolik víc") ───────────

const L3_TABLE_NOUNS = ["ŽÁK", "AUTO", "JABLKO", "KULIČKA"];
const L3_DAYS = ["pondělí", "úterý", "středa"];

function makeL3SumTask(): PracticeTask {
  const noun = L3_TABLE_NOUNS[randInt(0, L3_TABLE_NOUNS.length - 1)];
  const a = randInt(5, 30);
  const b = randInt(5, 30);
  const c = randInt(5, 30);
  const correct = a + b + c;
  const question = `V tabulce: ${L3_DAYS[0]} ${a}, ${L3_DAYS[1]} ${b}, ${L3_DAYS[2]} ${c} ${form(5, noun)}. Kolik jich bylo celkem?`;
  return {
    question,
    correctAnswer: String(correct),
    options: makeOptions(correct),
    hints: [`Přidej ${a} + ${b} + ${c} dohromady.`],
    solutionSteps: [`${a} + ${b} + ${c} = ${correct}.`],
  };
}

const L3_NAMES: [string, string][] = [
  ["Jan", "Eva"],
  ["Petr", "Tereza"],
  ["Filip", "Karolína"],
  ["Adam", "Barbora"],
];

function makeL3DiffTask(): PracticeTask {
  const [name1, name2] = L3_NAMES[randInt(0, L3_NAMES.length - 1)];
  const p1 = randInt(10, 60);
  const p2 = p1 + randInt(3, 30);
  const correct = p2 - p1;
  const question = `${name1} má ${pad(p1, "BOD")}, ${name2} má ${pad(p2, "BOD")}. O kolik ${form(5, "BOD")} má ${name2} víc?`;
  return {
    question,
    correctAnswer: String(correct),
    options: makeOptions(correct),
    hints: [`Odečti: ${p2} − ${p1} = ? Tolik bodů má ${name2} navíc.`],
    solutionSteps: [`${p2} − ${p1} = ${correct} — ${name2} má o ${pad(correct, "BOD")} víc než ${name1}.`],
  };
}

function gen(level: number): PracticeTask[] {
  const count = 20;
  if (level === 1) return Array.from({ length: count }, makeL1Task);
  if (level === 2) return Array.from({ length: count }, makeL2Task);
  return Array.from({ length: count }, () => (Math.random() < 0.5 ? makeL3SumTask() : makeL3DiffTask()));
}

export const TABULKYAJEDNODUCHASHEMA: TopicMetadata[] = [
  {
    id: "g2-mat-tabulky",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-a-jednoducha-schemata",
    title: "Tabulky a jednoduchá schémata",
    studentTitle: "Tabulky",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky a spočítáš výsledek.",
    keywords: ["tabulka", "schéma", "data", "čtení tabulky", "součet"],
    goals: [
      "Přečíst hodnoty z jednoduché tabulky.",
      "Sečíst nebo odečíst hodnoty z tabulky.",
      "Najít chybějící hodnotu v tabulce.",
    ],
    boundaries: ["Pouze 2–3 řádky.", "Čísla do 100."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi čísla v tabulce a sečti nebo odečti.",
      steps: [
        "Přečti všechna čísla v tabulce.",
        "Urči, zda sčítáš nebo hledáš rozdíl.",
        "Spočítej.",
      ],
      commonMistake: "Přehlédnutí jedné hodnoty — pročti tabulku znovu.",
      example: "Pondělí: 3, Úterý: 5. Celkem: 3 + 5 = 8.",
    },
  },
];
