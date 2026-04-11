import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { gcd, lcm } from "./helpers";

function genFracAddSameDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 6 : level === 2 ? 10 : 15;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 2)) + 2;
    const n1 = Math.floor(Math.random() * (den - 1)) + 1;
    const n2 = Math.floor(Math.random() * (den - n1)) + 1;
    const sumNum = n1 + n2;
    const g = gcd(sumNum, den);
    const resultNum = sumNum / g;
    const resultDen = den / g;
    const solutionSteps = [`Jmenovatele jsou stejné (${den}) — dílky jsou stejně velké.`, `Sečti čitatele: ${n1} + ${n2} = ${sumNum}.`, `Jmenovatel zůstává: ${sumNum}/${den}.`, ...(g > 1 ? [`Zkrať výsledek (oba čísla jdou vydělit ${g}): ${sumNum}÷${g} = ${resultNum}, ${den}÷${g} = ${resultDen}.`] : []), `Výsledek: ${resultNum}/${resultDen}.`];
    tasks.push({ question: `${n1}/${den} + ${n2}/${den} =`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps, hints: [`Oba zlomky mají jmenovatel ${den} — dílky jsou stejně velké.`, `Sečti čitatele: ${n1} + ${n2}. Jmenovatel ${den} zůstává.`] });
  }
  return tasks;
}

function genFracAddDiffDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denPool = level === 1 ? [2, 3, 4, 6] : level === 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 7, 8, 10, 12];
  for (let i = 0; i < 60; i++) {
    const d1 = denPool[Math.floor(Math.random() * denPool.length)];
    let d2 = denPool[Math.floor(Math.random() * denPool.length)];
    while (d2 === d1) d2 = denPool[Math.floor(Math.random() * denPool.length)];
    const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    const commonDen = lcm(d1, d2);
    const en1 = n1 * (commonDen / d1);
    const en2 = n2 * (commonDen / d2);
    const sumNum = en1 + en2;
    const g = gcd(sumNum, commonDen);
    const resultNum = sumNum / g;
    const resultDen = commonDen / g;
    const solutionSteps = [`Jmenovatele jsou různé (${d1} a ${d2}), najdi společný jmenovatel.`, `Nejmenší společný násobek ${d1} a ${d2} je ${commonDen}.`, `Rozšiř: ${n1}/${d1} = ${en1}/${commonDen}, ${n2}/${d2} = ${en2}/${commonDen}.`, `Sečti čitatele: ${en1} + ${en2} = ${sumNum}. Jmenovatel zůstává: ${sumNum}/${commonDen}.`, ...(g > 1 ? [`Zkrať výsledek (oba čísla jdou vydělit ${g}): ${resultNum}/${resultDen}.`] : []), `Výsledek: ${resultNum}/${resultDen}.`];
    tasks.push({ question: `${n1}/${d1} + ${n2}/${d2} =`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps, hints: [`Jmenovatele ${d1} a ${d2} jsou různé — najdi společný jmenovatel.`, `Rozšiř oba zlomky na společný jmenovatel a pak sečti čitatele.`] });
  }
  return tasks;
}

