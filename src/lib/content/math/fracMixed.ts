import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { gcd } from "./helpers";

function genFracToMixed(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 5 : level === 2 ? 8 : 12;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 1)) + 2;
    const whole = Math.floor(Math.random() * 4) + 1;
    const remainder = Math.floor(Math.random() * (den - 1)) + 1;
    const num = whole * den + remainder;
    const solutionSteps = [
      `Vyděl čitatel jmenovatelem: ${num} ÷ ${den}.`,
      `${num} ÷ ${den} = ${whole} celých, zbytek ${remainder}.`,
      `Celá část je ${whole}, zbylý zlomek je ${remainder}/${den}.`,
      `Výsledek: ${whole} ${remainder}/${den}.`,
    ];
    tasks.push({
      question: `Převeď na smíšené číslo: ${num}/${den}`,
      correctAnswer: `${whole} ${remainder}/${den}`,
      solutionSteps,
      hints: [`Vyděl ${num} číslem ${den} — kolikrát se ${den} vejde do ${num}?`, `Podíl je celá část, zbytek je nový čitatel. Jmenovatel ${den} zůstává.`],
    });
  }
  return tasks;
}

function genMixedToFrac(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 5 : level === 2 ? 8 : 12;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 1)) + 2;
    const whole = Math.floor(Math.random() * 4) + 1;
    const remainder = Math.floor(Math.random() * (den - 1)) + 1;
    const num = whole * den + remainder;
    const solutionSteps = [
      `Vynásob celou část jmenovatelem: ${whole} × ${den} = ${whole * den}.`,
      `Přičti čitatel: ${whole * den} + ${remainder} = ${num}.`,
      `Jmenovatel zůstává ${den}.`,
      `Výsledek: ${num}/${den}.`,
    ];
    tasks.push({
      question: `Převeď na zlomek: ${whole} celých ${remainder}/${den}`,
      correctAnswer: `${num}/${den}`,
      solutionSteps,
      hints: [`Vynásob celou část ${whole} jmenovatelem ${den}.`, `K výsledku přičti čitatel ${remainder} — to je nový čitatel. Jmenovatel ${den} zůstává.`],
    });
  }
  return tasks;
}

function genMixedAdd(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 5 : level === 2 ? 8 : 10;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 1)) + 2;
    const w1 = Math.floor(Math.random() * 3) + 1;
    const w2 = Math.floor(Math.random() * 3) + 1;
    const r1 = Math.floor(Math.random() * (den - 1)) + 1;
    const r2 = Math.floor(Math.random() * (den - 1)) + 1;
    const totalNum = (w1 * den + r1) + (w2 * den + r2);
    const g = gcd(totalNum, den);
    const simpNum = totalNum / g;
    const simpDen = den / g;
    const wholeResult = Math.floor(simpNum / simpDen);
    const remResult = simpNum % simpDen;
    const answer = remResult === 0 ? `${wholeResult}` : `${wholeResult} ${remResult}/${simpDen}`;
    const sumFrac = r1 + r2;
    const extraWhole = Math.floor(sumFrac / den);
    const remFrac = sumFrac % den;
    const solutionSteps = [
      `Sečti celé části: ${w1} + ${w2} = ${w1 + w2}.`,
      `Sečti zlomkové části: ${r1}/${den} + ${r2}/${den} = ${sumFrac}/${den}.`,
      ...(extraWhole > 0 ? [`${sumFrac}/${den} = ${extraWhole} celá ${remFrac > 0 ? `${remFrac}/${den}` : ''} — přičti k celým částem.`] : []),
      `Celkem: ${w1 + w2 + extraWhole}${remFrac > 0 ? ` ${remFrac}/${den}` : ''}.`,
      ...(g > 1 && remResult > 0 ? [`Zkrať zlomkovou část.`] : []),
      `Výsledek: ${answer}.`,
    ];
    tasks.push({
      question: `${w1} ${r1}/${den} + ${w2} ${r2}/${den} =`,
      correctAnswer: answer,
      solutionSteps,
      hints: [`Sečti zvlášť celé části (${w1} + ${w2}) a zvlášť zlomky (${r1}/${den} + ${r2}/${den}).`, `Pokud součet čitatelů ${r1} + ${r2} vyjde víc než ${den}, převeď přebytek na celou část.`],
    });
  }
  return tasks;
}

