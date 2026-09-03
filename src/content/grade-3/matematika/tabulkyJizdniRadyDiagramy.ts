import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildUniqueOptions, shuffleOptions } from "@/lib/content/uniqueOptions";

/**
 * Systémové dluhy Balík 1C (2026-07-10): parametrizace z rozsahu čísel místo
 * 3 pevných datasetů × 3 pevné otázky (9 kombinací celkem, CONTENT_AUTHORING.md
 * 5.3). Hodnoty v tabulkách i jízdním řádu se teď generují náhodně v rozsahu,
 * jen kategorie (názvy řádků, téma tabulky) zůstávají jako kontext.
 *
 *   L1 — přímé čtení hodnoty z tabulky nebo "kdo/co má nejvíc/nejmíň".
 *   L2 — součet dvou hodnot z tabulky / minuty mezi dvěma zastávkami.
 *   L3 — rozdíl "o kolik víc" mezi dvěma hodnotami / celková doba jízdy
 *        přes víc zastávek (dvoukrokové sčítání).
 */

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

function makeNumberOptions(correct: number): string[] {
  const distractors = [String(correct + 1), String(Math.max(0, correct - 1)), String(correct + 10)];
  const fallbacks = [String(Math.max(0, correct - 10)), String(correct + 2), String(correct + 5), String(Math.max(0, correct - 2))];
  const { options } = buildUniqueOptions(String(correct), distractors, fallbacks, 4);
  return shuffleOptions(options);
}

// ── Datové kategorie (počty) ────────────────────────────────────────────────

interface CountCategory {
  nazev: string;
  rowHeader: string;
  valueHeader: string;
  labels: string[];
  min: number;
  max: number;
}

const COUNT_CATEGORIES: CountCategory[] = [
  { nazev: "Počty zvířat v zoo", rowHeader: "Zvíře", valueHeader: "Počet", labels: ["Lev", "Slon", "Zebra", "Opice"], min: 2, max: 15 },
  { nazev: "Prodané zmrzliny", rowHeader: "Den", valueHeader: "Počet zmrzlin", labels: ["Pondělí", "Úterý", "Středa", "Čtvrtek"], min: 5, max: 30 },
  { nazev: "Vypůjčené knihy", rowHeader: "Měsíc", valueHeader: "Počet knih", labels: ["Leden", "Únor", "Březen", "Duben"], min: 10, max: 40 },
  { nazev: "Body ve soutěži", rowHeader: "Tým", valueHeader: "Body", labels: ["Tým A", "Tým B", "Tým C", "Tým D"], min: 10, max: 50 },
];

interface CountTable {
  category: CountCategory;
  values: number[];
  context: string;
}

function makeCountTable(): CountTable {
  const category = COUNT_CATEGORIES[randInt(0, COUNT_CATEGORIES.length - 1)];
  const values = category.labels.map(() => randInt(category.min, category.max));
  const context =
    `Tabulka: ${category.nazev}\n` +
    `${category.rowHeader} | ${category.valueHeader}\n` +
    category.labels.map((l, i) => `${l} | ${values[i]}`).join("\n");
  return { category, values, context };
}

function makeCountReadTask(): PracticeTask {
  const t = makeCountTable();
  const idx = randInt(0, t.category.labels.length - 1);
  const correct = t.values[idx];
  return {
    question: `${t.context}\n\nKolik je hodnota u „${t.category.labels[idx]}"?`,
    correctAnswer: String(correct),
    options: makeNumberOptions(correct),
    hints: ["Najdi v tabulce správný řádek a přečti hodnotu vedle něj."],
    solutionSteps: [`V řádku „${t.category.labels[idx]}" je hodnota ${correct}.`],
  };
}

