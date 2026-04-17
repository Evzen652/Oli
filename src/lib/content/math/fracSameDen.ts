import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { PLURALS } from "../czechPlural";

/**
 * Sčítání, odčítání a porovnávání zlomků se stejným jmenovatelem — 5. ročník ZŠ
 * RVP M-5-1-08
 *
 * Input type: FRACTION
 *
 * KRITICKÝ prerekvizit pro 6. ročník (frac_add_same_den, frac_sub_same_den).
 *
 * Úlohy:
 *   1) 3/8 + 2/8 = 5/8  (sčítání)
 *   2) 5/9 − 2/9 = 3/9  (odčítání)
 *   3) Porovnej 3/7 ○ 5/7  (porovnávání)
 *
 * Pravidlo: čitatele sčítáme/odčítáme, jmenovatel zůstává stejný.
 */

function genAdd(_level: number): PracticeTask {
  const den = Math.floor(Math.random() * 8) + 3; // 3–10
  const n1 = Math.floor(Math.random() * (den - 2)) + 1; // 1 až den-2
  const n2 = Math.floor(Math.random() * (den - n1 - 1)) + 1; // tak, aby součet nepřesáhl den
  const sum = n1 + n2;
  const correct = `${sum}/${den}`;

  return {
    question: `${n1}/${den} + ${n2}/${den} =`,
    correctAnswer: correct,
    solutionSteps: [
      `Zlomky mají STEJNÝ jmenovatel (${den}). Stačí sečíst čitatele.`,
      `${n1} + ${n2} = ${sum}.`,
      `Jmenovatel zůstává ${den}.`,
      `Výsledek: ${correct}.`,
    ],
    hints: [
      `Jmenovatel je stejný — ten se při sčítání NEMĚNÍ.`,
      `Sečti jen čitatele: ${n1} + ${n2} = ?`,
    ],
  };
}

function genSub(_level: number): PracticeTask {
  const den = Math.floor(Math.random() * 8) + 3;
  const n1 = Math.floor(Math.random() * (den - 1)) + 2; // aspoň 2
  const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // menší než n1
  const diff = n1 - n2;
  const correct = `${diff}/${den}`;

  return {
    question: `${n1}/${den} − ${n2}/${den} =`,
    correctAnswer: correct,
    solutionSteps: [
      `Zlomky mají stejný jmenovatel (${den}). Odečti jen čitatele.`,
      `${n1} − ${n2} = ${diff}.`,
      `Jmenovatel zůstává ${den}.`,
      `Výsledek: ${correct}.`,
    ],
    hints: [
      `Jmenovatel je stejný — ten se NEMĚNÍ.`,
      `Odečti jen čitatele: ${n1} − ${n2} = ?`,
    ],
  };
}

function genCompare(_level: number): PracticeTask {
  const den = Math.floor(Math.random() * 8) + 3;
  let n1 = Math.floor(Math.random() * (den - 1)) + 1;
  let n2 = Math.floor(Math.random() * (den - 1)) + 1;
  // 15 % rovnost
  if (Math.random() < 0.15) n2 = n1;

  const correct = n1 < n2 ? "<" : n1 > n2 ? ">" : "=";

  return {
    question: `Porovnej: ${n1}/${den} ○ ${n2}/${den}`,
    correctAnswer: correct,
    options: ["<", "=", ">"],
    solutionSteps: [
      `Zlomky mají STEJNÝ jmenovatel (${den}). Stačí porovnat čitatele.`,
      n1 === n2 ? `${n1} = ${n2}.` : `${n1} ${n1 < n2 ? "<" : ">"} ${n2}.`,
      `Výsledek: ${correct}.`,
    ],
    hints: [
      `Když mají zlomky stejný jmenovatel, větší čitatel znamená větší zlomek.`,
      `Porovnej čitatele: ${n1} a ${n2}.`,
    ],
  };
}

function genFracSameDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  if (level === 1) {
    // Převážně sčítání, malé jmenovatele
    for (let i = 0; i < 30; i++) tasks.push(genAdd(level));
    for (let i = 0; i < 20; i++) tasks.push(genSub(level));
    for (let i = 0; i < 10; i++) tasks.push(genCompare(level));
  } else {
    // Vyvážený mix
    for (let i = 0; i < 25; i++) tasks.push(genAdd(level));
    for (let i = 0; i < 20; i++) tasks.push(genSub(level));
    for (let i = 0; i < 15; i++) tasks.push(genCompare(level));
  }
  // Porovnávací úlohy používají select_one style (options), ostatní fraction input
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_FRAC_SAME_DEN: HelpData = {
  hint:
    "Když mají zlomky STEJNÝ jmenovatel, počítáš jen s čitateli. Jmenovatel se NEMĚNÍ — určuje velikost jednoho dílku.",
  steps: [
    "Zkontroluj jmenovatele — musí být STEJNÝ (např. oba /8).",
    "Sčítej (nebo odčítej) pouze čitatele.",
    "Jmenovatel zůstává beze změny.",
    "Výsledek zapiš jako zlomek.",
  ],
  commonMistake:
    "NEJVĚTŠÍ CHYBA: sčítat i jmenovatele. SPRÁVNĚ: 3/8 + 2/8 = 5/8 (NE 5/16!). Jmenovatel říká, na kolik dílků je celek rozdělen — a ten se nemění.",
  example:
    "3/8 + 2/8 = 5/8\n(3 díly + 2 díly = 5 dílů, všechny z osmin)\n\n7/10 − 4/10 = 3/10\n(z 7 desetin uberu 4, zbude 3)",
  visualExamples: [
    {
      label: "Sčítání dílků (pizza)",
      fractionBars: [
        { fraction: "3/8", numerator: 3, denominator: 8 },
        { fraction: "2/8", numerator: 2, denominator: 8 },
      ],
      illustration:
        "Pizza rozdělená na 8 stejných kousků.\n\n  3/8 = 3 kousky:\n  ┌─┬─┬─┬─┬─┬─┬─┬─┐\n  │●│●│●│ │ │ │ │ │\n  └─┴─┴─┴─┴─┴─┴─┴─┘\n\n  + 2/8 = další 2 kousky:\n  ┌─┬─┬─┬─┬─┬─┬─┬─┐\n  │●│●│●│●│●│ │ │ │\n  └─┴─┴─┴─┴─┴─┴─┴─┘\n\n  = 5/8 (5 kousků z 8)",
      conclusion: "Jmenovatel (8) říká, na kolik kousků je pizza. Ten se NEMĚNÍ.",
    },
    {
      label: "Porovnávání se stejným jmenovatelem",
      illustration:
        "Porovnej 3/7 a 5/7:\n\n  3/7:  ███▒▒▒▒   (3 ze 7)\n  5/7:  █████▒▒   (5 ze 7)\n\n→ 5/7 > 3/7\n\nProč? Větší čitatel u stejného jmenovatele = víc dílků.",
      conclusion: "Stejný jmenovatel → rozhoduje čitatel. Větší čitatel = větší zlomek.",
    },
    {
      label: "Proč se jmenovatel nemění",
      illustration:
        "SPRÁVNĚ:    3/8 + 2/8 = 5/8\nŠPATNĚ:     3/8 + 2/8 = 5/16  ❌\n\nPředstav si: 3 osminy čokolády + 2 osminy čokolády.\nMáš 5 osmin — ne 5 šestnáctin!\nČokoláda je pořád rozdělená na 8 dílků.",
      conclusion: "Jmenovatel určuje DÍLEK. Dílek se nezmění, když přidáš další kousky.",
    },
  ],
};

export const FRAC_SAME_DEN_TOPICS: TopicMetadata[] = [
  {
    id: "math-frac-same-den-5",
    title: "Zlomky se stejným jmenovatelem",
    subject: "matematika",
    category: "Zlomky",
    topic: "Zlomky se stejným jmenovatelem",
    topicDescription:
      "Sčítání, odčítání a porovnávání zlomků, které mají stejný jmenovatel.",
    briefDescription:
      "Naučíš se sčítat, odčítat a porovnávat zlomky se stejným jmenovatelem. Klíč: jmenovatel se nemění.",
    keywords: [
      "zlomky",
      "stejný jmenovatel",
      "sčítání zlomků",
      "odčítání zlomků",
      "porovnávání zlomků",
    ],
    goals: [
      "Sečteš dva zlomky se stejným jmenovatelem.",
      "Odečteš dva zlomky se stejným jmenovatelem.",
      "Porovnáš dva zlomky se stejným jmenovatelem.",
      "Pochopíš, proč se jmenovatel při sčítání nemění.",
    ],
    boundaries: [
      "POUZE stejný jmenovatel (různý jmenovatel je 6. roč.).",
      "Výsledek čitatele ≤ jmenovatel (výsledek je pravý zlomek; smíšená čísla v 6. r.).",
      "Žádné krácení výsledku (jen čistý výpočet).",
    ],
    gradeRange: [5, 6],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "fraction",
    generator: genFracSameDen,
    helpTemplate: HELP_FRAC_SAME_DEN,
    contentType: "algorithmic",
    prerequisites: ["math-frac-intro-4"],
    rvpReference: "M-5-1-08",
  },
];