function genMixedSub(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 5 : level === 2 ? 8 : 10;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 1)) + 2;
    let w1 = Math.floor(Math.random() * 3) + 2;
    let w2 = Math.floor(Math.random() * (w1 - 1)) + 1;
    let r1 = Math.floor(Math.random() * (den - 1)) + 1;
    let r2 = Math.floor(Math.random() * (den - 1)) + 1;
    const val1 = w1 * den + r1;
    const val2 = w2 * den + r2;
    if (val1 <= val2) {
      w1 = w2 + 1;
      r1 = r2 + 1 > den - 1 ? den - 1 : r2 + 1;
    }
    const totalNum = (w1 * den + r1) - (w2 * den + r2);
    const wholeResult = Math.floor(totalNum / den);
    const remResult = totalNum % den;
    const g = remResult > 0 ? gcd(remResult, den) : 1;
    const simpRem = remResult / g;
    const simpDen = den / g;
    const answer = remResult === 0 ? `${wholeResult}` : wholeResult === 0 ? `${simpRem}/${simpDen}` : `${wholeResult} ${simpRem}/${simpDen}`;
    const needBorrow = r1 < r2;
    const solutionSteps = needBorrow ? [
      `Zlomková část ${r1}/${den} je menší než ${r2}/${den} — musíš si „půjčit" z celé části.`,
      `${w1} ${r1}/${den} = ${w1 - 1} ${r1 + den}/${den}.`,
      `Odečti celé části: ${w1 - 1} - ${w2} = ${w1 - 1 - w2}.`,
      `Odečti zlomky: ${r1 + den}/${den} - ${r2}/${den} = ${r1 + den - r2}/${den}.`,
      `Výsledek: ${answer}.`,
    ] : [
      `Odečti celé části: ${w1} - ${w2} = ${w1 - w2}.`,
      `Odečti zlomkové části: ${r1}/${den} - ${r2}/${den} = ${r1 - r2}/${den}.`,
      ...(g > 1 && remResult > 0 ? [`Zkrať zlomkovou část.`] : []),
      `Výsledek: ${answer}.`,
    ];
    tasks.push({
      question: `${w1} ${r1}/${den} - ${w2} ${r2}/${den} =`,
      correctAnswer: answer,
      solutionSteps,
      hints: [`Odečti zvlášť celé části (${w1} - ${w2}) a zvlášť zlomky (${r1}/${den} - ${r2}/${den}).`, r1 < r2 ? `Zlomek ${r1}/${den} je menší než ${r2}/${den} — musíš si půjčit jedničku z celé části.` : `Odečti čitatele: ${r1} - ${r2}. Jmenovatel ${den} zůstává.`],
    });
  }
  return tasks;
}

const HELP_FRAC_TO_MIXED: HelpData = {
  hint: "Smíšené číslo je celá část + zlomek. Stačí vydělit čitatel jmenovatelem — podíl je celá část, zbytek je nový čitatel.",
  steps: [
    "Vyděl horní číslo (čitatel) spodním číslem (jmenovatelem).",
    "Výsledek dělení je celá část smíšeného čísla.",
    "Zbytek po dělení je nový čitatel.",
    "Jmenovatel zůstává stejný.",
  ],
  commonMistake: "Nezapomeň na zbytek! Třeba 7/3 — sedm děleno třemi je 2 a zbude 1. Výsledek je 2 celé 1/3, ne 2 celé 0/3.",
  example: "7/3 → 7 ÷ 3 = 2, zbytek 1 → výsledek je 2 celé 1/3.",
  visualExamples: [{ label: "7/3 → kolik celých pizz a kolik zbyde?", fractionBars: [{ fraction: "3/3", numerator: 3, denominator: 3 }, { fraction: "3/3", numerator: 3, denominator: 3 }, { fraction: "1/3", numerator: 1, denominator: 3 }], conclusion: "7 třetin = 2 celé pizzy + 1 třetina → 2 celé 1/3" }],
};