function makeCountExtremeTask(): PracticeTask {
  const t = makeCountTable();
  const wantMax = Math.random() < 0.5;
  const target = wantMax ? Math.max(...t.values) : Math.min(...t.values);
  const idx = t.values.indexOf(target);
  const correct = t.category.labels[idx];
  const distractors = t.category.labels.filter((_, i) => i !== idx);
  return {
    question: `${t.context}\n\n${wantMax ? "U koho/čeho je hodnota nejvyšší?" : "U koho/čeho je hodnota nejnižší?"}`,
    correctAnswer: correct,
    options: shuffle([correct, ...distractors]),
    hints: ["Porovnej všechny hodnoty v tabulce a najdi tu " + (wantMax ? "největší" : "nejmenší") + "."],
    solutionSteps: [`Hodnoty jsou ${t.values.join(", ")} — ${wantMax ? "nejvyšší" : "nejnižší"} je ${target} u „${correct}".`],
  };
}

function makeCountSumTask(): PracticeTask {
  const t = makeCountTable();
  const i1 = randInt(0, t.category.labels.length - 1);
  let i2 = randInt(0, t.category.labels.length - 1);
  while (i2 === i1) i2 = randInt(0, t.category.labels.length - 1);
  const correct = t.values[i1] + t.values[i2];
  return {
    question: `${t.context}\n\nKolik je „${t.category.labels[i1]}" a „${t.category.labels[i2]}" dohromady?`,
    correctAnswer: String(correct),
    options: makeNumberOptions(correct),
    hints: [`Sečti hodnoty u „${t.category.labels[i1]}" a „${t.category.labels[i2]}".`],
    solutionSteps: [`${t.values[i1]} + ${t.values[i2]} = ${correct}.`],
  };
}

function makeCountDiffTask(): PracticeTask {
  const t = makeCountTable();
  const i1 = randInt(0, t.category.labels.length - 1);
  let i2 = randInt(0, t.category.labels.length - 1);
  while (i2 === i1) i2 = randInt(0, t.category.labels.length - 1);
  const [hiIdx, loIdx] = t.values[i1] >= t.values[i2] ? [i1, i2] : [i2, i1];
  const correct = t.values[hiIdx] - t.values[loIdx];
  return {
    question: `${t.context}\n\nO kolik je „${t.category.labels[hiIdx]}" víc než „${t.category.labels[loIdx]}"?`,
    correctAnswer: String(correct),
    options: makeNumberOptions(correct),
    hints: [`Odečti: hodnota u „${t.category.labels[hiIdx]}" − hodnota u „${t.category.labels[loIdx]}".`],
    solutionSteps: [`${t.values[hiIdx]} − ${t.values[loIdx]} = ${correct}.`],
  };
}

// ── Jízdní řád (časy) ────────────────────────────────────────────────────────

const JIZDNI_RAD_STOPS = ["Náměstí", "Škola", "Pošta", "Nádraží", "Nemocnice"];

interface JizdniRad {
  stops: string[];
  minutesFromStart: number[];
  startHour: number;
  startMinute: number;
}

