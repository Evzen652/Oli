import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildUniqueOptions, shuffleOptions } from "@/lib/content/uniqueOptions";

// Bez obrázků — úlohy jsou textové/číselné reprezentace dat z tabulek.

/**
 * Systémové dluhy Balík 1C (2026-07-10): `values()` vracelo vždy stejné 4 čísla
 * pro každý dataset → reálně jen 3 datasety × pár otázkových vzorů, žádná
 * parametrizace (CONTENT_AUTHORING.md 5.3). Teď se hodnoty generují náhodně
 * (s garancí jednoznačného maxima/minima), disjunktní podle dovednosti:
 *
 *   L1 — celkový součet / přímé přečtení jedné hodnoty.
 *   L2 — najdi položku s největší / nejmenší hodnotou.
 *   L3 — rozdíl max−min NEBO "o kolik víc" mezi dvěma náhodnými položkami.
 */

interface Dataset {
  name: string;
  items: string[];
  min: number;
  max: number;
}

const DATASETS: Dataset[] = [
  { name: "oblíbené ovoce ve třídě", items: ["Jablka", "Banány", "Pomeranče", "Jahody"], min: 3, max: 20 },
  { name: "počet knih přečtených za měsíc", items: ["Leden", "Únor", "Březen", "Duben"], min: 2, max: 15 },
  { name: "způsob dopravy do školy", items: ["Pěšky", "Autobusem", "Autem", "Na kole"], min: 2, max: 25 },
  { name: "prodej vstupenek na koncert", items: ["Pondělí", "Úterý", "Středa", "Čtvrtek"], min: 5, max: 40 },
];

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Vygeneruje hodnoty s garantovaně jednoznačným maximem i minimem (bez remíz). */
function genValues(ds: Dataset): number[] {
  for (let attempt = 0; attempt < 20; attempt++) {
    const values = ds.items.map(() => randInt(ds.min, ds.max));
    const max = Math.max(...values);
    const min = Math.min(...values);
    if (values.filter((v) => v === max).length === 1 && values.filter((v) => v === min).length === 1) {
      return values;
    }
  }
  // Fallback: vynutíme unikátnost drobnou úpravou.
  const values = ds.items.map((_, i) => ds.min + i * Math.max(1, Math.floor((ds.max - ds.min) / ds.items.length)));
  return values;
}

interface Table {
  ds: Dataset;
  values: number[];
  context: string;
}

function makeTable(): Table {
  const ds = DATASETS[randInt(0, DATASETS.length - 1)];
  const values = genValues(ds);
  const context = `Tabulka „${ds.name}": ${ds.items.map((k, j) => `${k}: ${values[j]}`).join(", ")}.`;
  return { ds, values, context };
}

function makeNumberOptions(correct: number): string[] {
  const distractors = [String(correct + 2), String(Math.max(0, correct - 1)), String(correct + 5)];
  const fallbacks = [String(Math.max(0, correct - 5)), String(correct + 1), String(correct + 10), String(Math.max(0, correct - 2))];
  const { options } = buildUniqueOptions(String(correct), distractors, fallbacks, 4);
  return shuffleOptions(options);
}

// ── L1 — součet / přímé čtení ────────────────────────────────────────────────

function makeSumTask(): PracticeTask {
  const t = makeTable();
  const total = t.values.reduce((a, b) => a + b, 0);
  return {
    question: `${t.context}\nJaký je celkový součet?`,
    correctAnswer: String(total),
    options: makeNumberOptions(total),
    hints: ["Sečti všechna čísla v tabulce."],
    solutionSteps: [`${t.values.join(" + ")} = ${total}`],
  };
}

function makeReadTask(): PracticeTask {
  const t = makeTable();
  const idx = randInt(0, t.ds.items.length - 1);
  const correct = t.values[idx];
  return {
    question: `${t.context}\nJaká je hodnota u položky „${t.ds.items[idx]}"?`,
    correctAnswer: String(correct),
    options: makeNumberOptions(correct),
    hints: ["Najdi v tabulce správnou položku a přečti její hodnotu."],
    solutionSteps: [`Položka „${t.ds.items[idx]}" má hodnotu ${correct}.`],
  };
}

// ── L2 — maximum / minimum ───────────────────────────────────────────────────

function makeMaxTask(): PracticeTask {
  const t = makeTable();
  const maxIdx = t.values.indexOf(Math.max(...t.values));
  return {
    question: `${t.context}\nKterá položka má největší hodnotu?`,
    correctAnswer: t.ds.items[maxIdx],
    options: shuffle(t.ds.items.slice()),
    hints: ["Najdi největší číslo v tabulce."],
    solutionSteps: [`Největší hodnota: ${t.values[maxIdx]} → ${t.ds.items[maxIdx]}.`],
  };
}