const HELP_MIXED_TO_FRAC: HelpData = {
  hint: "Celou část vynásob jmenovatelem a přičti čitatel — to je nový čitatel. Jmenovatel zůstává.",
  steps: ["Vynásob celou část jmenovatelem.", "K výsledku přičti čitatel — dostaneš nový čitatel.", "Jmenovatel zůstává stejný."],
  commonMistake: "Pozor — nesčítej celou část s jmenovatelem! Třeba 2 celé 1/3 → 2×3 = 6, pak 6+1 = 7 → výsledek je 7/3.",
  example: "3 celé 2/5 → 3×5 = 15, 15+2 = 17 → výsledek je 17/5.",
  visualExamples: [{ label: "2 celé 1/3 → kolik třetin dohromady?", fractionBars: [{ fraction: "3/3", numerator: 3, denominator: 3 }, { fraction: "3/3", numerator: 3, denominator: 3 }, { fraction: "1/3", numerator: 1, denominator: 3 }], conclusion: "2 celé pizzy (6 třetin) + 1 třetina = 7 třetin → 7/3" }],
};

const HELP_MIXED_ADD: HelpData = {
  hint: "Sčítej celé části zvlášť a zlomkové části zvlášť. Pokud zlomková část přeteče přes 1, přičti jedničku k celé části.",
  steps: ["Sečti celé části dohromady.", "Sečti zlomkové části (čitatele) — jmenovatel zůstává.", "Pokud je čitatel větší než jmenovatel, převeď na celou část + zbytek.", "Přičti přebytečnou celou část k celkovému výsledku."],
  commonMistake: "Nezapomeň na přenos! Když zlomková část přeteče (třeba 5/4), musíš 1 celou přičíst k celé části.",
  example: "2 3/5 + 1 4/5 → celé: 2+1 = 3, zlomky: 3/5+4/5 = 7/5 = 1 2/5 → celkem: 4 2/5.",
  visualExamples: [{ label: "2 3/5 + 1 4/5 — sčítej zvlášť celé a zvlášť zlomky", illustration: "Celé části:  2 + 1 = 3\nZlomky:      3/5 + 4/5 = 7/5\n\n7/5 je víc než 1 celá → 7/5 = 1 celá 2/5\n\nCelkem: 3 + 1 celá 2/5 = 4 celé 2/5" }],
};

const HELP_MIXED_SUB: HelpData = {
  hint: "Odečítej celé části zvlášť a zlomkové části zvlášť. Pokud je zlomek menší než odečítaný, musíš si půjčit z celé části.",
  steps: ["Podívej se na zlomkové části — je první větší nebo rovna druhé?", "Pokud ano, odečti zlomky a celé části zvlášť.", "Pokud ne, půjč si jedničku z celé části a přidej ji ke zlomku jako den/den.", "Teď odečti."],
  commonMistake: "Pozor na půjčování! Třeba 3 1/4 - 1 3/4 — nemůžeš odečíst 3/4 od 1/4, takže si půjčíš: 2 5/4 - 1 3/4 = 1 2/4 = 1 1/2.",
  example: "5 1/3 - 2 2/3 — 1/3 < 2/3, půjč si: 4 4/3 - 2 2/3 = 2 2/3.",
  visualExamples: [{ label: "3 1/4 - 1 3/4 — musíš si půjčit!", illustration: "1/4 < 3/4 — nemůžeš odečíst → půjč si 1 celou:\n\n3 1/4  →  2 a 4/4 + 1/4  =  2  5/4\n\nTeď odečti:\nCelé:   2 - 1 = 1\nZlomky: 5/4 - 3/4 = 2/4 = 1/2\n\nVýsledek: 1 1/2" }],
};

