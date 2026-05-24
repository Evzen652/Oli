import type { TopicMetadata, PracticeTask } from "@/lib/types";

// Bez obrázků — úlohy jsou textové/číselné reprezentace dat z tabulek.

const DATASETS = [
  {
    name: "oblíbené ovoce ve třídě",
    items: ["Jablka", "Banány", "Pomeranče", "Jahody"],
    values: () => [8, 5, 7, 10] as number[],
  },
  {
    name: "počet knih přečtených za měsíc",
    items: ["Leden", "Únor", "Březen", "Duben"],
    values: () => [3, 5, 4, 6] as number[],
  },
  {
    name: "způsob dopravy do školy",
    items: ["Pěšky", "Autobusem", "Autem", "Na kole"],
    values: () => [12, 8, 6, 4] as number[],
  },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 40; i++) {
    const ds = DATASETS[i % DATASETS.length];
    const vals = ds.values();
    const total = vals.reduce((a, b) => a + b, 0);
    const maxIdx = vals.indexOf(Math.max(...vals));
    const minIdx = vals.indexOf(Math.min(...vals));

    const qType = i % (level === 1 ? 2 : level === 2 ? 3 : 4);

    if (qType === 0) {
      // Celkový součet
      tasks.push({
        question: `Tabulka „${ds.name}" — hodnoty: ${ds.items.map((k, j) => `${k}: ${vals[j]}`).join(", ")}.\nJaký je celkový součet?`,
        correctAnswer: String(total),
        options: shuffle([String(total), String(total + 2), String(total - 1), String(total + 5)]
          .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: ["Sečti všechna čísla v tabulce."],
        solutionSteps: [`${vals.join(" + ")} = ${total}`],
      });
    } else if (qType === 1) {
      // Největší hodnota
      tasks.push({
        question: `Tabulka „${ds.name}": ${ds.items.map((k, j) => `${k}: ${vals[j]}`).join(", ")}.\nKterá položka má největší hodnotu?`,
        correctAnswer: ds.items[maxIdx],
        options: shuffle(ds.items.slice()),
        hints: ["Najdi největší číslo v tabulce."],
        solutionSteps: [`Největší hodnota: ${vals[maxIdx]} → ${ds.items[maxIdx]}.`],
      });
    } else if (qType === 2) {
      // Nejmenší hodnota
      tasks.push({
        question: `Tabulka „${ds.name}": ${ds.items.map((k, j) => `${k}: ${vals[j]}`).join(", ")}.\nKterá položka má nejmenší hodnotu?`,
        correctAnswer: ds.items[minIdx],
        options: shuffle(ds.items.slice()),
        hints: ["Najdi nejmenší číslo v tabulce."],
        solutionSteps: [`Nejmenší hodnota: ${vals[minIdx]} → ${ds.items[minIdx]}.`],
      });
    } else {
      // Rozdíl mezi největší a nejmenší
      const diff = vals[maxIdx] - vals[minIdx];
      tasks.push({
        question: `Tabulka „${ds.name}": ${ds.items.map((k, j) => `${k}: ${vals[j]}`).join(", ")}.\nJaký je rozdíl mezi největší a nejmenší hodnotou?`,
        correctAnswer: String(diff),
        options: shuffle([String(diff), String(diff + 1), String(diff - 1), String(diff + 2)]
          .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: ["Největší − nejmenší = rozdíl."],
        solutionSteps: [`${vals[maxIdx]} − ${vals[minIdx]} = ${diff}`],
      });
    }
  }
  return tasks;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