function makeMinTask(): PracticeTask {
  const t = makeTable();
  const minIdx = t.values.indexOf(Math.min(...t.values));
  return {
    question: `${t.context}\nKterá položka má nejmenší hodnotu?`,
    correctAnswer: t.ds.items[minIdx],
    options: shuffle(t.ds.items.slice()),
    hints: ["Najdi nejmenší číslo v tabulce."],
    solutionSteps: [`Nejmenší hodnota: ${t.values[minIdx]} → ${t.ds.items[minIdx]}.`],
  };
}

// ── L3 — rozdíl max−min / "o kolik víc" mezi dvěma náhodnými položkami ──────

function makeMaxMinDiffTask(): PracticeTask {
  const t = makeTable();
  const maxIdx = t.values.indexOf(Math.max(...t.values));
  const minIdx = t.values.indexOf(Math.min(...t.values));
  const diff = t.values[maxIdx] - t.values[minIdx];
  return {
    question: `${t.context}\nJaký je rozdíl mezi největší a nejmenší hodnotou?`,
    correctAnswer: String(diff),
    options: makeNumberOptions(diff),
    hints: ["Největší − nejmenší = rozdíl."],
    solutionSteps: [`${t.values[maxIdx]} − ${t.values[minIdx]} = ${diff}`],
  };
}

function makePairDiffTask(): PracticeTask {
  const t = makeTable();
  const i1 = randInt(0, t.ds.items.length - 1);
  let i2 = randInt(0, t.ds.items.length - 1);
  while (i2 === i1) i2 = randInt(0, t.ds.items.length - 1);
  const [hiIdx, loIdx] = t.values[i1] >= t.values[i2] ? [i1, i2] : [i2, i1];
  const diff = t.values[hiIdx] - t.values[loIdx];
  return {
    question: `${t.context}\nO kolik má „${t.ds.items[hiIdx]}" větší hodnotu než „${t.ds.items[loIdx]}"?`,
    correctAnswer: String(diff),
    options: makeNumberOptions(diff),
    hints: [`Odečti: hodnota u „${t.ds.items[hiIdx]}" − hodnota u „${t.ds.items[loIdx]}".`],
    solutionSteps: [`${t.values[hiIdx]} − ${t.values[loIdx]} = ${diff}`],
  };
}

function gen(level: number): PracticeTask[] {
  const count = 20;
  if (level === 1) return Array.from({ length: count }, () => (Math.random() < 0.5 ? makeSumTask() : makeReadTask()));
  if (level === 2) return Array.from({ length: count }, () => (Math.random() < 0.5 ? makeMaxTask() : makeMinTask()));
  return Array.from({ length: count }, () => (Math.random() < 0.5 ? makeMaxMinDiffTask() : makePairDiffTask()));
}

export const TABULKY_DIAGRAMY: TopicMetadata[] = [
  {
    id: "g4-mat-tabulky-diagramy-4",
    rvpNodeId: "g4-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-diagramy-sloupcovy-kruhovy",
    displayName: "Tabulky a grafy",
    title: "Tabulky a diagramy",
    studentTitle: "Tabulky a grafy",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky a poznáš různé grafy.",
    keywords: [
      "tabulka", "sloupcový diagram", "kruhový diagram",
      "čtení dat", "interpretace grafu", "největší hodnota", "celkový součet",
    ],
    goals: [
      "Přečíst a porovnat data z tabulky.",
      "Určit celkový součet, maximum a minimum.",
      "Porozumět, co zobrazuje sloupcový a kruhový diagram.",
    ],
    boundaries: [
      "Pouze textové/číselné reprezentace dat (bez skutečných obrázků grafů).",
      "Nezahrnuje tvorbu grafu ani výpočet procent pro kruhový diagram.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4"],
    generator: gen,
    helpTemplate: {
      hint: "Tabulka přehledně ukazuje data. Pro každou otázku najdi správný řádek/sloupec a přečti hodnotu.",
      steps: [
        "Přečti záhlaví tabulky (co je v řádcích, co ve sloupcích).",
        "Pro celkový součet: sečti všechna čísla.",
        "Pro maximum: najdi největší číslo.",
        "Pro minimum: najdi nejmenší číslo.",
      ],
      commonMistake: "Záměna řádků a sloupců — vždy nejdříve zkontroluj záhlaví.",
      example: "Tabulka: Jablka=8, Banány=5, Pomeranče=7. Celkem = 20. Maximum = Jablka (8).",
    },
  },
];
