import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { gcd, lcm } from "./helpers";

function genFracCompareSameDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denoms = level === 1 ? [2, 3, 4, 5] : level === 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 7, 8, 10, 12];
  for (let i = 0; i < 60; i++) {
    const d = denoms[Math.floor(Math.random() * denoms.length)];
    const n1 = Math.floor(Math.random() * (d - 1)) + 1;
    const n2 = Math.floor(Math.random() * (d - 1)) + 1;
    const answer = n1 < n2 ? "<" : n1 > n2 ? ">" : "=";
    const solutionSteps = [`Jmenovatele jsou stejné (${d}).`, `Porovnej čitatele: ${n1} a ${n2}.`, `${n1} ${answer} ${n2}, proto ${n1}/${d} ${answer} ${n2}/${d}.`];
    tasks.push({ question: `${n1}/${d} ___ ${n2}/${d}`, correctAnswer: answer, solutionSteps, hints: [`Podívej se na jmenovatele — oba zlomky mají dole číslo ${d}.`, `Jmenovatele jsou stejné, tak porovnej čitatele: co je větší, ${n1} nebo ${n2}?`] });
  }
  return tasks;
}

function genFracCompareDiffDen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denoms = level === 1 ? [2, 3, 4, 5] : level === 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 7, 8, 10, 12];
  for (let i = 0; i < 60; i++) {
    const d1 = denoms[Math.floor(Math.random() * denoms.length)];
    let d2 = denoms[Math.floor(Math.random() * denoms.length)];
    while (d2 === d1) d2 = denoms[Math.floor(Math.random() * denoms.length)];
    const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    const val1 = n1 / d1;
    const val2 = n2 / d2;
    const answer = val1 < val2 ? "<" : val1 > val2 ? ">" : "=";
    const commonDen = lcm(d1, d2);
    const en1 = n1 * (commonDen / d1);
    const en2 = n2 * (commonDen / d2);
    const solutionSteps = [
      `Jmenovatele jsou různé (${d1} a ${d2}), najdi společný jmenovatel.`,
      `Nejmenší společný násobek ${d1} a ${d2} je ${commonDen}.`,
      `Rozšiř: ${n1}/${d1} = ${en1}/${commonDen}, ${n2}/${d2} = ${en2}/${commonDen}.`,
      `Porovnej čitatele: ${en1} ${answer} ${en2}.`,
      `Proto ${n1}/${d1} ${answer} ${n2}/${d2}.`,
    ];
    tasks.push({ question: `${n1}/${d1} ___ ${n2}/${d2}`, correctAnswer: answer, solutionSteps, hints: [`Jmenovatele ${d1} a ${d2} jsou různé — musíš najít společný jmenovatel.`, `Najdi číslo, které je násobkem ${d1} i ${d2}, a oba zlomky na něj rozšiř.`] });
  }
  return tasks;
}

function genFracCompareWhole(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denoms = level === 1 ? [2, 3, 4] : level === 2 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 10];
  for (let i = 0; i < 60; i++) {
    const den = denoms[Math.floor(Math.random() * denoms.length)];
    const whole = Math.floor(Math.random() * 3) + 1;
    const baseNum = whole * den;
    const offset = Math.floor(Math.random() * 3) - 1;
    const num = Math.max(1, baseNum + offset);
    const val = num / den;
    const answer = val < whole ? "<" : val > whole ? ">" : "=";
    const solutionSteps = [
      `Převeď celé číslo ${whole} na zlomek se jmenovatelem ${den}: ${whole} = ${whole * den}/${den}.`,
      `Porovnej čitatele: ${num} a ${whole * den}.`,
      `${num} ${answer} ${whole * den}, proto ${num}/${den} ${answer} ${whole}.`,
    ];
    tasks.push({ question: `${num}/${den} ___ ${whole}`, correctAnswer: answer, solutionSteps, hints: [`Převeď celé číslo ${whole} na zlomek se jmenovatelem ${den}.`, `${whole} = ${whole * den}/${den}. Teď porovnej čitatele: ${num} a ${whole * den}.`] });
  }
  return tasks;
}

const HELP_FRAC_COMPARE_SAME: HelpData = {
  hint: "Když mají zlomky stejný jmenovatel, dílky jsou stejně velké. Stačí spočítat, kdo má víc dílků.",
  steps: ["Podívej se na jmenovatele (spodní čísla) — jsou stejné?", "Když ano, porovnej čitatele (horní čísla).", "Kdo má větší čitatel, ten má větší zlomek."],
  commonMistake: "Někdy si děti myslí, že větší číslo dole (jmenovatel) znamená větší zlomek. Ale tady mají oba zlomky stejný jmenovatel, takže rozhoduje horní číslo (čitatel).",
  example: "3/5 a 2/5 → oba mají pětiny (stejné dílky). 3 dílky je víc než 2 dílky, takže 3/5 > 2/5.",
  visualExamples: [{ label: "Představ si pizzu rozřezanou na 5 stejných dílků", fractionBars: [{ fraction: "3/5", numerator: 3, denominator: 5 }, { fraction: "2/5", numerator: 2, denominator: 5 }], conclusion: "3/5  >  2/5 — tři dílky jsou víc než dva dílky" }],
};

