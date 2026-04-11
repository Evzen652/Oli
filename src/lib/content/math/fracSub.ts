import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { gcd, lcm } from "./helpers";

function genFracSubSameDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxDen = level === 1 ? 6 : level === 2 ? 10 : 15;
  for (let i = 0; i < 60; i++) {
    const den = Math.floor(Math.random() * (maxDen - 2)) + 2;
    const n1 = Math.floor(Math.random() * (den - 1)) + 2;
    const n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
    const diffNum = n1 - n2;
    const g = gcd(diffNum, den);
    const resultNum = diffNum / g;
    const resultDen = den / g;
    const solutionSteps = [`Jmenovatele jsou stejné (${den}) — dílky jsou stejně velké.`, `Odečti čitatele: ${n1} - ${n2} = ${diffNum}.`, `Jmenovatel zůstává: ${diffNum}/${den}.`, ...(g > 1 ? [`Zkrať výsledek (oba čísla jdou vydělit ${g}): ${resultNum}/${resultDen}.`] : []), `Výsledek: ${resultNum}/${resultDen}.`];
    tasks.push({ question: `${n1}/${den} - ${n2}/${den} =`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps, hints: [`Oba zlomky mají jmenovatel ${den} — dílky jsou stejně velké.`, `Odečti čitatele: ${n1} - ${n2}. Jmenovatel ${den} zůstává.`] });
  }
  return tasks;
}

function genFracSubDiffDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denPool = level === 1 ? [2, 3, 4, 6] : level === 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 7, 8, 10, 12];
  for (let i = 0; i < 60; i++) {
    let da = denPool[Math.floor(Math.random() * denPool.length)];
    let db = denPool[Math.floor(Math.random() * denPool.length)];
    while (db === da) db = denPool[Math.floor(Math.random() * denPool.length)];
    const commonDen = lcm(da, db);
    let na = Math.floor(Math.random() * (da - 1)) + 1;
    let nb = Math.floor(Math.random() * (db - 1)) + 1;
    let ena = na * (commonDen / da);
    let enb = nb * (commonDen / db);
    if (ena <= enb) { [na, nb, da, db, ena, enb] = [nb, na, db, da, enb, ena]; }
    const diffNum = ena - enb;
    const g = gcd(diffNum, commonDen);
    const resultNum = diffNum / g;
    const resultDen = commonDen / g;
    const solutionSteps = [`Jmenovatele jsou různé (${da} a ${db}), najdi společný jmenovatel.`, `Nejmenší společný násobek ${da} a ${db} je ${commonDen}.`, `Rozšiř: ${na}/${da} = ${ena}/${commonDen}, ${nb}/${db} = ${enb}/${commonDen}.`, `Odečti čitatele: ${ena} - ${enb} = ${diffNum}. Jmenovatel zůstává: ${diffNum}/${commonDen}.`, ...(g > 1 ? [`Zkrať výsledek (oba čísla jdou vydělit ${g}): ${resultNum}/${resultDen}.`] : []), `Výsledek: ${resultNum}/${resultDen}.`];
    tasks.push({ question: `${na}/${da} - ${nb}/${db} =`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps, hints: [`Jmenovatele ${da} a ${db} jsou různé — najdi společný jmenovatel.`, `Rozšiř oba zlomky na společný jmenovatel a pak odečti čitatele.`] });
  }
  return tasks;
}

const HELP_FRAC_SUB_SAME: HelpData = { hint: "Když mají zlomky stejný jmenovatel, dílky jsou stejně velké — prostě odečti. Spodní číslo se nemění.", steps: ["Zkontroluj, že spodní čísla (jmenovatele) jsou stejná.", "Odečti horní čísla (čitatele).", "Spodní číslo (jmenovatel) zůstává stejný."], commonMistake: "Pozor — neodčítej spodní čísla! Třeba 5/7 - 2/7 NENÍ 3/0. Spodní číslo zůstává 7.", example: "5/7 - 2/7 → odečti horní čísla: 5 - 2 = 3 → výsledek je 3/7.", visualExamples: [{ label: "Představ si dort rozřezaný na 7 dílků", fractionBars: [{ fraction: "5/7", numerator: 5, denominator: 7 }, { fraction: "2/7", numerator: 2, denominator: 7 }], conclusion: "5 dílků - 2 dílky = 3 dílky → 5/7 - 2/7 = 3/7" }] };
const HELP_FRAC_SUB_DIFF: HelpData = { hint: "Když mají zlomky různé jmenovatele, nejde je přímo odečíst — nejdřív je musíš převést na stejné dílky.", steps: ["Najdi společný jmenovatel — číslo, které je násobkem obou spodních čísel.", "Rozšiř oba zlomky, aby měly tento společný jmenovatel.", "Odečti horní čísla. Spodní číslo zůstává.", "Zkus výsledek zkrátit, pokud to jde."], commonMistake: "Velká chyba je odečíst horní a spodní čísla zvlášť — třeba 3/4 - 1/3 NENÍ 2/1. Nejdřív musíš mít stejné dílky!", example: "3/4 - 1/3 → společný jmenovatel je 12 → 9/12 - 4/12 = 5/12.", visualExamples: [{ label: "Po převodu na společný jmenovatel (dvanáctiny)", fractionBars: [{ fraction: "9/12", numerator: 9, denominator: 12 }, { fraction: "4/12", numerator: 4, denominator: 12 }], conclusion: "9/12 - 4/12 = 5/12 — teď mají stejné dílky a jde je odečíst" }] };

export const FRAC_SUB_TOPICS: TopicMetadata[] = [
  { id: "frac_sub_same_den", title: "Se stejným jmenovatelem", subject: "matematika", category: "Zlomky", topic: "Odčítání zlomků", briefDescription: "Procvičíš si odčítání zlomků, které mají stejný jmenovatel.", topicDescription: "Procvičíš si odčítání zlomků — se stejným i s různým jmenovatelem.", keywords: ["odčítání zlomků se stejným jmenovatelem", "odčítání zlomků stejný jmenovatel", "odečti zlomky se stejným"], goals: ["Naučíš se odečíst dva zlomky se stejným jmenovatelem — odečteš horní čísla a jmenovatel zůstane."], boundaries: ["Pouze zlomky se stejným jmenovatelem", "Žádná procenta", "Žádné sčítání", "Žádné různé jmenovatele", "Výsledek je kladný"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction", generator: genFracSubSameDen, helpTemplate: HELP_FRAC_SUB_SAME },
  { id: "frac_sub_diff_den", title: "S různým jmenovatelem", subject: "matematika", category: "Zlomky", topic: "Odčítání zlomků", briefDescription: "Naučíš se odčítat zlomky s různými jmenovateli — nejdřív najdeš společný jmenovatel.", topicDescription: "Procvičíš si odčítání zlomků — se stejným i s různým jmenovatelem.", keywords: ["odčítání zlomků s různým jmenovatelem", "odčítání zlomků různý jmenovatel", "odečti zlomky s různým", "odčítání zlomků", "odečti zlomky"], goals: ["Naučíš se odečíst dva zlomky s různými jmenovateli — nejdřív je převedeš na společný jmenovatel."], boundaries: ["Pouze dva zlomky", "Žádná procenta", "Žádné sčítání", "Výsledek zkrátit na základní tvar", "Výsledek je kladný"], gradeRange: [6, 6], practiceType: "step_based", defaultLevel: 2, inputType: "fraction", generator: genFracSubDiffDen, helpTemplate: HELP_FRAC_SUB_DIFF },
];