function formatTime(hour: number, minute: number): string {
  const totalMinutes = hour * 60 + minute;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function makeJizdniRad(): JizdniRad {
  const stopCount = 4;
  const stops = shuffle(JIZDNI_RAD_STOPS).slice(0, stopCount);
  const startHour = randInt(7, 15);
  const startMinute = [0, 15, 30, 45][randInt(0, 3)];
  const minutesFromStart = [0];
  for (let i = 1; i < stopCount; i++) {
    minutesFromStart.push(minutesFromStart[i - 1] + randInt(5, 20));
  }
  return { stops, minutesFromStart, startHour, startMinute };
}

function jizdniRadContext(r: JizdniRad): string {
  return (
    "Jízdní řád autobusu:\n" +
    "Zastávka | Odjezd\n" +
    r.stops.map((s, i) => `${s} | ${formatTime(r.startHour, r.startMinute + r.minutesFromStart[i])}`).join("\n")
  );
}

function makeJizdniRadReadTask(): PracticeTask {
  const r = makeJizdniRad();
  const idx = randInt(0, r.stops.length - 1);
  const correct = formatTime(r.startHour, r.startMinute + r.minutesFromStart[idx]);
  const distractors = r.stops
    .map((_, i) => formatTime(r.startHour, r.startMinute + r.minutesFromStart[i]))
    .filter((t) => t !== correct);
  return {
    question: `${jizdniRadContext(r)}\n\nV kolik hodin odjíždí autobus ze zastávky „${r.stops[idx]}"?`,
    correctAnswer: correct,
    options: shuffle([correct, ...distractors].slice(0, 4)),
    hints: ["Najdi v jízdním řádu správnou zastávku a přečti čas vedle ní."],
    solutionSteps: [`Zastávka „${r.stops[idx]}" má odjezd v ${correct}.`],
  };
}

function makeJizdniRadMinutesTask(): PracticeTask {
  const r = makeJizdniRad();
  const i1 = randInt(0, r.stops.length - 2);
  const i2 = i1 + 1;
  const correct = r.minutesFromStart[i2] - r.minutesFromStart[i1];
  return {
    question: `${jizdniRadContext(r)}\n\nKolik minut jede autobus ze zastávky „${r.stops[i1]}" na zastávku „${r.stops[i2]}"?`,
    correctAnswer: `${correct} minut`,
    options: shuffle([
      `${correct} minut`,
      `${correct + 5} minut`,
      `${Math.max(1, correct - 5)} minut`,
      `${correct + 10} minut`,
    ]),
    hints: ["Odečti čas odjezdu z první zastávky od času odjezdu z druhé zastávky."],
    solutionSteps: [`Rozdíl časů odjezdu = ${correct} minut.`],
  };
}

function makeJizdniRadTotalTask(): PracticeTask {
  const r = makeJizdniRad();
  const lastIdx = r.stops.length - 1;
  const correct = r.minutesFromStart[lastIdx];
  return {
    question: `${jizdniRadContext(r)}\n\nAutobus vyjíždí ze zastávky „${r.stops[0]}" a jede až na zastávku „${r.stops[lastIdx]}". Kolik minut trvá celá cesta?`,
    correctAnswer: `${correct} minut`,
    options: shuffle([
      `${correct} minut`,
      `${correct + 5} minut`,
      `${Math.max(1, correct - 5)} minut`,
      `${correct + 10} minut`,
    ]),
    hints: ["Sečti čas odjezdu poslední zastávky od začátku (rozdíl mezi prvním a posledním odjezdem)."],
    solutionSteps: [`Celková doba jízdy = ${correct} minut (rozdíl mezi odjezdem z první a poslední zastávky).`],
  };
}

// ── Generátor podle úrovně ──────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  const count = 20;
  if (level === 1) {
    return Array.from({ length: count }, () =>
      Math.random() < 0.5 ? makeCountReadTask() : (Math.random() < 0.5 ? makeCountExtremeTask() : makeJizdniRadReadTask()),
    );
  }
  if (level === 2) {
    return Array.from({ length: count }, () =>
      Math.random() < 0.5 ? makeCountSumTask() : makeJizdniRadMinutesTask(),
    );
  }
  return Array.from({ length: count }, () =>
    Math.random() < 0.5 ? makeCountDiffTask() : makeJizdniRadTotalTask(),
  );
}

export const TABULKYJIZDNIRADYDIAGRAMY: TopicMetadata[] = [
  {
    id: "g3-mat-tabulky-diagramy",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-jizdni-rady-jednoduche-diagramy",
    title: "Tabulky, jízdní řády, jednoduché diagramy",
    studentTitle: "Co říká tabulka?",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky nebo jízdního řádu a odpovíš na otázky.",
    keywords: ["tabulka", "jízdní řád", "diagram", "data", "čtení tabulek", "sloupcový graf"],
    goals: [
      "Číst data z jednoduché tabulky.",
      "Orientovat se v jízdním řádu.",
      "Porovnat hodnoty a provést jednoduchý výpočet z tabulky.",
    ],
    boundaries: ["Jednoduché tabulky, max 5 řádků.", "Bez složitých grafů."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka má řádky (vodorovně) a sloupce (svisle). Najdi správný řádek, pak správný sloupec.",
      steps: [
        "Přečti si nadpisy sloupců.",
        "Najdi řádek, který hledáš.",
        "Odečti hodnotu ze správného sloupce.",
        "Pro výpočty: sečti nebo odečti potřebné hodnoty.",
      ],
      commonMistake: "Záměna řádku a sloupce — vždy začni od nadpisu.",
      example: "V tabulce prodejů najdi středu a přečti číslo v sloupci 'Počet'.",
    },
  },
];