const HELP_FRAC_COMPARE_DIFF: HelpData = {
  hint: "Když mají zlomky různé jmenovatele, dílky jsou různě velké — nejde je přímo porovnat. Musíš je převést na stejně velké dílky.",
  steps: ["Najdi číslo, které je násobkem obou jmenovatelů (společný jmenovatel). Třeba pro 3 a 4 je to 12.", "Rozšiř oba zlomky, aby měly tento společný jmenovatel.", "Teď mají stejné dílky — porovnej čitatele (horní čísla)."],
  commonMistake: "Velká chyba je porovnávat horní čísla, když spodní čísla jsou různá. Třeba 1/3 vypadá stejně jako 1/4, ale třetina je ve skutečnosti větší než čtvrtina!",
  example: "1/3 a 1/4 → společný jmenovatel je 12 → 1/3 = 4/12 a 1/4 = 3/12 → 4 dílků > 3 dílků, takže 1/3 > 1/4.",
  visualExamples: [
    { label: "Původní zlomky — dílky jsou různě velké", fractionBars: [{ fraction: "1/3", numerator: 1, denominator: 3 }, { fraction: "1/4", numerator: 1, denominator: 4 }], conclusion: "Třetiny a čtvrtiny jsou různě velké — nejde je přímo porovnat" },
    { label: "Po převodu na společný jmenovatel (dvanáctiny)", fractionBars: [{ fraction: "4/12", numerator: 4, denominator: 12 }, { fraction: "3/12", numerator: 3, denominator: 12 }], conclusion: "1/3 = 4/12  a  1/4 = 3/12 → 4 dílků > 3 dílků, takže 1/3 > 1/4" },
  ],
};

const HELP_FRAC_COMPARE_WHOLE: HelpData = {
  hint: "Celé číslo převeď na zlomek se stejným jmenovatelem — pak porovnej čitatele.",
  steps: ["Podívej se na jmenovatel zlomku.", "Převeď celé číslo na zlomek s tímto jmenovatelem (vynásob celé číslo jmenovatelem).", "Porovnej čitatele obou zlomků."],
  commonMistake: "Nezapomeň násobit! Třeba 2 = 2×3/3 = 6/3. Pak teprve porovnávej s daným zlomkem.",
  example: "7/4 ___ 2 → 2 = 8/4 → porovnej 7 a 8 → 7 < 8 → 7/4 < 2.",
  visualExamples: [{ label: "7/4 vs 2 — převeď dvojku na čtvrtiny", fractionBars: [{ fraction: "7/4", numerator: 7, denominator: 4 }, { fraction: "8/4", numerator: 8, denominator: 4 }], conclusion: "2 = 8/4 → 7 čtvrtin < 8 čtvrtin → 7/4 < 2" }],
};

export const FRAC_COMPARE_TOPICS: TopicMetadata[] = [
  {
    id: "frac_compare_same_den", title: "Se stejným jmenovatelem", subject: "matematika", category: "Zlomky", topic: "Porovnávání zlomků",
    topicDescription: "Procvičíš si porovnávání zlomků — se stejným i s různým jmenovatelem i s celým číslem.",
    briefDescription: "Procvičíš si porovnávání zlomků, které mají stejný jmenovatel — stačí porovnat čitatele.",
    keywords: ["porovnávání zlomků se stejným jmenovatelem", "zlomky stejný jmenovatel", "porovnat zlomky stejný", "který zlomek je větší stejný jmenovatel"],
    goals: ["Naučíš se porovnat dva zlomky se stejným jmenovatelem — stačí porovnat horní čísla (čitatele)."],
    boundaries: ["Pouze kladné zlomky", "Pouze stejný jmenovatel", "Žádná desetinná čísla", "Žádná procenta", "Žádné smíšené čísla", "Žádné sčítání ani odčítání zlomků"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "comparison",
    generator: genFracCompareSameDen, helpTemplate: HELP_FRAC_COMPARE_SAME,
  },
  {
    id: "frac_compare_diff_den", title: "S různým jmenovatelem", subject: "matematika", category: "Zlomky", topic: "Porovnávání zlomků",
    topicDescription: "Procvičíš si porovnávání zlomků — se stejným i s různým jmenovatelem i s celým číslem.",
    briefDescription: "Naučíš se porovnat zlomky s různými jmenovateli — musíš je rozšířit na společný jmenovatel.",
    keywords: ["porovnávání zlomků s různým jmenovatelem", "zlomky různý jmenovatel", "porovnat zlomky různý", "porovnávání zlomků", "porovnat zlomky", "který zlomek je větší", "který zlomek je menší", "porovnej zlomky", "větší zlomek", "menší zlomek"],
    goals: ["Naučíš se porovnat dva zlomky s různými jmenovateli — nejdřív je převedeš na společný jmenovatel."],
    boundaries: ["Pouze kladné zlomky", "Pouze různé jmenovatele", "Žádná desetinná čísla", "Žádná procenta", "Žádné smíšené čísla", "Žádné sčítání ani odčítání zlomků"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "comparison",
    generator: genFracCompareDiffDen, helpTemplate: HELP_FRAC_COMPARE_DIFF,
  },
  {
    id: "frac_compare_whole", title: "S celým číslem", subject: "matematika", category: "Zlomky", topic: "Porovnávání zlomků",
    topicDescription: "Procvičíš si porovnávání zlomků — se stejným i s různým jmenovatelem i s celým číslem.",
    briefDescription: "Procvičíš si porovnávání zlomku s celým číslem — převeď celé číslo na zlomek.",
    keywords: ["porovnání zlomku s celým číslem", "zlomek a celé číslo", "porovnat zlomek celé číslo"],
    goals: ["Naučíš se porovnat zlomek s celým číslem — převedeš celé číslo na zlomek se stejným jmenovatelem."],
    boundaries: ["Pouze kladné zlomky a celá čísla", "Žádná procenta", "Žádné smíšené čísla", "Žádné sčítání ani odčítání"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "comparison",
    generator: genFracCompareWhole, helpTemplate: HELP_FRAC_COMPARE_WHOLE,
  },
];
