import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { gcd } from "./helpers";

function genFracReduceSimple(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const divisors = level === 1 ? [2] : level === 2 ? [2, 3, 5] : [2, 3, 5];
  const baseNums = level === 1 ? [1, 2, 3] : [1, 2, 3, 4, 5, 7];
  for (let i = 0; i < 60; i++) {
    const div = divisors[Math.floor(Math.random() * divisors.length)];
    const baseNum = baseNums[Math.floor(Math.random() * baseNums.length)];
    let baseDen = baseNum + Math.floor(Math.random() * 4) + 1;
    while (gcd(baseNum, baseDen) > 1) baseDen++;
    const num = baseNum * div;
    const den = baseDen * div;
    const solutionSteps = [`Najdi číslo, kterým jde vydělit ${num} i ${den}.`, `Obě čísla jdou vydělit ${div}.`, `Vyděl čitatele: ${num} ÷ ${div} = ${baseNum}.`, `Vyděl jmenovatele: ${den} ÷ ${div} = ${baseDen}.`, `Výsledek: ${baseNum}/${baseDen}.`];
    tasks.push({ question: `Zkrať zlomek: ${num}/${den}`, correctAnswer: `${baseNum}/${baseDen}`, solutionSteps, hints: [`Podívej se na čísla ${num} a ${den} — najdi číslo, kterým jdou obě vydělit.`, `Zkus: jde ${num} vydělit dvěma? A jde ${den} vydělit dvěma?`] });
  }
  return tasks;
}

function genFracReduceFull(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const divisors = level === 1 ? [2, 3, 4] : level === 2 ? [2, 3, 4, 6, 8] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  for (let i = 0; i < 60; i++) {
    const div = divisors[Math.floor(Math.random() * divisors.length)];
    const baseNum = Math.floor(Math.random() * 5) + 1;
    let baseDen = baseNum + Math.floor(Math.random() * 6) + 1;
    while (gcd(baseNum, baseDen) > 1) baseDen++;
    const num = baseNum * div;
    const den = baseDen * div;
    const g = gcd(num, den);
    const resultNum = num / g;
    const resultDen = den / g;
    const steps: string[] = [`Najdi největší společný dělitel čísel ${num} a ${den}.`];
    if (g <= 3 || div <= 3) { steps.push(`Obě čísla jdou vydělit ${g}.`); }
    else { steps.push(`Největší číslo, kterým jdou obě vydělit, je ${g}.`); }
    steps.push(`Vyděl čitatele: ${num} ÷ ${g} = ${resultNum}.`, `Vyděl jmenovatele: ${den} ÷ ${g} = ${resultDen}.`, `Výsledek v základním tvaru: ${resultNum}/${resultDen}.`);
    tasks.push({ question: `Zkrať na základní tvar: ${num}/${den}`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps: steps, hints: [`Podívej se na čísla ${num} a ${den} — hledej největší číslo, kterým jdou obě vydělit.`, `Zkus postupně: dělí se ${num} i ${den} dvěma? Trojkou? Čtyřkou?`] });
  }
  return tasks;
}

function genFracIsReduced(_level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) {
    const isBasic = Math.random() < 0.5;
    let num: number, den: number;
    if (isBasic) {
      num = Math.floor(Math.random() * 6) + 1;
      den = num + Math.floor(Math.random() * 8) + 1;
      while (gcd(num, den) > 1) den++;
    } else {
      const baseNum = Math.floor(Math.random() * 4) + 1;
      let baseDen = baseNum + Math.floor(Math.random() * 5) + 1;
      while (gcd(baseNum, baseDen) > 1) baseDen++;
      const mult = Math.floor(Math.random() * 3) + 2;
      num = baseNum * mult;
      den = baseDen * mult;
    }
    const g = gcd(num, den);
    const correct = g === 1 ? "ano" : "ne";
    const solutionSteps = g === 1
      ? [`Najdi společného dělitele ${num} a ${den}.`, `Čísla ${num} a ${den} nejdou vydělit žádným stejným číslem (kromě 1).`, `Zlomek ${num}/${den} JE v základním tvaru.`]
      : [`Najdi společného dělitele ${num} a ${den}.`, `Obě čísla jdou vydělit ${g}: ${num}÷${g} = ${num / g}, ${den}÷${g} = ${den / g}.`, `Zlomek ${num}/${den} NENÍ v základním tvaru — dá se zkrátit na ${num / g}/${den / g}.`];
    tasks.push({ question: `Je zlomek ${num}/${den} v základním tvaru?`, correctAnswer: correct, options: ["ano", "ne"], solutionSteps, hints: [`Zkus, jestli čísla ${num} a ${den} jdou vydělit stejným číslem.`, `Zkus dělit ${num} i ${den} dvěma, trojkou, pětkou… Pokud nic nejde, je v základním tvaru.`] });
  }
  return tasks;
}