const HELP_FRAC_ADD_SAME: HelpData = { hint: "Když mají zlomky stejný jmenovatel, dílky jsou stejně velké — prostě je sečti. Spodní číslo se nemění.", steps: ["Zkontroluj, že spodní čísla (jmenovatele) jsou stejná.", "Sečti horní čísla (čitatele).", "Spodní číslo (jmenovatel) zůstává stejný — nepřičítej ho!"], commonMistake: "Velká chyba je sčítat i spodní čísla. Třeba 2/7 + 3/7 NENÍ 5/14. Spodní číslo zůstává 7, protože dílky se nemění.", example: "2/7 + 3/7 → sečti horní čísla: 2 + 3 = 5 → výsledek je 5/7.", visualExamples: [{ label: "Představ si dort rozřezaný na 7 dílků", fractionBars: [{ fraction: "2/7", numerator: 2, denominator: 7 }, { fraction: "3/7", numerator: 3, denominator: 7 }], conclusion: "2 dílky + 3 dílky = 5 dílků → 2/7 + 3/7 = 5/7" }] };
const HELP_FRAC_ADD_DIFF: HelpData = { hint: "Když mají zlomky různé jmenovatele, nejde je přímo sečíst — nejdřív je musíš převést na stejné dílky.", steps: ["Najdi společný jmenovatel — číslo, které je násobkem obou spodních čísel.", "Rozšiř oba zlomky, aby měly tento společný jmenovatel.", "Sečti horní čísla. Spodní číslo zůstává.", "Zkus výsledek zkrátit (zjednodušit), pokud to jde."], commonMistake: "Velká chyba je sečíst horní a spodní čísla zvlášť — třeba 1/2 + 1/3 NENÍ 2/5. Nejdřív musíš mít stejné dílky!", example: "1/3 + 1/4 → společný jmenovatel je 12 → 4/12 + 3/12 = 7/12.", visualExamples: [{ label: "Původní zlomky — dílky jsou různě velké", fractionBars: [{ fraction: "1/3", numerator: 1, denominator: 3 }, { fraction: "1/4", numerator: 1, denominator: 4 }], conclusion: "Třetiny a čtvrtiny jsou různě velké — nejde je přímo sečíst" }, { label: "Po převodu na společný jmenovatel (dvanáctiny)", fractionBars: [{ fraction: "4/12", numerator: 4, denominator: 12 }, { fraction: "3/12", numerator: 3, denominator: 12 }], conclusion: "4/12 + 3/12 = 7/12 — teď mají stejné dílky a jde je sečíst" }] };

export const FRAC_ADD_TOPICS: TopicMetadata[] = [
  { id: "frac_add_same_den", title: "Se stejným jmenovatelem", subject: "matematika", category: "Zlomky", topic: "Sčítání zlomků", briefDescription: "Procvičíš si sčítání zlomků, které mají stejný jmenovatel.", topicDescription: "Procvičíš si sčítání zlomků — se stejným i s různým jmenovatelem.", keywords: ["sčítání zlomků se stejným jmenovatelem", "sčítání zlomků stejný jmenovatel", "sečti zlomky se stejným", "součet zlomků stejný jmenovatel"], goals: ["Naučíš se sečíst dva zlomky se stejným jmenovatelem — sečteš horní čísla a jmenovatel zůstane."], boundaries: ["Pouze zlomky se stejným jmenovatelem", "Žádná procenta", "Žádné odčítání", "Žádné různé jmenovatele"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction", generator: genFracAddSameDen, helpTemplate: HELP_FRAC_ADD_SAME },
  { id: "frac_add_diff_den", title: "S různým jmenovatelem", subject: "matematika", category: "Zlomky", topic: "Sčítání zlomků", briefDescription: "Naučíš se sčítat zlomky s různými jmenovateli – nejdřív najdeš společný jmenovatel.", topicDescription: "Procvičíš si sčítání zlomků — se stejným i s různým jmenovatelem.", keywords: ["sčítání zlomků s různým jmenovatelem", "sčítání zlomků různý jmenovatel", "sečti zlomky s různým", "součet zlomků různý jmenovatel", "sčítání zlomků", "sečti zlomky"], goals: ["Naučíš se sečíst dva zlomky s různými jmenovateli — nejdřív je převedeš na společný jmenovatel."], boundaries: ["Pouze dva zlomky", "Žádná procenta", "Žádné odčítání", "Výsledek zkrátit na základní tvar"], gradeRange: [6, 6], practiceType: "step_based", defaultLevel: 2, inputType: "fraction", generator: genFracAddDiffDen, helpTemplate: HELP_FRAC_ADD_DIFF },
];
