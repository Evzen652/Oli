import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

function genFracExpandByNumber(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const multipliers = level === 1 ? [2, 3] : level === 2 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6];
  for (let i = 0; i < 60; i++) {
    const num = Math.floor(Math.random() * 4) + 1;
    const den = Math.floor(Math.random() * 5) + num + 1;
    const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
    const resultNum = num * mult;
    const resultDen = den * mult;
    tasks.push({ question: `Rozšiř zlomek ${num}/${den} číslem ${mult}`, correctAnswer: `${resultNum}/${resultDen}`, solutionSteps: [`Rozšiřujeme číslem ${mult} — vynásob horní i spodní číslo.`, `Čitatel: ${num} × ${mult} = ${resultNum}.`, `Jmenovatel: ${den} × ${mult} = ${resultDen}.`, `Výsledek: ${resultNum}/${resultDen}.`], hints: [`Rozšířit číslem ${mult} znamená vynásobit horní i spodní číslo číslem ${mult}.`, `Vynásob ${num} × ${mult} a ${den} × ${mult}.`] });
  }
  return tasks;
}

function genFracExpandToTarget(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const multipliers = level === 1 ? [2, 3] : level === 2 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6];
  for (let i = 0; i < 60; i++) {
    const num = Math.floor(Math.random() * 4) + 1;
    const den = Math.floor(Math.random() * 5) + num + 1;
    const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
    const targetDen = den * mult;
    const resultNum = num * mult;
    tasks.push({ question: `Rozšiř zlomek ${num}/${den} na jmenovatele ${targetDen}`, correctAnswer: `${resultNum}/${targetDen}`, solutionSteps: [`Zjisti, jakým číslem vynásobit ${den}, abys dostal ${targetDen}.`, `${den} × ${mult} = ${targetDen} — násobíme číslem ${mult}.`, `Stejným číslem vynásob čitatel: ${num} × ${mult} = ${resultNum}.`, `Výsledek: ${resultNum}/${targetDen}.`], hints: [`Jakým číslem musíš vynásobit ${den}, aby vyšlo ${targetDen}?`, `Stejným číslem pak vynásob i čitatel ${num}.`] });
  }
  return tasks;
}

const HELP_FRAC_EXPAND_BY: HelpData = { hint: "Rozšiřování je opak krácení — vynásob horní i spodní číslo stejným číslem. Zlomek bude vypadat jinak, ale jeho hodnota zůstane stejná.", steps: ["Přečti si, jakým číslem máš rozšířit.", "Vynásob horní číslo (čitatel) tímto číslem.", "Vynásob spodní číslo (jmenovatel) tímto číslem.", "Zapiš nový zlomek."], commonMistake: "Pozor — musíš násobit obě čísla! Když vynásobíš jen jedno, zlomek se změní a nebude správně.", example: "Rozšiř 2/5 číslem 3 → čitatel: 2×3 = 6, jmenovatel: 5×3 = 15 → výsledek je 6/15.", visualExamples: [{ label: "Představ si dort: 2 z 5 dílků = 6 z 15 dílků", fractionBars: [{ fraction: "2/5", numerator: 2, denominator: 5 }, { fraction: "6/15", numerator: 6, denominator: 15 }], conclusion: "2/5 = 6/15 — stejný kousek dortu, jen jinak rozřezaný" }] };
const HELP_FRAC_EXPAND_TARGET: HelpData = { hint: "Musíš zjistit, jakým číslem vynásobit spodní číslo, aby se dostal na požadovaný jmenovatel. Pak stejným číslem vynásob i horní číslo.", steps: ["Zjisti, jakým číslem musíš vynásobit spodní číslo (jmenovatel), aby vyšel požadovaný.", "Stejným číslem vynásob i horní číslo (čitatel).", "Zkontroluj výsledek — nový zlomek má mít požadovaný jmenovatel."], commonMistake: "Pozor — musíš násobit obě čísla stejným číslem! Když vynásobíš jen spodní číslo, zlomek se změní.", example: "2/3 na jmenovatele 12 → 3×4 = 12, takže i čitatel ×4 → 2×4 = 8 → výsledek je 8/12.", visualExamples: [{ label: "Dort rozřezaný na 3 dílky vs. na 12 dílků", fractionBars: [{ fraction: "2/3", numerator: 2, denominator: 3 }, { fraction: "8/12", numerator: 8, denominator: 12 }], conclusion: "2/3 = 8/12 — stejný kousek, jen víc dílků" }] };

export const FRAC_EXPAND_TOPICS: TopicMetadata[] = [
  { id: "frac_expand_by", title: "Daným číslem", subject: "matematika", category: "Zlomky", topic: "Rozšiřování zlomků", topicDescription: "Procvičíš si rozšiřování zlomků — násobením daným číslem i na zadaný jmenovatel.", briefDescription: "Procvičíš si rozšiřování zlomků konkrétním číslem — vynásob čitatel i jmenovatel.", keywords: ["rozšiřování zlomků číslem", "rozšířit zlomek číslem", "rozšíření daným číslem", "rozšiř číslem"], goals: ["Naučíš se rozšířit zlomek daným číslem — vynásobíš horní i dolní číslo stejným číslem."], boundaries: ["Pouze kladné zlomky", "Žádná procenta", "Žádné krácení – pouze rozšiřování", "Žádné sčítání ani odčítání"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction", generator: genFracExpandByNumber, helpTemplate: HELP_FRAC_EXPAND_BY },
  { id: "frac_expand_target", title: "Na zadaný jmenovatel", subject: "matematika", category: "Zlomky", topic: "Rozšiřování zlomků", topicDescription: "Procvičíš si rozšiřování zlomků — násobením daným číslem i na zadaný jmenovatel.", briefDescription: "Naučíš se rozšířit zlomek tak, aby měl požadovaný jmenovatel.", keywords: ["rozšiřování zlomků", "rozšiřování", "rozšířit zlomek", "rozšíření zlomku", "společný jmenovatel", "rozšiř na jmenovatele", "na zadaný jmenovatel"], goals: ["Naučíš se rozšířit zlomek tak, aby měl zadaný jmenovatel."], boundaries: ["Pouze kladné zlomky", "Žádná procenta", "Žádné krácení – pouze rozšiřování", "Žádné sčítání ani odčítání"], gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "fraction", generator: genFracExpandToTarget, helpTemplate: HELP_FRAC_EXPAND_TARGET },
];
