import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { gcd } from "./helpers";

function genFracMulWholeBasic(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 5 : level === 2 ? 8 : 12;
  const maxMult = level === 1 ? 4 : level === 2 ? 6 : 9;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 1)) + 2;
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const mult = Math.floor(Math.random() * (maxMult - 1)) + 2;
    const prodNum = num * mult;
    const g = gcd(prodNum, den);
    const resultNum = prodNum / g;
    const resultDen = den / g;
    const solutionSteps = [
      `Vynásob čitatel celým číslem: ${num} × ${mult} = ${prodNum}.`,
      `Jmenovatel zůstává: ${prodNum}/${den}.`,
      ...(g > 1 ? [`Zkrať výsledek (oba čísla jdou vydělit ${g}): ${resultNum}/${resultDen}.`] : []),
      `Výsledek: ${resultNum}/${resultDen}.`,
    ];
    tasks.push({ question: `${num}/${den} × ${mult} =`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps, hints: [`Vynásob jen čitatel ${num} celým číslem ${mult}. Jmenovatel ${den} se nemění.`, `${num} × ${mult} = ? Dej to nad jmenovatel ${den}.`] });
  }
  return tasks;
}

function genFracMulWholeReduce(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 6 : level === 2 ? 10 : 12;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 2)) + 3;
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const mult = den;
    const prodNum = num * mult;
    const g = gcd(prodNum, den);
    const resultNum = prodNum / g;
    const resultDen = den / g;
    const isWhole = resultDen === 1;
    const solutionSteps = [
      `Vynásob čitatel celým číslem: ${num} × ${mult} = ${prodNum}.`,
      `Jmenovatel zůstává: ${prodNum}/${den}.`,
      ...(g > 1 && !isWhole ? [`Zkrať: oba čísla vyděl ${g} → ${resultNum}/${resultDen}.`] : []),
      ...(isWhole ? [`${prodNum}/${den} = ${resultNum} (celé číslo).`] : []),
      `Výsledek: ${isWhole ? resultNum : `${resultNum}/${resultDen}`}.`,
    ];
    tasks.push({ question: `${num}/${den} × ${mult} =`, correctAnswer: isWhole ? `${resultNum}` : `${resultNum}/${resultDen}`, solutionSteps, hints: [`Vynásob čitatel ${num} číslem ${mult}. Jmenovatel ${den} zůstává.`, `Zkontroluj výsledek — jde zkrátit, nebo je to celé číslo?`] });
  }
  return tasks;
}

const HELP_FRAC_MUL_WHOLE: HelpData = {
  hint: "Při násobení zlomku celým číslem násobíš jen horní číslo (čitatel). Spodní číslo (jmenovatel) se nemění.",
  steps: ["Vynásob čitatel (horní číslo) celým číslem.", "Jmenovatel (spodní číslo) zůstává stejný.", "Pokud jde výsledek zkrátit, zkrať ho."],
  commonMistake: "Nenásob jmenovatel! Třeba 2/5 × 3 → násobíš jen nahoře: 2×3 = 6 → výsledek je 6/5, ne 6/15.",
  example: "2/5 × 3 → čitatel: 2×3 = 6 → výsledek je 6/5.",
  visualExamples: [{ label: "2/5 třikrát za sebou", fractionBars: [{ fraction: "2/5", numerator: 2, denominator: 5 }, { fraction: "2/5", numerator: 2, denominator: 5 }, { fraction: "2/5", numerator: 2, denominator: 5 }], conclusion: "2/5 + 2/5 + 2/5 = 6/5 — násobení je opakované sčítání" }],
};

const HELP_FRAC_MUL_WHOLE_REDUCE: HelpData = {
  hint: "Někdy se výsledek násobení dá zkrátit nebo vyjde celé číslo. Vždy zkontroluj!",
  steps: ["Vynásob čitatel celým číslem.", "Zkontroluj, jestli jde výsledek zkrátit.", "Pokud je čitatel dělitelný jmenovatelem, výsledek je celé číslo."],
  commonMistake: "Nezapomeň zkrátit! Třeba 3/4 × 8 = 24/4 = 6 — to je celé číslo.",
  example: "3/5 × 5 → 3×5 = 15 → 15/5 = 3 (celé číslo).",
  visualExamples: [{ label: "3/4 × 8 — výsledek jde zkrátit na celé číslo", fractionBars: [{ fraction: "3/4", numerator: 3, denominator: 4 }], conclusion: "3/4 × 8 = 24/4 = 6 — čitatel je dělitelný jmenovatelem, takže výsledek je celé číslo!" }],
};

export const FRAC_MUL_WHOLE_TOPICS: TopicMetadata[] = [
  {
    id: "frac_mul_whole_basic", title: "Základní násobení", subject: "matematika", category: "Zlomky", topic: "Násobení zlomku celým číslem",
    briefDescription: "Procvičíš si násobení zlomku celým číslem — vynásob čitatel, jmenovatel nech.",
    topicDescription: "Procvičíš si násobení zlomku celým číslem — od základního po násobení se zkrácením.",
    keywords: ["násobení zlomku celým číslem", "zlomek krát číslo", "vynásob zlomek", "násobení zlomků"],
    goals: ["Naučíš se vynásobit zlomek celým číslem — násobíš jen čitatel, jmenovatel zůstává."],
    boundaries: ["Pouze kladné zlomky", "Pouze celé číslo jako násobitel", "Žádná procenta", "Žádné násobení dvou zlomků"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction",
    generator: genFracMulWholeBasic, helpTemplate: HELP_FRAC_MUL_WHOLE,
  },
  {
    id: "frac_mul_whole_reduce", title: "Se zkrácením výsledku", subject: "matematika", category: "Zlomky", topic: "Násobení zlomku celým číslem",
    briefDescription: "Naučíš se násobit zlomek číslem a výsledek zkrátit nebo převést na celé číslo.",
    topicDescription: "Procvičíš si násobení zlomku celým číslem — od základního po násobení se zkrácením.",
    keywords: ["násobení zlomku se zkrácením", "zlomek krát číslo zkrátit", "násobení zlomku výsledek celé číslo"],
    goals: ["Naučíš se vynásobit zlomek celým číslem a výsledek zkrátit nebo rozpoznat celé číslo."],
    boundaries: ["Pouze kladné zlomky", "Pouze celé číslo jako násobitel", "Žádná procenta", "Žádné násobení dvou zlomků"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction",
    generator: genFracMulWholeReduce, helpTemplate: HELP_FRAC_MUL_WHOLE_REDUCE,
  },
];