export const FRAC_MIXED_TOPICS: TopicMetadata[] = [
  {
    id: "frac_to_mixed", title: "Převod zlomku na smíšené číslo", subject: "matematika", category: "Zlomky", topic: "Smíšená čísla",
    briefDescription: "Procvičíš si převod nepravého zlomku na smíšené číslo (celá část + zlomek).",
    topicDescription: "Procvičíš si převody mezi zlomky a smíšenými čísly a počítání se smíšenými čísly.",
    keywords: ["převod zlomku na smíšené číslo", "nepravý zlomek", "smíšené číslo", "zlomek na smíšené"],
    goals: ["Naučíš se převést nepravý zlomek (kde je čitatel větší než jmenovatel) na smíšené číslo."],
    boundaries: ["Pouze kladné zlomky", "Čitatel je větší než jmenovatel", "Žádná procenta", "Žádné sčítání ani odčítání"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "text",
    generator: genFracToMixed, helpTemplate: HELP_FRAC_TO_MIXED,
  },
  {
    id: "frac_from_mixed", title: "Převod smíšeného čísla na zlomek", subject: "matematika", category: "Zlomky", topic: "Smíšená čísla",
    briefDescription: "Naučíš se převést smíšené číslo zpátky na zlomek.",
    topicDescription: "Procvičíš si převody mezi zlomky a smíšenými čísly a počítání se smíšenými čísly.",
    keywords: ["převod smíšeného čísla na zlomek", "smíšené číslo na zlomek", "smíšené na zlomek"],
    goals: ["Naučíš se převést smíšené číslo na jeden zlomek — vynásobíš celou část jmenovatelem a přičteš čitatel."],
    boundaries: ["Pouze kladná smíšená čísla", "Žádná procenta", "Žádné sčítání ani odčítání"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction",
    generator: genMixedToFrac, helpTemplate: HELP_MIXED_TO_FRAC,
  },
  {
    id: "frac_mixed_add", title: "Sčítání smíšených čísel", subject: "matematika", category: "Zlomky", topic: "Smíšená čísla",
    briefDescription: "Procvičíš si sčítání dvou smíšených čísel se stejným jmenovatelem.",
    topicDescription: "Procvičíš si převody mezi zlomky a smíšenými čísly a počítání se smíšenými čísly.",
    keywords: ["sčítání smíšených čísel", "sečti smíšená čísla", "smíšená čísla sčítání"],
    goals: ["Naučíš se sečíst dvě smíšená čísla — celé části a zlomky zvlášť."],
    boundaries: ["Pouze kladná smíšená čísla", "Stejný jmenovatel", "Žádná procenta"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "text",
    generator: genMixedAdd, helpTemplate: HELP_MIXED_ADD,
  },
  {
    id: "frac_mixed_sub", title: "Odčítání smíšených čísel", subject: "matematika", category: "Zlomky", topic: "Smíšená čísla",
    briefDescription: "Procvičíš si odčítání smíšených čísel — včetně půjčování z celé části.",
    topicDescription: "Procvičíš si převody mezi zlomky a smíšenými čísly a počítání se smíšenými čísly.",
    keywords: ["odčítání smíšených čísel", "odečti smíšená čísla", "smíšená čísla odčítání"],
    goals: ["Naučíš se odečíst dvě smíšená čísla — a řešit situace, kdy si musíš půjčit z celé části."],
    boundaries: ["Pouze kladná smíšená čísla", "Stejný jmenovatel", "Výsledek je kladný", "Žádná procenta"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "text",
    generator: genMixedSub, helpTemplate: HELP_MIXED_SUB,
  },
];