const HELP_FRAC_REDUCE_SIMPLE: HelpData = { hint: "Krácení je jako zjednodušování — hledáš číslo, kterým jde vydělit horní i spodní číslo zároveň.", steps: ["Podívej se na horní číslo (čitatel) a spodní číslo (jmenovatel).", "Zkus, jestli obě jdou vydělit 2. Pokud ne, zkus 3 nebo 5.", "Vyděl obě čísla stejným číslem.", "Zkontroluj — jdou ještě vydělit? Pokud ne, máš výsledek."], commonMistake: "Pozor — musíš dělit obě čísla! Když vydělíš jen horní číslo a spodní ne, zlomek se změní a nebude správně.", example: "6/10 → obě čísla jdou vydělit 2 → 6÷2 = 3, 10÷2 = 5 → výsledek je 3/5.", visualExamples: [{ label: "Představ si dort rozřezaný na 10 dílků, ze kterých máš 6", fractionBars: [{ fraction: "6/10", numerator: 6, denominator: 10 }, { fraction: "3/5", numerator: 3, denominator: 5 }], conclusion: "6/10 = 3/5 — stejný kousek dortu, jen jinak popsaný" }] };
const HELP_FRAC_REDUCE_FULL: HelpData = { hint: "Najdi největší číslo, kterým jde vydělit horní i spodní číslo najednou. Tak zlomek zkrátíš na základní tvar.", steps: ["Najdi největší společný dělitel horního a spodního čísla.", "Vyděl obě čísla tímto dělitelem.", "Zkontroluj: pokud čitatel a jmenovatel už nejdou vydělit žádným společným číslem (kromě 1), máš základní tvar."], commonMistake: "Někdy zlomek vypadá, že už je zkrácený, ale ještě jde zkrátit. Třeba 12/18 — na první pohled není vidět, ale obě čísla jdou vydělit 6.", example: "12/18 → obě čísla jdou vydělit 6 → 12÷6 = 2, 18÷6 = 3 → výsledek je 2/3.", visualExamples: [{ label: "Dort rozřezaný na 18 dílků, ze kterých máš 12", fractionBars: [{ fraction: "12/18", numerator: 12, denominator: 18 }, { fraction: "2/3", numerator: 2, denominator: 3 }], conclusion: "12/18 = 2/3 — stejný kousek, ale jednodušší zápis" }] };
const HELP_FRAC_IS_REDUCED: HelpData = { hint: "Zlomek je v základním tvaru, když čitatel a jmenovatel nejdou vydělit žádným společným číslem (kromě 1).", steps: ["Zkus, jestli oba čísla (čitatel i jmenovatel) jdou vydělit 2.", "Pokud ne, zkus 3, pak 5, pak 7…", "Pokud žádné společné číslo neexistuje, zlomek je v základním tvaru."], commonMistake: "Pozor — nestačí zkusit jen 2! Třeba 9/15 — nejdou vydělit 2, ale jdou vydělit 3 → 3/5.", example: "Je 8/15 v základním tvaru? 8 = 2×2×2, 15 = 3×5 — nemají společného dělitele → ANO, je v základním tvaru.", visualExamples: [{ label: "Je zlomek v základním tvaru? Zkus dělit!", illustration: "6/10 → jdou oba vydělit 2?\n  6 ÷ 2 = 3 ✅  10 ÷ 2 = 5 ✅\n  → NENÍ v základním tvaru (dá se zkrátit na 3/5)\n\n8/15 → jdou vydělit 2? 8÷2=4 ✅ ale 15÷2=7,5 ❌\n       jdou vydělit 3? 8÷3=? ❌\n       jdou vydělit 5? 8÷5=? ❌\n  → JE v základním tvaru ✅" }] };

export const FRAC_REDUCE_TOPICS: TopicMetadata[] = [
  { id: "frac_reduce_simple", title: "Jednoduchým číslem", subject: "matematika", category: "Zlomky", topic: "Krácení zlomků", topicDescription: "Procvičíš si krácení (zjednodušování) zlomků — od rozpoznání po zkrácení na základní tvar.", briefDescription: "Procvičíš si krácení zlomků jednoduchým číslem (2, 3 nebo 5) — stačí jeden krok.", keywords: ["krácení zlomků jednoduchým číslem", "zkrátit zlomek dvěma", "zkrátit zlomek třemi", "jednoduché krácení zlomků"], goals: ["Naučíš se zkrátit zlomek jednoduchým číslem (2, 3 nebo 5)."], boundaries: ["Pouze kladné zlomky", "Dělitel je 2, 3 nebo 5", "Žádné rozšiřování – pouze krácení", "Žádné sčítání ani odčítání", "Žádná procenta"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction", generator: genFracReduceSimple, helpTemplate: HELP_FRAC_REDUCE_SIMPLE },
  { id: "frac_reduce_full", title: "Na základní tvar", subject: "matematika", category: "Zlomky", topic: "Krácení zlomků", topicDescription: "Procvičíš si krácení (zjednodušování) zlomků — od rozpoznání po zkrácení na základní tvar.", briefDescription: "Naučíš se zkrátit zlomek na základní tvar — najdi největší společný dělitel.", keywords: ["krácení zlomků", "krácení", "zkrátit zlomek", "zkrať zlomek", "základní tvar zlomku", "nejmenší tvar", "krácení na základní tvar"], goals: ["Naučíš se zkrátit zlomek až na základní tvar — najdeš největší číslo, kterým jde dělit čitatel i jmenovatel."], boundaries: ["Pouze kladné zlomky", "Žádná procenta", "Žádné rozšiřování – pouze krácení", "Žádné sčítání ani odčítání"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction", generator: genFracReduceFull, helpTemplate: HELP_FRAC_REDUCE_FULL },
  { id: "frac_is_reduced", title: "Rozpoznání základního tvaru", subject: "matematika", category: "Zlomky", topic: "Krácení zlomků", topicDescription: "Procvičíš si krácení (zjednodušování) zlomků — od rozpoznání po zkrácení na základní tvar.", briefDescription: "Procvičíš si, zda je zlomek v základním tvaru, nebo se dá ještě zkrátit.", keywords: ["základní tvar zlomku rozpoznání", "je zlomek v základním tvaru", "rozpoznat základní tvar"], goals: ["Naučíš se rozpoznat, jestli je zlomek už v základním tvaru nebo se dá ještě zkrátit."], boundaries: ["Pouze kladné zlomky", "Žádné krácení — pouze rozpoznání", "Žádná procenta"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "select_one", generator: genFracIsReduced, helpTemplate: HELP_FRAC_IS_REDUCED },
];
